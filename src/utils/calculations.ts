import { Transaction } from "@/models/types";
import { startOfMonth, endOfMonth, parseISO, isWithinInterval, format } from "date-fns";

export function getMonthTransactions(transactions: Transaction[], date: Date = new Date()): Transaction[] {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return transactions.filter((t) => {
    const d = parseISO(t.date);
    return isWithinInterval(d, { start, end });
  });
}

export function getTotalByType(transactions: Transaction[], type: "income" | "expense"): number {
  return transactions.filter((t) => t.type === type).reduce((sum, t) => sum + t.amount, 0);
}

export function getExpensesByCategory(transactions: Transaction[]): Record<string, number> {
  return transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
}

export function getMonthLabel(date: Date): string {
  return format(date, "MMMM yyyy");
}
