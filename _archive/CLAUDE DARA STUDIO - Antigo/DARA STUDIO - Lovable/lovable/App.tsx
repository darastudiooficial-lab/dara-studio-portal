import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/hooks/useLanguage";

/* LAYOUT */
import MainLayout from "./components/layout/MainLayout";

/* PUBLIC PAGES */
import Home from "./pages/public/Home";
import HowWeWork from "./pages/public/HowWeWork";
import EstimateRequest from "./pages/public/EstimateRequest";
import ThankYou from "./pages/public/ThankYou";
import NotFound from "./pages/public/NotFound";

/* AUTH */
import Login from "./pages/auth/Login";
import FreelancerLogin from "./pages/auth/FreelancerLogin";
import AdminLogin from "./pages/admin/AdminLogin";

/* DASHBOARD (Client) */
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Projects from "./pages/dashboard/Projects";
import ClientProjectDetail from "./pages/dashboard/ClientProjectDetail";
import Invoices from "./pages/dashboard/Invoices";
import Files from "./pages/dashboard/Files";
import Messages from "./pages/dashboard/Messages";
import Profile from "./pages/dashboard/Profile";
import Company from "./pages/dashboard/Company";
import NewQuote from "./pages/dashboard/NewQuote";

/* FREELANCER WORKSPACE */
import FreelancerLayout from "./components/freelancer/FreelancerLayout";
import FreelancerHome from "./pages/freelancer/FreelancerHome";
import FreelancerProjects from "./pages/freelancer/FreelancerProjects";
import FreelancerPayments from "./pages/freelancer/FreelancerPayments";
import FreelancerContracts from "./pages/freelancer/FreelancerContracts";
import FreelancerCalendar from "./pages/freelancer/FreelancerCalendar";
import FreelancerProfile from "./pages/freelancer/FreelancerProfile";

/* ADMIN PANEL */
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminProjectDetail from "./pages/admin/AdminProjectDetail";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminMilestones from "./pages/admin/AdminMilestones";
import AdminActivity from "./pages/admin/AdminActivity";
import AdminMap from "./pages/admin/AdminMap";
import AdminGantt from "./pages/admin/AdminGantt";
import AdminFreelancers from "./pages/admin/AdminFreelancers";
import AdminTickets from "./pages/admin/AdminTickets";
import AdminDrawings from "./pages/admin/AdminDrawings";
import AdminLeads from "./pages/admin/AdminLeads";
import AdminProposals from "./pages/admin/AdminProposals";
import AdminContracts from "./pages/admin/AdminContracts";
import AdminFiles from "./pages/admin/AdminFiles";
import AdminPermits from "./pages/admin/AdminPermits";
import AdminAICodeCheck from "./pages/admin/AdminAICodeCheck";
import AdminClientPortal from "./pages/admin/AdminClientPortal";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminClientProfile from "./pages/admin/AdminClientProfile";
import AdminFinanceOverview from "./pages/admin/AdminFinanceOverview";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <MainLayout>
              <Routes>
                {/* PUBLIC WEBSITE */}
                <Route path="/" element={<Home />} />
                <Route path="/how-we-work" element={<HowWeWork />} />
                <Route path="/estimate-request" element={<EstimateRequest />} />
                <Route path="/orcamento" element={<EstimateRequest />} />
                <Route path="/thank-you" element={<ThankYou />} />

                {/* AUTH */}
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Login />} />
                <Route path="/freelancer-login" element={<FreelancerLogin />} />
                <Route path="/freelancer" element={<FreelancerLogin />} />

                {/* ADMIN LOGIN */}
                <Route path="/adm/login" element={<AdminLogin />} />

                {/* DASHBOARD (Client - Protected) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="projects/:id" element={<ClientProjectDetail />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="files" element={<Files />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="company" element={<Company />} />
                  <Route path="new-quote" element={<NewQuote />} />
                </Route>

                {/* FREELANCER WORKSPACE (Protected) */}
                <Route path="/work" element={<FreelancerLayout />}>
                  <Route index element={<FreelancerHome />} />
                  <Route path="projects" element={<FreelancerProjects />} />
                  <Route path="payments" element={<FreelancerPayments />} />
                  <Route path="contracts" element={<FreelancerContracts />} />
                  <Route path="calendar" element={<FreelancerCalendar />} />
                  <Route path="profile" element={<FreelancerProfile />} />
                </Route>

                {/* ADMIN PANEL (Protected) */}
                <Route path="/adm" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="companies" element={<AdminCompanies />} />
                  <Route path="clients/:id" element={<AdminClientProfile />} />
                  <Route path="projects" element={<AdminProjects />} />
                  <Route path="projects/:id" element={<AdminProjectDetail />} />
                  <Route path="gantt" element={<AdminGantt />} />
                  <Route path="map" element={<AdminMap />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="finance-overview" element={<AdminFinanceOverview />} />
                  <Route path="milestones" element={<AdminMilestones />} />
                  <Route path="activity" element={<AdminActivity />} />
                  <Route path="freelancers" element={<AdminFreelancers />} />
                  <Route path="tickets" element={<AdminTickets />} />
                  <Route path="drawings" element={<AdminDrawings />} />
                  <Route path="leads" element={<AdminLeads />} />
                  <Route path="proposals" element={<AdminProposals />} />
                  <Route path="contracts" element={<AdminContracts />} />
                  <Route path="files" element={<AdminFiles />} />
                  <Route path="permits" element={<AdminPermits />} />
                  <Route path="ai-code-check" element={<AdminAICodeCheck />} />
                  <Route path="client-portal" element={<AdminClientPortal />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* FALLBACK */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
