import { Transaction } from "@/models/types";
import { format, parseISO } from "date-fns";

export function exportTransactionsToCSV(
  transactions: Transaction[],
  currencySymbol: string,
  filename?: string
) {
  const headers = ["Date", "Time", "Type", "Category", "Subcategory", "Amount", "Notes"];

  const rows = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => [
      format(parseISO(t.date), "dd/MM/yyyy"),
      t.time || "",
      t.type,
      t.category,
      t.subcategory || "",
      `${currencySymbol}${t.amount}`,
      `"${(t.notes || "").replace(/"/g, '""')}"`,
    ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `spendwise-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
