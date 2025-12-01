import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  createNotification,
} from '../controllers/notificationController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getNotifications).post(createNotification);
router.put('/read-all', markAllAsRead);
router.route('/:id').delete(deleteNotification);
router.put('/:id/read', markAsRead);

export default router;
