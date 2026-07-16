import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import PageTransition from "../components/PageTransition";

const CONTENT = {
  EN: {
    nav: [
      { label: `What We Do`,    path: '/services'  },
      { label: 'Portfolio',    path: '/portfolio' },
      { label: 'Team',         path: '/team'      },
      { label: `How It Works`, path: '/process'   },
    ],
    clientPortal: "Client Portal",
    heroBadge: "ARCHITECTURE · DESIGN · TECHNICAL DOCUMENTATION",
    heroTitle1: "Built to American standards.",
    heroTitle2: "Executed remotely, without\ncompromise.",
    heroSubtitle: "We produce Permit Sets, construction documents and high-precision technical drawings for the U.S. market, under strict code compliance, with the close, transparent communication a serious project deserves.",
    getEstimate: "REQUEST A QUOTE ->",
    accessPortal: "ACCESS PORTAL",
    statsRating: "Licensed Support",
      statsRatingTooltip: "High-end drafting and architectural support for builders and investors.",
      statsRatingLabel: "Licensed",
      statsRatingValue: "Support",
    statsMarket: "Code Compliance",
      statsMarketTooltip: `Projects executed strictly under IBC, IRC, and local zoning frameworks.`,
      statsMarketValue: "IBC · IRC",
    statsTurnaround: "Fast Turnaround",
      statsTurnaroundTooltip: "Production cycles optimized for 8 to 16 days.",
      statsTurnaroundLabel: "Fast",
      statsTurnaroundValue: "Turnaround",
    softwareChief: "Chief Architect",
    softwareUSCode: "US CODE COMPLIANT",
    softwareUSCodeTooltip: `Projects developed according to IBC, IRC, and local municipal standards for seamless permit approval.`,
    badgeLicensedBR: "CAU SC A115105-3 - Licensed Architect · Brazil",
    badgeLicensedUS: "Architectural Drafter · United States",
    badgeZoning: "US Code Compliant · Local Zoning",
    previewSectionTitle: "WHAT WE DO",
    previewItems: [
      { num: "01", title: "Permit Sets", desc: "Complete, code-compliant drawing sets prepared for municipal submission and approval." },
      { num: "02", title: "Construction Documents", desc: "Coordinated CDs a contractor can build from without ambiguity or rework." },
      { num: "03", title: "Technical Drawings", desc: "High-precision details, sections and schedules drafted exactly to specification." },
      { num: "04", title: "Modeling & Renders", desc: "Massing, 3D modeling and presentation imagery to communicate intent clearly." },
    ],
    selectedWorkTitle: "SELECTED WORK",
    viewAllBtn: "VIEW ALL",
    selectedWorks: [
      { num: "E-01", title: "Coastal Residence", desc: "Exterior render · Florida", badge: "exterior render" },
      { num: "E-02", title: "Courtyard House", desc: "Street view · Arizona", badge: "exterior render" },
      { num: "E-03", title: "Hillside Addition", desc: "Massing study · California", badge: "exterior render" },
    ],
    howItWorksTitle: "HOW IT WORKS",
    howItWorksSubtitle: "8-16 day cycles",
    howItWorksSteps: [
      { num: "01", title: "Brief & Scope", desc: "We align on jurisdiction, code path, deliverables and timeline before anything is drawn." },
      { num: "02", title: "Drafting & Modeling", desc: "Production in Chief Architect, AutoCAD and SketchUp — versioned and internally reviewed." },
      { num: "03", title: "Code Review", desc: "Every sheet checked against IBC, IRC and local zoning before it leaves the studio." },
      { num: "04", title: "Delivery & Revisions", desc: "Issued through the Client Portal. Revisions tracked and turned around fast." },
    ],
    ctaSubtitle: "Permit-ready documentation, delivered remotely",
    ctaTitle1: "Bring your next U.S.",
    ctaTitle2: "project to the studio?",
    ctaBtn: "REQUEST A QUOTE",
  },
  PT: {
    nav: [
      { label: `Especialização`, path: '/services'  },
      { label: `Portfólio`,      path: '/portfolio' },
      { label: 'Equipe',         path: '/team'      },
      { label: `Como Funciona`,  path: '/process'   },
    ],
    clientPortal: "Portal do Cliente",
    heroBadge: `ARQUITETURA · DESIGN · DOCUMENTAÇÃO TÉCNICA`,
    heroTitle1: `Projetos no Padrão Americano.`,
    heroTitle2: `Execução Remota, sem\nconcessões.`,
    heroSubtitle: "Produzimos Permit Sets, documentos de construção e desenhos técnicos de alta precisão para o mercado dos EUA, sob estrito cumprimento das normas, com a comunicação próxima e transparente que um projeto sério merece.",
    getEstimate: "SOLICITAR ORÇAMENTO ->",
    accessPortal: "ACESSAR PORTAL",
    statsRating: "Suporte Credenciado",
      statsRatingTooltip: `Estrutura técnica sob medida para construtores, empreiteiros e investidores.`,
      statsRatingLabel: "Credenciado",
      statsRatingValue: "Suporte",
    statsMarket: `Conformidade de Códigos`,
      statsMarketTooltip: `Projetos alinhados estritamente às normas locais norte-americanas.`,
      statsMarketValue: "IBC · IRC",
    statsTurnaround: "Velocidade de Entrega",
      statsTurnaroundTooltip: `Fluxo de produção calibrado para entregas entre 8 e 16 dias.`,
      statsTurnaroundLabel: "Velocidade",
      statsTurnaroundValue: "Entrega",
    softwareChief: "CHIEF ARCHITECT",
    softwareUSCode: `CONFORME CÓDIGOS EUA`,
    softwareUSCodeTooltip: `Projetos desenvolvidos de acordo com as normas IBC, IRC e padrões municipais locais para aprovação simplificada de alvarás.`,
    badgeLicensedBR: "CAU SC A115105-3 - Arquiteto Licenciado · Brasil",
    badgeLicensedUS: "Desenhista Arquitetônico · Estados Unidos",
    badgeZoning: "Conformidade de Código dos EUA · Zoneamento Local",
    previewSectionTitle: "O QUE FAZEMOS",
    previewItems: [
      { num: "01", title: "Permit Sets", desc: "Conjuntos de plantas completos em conformidade com as normas, prontos para aprovação na prefeitura." },
      { num: "02", title: "Documentação Executiva", desc: "Documentação coordenada para que o empreiteiro possa construir sem ambiguidades ou retrabalhos." },
      { num: "03", title: "Desenhos Técnicos", desc: "Detalhes de alta precisão, cortes e tabelas projetados exatamente de acordo com as especificações." },
      { num: "04", title: "Modelagem e Renders", desc: "Estudos de volumetria, modelagem 3D e imagens de apresentação para comunicar a intenção de forma clara." },
    ],
    selectedWorkTitle: "TRABALHOS SELECIONADOS",
    viewAllBtn: "VER TODOS",
    selectedWorks: [
      { num: "E-01", title: "Residência Costeira", desc: "Render externo · Flórida", badge: "render externo" },
      { num: "E-02", title: "Courtyard House", desc: "Vista da rua · Arizona", badge: "render externo" },
      { num: "E-03", title: "Hillside Addition", desc: "Estudo de massa · Califórnia", badge: "render externo" },
    ],
    howItWorksTitle: "COMO FUNCIONA",
    howItWorksSubtitle: "Ciclos de 8-16 dias",
    howItWorksSteps: [
      { num: "01", title: "Briefing e Escopo", desc: "Alinhamos a jurisdição, normas locais, entregáveis e prazos antes de qualquer desenho." },
      { num: "02", title: "Desenho e Modelagem", desc: "Produção no Chief Architect, AutoCAD e SketchUp — versionado e revisado internamente." },
      { num: "03", title: "Revisão de Códigos", desc: "Cada prancha verificada em relação ao IBC, IRC e zoneamento local antes da entrega." },
      { num: "04", title: "Entrega e Revisões", desc: "Acesso direto pelo Portal do Cliente. Revisões controladas e devolvidas rapidamente." },
    ],
    ctaSubtitle: "Documentação pronta para alvará, entregue remotamente",
    ctaTitle1: "Traga seu próximo projeto nos EUA",
    ctaTitle2: "para o studio?",
    ctaBtn: "SOLICITAR ORÇAMENTO",
  }
};

export default function LandingPage() {
  const { lang } = useAppContext();
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

      {/* Brilho radial verde suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>

      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="hero-section">

        {/* Badge superior */}
        <div className="badge animate-float-up delay-100" style={{ display: 'flex', width: '100%' }}>
          <span className="badge-index">(00)</span>
          <span className="badge-text">{T.heroBadge}</span>
          <div className="preview-line"></div>
        </div>

        {/* Heading */}
        <div className="hero-heading animate-float-up delay-200">
          <h1 className="heading-normal">{T.heroTitle1}</h1>
          <h1 className="heading-italic">{T.heroTitle2}</h1>
        </div>

        {/* Hero Content Row: Subtitle + Title Block */}
        <div className="hero-content-row animate-float-up delay-300">
          <div className="hero-content-left">
            <p className="hero-subtitle">
              {T.heroSubtitle}
            </p>
            <div className="action-buttons">
              <button className="hero-btn-primary" onClick={() => navigate("/estimate")}>
                {T.getEstimate}
              </button>
              <button className="hero-btn-secondary" onClick={() => navigate("/login")}>
                {T.accessPortal}
              </button>
            </div>
          </div>

          <div className="title-block">
            <div className="title-block-header">TITLE BLOCK</div>
            <div className="title-block-divider"></div>
            <div className="title-block-row">
              <span className="title-block-label">SHEET</span>
              <span className="title-block-value">00 — Index</span>
            </div>
            <div className="title-block-row">
              <span className="title-block-label">SCALE</span>
              <span className="title-block-value">US Market</span>
            </div>
            <div className="title-block-row">
              <span className="title-block-label">CODE</span>
              <span className="title-block-value">IBC · IRC</span>
            </div>
            <div className="title-block-row">
              <span className="title-block-label">REV</span>
              <span className="title-block-value">2026.1</span>
            </div>
          </div>
        </div>

        {/* Hero Image — Placeholder for project imagery */}
        <div className="hero-image-placeholder animate-float-up delay-450" onClick={() => navigate("/portfolio")} role="link" tabIndex={0}>
          <img
            src="/hero-project.jpg"
            alt="Project imagery"
            className="hero-image-src"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="hero-image-labels">
            <span className="hero-image-sheet">Permit set — sheet A-101 · floor plan</span>
            <span className="hero-image-tag">[ project imagery ]</span>
          </div>
        </div>

        {/* Preview Services List */}
        <div className="preview-services-section animate-float-up delay-450">
          <div className="preview-header">
            <div className="badge" style={{ gap: '24px' }}>
              <span className="badge-index">(01)</span>
              <span className="badge-text">{T.previewSectionTitle}</span>
            </div>
            <div className="preview-line"></div>
          </div>
          <div className="preview-list">
            {T.previewItems.map((item, idx) => (
              <div key={idx} className="preview-item" onClick={() => navigate("/services")}>
                <span className="preview-num">{item.num}</span>
                <h3 className="preview-item-title">{item.title}</h3>
                <p className="preview-item-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Work Section */}
        <div className="selected-work-section animate-float-up delay-450">
          <div className="preview-header">
            <div className="badge" style={{ gap: '24px' }}>
              <span className="badge-index">(02)</span>
              <span className="badge-text">{T.selectedWorkTitle}</span>
            </div>
            <div className="preview-line"></div>
            <span className="preview-title view-all-link" onClick={() => navigate("/portfolio")}>{T.viewAllBtn}</span>
          </div>
          <div className="selected-work-grid">
            {T.selectedWorks.map((work, idx) => (
              <div key={idx} className="work-card" onClick={() => navigate("/portfolio")}>
                <div className="work-image-placeholder">
                  <span className="work-badge">[ {work.badge} ]</span>
                </div>
                <div className="work-info">
                  <span className="preview-num">{work.num}</span>
                  <h3 className="work-title">{work.title}</h3>
                  <p className="work-desc">{work.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="how-it-works-section animate-float-up delay-450">
          <div className="preview-header">
            <div className="badge" style={{ gap: '24px' }}>
              <span className="badge-index">(03)</span>
              <span className="badge-text">{T.howItWorksTitle}</span>
            </div>
            <div className="preview-line"></div>
            <span style={{ color: '#A1824A', fontSize: '10px', cursor: 'pointer', fontFamily: 'var(--font-sans)', letterSpacing: '0.05em' }} onClick={() => navigate("/how-we-work")}>{T.howItWorksSubtitle}</span>
          </div>
          <div className="how-it-works-grid">
            {T.howItWorksSteps.map((step, idx) => (
              <div key={idx} className="how-it-works-card" onClick={() => navigate("/how-we-work")}>
                <span className="preview-num">{step.num}</span>
                <h3 className="work-title" style={{ marginTop: '32px', marginBottom: '8px' }}>{step.title}</h3>
                <p className="work-desc" style={{ textTransform: 'none', lineHeight: '1.6' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Home Bottom CTA */}
        <div className="home-bottom-cta animate-float-up delay-500">
          <div className="home-cta-content">
            <span className="home-cta-subtitle">{T.ctaSubtitle}</span>
            <h2 className="home-cta-title">
              <span style={{ color: 'var(--text-color)' }}>{T.ctaTitle1}</span>
              <br />
              <span style={{ color: 'var(--accent, #A1824A)', fontStyle: 'italic', fontFamily: 'var(--font-serif, serif)', fontSize: 'inherit' }}>{T.ctaTitle2}</span>
            </h2>
          </div>
          <button className="home-cta-btn" onClick={() => navigate("/estimate")}>
            {T.ctaBtn}
          </button>
        </div>

        {/* Trust Cluster — Integrated Social Proof & Certifications */}
        <div className="trust-cluster animate-float-up delay-500">
          <div className="trust-indicators">
            <div className="stat-card" title={T.statsRatingTooltip}>
              <span className="stat-label">{T.statsRatingLabel}</span>
              <span className="stat-value">{T.statsRatingValue}</span>
            </div>
            <div className="stat-card" title={T.statsMarketTooltip}>
              <span className="stat-label">{T.statsMarket}</span>
              <span className="stat-value">{T.statsMarketValue}</span>
            </div>
            <div className="stat-card" title={T.statsTurnaroundTooltip}>
              <span className="stat-label">{T.statsTurnaroundLabel}</span>
              <span className="stat-value">{T.statsTurnaroundValue}</span>
            </div>
          </div>

          <div className="trust-bar">
            {/* Row 2: Authority Badges */}
            <div className="credentials-grid">
              <div className="credential-box">{T.badgeLicensedBR}</div>
              <div className="credential-box">{T.badgeLicensedUS}</div>
              <div className="credential-box">{T.badgeZoning}</div>
            </div>

            {/* Row 3: Software Logos (Grayscale) */}
            <div className="trust-bar-logos">
              <div className="software-logo-item" title={T.softwareChief}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M 5 3 A 17 17 0 0 1 22 20" stroke="#A1824A" strokeWidth="2.5" />
                  <rect x="2" y="3" width="3" height="17" fill="#A1824A" />
                </svg>
                <span className="software-logo-text">{T.softwareChief}</span>
              </div>
              <div className="software-logo-item" title="SketchUp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#A1824A"><path d="M.968 9.027l7.717 4.428-.006 1.32-4.39-2.518-2.763 1.57 7.148 4.12.005 1.27-7.658-4.405c.02.516.488 2.106 1.383 3.337.91 1.247 1.946 1.776 1.946 1.776L11.428 24V11.849L.975 5.846zm22.064-3.8L15.22.723S13.982 0 12.008 0C9.952 0 8.76.746 8.76.746l-7.236 4.14 11.009 6.328V24l7.245-4.136s1.295-.715 2.279-2.414c.867-1.496.975-2.943.975-2.943zM11.251 7.308s1.615-.298 2.98.49l2.171 1.25s.003 1.097.003 2.736c0 1.313-1.112 2.674-1.112 2.674l.002-4.816zm6.402 10.562l-2.358 1.353v-1.269l1.835-1.05c1.748-1.26 2.037-3.117 2.037-3.761l-.007-5.705-5.006-2.881s-.76-.499-2.129-.499c-1.367 0-2.113.461-2.113.461L8.154 5.53l-1.11-.641L9.473 3.5s.95-.527 2.544-.527c1.462 0 2.6.571 2.6.571L20.27 6.81l-.007 6.226c.04.957-.406 3.296-2.61 4.835z"/></svg>
                <span className="software-logo-text">SketchUp</span>
              </div>
              <div className="software-logo-item" title="AutoCAD">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#A1824A"><path d="M3.8672 1.0527v.0157L0 3.3848v17.914l3.8965-2.332h18.3398V2.3301c0-.702-.5773-1.2774-1.2793-1.2774H3.8672zm7.5058 4.0098h3.3008l2.9844 9.9512h-2.5879l-.5683-2.1895h-2.9844l-.5703 2.1621h-2.416l2.8417-9.9238zm11.8633.0273v14.877H4.172l-2.0684 1.2383v.4648c0 .702.5793 1.2774 1.2813 1.2774H24V5.0898h-.7637zM12.9668 6.6816l-.9941 4.3243h2.0468l-1.0527-4.3243z"/></svg>
                <span className="software-logo-text">AutoCAD</span>
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
