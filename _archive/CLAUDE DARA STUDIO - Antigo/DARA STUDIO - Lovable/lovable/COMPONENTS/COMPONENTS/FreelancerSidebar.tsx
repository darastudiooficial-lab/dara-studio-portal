import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, FolderOpen, DollarSign, FileText, CalendarDays, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const FreelancerSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut, user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { title: t("freelancer.dashboard"), url: "/work", icon: LayoutDashboard },
    { title: t("freelancer.projects"), url: "/work/projects", icon: FolderOpen },
    { title: t("freelancer.payments"), url: "/work/payments", icon: DollarSign },
    { title: t("freelancer.contracts"), url: "/work/contracts", icon: FileText },
    { title: t("freelancer.calendar"), url: "/work/calendar", icon: CalendarDays },
  ];

  const settingsItems = [
    { title: t("profile.title"), url: "/work/profile", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/work") return location.pathname === "/work";
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">{user?.email?.charAt(0).toUpperCase() || "F"}</span>
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground truncate max-w-[140px]">{user?.user_metadata?.full_name || "Freelancer"}</span>
              <span className="text-xs text-sidebar-foreground/60 truncate max-w-[140px]">{user?.email}</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t("freelancer.workspaceLabel")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>{t("dashboard.settings")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <NavLink to={item.url}><item.icon className="h-4 w-4" /><span>{item.title}</span></NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground" onClick={signOut}>
          <LogOut className={cn("h-4 w-4", !collapsed && "mr-2")} />
          {!collapsed && t("freelancer.signOut")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default FreelancerSidebar;
