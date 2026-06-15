import React from 'react';
import { Link } from 'react-router-dom';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import PageTransition from "../components/PageTransition";

// Icons using SVG for stability
const Icons = {
  Drafting: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 21 3-3 3 3" /><path d="m9 21 3-3-3-3" /><path d="M12 21V9" /><path d="M18 12c.5 0 1 .5 1 1v2c0 .5-.5 1-1 1h-2" /><path d="M6 12c-.5 0-1 .5-1 1v2c0 .5.5 1 1 1h2" /><circle cx="12" cy="5" r="3" /></svg>
  ),
  WoodFrame: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10v11h18V10" /><path d="M3 10l9-7 9 7" /><path d="M9 21v-8h6v8" /><path d="M12 3v7" /></svg>
  ),
  PdfCad: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></svg>
  ),
  Redrawing: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
  ),
  OfficeSupport: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
  ),
  Viz: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
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
    output: `Output: PDF`,
    tools: "Chief Architect Expert",
    deliverables: {
      EN: `Permit-Ready PDF Set`,
      PT: `Set em PDF Pronto para Permit`
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
    badge: { EN: `PACKAGE 02 · FLOOR PLANS & SPACE PLANNING | PHASE: SCHEMATIC DESIGN`, PT: `PACOTE 02 · PLANTAS BAIXAS E PLANEJAMENTO | FASE: DESIGN ESQUEMÁTICO` },
    title: { EN: `Floor Plans Only`, PT: `Plantas Baixas` },
    desc: {
      EN: `Specialized technical drafting focused on interior space optimization. Engineered for preliminary space studies, zoning analysis, and high-end 2D layout concepts.`,
      PT: `Produção técnica especializada focada em otimização de espaços interiores. Desenvolvida para estudos preliminares, análise de zoneamento e conceitos de layout 2D de alto padrão.`
    },
    calloutBox: {
      EN: `Whether you are an investor pitching an asset or a property owner visualizing a space, our team delivers precise architectural drafting with a rapid turnaround and aesthetic refinement that generic drafting services simply cannot match.`,
      PT: `Seja você um investidor validando um ativo ou um proprietário visualizando o potencial de um imóvel, nossa equipe entrega plantas arquitetônicas precisas, combinando agilidade e refino estético que serviços genéricos de desenho não conseguem alcançar.`
    },
    list: {
      EN: [
        { label: `Core Spatial Layouts:`, desc: `Internal wall placement, door schedules, and space identification.` },
        { label: `Dimensioned Floor Plans:`, desc: "High-accuracy measurements of all interior spaces and structural baselines." },
        { label: `Revision & Markup Integration:`, desc: "Seamless processing of feedback and design markups." }
      ],
      PT: [
        { label: `Layouts Espaciais Principais:`, desc: `Posicionamento de paredes internas, cronograma de portas e identificação de espaços.` },
        { label: `Plantas Dimensionadas:`, desc: `Medições de alta precisão de todos os espaços internos e eixos estruturais.` },
        { label: `Integração de Revisões:`, desc: `Processamento ágil de feedbacks e marcações de projeto.` }
      ]
    },
    output: { EN: `OUTPUT: .PDF`, PT: `SAÍDA: .PDF` },
    deliverables: {
      EN: `White-Label Ready | Cloud-Integrated Workflow`,
      PT: `Pronto para White-Label | Fluxo Integrado em Nuvem`
    },
    notIncluded: {
      EN: ["Exterior Design", "3D Renderings", "Municipal Permitting", "Structural Engineering"],
      PT: ["Design Externo", `Renderizações 3D`, `Licenciamento Municipal`, "Engenharia Estrutural"]
    }
  },
  {
    id: "viz",
    icon: <Icons.Viz />,
    badge: { EN: `PACKAGE 03 · 3D VISUALIZATION | PHASE: PRESENTATION & MARKETING`, PT: `PACOTE 03 · VISUALIZAÇÃO 3D | FASE: APRESENTAÇÃO & MARKETING` },
    title: { EN: `High-End 3D Visualization`, PT: `Visualização 3D de Alto Padrão` },
    desc: {
      EN: `High-end architectural rendering and CGI support designed to transform technical blueprints into immersive visual assets. Engineered to elevate real estate marketing, client presentations, and pre-sale strategies.`,
      PT: `Renderização arquitetônica e suporte CGI de alto nível para transformar plantas técnicas em ativos visuais imersivos. Desenvolvido para elevar o marketing imobiliário, apresentações a clientes e estratégias de pré-venda.`
    },
    calloutBox: {
      EN: `Designed for builders, developers, and real estate professionals who need to visualize potential and secure capital. We deliver hyper-realistic 3D assets that communicate design intent and luxury value long before groundbreaking.`,
      PT: `Desenvolvido para construtores, incorporadores e profissionais do mercado imobiliário que precisam tangibilizar o potencial e atrair capital. Entregamos imagens 3D hiper-realistas que comunicam valor e sofisticação muito antes do início das obras.`
    },
    list: {
      EN: [
        { label: `Photorealistic Renderings:`, desc: "High-resolution interior and exterior 3D perspectives with premium material mapping." },
        { label: `Lighting & Atmosphere Crafting:`, desc: "Advanced daytime/nighttime environmental setups tailored to project aesthetics." },
        { label: `Marketing-Ready Deliverables:`, desc: `Optimized, high-fidelity files ready for web, print, and investor pitches.` }
      ],
      PT: [
        { label: `Renders Fotorrealistas:`, desc: `Perspectivas 3D internas e externas em alta resolução com mapeamento de materiais premium.` },
        { label: `Iluminação e Atmosfera:`, desc: `Configurações ambientais avançadas de dia/noite adaptadas à estética do projeto.` },
        { label: `Entregáveis para Marketing:`, desc: `Arquivos de alta fidelidade otimizados para web, impressão e apresentações a investidores.` }
      ]
    },
    notIncluded: {
      EN: ["Municipal Permitting", "Structural Engineering", "Working Construction Drawings", "CAD/BIM Floor Plans"],
      PT: ["Licenciamento Municipal", "Engenharia Estrutural", "Pranchas Construtivas Executivas", "Plantas CAD/BIM"]
    },
    ctaNote: {
      EN: `[ Custom Estimate Based on Views → ]\n*Rates are calculated per camera angle and complexity. Generate your instant quote via our Estimate portal.`,
      PT: `[ Solicitar Estimativa por Ângulo → ]\n*Valores calculados com base no número de vistas e complexidade. Gere seu orçamento instantâneo no painel Estimate.`
    },
    output: { EN: `OUTPUT: JPG, PDF`, PT: `SAÍDA: JPG, PDF` },
    deliverables: {
      EN: `4K Still Renders | Walkthrough Animation`,
      PT: `Renders Estáticos 4K | Animação Walkthrough`
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    badge: { EN: `PACKAGE 04 · CHIEF ARCHITECT CONVERSION | PHASE: TECHNICAL DOCUMENTATION`, PT: `PACOTE 04 · CONVERSÃO CHIEF ARCHITECT | FASE: DOCUMENTAÇÃO TÉCNICA` },
    title: { EN: `Chief Architect Conversion`, PT: `Conversão para Chief Architect` },
    desc: {
      EN: `High-precision vectorization turning legacy blueprints, static PDFs, and sketches into fully editable, production-ready Chief Architect X17 native files and precise digital exports. Modeled directly within Chief Architect to ensure absolute spatial integrity.`,
      PT: `Vetorização de alta precisão transformando plantas antigas, PDFs estáticos e esboços em arquivos nativos Chief Architect X17 totalmente editáveis e prontos para produção. Modelado diretamente no software para garantir integridade espacial absoluta.`
    },
    calloutBox: {
      EN: `Precision is everything. We deliver millimeter-accurate digital conversions, structured under professional architectural layer standards. This allows your engineers and builders to begin working immediately, eliminating hours spent cleaning up messy files.`,
      PT: `A precisão é tudo. Garantimos conversões digitais milimetricamente exatas, estruturadas sob padrões profissionais de camadas (layers). Isso permite que seus engenheiros e construtores comecem a trabalhar imediatamente, eliminando horas perdidas ajustando arquivos bagunçados.`
    },
    list: {
      EN: [
        { label: `Fully Editable Native Files:`, desc: "Native Chief Architect X17 formats and clean exports compatible with industry-leading architectural software." },
        { label: `Precise Scalement & Verification:`, desc: "Rigorous verification and scaling adjustments to ensure real-world accuracy (1:1)." },
        { label: `Advanced Layer Management:`, desc: `Structured layer and plan views mapping for walls, dimensions, annotations, and blocks.` },
        { label: `Digital Archiving Setup:`, desc: `Clean, high-performance file architecture ideal for contractors and digital storage.` }
      ],
      PT: [
        { label: `Arquivos Nativos Editáveis:`, desc: `Formatos nativos Chief Architect X17 e exportações limpas compatíveis com os principais softwares do mercado.` },
        { label: `Escalonamento e Verificação Precisos:`, desc: `Verificação rigorosa e ajustes de escala para garantir precisão real (1:1).` },
        { label: `Gestão Avançada de Camadas:`, desc: `Mapeamento estruturado de camadas e vistas de planta para paredes, cotas, anotações e blocos.` },
        { label: `Configuração de Arquivo Digital:`, desc: `Arquitetura de arquivos limpa e de alto desempenho, ideal para construtores e armazenamento digital.` }
      ]
    },
    output: { EN: `OUTPUT: .PLAN, .PDF`, PT: `SAÍDA: .PLAN, .PDF` },
    deliverables: {
      EN: `100% Native Modeling | Production-Ready Files`,
      PT: `Modelagem 100% Nativa | Arquivos Prontos para Produção`
    },
    notIncluded: {
      EN: ["Architectural Design", "Code & Zoning Compliance Review", "On-Site Field Measurements", "3D Modeling & Rendering"],
      PT: ["Projeto Arquitetônico", "Revisão de Conformidade de Código e Zoneamento", "Medições em Campo", "Modelagem 3D e Renderização"]
    }
  },
  {
    id: "permit_processing",
    icon: <Icons.OfficeSupport />,
    isUS: true,
    badge: { EN: 'US STANDARD', PT: 'PADRÃO EUA' },
    title: { EN: `Municipal Approval Support`, PT: `Suporte para Aprovação Municipal` },
    desc: {
      EN: `Streamline your permitting process. We ensure every drawing strictly complies with IBC/IRC standards and local zoning codes to eliminate RFIs and accelerate approvals.`,
      PT: `Otimize seu processo de licenciamento. Garantimos que cada prancha esteja em total conformidade com as normas IBC/IRC e códigos de zoneamento locais para eliminar RFIs e acelerar aprovações.`
    },
    list: {
      EN: ["IBC/IRC Code Compliance Review", "Comprehensive Zoning Analysis", "Strategic RFI Mitigation", "ADA Accessibility Verification"],
      PT: [`Revisão de Conformidade IBC/IRC`, `Análise Completa de Zoneamento`, `Mitigação Estratégica de RFIs`, `Verificação de Acessibilidade ADA`]
    },
    output: `Standards: IBC, IRC, ADA`
  },
  {
    id: "wood_frame",
    icon: <Icons.WoodFrame />,
    isUS: true,
    badge: { EN: 'US STANDARD', PT: 'PADRÃO EUA' },
    title: { EN: `Wood Framing Support`, PT: `Suporte em Estrutura de Madeira` },
    desc: {
      EN: `Accurate structural drafting for seamless field execution. We deliver advanced framing layouts and preliminary sizing, providing the precise graphic foundation required to streamline final engineering and approval.`,
      PT: `Produção estrutural precisa para execução em campo sem falhas. Desenvolvemos layouts avançados de estrutura de madeira e dimensionamento preliminar, fornecendo a base gráfica necessária para agilizar a engenharia final e aprovação.`
    },
    list: {
      EN: ["Wall & Floor Framing Layouts", "Preliminary Structural Sizing", "3D Framing Modeling & Visualization", "Technical Documentation Support"],
      PT: ["Layouts de Estrutura de Paredes e Pisos", "Dimensionamento Estrutural Preliminar", "Modelagem 3D e Visualização da Estrutura", "Suporte em Documentação Técnica"]
    },
    output: { EN: `OUTPUT: DWG, PDF`, PT: `SAÍDA: DWG, PDF` },
    tools: "Chief Architect · AutoCAD",
    deliverables: {
      EN: `Framing Details | Submittal-Ready Plans`,
      PT: `Detalhes de Estrutura | Pranchas Prontas para Submissão`
    }
  },
  {
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    badge: { EN: `CORPORATE SOLUTIONS · B2B SUPPORT`, PT: `SOLUÇÕES CORPORATIVAS · SUPORTE B2B` },
    title: { EN: `High-Performance Back-Office Support`, PT: `Suporte Back-Office de Alta Performance` },
    desc: {
      EN: `Scale your firm's production capacity without the overhead of expanding your local team. DARA Studio operates as your dedicated technical back-office, seamlessly handling high-volume drafting, precision documentation, and complex revisions.`,
      PT: `Expanda a capacidade produtiva do seu escritório sem o custo de ampliar sua equipe local. O DARA Studio atua como seu back-office técnico dedicado, gerenciando produção em volume, documentação de precisão e revisões complexas.`
    },
    list: {
      EN: [
        { label: `Accelerated Revision Cycles:`, desc: "Fast turnaround times to keep your active projects moving forward." },
        { label: `On-Demand Scalability:`, desc: "Instant technical capacity to absorb sudden increases in project volume." },
        { label: `Standardized Technical Workflows:`, desc: "Seamless file integration aligned with US graphic standards." },
        { label: `Complex Layout & Project Management:`, desc: "End-to-end technical production and drafting oversight." }
      ],
      PT: [
        { label: `Ciclos de Revisão Acelerados:`, desc: "Prazos ágeis para manter seus projetos ativos em andamento." },
        { label: `Escalabilidade Sob Demanda:`, desc: `Capacidade técnica imediata para absorver aumentos repentinos de volume.` },
        { label: `Fluxos Técnicos Padronizados:`, desc: `Integração de arquivos alinhada aos padrões gráficos americanos.` },
        { label: `Gestão de Layout e Projetos Complexos:`, desc: `Produção técnica e supervisão de desenho de ponta a ponta.` }
      ]
    },
    output: { EN: `CONSULTATIVE EXTENSION`, PT: `EXTENSÃO CONSULTIVA` },
    deliverables: {
      EN: `White-Label Integration | Time-Zone Advantage`,
      PT: `Integração White-Label | Vantagem de Fuso Horário`
    }
  }
];

export default function Services() {

  const { lang } = useAppContext();













  return (
    <PageTransition variant="default">
      <div className="lp-root services-page-root">
        <div className="radial-glow"></div>
        <div className="radial-glow-navy"></div>
        <Navbar />

        <main className="independent-page">
          {/* Editorial Header Section */}
          <header className="editorial-header animate-float-up">
            {/* Top Divider */}
            <div className="preview-header">
              <h2 className="preview-title">{lang === "EN" ? "(01) CAPABILITIES" : "(01) CAPACIDADES"}</h2>
              <div className="preview-line"></div>
            </div>

            {/* Main Content */}
            <div className="editorial-content">
              <h1 className="editorial-title" style={{ display: 'flex', flexDirection: 'column' }}>
                {lang === "EN" ? (
                  <>
                    <span>Specialized</span>
                    <span className="editorial-title-italic">Technical Support</span>
                  </>
                ) : (
                  <>
                    <span>Suporte</span>
                    <span className="editorial-title-italic">Técnico Especializado</span>
                  </>
                )}
              </h1>
              <p className="editorial-subtitle">
                {lang === "EN"
                  ? `DARA Studio operates as a seamless technical extension for U.S. builders, developers and architects. We transform complex project demands into precise, permit-ready documentation so you scale your operation without the overhead.`
                  : `O DARA Studio atua como uma extensão técnica integrada para construtores, incorporadores e arquitetos nos EUA. Transformamos demandas complexas de projetos em documentação precisa e pronta para aprovação para que você escale sua operação sem os custos fixos.`}
              </p>
            </div>

            {/* Bottom Divider */}
            <div className="preview-header">
              <h2 className="preview-title">{lang === "EN" ? "(A) CORE PACKAGES" : "(A) PACOTES PRINCIPAIS"}</h2>
              <div className="preview-line"></div>
            </div>
          </header>

          {/* Core Packages List */}
          <section className="core-packages-list">
            {SERVICES_DATA.slice(0, 4).map((service, idx) => (
              <div key={service.id} className="core-package-row animate-float-up" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                <div className="core-package-left">
                  <h2 className="package-number-large">0{idx + 1}</h2>
                  <div className="package-meta-block">
                    <span className="package-meta-label">{service.badge[lang].split('·')[0]}</span>
                    <span className="package-meta-value">{service.badge[lang].split('|')[1]?.trim() || ''}</span>
                  </div>
                  {service.output && (
                    <div className="package-meta-block" style={{ marginTop: 16 }}>
                      <span className="package-meta-label">OUTPUT</span>
                      <span className="package-meta-value">{typeof service.output === 'string' ? service.output.replace('OUTPUT: ', '').replace('Output: ', '') : service.output[lang].replace('OUTPUT: ', '').replace('SAÍDA: ', '')}</span>
                    </div>
                  )}
                  {service.tools && (
                    <div className="package-meta-block" style={{ marginTop: 16 }}>
                      <span className="package-meta-label">COMPATIBLE</span>
                      <span className="package-meta-value">{service.tools}</span>
                    </div>
                  )}
                  {service.deliverables && (
                    <div className="package-meta-block" style={{ marginTop: 16 }}>
                      <span className="package-meta-label">DELIVERABLES</span>
                      <span className="package-meta-value">{service.deliverables[lang]}</span>
                    </div>
                  )}
                </div>
                <div className="core-package-right">
                  <h3 className="package-title-large">{service.title[lang]}</h3>
                  <p className="package-desc-large">{service.desc[lang]}</p>

                  {service.bentoExtras ? (
                    <>
                      <p style={{ fontSize: 10, letterSpacing: '.15em', opacity: 0.5, marginTop: 16, textTransform: 'uppercase', fontFamily: "'Century Gothic', monospace" }}>
                        {lang === "EN" ? "DESIGN EXTRAS — CUSTOMIZABLE PER PROJECT" : "COMPLEMENTOS DE PROJETO — PERSONALIZÁVEIS POR OBRA"}
                      </p>
                      <div className="package-extras-grid">
                        {service.bentoExtras[lang].map((bento, i) => (
                          <div key={i} className="package-extra-card">
                            <h4 className="package-extra-title">{bento.title}</h4>
                            <p className="package-extra-desc">{bento.desc}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginTop: 16 }}>
                      <div>
                        <p style={{ fontSize: 10, letterSpacing: '.15em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase', fontFamily: "'Century Gothic', monospace" }}>
                          {lang === "EN" ? "WHAT'S INCLUDED" : "O QUE ESTÁ INCLUSO"}
                        </p>
                        {service.list && service.list[lang].map((item, i) => (
                          <div key={i} className="support-list-item">
                            <span className="support-list-bullet">▪</span>
                            <span className="support-list-text">
                              {typeof item === 'string' ? item : (
                                <><strong style={{ color: 'var(--text-color)' }}>{item.label}</strong> {item.desc}</>
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      {service.notIncluded && (
                        <div>
                          <p style={{ fontSize: 10, letterSpacing: '.15em', opacity: 0.5, marginBottom: 16, textTransform: 'uppercase', fontFamily: "'Century Gothic', monospace" }}>
                            {lang === "EN" ? "NOT INCLUDED" : "NÃO INCLUSO"}
                          </p>
                          {service.notIncluded[lang].map((item, i) => (
                            <div key={i} className="support-list-item" style={{ opacity: 0.5 }}>
                              <span className="support-list-bullet" style={{ color: 'var(--text-color)' }}>—</span>
                              <span className="support-list-text">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {service.disclaimer && (
                    <div className="package-disclaimer">
                      {service.disclaimer[lang]}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Additional Support Divider */}
          <header className="editorial-header" style={{ paddingBottom: 0, paddingTop: 40, marginBottom: 40 }}>
            <div className="preview-header">
              <h2 className="preview-title">{lang === "EN" ? "(B) ADDITIONAL SUPPORT" : "(B) SUPORTE ADICIONAL"}</h2>
              <div className="preview-line"></div>
            </div>
          </header>

          {/* Additional Support Grid */}
          <section className="additional-support-grid">
            {SERVICES_DATA.slice(4).map((service, idx) => (
              <div key={service.id} className="support-card animate-float-up" style={{ animationDelay: `${(idx + 1) * 100}ms` }}>
                <span className="support-card-badge">
                  {service.badge ? service.badge[lang].split('·')[0].trim() : (service.isUS ? 'US STANDARD' : 'CORPORATE · B2B')}
                </span>
                <h3 className="support-card-title">{service.title[lang]}</h3>
                <p className="support-card-desc">{service.desc[lang]}</p>

                <div style={{ flex: 1 }}>
                  {service.list && service.list[lang].map((item, i) => (
                    <div key={i} className="support-list-item">
                      <span className="support-list-bullet">▪</span>
                      <span className="support-list-text">
                        {typeof item === 'string' ? item : (
                          <><strong style={{ color: 'var(--text-color)' }}>{item.label}</strong> {item.desc}</>
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="support-card-meta">
                  {service.output && (
                    <div className="support-meta-row">
                      <span className="support-meta-label">OUTPUT</span>
                      <span className="support-meta-value">{typeof service.output === 'string' ? service.output.replace('Output: ', '').replace('Standards: ', '') : service.output[lang].replace('SAÍDA: ', '').replace('OUTPUT: ', '')}</span>
                    </div>
                  )}
                  {service.tools && (
                    <div className="support-meta-row">
                      <span className="support-meta-label">COMPATIBLE</span>
                      <span className="support-meta-value">{service.tools}</span>
                    </div>
                  )}
                  {service.deliverables && (
                    <div className="support-meta-row">
                      <span className="support-meta-label">DELIVERABLES</span>
                      <span className="support-meta-value">{service.deliverables[lang]}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>


        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
