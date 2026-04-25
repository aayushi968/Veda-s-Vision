import express from 'express';
import {
  getUserStats,
  getTodayChallenge,
  completeChallenge,
  getBadges,
} from '../controllers/gamificationController.js';

const router = express.Router();

// Get user stats (XP, level, test count, dominant dosha, streak)
router.get('/stats', getUserStats);

// Get today's daily challenge
router.get('/challenge', getTodayChallenge);

// Complete today's challenge and earn XP
router.post('/challenge/complete', completeChallenge);

// Get all badges and user's earned badges
router.get('/badges', getBadges);

export default router;
