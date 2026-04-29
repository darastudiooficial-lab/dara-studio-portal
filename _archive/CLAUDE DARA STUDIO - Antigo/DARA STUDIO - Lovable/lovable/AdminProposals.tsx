import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { format } from "date-fns";

const AdminProposals = () => {
  const [quotes, setQuotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("quotes").select("*, companies(name), projects(name)").order("created_at", { ascending: false })
      .then(({ data }) => setQuotes(data || []));
  }, []);

  const statusColor: Record<string, string> = {
    draft: "bg-muted text-muted-foreground", sent: "bg-blue-500/10 text-blue-600",
    approved: "bg-emerald-500/10 text-emerald-600", paid: "bg-green-500/10 text-green-700",
  };

  const filtered = quotes.filter(q =>
    (q.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (q.companies?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Proposals</h1>
          <p className="text-sm text-muted-foreground">Manage client proposals and quotes</p>
        </div>
        <Badge variant="secondary">{quotes.length} total</Badge>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search proposals..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12"><FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />No proposals yet</TableCell></TableRow>
              )}
              {filtered.map(q => (
                <TableRow key={q.id}>
                  <TableCell className="font-medium">{q.title}</TableCell>
                  <TableCell className="text-muted-foreground">{q.companies?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{q.projects?.name || "—"}</TableCell>
                  <TableCell className="font-medium">${Number(q.amount).toLocaleString()}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColor[q.status] || ""}>{q.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(q.created_at), "MMM d, yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProposals;
