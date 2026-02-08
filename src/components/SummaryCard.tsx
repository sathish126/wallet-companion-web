import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  variant: "income" | "expense" | "savings" | "balance";
  subtitle?: string;
}

const variantStyles = {
  income: "bg-income-muted border-income/20",
  expense: "bg-expense-muted border-expense/20",
  savings: "bg-savings-muted border-savings/20",
  balance: "bg-card border-border",
};

const iconStyles = {
  income: "text-income",
  expense: "text-expense",
  savings: "text-savings",
  balance: "text-primary",
};

export default function SummaryCard({ title, value, icon, variant, subtitle }: SummaryCardProps) {
  return (
    <div className={cn("rounded-xl border p-4 animate-fade-in", variantStyles[variant])}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <span className={cn("h-8 w-8 rounded-lg flex items-center justify-center", iconStyles[variant])}>
          {icon}
        </span>
      </div>
      <p className={cn("text-2xl font-bold font-mono tracking-tight", iconStyles[variant])}>{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}
