import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  amount: number;
  currency: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: string;
  startDate: Date;
  nextBillingDate: Date;
  endDate?: Date;
  isActive: boolean;
  icon: string;
  color: string;
  website?: string;
  notes?: string;
  description?: string;
  reminderDays: number;
  cancelledAt?: Date;
  walletId?: mongoose.Types.ObjectId;
  transactions: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    frequency: {
      type: String,
      required: true,
      enum: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      default: 'monthly',
    },
    category: {
      type: String,
      required: true,
      default: 'Subscriptions',
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    nextBillingDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
      default: 'fas fa-sync',
    },
    color: {
      type: String,
      default: '#667eea',
    },
    website: {
      type: String,
    },
    notes: {
      type: String,
    },
    description: {
      type: String,
    },
    reminderDays: {
      type: Number,
      default: 3,
      min: 0,
    },
    cancelledAt: {
      type: Date,
    },
    walletId: {
      type: Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    transactions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Transaction',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate next billing date
SubscriptionSchema.methods.calculateNextBilling = function () {
  const current = this.nextBillingDate;
  const next = new Date(current);

  switch (this.frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
    case 'quarterly':
      next.setMonth(next.getMonth() + 3);
      break;
    case 'yearly':
      next.setFullYear(next.getFullYear() + 1);
      break;
  }

  return next;
};

export default mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
