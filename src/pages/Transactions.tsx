import { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { EXPENSE_CATEGORIES } from "@/models/types";
import { format, parseISO } from "date-fns";
import { ArrowUpRight, ArrowDownRight, Trash2, Search, Download, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exportTransactionsToCSV } from "@/utils/exportCSV";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Transactions() {
  const { transactions, dispatch, formatCurrency, settings, isTransactionLocked } = useFinance();
  const { toast } = useToast();
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter((t) => {
        if (filterCategory !== "all" && t.category !== filterCategory) return false;
        if (filterType !== "all" && t.type !== filterType) return false;
        if (search && !t.category.toLowerCase().includes(search.toLowerCase()) && !t.notes.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      });
  }, [transactions, filterCategory, filterType, search]);

  const handleExport = () => {
    if (filtered.length === 0) {
      toast({ title: "No transactions to export", variant: "destructive" });
      return;
    }
    exportTransactionsToCSV(filtered, settings.currencySymbol);
    toast({ title: `Exported ${filtered.length} transactions` });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground text-sm">{transactions.length} total entries</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={filterType} onValueChange={(v) => setFilterType(v as any)}>
          <SelectTrigger className="w-full sm:w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {EXPENSE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => {
            const locked = isTransactionLocked(t);
            return (
              <div key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border bg-card animate-fade-in ${locked ? "opacity-80" : ""}`}>
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === "income" ? "bg-income-muted" : "bg-expense-muted"}`}>
                  {t.type === "income" ? (
                    <ArrowUpRight className="h-4 w-4 text-income" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-expense" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {t.category}{t.subcategory ? ` · ${t.subcategory}` : ""}
                    {locked && <Lock className="inline h-3 w-3 ml-1.5 text-muted-foreground" />}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {format(parseISO(t.date), "dd MMM yyyy")} {t.time ? `at ${t.time}` : ""}
                    {t.notes && ` · ${t.notes}`}
                  </p>
                </div>
                <span className={`font-mono text-sm font-semibold shrink-0 ${t.type === "income" ? "text-income" : "text-expense"}`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
                {locked ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-8 w-8 shrink-0 flex items-center justify-center">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Month is locked</TooltipContent>
                  </Tooltip>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => dispatch({ type: "DELETE_TRANSACTION", payload: t.id })}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
