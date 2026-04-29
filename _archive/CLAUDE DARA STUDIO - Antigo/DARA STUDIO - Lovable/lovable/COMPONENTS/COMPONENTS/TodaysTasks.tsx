import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CalendarDays, Plus, Flag, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  project_id: string | null;
  priority: string;
  due_date: string;
  is_completed: boolean;
  project_name?: string;
}

interface TodaysTasksProps {
  tasks: Task[];
  projects: { id: string; name: string | null; companies?: { name: string } | null }[];
  onRefresh: () => void;
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High", className: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Medium", className: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
  low: { label: "Low", className: "bg-muted text-muted-foreground border-border" },
};

const TodaysTasks = ({ tasks, projects, onRefresh }: TodaysTasksProps) => {
  const [filter, setFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newProjectId, setNewProjectId] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split("T")[0]);

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return !t.is_completed;
    if (filter === "completed") return t.is_completed;
    return t.priority === filter;
  });

  const handleToggle = async (task: Task) => {
    const nowCompleted = !task.is_completed;
    const { error } = await supabase
      .from("admin_tasks")
      .update({
        is_completed: nowCompleted,
        completed_at: nowCompleted ? new Date().toISOString() : null,
      })
      .eq("id", task.id);
    if (!error) onRefresh();
    else toast.error("Failed to update task");
  };

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const { error } = await supabase.from("admin_tasks").insert({
      title: newTitle.trim(),
      project_id: newProjectId || null,
      priority: newPriority,
      due_date: newDueDate,
    });
    if (!error) {
      toast.success("Task added");
      setNewTitle("");
      setNewProjectId("");
      setNewPriority("medium");
      setNewDueDate(new Date().toISOString().split("T")[0]);
      setDialogOpen(false);
      onRefresh();
    } else {
      toast.error("Failed to add task");
    }
  };

  const pendingCount = tasks.filter((t) => !t.is_completed).length;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-base font-semibold">Today's Tasks</CardTitle>
          <Badge variant="secondary" className="ml-auto">{pendingCount} pending</Badge>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-7 text-xs w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 ml-auto gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Task title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                <Select value={newProjectId} onValueChange={setNewProjectId}>
                  <SelectTrigger><SelectValue placeholder="Related project (optional)" /></SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name || p.companies?.name || "Untitled"}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-3">
                  <Select value={newPriority} onValueChange={setNewPriority}>
                    <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="date" className="flex-1" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleAdd} disabled={!newTitle.trim()}>Add Task</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1.5 max-h-[280px] overflow-y-auto">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              {filter === "all" ? "No tasks yet — add one!" : "No tasks match this filter"}
            </p>
          )}
          {filtered.map((task) => {
            const prio = priorityConfig[task.priority] || priorityConfig.medium;
            return (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors ${task.is_completed ? "opacity-50" : ""}`}
              >
                <Checkbox checked={task.is_completed} onCheckedChange={() => handleToggle(task)} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${task.is_completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {task.title}
                  </p>
                  {task.project_name && (
                    <p className="text-xs text-muted-foreground truncate">{task.project_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="outline" className={`text-[10px] gap-1 ${prio.className}`}>
                    <Flag className="h-2.5 w-2.5" />
                    {prio.label}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground whitespace-nowrap">{task.due_date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysTasks;
