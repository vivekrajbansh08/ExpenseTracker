import { Request, Response } from 'express';
import Subscription from '../models/Subscription';

// Get all subscriptions for a user
export const getSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user!._id,
      isActive: true,
    }).sort({ nextBillingDate: 1 });

    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscriptions',
      error: error.message,
    });
  }
};

// Get a single subscription
export const getSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription',
      error: error.message,
    });
  }
};

// Create a new subscription
export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { name, amount, frequency, category, startDate, description, reminderDays, icon, color } = req.body;

    const subscription = await Subscription.create({
      userId: req.user!._id,
      name,
      amount,
      frequency,
      category: category || 'Other',
      startDate: startDate || new Date(),
      nextBillingDate: startDate || new Date(),
      description,
      reminderDays: reminderDays || 3,
      icon,
      color,
    });

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription',
      error: error.message,
    });
  }
};

// Update a subscription
export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { name, amount, frequency, category, description, reminderDays, icon, color } = req.body;

    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { name, amount, frequency, category, description, reminderDays, icon, color },
      { new: true, runValidators: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription',
      error: error.message,
    });
  }
};

// Cancel a subscription
export const cancelSubscription = async (req: Request, res: Response) => {
  try {
    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { isActive: false, cancelledAt: new Date() },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully',
      data: subscription,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription',
      error: error.message,
    });
  }
};

// Get upcoming bills (next 30 days)
export const getUpcomingBills = async (req: Request, res: Response) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const subscriptions = await Subscription.find({
      userId: req.user!._id,
      isActive: true,
      nextBillingDate: { $lte: thirtyDaysFromNow },
    }).sort({ nextBillingDate: 1 });

    const totalUpcoming = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

    res.status(200).json({
      success: true,
      data: {
        subscriptions,
        totalUpcoming,
        count: subscriptions.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch upcoming bills',
      error: error.message,
    });
  }
};

// Get subscription statistics
export const getSubscriptionStats = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user!._id,
      isActive: true,
    });

    const monthlyTotal = subscriptions
      .filter((s) => s.frequency === 'monthly')
      .reduce((sum, s) => sum + s.amount, 0);

    const yearlyTotal = subscriptions
      .filter((s) => s.frequency === 'yearly')
      .reduce((sum, s) => sum + s.amount, 0);

    const weeklyTotal = subscriptions
      .filter((s) => s.frequency === 'weekly')
      .reduce((sum, s) => sum + s.amount, 0);

    // Calculate annualized cost
    const annualizedCost =
      monthlyTotal * 12 + yearlyTotal + weeklyTotal * 52;

    res.status(200).json({
      success: true,
      data: {
        totalSubscriptions: subscriptions.length,
        monthlyTotal,
        yearlyTotal,
        weeklyTotal,
        annualizedCost,
        byCategory: subscriptions.reduce((acc: any, sub) => {
          acc[sub.category] = (acc[sub.category] || 0) + 1;
          return acc;
        }, {}),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription statistics',
      error: error.message,
    });
  }
};
