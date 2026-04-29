import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Building2, Calendar, DollarSign, FileImage, FolderOpen,
  MessageSquare, ShieldCheck, Download, Star, Clock, MapPin, Ruler,
  CreditCard, Receipt, Ticket, Globe, Languages, Mail, Phone, User,
  Plus, Save, Trash2, Lock, Users, Eye, Upload, StickyNote, Monitor,
  CheckCircle2, AlertTriangle, XCircle, ExternalLink, Hash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { getCountryFlag, getLanguageLabel } from "@/utils/countryFlags";
import { toast } from "sonner";
import ProjectKanbanBoard from "@/components/admin/ProjectKanbanBoard";
import { Progress } from "@/components/ui/progress";
import { PROJECT_STAGES } from "@/constants/projectStages";

const VISIBILITY_OPTIONS = [
  { value: "private", label: "Private", icon: Lock, color: "text-muted-foreground" },
  { value: "freelancer", label: "Team", icon: Users, color: "text-chart-4" },
  { value: "client", label: "Client Visible", icon: Eye, color: "text-chart-2" },
];

const PERMIT_STATUSES = ["Not Submitted", "Submitted", "Approved", "Rejected"];

interface DateNote {
  date: string;
  note: string;
  visibility: "private" | "freelancer" | "client";
}

const AdminProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [drawings, setDrawings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [allServices, setAllServices] = useState<any[]>([]);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [activityLog, setActivityLog] = useState<any[]>([]);
  const [paymentMilestones, setPaymentMilestones] = useState<any[]>([]);
  const [homeowners, setHomeowners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Editable project fields
  const [form, setForm] = useState<any>({});
  const [dateNotes, setDateNotes] = useState<DateNote[]>([]);
  const [internalNotes, setInternalNotes] = useState("");

  const loadData = useCallback(async () => {
    if (!id) return;
    const [proj, f, d, pay, msg, ms, tk, svc, allSvc, psvc, logs, pmRes, hoRes] = await Promise.all([
      supabase.from("projects").select("*, companies(*)").eq("id", id).single(),
      supabase.from("project_files").select("*").eq("project_id", id).order("created_at", { ascending: false }),
      supabase.from("drawing_versions").select("*").eq("project_id", id).order("drawing_name").order("version_number", { ascending: false }),
      supabase.from("admin_payments").select("*").eq("project_id", id).order("created_at", { ascending: false }),
      supabase.from("messages").select("*").eq("project_id", id).order("created_at", { ascending: true }),
      supabase.from("milestones").select("*").eq("project_id", id).order("created_at"),
      supabase.from("client_tickets").select("*, companies(name)").eq("project_id", id).order("updated_at", { ascending: false }),
      supabase.from("project_services").select("service_id, services(name, category)").eq("project_id", id),
      supabase.from("services").select("*").order("category").order("name"),
      supabase.from("project_services").select("service_id").eq("project_id", id),
      supabase.from("activity_log").select("*").eq("project_id", id).order("log_date", { ascending: false }),
      supabase.from("payment_milestones").select("*").eq("project_id", id).order("created_at"),
      supabase.from("project_homeowners").select("*").eq("project_id", id).order("created_at"),
    ]);

    const p = proj.data;
    setProject(p);
    setFiles(f.data || []);
    setDrawings(d.data || []);
    setPayments(pay.data || []);
    setMessages(msg.data || []);
    setMilestones(ms.data || []);
    setTickets(tk.data || []);
    setServices((svc.data || []).map((s: any) => s.services).filter(Boolean));
    setAllServices(allSvc.data || []);
    setSelectedServiceIds((psvc.data || []).map((s: any) => s.service_id));
    setActivityLog(logs.data || []);
    setPaymentMilestones(pmRes.data || []);
    setHomeowners(hoRes.data || []);
    if (p) {
      setForm({
        stage: p.stage || "Lead",
        service_type: p.service_type || "",
        square_feet: p.square_feet?.toString() || "",
        start_date: p.start_date || "",
        delivery_date: p.delivery_date || "",
        preview_delivery_date: p.preview_delivery_date || "",
        revision_return_date: p.revision_return_date || "",
        final_delivery_date: p.final_delivery_date || "",
        total_value: p.total_value?.toString() || "",
        currency: p.currency || "USD",
        entry_payment_percent: p.entry_payment_percent?.toString() || "50",
        payment_stage: p.payment_stage || "Not Sent",
        street_number: p.street_number || "",
        street_name: p.street_name || "",
        city: p.city || "",
        state: p.state || "",
        zip_code: p.zip_code || "",
        country: p.country || "USA",
        homeowner_name: (p as any).homeowner_name || "",
        homeowner_phone: (p as any).homeowner_phone || "",
        homeowner_email: (p as any).homeowner_email || "",
        homeowner_address: (p as any).homeowner_address || "",
      });
      setDateNotes(Array.isArray(p.date_notes) ? (p.date_notes as unknown as DateNote[]) : []);
      setInternalNotes(p.internal_notes || "");
    }
    setLoading(false);
    setHasChanges(false);
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  // Realtime: refresh when payments change
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`project-payments-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'admin_payments', filter: `project_id=eq.${id}` }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payment_milestones', filter: `project_id=eq.${id}` }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, loadData]);

  const updateForm = (field: string, value: string) => {
    setForm((f: any) => ({ ...f, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    const payload: any = {
      stage: form.stage,
      service_type: form.service_type || null,
      square_feet: form.square_feet ? Number(form.square_feet) : null,
      start_date: form.start_date || null,
      delivery_date: form.delivery_date || null,
      preview_delivery_date: form.preview_delivery_date || null,
      revision_return_date: form.revision_return_date || null,
      final_delivery_date: form.final_delivery_date || null,
      total_value: form.total_value ? Number(form.total_value) : 0,
      currency: form.currency,
      entry_payment_percent: Number(form.entry_payment_percent) || 50,
      payment_stage: form.payment_stage,
      internal_notes: internalNotes || null,
      date_notes: dateNotes,
      street_number: form.street_number || null,
      street_name: form.street_name || null,
      city: form.city || null,
      state: form.state || null,
      zip_code: form.zip_code || null,
      country: form.country || null,
      homeowner_name: form.homeowner_name || null,
      homeowner_phone: form.homeowner_phone || null,
      homeowner_email: form.homeowner_email || null,
      homeowner_address: form.homeowner_address || null,
    };

    const { error } = await supabase.from("projects").update(payload).eq("id", id);
    if (error) { toast.error(error.message); setSaving(false); return; }

    // Sync services
    await supabase.from("project_services").delete().eq("project_id", id);
    if (selectedServiceIds.length > 0) {
      await supabase.from("project_services").insert(
        selectedServiceIds.map(sid => ({ project_id: id, service_id: sid }))
      );
    }

    toast.success("Project saved!");
    setSaving(false);
    loadData();
  };

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!project) return <div className="p-6 text-muted-foreground">Project not found</div>;

  const totalPaidPayments = payments.filter(p => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const totalPaidMilestones = paymentMilestones.filter(m => m.status === "paid").reduce((s: number, m: any) => s + Number(m.amount || 0), 0);
  const totalPaid = totalPaidPayments + totalPaidMilestones;
  const totalValue = Number(form.total_value || 0);
  const isBRL = (form.currency || "USD") === "BRL";
  const fmtVal = (v: number) => isBRL
    ? `R$${v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const entryPct = Number(form.entry_payment_percent || 50);
  const entryAmt = totalValue * entryPct / 100;
  const finalAmt = totalValue - entryAmt;
  const isOverdue = project.delivery_date && new Date(project.delivery_date) < new Date() && project.stage !== "Completed";
  const areaUnit = project.country === "Brazil" ? "m²" : "ft²";

  const remaining = Math.max(0, totalValue - totalPaid);
  const paidPct = totalValue > 0 ? Math.round((totalPaid / totalValue) * 100) : 0;

  // Use form values (editable) for address display
  const addrStreet = [form.street_number, form.street_name].filter(Boolean).join(" ");
  const fullAddress = [addrStreet, form.city, form.state, form.country].filter(Boolean).join(", ");
  const projectTitle = addrStreet || project.name || "Untitled Project";
  const projectNumber = project.project_number || "";

  // Google Maps link from form (live updated)
  const mapsQuery = [form.street_number, form.street_name, form.city, form.state, form.zip_code].filter(Boolean).join("+");
  const mapsUrl = mapsQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}` : null;

  // Health status
  const getHealthStatus = () => {
    if (project.stage === "Completed") return { label: "Completed", color: "text-chart-2", icon: CheckCircle2, bg: "bg-chart-2/15" };
    if (project.stage === "Cancelled") return { label: "Cancelled", color: "text-muted-foreground", icon: XCircle, bg: "bg-muted" };
    if (isOverdue) return { label: "Delayed", color: "text-destructive", icon: XCircle, bg: "bg-destructive/15" };
    const deadline = project.delivery_date ? new Date(project.delivery_date) : null;
    if (deadline) {
      const daysLeft = (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      if (daysLeft <= 7 && daysLeft > 0) return { label: "Attention Needed", color: "text-chart-3", icon: AlertTriangle, bg: "bg-chart-3/15" };
    }
    return { label: "On Track", color: "text-chart-2", icon: CheckCircle2, bg: "bg-chart-2/15" };
  };
  const health = getHealthStatus();

  // Group drawings by name
  const drawingGroups: Record<string, any[]> = {};
  drawings.forEach(d => {
    if (!drawingGroups[d.drawing_name]) drawingGroups[d.drawing_name] = [];
    drawingGroups[d.drawing_name].push(d);
  });

  const paymentStatusColor = (status: string) => {
    if (status === "paid") return "bg-chart-2/15 text-chart-2 border-chart-2/30";
    if (status === "pending") return "bg-chart-3/15 text-chart-3 border-chart-3/30";
    return "bg-destructive/15 text-destructive border-destructive/30";
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds(prev =>
      prev.includes(serviceId) ? prev.filter(id => id !== serviceId) : [...prev, serviceId]
    );
    setHasChanges(true);
  };

  const addDateNote = () => {
    setDateNotes(prev => [...prev, { date: new Date().toISOString().split("T")[0], note: "", visibility: "private" }]);
    setHasChanges(true);
  };

  const updateDateNote = (index: number, field: keyof DateNote, value: string) => {
    setDateNotes(prev => prev.map((n, i) => i === index ? { ...n, [field]: value } : n));
    setHasChanges(true);
  };

  const removeDateNote = (index: number) => {
    setDateNotes(prev => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  // Group services by category
  const servicesByCategory: Record<string, any[]> = {};
  allServices.forEach(s => {
    const cat = s.category || "Other";
    if (!servicesByCategory[cat]) servicesByCategory[cat] = [];
    servicesByCategory[cat].push(s);
  });

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Back + Save */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" className="gap-2 -ml-2" onClick={() => navigate("/adm/projects")}>
          <ArrowLeft className="h-4 w-4" /> Back to Projects
        </Button>
        {hasChanges && (
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </Button>
        )}
      </div>

      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16 border border-border">
          <AvatarImage src={project.cover_image || undefined} className="object-cover" />
          <AvatarFallback className="bg-muted text-muted-foreground text-lg">
            {projectTitle.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            {projectNumber && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-xs font-mono font-semibold text-muted-foreground border border-border">
                <Hash className="h-3 w-3" />
                {projectNumber}
              </span>
            )}
            <h1 className="text-xl font-semibold text-foreground">{projectTitle}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${health.bg} ${health.color}`}>
              <health.icon className="h-3 w-3" />
              {health.label}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            <span
              className="flex items-center gap-1 hover:text-primary cursor-pointer"
              onClick={() => navigate(`/adm/clients/${project.company_id}`)}
            >
              <Building2 className="h-3.5 w-3.5" />
              {project.companies?.name} {getCountryFlag(project.companies?.country)}
            </span>
            {fullAddress && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {fullAddress}
              </span>
            )}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline text-xs"
              >
                <ExternalLink className="h-3 w-3" />
                Open in Maps
              </a>
            )}
            <span className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">{form.stage}</Badge>
            </span>
            {project.delivery_date && (
              <span className={`flex items-center gap-1 ${isOverdue ? "text-destructive" : ""}`}>
                <Calendar className="h-3.5 w-3.5" />
                {format(new Date(project.delivery_date), "MMM d")}
                {isOverdue && " ⚠"}
              </span>
            )}
          </div>
          {/* Financial summary in header */}
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-muted-foreground">Budget: <span className="font-semibold text-foreground">{fmtVal(totalValue)}</span></span>
              <span className="text-muted-foreground">Paid: <span className="font-semibold text-chart-2">{fmtVal(totalPaid)}</span></span>
              <span className="text-muted-foreground">Remaining: <span className={`font-semibold ${remaining > 0 ? "text-chart-3" : "text-chart-2"}`}>{fmtVal(remaining)}</span></span>
            </div>
            {totalValue > 0 && (
              <div className="flex items-center gap-2 min-w-[160px]">
                <Progress value={paidPct} className="h-2 flex-1" />
                <span className="text-xs text-muted-foreground font-medium">{paidPct}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="drawings">Drawings</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="client-portal">Client Portal</TabsTrigger>
        </TabsList>

        {/* ============ OVERVIEW ============ */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Client Info */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><User className="h-3.5 w-3.5" /> Owner</span><span className="font-medium">{project.companies?.owner_name || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> Company</span><span className="font-medium hover:text-primary cursor-pointer" onClick={() => navigate(`/adm/clients/${project.company_id}`)}>{project.companies?.name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> Email</span><span>{project.companies?.email || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> Phone</span><span>{project.companies?.phone || "—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Country</span><span>{project.companies?.country} {getCountryFlag(project.companies?.country)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1"><Languages className="h-3.5 w-3.5" /> Language</span><span>{getLanguageLabel(project.companies?.language)}</span></div>
              </CardContent>
            </Card>

            {/* Project Details (editable) */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Project Stage</Label>
                  <Select value={form.stage} onValueChange={v => updateForm("stage", v)}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{PROJECT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Service Type</Label>
                  <Input className="mt-1" value={form.service_type} onChange={e => updateForm("service_type", e.target.value)} placeholder="Ex: Remodeling, 3D Kitchen..." />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Project Area ({areaUnit})</Label>
                  <Input className="mt-1" type="number" value={form.square_feet} onChange={e => updateForm("square_feet", e.target.value)} placeholder={project.country === "Brazil" ? "Ex: 120" : "Ex: 720"} />
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Revisions</span>
                  <span className="text-foreground">{project.revision_count}</span>
                </div>
              </CardContent>
            </Card>

            {/* Project Address (editable) */}
            <Card className="border-none shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Project Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="lg:col-span-2">
                    <Label className="text-xs text-muted-foreground">Street</Label>
                    <div className="flex gap-2 mt-1">
                      <Input className="w-24" value={form.street_number} onChange={e => updateForm("street_number", e.target.value)} placeholder="No." />
                      <Input className="flex-1" value={form.street_name} onChange={e => updateForm("street_name", e.target.value)} placeholder="Street name" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">City</Label>
                    <Input className="mt-1" value={form.city} onChange={e => updateForm("city", e.target.value)} placeholder="City" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <Input className="mt-1" value={form.state} onChange={e => updateForm("state", e.target.value)} placeholder="State" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Zip Code</Label>
                    <Input className="mt-1" value={form.zip_code} onChange={e => updateForm("zip_code", e.target.value)} placeholder="Zip" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Country</Label>
                    <Select value={form.country} onValueChange={v => updateForm("country", v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USA">USA</SelectItem>
                        <SelectItem value="Brazil">Brazil</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {fullAddress && (
                  <div className="flex items-center gap-3 p-3 rounded-md bg-muted/30 border border-border">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{fullAddress}</span>
                    {mapsUrl && (
                      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 text-primary hover:underline text-xs whitespace-nowrap">
                        <ExternalLink className="h-3 w-3" /> Open in Maps
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Homeowner / Final Client */}
            <Card className="border-none shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" /> Homeowner / Final Client
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const { error } = await supabase.from("project_homeowners").insert({ project_id: id!, name: "" });
                      if (error) { toast.error(error.message); return; }
                      loadData();
                    }}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" /> Add Person
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {homeowners.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No homeowners added yet</p>
                )}
                {homeowners.map((ho: any, idx: number) => (
                  <div key={ho.id} className="p-4 rounded-lg border bg-muted/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">Person {idx + 1}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive"
                        onClick={async () => {
                          await supabase.from("project_homeowners").delete().eq("id", ho.id);
                          loadData();
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Full Name</Label>
                        <Input
                          className="mt-1"
                          defaultValue={ho.name}
                          placeholder="Name"
                          onBlur={async (e) => {
                            if (e.target.value !== ho.name) {
                              await supabase.from("project_homeowners").update({ name: e.target.value }).eq("id", ho.id);
                              loadData();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <Input
                          className="mt-1"
                          defaultValue={ho.phone || ""}
                          placeholder="+1 555-0000"
                          onBlur={async (e) => {
                            if (e.target.value !== (ho.phone || "")) {
                              await supabase.from("project_homeowners").update({ phone: e.target.value || null }).eq("id", ho.id);
                              loadData();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <Input
                          className="mt-1"
                          defaultValue={ho.email || ""}
                          placeholder="email@example.com"
                          onBlur={async (e) => {
                            if (e.target.value !== (ho.email || "")) {
                              await supabase.from("project_homeowners").update({ email: e.target.value || null }).eq("id", ho.id);
                              loadData();
                            }
                          }}
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Address (optional)</Label>
                        <Input
                          className="mt-1"
                          defaultValue={ho.address || ""}
                          placeholder="Home address"
                          onBlur={async (e) => {
                            if (e.target.value !== (ho.address || "")) {
                              await supabase.from("project_homeowners").update({ address: e.target.value || null }).eq("id", ho.id);
                              loadData();
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ PROGRESS (Kanban) ============ */}
        <TabsContent value="progress">
          <ProjectKanbanBoard
            projectId={id!}
            onStageSync={(stage) => {
              updateForm("stage", stage);
              toast.info(`Project stage synced to: ${stage}`);
            }}
          />
        </TabsContent>

        {/* ============ SERVICES ============ */}
        <TabsContent value="services">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Project Services</CardTitle>
              <p className="text-xs text-muted-foreground">Click tags to add or remove services</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(servicesByCategory).map(([cat, svcs]) => (
                <div key={cat}>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {svcs.map(s => {
                      const isSelected = selectedServiceIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/50 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {allServices.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No services configured</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ TIMELINE ============ */}
        <TabsContent value="timeline">
          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Start Date</Label>
                    <Input type="date" className="mt-1" value={form.start_date} onChange={e => updateForm("start_date", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Preview Delivery</Label>
                    <Input type="date" className="mt-1" value={form.preview_delivery_date} onChange={e => updateForm("preview_delivery_date", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Client Revision Return</Label>
                    <Input type="date" className="mt-1" value={form.revision_return_date} onChange={e => updateForm("revision_return_date", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Final Delivery</Label>
                    <Input type="date" className="mt-1" value={form.final_delivery_date} onChange={e => updateForm("final_delivery_date", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Project Deadline</Label>
                    <Input type="date" className="mt-1" value={form.delivery_date} onChange={e => updateForm("delivery_date", e.target.value)} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Log */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Project Activity Log</CardTitle>
                  <Button variant="outline" size="sm" onClick={addDateNote}>
                    <Plus className="h-3 w-3 mr-1" /> Add Note
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {dateNotes.length === 0 && activityLog.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed rounded-md">
                    No activity notes yet. Click "Add Note" to start.
                  </div>
                )}
                {dateNotes.sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((note, idx) => {
                  const visOpt = VISIBILITY_OPTIONS.find(v => v.value === note.visibility) || VISIBILITY_OPTIONS[0];
                  const VisIcon = visOpt.icon;
                  return (
                    <div key={`note-${idx}`} className="grid grid-cols-[130px_1fr_150px_36px] items-center gap-3 p-3 rounded-md border bg-muted/30">
                      <Input type="date" value={note.date} onChange={e => updateDateNote(idx, "date", e.target.value)} className="text-sm" />
                      <Input value={note.note} onChange={e => updateDateNote(idx, "note", e.target.value)} placeholder="Describe the event..." className="text-sm" />
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
                {/* DB activity log entries (read-only) */}
                {activityLog.map(log => (
                  <div key={log.id} className="flex items-center gap-3 p-3 rounded-md border bg-card">
                    <span className="text-xs text-muted-foreground w-[100px] shrink-0">{format(new Date(log.log_date), "MMM d, yyyy")}</span>
                    <span className="text-sm flex-1">{log.description}</span>
                    <Badge variant="outline" className="text-[10px]">{log.log_type}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ DRAWINGS ============ */}
        <TabsContent value="drawings">
          <div className="space-y-4">
            {Object.keys(drawingGroups).length === 0 && (
              <Card className="border-none shadow-sm">
                <CardContent className="text-center text-muted-foreground py-12">
                  <FileImage className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No drawings yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Drawings and version history will appear here</p>
                </CardContent>
              </Card>
            )}
            {Object.entries(drawingGroups).map(([name, versions]) => (
              <Card key={name} className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-sm">{name}</CardTitle>
                    <Badge variant="secondary" className="ml-auto text-[10px]">{versions.length} version{versions.length > 1 ? "s" : ""}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {versions.map(v => (
                      <div key={v.id} className={`flex items-center gap-3 p-2.5 rounded-md border transition-colors ${v.is_current ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/30"}`}>
                        <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">v{v.version_number}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{v.file_name}</p>
                          {v.revision_notes && <p className="text-xs text-muted-foreground truncate">{v.revision_notes}</p>}
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{format(new Date(v.created_at), "MMM d, yyyy")}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {v.is_current && <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary"><Star className="h-2.5 w-2.5 mr-0.5" />Current</Badge>}
                          <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                            <a href={v.file_url} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5" /></a>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ============ FILES ============ */}
        <TabsContent value="files">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Project Files</CardTitle>
                <Badge variant="secondary">{files.length} files</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                      <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />No files uploaded
                    </TableCell></TableRow>
                  )}
                  {files.map(f => (
                    <TableRow key={f.id}>
                      <TableCell className="font-medium">{f.file_name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10px]">{f.file_type || "—"}</Badge></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{f.file_size ? `${(Number(f.file_size) / 1024).toFixed(0)} KB` : "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(f.created_at), "MMM d, yyyy")}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={f.file_url} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5" /></a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ PERMITS ============ */}
        <TabsContent value="permits">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Permit Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {milestones.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No permits tracked yet</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Permit submissions and approvals will appear here</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Permit / Milestone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Approved</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {milestones.map(m => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium">{m.name}</TableCell>
                        <TableCell><Badge variant={m.status === "approved" ? "default" : "outline"}>{m.status}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{m.sent_date ? format(new Date(m.sent_date), "MMM d, yyyy") : "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{m.approved_date ? format(new Date(m.approved_date), "MMM d, yyyy") : "—"}</TableCell>
                        <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{m.notes || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ FINANCE ============ */}
        <TabsContent value="finance">
          <div className="space-y-6">
            {/* Budget config */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Project Budget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Currency</Label>
                    <Select value={form.currency} onValueChange={v => updateForm("currency", v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="BRL">BRL (R$)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Total Value</Label>
                    <Input type="number" className="mt-1" value={form.total_value} onChange={e => updateForm("total_value", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Entry %</Label>
                    <Input type="number" className="mt-1" value={form.entry_payment_percent} onChange={e => updateForm("entry_payment_percent", e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Payment Stage</Label>
                    <Select value={form.payment_stage} onValueChange={v => updateForm("payment_stage", v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Not Sent", "Waiting Entry", "Entry Paid", "Waiting Final", "Paid", "Overdue", "Refunded"].map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Entry Payment ({entryPct}%)</p>
                  <p className="text-lg font-bold text-foreground">{fmtVal(entryAmt)}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {totalPaid >= entryAmt && totalValue > 0 ? "Paid" : "Pending"}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Final Payment ({100 - entryPct}%)</p>
                  <p className="text-lg font-bold text-foreground">{fmtVal(finalAmt)}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {totalPaid >= totalValue && totalValue > 0 ? "Paid" : "Pending"}
                  </Badge>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground mb-1">Balance Due</p>
                  <p className={`text-lg font-bold ${totalPaid >= totalValue && totalValue > 0 ? "text-chart-2" : "text-destructive"}`}>
                    {fmtVal(Math.max(0, totalValue - totalPaid))}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Payment Milestones */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Receipt className="h-4 w-4" /> Payment Milestones
                  </CardTitle>
                  {paymentMilestones.length === 0 && totalValue > 0 && (
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={async (template) => {
                          const templates: Record<string, { stage: string; percentage: number }[]> = {
                            "entry_final": [
                              { stage: "Entry Payment", percentage: 50 },
                              { stage: "Final Payment", percentage: 50 },
                            ],
                            "architecture": [
                              { stage: "Concept Design", percentage: 40 },
                              { stage: "Construction Documents", percentage: 30 },
                              { stage: "Permit Submission", percentage: 30 },
                            ],
                            "thirds": [
                              { stage: "Phase 1", percentage: 33 },
                              { stage: "Phase 2", percentage: 34 },
                              { stage: "Phase 3", percentage: 33 },
                            ],
                          };
                          const milestones = templates[template];
                          if (!milestones) return;
                          const rows = milestones.map(m => ({
                            project_id: id!,
                            stage: m.stage,
                            percentage: m.percentage,
                            amount: Math.round(totalValue * m.percentage / 100 * 100) / 100,
                            status: "pending",
                          }));
                          const { error } = await supabase.from("payment_milestones").insert(rows);
                          if (error) { toast.error(error.message); return; }
                          toast.success("Milestones created from template");
                          loadData();
                        }}
                      >
                        <SelectTrigger className="h-8 w-[220px] text-xs">
                          <SelectValue placeholder="Select Payment Template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="entry_final">Entry / Final (50/50)</SelectItem>
                          <SelectItem value="architecture">Architecture Milestones (40/30/30)</SelectItem>
                          <SelectItem value="thirds">Three Phases (33/34/33)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {paymentMilestones.length > 0 && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-destructive hover:text-destructive"
                      onClick={async () => {
                        if (!confirm("Delete all milestones and choose a new template?")) return;
                        const { error } = await supabase.from("payment_milestones").delete().eq("project_id", id!);
                        if (error) { toast.error(error.message); return; }
                        toast.success("Milestones cleared");
                        loadData();
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Reset
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {paymentMilestones.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Receipt className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No payment milestones yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      {totalValue > 0 ? "Click \"Generate Default Milestones\" to create them" : "Set a project budget first"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Progress */}
                    {(() => {
                      const msPaid = paymentMilestones.filter((m: any) => m.status === "paid").reduce((s: number, m: any) => s + Number(m.amount || 0), 0);
                      const msTotal = paymentMilestones.reduce((s: number, m: any) => s + Number(m.amount || 0), 0);
                      const msPct = msTotal > 0 ? Math.round((msPaid / msTotal) * 100) : 0;
                      return (
                        <div className="flex items-center gap-3">
                          <Progress value={msPct} className="h-2.5 flex-1" />
                          <span className="text-sm font-semibold text-muted-foreground min-w-[50px] text-right">{msPct}% Paid</span>
                        </div>
                      );
                    })()}
                    {/* Milestone rows */}
                    <div className="space-y-2">
                      {paymentMilestones.map((ms: any) => (
                        <div key={ms.id} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{ms.stage}</p>
                            <p className="text-xs text-muted-foreground">{ms.percentage}% — {fmtVal(Number(ms.amount))}</p>
                          </div>
                          <Select
                            value={ms.status}
                            onValueChange={async (newStatus) => {
                              const updatePayload: any = { status: newStatus };
                              const today = new Date().toISOString().split("T")[0];
                              if (newStatus === "paid") updatePayload.payment_date = today;
                              if (newStatus === "pending") updatePayload.payment_date = null;
                              const { error } = await supabase.from("payment_milestones").update(updatePayload).eq("id", ms.id);
                              if (error) { toast.error(error.message); return; }

                              // Auto-create admin_payments record when milestone is paid
                              if (newStatus === "paid") {
                                await supabase.from("admin_payments").insert({
                                  project_id: id!,
                                  installment_type: ms.stage,
                                  amount_total: Number(ms.amount),
                                  amount_paid: Number(ms.amount),
                                  status: "paid",
                                  payment_method: "Bank Transfer",
                                  payment_date: today,
                                  payment_notes: `Auto-generated from milestone: ${ms.stage} (${ms.percentage}%)`,
                                });
                              }

                              // Remove auto-generated payment if reverted to pending
                              if (newStatus === "pending") {
                                await supabase.from("admin_payments")
                                  .delete()
                                  .eq("project_id", id!)
                                  .eq("installment_type", ms.stage)
                                  .like("payment_notes", `Auto-generated from milestone: ${ms.stage}%`);
                              }

                              toast.success(`${ms.stage} marked as ${newStatus}`);
                              loadData();
                            }}
                          >
                            <SelectTrigger className={`h-7 w-[110px] text-xs border ${
                              ms.status === "paid" ? "bg-chart-2/15 text-chart-2 border-chart-2/30" :
                              ms.status === "overdue" ? "bg-destructive/15 text-destructive border-destructive/30" :
                              "bg-chart-3/15 text-chart-3 border-chart-3/30"
                            }`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                          {ms.payment_date && (
                            <span className="text-xs text-muted-foreground">{format(new Date(ms.payment_date), "MMM d, yyyy")}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invoices table */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment Records</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Paid</TableHead>
                      <TableHead>Net Received</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No payments recorded</TableCell></TableRow>
                    )}
                    {payments.map(p => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.installment_type}</TableCell>
                        <TableCell>{fmtVal(Number(p.amount_total))}</TableCell>
                        <TableCell className="text-chart-2">{fmtVal(Number(p.amount_paid))}</TableCell>
                        <TableCell className="text-muted-foreground">{p.net_received != null ? fmtVal(Number(p.net_received)) : "—"}</TableCell>
                        <TableCell className="text-muted-foreground text-xs">{p.payment_method || "—"}</TableCell>
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
                              // Recalculate project payment_stage
                              const { data: allPay } = await supabase.from("admin_payments").select("amount_paid, status").eq("project_id", id);
                              const newTotalPaid = (allPay || []).filter((pp: any) => pp.status === "paid").reduce((s: number, pp: any) => s + Number(pp.amount_paid || 0), 0);
                              const projTotal = Number(form.total_value || 0);
                              const projEntry = projTotal * Number(form.entry_payment_percent || 50) / 100;
                              let newPayStage = "Not Sent";
                              if (newTotalPaid >= projTotal && projTotal > 0) newPayStage = "Paid";
                              else if (newTotalPaid >= projEntry && projEntry > 0) newPayStage = "Entry Paid";
                              else if (newTotalPaid > 0) newPayStage = "Waiting Final";
                              await supabase.from("projects").update({ payment_stage: newPayStage }).eq("id", id);
                              toast.success(`Payment marked as ${newStatus}`);
                              loadData();
                            }}
                          >
                            <SelectTrigger className={`h-7 w-[110px] text-xs border ${paymentStatusColor(p.status)}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{p.payment_date ? format(new Date(p.payment_date), "MMM d, yyyy") : "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ NOTES ============ */}
        <TabsContent value="notes">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <StickyNote className="h-4 w-4" /> Internal Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={internalNotes}
                onChange={e => { setInternalNotes(e.target.value); setHasChanges(true); }}
                placeholder="Write internal notes about this project..."
                className="min-h-[200px]"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CLIENT PORTAL ============ */}
        <TabsContent value="client-portal">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> Client Messages ({messages.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="max-h-[400px]">
                  {messages.length === 0 && <p className="text-center text-muted-foreground py-8">No messages yet</p>}
                  <div className="space-y-3">
                    {messages.map(m => (
                      <div key={m.id} className={`flex ${m.is_from_admin ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.is_from_admin ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p>{m.content}</p>
                          <p className={`text-[10px] mt-1 ${m.is_from_admin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {format(new Date(m.created_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Tickets */}
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Ticket className="h-4 w-4" /> Support Tickets ({tickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No tickets</p>
                ) : (
                  <div className="space-y-2">
                    {tickets.map(t => (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 cursor-pointer transition-colors"
                        onClick={() => navigate(`/adm/tickets?id=${t.id}`)}
                      >
                        <Ticket className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{t.subject}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(t.updated_at), "MMM d, yyyy")}</p>
                        </div>
                        <Badge variant={t.status === "open" ? "destructive" : "outline"} className="text-[10px]">{t.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Client-visible files */}
            <Card className="border-none shadow-sm lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" /> Files Shared with Client
                </CardTitle>
              </CardHeader>
              <CardContent>
                {files.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No files shared</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {files.slice(0, 6).map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{f.file_name}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(f.created_at), "MMM d, yyyy")}</p>
                        </div>
                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                          <a href={f.file_url} target="_blank" rel="noopener noreferrer"><Download className="h-3.5 w-3.5" /></a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminProjectDetail;
