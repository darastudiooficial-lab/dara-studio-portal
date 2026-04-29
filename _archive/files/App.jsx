/**
 * App.jsx  —  DARA Studio · Roteamento Principal
 * ──────────────────────────────────────────────
 * Instale as dependências antes de usar:
 *   npm install react-router-dom
 *
 * Estrutura de rotas:
 *
 *   /                   → LandingPage   (público)
 *   /estimate           → EstimateWizard (público)
 *   /admin/*            → AdminPortal   (privado — importar o painel HTML existente
 *                          ou o componente React quando migrado)
 *   /portal/*           → ClientPortal  (privado — área do cliente)
 *   *                   → NotFound
 *
 * NOTA SOBRE O ADMIN PORTAL ATUAL (portal-dara-v4.html):
 *   O painel HTML Vanilla JS existente funciona de forma completamente
 *   autônoma. Para integrá-lo sem quebrar nada, há duas opções:
 *
 *   OPÇÃO A (Recomendada — zero risco):
 *     Sirva o arquivo HTML em /admin via seu servidor (Nginx/Vite proxy).
 *     A rota /admin abaixo usa window.location.href para redirecionar.
 *
 *   OPÇÃO B (Futura migração):
 *     Quando o admin for migrado para React, importe aqui:
 *     import AdminApp from './admin/AdminApp'
 *     e substitua o placeholder AdminRedirect pelo componente real.
 */

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage     from "./LandingPage";
import EstimateWizard  from "./EstimateWizard";

/* ── Admin bridge: redireciona para o HTML standalone ── */
function AdminRedirect() {
  /* Troque "/admin-portal/index.html" pelo path real onde
     o portal-dara-v4.html está sendo servido no seu servidor. */
  if (typeof window !== "undefined") {
    window.location.replace("/admin-portal/index.html");
  }
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#090910", fontFamily: "sans-serif",
    }}>
      <p style={{ color: "#9896b8", fontSize: 14 }}>Redirecionando para o Admin Portal…</p>
    </div>
  );
}

/* ── Client portal placeholder ── */
function ClientPortalPlaceholder() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#090910", fontFamily: "sans-serif", gap: 16,
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: "#6366f1",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: 22, color: "#fff", fontStyle: "italic" }}>D</span>
      </div>
      <h1 style={{ color: "#f0eff8", fontSize: 22, fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        Client Portal
      </h1>
      <p style={{ color: "#9896b8", fontSize: 13, textAlign: "center", maxWidth: 320 }}>
        Bem-vindo ao portal DARA Studio. Seu acesso está sendo configurado.
      </p>
      <a href="/" style={{
        marginTop: 8, padding: "10px 22px", borderRadius: 8,
        border: "1.5px solid rgba(255,255,255,.12)", color: "#9896b8",
        fontSize: 13, textDecoration: "none",
      }}>
        ← Voltar ao início
      </a>
    </div>
  );
}

/* ── 404 ── */
function NotFound() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "#090910", fontFamily: "sans-serif", gap: 12,
    }}>
      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 64, color: "rgba(99,102,241,.3)", fontWeight: 500 }}>404</span>
      <p style={{ color: "#9896b8", fontSize: 14 }}>Page not found.</p>
      <a href="/" style={{ color: "#6366f1", fontSize: 13, textDecoration: "none" }}>← Go home</a>
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
        <Route path="/"         element={<LandingPage />} />
        <Route path="/estimate" element={<EstimateWizard />} />
        <Route path="/estimate/*" element={<EstimateWizard />} />

        {/* ── Admin (HTML standalone) ── */}
        <Route path="/admin"    element={<AdminRedirect />} />
        <Route path="/admin/*"  element={<AdminRedirect />} />

        {/* ── Portal do Cliente ── */}
        <Route path="/portal"   element={<ClientPortalPlaceholder />} />
        <Route path="/portal/*" element={<ClientPortalPlaceholder />} />

        {/* ── Fallback ── */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
