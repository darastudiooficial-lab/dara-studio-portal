/**
 * LandingPage.jsx  —  DARA Studio · Página Pública
 * ─────────────────────────────────────────────────
 * Rota: /
 * Design: dark premium · Instrument Serif + DM Sans
 */

import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import GlobalControls from "../components/GlobalControls";

const LP_TRANSLATIONS = {
  EN: {
    portal: "Access Portal →",
    tag: "Architecture · Design · Visualization",
    h1: "Elevating Architectural Design",
    sub: "From concept sketches to permit-ready drawings and photorealistic 3D renders — DARA Studio brings your vision to life with precision.",
    getEstimate: "Get an Estimate",
    access: "Access Portal",
    proof: [
      { icon: "⭐", text: "4.9 rating · 120+ projects" },
      { icon: "🌎", text: "US & Brazil" },
      { icon: "⚡", text: "7-day turnaround" },
    ],
    services: [
      "Architectural Drafting",
      "3D Exterior Rendering",
      "3D Interior Design",
      "Permit Drawings",
      "ADU & Additions",
    ]
  },
  PT: {
    portal: "Acessar Portal →",
    tag: "Arquitetura · Design · Visualização",
    h1: "Elevando o Design Arquitetônico",
    sub: "De esboços conceituais a desenhos prontos para aprovação e renders 3D realistas — DARA Studio dá vida à sua visão com precisão.",
    getEstimate: "Solicitar Orçamento",
    access: "Acessar Portal",
    proof: [
      { icon: "⭐", text: "4.9 avaliação · 120+ projetos" },
      { icon: "🌎", text: "EUA & Brasil" },
      { icon: "⚡", text: "7 dias de prazo" },
    ],
    services: [
      "Desenho Arquitetônico",
      "Render 3D Exterior",
      "Design de Interiores 3D",
      "Desenhos para Aprovação",
      "ADU & Ampliações",
    ]
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useAppContext();
  const T = LP_TRANSLATIONS[lang];

  return (
    <div className="lp-root">
      <div className="lp-orb" />
      <div className="lp-content">

        {/* ── Nav ── */}
        <nav className="lp-nav">
          <a href="/" className="lp-logo">
            <div className="lp-logo-mark">
              <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#fff", fontStyle: "italic" }}>D</span>
            </div>
            <span className="lp-logo-text">DARA Studio</span>
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <GlobalControls />
            <button className="lp-nav-login" onClick={() => navigate("/login")}>
              {T.portal}
            </button>
          </div>
        </nav>

        {/* ── Hero ── */}
        <main className="lp-hero">
          <div className="lp-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {T.tag}
          </div>

          <h1 className="lp-heading">
            {lang === "EN" ? "Elevating" : "Elevando o"} <br />
            <em>{lang === "EN" ? "Architectural Design" : "Design Arquitetônico"}</em>
          </h1>

          <p className="lp-sub">
            {T.sub}
          </p>

          <div className="lp-ctas">
            <button className="lp-btn-primary" onClick={() => navigate("/estimate")}>
              {T.getEstimate}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="lp-btn-secondary" onClick={() => navigate("/login")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              {T.access}
            </button>
          </div>
        </main>

        {/* ── Social proof ── */}
        <div className="lp-proof">
          {T.proof.map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {i > 0 && <div className="lp-proof-sep" />}
              <div className="lp-proof-item">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Services strip ── */}
        <div className="lp-services">
          {T.services.map((s, i) => (
            <div key={i} className="lp-service-item">{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
