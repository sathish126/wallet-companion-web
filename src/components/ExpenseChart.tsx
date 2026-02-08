import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "hsl(220, 70%, 50%)",
  "hsl(152, 60%, 42%)",
  "hsl(4, 72%, 56%)",
  "hsl(38, 92%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(180, 50%, 45%)",
  "hsl(320, 60%, 50%)",
  "hsl(60, 70%, 45%)",
];

interface ExpenseChartProps {
  data: Record<string, number>;
}

export default function ExpenseChart({ data }: ExpenseChartProps) {
  const entries = Object.entries(data).map(([name, value]) => ({ name, value }));

  if (entries.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-6">
        <h3 className="font-semibold mb-4">Expense Breakdown</h3>
        <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
          No expenses this month yet
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4">Expense Breakdown</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={entries}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {entries.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, ""]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {entries.map((e, i) => (
          <span key={e.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
            {e.name}
          </span>
        ))}
      </div>
    </div>
  );
}
