import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, FileImage, Download, Star, Clock, Plus, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDrawings = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [drawings, setDrawings] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDrawingName, setNewDrawingName] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    supabase.from("projects").select("id, name, companies(name)").then(({ data }) => {
      setProjects(data || []);
    });
  }, []);

  useEffect(() => {
    if (selectedProject) fetchDrawings();
  }, [selectedProject]);

  const fetchDrawings = async () => {
    const { data } = await supabase
      .from("drawing_versions")
      .select("*")
      .eq("project_id", selectedProject)
      .order("drawing_name", { ascending: true })
      .order("version_number", { ascending: false });
    setDrawings(data || []);
  };

  const handleUpload = async () => {
    if (!file || !selectedProject || !newDrawingName.trim()) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `${selectedProject}/${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("project-files")
      .upload(path, file);

    if (uploadErr) {
      toast.error("Upload failed");
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("project-files").getPublicUrl(path);

    // Get next version number for this drawing name
    const existing = drawings.filter(
      (d) => d.drawing_name.toLowerCase() === newDrawingName.trim().toLowerCase()
    );
    const nextVersion = existing.length > 0
      ? Math.max(...existing.map((d) => d.version_number)) + 1
      : 1;

    // Unmark previous current
    if (existing.length > 0) {
      await supabase
        .from("drawing_versions")
        .update({ is_current: false })
        .eq("project_id", selectedProject)
        .eq("drawing_name", newDrawingName.trim());
    }

    const { error } = await supabase.from("drawing_versions").insert({
      project_id: selectedProject,
      drawing_name: newDrawingName.trim(),
      version_number: nextVersion,
      file_url: urlData.publicUrl,
      file_name: file.name,
      revision_notes: newNotes || null,
      is_current: true,
    });

    if (!error) {
      toast.success(`Uploaded v${nextVersion}`);
      setDialogOpen(false);
      setNewDrawingName("");
      setNewNotes("");
      setFile(null);
      fetchDrawings();
    } else {
      toast.error("Failed to save version");
    }
    setUploading(false);
  };

  const handleSetCurrent = async (drawing: any) => {
    await supabase
      .from("drawing_versions")
      .update({ is_current: false })
      .eq("project_id", drawing.project_id)
      .eq("drawing_name", drawing.drawing_name);

    await supabase
      .from("drawing_versions")
      .update({ is_current: true })
      .eq("id", drawing.id);

    toast.success(`v${drawing.version_number} set as current`);
    fetchDrawings();
  };

  // Group drawings by name
  const grouped: Record<string, any[]> = {};
  drawings.forEach((d) => {
    if (!grouped[d.drawing_name]) grouped[d.drawing_name] = [];
    grouped[d.drawing_name].push(d);
  });

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Drawing Version Control</h1>
          <p className="text-sm text-muted-foreground">Manage drawing versions for each project</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={!selectedProject}>
              <Plus className="h-4 w-4" /> Upload Drawing
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Drawing Version</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Drawing name (e.g. Floor Plan, Elevations)"
                value={newDrawingName}
                onChange={(e) => setNewDrawingName(e.target.value)}
              />
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="drawing-upload"
                />
                <label htmlFor="drawing-upload" className="cursor-pointer space-y-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {file ? file.name : "Click to select file (PDF, DWG, DXF, PNG, JPG)"}
                  </p>
                </label>
              </div>
              <Textarea
                placeholder="Revision notes — what changed?"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={3}
              />
              <Button
                className="w-full"
                onClick={handleUpload}
                disabled={!file || !newDrawingName.trim() || uploading}
              >
                {uploading ? "Uploading..." : "Upload Version"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Selector */}
      <Select value={selectedProject} onValueChange={setSelectedProject}>
        <SelectTrigger className="max-w-sm">
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          {projects.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name || p.companies?.name || "Untitled"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!selectedProject && (
        <p className="text-sm text-muted-foreground text-center py-16">Select a project to view drawings</p>
      )}

      {selectedProject && Object.keys(grouped).length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-16">No drawings uploaded yet</p>
      )}

      {/* Drawing Groups */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([name, versions]) => (
          <Card key={name} className="border-none shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileImage className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base font-semibold">{name}</CardTitle>
                <Badge variant="secondary" className="ml-auto">{versions.length} versions</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="max-h-[300px]">
                <div className="space-y-2">
                  {versions.map((v) => (
                    <div
                      key={v.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        v.is_current ? "border-primary/30 bg-primary/5" : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center justify-center h-9 w-9 rounded-md bg-muted text-xs font-bold text-muted-foreground shrink-0">
                        v{v.version_number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground truncate">{v.file_name}</p>
                          {v.is_current && (
                            <Badge className="text-[10px] bg-primary/10 text-primary border-primary/20" variant="outline">
                              <Star className="h-2.5 w-2.5 mr-0.5" /> Current
                            </Badge>
                          )}
                        </div>
                        {v.revision_notes && (
                          <p className="text-xs text-muted-foreground mt-0.5 truncate">{v.revision_notes}</p>
                        )}
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {format(new Date(v.created_at), "MMM d, yyyy 'at' h:mm a")}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!v.is_current && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={() => handleSetCurrent(v)}
                          >
                            <Star className="h-3 w-3" /> Set Current
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          asChild
                        >
                          <a href={v.file_url} target="_blank" rel="noopener noreferrer" download>
                            <Download className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminDrawings;
