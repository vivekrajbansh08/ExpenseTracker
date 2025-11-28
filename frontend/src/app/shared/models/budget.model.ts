export interface Budget {
  _id?: string;
  category: string;
  amount: number;
  month: number;
  year: number;
  createdAt?: Date;
}

export interface BudgetProgress {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage: number;
}
