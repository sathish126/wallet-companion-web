import { useFinance } from "@/context/FinanceContext";
import { getMonthTransactions, getTotalByType, getExpensesByCategory, getMonthLabel } from "@/utils/calculations";
import SummaryCard from "@/components/SummaryCard";
import ExpenseChart from "@/components/ExpenseChart";
import BudgetAlerts from "@/components/BudgetAlerts";
import RecentTransactions from "@/components/RecentTransactions";
import { TrendingUp, TrendingDown, Wallet, PiggyBank, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Dashboard() {
  const { transactions, fixedExpenses, formatCurrency, dispatch, isMonthLocked } = useFinance();
  const { toast } = useToast();
  const now = new Date();
  const monthKey = format(now, "yyyy-MM");
  const locked = isMonthLocked(now);
  const monthTx = getMonthTransactions(transactions, now);
  const totalIncome = getTotalByType(monthTx, "income");
  const totalExpenses = getTotalByType(monthTx, "expense");
  const fixedTotal = fixedExpenses.reduce((s, f) => s + f.amount, 0);
  const allExpenses = totalExpenses + fixedTotal;
  const balance = totalIncome - allExpenses;
  const savings = balance > 0 ? balance : 0;
  const expensesByCategory = getExpensesByCategory(monthTx);

  const handleLockToggle = () => {
    if (locked) {
      dispatch({ type: "UNLOCK_MONTH", payload: monthKey });
      toast({ title: "Month unlocked" });
    } else {
      dispatch({ type: "LOCK_MONTH", payload: monthKey });
      toast({ title: "Month locked! Transactions can't be modified." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">{getMonthLabel(now)}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant={locked ? "default" : "outline"}
              size="sm"
              className={`gap-1.5 ${locked ? "bg-income text-income-foreground hover:bg-income/90" : ""}`}
            >
              {locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
              {locked ? "Locked" : "Lock Month"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{locked ? "Unlock this month?" : "Lock this month?"}</AlertDialogTitle>
              <AlertDialogDescription>
                {locked
                  ? "Unlocking will allow editing and deleting transactions for this month again."
                  : "Locking will prevent any edits or deletions to this month's transactions. You can unlock later."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLockToggle}>
                {locked ? "Unlock" : "Lock"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <SummaryCard title="Income" value={formatCurrency(totalIncome)} icon={<TrendingUp className="h-5 w-5" />} variant="income" />
        <SummaryCard title="Expenses" value={formatCurrency(allExpenses)} icon={<TrendingDown className="h-5 w-5" />} variant="expense" />
        <SummaryCard title="Balance" value={formatCurrency(balance)} icon={<Wallet className="h-5 w-5" />} variant="balance" subtitle={balance < 0 ? "Over budget!" : undefined} />
        <SummaryCard title="Savings" value={formatCurrency(savings)} icon={<PiggyBank className="h-5 w-5" />} variant="savings" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ExpenseChart data={expensesByCategory} />
        <BudgetAlerts expensesByCategory={expensesByCategory} />
      </div>

      <RecentTransactions transactions={monthTx} />
    </div>
  );
}
