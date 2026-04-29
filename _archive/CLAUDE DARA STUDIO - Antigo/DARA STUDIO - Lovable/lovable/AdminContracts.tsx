import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileSignature, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const AdminContracts = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("freelancer_contracts").select("*, projects(name, companies(name))").order("created_at", { ascending: false })
      .then(({ data }) => setContracts(data || []));
  }, []);

  const filtered = contracts.filter(c =>
    (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.projects?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Contracts</h1>
          <p className="text-sm text-muted-foreground">Track contracts and agreements</p>
        </div>
        <Badge variant="secondary">{contracts.length} total</Badge>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search contracts..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12"><FileSignature className="h-8 w-8 mx-auto mb-2 opacity-40" />No contracts yet</TableCell></TableRow>
              )}
              {filtered.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.title}</TableCell>
                  <TableCell className="text-muted-foreground">{c.projects?.name || "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{c.projects?.companies?.name || "—"}</TableCell>
                  <TableCell>
                    {c.is_signed
                      ? <Badge className="bg-emerald-500/10 text-emerald-600" variant="outline">Signed</Badge>
                      : <Badge variant="outline">Pending</Badge>}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(c.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    {c.file_url && (
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <a href={c.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a>
                      </Button>
                    )}
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

export default AdminContracts;
