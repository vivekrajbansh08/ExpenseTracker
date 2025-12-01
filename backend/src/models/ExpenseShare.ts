import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseShare extends Document {
  transactionId: mongoose.Types.ObjectId;
  groupId: mongoose.Types.ObjectId;
  paidBy: mongoose.Types.ObjectId;
  totalAmount: number;
  splits: Array<{
    userId?: mongoose.Types.ObjectId; // Optional for pending users
    email: string; // Required for all
    amount: number;
    paid: boolean;
    isPending?: boolean; // True if user not registered
    paidAt?: Date;
  }>;
  isSettled: boolean;
  settledAt?: Date;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseShareSchema: Schema = new Schema(
  {
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
      required: true,
    },
    groupId: {
      type: Schema.Types.ObjectId,
      ref: 'Group',
      required: false,
    },
    paidBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    splits: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: false, // Optional - only for registered users
        },
        email: {
          type: String,
          required: true, // Required - for all participants
          lowercase: true,
          trim: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        paid: {
          type: Boolean,
          default: false,
        },
        isPending: {
          type: Boolean,
          default: false, // True if user not registered yet
        },
        paidAt: {
          type: Date,
        },
      },
    ],
    isSettled: {
      type: Boolean,
      default: false,
    },
    settledAt: {
      type: Date,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-calculate settlement status
ExpenseShareSchema.pre('save', async function (this: IExpenseShare) {
  const allPaid = this.splits.every((split: any) => split.paid);
  const wasSettled = this.isSettled;
  
  if (allPaid && !wasSettled) {
    this.isSettled = true;
    this.settledAt = new Date();
  }
});

const ExpenseShare = mongoose.model<IExpenseShare>('ExpenseShare', ExpenseShareSchema);

// Note: Settlement notifications are handled in the controller to avoid circular dependencies

export default ExpenseShare;
