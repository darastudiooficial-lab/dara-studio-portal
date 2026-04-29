import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Building2, Globe, Languages, Mail, Phone, FolderKanban, FileText, MessageSquare, FolderOpen } from "lucide-react";
import { getCountryFlag, getLanguageLabel } from "@/utils/countryFlags";
import { format } from "date-fns";

const AdminClientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [company, setCompany] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      const [compRes, projRes, empRes] = await Promise.all([
        supabase.from("companies").select("*").eq("id", id).single(),
        supabase.from("projects").select("*").eq("company_id", id).order("created_at", { ascending: false }),
        supabase.from("company_employees").select("*").eq("company_id", id),
      ]);
      setCompany(compRes.data);
      setProjects(projRes.data || []);
      setEmployees(empRes.data || []);

      // Fetch files & messages for all projects
      const projectIds = (projRes.data || []).map((p: any) => p.id);
      if (projectIds.length > 0) {
        const [filesRes, msgsRes] = await Promise.all([
          supabase.from("project_files").select("*, projects(name)").in("project_id", projectIds).order("created_at", { ascending: false }),
          supabase.from("messages").select("*, projects(name)").in("project_id", projectIds).order("created_at", { ascending: false }).limit(50),
        ]);
        setFiles(filesRes.data || []);
        setMessages(msgsRes.data || []);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="p-6 text-muted-foreground">Loading...</div>;
  if (!company) return <div className="p-6 text-muted-foreground">Client not found</div>;

  const initials = (company.owner_name || company.name || "C")
    .split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Back */}
      <Button variant="ghost" size="sm" onClick={() => navigate("/adm/companies")}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Clients
      </Button>

      {/* Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          {company.avatar_url && <AvatarImage src={company.avatar_url} />}
          <AvatarFallback className="text-lg bg-primary/10 text-primary">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
            {company.owner_name || company.name} {getCountryFlag(company.country)}
          </h1>
          {company.owner_name && company.name && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" /> {company.name}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
            {company.language && (
              <span className="flex items-center gap-1">
                <Languages className="h-3.5 w-3.5" /> {getLanguageLabel(company.language)}
              </span>
            )}
            {company.country && (
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" /> {company.country}
              </span>
            )}
            {company.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {company.email}
              </span>
            )}
            {company.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {company.phone}
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Badge variant={company.status === "active" ? "default" : "secondary"}>
              {company.status || "active"}
            </Badge>
            {company.company_type && <Badge variant="outline">{company.company_type}</Badge>}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="projects">
        <TabsList>
          <TabsTrigger value="projects" className="gap-1"><FolderKanban className="h-3.5 w-3.5" /> Projects ({projects.length})</TabsTrigger>
          <TabsTrigger value="contacts" className="gap-1"><Building2 className="h-3.5 w-3.5" /> Contacts ({employees.length})</TabsTrigger>
          <TabsTrigger value="files" className="gap-1"><FolderOpen className="h-3.5 w-3.5" /> Files ({files.length})</TabsTrigger>
          <TabsTrigger value="messages" className="gap-1"><MessageSquare className="h-3.5 w-3.5" /> Messages ({messages.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Project</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No projects</TableCell></TableRow>
                  )}
                  {projects.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/adm/projects/${p.id}`)}>
                      <TableCell className="font-medium">{p.name || p.display_address || "Untitled"}</TableCell>
                      <TableCell><Badge variant="outline">{p.stage}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.service_type}</TableCell>
                      <TableCell>{p.currency} {Number(p.total_value || 0).toLocaleString()}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No contacts</TableCell></TableRow>
                  )}
                  {employees.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">{e.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.email || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{e.phone || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files">
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.length === 0 && (
                    <TableRow><TableCell colSpan={3} className="text-center text-muted-foreground py-8">No files</TableCell></TableRow>
                  )}
                  {files.map((f) => (
                    <TableRow key={f.id}>
                      <TableCell>
                        <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm font-medium">
                          {f.file_name}
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{f.projects?.name || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(f.created_at), "MMM d, yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No messages</p>
              )}
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {messages.map((m) => (
                  <div key={m.id} className="flex gap-3 p-2 rounded-md hover:bg-muted/50">
                    <div className="flex-1">
                      <p className="text-sm">{m.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {m.projects?.name} · {format(new Date(m.created_at), "MMM d, h:mm a")}
                        {m.is_from_admin && <Badge variant="outline" className="ml-2 text-[9px]">Admin</Badge>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminClientProfile;
