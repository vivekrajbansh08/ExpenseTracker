import express from "express";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getStatistics,
} from "../controllers/expenseController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
router.get("/statistics", getStatistics);

export default router;
