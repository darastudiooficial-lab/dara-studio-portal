import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import daraLogo from "@/assets/dara-logo.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useAdminRole } from "@/hooks/useAdminRole";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert } from "lucide-react";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";

const AdminLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: roleLoading } = useAdminRole();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/adm/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4 w-full max-w-md p-8">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <ShieldAlert className="w-16 h-16 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold text-foreground">{t("admin.restrictedAccess")}</h1>
          <p className="text-muted-foreground">{t("admin.noPermission")}</p>
          <Link to="/" className="text-primary underline text-sm">{t("admin.backToHome")}</Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AdminSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Link to="/adm" className="flex items-center gap-2">
                <img src={daraLogo} alt="DARA Studio" className="h-8 w-8 rounded" />
                <span className="font-serif text-lg font-semibold text-primary"><span className="font-bold">DARA Studio</span> | Drafting & 3D Support</span>
              </Link>
              <span className="text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded">Admin</span>
            </div>
            <LanguageSelector />
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
