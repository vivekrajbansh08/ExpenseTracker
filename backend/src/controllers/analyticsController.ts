import { Request, Response } from 'express';
import Transaction from '../models/Transaction';
import Budget from '../models/Budget';

// Get spending trends over time
export const getSpendingTrends = async (req: Request, res: Response) => {
  try {
    const { timeframe = 'monthly', months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Number(months));

    const trends = await Transaction.aggregate([
      {
        $match: {
          userId: req.user!._id,
          type: 'expense',
          date: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgTransaction: { $avg: '$amount' },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch spending trends',
      error: error.message,
    });
  }
};

// Get category insights
export const getCategoryInsights = async (req: Request, res: Response) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const targetMonth = month ? Number(month) : currentDate.getMonth() + 1;
    const targetYear = year ? Number(year) : currentDate.getFullYear();

    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

    const insights = await Transaction.aggregate([
      {
        $match: {
          userId: req.user!._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
          avgTransaction: { $avg: '$amount' },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    // Calculate percentages
    const totalSpent = insights.reduce((sum, cat) => sum + cat.total, 0);
    const insightsWithPercentage = insights.map((cat) => ({
      ...cat,
      percentage: ((cat.total / totalSpent) * 100).toFixed(2),
    }));

    res.status(200).json({
      success: true,
      data: {
        insights: insightsWithPercentage,
        totalSpent,
        month: targetMonth,
        year: targetYear,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch category insights',
      error: error.message,
    });
  }
};

// Get spending predictions based on historical data
export const getPredictions = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    // Get last 3 months average
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const historicalData = await Transaction.aggregate([
      {
        $match: {
          userId,
          type: 'expense',
          date: { $gte: threeMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            category: '$category',
            month: { $month: '$date' },
            year: { $year: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $group: {
          _id: '$_id.category',
          avgMonthlySpend: { $avg: '$total' },
          months: { $sum: 1 },
        },
      },
    ]);

    // Simple prediction: use average of last 3 months
    const predictions = historicalData.map((cat) => ({
      category: cat._id,
      predictedAmount: Math.round(cat.avgMonthlySpend),
      confidence: cat.months >= 2 ? 'high' : 'low',
    }));

    const totalPredicted = predictions.reduce((sum, p) => sum + p.predictedAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        predictions,
        totalPredicted,
        basedOnMonths: 3,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to generate predictions',
      error: error.message,
    });
  }
};

// Get detailed timeframe analysis
export const getTimeframeAnalysis = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date and end date are required',
      });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    console.log('📊 Timeframe Analysis Request:', {
      startDateParam: startDate,
      endDateParam: endDate,
      startDateParsed: start,
      endDateParsed: end,
      userId: req.user!._id
    });

    // First, let's see ALL transactions for this user to understand what dates they have
    const allUserTransactions = await Transaction.find({ user: req.user!._id }).sort({ date: -1 });
    console.log('📊 ALL User Transactions:', {
      total: allUserTransactions.length,
      dates: allUserTransactions.map(t => ({
        date: t.date,
        dateISO: t.date.toISOString(),
        category: t.category,
        amount: t.amount,
        type: t.type
      }))
    });

    // Get summary data - FIX: use 'user' not 'userId' to match the model!
    const transactions = await Transaction.find({
      user: req.user!._id,
      date: { $gte: start, $lte: end },
    });

    console.log('📊 Found transactions in range:', {
      count: transactions.length,
      queryStart: start.toISOString(),
      queryEnd: end.toISOString(),
      dates: transactions.map(t => ({ date: t.date.toISOString(), category: t.category, amount: t.amount }))
    });

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Get category breakdown with counts using aggregation
    const categoryBreakdown = await Transaction.aggregate([
      {
        $match: {
          user: req.user!._id,
          type: 'expense',
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: '$category',
          amount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { amount: -1 },
      },
    ]);

    const dailySpending = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc: any, t) => {
        const date = t.date.toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + t.amount;
        return acc;
      }, {});

    res.status(200).json({
      success: true,
      data: {
        period: {
          startDate: start,
          endDate: end,
          days: Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
        },
        summary: {
          totalIncome: income,
          totalExpenses: expenses,
          netBalance: income - expenses,
          transactionCount: transactions.length,
          avgDailySpending: expenses / Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))),
        },
        categoryBreakdown: categoryBreakdown.map((cat) => ({
          category: cat._id,
          amount: cat.amount,
          count: cat.count,
          percentage: ((cat.amount / expenses) * 100).toFixed(2),
        })),
        dailySpending,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to analyze timeframe',
      error: error.message,
    });
  }
};

// Get overspending alerts
export const getOverspendingAlerts = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Get current month's spending by category
    const spending = await Transaction.aggregate([
      {
        $match: {
          userId: req.user!._id,
          type: 'expense',
          date: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: '$category',
          spent: { $sum: '$amount' },
        },
      },
    ]);

    // Get budgets
    const budgets = await Budget.find({
      userId: req.user!._id,
      month: currentMonth,
      year: currentYear,
    });

    // Compare spending with budgets
    const alerts = budgets
      .map((budget) => {
        const spent = spending.find((s) => s._id === budget.category)?.spent || 0;
        const percentage = (spent / budget.amount) * 100;

        if (percentage >= 90) {
          return {
            category: budget.category,
            budgetAmount: budget.amount,
            spent,
            percentage: percentage.toFixed(2),
            severity: percentage >= 100 ? 'critical' : 'warning',
            message:
              percentage >= 100
                ? `You've exceeded your ${budget.category} budget by ₹${spent - budget.amount}`
                : `You're at ${percentage.toFixed(0)}% of your ${budget.category} budget`,
          };
        }
        return null;
      })
      .filter(Boolean);

    res.status(200).json({
      success: true,
      data: alerts,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch overspending alerts',
      error: error.message,
    });
  }
};
