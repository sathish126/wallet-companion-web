import { useFinance } from "@/context/FinanceContext";
import { getMonthTransactions, getTotalByType, getExpensesByCategory, getMonthLabel } from "@/utils/calculations";
import SummaryCard from "@/components/SummaryCard";
import ExpenseChart from "@/components/ExpenseChart";
import BudgetAlerts from "@/components/BudgetAlerts";
import RecentTransactions from "@/components/RecentTransactions";
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";

export default function Dashboard() {
  const { transactions, fixedExpenses, formatCurrency } = useFinance();
  const now = new Date();
  const monthTx = getMonthTransactions(transactions, now);
  const totalIncome = getTotalByType(monthTx, "income");
  const totalExpenses = getTotalByType(monthTx, "expense");
  const fixedTotal = fixedExpenses.reduce((s, f) => s + f.amount, 0);
  const allExpenses = totalExpenses + fixedTotal;
  const balance = totalIncome - allExpenses;
  const savings = balance > 0 ? balance : 0;
  const expensesByCategory = getExpensesByCategory(monthTx);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm">{getMonthLabel(now)}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SummaryCard
          title="Income"
          value={formatCurrency(totalIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
          variant="income"
        />
        <SummaryCard
          title="Expenses"
          value={formatCurrency(allExpenses)}
          icon={<TrendingDown className="h-5 w-5" />}
          variant="expense"
        />
        <SummaryCard
          title="Balance"
          value={formatCurrency(balance)}
          icon={<Wallet className="h-5 w-5" />}
          variant="balance"
          subtitle={balance < 0 ? "Over budget!" : undefined}
        />
        <SummaryCard
          title="Savings"
          value={formatCurrency(savings)}
          icon={<PiggyBank className="h-5 w-5" />}
          variant="savings"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ExpenseChart data={expensesByCategory} />
        <BudgetAlerts expensesByCategory={expensesByCategory} />
      </div>

      <RecentTransactions transactions={monthTx} />
    </div>
  );
}
