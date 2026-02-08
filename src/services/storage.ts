import { Transaction, FixedExpense, Budget, AppSettings } from "@/models/types";

const KEYS = {
  transactions: "spendwise_transactions",
  fixedExpenses: "spendwise_fixed_expenses",
  budgets: "spendwise_budgets",
  settings: "spendwise_settings",
  lockedMonths: "spendwise_locked_months",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getTransactions: (): Transaction[] => load(KEYS.transactions, []),
  saveTransactions: (t: Transaction[]) => save(KEYS.transactions, t),

  getFixedExpenses: (): FixedExpense[] => load(KEYS.fixedExpenses, []),
  saveFixedExpenses: (f: FixedExpense[]) => save(KEYS.fixedExpenses, f),

  getBudgets: (): Budget[] => load(KEYS.budgets, []),
  saveBudgets: (b: Budget[]) => save(KEYS.budgets, b),

  getSettings: (): AppSettings =>
    load(KEYS.settings, { currency: "INR", currencySymbol: "₹" }),
  saveSettings: (s: AppSettings) => save(KEYS.settings, s),

  getLockedMonths: (): string[] => load(KEYS.lockedMonths, []),
  saveLockedMonths: (m: string[]) => save(KEYS.lockedMonths, m),

  clearAll: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};
