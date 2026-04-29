import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FolderOpen, DollarSign } from "lucide-react";
import { format } from "date-fns";

const AdminFreelancers = () => {
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Get all freelancer roles
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "freelancer");

      if (!roles || roles.length === 0) {
        setLoading(false);
        return;
      }

      const freelancerIds = roles.map(r => r.user_id);

      // Get profiles, assignments, and payments in parallel
      const [profilesRes, assignmentsRes, paymentsRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", freelancerIds),
        supabase
          .from("freelancer_assignments")
          .select("freelancer_id, project_id, deadline, projects(display_address, name, stage, status, companies(name))")
          .in("freelancer_id", freelancerIds),
        supabase
          .from("freelancer_payments")
          .select("freelancer_id, agreed_amount, paid_amount, status, due_date, project_id, projects(display_address, name)")
          .in("freelancer_id", freelancerIds),
      ]);

      const profiles = profilesRes.data || [];
      const assignments = assignmentsRes.data || [];
      const payments = paymentsRes.data || [];

      const freelancerData = profiles.map(profile => {
        const myAssignments = assignments.filter((a: any) => a.freelancer_id === profile.id);
        const myPayments = payments.filter((p: any) => p.freelancer_id === profile.id);

        const activeProjects = myAssignments.filter(
          (a: any) => a.projects?.status !== "completed" && a.projects?.status !== "cancelled"
        ).length;

        const totalAgreed = myPayments.reduce((s: number, p: any) => s + Number(p.agreed_amount || 0), 0);
        const totalPaid = myPayments.reduce((s: number, p: any) => s + Number(p.paid_amount || 0), 0);

        return {
          ...profile,
          assignments: myAssignments,
          payments: myPayments,
          activeProjects,
          totalAgreed,
          totalPaid,
          totalReceivable: Math.max(totalAgreed - totalPaid, 0),
        };
      });

      setFreelancers(freelancerData);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Freelancers</h1>
        <p className="text-sm text-muted-foreground">View all freelancers, their assigned projects and payment status</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Freelancers</p>
              <p className="text-2xl font-bold text-foreground">{freelancers.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-chart-2" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold text-foreground">
                ${freelancers.reduce((s, f) => s + f.totalPaid, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Receivable</p>
              <p className="text-2xl font-bold text-foreground">
                ${freelancers.reduce((s, f) => s + f.totalReceivable, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Freelancer Cards */}
      {freelancers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            No freelancers registered yet
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {freelancers.map(f => (
            <Card key={f.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      {f.avatar_url ? (
                        <img src={f.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                      ) : (
                        <span className="text-primary-foreground font-semibold text-sm">
                          {f.full_name?.charAt(0)?.toUpperCase() || "F"}
                        </span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{f.full_name || "Unnamed"}</CardTitle>
                      <p className="text-xs text-muted-foreground">{f.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Active</p>
                      <p className="font-bold text-foreground">{f.activeProjects}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Paid</p>
                      <p className="font-bold text-chart-2">${f.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground text-xs">Receivable</p>
                      <p className="font-bold text-destructive">${f.totalReceivable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Assigned Projects */}
                {f.assignments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Projects</p>
                    <div className="space-y-2">
                      {f.assignments.map((a: any, i: number) => {
                        const projectLabel = a.projects?.display_address || a.projects?.name || "Unknown";
                        const stage = a.projects?.stage || "—";
                        const company = a.projects?.companies?.name || "";
                        const stageColors: Record<string, string> = {
                          "In Progress": "bg-chart-2/15 text-chart-2 border-chart-2/30",
                          "Completed": "bg-chart-2/15 text-chart-2 border-chart-2/30",
                          "Revision": "bg-chart-5/15 text-chart-5 border-chart-5/30",
                          "Delayed": "bg-destructive/15 text-destructive border-destructive/30",
                        };
                        const badgeClass = stageColors[stage] || "bg-muted text-muted-foreground border-border";

                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <FolderOpen className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <span className="text-sm font-medium text-foreground">{projectLabel}</span>
                                {company && <span className="text-xs text-muted-foreground ml-2">({company})</span>}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {a.deadline && (
                                <span className="text-xs text-muted-foreground">
                                  Due: {format(new Date(a.deadline), "MMM dd")}
                                </span>
                              )}
                              <Badge className={`${badgeClass} border rounded-full px-3 py-1 text-xs font-semibold`}>
                                {stage}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Payments */}
                {f.payments.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Payments</p>
                    <div className="space-y-2">
                      {f.payments.map((p: any, i: number) => {
                        const agreed = Number(p.agreed_amount || 0);
                        const paid = Number(p.paid_amount || 0);
                        const status = paid <= 0 ? "pending" : paid < agreed ? "partial" : "paid";
                        const statusConfig: Record<string, { label: string; className: string }> = {
                          pending: { label: "Pending", className: "bg-destructive/15 text-destructive border-destructive/30" },
                          partial: { label: "Partial", className: "bg-chart-4/15 text-chart-4 border-chart-4/30" },
                          paid: { label: "Paid", className: "bg-chart-2/15 text-chart-2 border-chart-2/30" },
                        };
                        const config = statusConfig[status];
                        const projectLabel = p.projects?.display_address || p.projects?.name || "—";

                        return (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="text-sm">
                              <span className="font-medium text-foreground">{projectLabel}</span>
                              <span className="text-muted-foreground ml-2">
                                ${agreed.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              {p.due_date && (
                                <span className="text-xs text-muted-foreground">
                                  {format(new Date(p.due_date), "MMM dd")}
                                </span>
                              )}
                              <Badge className={`${config.className} border rounded-full px-3 py-1 text-xs font-semibold`}>
                                {config.label}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {f.assignments.length === 0 && f.payments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No assignments or payments yet</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFreelancers;
