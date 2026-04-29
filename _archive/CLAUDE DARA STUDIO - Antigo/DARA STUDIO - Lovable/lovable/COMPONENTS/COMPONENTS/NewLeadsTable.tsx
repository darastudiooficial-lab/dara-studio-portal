import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { MoreHorizontal, UserPlus, Send, Phone, Inbox } from "lucide-react";
import { toast } from "sonner";

const NewLeadsTable = () => {
  const [leads, setLeads] = useState<any[]>([]);

  const fetchLeads = async () => {
    const { data } = await supabase
      .from("quote_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setLeads(data || []);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleConvert = async (lead: any) => {
    // Create company + project from lead
    const { data: company, error: compErr } = await supabase
      .from("companies")
      .insert({ name: lead.company_name || lead.full_name, email: lead.email, phone: lead.phone })
      .select()
      .single();

    if (compErr || !company) {
      toast.error("Failed to create client");
      return;
    }

    const { error: projErr } = await supabase.from("projects").insert({
      company_id: company.id,
      name: `${lead.full_name} - ${lead.service_type}`,
      service_type: lead.service_type,
      stage: "Lead",
      description: lead.description,
      address: lead.project_address,
    });

    if (!projErr) {
      await supabase.from("quote_requests").update({ processed: true }).eq("id", lead.id);
      toast.success("Lead converted to project");
      fetchLeads();
    } else {
      toast.error("Failed to create project");
    }
  };

  const handleMarkProcessed = async (id: string) => {
    await supabase.from("quote_requests").update({ processed: true }).eq("id", id);
    toast.success("Marked as processed");
    fetchLeads();
  };

  const serviceLabel = (s: string) =>
    s?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "—";

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Inbox className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">New Leads</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {leads.filter((l) => !l.processed).length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">Lead Name</TableHead>
              <TableHead className="text-xs">Project Type</TableHead>
              <TableHead className="text-xs">Status</TableHead>
              <TableHead className="text-xs">Received</TableHead>
              <TableHead className="text-xs w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                  No leads from intake form yet
                </TableCell>
              </TableRow>
            )}
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium text-foreground">{lead.full_name}</p>
                    <p className="text-xs text-muted-foreground">{lead.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {serviceLabel(lead.service_type)}
                </TableCell>
                <TableCell>
                  {lead.processed ? (
                    <Badge variant="secondary" className="text-[10px]">Processed</Badge>
                  ) : (
                    <Badge className="text-[10px] bg-chart-1/10 text-chart-1 border-chart-1/20" variant="outline">
                      New
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleConvert(lead)} className="gap-2">
                        <UserPlus className="h-3.5 w-3.5" /> Convert to Project
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`mailto:${lead.email}?subject=Proposal`, "_blank")} className="gap-2">
                        <Send className="h-3.5 w-3.5" /> Send Proposal
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => lead.phone && window.open(`tel:${lead.phone}`, "_blank")} className="gap-2">
                        <Phone className="h-3.5 w-3.5" /> Schedule Call
                      </DropdownMenuItem>
                      {!lead.processed && (
                        <DropdownMenuItem onClick={() => handleMarkProcessed(lead.id)} className="gap-2 text-muted-foreground">
                          Mark as Processed
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default NewLeadsTable;
