import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, Receipt,
  ExternalLink, FileText, Download, Bell,
} from "lucide-react";
import { format, startOfMonth, endOfMonth, addDays, subMonths } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { toast } from "sonner";

const AdminFinanceOverview = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);

  const fetchData = async () => {
    const [payRes, msRes, projRes] = await Promise.all([
      supabase.from("admin_payments").select("*, projects(name, street_name, street_number, companies(name))").order("created_at", { ascending: false }),
      supabase.from("payment_milestones").select("*, projects(name, street_name, street_number, companies(name))").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name, street_name, street_number, total_value, currency, companies(name)"),
    ]);
    setPayments(payRes.data || []);
    setMilestones(msRes.data || []);
    setProjects(projRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel("finance-overview")
      .on("postgres_changes", { event: "*", schema: "public", table: "admin_payments" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "payment_milestones" }, () => fetchData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const next30 = addDays(now, 30);

  // KPI calculations
  const totalRevenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const revenueThisMonth = payments
    .filter(p => p.status === "paid" && p.payment_date && new Date(p.payment_date) >= monthStart && new Date(p.payment_date) <= monthEnd)
    .reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const outstandingFromPayments = payments.filter(p => p.status === "pending").reduce((s, p) => s + Number(p.amount_total || 0), 0);
  const outstandingFromMilestones = milestones.filter(m => m.status === "pending" || m.status === "overdue").reduce((s, m) => s + Number(m.amount || 0), 0);
  const outstandingRevenue = outstandingFromPayments + outstandingFromMilestones;
  const paidInvoicesCount = payments.filter(p => p.status === "paid").length;

  // Outstanding invoices (pending milestones + pending payments)
  const outstandingInvoices = useMemo(() => {
    const fromMilestones = milestones
      .filter(m => m.status === "pending" || m.status === "overdue")
      .map(m => ({
        id: m.id,
        type: "milestone" as const,
        label: m.stage,
        project: [m.projects?.street_number, m.projects?.street_name].filter(Boolean).join(" ") || m.projects?.name || "—",
        client: m.projects?.companies?.name || "—",
        amount: Number(m.amount || 0),
        status: m.status,
        date: m.created_at,
      }));
    const fromPayments = payments
      .filter(p => p.status === "pending")
      .map(p => ({
        id: p.id,
        type: "payment" as const,
        label: p.installment_type || "Invoice",
        project: [p.projects?.street_number, p.projects?.street_name].filter(Boolean).join(" ") || p.projects?.name || "—",
        client: p.projects?.companies?.name || "—",
        amount: Number(p.amount_total || 0),
        status: p.status,
        date: p.created_at,
      }));
    return [...fromMilestones, ...fromPayments];
  }, [milestones, payments]);

  // Recent payments (last 10 paid)
  const recentPayments = useMemo(() =>
    payments.filter(p => p.status === "paid").slice(0, 10), [payments]);

  // Revenue forecast (pending with dates in next 30 days)
  const revenueForecast = useMemo(() => {
    const pendingMs = milestones
      .filter(m => (m.status === "pending" || m.status === "overdue"))
      .reduce((s, m) => s + Number(m.amount || 0), 0);
    const pendingPay = payments
      .filter(p => p.status === "pending")
      .reduce((s, p) => s + Number(p.amount_total || 0), 0);
    return pendingMs + pendingPay;
  }, [milestones, payments]);

  // Monthly revenue chart (last 6 months)
  const monthlyData = useMemo(() => {
    const months: { label: string; revenue: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = subMonths(now, i);
      const ms = startOfMonth(d);
      const me = endOfMonth(d);
      const rev = payments
        .filter(p => p.status === "paid" && p.payment_date && new Date(p.payment_date) >= ms && new Date(p.payment_date) <= me)
        .reduce((s, p) => s + Number(p.amount_paid || 0), 0);
      months.push({ label: format(ms, "MMM yyyy"), revenue: rev });
    }
    return months;
  }, [payments]);

  const fmtCurrency = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Finance Overview</h1>
          <p className="text-sm text-muted-foreground">Complete financial status of your business</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/adm/payments")}>
            <Receipt className="h-3.5 w-3.5 mr-1" /> Payments Page
          </Button>
          <Button variant="outline" size="sm" onClick={() => {
            toast.info("Export coming soon");
          }}>
            <Download className="h-3.5 w-3.5 mr-1" /> Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-chart-2/15">
              <DollarSign className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{fmtCurrency(totalRevenue)}</p>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-chart-4/15">
              <TrendingUp className="h-5 w-5 text-chart-4" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{fmtCurrency(revenueThisMonth)}</p>
              <p className="text-xs text-muted-foreground">Revenue This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-destructive/15">
              <Clock className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{fmtCurrency(outstandingRevenue)}</p>
              <p className="text-xs text-muted-foreground">Outstanding Revenue</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-primary/15">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{paidInvoicesCount}</p>
              <p className="text-xs text-muted-foreground">Paid Invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Forecast + Monthly Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Forecast card */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-foreground">{fmtCurrency(revenueForecast)}</p>
              <p className="text-sm text-muted-foreground mt-1">Projected (pending invoices)</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Milestones</span>
                <span className="font-medium">{fmtCurrency(outstandingFromMilestones)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Pending Payments</span>
                <span className="font-medium">{fmtCurrency(outstandingFromPayments)}</span>
              </div>
            </div>
            {outstandingRevenue > 0 && totalRevenue > 0 && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Collection Progress</span>
                  <span>{Math.round((totalRevenue / (totalRevenue + outstandingRevenue)) * 100)}%</span>
                </div>
                <Progress value={(totalRevenue / (totalRevenue + outstandingRevenue)) * 100} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card className="border-none shadow-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(value: number) => [fmtCurrency(value), "Revenue"]}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Invoices */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Outstanding Invoices ({outstandingInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outstandingInvoices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    No outstanding invoices
                  </TableCell>
                </TableRow>
              )}
              {outstandingInvoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell className="font-medium">{inv.label}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.project}</TableCell>
                  <TableCell className="text-muted-foreground">{inv.client}</TableCell>
                  <TableCell className="font-medium">{fmtCurrency(inv.amount)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inv.status === "overdue"
                        ? "bg-destructive/15 text-destructive border-destructive/30"
                        : "bg-chart-3/15 text-chart-3 border-chart-3/30"
                    }>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs"
                      onClick={() => toast.info(`Reminder for "${inv.label}" would be sent`)}
                    >
                      <Bell className="h-3 w-3 mr-1" /> Remind
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => navigate("/adm/payments")}>
              View All <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentPayments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                    No payments yet
                  </TableCell>
                </TableRow>
              )}
              {recentPayments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {[p.projects?.street_number, p.projects?.street_name].filter(Boolean).join(" ") || p.projects?.name || "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.projects?.companies?.name || "—"}</TableCell>
                  <TableCell className="font-medium text-chart-2">{fmtCurrency(Number(p.amount_paid || 0))}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">{p.payment_method || "—"}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.payment_date ? format(new Date(p.payment_date), "MMM d, yyyy") : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminFinanceOverview;
