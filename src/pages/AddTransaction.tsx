import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/models/types";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

export default function AddTransaction() {
  const { dispatch } = useFinance();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0 || !category || !date) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }

    dispatch({
      type: "ADD_TRANSACTION",
      payload: { type, amount: parsedAmount, category, date, notes: notes.trim() },
    });

    toast({ title: `${type === "income" ? "Income" : "Expense"} added!` });
    navigate("/");
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Transaction</h1>
        <p className="text-muted-foreground text-sm">Record your income or expense</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type toggle */}
        <div className="flex rounded-xl border bg-muted p-1 gap-1">
          <button
            type="button"
            onClick={() => { setType("income"); setCategory(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              type === "income" ? "bg-income text-income-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => { setType("expense"); setCategory(""); }}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
              type === "expense" ? "bg-expense text-expense-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            Expense
          </button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg font-mono h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-12" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add a note..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            maxLength={200}
            rows={2}
          />
        </div>

        <Button type="submit" className="w-full h-12 text-base font-semibold gradient-primary text-primary-foreground border-0">
          Add {type === "income" ? "Income" : "Expense"}
        </Button>
      </form>
    </div>
  );
}
