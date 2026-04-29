import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, FolderKanban, Building2, UserPlus, FileText, FileSignature,
  Receipt, PenTool, FolderOpen, ShieldCheck, BrainCircuit, Globe, BarChart3,
  Settings, LogOut, Ticket, Users, PieChart,
} from "lucide-react";

const sidebarGroups = [
  {
    label: "Dashboard",
    items: [
      { title: "Dashboard", url: "/adm", icon: LayoutDashboard },
    ],
  },
  {
    label: "CRM",
    items: [
      { title: "Companies", url: "/adm/companies", icon: Building2 },
      { title: "Leads", url: "/adm/leads", icon: UserPlus },
    ],
  },
  {
    label: "Projects",
    items: [
      { title: "Projects", url: "/adm/projects", icon: FolderKanban },
      { title: "Drawings", url: "/adm/drawings", icon: PenTool },
      { title: "Files", url: "/adm/files", icon: FolderOpen },
    ],
  },
  {
    label: "Business",
    items: [
      { title: "Finance Overview", url: "/adm/finance-overview", icon: PieChart },
      { title: "Proposals", url: "/adm/proposals", icon: FileText },
      { title: "Contracts", url: "/adm/contracts", icon: FileSignature },
      { title: "Invoices", url: "/adm/payments", icon: Receipt },
    ],
  },
  {
    label: "Client Experience",
    items: [
      { title: "Client Portal", url: "/adm/client-portal", icon: Globe },
      { title: "Client Tickets", url: "/adm/tickets", icon: Ticket },
    ],
  },
  {
    label: "Tools",
    items: [
      { title: "AI Code Check", url: "/adm/ai-code-check", icon: BrainCircuit },
    ],
  },
  {
    label: "Insights",
    items: [
      { title: "Analytics", url: "/adm/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Settings", url: "/adm/settings", icon: Settings },
    ],
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground/70">{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.url)}
                      isActive={location.pathname === item.url || (item.url !== "/adm" && location.pathname.startsWith(item.url + "/"))}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
