import mongoose, { Schema, Document } from 'mongoose';

export interface IReceipt extends Document {
  userId: mongoose.Types.ObjectId;
  transactionId?: mongoose.Types.ObjectId;
  imageUrl: string;
  merchant?: string;
  notes?: string;
  ocrData?: {
    merchantName?: string;
    amount?: number;
    date?: Date;
    category?: string;
    items?: Array<{
      name: string;
      quantity?: number;
      price?: number;
    }>;
    rawText?: string;
    extractedText?: string;
    confidence?: number;
    processedAt?: Date;
  };
  isProcessed: boolean;
  uploadedAt: Date;
  uploadDate: Date; // Alias for uploadedAt
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ReceiptSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: 'Transaction',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    merchant: {
      type: String,
    },
    notes: {
      type: String,
    },
    ocrData: {
      merchantName: String,
      amount: Number,
      date: Date,
      category: String,
      items: [
        {
          name: String,
          quantity: Number,
          price: Number,
        },
      ],
      rawText: String,
      extractedText: String,
      confidence: Number,
      processedAt: Date,
    },
    isProcessed: {
      type: Boolean,
      default: false,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReceipt>('Receipt', ReceiptSchema);
