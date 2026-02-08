import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { EXPENSE_CATEGORIES } from "@/models/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { settings, budgets, fixedExpenses, dispatch, formatCurrency } = useFinance();
  const { toast } = useToast();

  // Budget form
  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  // Fixed expense form
  const [fixedCategory, setFixedCategory] = useState("");
  const [fixedAmount, setFixedAmount] = useState("");

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const limit = parseFloat(budgetLimit);
    if (!budgetCategory || !limit || limit <= 0) return;
    dispatch({ type: "SET_BUDGET", payload: { category: budgetCategory, limit } });
    toast({ title: `Budget set for ${budgetCategory}` });
    setBudgetCategory("");
    setBudgetLimit("");
  };

  const handleAddFixed = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(fixedAmount);
    if (!fixedCategory || !amount || amount <= 0) return;
    dispatch({ type: "ADD_FIXED_EXPENSE", payload: { category: fixedCategory, amount } });
    toast({ title: `Fixed expense added` });
    setFixedCategory("");
    setFixedAmount("");
  };

  const handleCurrencyChange = (symbol: string) => {
    const map: Record<string, string> = { "₹": "INR", "$": "USD", "€": "EUR", "£": "GBP" };
    dispatch({ type: "UPDATE_SETTINGS", payload: { currency: map[symbol] || "INR", currencySymbol: symbol } });
  };

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage budgets, fixed expenses & preferences</p>
      </div>

      {/* Currency */}
      <section className="space-y-3">
        <h2 className="font-semibold">Currency</h2>
        <Select value={settings.currencySymbol} onValueChange={handleCurrencyChange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="₹">₹ INR</SelectItem>
            <SelectItem value="$">$ USD</SelectItem>
            <SelectItem value="€">€ EUR</SelectItem>
            <SelectItem value="£">£ GBP</SelectItem>
          </SelectContent>
        </Select>
      </section>

      <Separator />

      {/* Budgets */}
      <section className="space-y-3">
        <h2 className="font-semibold">Category Budgets</h2>
        <form onSubmit={handleAddBudget} className="flex gap-2">
          <Select value={budgetCategory} onValueChange={setBudgetCategory}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input type="number" min="0" placeholder="Limit" value={budgetLimit} onChange={(e) => setBudgetLimit(e.target.value)} className="w-28" />
          <Button type="submit" size="sm">Set</Button>
        </form>
        {budgets.length > 0 && (
          <div className="space-y-2">
            {budgets.map((b) => (
              <div key={b.category} className="flex items-center justify-between p-2 rounded-lg bg-muted text-sm">
                <span>{b.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">{formatCurrency(b.limit)}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: "DELETE_BUDGET", payload: b.category })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Fixed Expenses */}
      <section className="space-y-3">
        <h2 className="font-semibold">Fixed Monthly Expenses</h2>
        <form onSubmit={handleAddFixed} className="flex gap-2">
          <Input placeholder="e.g. Rent, EMI" value={fixedCategory} onChange={(e) => setFixedCategory(e.target.value)} className="flex-1" />
          <Input type="number" min="0" placeholder="Amount" value={fixedAmount} onChange={(e) => setFixedAmount(e.target.value)} className="w-28" />
          <Button type="submit" size="sm">Add</Button>
        </form>
        {fixedExpenses.length > 0 && (
          <div className="space-y-2">
            {fixedExpenses.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-2 rounded-lg bg-muted text-sm">
                <span>{f.category}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-muted-foreground">{formatCurrency(f.amount)}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => dispatch({ type: "DELETE_FIXED_EXPENSE", payload: f.id })}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Separator />

      {/* Reset */}
      <section>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full">Reset All Data</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset all data?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete all transactions, budgets, and settings.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => { dispatch({ type: "RESET_ALL" }); toast({ title: "All data cleared" }); }}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </div>
  );
}
