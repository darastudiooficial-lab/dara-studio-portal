import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle,
  Upload,
  RotateCcw,
  MessageSquare,
  FileCheck,
  Download,
  Eye,
  Bell,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCountryFlag } from "@/utils/countryFlags";

interface ClientActivity {
  id: string;
  client_name: string;
  client_country?: string | null;
  company_id?: string | null;
  project_name: string;
  action: string;
  action_type: string;
  created_at: string;
}

interface ClientActivityFeedProps {
  activities: ClientActivity[];
}

const ACTION_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  approval: { icon: CheckCircle, color: "text-emerald-500 bg-emerald-500/10", label: "Approved" },
  upload: { icon: Upload, color: "text-blue-500 bg-blue-500/10", label: "Uploaded" },
  revision: { icon: RotateCcw, color: "text-amber-500 bg-amber-500/10", label: "Revision" },
  message: { icon: MessageSquare, color: "text-violet-500 bg-violet-500/10", label: "Message" },
  invoice: { icon: FileCheck, color: "text-emerald-600 bg-emerald-600/10", label: "Invoice" },
  download: { icon: Download, color: "text-cyan-500 bg-cyan-500/10", label: "Download" },
  view: { icon: Eye, color: "text-muted-foreground bg-muted", label: "Viewed" },
  default: { icon: Bell, color: "text-muted-foreground bg-muted", label: "Activity" },
};

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const ClientActivityFeed = ({ activities }: ClientActivityFeedProps) => {
  const navigate = useNavigate();
  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Client Activity</CardTitle>
          {activities.length > 0 && (
            <Badge variant="secondary" className="text-[10px]">
              {activities.length} recent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[340px] pr-3">
          {activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No client activity yet</p>
            </div>
          )}
          <div className="space-y-1">
            {activities.map((a) => {
              const config = ACTION_CONFIG[a.action_type] || ACTION_CONFIG.default;
              const Icon = config.icon;
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group"
                >
                  <Avatar className="h-8 w-8 shrink-0 mt-0.5">
                    <AvatarFallback className="text-[10px] font-medium bg-primary/10 text-primary">
                      {getInitials(a.client_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm leading-snug">
                      <span
                        className="font-medium text-foreground hover:text-primary cursor-pointer hover:underline"
                        onClick={() => a.company_id && navigate(`/adm/clients/${a.company_id}`)}
                      >{a.client_name} {getCountryFlag(a.client_country)}</span>{" "}
                      <span className="text-muted-foreground">{a.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{a.project_name}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className={`p-1 rounded-md ${config.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ClientActivityFeed;
