import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Pencil, Trash2, Search, Camera, Building2, Users, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import CompanyEmployees from "@/components/admin/CompanyEmployees";
import { getCountryFlag, getLanguageLabel } from "@/utils/countryFlags";

interface Company {
  id: string;
  name: string;
  owner_name: string | null;
  email: string | null;
  personal_email: string | null;
  phone: string | null;
  company_type: string | null;
  country: string | null;
  status: string | null;
  website: string | null;
  instagram: string | null;
  personal_instagram: string | null;
  linkedin: string | null;
  street_name: string | null;
  street_number: string | null;
  unit: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  avatar_url: string | null;
  language: string | null;
}

const TYPES = ["Construtora", "Cliente Final", "Real Estate", "Builder", "Contractor", "Client", "Architect", "Engineering"];
const COUNTRIES = ["USA", "Brazil", "Other"];
const STATUSES = ["active", "inactive"];

const LANGUAGES = [
  { value: "en", label: "English 🇺🇸" },
  { value: "pt", label: "Portuguese 🇧🇷" },
];

const emptyForm = {
  name: "", owner_name: "", email: "", personal_email: "", phone: "",
  company_type: "Client", country: "USA", status: "active", language: "en",
  website: "", instagram: "", personal_instagram: "", linkedin: "",
  street_name: "", street_number: "", unit: "", neighborhood: "",
  city: "", state: "", zip_code: "", suggested_password: "",
};

const AdminCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCountry, setFilterCountry] = useState<string>("all");
  const [groupBy, setGroupBy] = useState<"none" | "country" | "company_type" | "city">("none");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Company | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [employeesDialogOpen, setEmployeesDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const fetchCompanies = async () => {
    const { data } = await supabase.from("companies").select("*").order("name");
    setCompanies((data as Company[]) || []);
  };

  useEffect(() => { fetchCompanies(); }, []);

  const uploadAvatar = async (companyId: string): Promise<string | null> => {
    if (!avatarFile) return editing?.avatar_url || null;
    const ext = avatarFile.name.split(".").pop();
    const path = `${companyId}.${ext}`;
    const { error } = await supabase.storage.from("company-avatars").upload(path, avatarFile, { upsert: true });
    if (error) { toast.error("Erro ao enviar imagem"); return null; }
    const { data } = supabase.storage.from("company-avatars").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const payload: any = {
      name: form.name || null, owner_name: form.owner_name || null,
      email: form.email || null, personal_email: form.personal_email || null,
      phone: form.phone || null,
      company_type: form.company_type, country: form.country, status: form.status, language: form.language,
      website: form.website || null,
      instagram: form.instagram || null, personal_instagram: form.personal_instagram || null,
      linkedin: form.linkedin || null,
      street_name: form.street_name || null, street_number: form.street_number || null,
      unit: form.unit || null, neighborhood: form.neighborhood || null,
      city: form.city || null, state: form.state || null, zip_code: form.zip_code || null,
    };

    let companyId = editing?.id;

    if (editing) {
      const avatarUrl = await uploadAvatar(editing.id);
      if (avatarUrl) payload.avatar_url = avatarUrl;
      const { error } = await supabase.from("companies").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      companyId = editing.id;
      toast.success("Company updated");
    } else {
      const { data, error } = await supabase.from("companies").insert({ ...payload, name: payload.name || "No name" }).select("id").single();
      if (error) { toast.error(error.message); return; }
      companyId = data.id;
      if (avatarFile) {
        const avatarUrl = await uploadAvatar(companyId);
        if (avatarUrl) {
          await supabase.from("companies").update({ avatar_url: avatarUrl }).eq("id", companyId);
        }
      }
      toast.success("Company created");
    }

    // Create client login account if password is provided
    if (form.suggested_password && form.email && companyId) {
      try {
        const { data: fnData, error: fnError } = await supabase.functions.invoke("create-client-account", {
          body: {
            email: form.email,
            password: form.suggested_password,
            full_name: form.owner_name || form.name,
            company_id: companyId,
          },
        });
        if (fnError) {
          toast.error(`Account error: ${fnError.message}`);
        } else if (fnData?.error) {
          toast.error(`Account error: ${fnData.error}`);
        } else {
          toast.success(`Client login created: ${form.email}`);
        }
      } catch (err: any) {
        toast.error(`Failed to create client login: ${err.message}`);
      }
    }

    setDialogOpen(false); setEditing(null); setForm(emptyForm);
    setAvatarFile(null); setAvatarPreview(null);
    fetchCompanies();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Empresa excluída"); fetchCompanies();
  };

  const openEdit = (c: Company) => {
    setEditing(c);
    setAvatarPreview(c.avatar_url || null);
    setAvatarFile(null);
    setForm({
      name: c.name || "", owner_name: c.owner_name || "", email: c.email || "",
      personal_email: c.personal_email || "",
      phone: c.phone || "",
      company_type: c.company_type || "Client", country: c.country || "USA", status: c.status || "active", language: (c as any).language || "en",
      website: c.website || "",
      instagram: c.instagram || "", personal_instagram: c.personal_instagram || "",
      linkedin: c.linkedin || "",
      street_name: c.street_name || "", street_number: c.street_number || "", unit: c.unit || "",
      neighborhood: c.neighborhood || "", city: c.city || "", state: c.state || "", zip_code: c.zip_code || "",
      suggested_password: "",
    });
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditing(null); setForm(emptyForm);
    setAvatarFile(null); setAvatarPreview(null);
    setDialogOpen(true);
  };

  const openEmployees = (c: Company) => {
    setSelectedCompany(c);
    setEmployeesDialogOpen(true);
  };




  const filtered = companies.filter(c => {
    const matchSearch = (c.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.owner_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.city || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const matchCountry = filterCountry === "all" || c.country === filterCountry;
    return matchSearch && matchStatus && matchCountry;
  });

  const grouped = () => {
    if (groupBy === "none") return { "": filtered };
    const map: Record<string, Company[]> = {};
    filtered.forEach(c => {
      const key = (c as any)[groupBy] || "Sem definição";
      if (!map[key]) map[key] = [];
      map[key].push(c);
    });
    return Object.fromEntries(Object.entries(map).sort(([a], [b]) => a.localeCompare(b)));
  };

  const getInitials = (name: string) => {
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Empresas</h1>
          <p className="text-sm text-muted-foreground">Gerencie seus clientes e parceiros</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); setForm(emptyForm); setAvatarFile(null); setAvatarPreview(null); } }}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Nova Empresa</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Editar Empresa" : "Nova Empresa"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Avatar Upload */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <Avatar className="h-20 w-20 border-2 border-border">
                    <AvatarImage src={avatarPreview || undefined} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-lg">
                      {form.name ? getInitials(form.name) : <Building2 className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                    <Camera className="h-3 w-3" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Clique para adicionar foto</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </div>

              {/* Section 1 — Responsável (FIRST) */}
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Responsável</p>
              <div><Label>Nome do Responsável</Label><Input value={form.owner_name} onChange={e => setForm({ ...form, owner_name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Telefone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>Email Pessoal</Label><Input type="email" value={form.personal_email} onChange={e => setForm({ ...form, personal_email: e.target.value })} placeholder="email@pessoal.com" /></div>
              </div>
              <div><Label>Instagram Pessoal</Label><Input value={form.personal_instagram} onChange={e => setForm({ ...form, personal_instagram: e.target.value })} placeholder="@pessoal" /></div>

              <Separator />
              {/* Section 2 — Empresa (AFTER) */}
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Empresa</p>
              <div><Label>Nome da Empresa</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Tipo</Label>
                  <Select value={form.company_type} onValueChange={v => setForm({ ...form, company_type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s === "active" ? "Ativo" : "Inativo"}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Language</Label>
                  <Select value={form.language} onValueChange={v => setForm({ ...form, language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Email Profissional</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="contato@empresa.com" /></div>
              <div><Label>Instagram Profissional</Label><Input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="@empresa" /></div>
              <div><Label>Website</Label><Input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://" /></div>
              <div><Label>LinkedIn</Label><Input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="URL" /></div>

              <Separator />
              {/* Section 3 — Client Area */}
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Área do Cliente</p>
              <div className="p-3 rounded-md bg-muted border border-border space-y-2">
                <p className="text-xs text-muted-foreground">Login e senha para acesso à área do cliente</p>
                <div><Label>Login (Email)</Label><Input value={form.email} disabled className="bg-background" /></div>
                <div><Label>Senha Sugerida</Label>
                  <div className="flex gap-2">
                    <Input value={form.suggested_password || ""} onChange={e => setForm({ ...form, suggested_password: e.target.value })} placeholder="Senha padrão" />
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                      const pwd = `Dara${Math.random().toString(36).slice(2, 8)}!`;
                      setForm({ ...form, suggested_password: pwd });
                    }}>Gerar</Button>
                  </div>
                </div>
              </div>

              <Separator />
              {/* Section 4 — Address */}
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Endereço</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2"><Label>Rua</Label><Input value={form.street_name} onChange={e => setForm({ ...form, street_name: e.target.value })} /></div>
                <div><Label>Número</Label><Input value={form.street_number} onChange={e => setForm({ ...form, street_number: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Complemento</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
                <div><Label>Bairro</Label><Input value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div><Label>Cidade</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label>Estado</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} /></div>
                <div><Label>CEP</Label><Input value={form.zip_code} onChange={e => setForm({ ...form, zip_code: e.target.value })} /></div>
              </div>
              <div><Label>País</Label>
                <Select value={form.country} onValueChange={v => setForm({ ...form, country: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <Button className="w-full" onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar empresa..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">✅ Active</SelectItem>
            <SelectItem value="inactive">⛔ Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCountry} onValueChange={setFilterCountry}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Country" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="USA">🇺🇸 USA</SelectItem>
            <SelectItem value="Brazil">🇧🇷 Brazil</SelectItem>
          </SelectContent>
        </Select>
        <Select value={groupBy} onValueChange={v => setGroupBy(v as any)}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Agrupar por" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Sem agrupamento</SelectItem>
            <SelectItem value="country">País</SelectItem>
            <SelectItem value="company_type">Tipo</SelectItem>
            <SelectItem value="city">Cidade</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {Object.entries(grouped()).map(([group, items]) => (
        <Card key={group}>
          {group && (
            <div className="px-6 pt-4 pb-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{group}</h3>
            </div>
          )}
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Responsável / Empresa</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={c.avatar_url || undefined} />
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {getInitials(c.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">
                            {c.owner_name || "—"} {getCountryFlag(c.country)}
                          </p>
                          <p className="text-xs text-muted-foreground">{c.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{c.company_type}</TableCell>
                    <TableCell className="text-muted-foreground">{c.city ? `${c.city}, ${c.state || ""}` : "—"}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "active" ? "default" : "secondary"}>
                        {c.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEmployees(c)} title="Funcionários"><Users className="h-4 w-4 mr-1" /><span className="text-xs">Funcionários</span></Button>
                        <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {items.length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma empresa encontrada</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Employees Dialog */}
      <Dialog open={employeesDialogOpen} onOpenChange={setEmployeesDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Funcionários — {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          {selectedCompany && <CompanyEmployees companyId={selectedCompany.id} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCompanies;
