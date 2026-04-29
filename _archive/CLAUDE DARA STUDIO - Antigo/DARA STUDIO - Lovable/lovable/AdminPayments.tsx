import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";

const INSTALLMENT_TYPES = ["Entry", "Final", "Extra"];
const PAYMENT_METHODS = ["Stripe", "Nomad", "Wise", "Transfer"];
const PRICE_TABLES = ["W/ Stripe (1.515)", "W/O Stripe (1.31)", "Full", "REL", "Partner"];
const STATUSES = ["pending", "partial", "paid"];

const AdminPayments = () => {
  const { t } = useLanguage();
  const [payments, setPayments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    project_id: "", installment_type: "Entry", amount_total: "", amount_paid: "",
    status: "pending", payment_method: "Stripe", stripe_fee_percent: "2.9", payment_date: "",
    value_brl: "", price_table: "", third_party_costs: "", payment_notes: "",
  });

  const fetchData = async () => {
    const [payRes, projRes] = await Promise.all([
      supabase.from("admin_payments").select("*, projects(name, display_address, total_value, entry_payment_percent, currency, street_name, street_number, companies(name))").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name, display_address, total_value, entry_payment_percent, currency, street_name, street_number, companies(name)").order("created_at", { ascending: false }),
    ]);
    setPayments(payRes.data || []);
    setProjects(projRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  // Realtime subscription for payment changes (admin_payments + payment_milestones)
  useEffect(() => {
    const channel = supabase
      .channel('admin-payments-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_payments' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_milestones' }, () => {
        fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const selectedProject = projects.find(p => p.id === form.project_id);
  const projectTotal = Number(selectedProject?.total_value || 0);
  const entryPct = Number(selectedProject?.entry_payment_percent || 50);
  const entryAmount = projectTotal * entryPct / 100;
  const finalAmount = projectTotal - entryAmount;

  const handleProjectSelect = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    const total = Number(proj?.total_value || 0);
    const ePct = Number(proj?.entry_payment_percent || 50);
    const suggestedAmount = form.installment_type === "Entry" ? (total * ePct / 100) : form.installment_type === "Final" ? (total - total * ePct / 100) : 0;
    setForm(f => ({ ...f, project_id: projectId, amount_total: suggestedAmount.toString() }));
  };

  const handleTypeChange = (type: string) => {
    const suggestedAmount = type === "Entry" ? entryAmount : type === "Final" ? finalAmount : 0;
    setForm(f => ({ ...f, installment_type: type, amount_total: suggestedAmount.toString() }));
  };

  const handleSave = async () => {
    if (!form.project_id) { toast.error(t("admin.selectProject")); return; }
    const { error } = await supabase.from("admin_payments").insert({
      project_id: form.project_id, installment_type: form.installment_type,
      amount_total: Number(form.amount_total) || 0, amount_paid: Number(form.amount_paid) || 0,
      status: form.status, payment_method: form.payment_method,
      stripe_fee_percent: Number(form.stripe_fee_percent) || 0,
      payment_date: form.payment_date || null,
      value_brl: form.value_brl ? Number(form.value_brl) : null,
      price_table: form.price_table || null,
      third_party_costs: form.third_party_costs ? Number(form.third_party_costs) : 0,
      payment_notes: form.payment_notes || null,
    });
    if (error) { toast.error(error.message); return; }
    await updateProjectPaymentStage(form.project_id);
    toast.success(t("admin.paymentRegistered"));
    setDialogOpen(false); fetchData();
  };

  const updateProjectPaymentStage = async (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    if (!proj) return;
    const { data: allPayments } = await supabase.from("admin_payments").select("amount_paid, status").eq("project_id", projectId);
    const totalPaid = (allPayments || []).filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
    const total = Number(proj.total_value || 0);
    const ePct = Number(proj.entry_payment_percent || 50);
    const entry = total * ePct / 100;

    let paymentStage = "Not Sent";
    if (totalPaid >= total && total > 0) paymentStage = "Paid";
    else if (totalPaid >= entry && entry > 0) paymentStage = "Entry Paid";
    else if (totalPaid > 0) paymentStage = "Waiting Final";

    await supabase.from("projects").update({ payment_stage: paymentStage }).eq("id", projectId);
  };

  // Compute per-project financial summaries from projects data
  const projectFinancials = projects.map(proj => {
    const total = Number(proj.total_value || 0);
    const ePct = Number(proj.entry_payment_percent || 50);
    const entry = total * ePct / 100;
    const final_ = total - entry;
    const projPayments = payments.filter(p => p.project_id === proj.id);
    const totalPaid = projPayments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
    const balance = total - totalPaid;
    const sym = proj.currency === "BRL" ? "R$" : "$";
    const addr = [proj.street_number, proj.street_name].filter(Boolean).join(" ") || proj.display_address || proj.name || "—";
    const company = proj.companies?.name || "";
    return { ...proj, total, entry, final_, totalPaid, balance, sym, addr, company };
  }).filter(p => p.total > 0);

  const totalReceived = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const totalPending = projectFinancials.reduce((s, p) => s + p.balance, 0);

  const statusBadge = (s: string) => {
    if (s === "paid") return <Badge className="bg-chart-2/15 text-chart-2 border-chart-2/30">{t("admin.paidStatus")}</Badge>;
    if (s === "partial") return <Badge variant="secondary">{t("admin.partialStatus")}</Badge>;
    return <Badge variant="outline">{t("admin.pendingStatus")}</Badge>;
  };

  const getProjectLabel = (p: any) => {
    const addr = [p.street_number, p.street_name].filter(Boolean).join(" ");
    const company = p.companies?.name || "";
    return addr ? `${addr} — ${company}` : p.display_address || p.name || company || "—";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("admin.payments")}</h1>
          <p className="text-sm text-muted-foreground">{t("admin.financialControl")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />{t("admin.newPayment")}</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{t("admin.registerPayment")}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>{t("admin.project")} *</Label>
                <Select value={form.project_id || "none"} onValueChange={v => v !== "none" && handleProjectSelect(v)}>
                  <SelectTrigger><SelectValue placeholder={t("admin.select")} /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{getProjectLabel(p)}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {selectedProject && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="p-2 rounded bg-primary/10 border border-primary/20">
                    <p className="text-xs text-muted-foreground">{t("admin.totalValue")}</p>
                    <p className="font-semibold text-primary">${projectTotal.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded bg-chart-3/10 border border-chart-3/20">
                    <p className="text-xs text-muted-foreground">{t("admin.entryAmount")} ({entryPct}%)</p>
                    <p className="font-semibold text-chart-3">${entryAmount.toLocaleString()}</p>
                  </div>
                  <div className="p-2 rounded bg-chart-4/10 border border-chart-4/20">
                    <p className="text-xs text-muted-foreground">{t("admin.finalAmount")}</p>
                    <p className="font-semibold text-chart-4">${finalAmount.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("admin.type")}</Label>
                  <Select value={form.installment_type} onValueChange={handleTypeChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{INSTALLMENT_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>{t("admin.method")}</Label>
                  <Select value={form.payment_method} onValueChange={v => setForm({ ...form, payment_method: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("admin.amountTotal")} ($)</Label><Input type="number" value={form.amount_total} onChange={e => setForm({ ...form, amount_total: e.target.value })} /></div>
                <div><Label>{t("admin.amountPaid")} ($)</Label><Input type="number" value={form.amount_paid} onChange={e => setForm({ ...form, amount_paid: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>{t("admin.stripeFee")} (%)</Label><Input type="number" step="0.1" value={form.stripe_fee_percent} onChange={e => setForm({ ...form, stripe_fee_percent: e.target.value })} /></div>
                <div><Label>{t("admin.status")}</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s === "pending" ? t("admin.pendingStatus") : s === "partial" ? t("admin.partialStatus") : t("admin.paidStatus")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>{t("admin.paymentDate")}</Label><Input type="date" value={form.payment_date} onChange={e => setForm({ ...form, payment_date: e.target.value })} /></div>
              
              <Separator />
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Detalhes Financeiros</p>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Valor BRL (R$)</Label><Input type="number" value={form.value_brl} onChange={e => setForm({ ...form, value_brl: e.target.value })} /></div>
                <div><Label>Tabela de Preço</Label>
                  <Select value={form.price_table || "none"} onValueChange={v => setForm({ ...form, price_table: v === "none" ? "" : v })}>
                    <SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      {PRICE_TABLES.map(pt => <SelectItem key={pt} value={pt}>{pt}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Custos com Terceiros (Emily)</Label><Input type="number" value={form.third_party_costs} onChange={e => setForm({ ...form, third_party_costs: e.target.value })} placeholder="R$ 0,00" /></div>
              <div><Label>Observações de Pagamento</Label>
                <textarea className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.payment_notes} onChange={e => setForm({ ...form, payment_notes: e.target.value })} placeholder='Ex: "Total recebido pelo Stripe R$ 1.465,75"' />
              </div>
              <Button className="w-full" onClick={handleSave}>{t("admin.register")}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-chart-2/10 border-chart-2/20"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("admin.totalReceived")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-chart-2">${totalReceived.toLocaleString()}</p></CardContent></Card>
        <Card className="bg-destructive/10 border-destructive/20"><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("admin.pendingLabel")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-destructive">${totalPending.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{t("admin.records")}</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-foreground">{payments.length}</p></CardContent></Card>
      </div>

      {/* Project Financial Summary */}
      <Card>
        <CardHeader><CardTitle className="text-sm">{t("admin.projectFinancials")}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.project")}</TableHead>
                <TableHead>{t("admin.totalValue")}</TableHead>
                <TableHead>{t("admin.entryAmount")}</TableHead>
                <TableHead>{t("admin.paid")}</TableHead>
                <TableHead>{t("admin.balance")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectFinancials.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    <div>{p.addr}</div>
                    {p.company && <div className="text-xs text-muted-foreground">{p.company}</div>}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {p.sym}{p.total.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-chart-3/10 text-chart-3 border border-chart-3/20">
                      {p.sym}{p.entry.toLocaleString()} (50%)
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-chart-2/15 text-chart-2 border border-chart-2/30">
                      {p.sym}{p.totalPaid.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${p.balance > 0 ? "bg-destructive/15 text-destructive border-destructive/30" : "bg-chart-2/15 text-chart-2 border-chart-2/30"}`}>
                      {p.sym}{p.balance.toLocaleString()}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {projectFinancials.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">{t("admin.noProjects")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payment Records */}
      <Card>
        <CardHeader><CardTitle className="text-sm">{t("admin.paymentRecords")}</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("admin.project")}</TableHead>
                <TableHead>{t("admin.type")}</TableHead>
                <TableHead>{t("admin.total")}</TableHead>
                <TableHead>BRL</TableHead>
                <TableHead>{t("admin.paid")}</TableHead>
                <TableHead>Tabela</TableHead>
                <TableHead>Terceiros</TableHead>
                <TableHead>{t("admin.status")}</TableHead>
                <TableHead>{t("admin.date")}</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {[p.projects?.street_number, p.projects?.street_name].filter(Boolean).join(" ") || p.projects?.display_address || p.projects?.name || "—"}
                  </TableCell>
                  <TableCell>{p.installment_type}</TableCell>
                  <TableCell>${Number(p.amount_total).toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{p.value_brl ? `R$${Number(p.value_brl).toLocaleString()}` : "—"}</TableCell>
                  <TableCell className="text-chart-2">${Number(p.amount_paid).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{p.price_table || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{p.third_party_costs ? `R$${Number(p.third_party_costs).toLocaleString()}` : "—"}</TableCell>
                  <TableCell>
                    <Select
                      value={p.status}
                      onValueChange={async (newStatus) => {
                        const updatePayload: any = { status: newStatus };
                        if (newStatus === "paid" && !p.payment_date) {
                          updatePayload.payment_date = new Date().toISOString().split("T")[0];
                          updatePayload.amount_paid = Number(p.amount_total);
                        }
                        if (newStatus === "pending") {
                          updatePayload.amount_paid = 0;
                        }
                        const { error } = await supabase.from("admin_payments").update(updatePayload).eq("id", p.id);
                        if (error) { toast.error(error.message); return; }
                        await updateProjectPaymentStage(p.project_id);
                        toast.success(`Payment marked as ${newStatus}`);
                        fetchData();
                      }}
                    >
                      <SelectTrigger className="h-7 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t("admin.pendingStatus")}</SelectItem>
                        <SelectItem value="paid">{t("admin.paidStatus")}</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{p.payment_date || "—"}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{p.payment_notes || "—"}</TableCell>
                </TableRow>
              ))}
              {payments.length === 0 && (
                <TableRow><TableCell colSpan={10} className="text-center text-muted-foreground py-8">{t("admin.noPayments")}</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPayments;
