import express from 'express';
import {
  getExpenseShares,
  getExpenseShare,
  createExpenseShare,
  updateExpenseShare,
  settleSplit,
  getBalances,
  deleteExpenseShare,
} from '../controllers/expenseShareController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.route('/').get(getExpenseShares).post(createExpenseShare);
router.get('/balances', getBalances);
router.route('/:id').get(getExpenseShare).put(updateExpenseShare).delete(deleteExpenseShare);
router.put('/:id/settle', settleSplit);

export default router;
