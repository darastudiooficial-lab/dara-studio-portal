import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, CreditCard, Package, RotateCcw, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const LOG_TYPES = [
  { value: "payment", label: "Pagamento", icon: CreditCard },
  { value: "delivery", label: "Entrega", icon: Package },
  { value: "revision", label: "Revisão", icon: RotateCcw },
  { value: "internal_note", label: "Nota Interna", icon: StickyNote },
];

const AdminActivity = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ project_id: "", log_type: "internal_note", description: "" });

  const fetchData = async () => {
    const [logRes, projRes] = await Promise.all([
      supabase.from("activity_log").select("*, projects(name)").order("log_date", { ascending: false }).limit(100),
      supabase.from("projects").select("id, name").order("name"),
    ]);
    setLogs(logRes.data || []);
    setProjects(projRes.data || []);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async () => {
    if (!form.project_id || !form.description.trim()) { toast.error("Projeto e descrição são obrigatórios"); return; }
    const { error } = await supabase.from("activity_log").insert({
      project_id: form.project_id, log_type: form.log_type, description: form.description,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Registro adicionado");
    setDialogOpen(false); setForm({ project_id: "", log_type: "internal_note", description: "" }); fetchData();
  };

  const getTypeInfo = (type: string) => LOG_TYPES.find(t => t.value === type) || LOG_TYPES[3];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Log de Atividades</h1>
          <p className="text-sm text-muted-foreground">Histórico de ações dos projetos</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Novo Registro</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo Registro</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Projeto *</Label>
                <Select value={form.project_id} onValueChange={v => setForm({ ...form, project_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Tipo</Label>
                <Select value={form.log_type} onValueChange={v => setForm({ ...form, log_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{LOG_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Descrição *</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <Button className="w-full" onClick={handleSave}>Registrar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {logs.map(log => {
          const typeInfo = getTypeInfo(log.log_type);
          const Icon = typeInfo.icon;
          return (
            <Card key={log.id}>
              <CardContent className="flex items-start gap-4 py-4">
                <div className="p-2 rounded-lg bg-muted">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">{log.projects?.name}</span>
                    <Badge variant="outline" className="text-xs">{typeInfo.label}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{log.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.log_date), "dd/MM/yyyy")}
                </span>
              </CardContent>
            </Card>
          );
        })}
        {logs.length === 0 && (
          <div className="text-center text-muted-foreground py-12">Nenhum registro de atividade</div>
        )}
      </div>
    </div>
  );
};

export default AdminActivity;
