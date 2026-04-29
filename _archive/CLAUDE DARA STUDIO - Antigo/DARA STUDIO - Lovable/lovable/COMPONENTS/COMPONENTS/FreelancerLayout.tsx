import { useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import daraLogo from "@/assets/dara-logo.jpg";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useFreelancerRole } from "@/hooks/useFreelancerRole";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import FreelancerSidebar from "./FreelancerSidebar";
import { Skeleton } from "@/components/ui/skeleton";

const FreelancerLayout = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { isFreelancer, loading: roleLoading } = useFreelancerRole();
  const navigate = useNavigate();

  const loading = authLoading || roleLoading;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/freelancer");
    }
    if (!loading && user && !isFreelancer) {
      navigate("/dashboard");
    }
  }, [user, loading, isFreelancer, navigate]);

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

  if (!user || !isFreelancer) return null;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FreelancerSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Link to="/" className="flex items-center gap-2">
                <img src={daraLogo} alt="DARA Studio" className="h-8 w-8 rounded" />
                <span className="font-serif text-lg font-semibold text-primary"><span className="font-bold">DARA Studio</span> | Drafting & 3D Support</span>
              </Link>
              <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded">Freelancer</span>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-muted/30">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default FreelancerLayout;
