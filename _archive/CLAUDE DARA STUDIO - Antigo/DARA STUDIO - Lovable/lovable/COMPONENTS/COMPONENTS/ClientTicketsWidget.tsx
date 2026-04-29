import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Ticket, MessageSquare, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";

interface TicketRow {
  id: string;
  subject: string;
  status: string;
  updated_at: string;
  projects: { name: string } | null;
  companies: { name: string } | null;
}

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  open: { label: "Open", variant: "destructive" },
  waiting: { label: "Waiting", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
};

const ClientTicketsWidget = () => {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("client_tickets")
        .select("id, subject, status, updated_at, projects(name), companies(name)")
        .order("updated_at", { ascending: false })
        .limit(8);
      setTickets((data as any[]) || []);
    };
    fetch();
  }, []);

  const openCount = tickets.filter((t) => t.status === "open").length;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Client Tickets</CardTitle>
          <div className="flex items-center gap-2">
            {openCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {openCount} open
              </Badge>
            )}
            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate("/adm/tickets")}>
              View All <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3">
          {tickets.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">No tickets yet</p>
            </div>
          )}
          <div className="space-y-1">
            {tickets.map((t) => {
              const style = STATUS_STYLES[t.status] || STATUS_STYLES.open;
              return (
                <div
                  key={t.id}
                  className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/adm/tickets?id=${t.id}`)}
                >
                  <div className="p-1.5 rounded-md bg-accent text-accent-foreground mt-0.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.companies?.name || "Client"} · {t.projects?.name || "Project"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <Badge variant={style.variant} className="text-[10px]">{style.label}</Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {formatDistanceToNow(new Date(t.updated_at), { addSuffix: true })}
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

export default ClientTicketsWidget;
