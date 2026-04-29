import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus, UserPlus, FolderKanban, FileText, DollarSign, AlertTriangle, MessageSquareWarning } from "lucide-react";

interface KPICardsProps {
  totalProjects: number;
  activeProjects: number;
  totalClients: number;
  newLeads: number;
  revenue: number;
  pendingPayments: number;
  delayedProjects?: number;
  proposalsSent?: number;
  clientTickets?: number;
}

const KPICards = ({
  activeProjects,
  newLeads,
  revenue,
  delayedProjects = 0,
  proposalsSent = 0,
  clientTickets = 0,
}: KPICardsProps) => {
  const navigate = useNavigate();

  const cards = [
    {
      label: "Leads Received", sublabel: "Last 30 days", value: newLeads,
      icon: UserPlus, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950/40",
      iconBg: "bg-blue-100 dark:bg-blue-900/50", borderAccent: "border-l-blue-500",
      change: "+4", changeType: "up" as const, url: "/adm/leads",
    },
    {
      label: "Active Projects", sublabel: "In progress", value: activeProjects,
      icon: FolderKanban, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-950/40",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50", borderAccent: "border-l-emerald-500",
      change: "+2", changeType: "up" as const, url: "/adm/projects",
    },
    {
      label: "Proposals Sent", sublabel: "This month", value: proposalsSent,
      icon: FileText, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950/40",
      iconBg: "bg-amber-100 dark:bg-amber-900/50", borderAccent: "border-l-amber-500",
      change: "0", changeType: "neutral" as const, url: "/adm/proposals",
    },
    {
      label: "Revenue Pipeline", sublabel: "Total value", value: `$${revenue.toLocaleString()}`,
      icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950/40",
      iconBg: "bg-purple-100 dark:bg-purple-900/50", borderAccent: "border-l-purple-500",
      change: "+12%", changeType: "up" as const, url: "/adm/analytics",
    },
    {
      label: "Delayed Projects", sublabel: "Needs attention", value: delayedProjects,
      icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/40",
      iconBg: "bg-red-100 dark:bg-red-900/50", borderAccent: "border-l-red-500",
      change: delayedProjects > 0 ? `${delayedProjects}` : "0",
      changeType: delayedProjects > 0 ? "down" as const : "neutral" as const,
      url: "/adm/projects",
    },
    {
      label: "Client Tickets", sublabel: "Open requests", value: clientTickets,
      icon: MessageSquareWarning, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/40",
      iconBg: "bg-orange-100 dark:bg-orange-900/50", borderAccent: "border-l-orange-500",
      change: clientTickets > 0 ? `${clientTickets} open` : "0",
      changeType: clientTickets > 0 ? "down" as const : "neutral" as const,
      url: "/adm/tickets",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => (
        <Card
          key={card.label}
          onClick={() => navigate(card.url)}
          className={`border-none shadow-sm hover:shadow-md transition-all border-l-4 ${card.borderAccent} ${card.bg} cursor-pointer`}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className={`p-2 rounded-lg ${card.iconBg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
              <div className="flex items-center gap-1 text-[11px] font-medium">
                {card.changeType === "up" && <TrendingUp className="h-3 w-3 text-emerald-500" />}
                {card.changeType === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                {card.changeType === "neutral" && <Minus className="h-3 w-3 text-muted-foreground" />}
                <span className={
                  card.changeType === "up" ? "text-emerald-600" :
                  card.changeType === "down" ? "text-red-600" :
                  "text-muted-foreground"
                }>
                  {card.change}
                </span>
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground leading-none mb-1">{card.value}</p>
            <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
            <p className="text-[10px] text-muted-foreground/70">{card.sublabel}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICards;
