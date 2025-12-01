import { Request, Response } from 'express';
import ExpenseShare from '../models/ExpenseShare';
import User from '../models/User';
import { sendExpenseShareCreatedEmail, sendSplitSettledEmail } from '../utils/sendEmail';

// Get all expense shares for a user
export const getExpenseShares = async (req: Request, res: Response) => {
  try {
    const shares = await ExpenseShare.find({
      $or: [
        { paidBy: req.user!._id },
        { 'splits.userId': req.user!._id },
      ],
    })
      .populate('paidBy', 'username email')
      .populate('splits.userId', 'username email')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shares,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense shares',
      error: error.message,
    });
  }
};

// Get a single expense share
export const getExpenseShare = async (req: Request, res: Response) => {
  try {
    const share = await ExpenseShare.findById(req.params.id)
      .populate('paidBy', 'username email')
      .populate('splits.userId', 'username email')
      .populate('groupId', 'name');

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Expense share not found',
      });
    }

    res.status(200).json({
      success: true,
      data: share,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch expense share',
      error: error.message,
    });
  }
};

// Create a new expense share
export const createExpenseShare = async (req: Request, res: Response) => {
  try {
    const { transactionId, groupId, totalAmount, splits, description } = req.body;

    if (!splits || splits.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one split is required',
      });
    }

    // Process splits: look up users by email
    const processedSplits = await Promise.all(
      splits.map(async (split: any) => {
        const user = await User.findOne({ email: split.email?.toLowerCase() });
        
        if (user) {
          // Registered user
          return {
            userId: user._id,
            email: split.email.toLowerCase(),
            amount: split.amount,
            paid: split.paid || false,
            isPending: false
          };
        } else {
          // Non-registered user (pending)
          return {
            email: split.email.toLowerCase(),
            amount: split.amount,
            paid: false,
            isPending: true
          };
        }
      })
    );

    const share = await ExpenseShare.create({
      transactionId,
      groupId,
      paidBy: req.user!._id,
      totalAmount,
      splits: processedSplits,
      description,
    });

    const populatedShare = await ExpenseShare.findById(share._id)
      .populate('paidBy', 'username email')
      .populate('splits.userId', 'username email');

    // Send email notifications to all participants
    try {
      const paidByUser: any = populatedShare?.paidBy;
      const paidByName = paidByUser?.username || paidByUser?.email || 'Someone';
      
      // Send notifications to each split participant
      for (const split of populatedShare?.splits || []) {
        const participantEmail = (split as any).email;
        const participant: any = (split as any).userId;
        
        // Skip notifying the creator
        if (participantEmail && participantEmail !== paidByUser?.email) {
          const participantName = participant?.username || participantEmail;
          
          await sendExpenseShareCreatedEmail(
            participantEmail,
            participantName,
            description || 'Shared Expense',
            totalAmount,
            (split as any).amount,
            paidByName
          );
        }
      }
    } catch (emailError: any) {
      console.error('Failed to send notification emails:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Expense share created successfully',
      data: populatedShare,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create expense share',
      error: error.message,
    });
  }
};

// Update expense share
export const updateExpenseShare = async (req: Request, res: Response) => {
  try {
    const { totalAmount, splits, description } = req.body;

    const share = await ExpenseShare.findOneAndUpdate(
      { _id: req.params.id, paidBy: req.user!._id },
      { totalAmount, splits, description },
      { new: true, runValidators: true }
    )
      .populate('paidBy', 'username email')
      .populate('splits.userId', 'username email');

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Expense share not found or you do not have permission to update it',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense share updated successfully',
      data: share,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update expense share',
      error: error.message,
    });
  }
};

// Settle a split payment
export const settleSplit = async (req: Request, res: Response) => {
  try {
    const { splitUserId, splitId } = req.body;

    const share = await ExpenseShare.findById(req.params.id);

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Expense share not found',
      });
    }

    // Find split by ID if provided, otherwise fall back to userId
    let split;
    if (splitId) {
      split = share.splits.find(
        (s: any) => s._id.toString() === splitId.toString()
      );
    } else {
      split = share.splits.find(
        (s: any) => s.userId.toString() === splitUserId
      );
    }

    if (!split) {
      return res.status(404).json({
        success: false,
        message: 'Split not found',
      });
    }

    split.paid = true;
    split.paidAt = new Date();

    await share.save();

    // Send notification to expense creator
    try {
      const populatedShare = await ExpenseShare.findById(req.params.id)
        .populate('paidBy', 'username email')
        .populate('splits.userId', 'username email');
      
      const paidByUser: any = populatedShare?.paidBy;
      const settledUser: any = split.userId;
      
      if (paidByUser && paidByUser._id.toString() !== (settledUser._id || settledUser).toString()) {
        const creatorEmail = paidByUser.email;
        const creatorName = paidByUser.username || paidByUser.email;
        const settlerName = settledUser?.username || settledUser?.email || 'Someone';
        
        await sendSplitSettledEmail(
          creatorEmail,
          creatorName,
          share.description || 'Shared Expense',
          split.amount,
          settlerName
        );
      }

      // Check if expense is now fully settled and send notification to everyone
      if (populatedShare?.isSettled) {
        const { sendExpenseFullySettledEmail } = await import('../utils/sendEmail');
        const emailsSent = new Set<string>();
        
        for (const split of populatedShare.splits) {
          const email = (split as any).email;
          if (email && !emailsSent.has(email)) {
            const user = (split as any).userId;
            const name = user?.username || email;
            
            await sendExpenseFullySettledEmail(
              email,
              name,
              populatedShare.description || 'Shared Expense',
              populatedShare.totalAmount
            );
            
            emailsSent.add(email);
          }
        }
        
        console.log(`✅ Sent full settlement notifications to ${emailsSent.size} participants`);
      }
    } catch (emailError: any) {
      console.error('Failed to send settlement notification:', emailError.message);
      // Don't fail the request if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Split settled successfully',
      data: share,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to settle split',
      error: error.message,
    });
  }
};

// Get balance summary with other users
export const getBalances = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    // Get all shares where user is involved
    const shares = await ExpenseShare.find({
      $or: [
        { paidBy: userId },
        { 'splits.userId': userId },
      ],
      isSettled: false,
    }).populate('paidBy splits.userId', 'username email');

    const balances: any = {};

    shares.forEach((share: any) => {
      if (share.paidBy._id.toString() === userId.toString()) {
        // User paid, so others owe them
        share.splits.forEach((split: any) => {
          if (!split.paid && split.userId._id.toString() !== userId.toString()) {
            const otherUserId = split.userId._id.toString();
            if (!balances[otherUserId]) {
              balances[otherUserId] = {
                user: split.userId,
                youOwe: 0,
                theyOwe: 0,
              };
            }
            balances[otherUserId].theyOwe += split.amount;
          }
        });
      } else {
        // Someone else paid
        const userSplit = share.splits.find(
          (s: any) => s.userId._id.toString() === userId.toString()
        );
        if (userSplit && !userSplit.paid) {
          const payerId = share.paidBy._id.toString();
          if (!balances[payerId]) {
            balances[payerId] = {
              user: share.paidBy,
              youOwe: 0,
              theyOwe: 0,
            };
          }
          balances[payerId].youOwe += userSplit.amount;
        }
      }
    });

    // Convert to array and calculate net balance
    const balanceArray = Object.values(balances).map((b: any) => ({
      user: b.user,
      youOwe: b.youOwe,
      theyOwe: b.theyOwe,
      netBalance: b.theyOwe - b.youOwe,
    }));

    res.status(200).json({
      success: true,
      data: balanceArray,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to calculate balances',
      error: error.message,
    });
  }
};

// Delete expense share
export const deleteExpenseShare = async (req: Request, res: Response) => {
  try {
    const share = await ExpenseShare.findOneAndDelete({
      _id: req.params.id,
      paidBy: req.user!._id,
    });

    if (!share) {
      return res.status(404).json({
        success: false,
        message: 'Expense share not found or you do not have permission to delete it',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Expense share deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete expense share',
      error: error.message,
    });
  }
};
