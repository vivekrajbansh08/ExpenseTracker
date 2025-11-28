import mongoose, { Document, Schema } from "mongoose";

export interface IBudget extends Document {
  user: mongoose.Types.ObjectId;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt: Date;
}

const budgetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide a budget amount"],
    min: [0, "Budget amount cannot be negative"],
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Compound index to ensure one budget per category per month
budgetSchema.index(
  { user: 1, category: 1, month: 1, year: 1 },
  { unique: true }
);

export default mongoose.model("Budget", budgetSchema);
