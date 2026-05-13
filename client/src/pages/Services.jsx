import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

// Icons using SVG for stability
const Icons = {
  Drafting: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 21 3-3 3 3"/><path d="m9 21 3-3-3-3"/><path d="M12 21V9"/><path d="M18 12c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1h-2"/><path d="M6 12c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h2"/><circle cx="12" cy="5" r="3"/></svg>
  ),
  WoodFrame: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10v11h18V10"/><path d="M3 10l9-7 9 7"/><path d="M9 21v-8h6v8"/><path d="M12 3v7"/></svg>
  ),
  PdfCad: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
  Redrawing: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  OfficeSupport: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  ),
  Viz: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

const SERVICES_DATA = [
  {
    id: "drafting",
    icon: <Icons.Drafting />,
    isUS: true,
    title: { EN: "Architectural Drafting", PT: "Desenho Arquitetônico" },
    desc: { 
      EN: "Floor plans, elevations, sections, and full construction document sets aligned with U.S. (IRC/IBC) and Brazilian (NBR) codes.",
      PT: "Plantas, fachadas, cortes e conjuntos completos de documentos de construção alinhados com as normas dos EUA (IRC/IBC) e Brasil (NBR)."
    },
    list: {
      EN: ["Permit Sets (US/BR)", "Construction Documentation", "Code Compliance Review", "Layer Standardization"],
      PT: ["Projetos de Aprovação (EUA/BR)", "Documentação Executiva", "Revisão de Normas Técnicas", "Padronização de Layers"]
    }
  },
  {
    id: "wood_frame",
    icon: <Icons.WoodFrame />,
    isUS: true,
    title: { EN: "Wood Frame Design", PT: "Design de Wood Frame" },
    desc: { 
      EN: "Specialized framing layouts and load-path documentation for residential wood construction — builder-ready and engineer-coordinated.",
      PT: "Layouts de estrutura e documentação de caminho de carga para construção residencial em madeira — pronto para o construtor."
    },
    list: {
      EN: ["Wall Framing Layouts", "Floor Joist Systems", "Load-Path Detailing", "US Standard Coordination"],
      PT: ["Layouts de Paredes", "Sistemas de Vigas de Piso", "Detalhamento de Carga", "Coordenação Padrão EUA"]
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    title: { EN: "PDF to CAD Conversion", PT: "Conversão de PDF para CAD" },
    desc: { 
      EN: "We convert PDF drawings, images, or legacy files into organized, high-precision technical CAD files.",
      PT: "Convertemos desenhos em PDF, imagens ou arquivos antigos em arquivos CAD técnicos organizados e de alta precisão."
    },
    list: {
      EN: ["Vectorization", "Project Scaling", "Layer Organization", "File Cleanup"],
      PT: ["Vetorização", "Escalonamento de Projeto", "Organização de Camadas", "Limpeza de Arquivos"]
    }
  },
  {
    id: "redrawing",
    icon: <Icons.Redrawing />,
    title: { EN: "Redrawing & Production", PT: "Redesenho e Produção" },
    desc: { 
      EN: "High-precision adjustments following international standards. Floor plans, sections, and professional layer organization.",
      PT: "Ajustes de alta precisão seguindo padrões internacionais. Plantas, cortes e organização profissional de layers."
    },
    list: {
      EN: ["Technical Precision", "International Standards", "Layer Organization", "Detailing Support"],
      PT: ["Precisão Técnica", "Padrões Internacionais", "Organização de Layers", "Suporte a Detalhamento"]
    }
  },
  {
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    title: { EN: "Architecture Office Support", PT: "Suporte a Escritórios" },
    desc: { 
      EN: "Scale your firm’s production without expanding your local team. Technical revisions and layout modeling on demand.",
      PT: "Escale a produção do seu escritório sem expandir sua equipe local. Revisões técnicas e modelagem de layout sob demanda."
    },
    list: {
      EN: ["Production Scaling", "On-Demand Support", "Technical Revisions", "Layout Modeling"],
      PT: ["Escala de Produção", "Suporte Sob Demanda", "Revisões Técnicas", "Modelagem de Layout"]
    }
  },
  {
    id: "viz",
    icon: <Icons.Viz />,
    title: { EN: "3D Visualization & Concept", PT: "Visualização 3D e Conceito" },
    desc: { 
      EN: "High-quality visual studies for client presentations and municipal submissions. Precision modeling for design refinement.",
      PT: "Estudos visuais de alta qualidade para apresentações e aprovações. Modelagem de precisão para refinamento de design."
    },
    list: {
      EN: ["Visual Studies", "Client Presentations", "Design Refinement", "Precision Modeling"],
      PT: ["Estudos Visuais", "Apresentações", "Refinamento de Design", "Modelagem de Precisão"]
    }
  }
];

export default function Services() {
  const navigate = useNavigate();
  const { lang, openVera } = useAppContext();
  const scrollRef = React.useRef(null);
  const [activeIdx, setActiveIdx] = React.useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 420; // card width + gap
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 420;
      const newIdx = Math.round(scrollLeft / cardWidth);
      if (newIdx !== activeIdx) setActiveIdx(newIdx);
    }
  };

  const handleStartProject = () => {
    const msg = lang === 'EN'
      ? "Hi! I'm VÉRA. I can help you with a quick estimate for your project. What are we drafting today?"
      : "Olá! Eu sou a VÉRA. Posso te ajudar com um orçamento rápido para o seu projeto. O que vamos desenhar hoje?";
    openVera(msg);
  };

  return (
    <div className="lp-root services-page-root">
      <Navbar />
      
      <main className="independent-page">
        {/* Header Section */}
        <header className="services-header-premium animate-float-up">
          <span className="services-tagline">What We Do</span>
          <h1 className="services-main-title">
            {lang === "EN" ? "Specialized Technical Support" : "Suporte Técnico Especializado"}
          </h1>
          <p className="service-desc" style={{ maxWidth: '650px', margin: '0 auto', fontSize: '16px', opacity: 0.8 }}>
            {lang === "EN" 
              ? "DA·RA acts as a high-performance technical extension for architecture and engineering firms, transforming complex project demands into precision deliverables."
              : "A DA·RA atua como uma extensão técnica de alta performance para escritórios de arquitetura e engenharia, transformando demandas complexas em entregas de precisão."}
          </p>
        </header>

        {/* Services Carousel */}
        <div className="services-carousel-wrap">
          <button className="carousel-arrow left" onClick={() => scroll('left')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          
          <div 
            className="services-grid carousel" 
            ref={scrollRef} 
            onScroll={handleScroll}
          >
            {SERVICES_DATA.map((service, idx) => (
              <div 
                key={service.id} 
                className={`service-card-premium animate-float-up ${activeIdx === idx ? 'active' : ''}`}
                style={{ animationDelay: `${(idx + 1) * 50}ms` }}
              >
                {service.isUS && <span className="service-badge-us">US Standard</span>}
                <div className="service-icon-box">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title[lang]}</h3>
                <p className="service-desc">{service.desc[lang]}</p>
                
                <ul className="service-list">
                  {service.list[lang].map((item, i) => (
                    <li key={i} className="service-list-item">
                      <Icons.Check />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="lp-btn-secondary" onClick={handleStartProject} style={{ marginTop: '20px', width: '100%', fontSize: '12px' }}>
                  {lang === 'EN' ? 'ORDER NOW' : 'PEDIR AGORA'}
                </button>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={() => scroll('right')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

      </main>
      <Footer />
    </div>
  );
}
