import { Router } from 'express';
import { getFirestore } from '../utils/firebaseAdmin.js';

const router = Router();

router.post('/profile', async (req, res) => {
  const { uid, name, age, gender, contact, service } = req.body;
  if (!uid || !name || !age || !gender || !contact) {
    return res.status(400).json({ error: 'uid, name, age, gender, and contact are required.' });
  }
  try {
    const db = getFirestore();
    await db.collection('users').doc(uid).set({ name, age, gender, contact, service: service || '' }, { merge: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/profile', async (req, res) => {
  const { uid } = req.query;
  if (!uid) return res.status(400).json({ error: 'uid is required.' });
  try {
    const db = getFirestore();
    const doc = await db.collection('users').doc(uid).get();
    res.json(doc.exists ? doc.data() : {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
