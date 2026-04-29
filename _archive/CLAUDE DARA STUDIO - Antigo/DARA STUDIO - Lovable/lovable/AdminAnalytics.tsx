import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { BarChart3 } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];
const tooltipStyle = { backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 12 };

const AdminAnalytics = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      supabase.from("projects").select("*"),
      supabase.from("admin_payments").select("*"),
    ]).then(([p, pay]) => {
      setProjects(p.data || []);
      setPayments(pay.data || []);
    });
  }, []);

  // Revenue by month
  const revenueByMonth: Record<string, number> = {};
  payments.filter(p => p.status === "paid").forEach(p => {
    const m = months[new Date(p.payment_date || p.created_at).getMonth()];
    revenueByMonth[m] = (revenueByMonth[m] || 0) + Number(p.amount_paid || 0);
  });
  const revenueData = months.filter(m => revenueByMonth[m]).map(m => ({ month: m, revenue: revenueByMonth[m] }));

  // Projects by stage
  const stageCount: Record<string, number> = {};
  projects.forEach(p => { stageCount[p.stage || "Unknown"] = (stageCount[p.stage || "Unknown"] || 0) + 1; });
  const stageData = Object.entries(stageCount).map(([name, value]) => ({ name, value }));

  // Summary
  const totalRevenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const totalPipeline = projects.filter(p => p.stage !== "Completed").reduce((s, p) => s + Number(p.total_value || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Financial and project performance analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">${totalPipeline.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{projects.length}</p>
            <p className="text-xs text-muted-foreground">Total Projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            {revenueData.length === 0 ? (
              <div className="flex flex-col items-center py-12"><BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No revenue data yet</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3"><CardTitle className="text-base">Projects by Stage</CardTitle></CardHeader>
          <CardContent>
            {stageData.length === 0 ? (
              <div className="flex flex-col items-center py-12"><BarChart3 className="h-8 w-8 text-muted-foreground/30 mb-2" /><p className="text-sm text-muted-foreground">No project data yet</p></div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={stageData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={(e) => e.name}>
                    {stageData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAnalytics;
