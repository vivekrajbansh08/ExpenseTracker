import mongoose, { Schema, Document } from 'mongoose';

export interface ISavingsGoal extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  deadline: Date; // Alias for targetDate
  category: string;
  description?: string;
  icon: string;
  color: string;
  isCompleted: boolean;
  completedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  contributions: Array<{
    amount: number;
    date: Date;
    note?: string;
  }>;
  progress: Array<{
    amount: number;
    date: Date;
    note?: string;
  }>; // Alias for contributions
  createdAt: Date;
  updatedAt: Date;
}

const SavingsGoalSchema: Schema = new Schema(
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
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    targetDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      enum: ['Emergency Fund', 'Vacation', 'Education', 'Home', 'Car', 'Wedding', 'Retirement', 'General', 'Other'],
      default: 'Other',
    },
    icon: {
      type: String,
      default: 'fas fa-piggy-bank',
    },
    color: {
      type: String,
      default: '#48bb78',
    },
    description: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    contributions: [
      {
        amount: {
          type: Number,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-complete when target is reached
SavingsGoalSchema.pre('save', async function (this: ISavingsGoal) {
  if (this.currentAmount >= this.targetAmount && !this.isCompleted) {
    this.isCompleted = true;
    this.completedAt = new Date();
  }
  
  // Sync targetDate and deadline
  if (this.targetDate) {
    this.deadline = this.targetDate;
  } else if (this.deadline) {
    this.targetDate = this.deadline;
  }
});

// Virtual for progress percentage
SavingsGoalSchema.virtual('progressPercentage').get(function () {
  return Math.min(((this as any).currentAmount / (this as any).targetAmount) * 100, 100);
});

// Virtual for progress (alias for contributions)
SavingsGoalSchema.virtual('progress').get(function () {
  return (this as any).contributions;
});

export default mongoose.model<ISavingsGoal>('SavingsGoal', SavingsGoalSchema);

