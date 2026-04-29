import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, UserPlus, Send, Phone, Inbox, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

const AdminLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  const fetchLeads = async () => {
    const { data } = await supabase.from("quote_requests").select("*").order("created_at", { ascending: false });
    setLeads(data || []);
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleConvert = async (lead: any) => {
    const { data: company, error: compErr } = await supabase
      .from("companies").insert({ name: lead.company_name || lead.full_name, email: lead.email, phone: lead.phone }).select().single();
    if (compErr || !company) { toast.error("Failed to create client"); return; }
    const { error: projErr } = await supabase.from("projects").insert({
      company_id: company.id, name: `${lead.full_name} - ${lead.service_type}`,
      service_type: lead.service_type, stage: "Lead", description: lead.description, address: lead.project_address,
    });
    if (!projErr) {
      await supabase.from("quote_requests").update({ processed: true }).eq("id", lead.id);
      toast.success("Lead converted to project"); fetchLeads();
    } else toast.error("Failed to create project");
  };

  const serviceLabel = (s: string) => s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

  const filtered = leads.filter(l =>
    (l.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Leads</h1>
          <p className="text-sm text-muted-foreground">Incoming leads from the intake form</p>
        </div>
        <Badge variant="secondary">{leads.filter(l => !l.processed).length} new</Badge>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search leads..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Received</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-12"><Inbox className="h-8 w-8 mx-auto mb-2 opacity-40" />No leads yet</TableCell></TableRow>
              )}
              {filtered.map(lead => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{lead.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                  <TableCell className="text-muted-foreground">{lead.phone || "—"}</TableCell>
                  <TableCell>{serviceLabel(lead.service_type)}</TableCell>
                  <TableCell>
                    {lead.processed
                      ? <Badge variant="secondary"><CheckCircle className="h-3 w-3 mr-1" />Processed</Badge>
                      : <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20" variant="outline">New</Badge>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleConvert(lead)} className="gap-2"><UserPlus className="h-3.5 w-3.5" />Convert to Project</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}?subject=Proposal`, "_blank")} className="gap-2"><Send className="h-3.5 w-3.5" />Send Proposal</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => lead.phone && window.open(`tel:${lead.phone}`)} className="gap-2"><Phone className="h-3.5 w-3.5" />Schedule Call</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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

export default AdminLeads;
