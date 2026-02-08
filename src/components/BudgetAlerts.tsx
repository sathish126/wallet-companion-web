import { useFinance } from "@/context/FinanceContext";
import { AlertTriangle, CheckCircle } from "lucide-react";

interface Props {
  expensesByCategory: Record<string, number>;
}

export default function BudgetAlerts({ expensesByCategory }: Props) {
  const { budgets, formatCurrency } = useFinance();

  if (budgets.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Budget Status</h3>
        <p className="text-muted-foreground text-sm">No budgets set. Go to Settings to add category budgets.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Budget Status</h3>
      <div className="space-y-3">
        {budgets.map((b) => {
          const spent = expensesByCategory[b.category] || 0;
          const pct = b.limit > 0 ? Math.min((spent / b.limit) * 100, 100) : 0;
          const over = spent > b.limit;
          return (
            <div key={b.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5">
                  {over ? (
                    <AlertTriangle className="h-3.5 w-3.5 text-expense" />
                  ) : (
                    <CheckCircle className="h-3.5 w-3.5 text-income" />
                  )}
                  <span className="font-medium">{b.category}</span>
                </div>
                <span className="text-muted-foreground font-mono text-xs">
                  {formatCurrency(spent)} / {formatCurrency(b.limit)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${over ? "bg-expense" : "bg-income"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
