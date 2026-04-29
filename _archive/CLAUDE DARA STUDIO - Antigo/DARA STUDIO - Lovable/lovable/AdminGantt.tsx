import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/hooks/useLanguage";
import { ChevronLeft, ChevronRight, GanttChart, CalendarDays } from "lucide-react";
import { format, addDays, startOfWeek, startOfMonth, endOfMonth, differenceInDays, isSameDay, isSameMonth, getDay } from "date-fns";

const PROJECT_STAGE_COLORS: Record<string, string> = {
  "Lead": "bg-muted-foreground",
  "Budget Sent": "bg-chart-4",
  "Budget Approved": "bg-chart-2",
  "Waiting Payment": "bg-chart-3",
  "In Progress": "bg-chart-2",
  "Preview Sent": "bg-chart-4",
  "Revision": "bg-chart-5",
  "Final Review": "bg-primary",
  "Completed": "bg-chart-2",
  "On Hold": "bg-muted-foreground",
  "Cancelled": "bg-muted-foreground",
  "Delayed": "bg-destructive",
};

const AdminGantt = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, stage, start_date, delivery_date, companies(name), street_name, street_number, city, display_address")
        .order("start_date", { ascending: true });
      setProjects(data || []);
    };
    fetch();
  }, []);

  // Gantt logic
  const daysCount = viewMode === "week" ? 7 : 28;
  const days = useMemo(() => Array.from({ length: daysCount }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart, daysCount]);

  const navigate = (dir: number) => {
    setCurrentWeekStart(prev => addDays(prev, dir > 0 ? daysCount : -daysCount));
  };

  const rangeEnd = addDays(currentWeekStart, daysCount - 1);

  const visibleProjects = projects.filter(p => {
    if (!p.start_date && !p.delivery_date) return false;
    const start = p.start_date ? new Date(p.start_date) : new Date(p.delivery_date);
    const end = p.delivery_date ? new Date(p.delivery_date) : new Date(p.start_date);
    return start <= rangeEnd && end >= currentWeekStart;
  });

  const getBarStyle = (project: any) => {
    const start = new Date(project.start_date || project.delivery_date);
    const end = new Date(project.delivery_date || project.start_date);
    const startOffset = Math.max(0, differenceInDays(start, currentWeekStart));
    const endOffset = Math.min(daysCount - 1, differenceInDays(end, currentWeekStart));
    const width = endOffset - startOffset + 1;
    return { left: `${(startOffset / daysCount) * 100}%`, width: `${(width / daysCount) * 100}%` };
  };

  const projectName = (p: any) => {
    const addr = p.display_address || [p.street_number, p.street_name].filter(Boolean).join(" ");
    return addr || p.companies?.name || "—";
  };

  const todayOffset = differenceInDays(new Date(), currentWeekStart);
  const todayInRange = todayOffset >= 0 && todayOffset < daysCount;

  // Calendar logic
  const monthStart = startOfMonth(calendarMonth);
  const monthEnd = endOfMonth(calendarMonth);
  const calendarStartDay = getDay(monthStart); // 0=Sun
  const totalDaysInMonth = differenceInDays(monthEnd, monthStart) + 1;
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = addDays(monthStart, i - calendarStartDay);
    return day;
  });

  const getProjectsOnDate = (date: Date) => {
    return projects.filter(p => {
      if (!p.start_date && !p.delivery_date) return false;
      const start = p.start_date ? new Date(p.start_date) : new Date(p.delivery_date);
      const end = p.delivery_date ? new Date(p.delivery_date) : new Date(p.start_date);
      return date >= start && date <= end;
    });
  };

  const navigateCalendar = (dir: number) => {
    setCalendarMonth(prev => {
      const d = new Date(prev);
      d.setMonth(d.getMonth() + dir);
      return d;
    });
  };

  const selectedDateProjects = selectedDate ? getProjectsOnDate(selectedDate) : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{t("admin.gantt")} & Calendar</h1>
        <p className="text-sm text-muted-foreground">Visualize project timelines and overlapping work</p>
      </div>

      <Tabs defaultValue="gantt">
        <TabsList>
          <TabsTrigger value="gantt" className="gap-2"><GanttChart className="h-4 w-4" />Gantt</TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2"><CalendarDays className="h-4 w-4" />Calendar</TabsTrigger>
        </TabsList>

        {/* GANTT TAB */}
        <TabsContent value="gantt" className="space-y-4">
          <div className="flex items-center justify-end gap-2">
            <Select value={viewMode} onValueChange={v => setViewMode(v as any)}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="week">{t("admin.weekView")}</SelectItem>
                <SelectItem value="month">{t("admin.monthView")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>{t("admin.today")}</Button>
            <Button variant="outline" size="icon" onClick={() => navigate(1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>

          <Card>
            <CardContent className="p-0 overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex border-b border-border">
                  <div className="w-[220px] flex-shrink-0 p-3 text-sm font-medium text-muted-foreground border-r border-border">
                    {t("admin.projects")}
                  </div>
                  <div className="flex-1 flex">
                    {days.map((day, i) => {
                      const isToday = isSameDay(day, new Date());
                      return (
                        <div key={i} className={`flex-1 text-center py-2 text-xs border-r border-border last:border-r-0 ${isToday ? "bg-primary/10 font-bold text-primary" : "text-muted-foreground"}`}>
                          <div>{format(day, viewMode === "week" ? "EEE" : "dd")}</div>
                          <div className="font-medium">{format(day, viewMode === "week" ? "dd" : "MMM")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {visibleProjects.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">{t("admin.noProjects")}</div>
                ) : (
                  visibleProjects.map(p => {
                    const barStyle = getBarStyle(p);
                    const stageColor = PROJECT_STAGE_COLORS[p.stage] || "bg-muted-foreground";
                    return (
                      <div key={p.id} className="flex border-b border-border last:border-b-0 hover:bg-muted/30">
                        <div className="w-[220px] flex-shrink-0 p-3 text-sm font-medium text-foreground border-r border-border truncate flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${stageColor}`} />
                          {projectName(p)}
                        </div>
                        <div className="flex-1 relative h-12">
                          {todayInRange && (
                            <div className="absolute top-0 bottom-0 w-0.5 bg-destructive z-10" style={{ left: `${((todayOffset + 0.5) / daysCount) * 100}%` }} />
                          )}
                          <div className={`absolute top-2 h-8 rounded-md ${stageColor} opacity-80 hover:opacity-100 transition-opacity flex items-center px-2 min-w-[20px]`} style={barStyle}>
                            <span className="text-xs font-medium text-primary-foreground truncate">{p.companies?.name || ""}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3">
            {Object.entries(PROJECT_STAGE_COLORS).map(([stage, color]) => (
              <div key={stage} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={`w-3 h-3 rounded-sm ${color}`} />
                {stage}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* CALENDAR TAB */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{format(calendarMonth, "MMMM yyyy")}</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => navigateCalendar(-1)}><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" onClick={() => { setCalendarMonth(new Date()); setSelectedDate(new Date()); }}>Today</Button>
              <Button variant="outline" size="icon" onClick={() => navigateCalendar(1)}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4">
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                  <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
                ))}
              </div>
              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, i) => {
                  const inMonth = isSameMonth(day, calendarMonth);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const dayProjects = getProjectsOnDate(day);
                  const hasProjects = dayProjects.length > 0;

                  return (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(day)}
                      className={`relative p-2 h-16 rounded-md text-sm transition-colors text-left
                        ${!inMonth ? "text-muted-foreground/40" : "text-foreground"}
                        ${isToday ? "ring-2 ring-primary" : ""}
                        ${isSelected ? "bg-primary/10" : "hover:bg-muted/50"}
                      `}
                    >
                      <span className={`text-xs ${isToday ? "font-bold text-primary" : ""}`}>{format(day, "d")}</span>
                      {hasProjects && inMonth && (
                        <div className="flex gap-0.5 mt-1 flex-wrap">
                          {dayProjects.slice(0, 3).map((p, j) => (
                            <span key={j} className={`w-2 h-2 rounded-full ${PROJECT_STAGE_COLORS[p.stage] || "bg-muted-foreground"}`} />
                          ))}
                          {dayProjects.length > 3 && <span className="text-[10px] text-muted-foreground">+{dayProjects.length - 3}</span>}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected date details */}
          {selectedDate && (
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground mb-3">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
                {selectedDateProjects.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active projects on this date</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateProjects.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${PROJECT_STAGE_COLORS[p.stage] || "bg-muted-foreground"}`} />
                          <span className="font-medium text-sm text-foreground">{projectName(p)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span>{p.stage || "—"}</span>
                          <span>{p.companies?.name}</span>
                        </div>
                      </div>
                    ))}
                    <p className="text-xs text-muted-foreground mt-2">{selectedDateProjects.length} project(s) active</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminGantt;
