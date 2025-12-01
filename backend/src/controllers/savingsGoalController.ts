import { Request, Response } from 'express';
import SavingsGoal from '../models/SavingsGoal';

// Get all savings goals for a user
export const getSavingsGoals = async (req: Request, res: Response) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user!._id }).sort({ targetDate: 1 });

    res.status(200).json({
      success: true,
      data: goals,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch savings goals',
      error: error.message,
    });
  }
};

// Get a single savings goal
export const getSavingsGoal = async (req: Request, res: Response) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    res.status(200).json({
      success: true,
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch savings goal',
      error: error.message,
    });
  }
};

// Create a new savings goal
export const createSavingsGoal = async (req: Request, res: Response) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, deadline, category, description, icon, color } = req.body;

    const goal = await SavingsGoal.create({
      userId: req.user!._id,
      name,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate,
      deadline: deadline || targetDate, // Ensure deadline is set
      category: category || 'Other',
      description,
      icon,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Savings goal created successfully',
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create savings goal',
      error: error.message,
    });
  }
};

// Update a savings goal
export const updateSavingsGoal = async (req: Request, res: Response) => {
  try {
    const { name, targetAmount, currentAmount, targetDate, deadline, category, description, icon, color } = req.body;

    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { name, targetAmount, currentAmount, targetDate, deadline, category, description, icon, color },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal updated successfully',
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update savings goal',
      error: error.message,
    });
  }
};

// Add progress to a savings goal
export const addProgress = async (req: Request, res: Response) => {
  try {
    const { amount, note } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    goal.currentAmount += amount;
    goal.contributions.push({
      amount,
      date: new Date(),
      note: note || '',
    });

    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Progress added successfully',
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to add progress',
      error: error.message,
    });
  }
};

// Complete a savings goal
export const completeSavingsGoal = async (req: Request, res: Response) => {
  try {
    const goal = await SavingsGoal.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    if (goal.isCompleted) {
      return res.status(400).json({
        success: false,
        message: 'Goal is already completed',
      });
    }

    goal.isCompleted = true;
    goal.completedAt = new Date();
    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Savings goal completed!',
      data: goal,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to complete savings goal',
      error: error.message,
    });
  }
};

// Delete a savings goal
export const deleteSavingsGoal = async (req: Request, res: Response) => {
  try {
    const goal = await SavingsGoal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete savings goal',
      error: error.message,
    });
  }
};

// Get savings statistics
export const getSavingsStats = async (req: Request, res: Response) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user!._id });

    const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
    const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
    const completedGoals = goals.filter((g) => g.isCompleted).length;
    const activeGoals = goals.filter((g) => !g.isCompleted).length;

    res.status(200).json({
      success: true,
      data: {
        totalGoals: goals.length,
        activeGoals,
        completedGoals,
        totalTarget,
        totalSaved,
        percentageComplete: totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch savings statistics',
      error: error.message,
    });
  }
};
