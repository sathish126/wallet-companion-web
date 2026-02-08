import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { EXPENSE_CATEGORIES, FOOD_SUBCATEGORIES } from "@/models/types";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK_ITEMS = [
  { label: "☕ Tea", category: "Food", subcategory: "Tea" },
  { label: "☕ Coffee", category: "Food", subcategory: "Coffee" },
  { label: "🍿 Snacks", category: "Food", subcategory: "Snacks" },
  { label: "🍽️ Lunch", category: "Food", subcategory: "Lunch" },
  { label: "🍽️ Dinner", category: "Food", subcategory: "Dinner" },
  { label: "🚗 Transport", category: "Transport", subcategory: undefined },
  { label: "🛒 Shopping", category: "Shopping", subcategory: undefined },
];

export default function QuickAddExpense() {
  const { dispatch, isMonthLocked } = useFinance();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof QUICK_ITEMS[0] | null>(null);
  const [amount, setAmount] = useState("");

  const now = new Date();

  const handleQuickAdd = () => {
    if (!selectedItem) return;
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }

    if (isMonthLocked(now)) {
      toast({ title: "This month is locked", variant: "destructive" });
      return;
    }

    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        type: "expense",
        amount: parsedAmount,
        category: selectedItem.category,
        subcategory: selectedItem.subcategory,
        date: format(now, "yyyy-MM-dd"),
        time: format(now, "HH:mm"),
        notes: `Quick add: ${selectedItem.label}`,
      },
    });

    toast({ title: `${selectedItem.label} — ₹${parsedAmount} added!` });
    setAmount("");
    setSelectedItem(null);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 h-14 w-14 rounded-full gradient-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Quick add expense"
      >
        <Zap className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-72 rounded-2xl border bg-card shadow-2xl p-4 animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm">Quick Add</h3>
        <button onClick={() => { setOpen(false); setSelectedItem(null); setAmount(""); }} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      {!selectedItem ? (
        <div className="grid grid-cols-2 gap-2">
          {QUICK_ITEMS.map((item) => (
            <button
              key={item.label}
              onClick={() => setSelectedItem(item)}
              className="p-2.5 rounded-xl border bg-muted/50 text-sm font-medium hover:bg-accent transition-colors text-left"
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium">{selectedItem.label}</p>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="font-mono"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleQuickAdd()}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedItem(null)}>
              Back
            </Button>
            <Button size="sm" className="flex-1 gradient-primary text-primary-foreground border-0" onClick={handleQuickAdd}>
              Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
