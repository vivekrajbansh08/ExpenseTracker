import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database";
import authRoutes from './routes/authRoutes';
import transactionRoutes from './routes/transactionRoutes';
import budgetRoutes from './routes/budgetRoutes';
import walletRoutes from './routes/walletRoutes';
import expenseShareRoutes from './routes/expenseShareRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import savingsGoalRoutes from './routes/savingsGoalRoutes';
import receiptRoutes from './routes/receiptRoutes';
import badgeRoutes from './routes/badgeRoutes';
import notificationRoutes from './routes/notificationRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import exportRoutes from './routes/exportRoutes';
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// CORS Configuration - IMPORTANT FOR DEPLOYMENT
const allowedOrigins = [
  "http://localhost:4200",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // Will be set on Render
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        allowedOrigins.includes(undefined)
      ) {
        callback(null, true);
      } else {
        callback(null, true); // For now, allow all origins
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/wallets', walletRoutes);
app.use('/api/expense-shares', expenseShareRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/savings-goals', savingsGoalRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    environment: process.env.NODE_ENV,
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "MoneyTrack API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      transactions: "/api/transactions",
      budgets: "/api/budgets",
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;
