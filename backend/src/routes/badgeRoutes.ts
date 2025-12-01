import express from 'express';
import { getBadges, checkAndAwardBadges, getLeaderboard } from '../controllers/badgeController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getBadges);
router.post('/check', checkAndAwardBadges);
router.get('/leaderboard', getLeaderboard);

export default router;
