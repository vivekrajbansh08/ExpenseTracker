import express from 'express';
import {
  getSpendingTrends,
  getCategoryInsights,
  getPredictions,
  getTimeframeAnalysis,
  getOverspendingAlerts,
} from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/spending-trends', getSpendingTrends);
router.get('/category-insights', getCategoryInsights);
router.get('/predictions', getPredictions);
router.get('/timeframe', getTimeframeAnalysis);
router.get('/alerts', getOverspendingAlerts);

export default router;
