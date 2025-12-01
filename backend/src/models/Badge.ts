import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'savings' | 'budget' | 'transaction' | 'streak' | 'milestone';
  unlockedAt: Date;
  progress?: number;
  target?: number;
  metadata?: any;
}

const BadgeSchema: Schema = new Schema(
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
    },
    description: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: 'fas fa-trophy',
    },
    color: {
      type: String,
      default: '#f093fb',
    },
    category: {
      type: String,
      required: true,
      enum: ['savings', 'budget', 'transaction', 'streak', 'milestone'],
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
    },
    target: {
      type: Number,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBadge>('Badge', BadgeSchema);
