import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const MILESTONE_NAMES = ["Preview 01", "Preview 02", "Revision 01", "Revision 02", "Final Delivery"];
const STATUSES = ["open", "sent", "approved"];

const AdminMilestones = () => {
  const [milestones, setMilestones] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ project_id: "", name: "Preview 01", status: "open", sent_date: "", approved_date: "", notes: "" });

  const fetchData = async () => {
    const [msRes, projRes] = await Promise.all([
      supabase.from("milestones").select("*, projects(name)").order("created_at", { ascending: false }),
      supabase.from("projects").select("id, name").order("name"),
    ]);
    setMilestones(msRes.data || []);
    setProjects(projRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.project_id) { toast.error("Selecione um projeto"); return; }
    const { error } = await supabase.from("milestones").insert({
      project_id: form.project_id, name: form.name, status: form.status,
      sent_date: form.sent_date || null, approved_date: form.approved_date || null,
      notes: form.notes || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Milestone criado");
    setDialogOpen(false); fetchData();
  };

  const updateStatus = async (id: string, status: string) => {
    const update: any = { status };
    if (status === "sent") update.sent_date = new Date().toISOString().split("T")[0];
    if (status === "approved") update.approved_date = new Date().toISOString().split("T")[0];
    await supabase.from("milestones").update(update).eq("id", id);
    fetchData();
  };

  const statusBadge = (s: string) => {
    if (s === "approved") return <Badge className="bg-chart-2/10 text-chart-2 border-chart-2/20">Aprovado</Badge>;
    if (s === "sent") return <Badge variant="secondary">Enviado</Badge>;
    return <Badge variant="outline">Aberto</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Milestones</h1>
          <p className="text-sm text-muted-foreground">Acompanhamento de entregas por projeto</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo Milestone</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Milestone</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Projeto *</Label>
                <Select value={form.project_id} onValueChange={v => setForm({ ...form, project_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Milestone</Label>
                <Select value={form.name} onValueChange={v => setForm({ ...form, name: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MILESTONE_NAMES.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Notas</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSave}>Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Projeto</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado</TableHead>
                <TableHead>Aprovado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {milestones.map(m => (
                <TableRow key={m.id}>
                  <TableCell className="font-medium">{m.projects?.name}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{statusBadge(m.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{m.sent_date || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{m.approved_date || "—"}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {m.status === "open" && <Button variant="outline" size="sm" onClick={() => updateStatus(m.id, "sent")}>Enviar</Button>}
                      {m.status === "sent" && <Button variant="outline" size="sm" onClick={() => updateStatus(m.id, "approved")}>Aprovar</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {milestones.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum milestone</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMilestones;
