import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Search, Copy, Camera, FolderOpen, Trash2, Share2, Lock, Users, Eye, ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, ChevronRight, Archive } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/useLanguage";

interface Company {
  id: string;
  name: string;
  street_name?: string | null;
  street_number?: string | null;
  unit?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zip_code?: string | null;
  country?: string | null;
}

interface Service { id: string; name: string; slug: string; category?: string | null; }
interface Package { id: string; name: string; description: string | null; }

interface DateNote {
  date: string;
  note: string;
  visibility: "freelancer" | "private" | "client";
}

import { PROJECT_STAGES, PROJECT_STAGE_COLORS as SHARED_STAGE_COLORS } from "@/constants/projectStages";

const SERVICE_CATEGORIES_ORDER = ["Design Services", "Drafting & Technical Documentation", "Visualization"];

const PAYMENT_STAGES = [
  "Not Sent", "Waiting Entry", "Entry Paid",
  "Waiting Final", "Paid", "Overdue", "Refunded",
];

const COUNTRIES = ["USA", "Brazil", "Other"];
const CURRENCIES = ["USD", "BRL"];

const emptyForm = {
  company_id: "", stage: "Lead", payment_stage: "Not Sent",
  start_date: "", delivery_date: "", total_value: "",
  street_name: "", street_number: "", unit: "", neighborhood: "",
  city: "", state: "Massachusetts", zip_code: "", country: "USA",
  latitude: "", longitude: "",
  payment_effective_date: "", preview_delivery_date: "",
  preview_sent_date: "", revision_return_date: "", final_delivery_date: "",
  revision_count: "0", currency: "USD", entry_payment_percent: "50",
  package_id: "", square_feet: "", service_type: "",
};

const PROJECT_STAGE_COLORS = SHARED_STAGE_COLORS;

const PAYMENT_STAGE_COLORS: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  "Not Sent": { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
  "Waiting Entry": { dot: "bg-chart-3", bg: "bg-chart-3/15", text: "text-chart-3", border: "border-chart-3/30" },
  "Entry Paid": { dot: "bg-chart-4", bg: "bg-chart-4/15", text: "text-chart-4", border: "border-chart-4/30" },
  "Waiting Final": { dot: "bg-chart-3", bg: "bg-chart-3/15", text: "text-chart-3", border: "border-chart-3/30" },
  "Paid": { dot: "bg-chart-2", bg: "bg-chart-2/15", text: "text-chart-2", border: "border-chart-2/30" },
  "Overdue": { dot: "bg-destructive", bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/30" },
  "Refunded": { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" },
};

const VISIBILITY_OPTIONS = [
  { value: "private", label: "Privado", icon: Lock, color: "text-muted-foreground" },
  { value: "freelancer", label: "Freelancer", icon: Users, color: "text-chart-4" },
  { value: "client", label: "Área do Cliente", icon: Eye, color: "text-chart-2" },
];

const AdminProjects = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [projectServices, setProjectServices] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("all");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [payments, setPayments] = useState<Record<string, number>>({});
  const [milestoneBudgets, setMilestoneBudgets] = useState<Record<string, number>>({});
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [dateNotes, setDateNotes] = useState<DateNote[]>([]);
  const [inlineEditId, setInlineEditId] = useState<string | null>(null);
  const [inlineEditField, setInlineEditField] = useState<"stage" | "payment_stage" | null>(null);
  const [countryStep, setCountryStep] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [completedOpen, setCompletedOpen] = useState(false);

  const toggleSort = (col: string) => {
    if (sortColumn === col) {
      setSortDir(d => d === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(col);
      setSortDir("asc");
    }
  };

  const SortIcon = ({ col }: { col: string }) => {
    if (sortColumn !== col) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/40" />;
    return sortDir === "asc"
      ? <ArrowUp className="h-3 w-3 text-primary" />
      : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  const isBrazil = form.country === "Brazil";
  const areaLabel = isBrazil ? "Área (m²)" : "Metragem (sq ft)";
  const areaUnit = isBrazil ? "m²" : "ft²";
  const areaPlaceholder = isBrazil ? "Ex: 120" : "Ex: 720";

  const handleInlineSave = async (projectId: string, field: "stage" | "payment_stage", value: string) => {
    const { error } = await supabase.from("projects").update({ [field]: value }).eq("id", projectId);
    if (error) { toast.error(error.message); return; }
    toast.success("Atualizado!");
    setInlineEditId(null);
    setInlineEditField(null);
    fetchData();
  };

  const uploadCoverImage = async (projectId: string): Promise<string | null> => {
    if (!coverFile) return editing?.cover_image || null;
    const ext = coverFile.name.split(".").pop();
    const path = `${projectId}.${ext}`;
    const { error } = await supabase.storage.from("portfolio").upload(path, coverFile, { upsert: true });
    if (error) { toast.error("Erro ao enviar imagem"); return null; }
    const { data } = supabase.storage.from("portfolio").getPublicUrl(path);
    return `${data.publicUrl}?t=${Date.now()}`;
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const fetchData = async () => {
    const [projRes, compRes, svcRes, pkgRes, psRes, payRes] = await Promise.all([
      supabase.from("projects").select("*, companies(name)").order("created_at", { ascending: false }),
      supabase.from("companies").select("id, name, street_name, street_number, unit, neighborhood, city, state, zip_code, country").order("name"),
      supabase.from("services").select("*").order("name"),
      supabase.from("packages").select("*"),
      supabase.from("project_services").select("project_id, service_id"),
      supabase.from("payment_milestones").select("project_id, amount, status"),
    ]);
    setProjects(projRes.data || []);
    setCompanies(compRes.data || []);
    setServices(svcRes.data || []);
    setPackages(pkgRes.data || []);

    const psMap: Record<string, string[]> = {};
    (psRes.data || []).forEach((ps: any) => {
      if (!psMap[ps.project_id]) psMap[ps.project_id] = [];
      psMap[ps.project_id].push(ps.service_id);
    });
    setProjectServices(psMap);

    // Use payment_milestones as source of truth
    const payMap: Record<string, number> = {};
    const budgetMap: Record<string, number> = {};
    (payRes.data || []).forEach((m: any) => {
      budgetMap[m.project_id] = (budgetMap[m.project_id] || 0) + Number(m.amount || 0);
      if (m.status === "paid") {
        payMap[m.project_id] = (payMap[m.project_id] || 0) + Number(m.amount || 0);
      }
    });
    setPayments(payMap);
    setMilestoneBudgets(budgetMap);
  };

  useEffect(() => { fetchData(); }, []);

  const copyFromCompany = () => {
    const comp = companies.find(c => c.id === form.company_id);
    if (!comp) { toast.error(t("admin.selectCompanyFirst")); return; }
    setForm(f => ({
      ...f,
      street_name: comp.street_name || "", street_number: comp.street_number || "",
      unit: comp.unit || "", neighborhood: comp.neighborhood || "",
      city: comp.city || "", state: comp.state || "Massachusetts",
      zip_code: comp.zip_code || "", country: comp.country || "USA",
    }));
    toast.success(t("admin.addressCopied"));
  };

  const handleSave = async () => {
    const payload: any = {
      company_id: form.company_id || null,
      service_type: form.service_type?.trim() || "Technical Drafting",
      square_feet: form.square_feet ? Number(form.square_feet) : null,
      stage: form.stage,
      payment_stage: form.payment_stage,
      start_date: form.start_date || null,
      delivery_date: form.delivery_date || null,
      total_value: form.total_value ? Number(form.total_value) : 0,
      street_name: form.street_name || null, street_number: form.street_number || null,
      unit: form.unit || null, neighborhood: form.neighborhood || null,
      city: form.city || null, state: form.state || null,
      zip_code: form.zip_code || null, country: form.country || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
      payment_effective_date: form.payment_effective_date || null,
      preview_delivery_date: form.preview_delivery_date || null,
      preview_sent_date: form.preview_sent_date || null,
      revision_return_date: form.revision_return_date || null,
      final_delivery_date: form.final_delivery_date || null,
      revision_count: Number(form.revision_count) || 0,
      currency: form.currency,
      entry_payment_percent: Number(form.entry_payment_percent) || 50,
      package_id: form.package_id && form.package_id !== "none" ? form.package_id : null,
      date_notes: dateNotes,
    };

    let projectId = editing?.id;
    if (editing) {
      const coverUrl = await uploadCoverImage(editing.id);
      if (coverUrl) payload.cover_image = coverUrl;
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
      if (error) { toast.error(error.message); return; }
      projectId = data.id;
      if (coverFile) {
        const coverUrl = await uploadCoverImage(projectId);
        if (coverUrl) await supabase.from("projects").update({ cover_image: coverUrl }).eq("id", projectId);
      }
    }

    await supabase.from("project_services").delete().eq("project_id", projectId);
    if (selectedServices.length > 0) {
      await supabase.from("project_services").insert(
        selectedServices.map(sid => ({ project_id: projectId, service_id: sid }))
      );
    }

    toast.success(editing ? t("admin.projectUpdated") : t("admin.projectCreated"));
    setDialogOpen(false); setEditing(null); setCoverFile(null); setCoverPreview(null); fetchData();
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    // Delete related records first
    await supabase.from("project_services").delete().eq("project_id", id);
    await supabase.from("activity_log").delete().eq("project_id", id);
    await supabase.from("admin_payments").delete().eq("project_id", id);
    await supabase.from("milestones").delete().eq("project_id", id);
    await supabase.from("project_files").delete().eq("project_id", id);
    await supabase.from("messages").delete().eq("project_id", id);
    await supabase.from("freelancer_assignments").delete().eq("project_id", id);
    await supabase.from("freelancer_contracts").delete().eq("project_id", id);
    await supabase.from("freelancer_deliveries").delete().eq("project_id", id);
    await supabase.from("freelancer_payments").delete().eq("project_id", id);
    await supabase.from("quotes").delete().eq("project_id", id);
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Projeto excluído");
    fetchData();
  };

  const handleDuplicateProject = async (p: any) => {
    const payload: any = {
      company_id: p.company_id,
      service_type: p.service_type || "Technical Drafting",
      square_feet: p.square_feet,
      stage: "Lead",
      payment_stage: "Not Sent",
      start_date: null,
      delivery_date: null,
      total_value: p.total_value || 0,
      street_name: p.street_name,
      street_number: p.street_number,
      unit: p.unit,
      neighborhood: p.neighborhood,
      city: p.city,
      state: p.state,
      zip_code: p.zip_code,
      country: p.country,
      currency: p.currency || "USD",
      entry_payment_percent: p.entry_payment_percent || 50,
      package_id: p.package_id || null,
      revision_count: 0,
    };
    const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
    if (error) { toast.error(error.message); return; }
    // Copy project services
    const existingServices = projectServices[p.id] || [];
    if (existingServices.length > 0) {
      await supabase.from("project_services").insert(
        existingServices.map(sid => ({ project_id: data.id, service_id: sid }))
      );
    }
    toast.success("Projeto duplicado!");
    fetchData();
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setCoverPreview(p.cover_image || null);
    setCoverFile(null);
    setForm({
      company_id: p.company_id || "", stage: p.stage || "Lead",
      payment_stage: p.payment_stage || "Not Sent",
      start_date: p.start_date || "", delivery_date: p.delivery_date || "",
      total_value: p.total_value?.toString() || "",
      street_name: p.street_name || "", street_number: p.street_number || "",
      unit: p.unit || "", neighborhood: p.neighborhood || "",
      city: p.city || "", state: p.state || "Massachusetts",
      zip_code: p.zip_code || "", country: p.country || "USA",
      latitude: p.latitude?.toString() || "", longitude: p.longitude?.toString() || "",
      payment_effective_date: p.payment_effective_date || "",
      preview_delivery_date: p.preview_delivery_date || "",
      preview_sent_date: p.preview_sent_date || "",
      revision_return_date: p.revision_return_date || "",
      final_delivery_date: p.final_delivery_date || "",
      revision_count: p.revision_count?.toString() || "0",
      currency: p.currency || "USD",
      entry_payment_percent: p.entry_payment_percent?.toString() || "50",
      package_id: p.package_id || "",
      square_feet: p.square_feet?.toString() || "",
      service_type: p.service_type || "Technical Drafting",
    });
    setSelectedServices(projectServices[p.id] || []);
    // Load date_notes from project
    const notes = Array.isArray(p.date_notes) ? p.date_notes as DateNote[] : [];
    setDateNotes(notes);
    setCountryStep(false);
    setDialogOpen(true);
  };

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyForm, company_id: companies[0]?.id || "" });
    setSelectedServices([]);
    setCoverFile(null); setCoverPreview(null);
    setDateNotes([]);
    setCountryStep(true);
    setDialogOpen(true);
  };

  const selectCountryForNew = (country: "Brazil" | "USA") => {
    if (country === "Brazil") {
      setForm(f => ({ ...f, country: "Brazil", currency: "BRL", state: "" }));
    } else {
      setForm(f => ({ ...f, country: "USA", currency: "USD", state: "Massachusetts" }));
    }
    setCountryStep(false);
  };

  const addDateNote = () => {
    setDateNotes(prev => [...prev, { date: "", note: "", visibility: "private" }]);
  };

  const updateDateNote = (index: number, field: keyof DateNote, value: string) => {
    setDateNotes(prev => prev.map((n, i) => i === index ? { ...n, [field]: value } : n));
  };

  const removeDateNote = (index: number) => {
    setDateNotes(prev => prev.filter((_, i) => i !== index));
  };

  const totalValue = Number(form.total_value) || 0;
  const entryPercent = Number(form.entry_payment_percent) || 50;
  const entryAmount = totalValue * entryPercent / 100;
  const finalAmount = totalValue - entryAmount;

  const filtered = projects
    .filter(p => {
      const addr = [p.street_number, p.street_name].filter(Boolean).join(" ") || p.display_address || "";
      const name = p.name || "";
      const projectNum = p.project_number || "";
      const searchLower = search.toLowerCase();
      return name.toLowerCase().includes(searchLower) 
        || addr.toLowerCase().includes(searchLower) 
        || (p.companies?.name || "").toLowerCase().includes(searchLower)
        || projectNum.toLowerCase().includes(searchLower);
    })
    .filter(p => stageFilter === "all" || p.stage === stageFilter)
    .filter(p => companyFilter === "all" || p.company_id === companyFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (!sortColumn) return 0;
    const dir = sortDir === "asc" ? 1 : -1;
    switch (sortColumn) {
      case "project": return dir * getProjectDisplayName(a).localeCompare(getProjectDisplayName(b));
      case "client": return dir * ((a.companies?.name || "").localeCompare(b.companies?.name || ""));
      case "stage": return dir * ((a.stage || "").localeCompare(b.stage || ""));
      case "deadline": {
        const da = a.delivery_date ? new Date(a.delivery_date).getTime() : Infinity;
        const db = b.delivery_date ? new Date(b.delivery_date).getTime() : Infinity;
        return dir * (da - db);
      }
      case "budget": return dir * (Number(a.total_value || 0) - Number(b.total_value || 0));
      default: return 0;
    }
  });

  const getProjectDisplayName = (p: any) => {
    const addr = [p.street_number, p.street_name].filter(Boolean).join(" ");
    return addr || p.name || p.display_address || "Untitled Project";
  };

  const getFinancialHealth = (p: any): { icon: string; label: string; color: string } => {
    const budget = milestoneBudgets[p.id] || Number(p.total_value || 0);
    if (budget === 0) return { icon: "⚪", label: "No Budget", color: "text-muted-foreground" };
    const paid = payments[p.id] || 0;
    const rem = budget - paid;
    if (rem <= 0) return { icon: "🟢", label: "Paid", color: "text-chart-2" };
    if (paid > 0) return { icon: "🟡", label: "Partial", color: "text-chart-3" };
    if (p.delivery_date && new Date(p.delivery_date) < new Date()) return { icon: "🔴", label: "Overdue", color: "text-destructive" };
    return { icon: "🔴", label: "Unpaid", color: "text-destructive" };
  };

  const handleArchiveProject = async (id: string) => {
    const { error } = await supabase.from("projects").update({ stage: "Cancelled" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Project archived");
    fetchData();
  };

  // Split projects into 3 groups
  const activeProjects = sorted.filter(p => p.stage !== "Completed");
  const awaitingPayment = sorted.filter(p => {
    if (p.stage !== "Completed") return false;
    const budget = milestoneBudgets[p.id] || Number(p.total_value || 0);
    const paid = payments[p.id] || 0;
    return budget > 0 && (budget - paid) > 0;
  });
  const completedProjects = sorted.filter(p => {
    if (p.stage !== "Completed") return false;
    const budget = milestoneBudgets[p.id] || Number(p.total_value || 0);
    const paid = payments[p.id] || 0;
    return budget === 0 || (budget - paid) <= 0;
  });

  const currencySymbol = (c: string) => c === "BRL" ? "R$" : "$";
  const getCountryFlag = (country: string | null | undefined) => {
    if (country === "Brazil") return "🇧🇷";
    if (country === "USA") return "🇺🇸";
    return "";
  };

  const renderStageBadge = (stage: string, colors: Record<string, { dot: string; bg: string; text: string; border: string }>) => {
    const c = colors[stage] || { dot: "bg-muted-foreground", bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
        <span className={`w-2 h-2 rounded-full ${c.dot}`} />
        {stage || "—"}
      </span>
    );
  };

  const renderProjectRow = (p: any, showArchive = false) => {
    const tv = Number(p.total_value || 0);
    const isBRL = (p.currency || "USD") === "BRL";
    const formattedBudget = isBRL
      ? `R$${tv.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}`
      : `$${tv.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
    const isInlineStage = inlineEditId === p.id && inlineEditField === "stage";
    const isOverdue = p.delivery_date && new Date(p.delivery_date) < new Date() && p.stage !== "Completed";
    const health = getFinancialHealth(p);

    return (
      <TableRow key={p.id} className="group">
        <TableCell>
          <div className="flex items-center gap-3">
            <span className="text-sm" title={health.label}>{health.icon}</span>
            <Avatar className="h-9 w-9 border border-border flex-shrink-0">
              <AvatarImage src={p.cover_image || undefined} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {getProjectDisplayName(p).substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {p.project_number && (
                  <span className="text-[10px] font-mono font-semibold text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">
                    {p.project_number}
                  </span>
                )}
                <p className="text-sm font-medium text-foreground truncate hover:text-primary cursor-pointer" onClick={() => navigate(`/adm/projects/${p.id}`)}>
                  {getProjectDisplayName(p)}
                </p>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {p.service_type || "—"} {p.city ? `· ${p.city}, ${p.state || ""}` : ""}
              </p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <p className="text-sm text-foreground hover:text-primary cursor-pointer truncate" onClick={() => p.company_id && navigate(`/adm/clients/${p.company_id}`)}>
            {p.companies?.name || "—"} {getCountryFlag(p.country)}
          </p>
        </TableCell>
        <TableCell>
          {isInlineStage ? (
            <Select defaultValue={p.stage} onValueChange={v => handleInlineSave(p.id, "stage", v)}>
              <SelectTrigger className="h-8 text-xs w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>{PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-1">
              {renderStageBadge(p.stage || "—", PROJECT_STAGE_COLORS)}
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => { setInlineEditId(p.id); setInlineEditField("stage"); }}>
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          )}
        </TableCell>
        <TableCell>
          {p.delivery_date ? (
            <div className="flex items-center gap-1.5">
              <span className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                {new Date(p.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              {isOverdue && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">⚠ Overdue</span>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </TableCell>
        <TableCell>
          <div>
            <span className="text-sm font-medium text-foreground">{formattedBudget}</span>
            {tv > 0 && (() => {
              const paid = payments[p.id] || 0;
              const rem = Math.max(0, tv - paid);
              return (
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">
                    Rem: {isBRL ? `R$${rem.toLocaleString("pt-BR")}` : `$${rem.toLocaleString("en-US")}`}
                  </span>
                </div>
              );
            })()}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/adm/projects/${p.id}`)} title="Edit"><Pencil className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => handleDuplicateProject(p)} title="Duplicate"><Copy className="h-4 w-4" /></Button>
            {showArchive && (
              <Button variant="ghost" size="icon" onClick={() => handleArchiveProject(p.id)} title="Archive"><Archive className="h-4 w-4 text-muted-foreground" /></Button>
            )}
            <Button variant="ghost" size="icon" onClick={() => handleDeleteProject(p.id)} title="Delete"><Trash2 className="h-4 w-4 text-destructive" /></Button>
          </div>
        </TableCell>
      </TableRow>
    );
  };

  const renderTableHeader = () => (
    <TableHeader>
      <TableRow>
        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("project")}>
          <span className="flex items-center gap-1">Project <SortIcon col="project" /></span>
        </TableHead>
        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("client")}>
          <span className="flex items-center gap-1">Client <SortIcon col="client" /></span>
        </TableHead>
        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("stage")}>
          <span className="flex items-center gap-1">Stage <SortIcon col="stage" /></span>
        </TableHead>
        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("deadline")}>
          <span className="flex items-center gap-1">Deadline <SortIcon col="deadline" /></span>
        </TableHead>
        <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("budget")}>
          <span className="flex items-center gap-1">Budget <SortIcon col="budget" /></span>
        </TableHead>
        <TableHead className="w-[100px]"></TableHead>
      </TableRow>
    </TableHeader>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{t("admin.projects")}</h1>
          <p className="text-sm text-muted-foreground">{t("admin.manageProjects")}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) setEditing(null); }}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />{t("admin.newProject")}</Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="text-lg font-semibold">{editing ? t("admin.editProject") : t("admin.newProject")}</DialogTitle></DialogHeader>
            
            {countryStep && !editing ? (
              <div className="py-8 space-y-6">
                <p className="text-center text-sm text-muted-foreground">Este projeto é para qual país?</p>
                <div className="flex justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => selectCountryForNew("Brazil")}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer bg-card"
                  >
                    <span className="text-5xl">🇧🇷</span>
                    <span className="text-sm font-medium text-foreground">Brasil</span>
                    <span className="text-xs text-muted-foreground">R$ · m²</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => selectCountryForNew("USA")}
                    className="flex flex-col items-center gap-3 p-6 rounded-lg border-2 border-border hover:border-primary transition-colors cursor-pointer bg-card"
                  >
                    <span className="text-5xl">🇺🇸</span>
                    <span className="text-sm font-medium text-foreground">Estados Unidos</span>
                    <span className="text-xs text-muted-foreground">USD · ft²</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="w-full grid grid-cols-4">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="address">{isBrazil ? "Endereço" : "Address"}</TabsTrigger>
                    <TabsTrigger value="dates">Datas & Notas</TabsTrigger>
                    <TabsTrigger value="financial">Financeiro</TabsTrigger>
                  </TabsList>

                  {/* TAB: Info */}
                  <TabsContent value="info" className="space-y-4 mt-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative cursor-pointer" onClick={() => coverInputRef.current?.click()}>
                        <Avatar className="h-20 w-20 border-2 border-border overflow-hidden">
                          <AvatarImage src={coverPreview || undefined} className="object-cover" />
                          <AvatarFallback className="bg-muted text-muted-foreground">
                            <FolderOpen className="h-8 w-8" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1">
                          <Camera className="h-3 w-3" />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">Foto do projeto</p>
                      <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                    </div>

                    {/* Country indicator */}
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50 border border-border">
                      <span className="text-lg">{isBrazil ? "🇧🇷" : "🇺🇸"}</span>
                      <span className="text-sm text-muted-foreground">{isBrazil ? "Brasil — R$ · m²" : "Estados Unidos — USD · ft²"}</span>
                    </div>

                    <div><Label>{t("admin.company")}</Label>
                      <Select value={form.company_id} onValueChange={v => setForm({ ...form, company_id: v })}>
                        <SelectTrigger><SelectValue placeholder={t("admin.select")} /></SelectTrigger>
                        <SelectContent>{companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div><Label>{t("admin.projectStage")}</Label>
                      <Select value={form.stage} onValueChange={v => setForm({ ...form, stage: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Tipo de Serviço</Label>
                        <Input value={form.service_type} onChange={e => setForm({ ...form, service_type: e.target.value })} placeholder="Ex: Remodeling, 3D Kitchen..." />
                      </div>
                      <div><Label>{areaLabel}</Label><Input type="number" value={form.square_feet} onChange={e => setForm({ ...form, square_feet: e.target.value })} placeholder={areaPlaceholder} /></div>
                    </div>
                    <div><Label>{t("admin.package")}</Label>
                      <Select value={form.package_id || "none"} onValueChange={v => setForm({ ...form, package_id: v === "none" ? "" : v })}>
                        <SelectTrigger><SelectValue placeholder={t("admin.select")} /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">{t("admin.none")}</SelectItem>
                          {packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>{t("admin.services")}</Label>
                      <div className="space-y-4 mt-2">
                        {SERVICE_CATEGORIES_ORDER.map(cat => {
                          const catServices = services.filter(s => s.category === cat);
                          if (catServices.length === 0) return null;
                          return (
                            <div key={cat}>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
                              <div className="grid grid-cols-2 gap-2">
                                {catServices.map(s => (
                                  <div key={s.id} className="flex items-center gap-2">
                                    <Checkbox
                                      checked={selectedServices.includes(s.id)}
                                      onCheckedChange={(checked) => {
                                        setSelectedServices(prev =>
                                          checked ? [...prev, s.id] : prev.filter(id => id !== s.id)
                                        );
                                      }}
                                    />
                                    <span className="text-sm">{s.name}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  {/* TAB: Address */}
                  <TabsContent value="address" className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{isBrazil ? "Endereço do Projeto" : t("admin.projectAddress")}</p>
                      <Button type="button" variant="outline" size="sm" onClick={copyFromCompany}>
                        <Copy className="h-3 w-3 mr-1" />{t("admin.copyFromCompany")}
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><Label>{isBrazil ? "Número" : t("admin.number")}</Label><Input value={form.street_number} onChange={e => setForm({ ...form, street_number: e.target.value })} placeholder={isBrazil ? "123" : "14"} /></div>
                      <div className="col-span-2"><Label>{isBrazil ? "Rua" : t("admin.street")}</Label><Input value={form.street_name} onChange={e => setForm({ ...form, street_name: e.target.value })} placeholder={isBrazil ? "Rua das Flores" : "Meadowbrook Rd"} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>{isBrazil ? "Complemento" : t("admin.unit")}</Label><Input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} /></div>
                      <div><Label>{isBrazil ? "Bairro" : t("admin.neighborhood")}</Label><Input value={form.neighborhood} onChange={e => setForm({ ...form, neighborhood: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><Label>{isBrazil ? "Cidade" : t("admin.city")}</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                      <div><Label>{isBrazil ? "Estado" : t("admin.state")}</Label><Input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder={isBrazil ? "SP" : "Massachusetts"} /></div>
                      <div><Label>{isBrazil ? "CEP" : t("admin.zip")}</Label><Input value={form.zip_code} onChange={e => setForm({ ...form, zip_code: e.target.value })} placeholder={isBrazil ? "00000-000" : "02101"} /></div>
                    </div>
                    <div><Label>{isBrazil ? "País" : t("admin.countryLabel")}</Label>
                      <Select value={form.country} onValueChange={v => {
                        const newCurrency = v === "Brazil" ? "BRL" : "USD";
                        const newState = v === "Brazil" ? "" : "Massachusetts";
                        setForm({ ...form, country: v, currency: newCurrency, state: newState });
                      }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{COUNTRIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  {/* TAB: Dates & Notes */}
                  <TabsContent value="dates" className="space-y-4 mt-4">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Start Date</Label>
                        <Input type="date" className="w-full" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Project Deadline</Label>
                        <Input type="date" className="w-full" value={form.delivery_date} onChange={e => setForm({ ...form, delivery_date: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Preview Delivery</Label>
                        <Input type="date" className="w-full" value={form.preview_delivery_date} onChange={e => setForm({ ...form, preview_delivery_date: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Client Revision Return</Label>
                        <Input type="date" className="w-full" value={form.revision_return_date} onChange={e => setForm({ ...form, revision_return_date: e.target.value })} />
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Final Delivery</Label>
                        <Input type="date" className="w-full" value={form.final_delivery_date} onChange={e => setForm({ ...form, final_delivery_date: e.target.value })} />
                      </div>
                    </div>

                    <Separator />
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Histórico / Notas de Acompanhamento</p>
                      <Button type="button" variant="outline" size="sm" onClick={addDateNote}>
                        <Plus className="h-3 w-3 mr-1" /> Adicionar Nota
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registre cada evento do projeto com data, descrição e quem pode ver.
                    </p>

                    {dateNotes.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground text-sm border border-dashed rounded-md">
                        Nenhuma nota registrada. Clique em "Adicionar Nota" para começar.
                      </div>
                    )}

                    <div className="space-y-3">
                      {dateNotes.sort((a, b) => (a.date || "").localeCompare(b.date || "")).map((note, idx) => {
                        const visOpt = VISIBILITY_OPTIONS.find(v => v.value === note.visibility) || VISIBILITY_OPTIONS[0];
                        const VisIcon = visOpt.icon;
                        return (
                          <div key={idx} className="grid grid-cols-[140px_1fr_160px_40px] items-center gap-3 p-3 rounded-md border bg-muted/30">
                            <Input type="date" value={note.date} onChange={e => updateDateNote(idx, "date", e.target.value)} className="text-sm" />
                            <Input value={note.note} onChange={e => updateDateNote(idx, "note", e.target.value)} placeholder="Ex: Cliente pagou entrada, Início do 3D..." className="text-sm" />
                            <Select value={note.visibility} onValueChange={v => updateDateNote(idx, "visibility", v)}>
                              <SelectTrigger className="text-sm">
                                <div className="flex items-center gap-1.5">
                                  <VisIcon className={`h-3.5 w-3.5 ${visOpt.color}`} />
                                  <span>{visOpt.label}</span>
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {VISIBILITY_OPTIONS.map(v => (
                                  <SelectItem key={v.value} value={v.value}>
                                    <div className="flex items-center gap-1.5">
                                      <v.icon className={`h-3.5 w-3.5 ${v.color}`} />
                                      <span>{v.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeDateNote(idx)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* TAB: Financial */}
                  <TabsContent value="financial" className="space-y-4 mt-4">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("admin.financials")}</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>{t("admin.currency")}</Label>
                        <Select value={form.currency} onValueChange={v => setForm({ ...form, currency: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>{CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div><Label>{t("admin.totalValue")} ({isBrazil ? `R$/${areaUnit}` : `USD/${areaUnit}`})</Label><Input type="number" value={form.total_value} onChange={e => setForm({ ...form, total_value: e.target.value })} /></div>
                    </div>
                    <div><Label>{t("admin.paymentStage")}</Label>
                      <Select value={form.payment_stage} onValueChange={v => setForm({ ...form, payment_stage: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{PAYMENT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-md bg-chart-3/10 border border-chart-3/20">
                        <p className="text-xs text-muted-foreground">{t("admin.entryAmount")} (50%)</p>
                        <p className="text-lg font-semibold text-chart-3">{currencySymbol(form.currency)}{entryAmount.toLocaleString()}</p>
                      </div>
                      <div className="p-3 rounded-md bg-chart-4/10 border border-chart-4/20">
                        <p className="text-xs text-muted-foreground">{t("admin.finalAmount")} (50%)</p>
                        <p className="text-lg font-semibold text-chart-4">{currencySymbol(form.currency)}{finalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button className="w-full mt-4" onClick={handleSave}>{editing ? t("admin.save") : t("admin.create")}</Button>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder={t("admin.search")} className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder={t("admin.stage")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.allStages")}</SelectItem>
            {PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={companyFilter} onValueChange={setCompanyFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder={t("admin.company")} /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("admin.allCompanies")}</SelectItem>
            {companies.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Section: Active Projects */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Active Projects</h2>
          <Badge variant="secondary" className="text-xs">{activeProjects.length}</Badge>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              {renderTableHeader()}
              <TableBody>
                {activeProjects.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No active projects</TableCell></TableRow>
                )}
                {activeProjects.map(p => renderProjectRow(p))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Section: Awaiting Payment */}
      {awaitingPayment.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-chart-3 uppercase tracking-wider">🟡 Awaiting Payment</h2>
            <Badge variant="secondary" className="text-xs">{awaitingPayment.length}</Badge>
          </div>
          <Card className="border-chart-3/30">
            <CardContent className="p-0">
              <Table>
                {renderTableHeader()}
                <TableBody>
                  {awaitingPayment.map(p => renderProjectRow(p))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section: Completed Projects (Collapsible) */}
      {completedProjects.length > 0 && (
        <Collapsible open={completedOpen} onOpenChange={setCompletedOpen}>
          <div className="space-y-2">
            <CollapsibleTrigger className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
              {completedOpen ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
              <h2 className="text-sm font-semibold text-chart-2 uppercase tracking-wider">🟢 Completed Projects</h2>
              <Badge variant="secondary" className="text-xs">{completedProjects.length}</Badge>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="border-chart-2/30">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Project ID</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Completed</TableHead>
                        <TableHead>Total Paid</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedProjects.map((p: any) => {
                        const paid = payments[p.id] || 0;
                        const isBRL = (p.currency || "USD") === "BRL";
                        const formattedPaid = isBRL
                          ? `R$${paid.toLocaleString("pt-BR")}`
                          : `$${paid.toLocaleString("en-US")}`;
                        return (
                          <TableRow key={p.id} className="group">
                            <TableCell>
                              <span className="text-xs font-mono text-muted-foreground">{p.project_number || "—"}</span>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm font-medium text-foreground hover:text-primary cursor-pointer" onClick={() => navigate(`/adm/projects/${p.id}`)}>
                                {getProjectDisplayName(p)}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p className="text-sm text-foreground">{p.companies?.name || "—"} {getCountryFlag(p.country)}</p>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {p.final_delivery_date
                                  ? new Date(p.final_delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                  : p.updated_at
                                    ? new Date(p.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                                    : "—"}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-medium text-chart-2">{formattedPaid}</span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="ghost" size="icon" onClick={() => navigate(`/adm/projects/${p.id}`)} title="View"><Eye className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" onClick={() => handleArchiveProject(p.id)} title="Archive"><Archive className="h-4 w-4 text-muted-foreground" /></Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </div>
        </Collapsible>
      )}
    </div>
  );
};

export default AdminProjects;
