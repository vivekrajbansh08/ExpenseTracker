import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Transaction from "../models/Transaction";
import mongoose from "mongoose";

export const getTransactions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { type, category, startDate, endDate } = req.query;

    const filter: any = { user: req.userId };

    const { month, year } = req.query;

    // Convert userId to ObjectId - THIS IS CRITICAL
    const userId = new mongoose.Types.ObjectId(req.userId);

    const matchStage: any = { user: userId };

    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate as string);
      if (endDate) filter.date.$lte = new Date(endDate as string);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });

    res.json({ success: true, data: transactions });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.json({ success: true, data: transaction });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!transaction) {
      res.status(404).json({ message: "Transaction not found" });
      return;
    }

    res.json({ success: true, message: "Transaction deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getStatistics = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { month, year } = req.query;

    // Convert userId to ObjectId for aggregation
    const userId = new mongoose.Types.ObjectId(req.userId);

    const matchStage: any = { user: userId };

    if (month && year) {
      const startDate = new Date(Number(year), Number(month) - 1, 1);
      const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

      matchStage.date = {
        $gte: startDate,
        $lte: endDate,
      };

      // Debug logging
      console.log("Statistics Query:", {
        month: Number(month),
        year: Number(year),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId: userId.toString(),
      });
    }

    // Get summary by type (income/expense)
    const stats = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get category breakdown for expenses
    const categoryStats = await Transaction.aggregate([
      { $match: { ...matchStage, type: "expense" } },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    // Debug logging
    console.log("Statistics Results:", {
      summaryCount: stats.length,
      categoryCount: categoryStats.length,
      summary: stats,
      categories: categoryStats,
    });

    res.json({
      success: true,
      data: {
        summary: stats,
        categoryBreakdown: categoryStats,
      },
    });
  } catch (error: any) {
    console.error("Statistics Error:", error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};
