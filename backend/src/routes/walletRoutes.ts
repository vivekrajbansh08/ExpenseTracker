import express from 'express';
import {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  transferBetweenWallets,
} from '../controllers/walletController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getWallets).post(createWallet);
router.route('/:id').get(getWallet).put(updateWallet).delete(deleteWallet);
router.post('/transfer', transferBetweenWallets);

export default router;
