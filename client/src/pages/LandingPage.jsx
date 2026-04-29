/**
 * LandingPage.jsx  —  DARA Studio · Página Pública
 * ─────────────────────────────────────────────────
 * Rota: /
 * Design: dark premium · Instrument Serif + DM Sans
 */

import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const services = [
    "Architectural Drafting",
    "3D Exterior Rendering",
    "3D Interior Design",
    "Permit Drawings",
    "Landscape Plans",
    "ADU & Additions",
  ];

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
          <button className="lp-nav-login" onClick={() => navigate("/portal")}>
            Client Login →
          </button>
        </nav>

        {/* ── Hero ── */}
        <main className="lp-hero">
          <div className="lp-tag">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Architecture · Design · Visualization
          </div>

          <h1 className="lp-heading">
            Elevating<br />
            <em>Architectural Design</em>
          </h1>

          <p className="lp-sub">
            From concept sketches to permit-ready drawings and photorealistic 3D renders —
            DARA Studio brings your vision to life with precision.
          </p>

          <div className="lp-ctas">
            <button className="lp-btn-primary" onClick={() => navigate("/estimate")}>
              Get an Estimate
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button className="lp-btn-secondary" onClick={() => navigate("/portal")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Client Login
            </button>
          </div>
        </main>

        {/* ── Social proof ── */}
        <div className="lp-proof">
          {[
            { icon: "⭐", text: "4.9 rating · 120+ projects" },
            { icon: "🌎", text: "US & Brazil" },
            { icon: "⚡", text: "7-day turnaround" },
          ].map((item, i) => (
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
          {services.map((s, i) => (
            <div key={i} className="lp-service-item">{s}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
