import express from "express";
import {
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getBudgetProgress,
} from "../controllers/budgetController";
import { authenticate } from "../middleware/authMiddleware";

const router = express.Router();

router.use(authenticate);

router.get("/", getBudgets);
router.post("/", createBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);
router.get("/progress", getBudgetProgress);

export default router;
