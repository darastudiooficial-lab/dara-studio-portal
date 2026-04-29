import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus, GripVertical, CalendarIcon, User, Flag, Pencil, Trash2,
  CheckCircle2, Clock, AlertTriangle, Eye,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { KANBAN_STAGES, KANBAN_STAGE_COLORS as STAGE_COLORS } from "@/constants/projectStages";

const PRIORITIES = [
  { value: "low", label: "Low", color: "text-muted-foreground bg-muted border-border" },
  { value: "medium", label: "Medium", color: "text-chart-4 bg-chart-4/15 border-chart-4/30" },
  { value: "high", label: "High", color: "text-chart-3 bg-chart-3/15 border-chart-3/30" },
  { value: "urgent", label: "Urgent", color: "text-destructive bg-destructive/15 border-destructive/30" },
];

interface ProjectTask {
  id: string;
  project_id: string;
  title: string;
  assigned_to: string | null;
  due_date: string | null;
  priority: string;
  stage: string;
  is_completed: boolean;
  completed_at: string | null;
  requires_client_review: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  projectId: string;
  onStageSync?: (stage: string) => void;
}

const emptyTask = {
  title: "",
  assigned_to: "",
  due_date: undefined as Date | undefined,
  priority: "medium",
  stage: "Lead",
  requires_client_review: false,
};

export default function ProjectKanbanBoard({ projectId, onStageSync }: Props) {
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);
  const [form, setForm] = useState(emptyTask);
  const [dragTaskId, setDragTaskId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    const { data } = await supabase
      .from("project_tasks")
      .select("*")
      .eq("project_id", projectId)
      .order("sort_order")
      .order("created_at");
    setTasks((data as ProjectTask[]) || []);
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`project_tasks_${projectId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "project_tasks", filter: `project_id=eq.${projectId}` }, () => {
        fetchTasks();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [projectId, fetchTasks]);

  const syncProjectStage = useCallback(async (updatedTasks: ProjectTask[]) => {
    // Count tasks per stage (excluding completed tasks)
    const activeTasks = updatedTasks.filter(t => !t.is_completed);
    if (activeTasks.length === 0) return;

    const stageCounts: Record<string, number> = {};
    activeTasks.forEach(t => {
      stageCounts[t.stage] = (stageCounts[t.stage] || 0) + 1;
    });

    // Find the stage with the most tasks
    let maxStage = "Lead";
    let maxCount = 0;
    for (const [stage, count] of Object.entries(stageCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxStage = stage;
      }
    }

    onStageSync?.(maxStage);
  }, [onStageSync]);

  const openNew = (stage: string) => {
    setEditingTask(null);
    setForm({ ...emptyTask, stage });
    setDialogOpen(true);
  };

  const openEdit = (task: ProjectTask) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      assigned_to: task.assigned_to || "",
      due_date: task.due_date ? new Date(task.due_date) : undefined,
      priority: task.priority,
      stage: task.stage,
      requires_client_review: task.requires_client_review,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Task title is required"); return; }

    const payload = {
      project_id: projectId,
      title: form.title.trim(),
      assigned_to: form.assigned_to?.trim() || null,
      due_date: form.due_date ? format(form.due_date, "yyyy-MM-dd") : null,
      priority: form.priority,
      stage: form.stage,
      requires_client_review: form.requires_client_review,
    };

    if (editingTask) {
      const { error } = await supabase.from("project_tasks").update(payload).eq("id", editingTask.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Task updated");
    } else {
      const maxOrder = tasks.filter(t => t.stage === form.stage).reduce((max, t) => Math.max(max, t.sort_order), -1);
      const { error } = await supabase.from("project_tasks").insert({ ...payload, sort_order: maxOrder + 1 });
      if (error) { toast.error(error.message); return; }
      toast.success("Task created");
    }

    setDialogOpen(false);
    await fetchTasks();
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Delete this task?")) return;
    await supabase.from("project_tasks").delete().eq("id", taskId);
    toast.success("Task deleted");
    fetchTasks();
  };

  const handleToggleComplete = async (task: ProjectTask) => {
    const nowCompleted = !task.is_completed;
    await supabase.from("project_tasks").update({
      is_completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
    }).eq("id", task.id);

    // Log to activity_log when completed
    if (nowCompleted) {
      await supabase.from("activity_log").insert({
        project_id: projectId,
        description: `Task "${task.title}" completed`,
        log_type: "task_completed",
        log_date: new Date().toISOString(),
      });
    }

    await fetchTasks();
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDragTaskId(taskId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", taskId);
  };

  const handleDragOver = (e: React.DragEvent, stage: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStage: string) => {
    e.preventDefault();
    setDragOverStage(null);
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    const task = tasks.find(t => t.id === taskId);
    if (!task || task.stage === targetStage) { setDragTaskId(null); return; }

    const maxOrder = tasks.filter(t => t.stage === targetStage).reduce((max, t) => Math.max(max, t.sort_order), -1);

    await supabase.from("project_tasks").update({
      stage: targetStage,
      sort_order: maxOrder + 1,
    }).eq("id", taskId);

    // Log stage change
    await supabase.from("activity_log").insert({
      project_id: projectId,
      description: `Task "${task.title}" moved to ${targetStage}`,
      log_type: "task_moved",
      log_date: new Date().toISOString(),
    });

    setDragTaskId(null);
    const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, stage: targetStage } : t);
    setTasks(updatedTasks);
    syncProjectStage(updatedTasks);
    fetchTasks();
  };

  const getPriorityStyle = (priority: string) => {
    return PRIORITIES.find(p => p.value === priority)?.color || PRIORITIES[1].color;
  };

  const getTasksByStage = (stage: string) =>
    tasks.filter(t => t.stage === stage).sort((a, b) => a.sort_order - b.sort_order);

  const isOverdue = (dueDate: string | null) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="w-full">
        <div className="flex gap-3 pb-4 min-w-max">
          {KANBAN_STAGES.map(stage => {
            const stageTasks = getTasksByStage(stage);
            const colors = STAGE_COLORS[stage] || STAGE_COLORS["Lead"];
            const isDragTarget = dragOverStage === stage;

            return (
              <div
                key={stage}
                className={cn(
                  "w-[260px] flex-shrink-0 rounded-xl border transition-all",
                  colors.bg,
                  colors.border,
                  isDragTarget && "ring-2 ring-primary/40 scale-[1.01]"
                )}
                onDragOver={e => handleDragOver(e, stage)}
                onDragLeave={handleDragLeave}
                onDrop={e => handleDrop(e, stage)}
              >
                {/* Column header */}
                <div className={cn("px-3 py-2.5 rounded-t-xl flex items-center justify-between", colors.header)}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{stage}</h3>
                    <span className="text-[10px] font-medium text-muted-foreground bg-background/60 rounded-full px-1.5 py-0.5">
                      {stageTasks.length}
                    </span>
                  </div>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openNew(stage)}>
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Cards */}
                <div className="p-2 space-y-2 min-h-[80px]">
                  {stageTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
                      className={cn(
                        "group rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-all",
                        task.is_completed && "opacity-60",
                        dragTaskId === task.id && "opacity-40 scale-95"
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="mt-0.5 shrink-0"
                        >
                          <CheckCircle2 className={cn(
                            "h-4 w-4 transition-colors",
                            task.is_completed ? "text-chart-2 fill-chart-2/20" : "text-muted-foreground/40 hover:text-chart-2"
                          )} />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm font-medium text-foreground leading-tight",
                            task.is_completed && "line-through text-muted-foreground"
                          )}>
                            {task.title}
                          </p>
                        </div>
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openEdit(task)}>
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => handleDelete(task.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {task.assigned_to && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground bg-muted rounded-full px-1.5 py-0.5">
                            <User className="h-2.5 w-2.5" />
                            {task.assigned_to}
                          </span>
                        )}
                        {task.due_date && (
                          <span className={cn(
                            "inline-flex items-center gap-1 text-[10px] rounded-full px-1.5 py-0.5",
                            isOverdue(task.due_date) && !task.is_completed
                              ? "text-destructive bg-destructive/10"
                              : "text-muted-foreground bg-muted"
                          )}>
                            <Clock className="h-2.5 w-2.5" />
                            {format(new Date(task.due_date), "MMM d")}
                          </span>
                        )}
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-1.5 py-0.5 border",
                          getPriorityStyle(task.priority)
                        )}>
                          <Flag className="h-2.5 w-2.5" />
                          {task.priority}
                        </span>
                        {task.requires_client_review && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-chart-5 bg-chart-5/15 border-chart-5/30 rounded-full px-1.5 py-0.5 border">
                            <Eye className="h-2.5 w-2.5" />
                            Client Review
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {stageTasks.length === 0 && (
                    <div className="text-center py-6 text-muted-foreground/40 text-xs">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Task Name</Label>
              <Input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Kitchen Layout"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={form.assigned_to}
                  onChange={e => setForm(f => ({ ...f, assigned_to: e.target.value }))}
                  placeholder="e.g. Emily"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          <Flag className={cn("h-3 w-3", p.color.split(" ")[0])} />
                          {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !form.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {form.due_date ? format(form.due_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.due_date}
                    onSelect={d => setForm(f => ({ ...f, due_date: d }))}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={v => setForm(f => ({ ...f, stage: v }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {KANBAN_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={form.requires_client_review}
                onCheckedChange={v => setForm(f => ({ ...f, requires_client_review: !!v }))}
              />
              <Label className="text-sm font-normal">Requires Client Review</Label>
            </div>
            <Button className="w-full" onClick={handleSave}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
