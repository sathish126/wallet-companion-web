import { Transaction } from "@/models/types";
import { useFinance } from "@/context/FinanceContext";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Props {
  transactions: Transaction[];
}

export default function RecentTransactions({ transactions }: Props) {
  const { formatCurrency } = useFinance();
  const recent = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      {recent.length === 0 ? (
        <p className="text-muted-foreground text-sm">No transactions yet. Add your first one!</p>
      ) : (
        <div className="space-y-3">
          {recent.map((t) => (
            <div key={t.id} className="flex items-center gap-3">
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                  t.type === "income" ? "bg-income-muted" : "bg-expense-muted"
                }`}
              >
                {t.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4 text-income" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-expense" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {t.category}{t.subcategory ? ` · ${t.subcategory}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(t.date), "dd MMM")} {t.time ? `at ${t.time}` : ""}
                </p>
              </div>
              <span
                className={`font-mono text-sm font-semibold ${
                  t.type === "income" ? "text-income" : "text-expense"
                }`}
              >
                {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
