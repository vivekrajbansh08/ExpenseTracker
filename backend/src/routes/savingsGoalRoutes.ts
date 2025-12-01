import express from 'express';
import {
  getSavingsGoals,
  getSavingsGoal,
  createSavingsGoal,
  updateSavingsGoal,
  addProgress,
  completeSavingsGoal,
  deleteSavingsGoal,
  getSavingsStats,
} from '../controllers/savingsGoalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getSavingsGoals).post(createSavingsGoal);
router.get('/stats', getSavingsStats);
router.route('/:id').get(getSavingsGoal).put(updateSavingsGoal).delete(deleteSavingsGoal);
router.put('/:id/progress', addProgress);
router.put('/:id/complete', completeSavingsGoal);

export default router;
