import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { DollarSign, TrendingUp, BarChart3 } from "lucide-react";

interface FinancialChartProps {
  payments: any[];
  projects: any[];
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const tooltipStyle = {
  backgroundColor: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  fontSize: 12,
};

const FinancialChart = ({ payments, projects }: FinancialChartProps) => {
  // 1. Revenue per Month
  const monthlyRevenue: Record<string, number> = {};
  payments.forEach((p) => {
    if (p.status === "paid") {
      const date = new Date(p.payment_date || p.created_at);
      const key = months[date.getMonth()];
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + Number(p.amount_paid || 0);
    }
  });
  const revenueData = months
    .filter((m) => monthlyRevenue[m])
    .map((m) => ({ month: m, revenue: monthlyRevenue[m] }));

  // 2. Projects Started vs Completed per Month
  const projectMonthly: Record<string, { started: number; completed: number }> = {};
  projects.forEach((p) => {
    if (p.start_date) {
      const m = months[new Date(p.start_date).getMonth()];
      if (!projectMonthly[m]) projectMonthly[m] = { started: 0, completed: 0 };
      projectMonthly[m].started++;
    }
    if (p.stage === "Completed" && p.updated_at) {
      const m = months[new Date(p.updated_at).getMonth()];
      if (!projectMonthly[m]) projectMonthly[m] = { started: 0, completed: 0 };
      projectMonthly[m].completed++;
    }
  });
  const projectData = months
    .filter((m) => projectMonthly[m])
    .map((m) => ({ month: m, ...projectMonthly[m] }));

  // 3. Pipeline Value
  const pipelineTotal = projects
    .filter((p) => p.stage !== "Completed" && p.stage !== "Lead" && p.stage !== "briefing")
    .reduce((s, p) => s + Number(p.total_value || 0), 0);
  const totalRevenue = payments
    .filter((p) => p.status === "paid")
    .reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const totalPending = payments
    .filter((p) => p.status !== "paid")
    .reduce((s, p) => s + Number(p.amount_total || 0), 0);

  const fmt = (v: number) =>
    v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v.toFixed(0)}`;

  return (
    <div className="space-y-6">
      {/* Revenue per Month */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Revenue per Month</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {revenueData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No payment data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={fmt} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Projects Started vs Completed */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Projects Started vs Completed</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {projectData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-10">No project timeline data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={projectData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="started" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} name="Started" />
                <Line type="monotone" dataKey="completed" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Pipeline Value Summary */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Revenue Pipeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{fmt(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Received</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{fmt(totalPending)}</p>
              <p className="text-xs text-muted-foreground mt-1">Pending Payments</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <p className="text-2xl font-bold text-foreground">{fmt(pipelineTotal)}</p>
              <p className="text-xs text-muted-foreground mt-1">Pipeline Value</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialChart;
