import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Search, FolderOpen, Download, FileIcon } from "lucide-react";
import { format } from "date-fns";

const AdminFiles = () => {
  const [files, setFiles] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    supabase.from("project_files").select("*, projects(name, companies(name))").order("created_at", { ascending: false })
      .then(({ data }) => setFiles(data || []));
  }, []);

  const filtered = files.filter(f =>
    (f.file_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (f.projects?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Project Files</h1>
          <p className="text-sm text-muted-foreground">All uploaded project files</p>
        </div>
        <Badge variant="secondary">{files.length} files</Badge>
      </div>
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search files..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-12"><FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />No files yet</TableCell></TableRow>
              )}
              {filtered.map(f => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium flex items-center gap-2"><FileIcon className="h-4 w-4 text-muted-foreground" />{f.file_name}</TableCell>
                  <TableCell className="text-muted-foreground">{f.projects?.name || "—"}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10px]">{f.file_type || "—"}</Badge></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatSize(f.file_size)}</TableCell>
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
    </div>
  );
};

export default AdminFiles;
