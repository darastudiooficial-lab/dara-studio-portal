/**
 * App.jsx  —  DARA Studio · Roteamento Principal
 * ──────────────────────────────────────────────
 * Estrutura de rotas:
 *
 *   /                   → LandingPage   (público)
 *   /estimate           → EstimateWizard (público)
 *   /admin/*            → AdminPortal   (redirect para HTML standalone)
 *   /portal/*           → ClientPortal  (placeholder)
 *   *                   → NotFound
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage        from "./pages/LandingPage";
import EstimateWizard     from "./pages/EstimateWizard";
import NotFound           from "./pages/NotFound";
import PortalPlaceholder  from "./pages/PortalPlaceholder";

/* ── Admin bridge: redireciona para o HTML standalone ── */
function AdminRedirect() {
  if (typeof window !== "undefined") {
    window.location.replace("/admin-portal/index.html");
  }
  return (
    <div className="page-center">
      <p style={{ color: "var(--mu)", fontSize: 14 }}>Redirecting to Admin Portal…</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ROOT ROUTER
══════════════════════════════════════════════════════════ */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Públicas ── */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/estimate"  element={<EstimateWizard />} />
        <Route path="/estimate/*" element={<EstimateWizard />} />

        {/* ── Admin (HTML standalone) ── */}
        <Route path="/admin"     element={<AdminRedirect />} />
        <Route path="/admin/*"   element={<AdminRedirect />} />

        {/* ── Portal do Cliente ── */}
        <Route path="/portal"    element={<PortalPlaceholder />} />
        <Route path="/portal/*"  element={<PortalPlaceholder />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
