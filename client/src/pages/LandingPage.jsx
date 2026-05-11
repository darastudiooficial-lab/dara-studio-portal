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
    ],
    nav: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "Team", href: "#team" },
      { label: "Method", href: "#method" },
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
    ],
    nav: [
      { label: "Portfólio", href: "#portfolio" },
      { label: "Equipe", href: "#team" },
      { label: "Método", href: "#method" },
    ]
  }
};

const PORTFOLIO_ITEMS = [
  { img: "/portfolio/p1.png", cat: "Residential", title: "Modern Glass Villa" },
  { img: "/portfolio/p2.png", cat: "Exterior", title: "Minimalist Garden Home" },
  { img: "/portfolio/p3.png", cat: "Interior", title: "Open Concept Living" },
  { img: "/portfolio/p4.png", cat: "ADU", title: "Backyard Guest Studio" },
  { img: "/portfolio/p5.png", cat: "Commercial", title: "Sleek Office Facade" },
  { img: "/portfolio/p6.png", cat: "Kitchen", title: "Contemporary Culinary Space" },
];

const TESTIMONIALS = [
  {
    name: "Michael S.",
    location: "Miami, FL",
    project: "New Construction",
    avatar: "👤",
    text: {
      EN: "DARA made the permit process effortless. The 3D renders helped us visualize our dream home before we even broke ground.",
      PT: "A DARA tornou o processo de aprovação sem esforço. Os renders 3D nos ajudaram a visualizar nossa casa dos sonhos antes mesmo de começar a obra."
    }
  },
  {
    name: "Ana P.",
    location: "Orlando, FL",
    project: "Interior Reno",
    avatar: "👩",
    text: {
      EN: "The level of detail in the floor plans is unmatched. Our contractors knew exactly what to do, saving us weeks of back-and-forth.",
      PT: "O nível de detalhe nas plantas é inigualável. Nossos empreiteiros sabiam exatamente o que fazer, economizando semanas de idas e vindas."
    }
  },
  {
    name: "David R.",
    location: "Austin, TX",
    project: "ADU Project",
    avatar: "🧔",
    text: {
      EN: "Fast, professional, and very precise. The 24h estimate was spot on and the final drawings were accepted by the city on the first try.",
      PT: "Rápido, profissional e muito preciso. A estimativa de 24h foi exata e os desenhos finais foram aceitos pela prefeitura de primeira."
    }
  }
];

function TestimonialsStrip({ lang }) {
  return (
    <section className="testimonials-strip">
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="testimonial-card">
            <div className="test-header">
              <div className="test-avatar">{t.avatar}</div>
              <div className="test-meta">
                <span className="test-name">{t.name}</span>
                <span className="test-location">{t.project} · {t.location}</span>
              </div>
            </div>
            <p className="test-text">"{t.text[lang]}"</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const TEAM_MEMBERS = [
  {
    name: "Marco V.",
    role: { EN: "Design Director", PT: "Diretor de Design" },
    bio: { 
      EN: "15+ years of experience in luxury residential architecture.",
      PT: "Mais de 15 anos de experiência em arquitetura residencial de luxo."
    },
    avatar: "👨‍💼"
  },
  {
    name: "Elena G.",
    role: { EN: "Lead Architect", PT: "Arquiteta Líder" },
    bio: { 
      EN: "Expert in sustainable building codes and permit optimization.",
      PT: "Especialista em normas sustentáveis e aprovação de projetos."
    },
    avatar: "👩‍🎨"
  },
  {
    name: "Julian K.",
    role: { EN: "Head of 3D", PT: "Líder de 3D" },
    bio: { 
      EN: "Transforming technical drawings into hyper-realistic visualizations.",
      PT: "Transformando desenhos técnicos em visualizações hiper-realistas."
    },
    avatar: "👨‍💻"
  }
];

function TeamSection({ lang }) {
  return (
    <section className="team-section" id="team">
      <div className="team-container">
        <div className="team-header">
          <h2>{lang === "EN" ? "The Team Behind Your Project" : "A Equipe por Trás do Seu Projeto"}</h2>
        </div>
        <div className="team-grid">
          {TEAM_MEMBERS.map((m, i) => (
            <div key={i} className="team-card">
              <div className="team-avatar">{m.avatar}</div>
              <h3 className="team-name">{m.name}</h3>
              <span className="team-role">{m.role[lang]}</span>
              <p className="team-bio">{m.bio[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  const logos = ["Chief Architect", "SketchUp", "AutoCAD"];
  const badges = [
    "CAU SC A115105-3 — Licensed Architect · Brazil",
    "Architectural Drafter · United States",
    "Secure Payment via Stripe"
  ];
  
  return (
    <section className="trust-bar">
      <div className="trust-container">
        <div className="trust-logos">
          {logos.map(l => (
            <div key={l} className="trust-logo-item">{l}</div>
          ))}
        </div>
        <div className="trust-badges">
          {badges.map(b => (
            <div key={b} className="trust-badge-item">
              <div className="trust-badge-dot" />
              {b}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const HOW_STEPS = [
  { 
    ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    title: { EN: "Brief Online", PT: "Briefing Online" },
    desc: { EN: "Submit your project requirements and files in minutes.", PT: "Envie os requisitos e arquivos do seu projeto em minutos." }
  },
  { 
    ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    title: { EN: "24h Estimate", PT: "Estimativa 24h" },
    desc: { EN: "Receive a detailed fee estimate within one business day.", PT: "Receba uma estimativa detalhada em até um dia útil." }
  },
  { 
    ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>,
    title: { EN: "Approval", PT: "Aprovação" },
    desc: { EN: "Confirm the quote and we start working immediately.", PT: "Confirme a proposta e começamos a trabalhar imediatamente." }
  },
  { 
    ico: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></svg>,
    title: { EN: "Delivery", PT: "Entrega" },
    desc: { EN: "Receive your permit-ready drawings and 3D renders.", PT: "Receba seus desenhos técnicos e renders 3D." }
  }
];

function HowDaraWorks({ lang }) {
  return (
    <section className="how-dara-works" id="method">
      <div className="how-container">
        <div className="how-header">
          <h2>{lang === "EN" ? "The DARA Method" : "O Método DARA"}</h2>
          <p>{lang === "EN" ? "From concept to delivery in 4 simple steps" : "Do conceito à entrega em 4 passos simples"}</p>
        </div>
        <div className="how-steps">
          {HOW_STEPS.map((step, i) => (
            <div key={i} className="how-step">
              <div className="how-icon-wrap">
                {step.ico}
              </div>
              <h3 className="how-title">{step.title[lang]}</h3>
              <p className="how-desc">{step.desc[lang]}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PortfolioStrip() {
  return (
    <section className="portfolio-strip" id="portfolio">
      <div className="portfolio-grid">
        {PORTFOLIO_ITEMS.map((item, i) => (
          <div key={i} className="portfolio-card">
            <img src={item.img} alt={item.title} className="portfolio-img" />
            <div className="portfolio-overlay">
              <span className="portfolio-cat">{item.cat}</span>
              <h3 className="portfolio-title">{item.title}</h3>
              <button className="portfolio-btn">
                View Project
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer({ lang }) {
  const year = new Date().getFullYear();
  return (
    <footer className="lp-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo">DARA Studio</span>
          <p className="footer-tagline">
            {lang === "EN" ? "Precision in every pixel." : "Precisão em cada pixel."}
          </p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>{lang === "EN" ? "Portal" : "Portal"}</h4>
            <a href="/login">{lang === "EN" ? "Client Login" : "Acesso Cliente"}</a>
            <a href="/estimate">{lang === "EN" ? "Get Estimate" : "Solicitar Orçamento"}</a>
          </div>
          <div className="footer-col">
            <h4>{lang === "EN" ? "Social" : "Social"}</h4>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {year} DARA Studio. {lang === "EN" ? "All rights reserved." : "Todos os direitos reservados."}</p>
        <div className="footer-badges">
          <span>CAU SC A115105-3</span>
          <span>·</span>
          <span>Drafter (US)</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { lang } = useAppContext();
  const T = LP_TRANSLATIONS[lang];

  return (
    <div className="lp-root">
      <div className="lp-content">

        {/* ── Nav ── */}
        <nav className="lp-nav">
          <div className="nav-left">
            <a href="/" className="lp-logo">
              <div className="lp-logo-mark">
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#fff", fontStyle: "italic" }}>D</span>
              </div>
              <span className="lp-logo-text">DARA Studio</span>
            </a>

            <div className="nav-links-desktop">
              {T.nav.map(link => (
                <a key={link.href} href={link.href} className="nav-link">
                  {link.label}
                </a>
              ))}
            </div>
          </div>

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

        <PortfolioStrip />

        <TestimonialsStrip lang={lang} />

        <TrustBar />

        {/* ── Services strip ── */}
        <div className="lp-services">
          {T.services.map((s, i) => (
            <div key={i} className="lp-service-item">{s}</div>
          ))}
        </div>

        <TeamSection lang={lang} />

        <HowDaraWorks lang={lang} />

        <Footer lang={lang} />
      </div>
    </div>
  );
}
