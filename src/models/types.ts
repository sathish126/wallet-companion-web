export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string; // ISO date
  notes: string;
}

export interface FixedExpense {
  id: string;
  category: string;
  amount: number;
}

export interface Budget {
  category: string;
  limit: number;
}

export interface AppSettings {
  currency: string;
  currencySymbol: string;
}

export const EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Medical",
  "Others",
] as const;

export const INCOME_CATEGORIES = ["Salary", "Freelance", "Bonus", "Others"] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
