/**
 * LandingPage.jsx  —  DARA Studio · Página Pública
 * ─────────────────────────────────────────────────
 * Rota: /
 * Design: dark premium · Instrument Serif + DM Sans
 * Dois CTAs principais:  Get an Estimate → /estimate
 *                        Client Login    → /portal
 */

import { useNavigate } from "react-router-dom";

const lp_css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital,wght@0,400;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  .lp-root {
    min-height: 100vh;
    background: #090910;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #f0eff8;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Mesh gradient background */
  .lp-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 20% 10%,  rgba(99,102,241,.18) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%,  rgba(99,102,241,.10) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 50% 50%,  rgba(16,185,129,.05) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  /* Grain overlay */
  .lp-root::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: .4;
  }

  .lp-content { position: relative; z-index: 1; flex: 1; display: flex; flex-direction: column; }

  /* Nav */
  .lp-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 22px 48px;
    border-bottom: 1px solid rgba(255,255,255,.06);
  }
  @media(max-width: 640px) { .lp-nav { padding: 18px 24px } }

  .lp-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .lp-logo-mark {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: #6366f1;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 0 24px rgba(99,102,241,.4);
  }
  .lp-logo-text {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: 17px;
    font-style: italic;
    color: #f0eff8;
    letter-spacing: -.01em;
  }
  .lp-nav-login {
    font-size: 13px;
    color: #9896b8;
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    border: 1.5px solid rgba(255,255,255,.08);
    transition: all .18s;
    cursor: pointer;
    background: none;
    font-family: inherit;
  }
  .lp-nav-login:hover {
    border-color: rgba(99,102,241,.4);
    color: #f0eff8;
    background: rgba(99,102,241,.08);
  }

  /* Hero */
  .lp-hero {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px 24px 60px;
  }

  /* Tag line above heading */
  .lp-tag {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: #6366f1;
    background: rgba(99,102,241,.1);
    border: 1px solid rgba(99,102,241,.25);
    border-radius: 20px;
    padding: 5px 14px;
    margin-bottom: 28px;
    animation: lp-fade-up .6s .1s both;
  }

  .lp-heading {
    font-family: 'Instrument Serif', Georgia, serif;
    font-size: clamp(38px, 7vw, 76px);
    font-weight: 400;
    line-height: 1.08;
    letter-spacing: -.02em;
    color: #f0eff8;
    margin-bottom: 22px;
    max-width: 820px;
    animation: lp-fade-up .6s .2s both;
  }

  .lp-heading em {
    font-style: italic;
    color: #a5b4fc;
  }

  .lp-sub {
    font-size: 16px;
    color: #9896b8;
    line-height: 1.65;
    max-width: 460px;
    margin-bottom: 44px;
    font-weight: 300;
    animation: lp-fade-up .6s .3s both;
  }

  /* CTA group */
  .lp-ctas {
    display: flex;
    gap: 14px;
    flex-wrap: wrap;
    justify-content: center;
    animation: lp-fade-up .6s .4s both;
  }

  .lp-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 15px 32px;
    background: #6366f1;
    border: none;
    border-radius: 10px;
    color: #fff;
    font-family: 'DM Sans', inherit;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s;
    text-decoration: none;
    letter-spacing: -.01em;
  }
  .lp-btn-primary:hover {
    background: #4f46e5;
    transform: translateY(-2px);
    box-shadow: 0 12px 36px rgba(99,102,241,.45);
  }

  .lp-btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    padding: 15px 32px;
    background: transparent;
    border: 1.5px solid rgba(255,255,255,.12);
    border-radius: 10px;
    color: #c4c2dc;
    font-family: 'DM Sans', inherit;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all .2s;
    text-decoration: none;
  }
  .lp-btn-secondary:hover {
    border-color: rgba(99,102,241,.4);
    color: #f0eff8;
    background: rgba(99,102,241,.07);
    transform: translateY(-2px);
  }

  /* Social proof strip */
  .lp-proof {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 28px;
    padding: 24px 24px 48px;
    flex-wrap: wrap;
    animation: lp-fade-up .6s .55s both;
  }
  .lp-proof-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #5c5a7a;
  }
  .lp-proof-sep {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(255,255,255,.08);
  }

  /* Services strip */
  .lp-services {
    border-top: 1px solid rgba(255,255,255,.05);
    padding: 32px 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
    flex-wrap: wrap;
    animation: lp-fade-up .6s .65s both;
  }
  .lp-service-item {
    padding: 10px 24px;
    font-size: 12px;
    color: #5c5a7a;
    letter-spacing: .04em;
    text-transform: uppercase;
    font-weight: 500;
    border-right: 1px solid rgba(255,255,255,.06);
  }
  .lp-service-item:last-child { border-right: none }
  @media(max-width: 640px) {
    .lp-services { padding: 20px 24px; gap: 4px }
    .lp-service-item { border: none; padding: 6px 12px }
  }

  /* Decorative orb */
  .lp-orb {
    position: fixed;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: lp-breathe 8s ease-in-out infinite;
  }

  @keyframes lp-fade-up {
    from { opacity: 0; transform: translateY(20px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  @keyframes lp-breathe {
    0%, 100% { transform: translate(-50%, -50%) scale(1) }
    50%       { transform: translate(-50%, -50%) scale(1.08) }
  }
`;

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
    <>
      <style>{lp_css}</style>
      <div className="lp-root">
        <div className="lp-orb" />
        <div className="lp-content">

          {/* ── Nav ── */}
          <nav className="lp-nav">
            <a href="/" className="lp-logo">
              <div className="lp-logo-mark">
                <span style={{ fontFamily: "'Instrument Serif', Georgia, serif", fontSize: 20, color: "#fff", fontStyle: "italic" }}>D</span>
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
    </>
  );
}
