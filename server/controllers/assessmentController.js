import { Timestamp } from 'firebase-admin/firestore';
import { getFirestore } from '../utils/firebaseAdmin.js';
import { buildAssessmentReport } from '../utils/assessmentReport.js';

export async function submitAssessment(req, res) {
  try {
    const { userId, answers, scores, dominantDosha } = req.body;
    if (!userId || !answers || !scores || !dominantDosha) {
      return res.status(400).json({ error: 'Missing assessment payload.' });
    }

    const report = buildAssessmentReport({ answers, scores, dominantDosha });

    const firestore = getFirestore();
    const docRef = await firestore.collection('assessments').add({
      userId,
      answers,
      scores,
      dominantDosha,
      report,
      recommendations: report.recommendations,
      createdAt: Timestamp.now(),
    });

    // Update user stats
    const userStatsDoc = await firestore.collection('userStats').doc(userId).get();
    const userStats = userStatsDoc.exists ? userStatsDoc.data() : { xp: 0, testCount: 0, earnedBadges: [] };
    const newTestCount = (userStats.testCount || 0) + 1;
    const earnedBadges = userStats.earnedBadges || [];

    // Award first assessment badge
    if (newTestCount === 1 && !earnedBadges.includes('quest_starter')) {
      earnedBadges.push('quest_starter');
    }

    // Award milestone badges
    if (newTestCount === 5 && !earnedBadges.includes('knowledge_seeker')) {
      earnedBadges.push('knowledge_seeker');
    }
    if (newTestCount === 10 && !earnedBadges.includes('wise_healer')) {
      earnedBadges.push('wise_healer');
    }

    await firestore.collection('userStats').doc(userId).set({
      xp: userStats.xp || 0,
      testCount: newTestCount,
      streak: userStats.streak || 0,
      earnedBadges,
      lastUpdated: Timestamp.now(),
    });

    return res.json({ id: docRef.id, dominantDosha, scores, report, recommendations: report.recommendations, answers });
  } catch (error) {
    console.error('Assessment error:', error?.message || error);

    const message = error?.message || '';
    if (message.includes('AI_API_KEY') || message.includes('OPENAI_API_KEY')) {
      return res.status(500).json({ error: 'AI credentials are missing on the server.' });
    }

    if (message.toLowerCase().includes('firestore api has not been used') || message.toLowerCase().includes('permission_denied') || message.toLowerCase().includes('cloud firestore api')) {
      return res.status(500).json({
        error:
          'Cloud Firestore is not enabled or authorized for this Firebase project. Enable Firestore API in Google Cloud Console and retry.',
      });
    }

    return res.status(500).json({ error: 'Assessment submission failed.' });
  }
}

export async function getHistory(req, res) {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid query.' });
    }

    const firestore = getFirestore();
    const snapshot = await firestore.collection('assessments').where('userId', '==', uid).get();
    const data = snapshot.docs
      .map((doc) => {
        const d = { id: doc.id, ...doc.data() };
        // Rebuild report if saved with old schema (missing diseases/herbs)
        if (!d.report?.diseases) {
          d.report = buildAssessmentReport({ answers: d.answers || [], scores: d.scores || {}, dominantDosha: d.dominantDosha || 'vata' });
        }
        return d;
      })
      .sort((a, b) => (b.createdAt?.seconds || b.createdAt?._seconds || 0) - (a.createdAt?.seconds || a.createdAt?._seconds || 0));
    return res.json({ history: data });
  } catch (error) {
    console.error('History error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to fetch history.' });
  }
}
