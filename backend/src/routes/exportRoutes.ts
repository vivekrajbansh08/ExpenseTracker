import express from 'express';
import { exportToCSV, exportToPDF } from '../controllers/exportController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/csv', exportToCSV);
router.get('/pdf', exportToPDF);

export default router;
