import { Request, Response } from 'express';
import Wallet from '../models/Wallet';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';

// Get all wallets for a user
export const getWallets = async (req: Request, res: Response) => {
  try {
    const wallets = await Wallet.find({ userId: req.user!._id, isActive: true }).sort({ isDefault: -1, createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: wallets,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallets',
      error: error.message,
    });
  }
};

// Get a single wallet
export const getWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.findOne({
      _id: req.params.id,
      userId: req.user!._id,
    });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet',
      error: error.message,
    });
  }
};

// Create a new wallet
export const createWallet = async (req: Request, res: Response) => {
  try {
    const { name, type, balance, currency, icon, color, isDefault, metadata } = req.body;

    const wallet = await Wallet.create({
      userId: req.user!._id,
      name,
      type,
      balance: balance || 0,
      currency: currency || 'INR',
      icon: icon || 'fas fa-wallet',
      color: color || '#667eea',
      isDefault: isDefault || false,
      metadata,
    });

    res.status(201).json({
      success: true,
      message: 'Wallet created successfully',
      data: wallet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to create wallet',
      error: error.message,
    });
  }
};

// Update a wallet
export const updateWallet = async (req: Request, res: Response) => {
  try {
    const { name, type, balance, currency, icon, color, isDefault, metadata } = req.body;

    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { name, type, balance, currency, icon, color, isDefault, metadata },
      { new: true, runValidators: true }
    );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet updated successfully',
      data: wallet,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to update wallet',
      error: error.message,
    });
  }
};

// Delete a wallet (soft delete)
export const deleteWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await Wallet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { isActive: false },
      { new: true }
    );

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Wallet deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete wallet',
      error: error.message,
    });
  }
};

// Transfer money between wallets
export const transferBetweenWallets = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromWalletId, toWalletId, amount, description } = req.body;

    if (!fromWalletId || !toWalletId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'From wallet, to wallet, and amount are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    // Find both wallets
    const fromWallet = await Wallet.findOne({
      _id: fromWalletId,
      userId: req.user!._id,
      isActive: true,
    }).session(session);

    const toWallet = await Wallet.findOne({
      _id: toWalletId,
      userId: req.user!._id,
      isActive: true,
    }).session(session);

    if (!fromWallet || !toWallet) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'One or both wallets not found',
      });
    }

    if (fromWallet.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance in source wallet',
      });
    }

    // Update wallet balances
    fromWallet.balance -= amount;
    toWallet.balance += amount;

    await fromWallet.save({ session });
    await toWallet.save({ session });

    // Create transaction records
    await Transaction.create(
      [
        {
          user: req.user!._id,
          type: 'expense',
          category: 'Other',
          amount,
          description: description || `Transfer to ${toWallet.name}`,
          date: new Date(),
        },
        {
          user: req.user!._id,
          type: 'income',
          category: 'Other',
          amount,
          description: description || `Transfer from ${fromWallet.name}`,
          date: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: 'Transfer completed successfully',
      data: {
        fromWallet,
        toWallet,
      },
    });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Failed to transfer funds',
      error: error.message,
    });
  } finally {
    session.endSession();
  }
};
