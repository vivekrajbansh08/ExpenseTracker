export interface Transaction {
  _id?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description?: string;
  date: Date | string;
  createdAt?: Date;
}

export interface TransactionStats {
  summary: Array<{
    _id: string;
    total: number;
  }>;
  categoryBreakdown: Array<{
    _id: string;
    total: number;
    count: number;
  }>;
}

export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Education',
  'Bills',
  'Other',
];

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Other'];
