import { useState, useRef, DragEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Calendar, DollarSign, GripVertical, ImageIcon } from "lucide-react";
import { getCountryFlag } from "@/utils/countryFlags";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PIPELINE_STAGES = [
  { key: "Lead", color: "bg-slate-400", dot: "bg-slate-500" },
  { key: "Discovery Call", color: "bg-sky-400", dot: "bg-sky-500" },
  { key: "Proposal Sent", color: "bg-amber-400", dot: "bg-amber-500" },
  { key: "Contract Signed", color: "bg-violet-400", dot: "bg-violet-500" },
  { key: "Concept Design", color: "bg-indigo-400", dot: "bg-indigo-500" },
  { key: "Design Development", color: "bg-blue-400", dot: "bg-blue-500" },
  { key: "Construction Documents", color: "bg-cyan-400", dot: "bg-cyan-500" },
  { key: "Permit Submission", color: "bg-teal-400", dot: "bg-teal-500" },
  { key: "Construction", color: "bg-emerald-400", dot: "bg-emerald-500" },
  { key: "Completed", color: "bg-green-500", dot: "bg-green-600" },
];

interface ProjectPipelineProps {
  projects: any[];
  onProjectMoved?: () => void;
}

const ProjectPipeline = ({ projects, onProjectMoved }: ProjectPipelineProps) => {
  const navigate = useNavigate();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const grouped: Record<string, any[]> = {};
  PIPELINE_STAGES.forEach((s) => (grouped[s.key] = []));
  projects.forEach((p) => {
    const stage = p.stage || "Lead";
    if (grouped[stage]) {
      grouped[stage].push(p);
    } else {
      // Map old stages to new pipeline
      if (stage === "briefing" || stage === "Budget Sent") grouped["Lead"].push(p);
      else if (stage === "Budget Approved") grouped["Proposal Sent"].push(p);
      else if (stage === "In Progress") grouped["Design Development"].push(p);
      else if (stage === "Preview Sent" || stage === "Revision" || stage === "Final Review") grouped["Construction Documents"].push(p);
      else grouped["Lead"].push(p);
    }
  });

  const handleDragStart = (e: DragEvent, projectId: string) => {
    setDraggedId(projectId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", projectId);
  };

  const handleDragOver = (e: DragEvent, stageKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stageKey);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: DragEvent, stageKey: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const projectId = e.dataTransfer.getData("text/plain");
    if (!projectId) return;

    const { error } = await supabase
      .from("projects")
      .update({ stage: stageKey })
      .eq("id", projectId);

    if (error) {
      toast.error("Failed to move project");
    } else {
      toast.success(`Moved to ${stageKey}`);
      onProjectMoved?.();
    }
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  const getStatusTag = (p: any) => {
    if (p.delivery_date && new Date(p.delivery_date) < new Date() && p.stage !== "Completed") {
      return <Badge variant="destructive" className="text-[9px] px-1.5 py-0">Overdue</Badge>;
    }
    if (p.stage === "Completed") {
      return <Badge className="text-[9px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-0">Done</Badge>;
    }
    return <Badge variant="secondary" className="text-[9px] px-1.5 py-0">Active</Badge>;
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Project Pipeline</CardTitle>
          <span className="text-xs text-muted-foreground">{projects.length} projects</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full" ref={scrollRef}>
          <div className="flex gap-3 p-4 min-w-max">
            {PIPELINE_STAGES.map((stage) => {
              const items = grouped[stage.key] || [];
              const isOver = dragOverStage === stage.key;
              return (
                <div
                  key={stage.key}
                  className={`flex-shrink-0 w-[240px] rounded-lg transition-colors ${
                    isOver ? "bg-primary/5 ring-2 ring-primary/20" : "bg-muted/30"
                  }`}
                  onDragOver={(e) => handleDragOver(e, stage.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, stage.key)}
                >
                  {/* Column header */}
                  <div className="flex items-center gap-2 p-3 pb-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.dot}`} />
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wide truncate">
                      {stage.key}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-4 px-1.5 ml-auto shrink-0">
                      {items.length}
                    </Badge>
                  </div>

                  {/* Cards */}
                  <div className="space-y-2 p-2 pt-0 min-h-[100px]">
                    {items.map((p) => (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, p.id)}
                        onDragEnd={handleDragEnd}
                        className={`group rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all ${
                          draggedId === p.id ? "opacity-40 scale-95" : "opacity-100"
                        }`}
                      >
                        {/* Top row: thumbnail + grip */}
                        <div className="flex items-start gap-2 mb-2">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {p.cover_image ? (
                              <img src={p.cover_image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5 text-muted-foreground/50" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold text-foreground truncate leading-tight hover:text-primary cursor-pointer"
                              onClick={(e) => { e.stopPropagation(); navigate(`/adm/projects/${p.id}`); }}
                            >
                              {p.name || "Untitled Project"}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              <span
                                className="hover:text-primary cursor-pointer hover:underline"
                                onClick={(e) => { e.stopPropagation(); if (p.company_id) navigate(`/adm/clients/${p.company_id}`); }}
                              >
                                {p.companies?.name || "No client"}
                              </span> {getCountryFlag(p.companies?.country)}
                            </p>
                          </div>
                          <GripVertical className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 shrink-0 mt-0.5" />
                        </div>

                        {/* Meta row */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {p.total_value > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <DollarSign className="h-2.5 w-2.5" />
                              {Number(p.total_value).toLocaleString()}
                            </span>
                          )}
                          {p.delivery_date && (
                            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                              <Calendar className="h-2.5 w-2.5" />
                              {new Date(p.delivery_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                          <span className="ml-auto">{getStatusTag(p)}</span>
                        </div>
                      </div>
                    ))}

                    {items.length === 0 && (
                      <div className="flex items-center justify-center h-[80px] border border-dashed border-border/50 rounded-lg">
                        <p className="text-[11px] text-muted-foreground/50">Drop here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProjectPipeline;
