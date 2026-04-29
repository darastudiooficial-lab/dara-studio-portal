import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import KPICards from "@/components/admin/dashboard/KPICards";
import ProjectPipeline from "@/components/admin/dashboard/ProjectPipeline";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import ClientActivityFeed from "@/components/admin/dashboard/ClientActivityFeed";
import TodaysTasks from "@/components/admin/dashboard/TodaysTasks";
import FinancialChart from "@/components/admin/dashboard/FinancialChart";
import NewLeadsTable from "@/components/admin/dashboard/NewLeadsTable";
import QuickActions from "@/components/admin/dashboard/QuickActions";
import ClientTicketsWidget from "@/components/admin/dashboard/ClientTicketsWidget";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [clientActivities, setClientActivities] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  const fetchData = async () => {
    const [projRes, compRes, actRes, payRes, taskRes] = await Promise.all([
      supabase.from("projects").select("*, companies(name, country, language)"),
      supabase.from("companies").select("id, name"),
      supabase.from("activity_log").select("*, projects(name, companies(name, country))").order("created_at", { ascending: false }).limit(20),
      supabase.from("admin_payments").select("*"),
      supabase.from("admin_tasks").select("*, projects(name, companies(name))").order("due_date", { ascending: true }),
    ]);
    setProjects(projRes.data || []);
    setCompanies(compRes.data || []);
    setActivities(actRes.data || []);
    setPayments(payRes.data || []);

    // Build tasks with project name
    const taskList = (taskRes.data || []).map((t: any) => ({
      ...t,
      project_name: t.projects?.name || t.projects?.companies?.name || null,
    }));
    setTasks(taskList);

    // Build client activity feed from activity_log entries
    const clientTypes = ["approval", "upload", "revision", "message", "invoice", "download", "view"];
    const clientActs = (actRes.data || [])
      .filter((a: any) => clientTypes.includes(a.log_type) || a.log_type === "file_upload")
      .map((a: any) => ({
        id: a.id,
        client_name: a.projects?.companies?.name || "Client",
        client_country: a.projects?.companies?.country || null,
        company_id: a.project_id ? (projRes.data || []).find((p: any) => p.id === a.project_id)?.company_id : null,
        project_name: a.projects?.name || "Project",
        action: a.description,
        action_type: a.log_type === "file_upload" ? "upload" : a.log_type,
        created_at: a.created_at,
      }));
    setClientActivities(clientActs);
  };

  useEffect(() => { fetchData(); }, []);

  const activeStages = ["In Progress", "Preview Sent", "Revision", "Final Review"];
  const activeCount = projects.filter((p) => activeStages.includes(p.stage)).length;
  const revenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount_paid || 0), 0);
  const pendingPayments = payments.filter((p) => p.status !== "paid").reduce((s, p) => s + Number(p.amount_total || 0), 0);
  const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newLeads = projects.filter((p) => (p.stage === "Lead" || p.stage === "briefing") && new Date(p.created_at) >= thirtyDaysAgo).length;
  const delayedProjects = projects.filter((p) => p.stage === "Delayed" || (p.delivery_date && new Date(p.delivery_date) < new Date() && p.stage !== "Completed")).length;
  const proposalsSent = projects.filter((p) => p.stage === "Budget Sent" || p.stage === "Proposal Sent").length;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Welcome back, {user?.user_metadata?.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your studio today.</p>
        </div>
        <QuickActions />
      </div>

      {/* KPI Cards */}
      <KPICards
        totalProjects={projects.length}
        activeProjects={activeCount}
        totalClients={companies.length}
        newLeads={newLeads}
        revenue={revenue}
        pendingPayments={pendingPayments}
        delayedProjects={delayedProjects}
        proposalsSent={proposalsSent}
      />

      {/* Project Pipeline */}
      <ProjectPipeline projects={projects} onProjectMoved={fetchData} />

      {/* Activity + Client Activity + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={activities} />
        <ClientActivityFeed activities={clientActivities} />
      </div>

      {/* Tickets + Today's Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientTicketsWidget />
        <TodaysTasks tasks={tasks} projects={projects} onRefresh={fetchData} />
      </div>

      {/* Financial Performance */}
      <FinancialChart payments={payments} projects={projects} />

      {/* New Leads */}
      <NewLeadsTable />
    </div>
  );
};

export default AdminDashboard;
