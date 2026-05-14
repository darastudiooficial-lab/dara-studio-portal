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
    title: { EN: "Full Construction Documentation", PT: "Documentação Técnica Completa (CDs)" },
    desc: { 
      EN: "Convert your schematic designs into comprehensive, permit-ready sets. We handle the heavy lifting of technical drafting so your team can focus on design and client relations.",
      PT: "Converta seus designs esquemáticos em conjuntos completos prontos para aprovação. Lidamos com o trabalho pesado do desenho técnico para que sua equipe foque no design e no cliente."
    },
    list: {
      EN: ["Redlining & Markups Integration", "Sheet Setup & Title Blocks", "Chief Architect 3D-to-2D Workflow", "Permit-Ready Sets"],
      PT: ["Integração de Redlining & Markups", "Configuração de Pranchas e Selos", "Workflow Chief Architect 3D-para-2D", "Conjuntos Prontos para Aprovação"]
    },
    output: "Output: DWG, PDF",
    tools: "Chief Architect Expert",
    deliverables: {
      EN: "High-precision technical sets synced with 3D model.",
      PT: "Conjuntos técnicos de alta precisão sincronizados com modelo 3D."
    }
  },
  {
    id: "permit_processing",
    icon: <Icons.OfficeSupport />,
    isUS: true,
    title: { EN: "Permit Processing Support", PT: "Suporte para Aprovação Municipal" },
    desc: { 
      EN: "Zoning & Building Code Review. We ensure every drawing complies with local IBC/IRC standards to minimize RFIs and speed up approvals.",
      PT: "Revisão de Zoneamento e Códigos de Construção. Garantimos que cada desenho cumpra as normas locais IBC/IRC para minimizar RFIs e agilizar aprovações."
    },
    list: {
      EN: ["IBC/IRC Compliance Review", "Zoning Analysis Support", "RFI Mitigation Strategy", "ADA Accessibility Check"],
      PT: ["Revisão de Conformidade IBC/IRC", "Suporte a Análise de Zoneamento", "Estratégia de Mitigação de RFI", "Verificação de Acessibilidade ADA"]
    },
    output: "Standards: IBC, IRC, ADA"
  },
  {
    id: "wood_frame",
    icon: <Icons.WoodFrame />,
    isUS: true,
    title: { EN: "Wood Framing Support", PT: "Suporte em Wood Framing" },
    desc: { 
      EN: "We offer technical support for framing layouts and basic structural pre-dimensioning. Our focus is providing the graphic foundation needed to facilitate final detailing by licensed professionals.",
      PT: "Oferecemos suporte técnico para o desenvolvimento de plantas de framing e pré-dimensionamento estrutural básico. Nosso foco é fornecer o embasamento gráfico necessário para facilitar o detalhamento final por profissionais licenciados."
    },
    list: {
      EN: ["Framing Layouts (Wall/Floor)", "Preliminary Member Sizing", "3D Framing Visualization", "Documentation Support"],
      PT: ["Layouts de Framing (Parede/Piso)", "Pré-dimensionamento Preliminar", "Visualização 3D de Framing", "Suporte em Documentação"]
    },
    output: "Output: DWG, PDF",
    tools: "Chief Architect · AutoCAD",
    deliverables: {
      EN: "3D Framing Models, Basic Layouts & Graphic Support.",
      PT: "Modelos 3D de Framing, Layouts Básicos e Suporte Gráfico."
    },
    disclaimer: {
      EN: "⚠️ IMPORTANT: All technical drawings must be reviewed and signed by a local licensed professional (RA/P.E.) before construction.",
      PT: "⚠️ IMPORTANTE: É obrigatório que todos os desenhos sejam revisados e assinados por um profissional local licenciado antes da construção."
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    title: { EN: "Precision CAD Conversion", PT: "Conversão CAD de Precisão" },
    desc: { 
      EN: "Transform static PDF plans, sketches, or legacy blueprints into fully editable, high-precision CAD files. All projects are modeled in Chief Architect to ensure spatial integrity before final export.",
      PT: "Transforme plantas estáticas em PDF, esboços ou projetos antigos em arquivos CAD totalmente editáveis e de alta precisão. Projetos modelados integralmente em Chief Architect, garantindo integridade espacial antes da exportação final."
    },
    list: {
      EN: ["Custom Layer Mapping", "True-Scale Accuracy", "Block & Attribute Creation", "Dynamic Lineweight Setup"],
      PT: ["Mapeamento de Camadas Customizado", "Acurácia de Escala Real (1:1)", "Criação de Blocos e Atributos", "Configuração de Espessura de Linha Dinâmica"]
    },
    output: "Output: .DWG, .PDF",
    deliverables: {
      EN: "100% Manual Drafting | Intelligent CAD Conversion on Demand.",
      PT: "Redesenho 100% Manual | Conversão inteligente para CAD sob demanda."
    }
  },
  {
    id: "redrawing",
    icon: <Icons.Redrawing />,
    title: { EN: "Design Development & Production", PT: "Desenho e Produção Técnica" },
    desc: { 
      EN: "Elevate your design sketches into high-performance technical sets. We provide seamless production support, ensuring your architectural intent is matched with rigorous international standards and professional documentation logic.",
      PT: "Eleve seus esboços de design para conjuntos técnicos de alta performance. Oferecemos suporte de produção contínuo, garantindo que sua intenção arquitetônica seja acompanhada por rigorosos padrões internacionais."
    },
    list: {
      EN: ["International Standards Compliance", "Advanced Layer Organization", "As-Built Documentation", "Annotative Detailing Support", "Revision & Markup Integration"],
      PT: ["Conformidade com Padrões Internacionais", "Organização de Camadas Avançada", "Documentação As-Built", "Suporte a Detalhamento Anotativo", "Integração de Revisões e Markups"]
    },
    output: "Output: .DWG, .PDF",
    deliverables: {
      EN: "White-Label Ready | Cloud-Integrated Workflow",
      PT: "Pronto para White-Label | Fluxo em Nuvem"
    }
  },
  {
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    title: { EN: "High-Performance Back-Office Support", PT: "Suporte Back-Office de Alta Performance" },
    desc: { 
      EN: "Scale your firm’s production capacity without the overhead of expanding your local team. We act as your dedicated technical back-office, handling high-volume drafting and complex revisions so you can focus on winning new contracts and managing client relationships.",
      PT: "Escale a capacidade de produção do seu escritório sem os custos fixos de expandir sua equipe local. Atuamos como seu back-office técnico dedicado, lidando com grandes volumes de desenho e revisões complexas."
    },
    list: {
      EN: ["Agile Revision Cycles", "Capacity on Demand", "Standardized Workflows", "Complex Layout Modeling", "Project Documentation Management"],
      PT: ["Ciclos de Revisão Ágeis", "Capacidade Sob Demanda", "Fluxos de Trabalho Padronizados", "Modelagem de Layouts Complexos", "Gestão de Documentação de Projeto"]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: "White-Label Integration | Time-Zone Advantage",
      PT: "Integração White-Label | Vantagem de Fuso Horário"
    }
  },
  {
    id: "viz",
    icon: <Icons.Viz />,
    title: { EN: "High-End 3D Visualization", PT: "Visualização 3D de Alto Padrão" },
    desc: { 
      EN: "Bring your architectural concepts to life with immersive 3D visualizations. We combine precise technical modeling with advanced Generative AI to deliver high-fidelity renders with faster turnaround times and photographic realism.",
      PT: "Dê vida aos seus conceitos arquitetônicos com visualizações 3D imersivas. Combinamos modelagem técnica precisa com IA Generativa para entregas mais rápidas e realismo fotográfico."
    },
    list: {
      EN: ["Photorealistic Rendering", "IA-Enhanced Rendering", "Conceptual Massing Studies", "BIM-Integrated Modeling", "Material & Texture Refinement"],
      PT: ["Renderização Fotorrealista", "Renderização Otimizada por IA", "Estudos Volumétricos Conceituais", "Modelagem Integrada ao BIM", "Refinamento de Materiais e Texturas"]
    },
    output: "Output: JPG, MP4, PDF",
    deliverables: {
      EN: "4K Still Renders | AI-Powered Excellence | Board-Ready Assets",
      PT: "Renders 4K | Excelência Otimizada por IA | Ativos para Reunião"
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

  const scrollToIdx = (idx) => {
    if (scrollRef.current) {
      const cardWidth = 420;
      scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
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
          <h1 className="services-main-title">
            {lang === "EN" ? (
              <>
                <span className="title-white">Specialized</span> <span className="title-gradient-italic">Technical Support</span>
              </>
            ) : (
              <>
                <span className="title-gradient-italic">Suporte Técnico</span> <span className="title-white">Especializado</span>
              </>
            )}
          </h1>
          <p className="service-desc" style={{ maxWidth: '1150px', margin: '0 auto', fontSize: '15px', opacity: 0.8, lineHeight: '1.4' }}>
            {lang === "EN" 
              ? "DARA Studio acts as a high-performance technical extension for architecture and engineering firms worldwide, transforming complex project demands into precision, professional-ready deliverables."
              : "DARA Studio atua como uma extensão técnica de alta performance para escritórios de arquitetura e engenharia em todo o mundo, transformando demandas complexas de projetos em entregas precisas e prontas para uso profissional."}
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

                {service.output && (
                  <div className="service-output-badge">
                    {service.output}
                  </div>
                )}

                {(service.tools || service.deliverables) && (
                  <div className="service-footer-info">
                    {service.tools && (
                      <div className="service-extra-info">
                        <span className="info-label">{lang === 'EN' ? 'Compatible with:' : 'Compatível com:'}</span> {service.tools}
                      </div>
                    )}
                    {service.deliverables && (
                      <div className="service-extra-info">
                        <span className="info-label">{lang === 'EN' ? 'Deliverables:' : 'Entregas:'}</span> {service.deliverables[lang]}
                      </div>
                    )}
                  </div>
                )}

                {service.disclaimer && (
                  <div className="service-disclaimer">
                    {service.disclaimer[lang]}
                  </div>
                )}

                <button className="btn-glow" onClick={handleStartProject} style={{ marginTop: '20px', width: '100%' }}>
                  {lang === 'EN' ? 'START YOUR PROJECT' : 'INICIAR PROJETO'}
                </button>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={() => scroll('right')}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Pagination Dots */}
          <div className="carousel-dots">
            {SERVICES_DATA.map((_, idx) => (
              <div 
                key={idx} 
                className={`dot ${activeIdx === idx ? 'active' : ''}`}
                onClick={() => scrollToIdx(idx)}
              />
            ))}
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
