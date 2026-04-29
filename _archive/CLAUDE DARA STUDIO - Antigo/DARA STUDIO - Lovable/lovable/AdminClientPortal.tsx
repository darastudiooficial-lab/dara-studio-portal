import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Users, Ticket, Activity } from "lucide-react";
import { format } from "date-fns";

const AdminClientPortal = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("client_tickets").select("*, companies(name), projects(name)").order("updated_at", { ascending: false }).limit(20)
      .then(({ data }) => setTickets(data || []));
    supabase.from("profiles").select("*, companies:company_id(name)").order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => setProfiles(data || []));
  }, []);

  const statusColor: Record<string, string> = {
    open: "bg-blue-500/10 text-blue-600", waiting: "bg-amber-500/10 text-amber-600", resolved: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Client Portal</h1>
        <p className="text-sm text-muted-foreground">Monitor client activity and portal access</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40"><Users className="h-5 w-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{profiles.length}</p><p className="text-xs text-muted-foreground">Portal Users</p></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40"><Ticket className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-2xl font-bold">{tickets.filter(t => t.status === "open").length}</p><p className="text-xs text-muted-foreground">Open Tickets</p></div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40"><Activity className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-bold">{tickets.filter(t => t.status === "resolved").length}</p><p className="text-xs text-muted-foreground">Resolved</p></div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3"><CardTitle className="text-base">Recent Tickets</CardTitle></CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-12"><Globe className="h-8 w-8 mx-auto mb-2 opacity-40" />No tickets yet</TableCell></TableRow>
              )}
              {tickets.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{t.companies?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{t.projects?.name || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[t.status] || ""}>{t.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(t.updated_at), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminClientPortal;
