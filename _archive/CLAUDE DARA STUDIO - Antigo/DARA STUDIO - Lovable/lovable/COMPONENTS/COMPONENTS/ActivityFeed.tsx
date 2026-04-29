import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, FileUp, CreditCard, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityFeedProps {
  activities: any[];
}

const iconMap: Record<string, any> = {
  message: MessageSquare,
  file_upload: FileUp,
  payment: CreditCard,
  default: CheckCircle,
};

const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No recent activity</p>
          )}
          {activities.slice(0, 8).map((a) => {
            const Icon = iconMap[a.log_type] || iconMap.default;
            return (
              <div key={a.id} className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                <div className="p-1.5 rounded-md bg-primary/10 text-primary mt-0.5">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground line-clamp-1">{a.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] shrink-0">{a.log_type}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;
