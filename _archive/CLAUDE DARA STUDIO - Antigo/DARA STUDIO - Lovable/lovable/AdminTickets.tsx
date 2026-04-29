import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MessageSquare, Send, Ticket } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  open: { label: "Open", variant: "destructive" },
  waiting: { label: "Waiting", variant: "secondary" },
  resolved: { label: "Resolved", variant: "outline" },
};

const AdminTickets = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tickets, setTickets] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({ project_id: "", subject: "", message: "" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchTickets = async () => {
    const { data } = await supabase
      .from("client_tickets")
      .select("*, projects(name, company_id), companies(name)")
      .order("updated_at", { ascending: false });
    setTickets(data || []);
    return data || [];
  };

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("id, name, company_id").order("name");
    setProjects(data || []);
  };

  const fetchMessages = async (ticketId: string) => {
    const { data } = await supabase
      .from("client_ticket_messages")
      .select("*")
      .eq("ticket_id", ticketId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 100);
  };

  useEffect(() => {
    fetchTickets().then((tks) => {
      const urlId = searchParams.get("id");
      if (urlId) {
        const found = tks.find((t: any) => t.id === urlId);
        if (found) openTicket(found);
      }
    });
    fetchProjects();
  }, []);

  const openTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
  };

  const handleCreate = async () => {
    if (!form.project_id || !form.subject.trim()) {
      toast.error("Project and subject are required");
      return;
    }
    const proj = projects.find((p) => p.id === form.project_id);
    const { data: ticket, error } = await supabase
      .from("client_tickets")
      .insert({
        project_id: form.project_id,
        company_id: proj?.company_id,
        subject: form.subject,
        created_by: user?.id,
      })
      .select()
      .single();
    if (error) { toast.error(error.message); return; }
    if (form.message.trim() && ticket) {
      await supabase.from("client_ticket_messages").insert({
        ticket_id: ticket.id,
        sender_id: user?.id,
        is_from_admin: true,
        content: form.message,
      });
    }
    toast.success("Ticket created");
    setCreateOpen(false);
    setForm({ project_id: "", subject: "", message: "" });
    fetchTickets();
  };

  const handleSendMsg = async () => {
    if (!newMsg.trim() || !selectedTicket) return;
    const { error } = await supabase.from("client_ticket_messages").insert({
      ticket_id: selectedTicket.id,
      sender_id: user?.id,
      is_from_admin: true,
      content: newMsg,
    });
    if (error) { toast.error(error.message); return; }
    await supabase.from("client_tickets").update({ updated_at: new Date().toISOString() }).eq("id", selectedTicket.id);
    setNewMsg("");
    fetchMessages(selectedTicket.id);
  };

  const handleStatusChange = async (ticketId: string, status: string) => {
    await supabase.from("client_tickets").update({ status }).eq("id", ticketId);
    fetchTickets();
    if (selectedTicket?.id === ticketId) setSelectedTicket({ ...selectedTicket, status });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Client Tickets</h1>
          <p className="text-sm text-muted-foreground">Manage client support conversations</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Ticket</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Project *</Label>
                <Select value={form.project_id} onValueChange={(v) => setForm({ ...form, project_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>{projects.map((p) => <SelectItem key={p.id} value={p.id}>{p.name || "Untitled"}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subject *</Label>
                <Input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Concept Design Feedback" />
              </div>
              <div>
                <Label>Initial Message</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Optional first message..." />
              </div>
              <Button className="w-full" onClick={handleCreate}>Create Ticket</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Ticket list */}
        <div className="space-y-2">
          {tickets.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Ticket className="h-10 w-10 mx-auto mb-2 text-muted-foreground/40" />
              No tickets yet
            </div>
          )}
          {tickets.map((t) => {
            const style = STATUS_STYLES[t.status] || STATUS_STYLES.open;
            const isActive = selectedTicket?.id === t.id;
            return (
              <Card
                key={t.id}
                className={`cursor-pointer transition-colors ${isActive ? "ring-2 ring-primary" : "hover:bg-muted/30"}`}
                onClick={() => openTicket(t)}
              >
                <CardContent className="flex items-start gap-3 py-3">
                  <div className="p-1.5 rounded-md bg-accent text-accent-foreground mt-0.5">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground line-clamp-1">{t.subject}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {t.companies?.name} · {t.projects?.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(t.updated_at), { addSuffix: true })}
                    </p>
                  </div>
                  <Select value={t.status} onValueChange={(v) => handleStatusChange(t.id, v)}>
                    <SelectTrigger className="w-auto h-6 text-[10px] border-none p-0" onClick={(e) => e.stopPropagation()}>
                      <Badge variant={style.variant} className="text-[10px] cursor-pointer">{style.label}</Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Conversation thread */}
        <Card className="border-none shadow-sm">
          <CardContent className="p-0">
            {!selectedTicket ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <MessageSquare className="h-10 w-10 mb-2 text-muted-foreground/30" />
                <p className="text-sm">Select a ticket to view the conversation</p>
              </div>
            ) : (
              <div className="flex flex-col h-[500px]">
                {/* Thread header */}
                <div className="px-4 py-3 border-b">
                  <h3 className="text-sm font-semibold text-foreground">{selectedTicket.subject}</h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedTicket.companies?.name} · {selectedTicket.projects?.name}
                  </p>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 px-4 py-3" ref={scrollRef}>
                  {messages.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">No messages yet</p>
                  )}
                  <div className="space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex gap-2 ${m.is_from_admin ? "justify-end" : "justify-start"}`}>
                        {!m.is_from_admin && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[10px] bg-primary/10 text-primary">CL</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                          m.is_from_admin
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}>
                          <p>{m.content}</p>
                          <p className={`text-[10px] mt-1 ${m.is_from_admin ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                            {format(new Date(m.created_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                        {m.is_from_admin && (
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarFallback className="text-[10px] bg-accent text-accent-foreground">AD</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="px-4 py-3 border-t flex gap-2">
                  <Input
                    placeholder="Type a reply..."
                    value={newMsg}
                    onChange={(e) => setNewMsg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMsg()}
                    className="flex-1"
                  />
                  <Button size="icon" onClick={handleSendMsg} disabled={!newMsg.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTickets;
