import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  type: 'cash' | 'bank' | 'upi' | 'card' | 'e-wallet';
  balance: number;
  currency: string;
  icon: string;
  color: string;
  isDefault: boolean;
  isActive: boolean;
  metadata?: {
    bankName?: string;
    cardLast4?: string;
    upiId?: string;
    accountNumber?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema: Schema = new Schema(
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
      maxlength: 50,
    },
    type: {
      type: String,
      required: true,
      enum: ['cash', 'bank', 'upi', 'card', 'e-wallet'],
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    currency: {
      type: String,
      required: true,
      default: 'INR',
    },
    icon: {
      type: String,
      default: 'fas fa-wallet',
    },
    color: {
      type: String,
      default: '#667eea',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      bankName: String,
      cardLast4: String,
      upiId: String,
      accountNumber: String,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default wallet per user
WalletSchema.pre('save', async function (this: IWallet) {
  if (this.isDefault) {
    await mongoose.model('Wallet').updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
});

export default mongoose.model<IWallet>('Wallet', WalletSchema);
