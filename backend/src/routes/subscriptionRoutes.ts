import express from 'express';
import {
  getSubscriptions,
  getSubscription,
  createSubscription,
  updateSubscription,
  cancelSubscription,
  getUpcomingBills,
  getSubscriptionStats,
} from '../controllers/subscriptionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getSubscriptions).post(createSubscription);
router.get('/upcoming', getUpcomingBills);
router.get('/stats', getSubscriptionStats);
router.route('/:id').get(getSubscription).put(updateSubscription).delete(cancelSubscription);

export default router;
