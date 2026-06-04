import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import DaraLogo from "../components/DaraLogo";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import PageTransition from "../components/PageTransition";

const CONTENT = {
  EN: {
    nav: [
      { label: 'What We Do',    path: '/services'  },
      { label: 'Portfolio',    path: '/portfolio' },
      { label: 'Team',         path: '/team'      },
      { label: 'How It Works', path: '/process'   },
    ],
    clientPortal: "Client Portal",
    heroBadge: "Architecture · Design · Visualization",
    heroTitle1: "Elevating",
    heroTitle2: "Architectural Design",
    heroSubtitle: "Permit-ready drawings, 3D renders and architectural drafting — delivered with precision for US and Brazilian projects.",
    getEstimate: "Get an Estimate",
    accessPortal: "Access Portal",
    statsRating: "4.9 rating · 120+ projects",
    statsMarket: "US & BR Standards",
    statsTurnaround: "7-day turnaround",
    softwareChief: "Chief Architect",
    softwareUSCode: "US CODE COMPLIANT",
    softwareUSCodeTooltip: "Projects developed according to IBC, IRC, and local municipal standards for seamless permit approval.",
    badgeLicensedBR: "CAU SC A115105-3 — Licensed Architect · Brazil",
    badgeLicensedUS: "Architectural Drafter · United States",
    badgeSecure: "Secure Payment via Stripe",
  },
  PT: {
    nav: [
      { label: 'Especialização', path: '/services'  },
      { label: 'Portfólio',      path: '/portfolio' },
      { label: 'Equipe',         path: '/team'      },
      { label: 'Como Funciona',  path: '/process'   },
    ],
    clientPortal: "Portal do Cliente",
    heroBadge: "Arquitetura · Design · Visualização",
    heroTitle1: "Elevando",
    heroTitle2: "Design Arquitetônico",
    heroSubtitle: "Projetos prontos para aprovação, renders 3D e desenhos técnicos — entregues com precisão para projetos nos EUA e Brasil.",
    getEstimate: "Solicitar Orçamento",
    accessPortal: "Acessar Portal",
    statsRating: "Nota 4.9 · 120+ projetos",
    statsMarket: "Padrões EUA & BR",
    statsTurnaround: "Entrega em 7 dias",
    softwareChief: "Arquiteto Chefe",
    softwareUSCode: "CONFORME CÓDIGOS EUA",
    softwareUSCodeTooltip: "Projetos desenvolvidos de acordo com as normas IBC, IRC e padrões municipais locais para aprovação simplificada de alvarás.",
    badgeLicensedBR: "CAU SC A115105-3 — Arquiteto Licenciado · Brasil",
    badgeLicensedUS: "Projetista Arquitetônico · EUA",
    badgeSecure: "Pagamento Seguro via Stripe",
  }
};

export default function LandingPage() {
  const { lang, theme, openEstimateModal } = useAppContext();
  const T = CONTENT[lang] || CONTENT.EN;
  const navigate = useNavigate();
  const cursorRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !target.tagName) return;
      
      const isInteractive = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('button') || 
        target.closest('a');

      setIsHovering(!!isInteractive);
    };
    
    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <PageTransition variant="default">
    <div className="landing-wrapper">
      {/* Custom Cursor */}
      <div 
        ref={cursorRef}
        className={`glass-cursor ${isHovering ? 'hovering' : ''}`} 
      ></div>

      {/* Brilho radial roxo suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="hero-section">

        {/* Badge superior */}
        <div className="badge animate-float-up delay-100">
          <span className="badge-icon">☆</span>
          <span className="badge-text badge-gradient">{T.heroBadge}</span>
        </div>

        {/* Heading */}
        <div className="hero-heading animate-float-up delay-200">
          <h1 className="heading-normal">{T.heroTitle1}</h1>
          <h1 className="heading-italic">{T.heroTitle2}</h1>
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle animate-float-up delay-300">
          {T.heroSubtitle}
        </p>

        {/* Ações Principais (Botões Pill-shaped) */}
        <div className="action-buttons animate-float-up delay-400">
          <button className="btn-glow" onClick={() => navigate("/estimate")}>
            {T.getEstimate} &rarr;
          </button>

          <button className="btn-glow" onClick={() => navigate("/login")}>
            {T.accessPortal}
          </button>
        </div>

        {/* Trust Cluster — Integrated Social Proof & Certifications */}
        <div className="trust-cluster animate-float-up delay-500">
          <div className="trust-indicators">
            <a 
              href="https://share.google/P6LjQ8q2gPf2wzupp" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="trust-item trust-link"
            >
              <span style={{ color: "#fbbf24", fontSize: "14px" }}>⭐</span>
              {T.statsRating}
            </a>
            <span className="footer-divider">·</span>
            <div className="trust-item">
              <span style={{ fontSize: "14px" }}>🌎</span>
              {T.statsMarket}
            </div>
            <span className="footer-divider">·</span>
            <div className="trust-item">
              <span style={{ color: "#f97316", fontSize: "14px" }}>⚡</span>
              {T.statsTurnaround}
            </div>
          </div>

          <div className="trust-bar">
            {/* Row 2: Software Logos (Grayscale) */}
            <div className="trust-bar-logos">
              <div className="software-logo-item" title={T.softwareChief}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L2 12h3v8h14v-8h3L12 3zm0 4.84L18.16 13v5.16H5.84V13L12 7.84zM10 11h4v4h-4v-4z"/></svg>
                <span className="software-logo-text">{T.softwareChief}</span>
              </div>
              <div className="software-logo-item" title="SketchUp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.1L1 7v10l11 4.9L23 17V7l-11-4.9zm0 2L20.5 7.9 12 11.7 3.5 7.9 12 4.1zm-9 5.3l8 3.6v7L3 16.4V9.4zm18 7l-8 3.6v-7l8-3.6v7z"/></svg>
                <span className="software-logo-text">SketchUp</span>
              </div>
              <div className="software-logo-item" title="AutoCAD">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 3.27L18.5 18l-6.5-2.86L5.5 18 12 5.27z"/></svg>
                <span className="software-logo-text">AutoCAD</span>
              </div>
              <div className="software-logo-item has-tooltip" title={T.softwareUSCode}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
                <span className="software-logo-text">{T.softwareUSCode}</span>
                <div className="tooltip-content">
                  {T.softwareUSCodeTooltip}
                </div>
              </div>
            </div>

            {/* Row 3: Authority Badges */}
            <div className="trust-bar-badges">
              <div className="trust-badge">{T.badgeLicensedBR}</div>
              <div className="trust-badge">{T.badgeLicensedUS}</div>
              <div className="trust-badge">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                {T.badgeSecure}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
    </PageTransition>
  );
}
