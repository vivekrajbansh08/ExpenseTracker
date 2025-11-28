// import { Response } from "express";
// import { AuthRequest } from "../middleware/authMiddleware";
// import Budget from "../models/Budget";
// import Transaction from "../models/Transaction";

// export const getBudgets = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const { month, year } = req.query;

//     const filter: any = { user: req.userId };
//     if (month) filter.month = Number(month);
//     if (year) filter.year = Number(year);

//     const budgets = await Budget.find(filter);

//     res.json({ success: true, data: budgets });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createBudget = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const budget = await Budget.create({
//       ...req.body,
//       user: req.userId,
//     });

//     res.status(201).json({ success: true, data: budget });
//   } catch (error: any) {
//     if (error.code === 11000) {
//       res.status(400).json({
//         message: "Budget for this category and month already exists",
//       });
//       return;
//     }
//     res.status(500).json({ message: error.message });
//   }
// };

// export const updateBudget = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const budget = await Budget.findOneAndUpdate(
//       { _id: req.params.id, user: req.userId },
//       req.body,
//       { new: true, runValidators: true }
//     );

//     if (!budget) {
//       res.status(404).json({ message: "Budget not found" });
//       return;
//     }

//     res.json({ success: true, data: budget });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const deleteBudget = async (req: AuthRequest, res: Response): Promise<void> => {
//   try {
//     const budget = await Budget.findOneAndDelete({
//       _id: req.params.id,
//       user: req.userId,
//     });

//     if (!budget) {
//       res.status(404).json({ message: "Budget not found" });
//       return;
//     }

//     res.json({ success: true, message: "Budget deleted" });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getBudgetProgress = async (
//   req: AuthRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { month, year } = req.query;

//     const budgets = await Budget.find({
//       user: req.userId,
//       month: Number(month),
//       year: Number(year),
//     });

//     const startDate = new Date(Number(year), Number(month) - 1, 1);
//     const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59);

//     const progress = await Promise.all(
//       budgets.map(async (budget) => {
//         const spent = await Transaction.aggregate([
//           {
//             $match: {
//               user: req.userId,
//               type: "expense",
//               category: budget.category,
//               date: { $gte: startDate, $lte: endDate },
//             },
//           },
//           {
//             $group: {
//               _id: null,
//               total: { $sum: "$amount" },
//             },
//           },
//         ]);

//         const spentAmount = spent.length > 0 ? spent[0].total : 0;
//         const percentage = (spentAmount / budget.amount) * 100;

//         return {
//           budget: budget,
//           spent: spentAmount,
//           remaining: budget.amount - spentAmount,
//           percentage: Math.round(percentage),
//         };
//       })
//     );

//     res.json({ success: true, data: progress });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// };

import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import Budget from "../models/Budget";
import Transaction from "../models/Transaction";
import mongoose from "mongoose"; // MAKE SURE THIS IS IMPORTED

export const getBudgets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { month, year } = req.query;

    const filter: any = { user: req.userId };
    if (month) filter.month = Number(month);
    if (year) filter.year = Number(year);

    const budgets = await Budget.find(filter);

    res.json({ success: true, data: budgets });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const budget = await Budget.create({
      ...req.body,
      user: req.userId,
    });

    res.status(201).json({ success: true, data: budget });
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({
        message: "Budget for this category and month already exists",
      });
      return;
    }
    res.status(500).json({ message: error.message });
  }
};

export const updateBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json({ success: true, data: budget });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBudget = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!budget) {
      res.status(404).json({ message: "Budget not found" });
      return;
    }

    res.json({ success: true, message: "Budget deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBudgetProgress = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { month, year } = req.query;

    // Convert to ObjectId - THIS IS CRITICAL
    const userId = new mongoose.Types.ObjectId(req.userId);

    // Get all budgets for this month
    const budgets = await Budget.find({
      user: userId,
      month: Number(month),
      year: Number(year),
    });

    console.log("Found budgets:", budgets.length);

    // Calculate date range for transactions
    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    console.log("Date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      month: Number(month),
      year: Number(year),
    });

    // Calculate progress for each budget
    const progress = await Promise.all(
      budgets.map(async (budget) => {
        // Get spent amount for this category in this month
        const spent = await Transaction.aggregate([
          {
            $match: {
              user: userId,
              type: "expense",
              category: budget.category,
              date: {
                $gte: startDate,
                $lte: endDate,
              },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]);

        const spentAmount = spent.length > 0 ? spent[0].total : 0;
        const percentage =
          budget.amount > 0
            ? Math.round((spentAmount / budget.amount) * 100)
            : 0;

        console.log(
          `Category: ${budget.category}, Spent: ${spentAmount}, Budget: ${budget.amount}, Percentage: ${percentage}%`
        );

        return {
          budget: budget,
          spent: spentAmount,
          remaining: budget.amount - spentAmount,
          percentage: percentage,
        };
      })
    );

    console.log("Progress results:", progress);

    res.json({ success: true, data: progress });
  } catch (error: any) {
    console.error("Budget progress error:", error);
    res.status(500).json({ message: error.message, error: error.toString() });
  }
};