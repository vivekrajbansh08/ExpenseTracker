import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  user: mongoose.Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
}

const transactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["income", "expense"],
    required: [true, "Please specify transaction type"],
  },
  amount: {
    type: Number,
    required: [true, "Please provide an amount"],
    min: [0, "Amount cannot be negative"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category"],
    enum: [
      "Food",
      "Transport",
      "Entertainment",
      "Shopping",
      "Healthcare",
      "Education",
      "Bills",
      "Salary",
      "Freelance",
      "Investment",
      "Other",
    ],
  },
  description: {
    type: String,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
transactionSchema.index({ user: 1, date: -1 });

export default mongoose.model("Transaction", transactionSchema);
