import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

const AdminPermits = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Permits</h1>
        <p className="text-sm text-muted-foreground">Track permit submissions and approvals</p>
      </div>
      <Card className="border-none shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ShieldCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Permit Tracking</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Track permit submissions, approvals, and inspection schedules for all projects. This module will be connected to project milestones.
          </p>
          <Badge variant="secondary" className="mt-4">Coming Soon</Badge>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPermits;
