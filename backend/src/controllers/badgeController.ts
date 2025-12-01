import { Request, Response } from 'express';
import Badge from '../models/Badge';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';
import SavingsGoal from '../models/SavingsGoal';

// Get all badges for a user
export const getBadges = async (req: Request, res: Response) => {
  try {
    const badges = await Badge.find({ userId: req.user!._id }).sort({ earnedAt: -1 });

    res.status(200).json({
      success: true,
      data: badges,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch badges',
      error: error.message,
    });
  }
};

// Check and award badges based on user activity
export const checkAndAwardBadges = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;
    const awardedBadges: any[] = [];

    // Get existing badges
    const existingBadges = await Badge.find({ userId });
    const existingBadgeNames = existingBadges.map((b) => b.name);

    // Badge 1: First Transaction
    if (!existingBadgeNames.includes('First Transaction')) {
      const transactionCount = await Transaction.countDocuments({ userId });
      if (transactionCount >= 1) {
        const badge = await Badge.create({
          userId,
          name: 'First Transaction',
          description: 'Recorded your first transaction',
          icon: 'fas fa-star',
          category: 'milestone',
        });
        awardedBadges.push(badge);
      }
    }

    // Badge 2: Transaction Master (100 transactions)
    if (!existingBadgeNames.includes('Transaction Master')) {
      const transactionCount = await Transaction.countDocuments({ userId });
      if (transactionCount >= 100) {
        const badge = await Badge.create({
          userId,
          name: 'Transaction Master',
          description: 'Recorded 100 transactions',
          icon: 'fas fa-trophy',
          category: 'achievement',
        });
        awardedBadges.push(badge);
      }
    }

    // Badge 3: Budget Planner
    if (!existingBadgeNames.includes('Budget Planner')) {
      const budgetCount = await Budget.countDocuments({ userId });
      if (budgetCount >= 1) {
        const badge = await Badge.create({
          userId,
          name: 'Budget Planner',
          description: 'Created your first budget',
          icon: 'fas fa-coins',
          category: 'milestone',
        });
        awardedBadges.push(badge);
      }
    }

    // Badge 4: Savings Champion
    if (!existingBadgeNames.includes('Savings Champion')) {
      const completedGoals = await SavingsGoal.countDocuments({ userId, isCompleted: true });
      if (completedGoals >= 1) {
        const badge = await Badge.create({
          userId,
          name: 'Savings Champion',
          description: 'Completed your first savings goal',
          icon: 'fas fa-piggy-bank',
          category: 'achievement',
        });
        awardedBadges.push(badge);
      }
    }

    // Badge 5: Consistency King (30 days streak)
    if (!existingBadgeNames.includes('Consistency King')) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTransactions = await Transaction.countDocuments({
        userId,
        createdAt: { $gte: thirtyDaysAgo },
      });
      
      if (recentTransactions >= 30) {
        const badge = await Badge.create({
          userId,
          name: 'Consistency King',
          description: 'Logged transactions for 30 consecutive days',
          icon: 'fas fa-fire',
          category: 'streak',
        });
        awardedBadges.push(badge);
      }
    }

    // Badge 6: Money Saver (Saved 10,000)
    if (!existingBadgeNames.includes('Money Saver')) {
      const goals = await SavingsGoal.find({ userId });
      const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
      
      if (totalSaved >= 10000) {
        const badge = await Badge.create({
          userId,
          name: 'Money Saver',
          description: 'Saved ₹10,000 across all goals',
          icon: 'fas fa-gem',
          category: 'achievement',
        });
        awardedBadges.push(badge);
      }
    }

    res.status(200).json({
      success: true,
      message: awardedBadges.length > 0 ? 'New badges awarded!' : 'No new badges earned',
      data: awardedBadges,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to check badges',
      error: error.message,
    });
  }
};

// Get leaderboard (top users by badge count)
export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await Badge.aggregate([
      {
        $group: {
          _id: '$userId',
          badgeCount: { $sum: 1 },
        },
      },
      {
        $sort: { badgeCount: -1 },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $unwind: '$user',
      },
      {
        $project: {
          userId: '$_id',
          username: '$user.username',
          email: '$user.email',
          badgeCount: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message,
    });
  }
};
