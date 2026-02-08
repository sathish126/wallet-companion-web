import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { Transaction, FixedExpense, Budget, AppSettings } from "@/models/types";
import { storage } from "@/services/storage";
import { v4 as uuidv4 } from "uuid";

interface State {
  transactions: Transaction[];
  fixedExpenses: FixedExpense[];
  budgets: Budget[];
  settings: AppSettings;
}

type Action =
  | { type: "ADD_TRANSACTION"; payload: Omit<Transaction, "id"> }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "ADD_FIXED_EXPENSE"; payload: Omit<FixedExpense, "id"> }
  | { type: "DELETE_FIXED_EXPENSE"; payload: string }
  | { type: "SET_BUDGET"; payload: Budget }
  | { type: "DELETE_BUDGET"; payload: string }
  | { type: "UPDATE_SETTINGS"; payload: AppSettings }
  | { type: "RESET_ALL" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TRANSACTION":
      return { ...state, transactions: [...state.transactions, { ...action.payload, id: uuidv4() }] };
    case "UPDATE_TRANSACTION":
      return { ...state, transactions: state.transactions.map((t) => (t.id === action.payload.id ? action.payload : t)) };
    case "DELETE_TRANSACTION":
      return { ...state, transactions: state.transactions.filter((t) => t.id !== action.payload) };
    case "ADD_FIXED_EXPENSE":
      return { ...state, fixedExpenses: [...state.fixedExpenses, { ...action.payload, id: uuidv4() }] };
    case "DELETE_FIXED_EXPENSE":
      return { ...state, fixedExpenses: state.fixedExpenses.filter((f) => f.id !== action.payload) };
    case "SET_BUDGET":
      const existing = state.budgets.findIndex((b) => b.category === action.payload.category);
      const budgets = existing >= 0 ? state.budgets.map((b, i) => (i === existing ? action.payload : b)) : [...state.budgets, action.payload];
      return { ...state, budgets };
    case "DELETE_BUDGET":
      return { ...state, budgets: state.budgets.filter((b) => b.category !== action.payload) };
    case "UPDATE_SETTINGS":
      return { ...state, settings: action.payload };
    case "RESET_ALL":
      storage.clearAll();
      return { transactions: [], fixedExpenses: [], budgets: [], settings: { currency: "INR", currencySymbol: "₹" } };
    default:
      return state;
  }
}

interface FinanceContextType extends State {
  dispatch: React.Dispatch<Action>;
  formatCurrency: (amount: number) => string;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, null, () => ({
    transactions: storage.getTransactions(),
    fixedExpenses: storage.getFixedExpenses(),
    budgets: storage.getBudgets(),
    settings: storage.getSettings(),
  }));

  useEffect(() => { storage.saveTransactions(state.transactions); }, [state.transactions]);
  useEffect(() => { storage.saveFixedExpenses(state.fixedExpenses); }, [state.fixedExpenses]);
  useEffect(() => { storage.saveBudgets(state.budgets); }, [state.budgets]);
  useEffect(() => { storage.saveSettings(state.settings); }, [state.settings]);

  const formatCurrency = (amount: number) =>
    `${state.settings.currencySymbol}${amount.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

  return (
    <FinanceContext.Provider value={{ ...state, dispatch, formatCurrency }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
