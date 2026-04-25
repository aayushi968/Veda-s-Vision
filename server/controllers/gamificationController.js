import { Timestamp } from 'firebase-admin/firestore';
import { getFirestore } from '../utils/firebaseAdmin.js';

// Daily challenges pool
const challengesPool = [
  { id: 1, title: 'Drink warm herbal water', description: 'Start your day with warm water before breakfast', xp: 80 },
  { id: 2, title: 'Meditate for 5 minutes', description: 'Practice mindfulness or breathing exercises', xp: 100 },
  { id: 3, title: 'Oil massage (Abhyanga)', description: 'Perform a 10-minute self-massage with warm oil', xp: 120 },
  { id: 4, title: 'Eat mindfully', description: 'Have at least one meal without distractions', xp: 90 },
  { id: 5, title: 'Yoga or stretching', description: 'Practice 15 minutes of yoga or stretching', xp: 110 },
  { id: 6, title: 'Sleep on time', description: 'Sleep by 10 PM for proper rest', xp: 100 },
  { id: 7, title: 'Ayurvedic tea ritual', description: 'Prepare and drink Ayurvedic herbal tea', xp: 85 },
  { id: 8, title: 'Digital detox', description: 'Stay away from screens for 1 hour before bed', xp: 95 },
];

// Badge definitions with achievement criteria
const badgeDefinitions = [
  {
    id: 'returning_healer',
    name: 'Returning Healer',
    emoji: '🏥',
    description: 'Sign in to your account',
    criteria: 'user_signed_in',
  },
  {
    id: 'quest_starter',
    name: 'Quest Starter',
    emoji: '🌿',
    description: 'Complete your first assessment',
    criteria: 'first_assessment',
    threshold: 1,
  },
  {
    id: 'knowledge_seeker',
    name: 'Knowledge Seeker',
    emoji: '📖',
    description: 'Complete 5 assessments',
    criteria: 'assessment_count',
    threshold: 5,
  },
  {
    id: 'wise_healer',
    name: 'Wise Healer',
    emoji: '🧙',
    description: 'Complete 10 assessments',
    criteria: 'assessment_count',
    threshold: 10,
  },
  {
    id: 'daily_devoted',
    name: 'Daily Devoted',
    emoji: '🔥',
    description: 'Complete 5 daily challenges',
    criteria: 'challenge_count',
    threshold: 5,
  },
  {
    id: 'challenge_master',
    name: 'Challenge Master',
    emoji: '👑',
    description: 'Complete 20 daily challenges',
    criteria: 'challenge_count',
    threshold: 20,
  },
  {
    id: '7_day_streak',
    name: '7-Day Healer',
    emoji: '🌟',
    description: 'Maintain a 7-day challenge streak',
    criteria: 'streak',
    threshold: 7,
  },
  {
    id: 'meditation_master',
    name: 'Meditation Master',
    emoji: '🧘',
    description: 'Complete meditation challenge 5 times',
    criteria: 'challenge_specific',
    challenge: 'Meditate for 5 minutes',
    threshold: 5,
  },
];

// Get today's challenge (deterministic based on date)
function getTodaysChallenge() {
  const date = new Date();
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const challengeIndex = dayOfYear % challengesPool.length;
  return challengesPool[challengeIndex];
}

// Calculate XP level based on total XP
function calculateLevel(totalXp) {
  const xpPerLevel = 200;
  return Math.floor(totalXp / xpPerLevel) + 1;
}

export async function getUserStats(req, res) {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid query.' });
    }

    const firestore = getFirestore();

    // Get user stats
    const userStatsDoc = await firestore.collection('userStats').doc(uid).get();
    let userStats = userStatsDoc.exists ? userStatsDoc.data() : { xp: 0, testCount: 0, streak: 0, earnedBadges: [] };

    // Get assessment count and dominant dosha
    const assessmentsSnapshot = await firestore.collection('assessments').where('userId', '==', uid).get();
    const assessmentCount = assessmentsSnapshot.size;
    let dominantDosha = null;

    if (assessmentCount > 0) {
      // Get most recent assessment
      const latestAssessment = assessmentsSnapshot.docs
        .map((doc) => ({ ...doc.data(), createdAt: doc.data().createdAt?.seconds || 0 }))
        .sort((a, b) => b.createdAt - a.createdAt)[0];

      dominantDosha = latestAssessment.dominantDosha;
      userStats.testCount = assessmentCount;
    }

    const level = calculateLevel(userStats.xp);

    return res.json({
      xp: userStats.xp,
      level,
      testCount: userStats.testCount,
      streak: userStats.streak,
      dominantDosha,
      earnedBadges: userStats.earnedBadges || [],
      nextLevelXp: (level * 200) - userStats.xp,
    });
  } catch (error) {
    console.error('User stats error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to fetch user stats.' });
  }
}

export async function getTodayChallenge(req, res) {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid query.' });
    }

    const firestore = getFirestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's challenge from the pool
    const todaysChallenge = getTodaysChallenge();

    // Check if user has completed today's challenge
    const challengeLogDoc = await firestore.collection('challengeLogs').doc(uid).get();
    const challengeLog = challengeLogDoc.exists ? challengeLogDoc.data() : { completedDates: [], currentStreak: 0 };

    const completedToday = challengeLog.completedDates?.some(
      (date) => new Date(date.seconds * 1000).toDateString() === today.toDateString()
    ) || false;

    return res.json({
      challenge: todaysChallenge,
      completedToday,
      currentStreak: challengeLog.currentStreak || 0,
    });
  } catch (error) {
    console.error('Challenge fetch error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to fetch today challenge.' });
  }
}

export async function completeChallenge(req, res) {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid.' });
    }

    const firestore = getFirestore();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysChallenge = getTodaysChallenge();

    // Check if already completed today
    const challengeLogDoc = await firestore.collection('challengeLogs').doc(uid).get();
    const challengeLog = challengeLogDoc.exists ? challengeLogDoc.data() : { completedDates: [], currentStreak: 0 };

    const alreadyCompleted = challengeLog.completedDates?.some(
      (date) => new Date(date.seconds * 1000).toDateString() === today.toDateString()
    ) || false;

    if (alreadyCompleted) {
      return res.status(400).json({ error: 'Already completed today challenge.' });
    }

    // Calculate new streak
    let newStreak = 1;
    if (challengeLog.completedDates && challengeLog.completedDates.length > 0) {
      const lastCompletedDate = new Date(challengeLog.completedDates[challengeLog.completedDates.length - 1].seconds * 1000);
      lastCompletedDate.setHours(0, 0, 0, 0);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastCompletedDate.toDateString() === yesterday.toDateString()) {
        newStreak = (challengeLog.currentStreak || 1) + 1;
      }
    }

    // Update challenge log
    await firestore.collection('challengeLogs').doc(uid).set({
      completedDates: [...(challengeLog.completedDates || []), Timestamp.now()],
      currentStreak: newStreak,
      lastCompletedChallenge: todaysChallenge.id,
    });

    // Update user stats with XP
    const userStatsDoc = await firestore.collection('userStats').doc(uid).get();
    const userStats = userStatsDoc.exists ? userStatsDoc.data() : { xp: 0, testCount: 0, earnedBadges: [] };
    const newXp = (userStats.xp || 0) + todaysChallenge.xp;

    await firestore.collection('userStats').doc(uid).set({
      xp: newXp,
      testCount: userStats.testCount || 0,
      streak: newStreak,
      earnedBadges: userStats.earnedBadges || [],
      lastUpdated: Timestamp.now(),
    });

    // Check for badge achievements
    const newBadges = await checkBadgeAchievements(uid, { xp: newXp, challengeCount: challengeLog.completedDates.length + 1, streak: newStreak });

    return res.json({
      xp: todaysChallenge.xp,
      totalXp: newXp,
      streak: newStreak,
      newBadges,
      level: calculateLevel(newXp),
    });
  } catch (error) {
    console.error('Challenge completion error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to complete challenge.' });
  }
}

export async function getBadges(req, res) {
  try {
    const { uid } = req.query;
    if (!uid) {
      return res.status(400).json({ error: 'Missing uid query.' });
    }

    const firestore = getFirestore();

    // Get user earned badges
    const userStatsDoc = await firestore.collection('userStats').doc(uid).get();
    const earnedBadgeIds = userStatsDoc.exists ? (userStatsDoc.data().earnedBadges || []) : [];

    // Combine earned badges with definitions
    const badges = badgeDefinitions.map((badge) => ({
      ...badge,
      earned: earnedBadgeIds.includes(badge.id),
    }));

    return res.json({ badges });
  } catch (error) {
    console.error('Badges fetch error:', error?.message || error);
    return res.status(500).json({ error: 'Unable to fetch badges.' });
  }
}

// Helper function to check badge achievements
async function checkBadgeAchievements(uid, stats) {
  const firestore = getFirestore();
  const userStatsDoc = await firestore.collection('userStats').doc(uid).get();
  const earnedBadges = userStatsDoc.exists ? (userStatsDoc.data().earnedBadges || []) : [];
  const newBadges = [];

  // Check each badge criteria
  for (const badge of badgeDefinitions) {
    if (earnedBadges.includes(badge.id)) continue; // Already earned

    let achieved = false;

    if (badge.criteria === 'user_signed_in') {
      achieved = true;
    } else if (badge.criteria === 'first_assessment' && stats.testCount >= 1) {
      achieved = true;
    } else if (badge.criteria === 'assessment_count' && stats.testCount >= badge.threshold) {
      achieved = true;
    } else if (badge.criteria === 'challenge_count' && stats.challengeCount >= badge.threshold) {
      achieved = true;
    } else if (badge.criteria === 'streak' && stats.streak >= badge.threshold) {
      achieved = true;
    }

    if (achieved) {
      earnedBadges.push(badge.id);
      newBadges.push(badge);
    }
  }

  // Save updated earned badges
  if (newBadges.length > 0) {
    await firestore.collection('userStats').doc(uid).update({
      earnedBadges,
    });
  }

  return newBadges;
}
