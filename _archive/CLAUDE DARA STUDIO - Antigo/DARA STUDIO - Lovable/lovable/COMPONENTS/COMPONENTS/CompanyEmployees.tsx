import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, Pencil, X, Check, UserPlus } from "lucide-react";
import { toast } from "sonner";

interface Employee {
  id: string;
  company_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  linkedin: string | null;
}

const emptyEmployee = { name: "", phone: "", email: "", instagram: "", linkedin: "" };

const CompanyEmployees = ({ companyId }: { companyId: string }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyEmployee);

  const fetch = async () => {
    const { data } = await supabase
      .from("company_employees")
      .select("*")
      .eq("company_id", companyId)
      .order("name");
    setEmployees((data as Employee[]) || []);
  };

  useEffect(() => { fetch(); }, [companyId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Nome é obrigatório"); return; }

    if (editingId) {
      const { error } = await supabase.from("company_employees").update({
        name: form.name, phone: form.phone || null, email: form.email || null,
        instagram: form.instagram || null, linkedin: form.linkedin || null,
      }).eq("id", editingId);
      if (error) { toast.error(error.message); return; }
      toast.success("Funcionário atualizado");
    } else {
      const { error } = await supabase.from("company_employees").insert({
        company_id: companyId, name: form.name,
        phone: form.phone || null, email: form.email || null,
        instagram: form.instagram || null, linkedin: form.linkedin || null,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Funcionário adicionado");
    }
    setForm(emptyEmployee); setAdding(false); setEditingId(null);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir funcionário?")) return;
    const { error } = await supabase.from("company_employees").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Funcionário excluído"); fetch();
  };

  const startEdit = (e: Employee) => {
    setEditingId(e.id);
    setAdding(true);
    setForm({ name: e.name, phone: e.phone || "", email: e.email || "", instagram: e.instagram || "", linkedin: e.linkedin || "" });
  };

  const cancel = () => { setAdding(false); setEditingId(null); setForm(emptyEmployee); };

  return (
    <div className="space-y-4">
      {employees.length === 0 && !adding && (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhum funcionário cadastrado</p>
      )}

      {employees.map(emp => (
        <div key={emp.id} className="flex items-start justify-between p-3 rounded-md border border-border bg-muted/30">
          <div className="space-y-0.5">
            <p className="font-medium text-sm text-foreground">{emp.name}</p>
            {emp.email && <p className="text-xs text-muted-foreground">{emp.email}</p>}
            {emp.phone && <p className="text-xs text-muted-foreground">{emp.phone}</p>}
            <div className="flex gap-3 text-xs text-muted-foreground">
              {emp.instagram && <span>@{emp.instagram.replace("@", "")}</span>}
              {emp.linkedin && <span>LinkedIn</span>}
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(emp)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(emp.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
          </div>
        </div>
      ))}

      {adding ? (
        <div className="space-y-3 p-3 rounded-md border border-border">
          <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Instagram</Label><Input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@perfil" /></div>
            <div><Label>LinkedIn</Label><Input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="URL" /></div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}><Check className="h-3.5 w-3.5 mr-1" />{editingId ? "Salvar" : "Adicionar"}</Button>
            <Button size="sm" variant="outline" onClick={cancel}><X className="h-3.5 w-3.5 mr-1" />Cancelar</Button>
          </div>
        </div>
      ) : (
        <Button variant="outline" size="sm" className="w-full" onClick={() => setAdding(true)}>
          <UserPlus className="h-4 w-4 mr-2" />Adicionar Funcionário
        </Button>
      )}
    </div>
  );
};

export default CompanyEmployees;
