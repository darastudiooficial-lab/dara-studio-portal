import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Building2, FolderKanban, CreditCard,
  Milestone, Activity, LogOut, MapPin, GanttChart, Users,
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { title: t("admin.dashboard"), url: "/adm", icon: LayoutDashboard },
    { title: t("admin.companies"), url: "/adm/companies", icon: Building2 },
    { title: t("admin.projects"), url: "/adm/projects", icon: FolderKanban },
    { title: t("admin.gantt"), url: "/adm/gantt", icon: GanttChart },
    { title: t("admin.map"), url: "/adm/map", icon: MapPin },
    { title: t("admin.payments"), url: "/adm/payments", icon: CreditCard },
    { title: t("admin.milestones"), url: "/adm/milestones", icon: Milestone },
    { title: t("admin.activity"), url: "/adm/activity", icon: Activity },
    { title: "Freelancers", url: "/adm/freelancers", icon: Users },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.url)}
                    isActive={location.pathname === item.url}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={async () => { await signOut(); navigate("/"); }}>
              <LogOut className="h-4 w-4" />
              <span>{t("admin.signOut")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
