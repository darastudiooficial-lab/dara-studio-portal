import React from 'react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import PageTransition from "../components/PageTransition";

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
    badge: { EN: `PACKAGE 01 · COMPREHENSIVE PERMIT SET | Phase: CD & PERMITTING`, PT: `PACOTE 01 · CONJUNTO COMPLETO PARA PERMIT | Phase: PROJETO EXECUTIVO` },
    title: { EN: `As-Built Drawings & Permit Packages`, PT: `Desenhos As-Built e Pacotes de Prefeitura` },
    desc: { 
      EN: `Our flagship end-to-end solution. A complete architectural suite covering existing conditions (As-Built), full design development, and high-precision construction documents (CD) required for municipal approval and field execution.`,
      PT: `Nossa solução completa de ponta a ponta. Um conjunto arquitetônico abrangente que cobre desde o levantamento (As-Built) até o desenvolvimento de design e documentação técnica de alta precisão exigida para aprovação municipal e execução em obra.`
    },
    calloutBox: {
      EN: `We don’t just draft; we engineer for approval. Our profound knowledge of US building codes (IBC/IRC) ensures fewer RFIs, faster permit issuance, and a project that is truly ready for construction—saving you time, money, and administrative friction.`,
      PT: `Nós não apenas desenhamos; nós projetamos para aprovação. Nosso profundo conhecimento dos códigos de construção americanos (IBC/IRC) garante menos RFIs, emissão de alvará mais rápida e um projeto pronto para construir — economizando tempo, recursos e dores de cabeça burocráticas.`
    },
    bentoExtras: {
      EN: [
        { title: `Architectural Development`, desc: `Refined exterior styling, material selection, and aesthetic consistency.` },
        { title: `Strategic Space Planning`, desc: "Macro-level layout optimization for maximum square footage functionality." },
        { title: `Interior Layout Design`, desc: `Precise placement of furniture, cabinetry, and fixtures for interior flow.` },
        { title: `Framing & Constructive Detail`, desc: "Specialized wall and floor framing layouts with technical schedules to minimize site waste." },
        { title: `Regulatory Code Compliance`, desc: "Professional annotations and citations of local municipal codes to streamline the plan review process." },
        { title: `Exterior Photorealistic Rendering`, desc: `High-fidelity 3D visualization of the building's exterior included to showcase design intent and curb appeal.`, highlight: true }
      ],
      PT: [
        { title: `Desenvolvimento Arquitetônico`, desc: `Refino de estilo exterior, seleção de materiais e consistência estética.` },
        { title: `Planejamento Espacial Estratégico`, desc: `Otimização de layout em nível macro para funcionalidade máxima da metragem.` },
        { title: `Design de Layout Interno`, desc: `Posicionamento preciso de mobiliário, marcenaria e equipamentos para fluxo interno.` },
        { title: `Detalhamento de Framing e Construção`, desc: `Layouts especializados de framing (paredes e pisos) com tabelas técnicas para minimizar desperdícios na obra.` },
        { title: `Conformidade com Códigos Municipais`, desc: `Anotações e citações profissionais dos códigos locais para agilizar o processo de revisão da prefeitura.` },
        { title: `Renderização Externa Fotorrealista`, desc: `Visualização 3D de alta fidelidade da fachada inclusa para demonstrar a intenção do design e valorização do imóvel.`, highlight: true }
      ]
    },
    output: `Output: DWG, PDF`,
    tools: "Chief Architect Expert",
    deliverables: {
      EN: `Permit-Ready PDF Set | Layered DWG Files`,
      PT: `Set em PDF Pronto para Permit | Arquivos DWG em Camadas`
    },
    disclaimer: {
      EN: `Interior 3D Modules: Check availability for custom angles of interior areas.`,
      PT: `Módulos de Interiores: Consultar disponibilidade para ângulos personalizados de áreas internas.`
    },
    notIncluded: {
      EN: ["Structural Engineering Stamp (PE)", "Civil & MEP Engineering", "Interior Finish Specification", "Material Procurement"],
      PT: ["Carimbo de Engenharia Estrutural (PE Stamp)", "Engenharia Civil e MEP", `Especificação de Acabamentos de Interiores`, "Compra de Materiais"]
    }
  },
  {
    id: "redrawing",
    icon: <Icons.Redrawing />,
    badge: { EN: `PACKAGE 02 · FLOOR PLANS & SPACE PLANNING | Phase: SCHEMATIC DESIGN`, PT: `PACOTE 02 · LAYOUT & PLANTAS BAIXAS | Phase: ESTUDO PRELIMINAR` },
    title: { EN: `Floor Plans Only`, PT: `Apenas Plantas Baixas` },
    desc: { 
      EN: `Specialized technical drafting focused on interior space optimization. Engineered for preliminary space studies, zoning analysis, and high-end 2D layout concepts.`,
      PT: `Desenho técnico especializado focado na otimização de layouts internos. Ideal para estudos de viabilidade espacial, análise de zoneamento e propostas conceituais em 2D.`
    },
    calloutBox: {
      EN: `Whether you are an investor pitching an asset or a property owner visualizing a space, our team delivers precise architectural drafting with a rapid turnaround and aesthetic refinement that generic drafting services simply cannot match.`,
      PT: `Seja você um investidor validando um ativo ou um proprietário visualizando o potencial de um imóvel, nossa equipe entrega plantas arquitetônicas precisas, combinando agilidade e refino estético que serviços genéricos de desenho não conseguem alcançar.`
    },
    list: {
      EN: [
        { label: `Core Spatial Layouts`, desc: `Internal wall placement, door schedules, and space identification.` },
        { label: `Dimensioned Floor Plans`, desc: "High-accuracy measurements of all interior spaces and structural baselines." },
        { label: `Advanced CAD Layer Management`, desc: "Organized and clean file structure for professional integration." },
        { label: `Revision & Markup Integration`, desc: "Seamless processing of feedback and design markups." }
      ],
      PT: [
        { label: `Layouts Espaciais Estratégicos`, desc: `Posicionamento de paredes internas, fluxos de portas e identificação técnica de ambientes.` },
        { label: `Plantas Baixas Dimensionadas`, desc: `Medições precisas de todos os espaços internos e eixos estruturais.` },
        { label: `Organização Avançada de Camadas`, desc: "Estrutura de arquivos CAD limpa e padronizada para uso profissional." },
        { label: `Integração de Revisões e Markups`, desc: `Processamento ágil de feedbacks e anotações técnicas.` }
      ]
    },
    output: `Output: .DWG, .PDF`,
    deliverables: {
      EN: `White-Label Ready | Cloud-Integrated Workflow`,
      PT: `Pronto para White-Label | Fluxo em Nuvem`
    },
    notIncluded: {
      EN: ["Exterior Design", "3D Renderings", "Municipal Permitting", "Structural Engineering"],
      PT: ["Design Exterior", `Renderizações 3D`, `Aprovação em Prefeitura`, "Engenharia Estrutural"]
    }
  },
  {
    id: "viz",
    icon: <Icons.Viz />,
    badge: { EN: `PACKAGE 03 · 3D VISUALIZATION | Phase: PRESENTATION & MARKETING`, PT: `PACOTE 03 · VISUALIZAÇÃO 3D | Phase: APRESENTAÇÃO & MARKETING` },
    title: { EN: `High-End 3D Visualization`, PT: `Visualização 3D de Alto Padrão` },
    desc: { 
      EN: `High-end architectural rendering and CGI support designed to transform technical blueprints into immersive visual assets. Engineered to elevate real estate marketing, client presentations, and pre-sale strategies.`,
      PT: `Renderização arquitetônica de alto padrão desenvolvida para transformar plantas técnicas em ativos visuais imersivos. Ideal para potencializar o marketing imobiliário, apresentações a clientes e estratégias de pré-venda.`
    },
    calloutBox: {
      EN: `Designed for builders, developers, and real estate professionals who need to visualize potential and secure capital. We deliver hyper-realistic 3D assets that communicate design intent and luxury value long before groundbreaking.`,
      PT: `Desenvolvido para construtores, incorporadores e profissionais do mercado imobiliário que precisam tangibilizar o potencial e atrair capital. Entregamos imagens 3D hiper-realistas que comunicam valor e sofisticação muito antes do início das obras.`
    },
    list: {
      EN: [
        { label: `Photorealistic Renderings`, desc: "High-resolution interior and exterior 3D perspectives with premium material mapping." },
        { label: `Lighting & Atmosphere Crafting`, desc: "Advanced daytime/nighttime environmental setups tailored to project aesthetics." },
        { label: `Digital Material Staging`, desc: `Accurate representation of textures, finishes, fixtures, and landscape elements.` },
        { label: `Marketing-Ready Deliverables`, desc: `Optimized, high-fidelity files ready for web, print, and investor pitches.` }
      ],
      PT: [
        { label: `Renderizações Fotorrealistas`, desc: `Perspectivas 3D internas e externas em alta resolução com mapeamento de materiais premium.` },
        { label: `Estudo de Iluminação e Atmosfera`, desc: `Configurações avançadas de cenários diurnos ou noturnos alinhados à estética do projeto.` },
        { label: `Humanização e Texturização Digital`, desc: `Representação precisa de texturas, acabamentos, mobiliário e elementos de paisagismo.` },
        { label: `Ativos Prontos para Marketing`, desc: `Arquivos finais em alta fidelidade otimizados para uso digital, material impresso e pitches de investidores.` }
      ]
    },
    notIncluded: {
      EN: ["Municipal Permitting", "Structural Engineering", "Working Construction Drawings", "CAD/BIM Floor Plans"],
      PT: [`Aprovação em Prefeitura`, "Engenharia Estrutural", "Desenhos Executivos de Obra", "Plantas Baixas em CAD/BIM"]
    },
    ctaNote: {
      EN: `[ Custom Estimate Based on Views → ]\n*Rates are calculated per camera angle and complexity. Generate your instant quote via our Estimate portal.`,
      PT: `[ Solicitar Estimativa por Ângulo → ]\n*Valores calculados com base no número de vistas e complexidade. Gere seu orçamento instantâneo no painel Estimate.`
    },
    output: `Output: JPG, MP4, PDF`,
    deliverables: {
      EN: `4K Still Renders | Board-Ready Assets`,
      PT: `Renders 4K | Ativos para Reunião`
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    badge: { EN: `PACKAGE 04 · CHIEF ARCHITECT CONVERSION | Phase: TECHNICAL DOCUMENTATION`, PT: `PACOTE 04 · CONVERSÃO CHIEF ARCHITECT | Phase: DOCUMENTAÇÃO TÉCNICA` },
    title: { EN: `Chief Architect Conversion`, PT: `Conversão Chief Architect` },
    desc: { 
      EN: `High-precision vectorization turning legacy blueprints, static PDFs, and sketches into fully editable, production-ready Chief Architect X17 native files and precise digital exports. Modeled directly within Chief Architect to ensure absolute spatial integrity.`,
      PT: `Vetorização de alta precisão que transforma plantas antigas, PDFs estáticos e esboços em arquivos nativos do Chief Architect X17 totalmente editáveis e prontos para produção. Modelagem realizada na plataforma para garantir total integridade espacial.`
    },
    calloutBox: {
      EN: `Precision is everything. We deliver millimeter-accurate digital conversions, structured under professional architectural layer standards. This allows your engineers and builders to begin working immediately, eliminating hours spent cleaning up messy files.`,
      PT: `A precisão é tudo. Garantimos conversões digitais milimetricamente exatas, estruturadas sob padrões profissionais de camadas (layers). Isso permite que seus engenheiros e construtores comecem a trabalhar imediatamente, eliminando horas perdidas ajustando arquivos bagunçados.`
    },
    list: {
      EN: [
        { label: `Fully Editable Native Files`, desc: "Native Chief Architect X17 formats and clean exports compatible with industry-leading architectural software." },
        { label: `Precise Scalement & Verification`, desc: "Rigorous verification and scaling adjustments to ensure real-world accuracy (1:1)." },
        { label: `Advanced Layer Management`, desc: `Structured layer and plan views mapping for walls, dimensions, annotations, and blocks.` },
        { label: `Digital Archiving Setup`, desc: `Clean, high-performance file architecture ideal for contractors and digital storage.` }
      ],
      PT: [
        { label: `Arquivos Nativos Totalmente Editáveis`, desc: `Arquivo original em formato Chief Architect X17 e exportações limpas compatíveis com os principais softwares do mercado.` },
        { label: `Escalonamento e Verificação Precisos`, desc: `Ajustes e verificações rigorosas para garantir precisão absoluta no mundo real (escala 1:1).` },
        { label: `Organização Avançada de Camadas (Layers)`, desc: `Estruturação inteligente de camadas e vistas técnicas para paredes, dimensões, anotações e atributos.` },
        { label: `Infraestrutura para Arquivamento Digital`, desc: `Arquivos limpos e otimizados, ideais para o dia a dia de empreiteiros e construtores.` }
      ]
    },
    output: `Output: .PLAN, .DWG, .PDF`,
    deliverables: {
      EN: `100% Native Modeling | Production-Ready Files`,
      PT: `Modelagem 100% Nativa | Arquivos Prontos para Produção`
    },
    notIncluded: {
      EN: ["Architectural Design", "Code & Zoning Compliance Review", "On-Site Field Measurements", "3D Modeling & Rendering"],
      PT: [`Design Arquitetônico`, `Revisão de Códigos e Zoneamento`, `Medições de Campo (no Local)`, `Modelagem 3D e Renderização`]
    }
  },
  {
    id: "permit_processing",
    icon: <Icons.OfficeSupport />,
    isUS: true,
    title: { EN: `Municipal Approval Support`, PT: `Suporte para Aprovação Municipal` },
    desc: { 
      EN: `Streamline your permitting process. We ensure every drawing strictly complies with IBC/IRC standards and local zoning codes to eliminate RFIs and accelerate approvals.`,
      PT: `Agilize o licenciamento do seu projeto. Garantimos total conformidade técnica com os códigos locais (IBC/IRC) e de zoneamento, blindando sua entrega contra RFIs e atrasos na prefeitura.`
    },
    list: {
      EN: ["IBC/IRC Code Compliance Review", "Comprehensive Zoning Analysis", "Strategic RFI Mitigation", "ADA Accessibility Verification"],
      PT: [`Revisão de Conformidade IBC / IRC`, `Análise Estratégica de Zoneamento`, `Engenharia de Mitigação de RFI`, `Verificação de Acessibilidade (ADA Standards)`]
    },
    output: `Standards: IBC, IRC, ADA`
  },
  {
    id: "wood_frame",
    icon: <Icons.WoodFrame />,
    isUS: true,
    title: { EN: `Wood Framing Support`, PT: `Suporte em Wood Framing` },
    desc: { 
      EN: `Accurate structural drafting for seamless field execution. We deliver advanced framing layouts and preliminary sizing, providing the precise graphic foundation required to streamline final engineering and approval.`,
      PT: `Engenharia gráfica precisa para o sistema construtivo americano. Desenvolvemos plantas de framing e pré-dimensionamento preliminar, fornecendo a base técnica ideal para otimizar o detalhamento final por profissionais licenciados (PE Engineers).`
    },
    list: {
      EN: ["Wall & Floor Framing Layouts", "Preliminary Structural Sizing", "3D Framing Modeling & Visualization", "Technical Documentation Support"],
      PT: ["Layouts de Framing (Wall & Floor Systems)", `Pré-dimensionamento Estrutural Preliminar`, `Modelagem e Visualização 3D de Framing`, `Suporte em Documentação Técnica`]
    },
    output: `Output: DWG, PDF`,
    tools: "Chief Architect · AutoCAD",
    deliverables: {
      EN: `Framing Details | Submittal-Ready Plans`,
      PT: `Detalhes de Framing | Plantas Prontas para Submissão`
    }
  },
  {
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    badge: { EN: `CORPORATE SOLUTIONS · B2B SUPPORT`, PT: `SOLUÇÕES CORPORATIVAS · SUPORTE B2B` },
    title: { EN: `High-Performance Back-Office Support`, PT: `Suporte Back-Office de Alta Performance` },
    desc: { 
      EN: `Scale your firm’s production capacity without the overhead of expanding your local team. DARA Studio operates as your dedicated technical back-office, seamlessly handling high-volume drafting, precision documentation, and complex revisions.`,
      PT: `Escale a capacidade de produção do seu escritório ou construtora sem os custos fixos de expandir sua equipe local nos EUA. Atuamos como seu back-office técnico dedicado, absorvendo grandes volumes de desenho, detalhamento e revisões complexas.`
    },
    list: {
      EN: [
        { label: `Accelerated Revision Cycles`, desc: "Fast turnaround times to keep your active projects moving forward." },
        { label: `On-Demand Scalability`, desc: "Instant technical capacity to absorb sudden increases in project volume." },
        { label: `Standardized Technical Workflows`, desc: "Seamless file integration aligned with US graphic standards." },
        { label: `Complex Layout & Project Management`, desc: "End-to-end technical production and drafting oversight." }
      ],
      PT: [
        { label: `Ciclos de Revisão Ágeis`, desc: "Prazos otimizados para manter o fluxo dos seus projetos em andamento." },
        { label: `Capacidade Sob Demanda`, desc: `Infraestrutura técnica imediata para absorver picos de demanda.` },
        { label: `Fluxos de Trabalho Padronizados`, desc: `Processos integrados e alinhados aos padrões gráficos americanos.` },
        { label: `Modelagem e Gestão Documental`, desc: `Produção de documentação técnica e detalhamentos complexos.` }
      ]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: `White-Label Integration | Time-Zone Advantage`,
      PT: `Integração White-Label | Vantagem de Fuso Horário`
    }
  }
];

export default function Services() {

  const { lang } = useAppContext();
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















  return (
    <PageTransition variant="default">
    <div className="lp-root services-page-root">
      {/* Brilho radial roxo suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>
      <Navbar />
      
      <main className="independent-page">
        {/* Header Section */}
        <header className="page-header-premium animate-float-up">
          <h1 className="page-main-title">
            {lang === "EN" ? (
              <>
                <span className="title-white">Specialized</span> <span className="title-gradient-italic">Technical Support</span>
              </>
            ) : (
              <>
                <span className="title-gradient-italic">Suporte Técnico</span> <span className="title-white">de Alta Performance nos EUA</span>
              </>
            )}
          </h1>
          <p className="page-subtitle-standard">
            {lang === "EN" 
              ? `DARA Studio operates as a seamless technical extension for US builders, developers, and architects. We transform complex project demands into precise, permit-ready documentation. Scale your operation without the overhead.`
              : `A DARA Studio atua como o braço técnico estratégico de construtores, incorporadores e escritórios no mercado americano. Desenvolvemos documentação técnica precisa, do estudo preliminar ao Permit Set, garantindo agilidade e total conformidade com as normas locais.`}
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
                {service.badge && <span className="service-badge-us">{service.badge[lang]}</span>}
                {!service.badge && service.isUS && <span className="service-badge-us">US Standard</span>}
                <div className="service-icon-box">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title[lang]}</h3>
                <p className="service-desc">{service.desc[lang]}</p>
                
                {service.bentoExtras ? (
                  <div style={{ marginTop: 24, marginBottom: 16 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--dm)", marginBottom: 12, textTransform: "uppercase" }}>
                      {lang === "EN" ? "DESIGN EXTRAS — CUSTOMIZABLE PER PROJECT" : `EXTRAS DE DESIGN — CUSTOMIZÁVEIS POR PROJETO`}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
                      {service.bentoExtras[lang].map((bento, idx) => (
                        <div key={idx} style={{ 
                          background: bento.highlight ? "rgba(16, 185, 129, 0.04)" : "rgba(255,255,255,0.02)", 
                          border: bento.highlight ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(255,255,255,0.05)", 
                          borderRadius: "12px", 
                          padding: 16 
                        }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: bento.highlight ? "var(--a)" : "#fff", marginBottom: 8, lineHeight: 1.3 }}>{bento.title}</h4>
                          <p style={{ fontSize: 13, color: bento.highlight ? "#fff" : "var(--mu)", lineHeight: 1.5 }}>{bento.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : service.notIncluded ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16, marginBottom: 16 }}>
                    {/* INCLUDED CARD */}
                    <div style={{ background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#10b981", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? `WHAT'S INCLUDED` : `O QUE ESTÁ INCLUSO`}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {service.list[lang].map((item, i) => (
                          <li key={i} style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: "var(--a)", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                            <span>
                              {typeof item === 'string' ? item : (
                                <>
                                  <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* NOT INCLUDED CARD */}
                    <div style={{ background: "rgba(233, 30, 99, 0.03)", border: "1px solid rgba(233, 30, 99, 0.15)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#E91E63", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "NOT INCLUDED" : `NÃO INCLUSO`}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {service.notIncluded[lang].map((item, i) => (
                          <li key={i} style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: "#E91E63", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <ul className="service-list">
                    {service.list[lang].map((item, i) => (
                      <li key={i} className="service-list-item">
                        <Icons.Check />
                        <span>
                          {typeof item === 'string' ? item : (
                            <>
                              <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {service.output && (
                  <div className="service-output-badge">
                    {service.output}
                  </div>
                )}

                {(service.tools || service.deliverables) && (
                  <div className="service-footer-info">
                    {service.tools && (
                      <div className="service-extra-info">
                        <span className="info-label">{lang === 'EN' ? 'Compatible with:' : `Compatível com:`}</span> {service.tools}
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
    </PageTransition>
  );
}
