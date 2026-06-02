import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import { useAppContext } from '../context/AppContext';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';

/* ── Icons ── */
const Icons = {
  Clipboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
  ),
  Eye: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Edit: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
  ),
  FileText: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  ),
  Target: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  ),
  Layers: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
  ),
  Package: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
  ),
  Clock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  ),
  Shield: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  MessageCircle: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  ChevronDown: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
  ),
};

/* ── Data ── */
const STEPS = [
  {
    num: 1,
    icon: <Icons.Clipboard />,
    title: { EN: "Proposal Approval", PT: "Aprovação da Proposta" },
    summary: { EN: "Project scope and pricing are confirmed.", PT: "Escopo e preços do projeto são confirmados." },
    body: {
      EN: "During this phase, we finalize all project parameters including scope of work, deliverables, timeline estimates, and pricing. You'll receive a detailed proposal document outlining exactly what's included. Once approved and signed, we proceed with the initial deposit to secure your project slot in our production schedule. This ensures complete alignment between your expectations and our deliverables before any design work begins.",
      PT: "Nesta fase, finalizamos todos os parâmetros do projeto incluindo escopo, entregas, prazos e preços. Você receberá um documento detalhado descrevendo exatamente o que está incluso. Após aprovação e assinatura, procedemos com o depósito inicial para garantir sua vaga em nosso cronograma. Isso assegura alinhamento completo entre suas expectativas e nossas entregas antes de qualquer trabalho de design começar."
    }
  },
  {
    num: 2,
    icon: <Icons.Eye />,
    badge: { EN: "8–16 Business Days", PT: "8–16 Dias Úteis" },
    title: { EN: "Design Preview", PT: "Prévia do Design" },
    summary: { EN: "Initial layout and visual direction are delivered for review.", PT: "Layout inicial e direção visual são entregues para sua revisão." },
    note: {
      EN: "Timeline starts from receipt of required project information, including proposal approval, initial payment, and site or existing residence documentation. Timeline may vary depending on project complexity and availability of required information.",
      PT: "O prazo começa a partir do recebimento de todas as informações necessárias do projeto, incluindo aprovação da proposta, pagamento inicial e documentação do terreno ou residência existente. O prazo pode variar dependendo da complexidade do projeto e disponibilidade das informações."
    },
    body: {
      EN: "Our design team develops the initial conceptual layouts based on your project requirements, site conditions, and design preferences. This includes preliminary floor plans, spatial organization, and overall design direction. You'll receive visual presentations showing how spaces come together and how the design addresses your specific needs. This is your first opportunity to visualize the project concept before we proceed to detailed documentation.",
      PT: "Nossa equipe de design desenvolve os layouts conceituais iniciais com base nos requisitos do seu projeto, condições do terreno e preferências de design. Isso inclui plantas baixas preliminares, organização espacial e direção geral de design. Você receberá apresentações visuais mostrando como os espaços se integram e como o design atende às suas necessidades específicas. Esta é sua primeira oportunidade de visualizar o conceito do projeto antes de prosseguirmos para a documentação detalhada."
    }
  },
  {
    num: 3,
    icon: <Icons.Edit />,
    title: { EN: "Revisions Phase", PT: "Fase de Revisões" },
    summary: { EN: "Two (2) to three (3) revision rounds are included to refine layout and design intent, depending on the selected package.", PT: "De duas (2) a três (3) rodadas de revisão estão incluídas para refinar layout e intenção do design, dependendo do pacote selecionado." },
    note: {
      EN: "Additional revisions beyond the included rounds are billed at $95/hour of technical work.",
      PT: "Revisões adicionais além das rodadas incluídas são cobradas a $95/hora de trabalho técnico."
    },
    body: {
      EN: "Collaboration is key to a successful project. During this phase, we work closely with you to refine the design based on your feedback. Each revision round allows for adjustments to room sizes, layout configurations, window placements, and overall flow. We document all requested changes and implement them systematically. If additional revisions beyond the included rounds are needed, we offer flexible options to accommodate your evolving vision.",
      PT: "Colaboração é a chave para um projeto bem-sucedido. Nesta fase, trabalhamos em estreita colaboração com você para refinar o design com base no seu feedback. Cada rodada de revisão permite ajustes em tamanhos de cômodos, configurações de layout, posicionamento de janelas e fluxo geral. Documentamos todas as alterações solicitadas e as implementamos sistematicamente. Se forem necessárias revisões adicionais além das rodadas incluídas, oferecemos opções flexíveis para acomodar sua visão em evolução."
    }
  },
  {
    num: 4,
    icon: <Icons.FileText />,
    badge: { EN: "25–30 Business Days After Approval", PT: "25–30 Dias Úteis Após Aprovação" },
    title: { EN: "Final Drawing Set", PT: "Conjunto de Desenhos Final" },
    summary: { EN: "Complete architectural drawing package is delivered in digital format.", PT: "Pacote completo de desenhos arquitetônicos é entregue em formato digital." },
    note: {
      EN: "Timeline may vary depending on project complexity, requested revisions, and technical coordination during project development.",
      PT: "O prazo pode variar dependendo da complexidade do projeto, revisões solicitadas e coordenação técnica durante o desenvolvimento do projeto."
    },
    body: {
      EN: "Once the design preview is approved, our team develops the complete construction documentation package. This includes detailed floor plans with dimensions, exterior elevations, building sections, door and window schedules, and all key details needed for permit submission and construction. All drawings are prepared according to U.S. residential drafting standards and delivered in industry-standard digital formats (PDF).",
      PT: "Após a aprovação da prévia de design, nossa equipe desenvolve o pacote completo de documentação para construção. Isso inclui plantas baixas detalhadas com dimensões, elevações externas, cortes do edifício, tabelas de portas e janelas, e todos os detalhes necessários para submissão de alvará e construção. Todos os desenhos são preparados de acordo com os padrões de desenho residencial dos EUA e entregues em formatos digitais padrão da indústria (PDF)."
    }
  },
  {
    num: 5,
    icon: <Icons.MessageCircle />,
    title: { EN: "Ongoing Coordination", PT: "Coordenação Contínua" },
    summary: { EN: "We provide remote support and coordination via WhatsApp and our client portal.", PT: "Oferecemos suporte remoto e coordenação via WhatsApp e nosso portal do cliente." },
    body: {
      EN: "Our commitment doesn't end with drawing delivery. We remain available to answer questions from your construction team, clarify design intent, and coordinate with licensed engineers when structural modifications require professional stamp. Whether it's explaining a detail to your contractor or making minor adjustments during construction, we're here to ensure smooth project execution from documentation through completion.",
      PT: "Nosso compromisso não termina com a entrega dos desenhos. Permanecemos disponíveis para responder perguntas da sua equipe de obra, esclarecer a intenção do design e coordenar com engenheiros licenciados quando modificações estruturais exigem carimbo profissional. Seja para explicar um detalhe ao seu empreiteiro ou fazer ajustes menores durante a construção, estamos aqui para garantir a execução tranquila do projeto, da documentação até a conclusão."
    }
  },
];

/* ── Steps Group B (after scope cards) ── */
const STEPS_B = [
  {
    num: 6,
    icon: <Icons.Package />,
    title: { EN: "Available Formats", PT: "Formatos Disponíveis" },
    summary: { EN: "Drawings delivered in industry-standard digital formats.", PT: "Desenhos entregues em formatos digitais padrão da indústria." },
    badges: ["PDF", "DWG (AutoCAD)", "Chief Architect (.plan)"],
    body: {
      EN: "All deliverables are provided in high-resolution PDF for easy viewing and printing, plus native DWG files for full CAD compatibility. If your project was modeled in Chief Architect, you'll also receive the native .plan file. Additional format exports (DXF, SKP, etc.) are available upon request.",
      PT: "Todas as entregas são fornecidas em PDF de alta resolução para fácil visualização e impressão, além de arquivos DWG nativos para total compatibilidade CAD. Se seu projeto foi modelado em Chief Architect, você também receberá o arquivo .plan nativo. Exportações adicionais (DXF, SKP, etc.) estão disponíveis mediante solicitação."
    }
  },
  {
    num: 7,
    icon: <Icons.Clock />,
    title: { EN: "Realistic Timelines", PT: "Prazos Realistas" },
    summary: { EN: "We commit to deadlines we can deliver — no false promises.", PT: "Nos comprometemos com prazos que podemos cumprir — sem falsas promessas." },
    body: {
      EN: "Our timelines are calculated based on real production capacity and project complexity. We don't promise unrealistic turnarounds to win projects. If we say 25–30 business days, that's a commitment backed by our production workflow. Rush delivery options are available for time-sensitive projects with adjusted pricing communicated upfront.",
      PT: "Nossos prazos são calculados com base na capacidade real de produção e complexidade do projeto. Não prometemos prazos irreais para ganhar projetos. Se dizemos 25–30 dias úteis, é um compromisso respaldado pelo nosso fluxo de produção. Opções de entrega urgente estão disponíveis para projetos sensíveis ao tempo com preços ajustados comunicados antecipadamente."
    }
  },

];

/* ── Scope Cards Data ── */
const SCOPE_INCLUDED = {
  EN: {
    title: "What's Included",
    desc: "Our services focus on architectural design development and drawing documentation. Depending on the selected package, deliverables may include:",
    items: [
      "Architectural floor plans",
      "Exterior elevations",
      "Basic building sections",
      "Interior layout planning",
      "Kitchen and bathroom layouts",
      "Fixture and equipment placement",
      "Door and window schedules",
      "Dimensioned construction drawings (for permit submission when applicable)",
      "3D visualization (if included in selected package)",
    ],
    note: "All drawings are prepared in accordance with standard U.S. residential drafting practices."
  },
  PT: {
    title: "O Que Está Incluído",
    desc: "Nossos serviços focam no desenvolvimento de design arquitetônico e documentação de desenhos. Dependendo do pacote selecionado, as entregas podem incluir:",
    items: [
      "Plantas baixas arquitetônicas",
      "Elevações externas",
      "Cortes básicos do edifício",
      "Planejamento de layout interno",
      "Layouts de cozinha e banheiro",
      "Posicionamento de equipamentos e fixtures",
      "Tabelas de portas e janelas",
      "Desenhos de construção dimensionados (para submissão de alvará quando aplicável)",
      "Visualização 3D (se inclusa no pacote selecionado)",
    ],
    note: "Todos os desenhos são preparados de acordo com práticas padrão de desenho residencial dos EUA."
  }
};

const SCOPE_NOT_INCLUDED = {
  EN: {
    title: "What's Not Included",
    desc: "To maintain clarity and compliance, the following services are not part of our scope unless explicitly contracted:",
    items: [
      "Structural engineering calculations",
      "Engineer stamp or sealed drawings",
      "Load diagrams or structural reinforcement detailing",
      "Full electrical system design",
      "Full plumbing system design (we indicate fixture locations only)",
      "Mechanical / HVAC design",
      "Site surveys, plot plans, or topographic mapping",
      "Soil testing or geotechnical reports",
      "Energy compliance reports (HERS, blower door, etc.)",
      "In-person site visits or inspections",
      "Material procurement or interior décor shopping lists",
    ],
    note: "When required, licensed professionals must be hired locally by the client."
  },
  PT: {
    title: "O Que Não Está Incluído",
    desc: "Para manter clareza e conformidade, os seguintes serviços não fazem parte do nosso escopo, salvo contratação explícita:",
    items: [
      "Cálculos de engenharia estrutural",
      "Carimbo de engenheiro ou desenhos selados",
      "Diagramas de carga ou detalhamento de reforço estrutural",
      "Projeto elétrico completo",
      "Projeto hidráulico completo (indicamos apenas localização de fixtures)",
      "Projeto mecânico / HVAC",
      "Levantamentos topográficos ou plantas de situação",
      "Ensaios de solo ou relatórios geotécnicos",
      "Relatórios de conformidade energética (HERS, blower door, etc.)",
      "Visitas presenciais ao local ou inspeções",
      "Compra de materiais ou listas de decoração de interiores",
    ],
    note: "Quando necessário, profissionais licenciados devem ser contratados localmente pelo cliente."
  }
};

const WHY_DARA = [
  { 
    title: { EN: "Code-conscious documentation", PT: "Documentação voltada a normas" }, 
    desc: { EN: "All drawings aligned with IRC, IBC, and NBR standards.", PT: "Todos os desenhos alinhados com as normas IRC, IBC e NBR." } 
  },
  { 
    title: { EN: "Builder-friendly drawing sets", PT: "Projetos focados na execução" }, 
    desc: { EN: "Practical, clear, and ready for the job site.", PT: "Práticos, claros e prontos para a obra." } 
  },
  { 
    title: { EN: "Efficient turnaround", PT: "Prazos de entrega eficientes" }, 
    desc: { EN: "Structured workflow with defined delivery milestones.", PT: "Fluxo de trabalho estruturado com marcos de entrega definidos." } 
  },
  { 
    title: { EN: "Clear scope and professional boundaries", PT: "Escopo e limites profissionais claros" }, 
    desc: { EN: "No surprises — you know exactly what's included.", PT: "Sem surpresas — você sabe exatamente o que está incluído." } 
  },
  { 
    title: { EN: "Trusted by developers and construction teams", PT: "Aprovado por incorporadores e construtores" }, 
    desc: { EN: "Serving clients across the United States and Brazil.", PT: "Atendendo clientes em todos os Estados Unidos e Brasil." } 
  },
  { 
    title: { EN: "Remote-first digital workflow", PT: "Fluxo de trabalho 100% remoto" }, 
    desc: { EN: "All coordination via WhatsApp and our client portal.", PT: "Toda a coordenação é feita via WhatsApp e portal do cliente." } 
  }
];

/* ── Scope Section ── */
function ScopeSection({ data, type, lang }) {
  const isIncluded = type === 'included';
  const iconColor = isIncluded ? 'var(--color-neon-purple)' : '#E91E63';
  const bgBox = isIncluded ? 'rgba(123, 31, 162, 0.05)' : 'rgba(233, 30, 99, 0.05)';
  const borderBox = isIncluded ? 'rgba(123, 31, 162, 0.2)' : 'rgba(233, 30, 99, 0.2)';
  const borderLine = isIncluded ? 'rgba(123, 31, 162, 0.15)' : 'rgba(233, 30, 99, 0.15)';

  return (
    <div className="animate-float-up" style={{ width: '100%', margin: '0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <span style={{ color: iconColor }}>
          {isIncluded ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          )}
        </span>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFFFFF', margin: 0, fontWeight: 400 }}>
          {data.title}
        </h3>
      </div>
      
      <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
        {data.desc}
      </p>

      <div style={{ background: bgBox, border: `1px solid ${borderBox}`, borderRadius: '8px', marginBottom: '16px' }}>
        <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
          {data.items.map((item, i, arr) => (
            <li key={i} style={{ 
              padding: '14px 16px', 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: '12px', 
              fontSize: '14px', 
              color: 'var(--text-color)', 
              opacity: 0.9, 
              lineHeight: '1.4',
              borderBottom: i < arr.length - 1 ? `1px solid ${borderLine}` : 'none'
            }}>
              {isIncluded ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              )}
              {item}
            </li>
          ))}
        </ul>
      </div>

      <p style={{ fontStyle: 'italic', margin: '0', opacity: 0.5, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-color)' }}>
        {data.note}
      </p>
    </div>
  );
}

/* ── Page ── */
export default function HowWeWork() {
  const { lang, openVera } = useAppContext();
  const navigate = useNavigate();
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
    navigate('/estimate');
  };

  return (
    <PageTransition variant="fade">
      <div className="lp-root services-page-root">
        <Navbar />
        <main className="independent-page">

          {/* Header */}
          <header className="page-header-premium animate-float-up">
            <h1 className="page-main-title">
              {lang === "EN" ? (
                <>
                  <span className="title-white">Project</span>{" "}
                  <span className="title-gradient-italic">Process & Scope</span>
                </>
              ) : (
                <>
                  <span className="title-gradient-italic">Processo</span>{" "}
                  <span className="title-white">& Escopo Profissional</span>
                </>
              )}
            </h1>
            <p className="page-subtitle-standard">
              {lang === "EN"
                ? "We follow a structured, efficient, and fully remote workflow — designed for builders, developers, and serious homeowners. All coordination is handled via WhatsApp and our client portal."
                : "Seguimos um fluxo de trabalho estruturado, eficiente e totalmente remoto — projetado para construtores, incorporadores e proprietários exigentes. Toda a coordenação é feita via WhatsApp e nosso portal do cliente."}
            </p>
          </header>

          {/* Steps Carousel */}
          <div className="services-carousel-wrap">
            <button className="carousel-arrow left" onClick={() => scroll('left')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="carousel-arrow right" onClick={() => scroll('right')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            
            <div 
              className="services-grid carousel" 
              ref={scrollRef} 
              onScroll={handleScroll}
            >
              {STEPS.map((step, idx) => (
                <div 
                  key={step.num} 
                  className={`service-card-premium animate-float-up ${activeIdx === idx ? 'active' : ''}`}
                  style={{ animationDelay: `${(idx + 1) * 50}ms` }}
                >
                  <div className="service-icon-box">
                    {step.icon}
                  </div>
                  <h3 className="service-title">
                    {step.num}. {step.title[lang]}
                  </h3>
                  <p className="service-desc">{step.summary[lang]}</p>
                  
                  <p className="service-desc" style={{ marginTop: '-8px' }}>
                    {step.body[lang]}
                  </p>

                  {step.list && (
                    <ul className="service-list">
                      {step.list[lang].map((item, i) => (
                        <li key={i} className="service-list-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.badge && (
                    <div className="service-output-badge" style={{ marginTop: 'auto' }}>
                      {step.badge[lang]}
                    </div>
                  )}

                  {step.note && (
                    <div className="service-footer-info" style={{ marginTop: !step.badge ? 'auto' : '0' }}>
                      <div className="service-extra-info" style={{ fontStyle: 'italic' }}>
                        {step.note[lang]}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scope Sections — What's Included / Not Included */}
          <div className="hww-scope-section animate-float-up" style={{ animationDelay: '200ms', margin: '80px auto 0', maxWidth: '860px' }}>
            <ScopeSection data={SCOPE_INCLUDED[lang]} type="included" lang={lang} />
            <ScopeSection data={SCOPE_NOT_INCLUDED[lang]} type="excluded" lang={lang} />
          </div>

          {/* Compliance & Responsibility (Standalone) */}
          <div className="animate-float-up" style={{ animationDelay: '270ms', width: '100%', maxWidth: '860px', margin: '80px auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--color-neon-purple)' }}><Icons.Shield /></span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFFFFF', margin: 0, fontWeight: 400 }}>
                {lang === 'EN' ? "Compliance & Responsibility" : "Conformidade e Responsabilidade"}
              </h3>
            </div>
            
            <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
              {lang === 'EN' 
                ? "Our drawings are intended for design development and permit documentation support. Final approval is subject to review by local authorities and licensed engineers, when required by state or municipal regulations." 
                : "Nossos desenhos são destinados ao desenvolvimento do projeto e suporte à documentação de alvará. A aprovação final está sujeita à revisão por autoridades locais e engenheiros licenciados, quando exigido pelas regulamentações estaduais ou municipais."}
            </p>

            <div style={{ background: 'rgba(123, 31, 162, 0.05)', border: '1px solid rgba(123, 31, 162, 0.2)', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(123, 31, 162, 0.2)', fontWeight: '700', fontSize: '14px', color: 'var(--color-neon-purple)' }}>
                {lang === 'EN' ? "The client is responsible for:" : "O cliente é responsável por:"}
              </div>
              <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                {[
                  lang === 'EN' ? "Hiring licensed structural engineers (if required)" : "Contratar engenheiros estruturais licenciados (se exigido)",
                  lang === 'EN' ? "Coordinating required technical reports" : "Coordenar relatórios técnicos necessários",
                  lang === 'EN' ? "Verifying local zoning and code restrictions" : "Verificar restrições de zoneamento e código local"
                ].map((item, i, arr) => (
                  <li key={i} style={{ 
                    padding: '14px 16px', 
                    display: 'flex', 
                    alignItems: 'flex-start', 
                    gap: '12px', 
                    fontSize: '14px', 
                    color: 'var(--text-color)', 
                    opacity: 0.9, 
                    lineHeight: '1.4',
                    borderBottom: i < arr.length - 1 ? '1px solid rgba(123, 31, 162, 0.15)' : 'none'
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <p style={{ fontStyle: 'italic', margin: '0 0 32px 0', opacity: 0.5, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-color)' }}>
              {lang === 'EN' 
                ? "We design in alignment with U.S. residential construction standards; however, final compliance depends on local jurisdiction requirements." 
                : "Projetamos em alinhamento com os padrões de construção residencial dos EUA; no entanto, a conformidade final depende dos requisitos da jurisdição local."}
            </p>
          </div>

          {/* Meetings & Communication (Standalone) */}
          <div className="animate-float-up" style={{ animationDelay: '280ms', width: '100%', maxWidth: '860px', margin: '80px auto 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--color-neon-purple)' }}><Icons.MessageCircle /></span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFFFFF', margin: 0, fontWeight: 400 }}>
                {lang === 'EN' ? "Meetings & Communication" : "Reuniões e Comunicação"}
              </h3>
            </div>
            
            <p style={{ color: 'var(--text-color)', opacity: 0.8, fontSize: '15px', marginBottom: '16px', lineHeight: '1.6' }}>
              {lang === 'EN' ? "DA·RA Studio operates 100% remotely with a structured digital workflow." : "O DA·RA Studio opera 100% remotamente com um fluxo de trabalho digital estruturado."}
            </p>

            <div style={{ background: 'rgba(123, 31, 162, 0.08)', border: '1px solid rgba(123, 31, 162, 0.15)', borderRadius: '8px', padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '2px', flexShrink: 0 }}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <p style={{ margin: 0, color: 'var(--text-color)', fontSize: '14px', lineHeight: '1.5', opacity: 0.9 }}>
                {lang === 'EN' ? "We do not offer video calls or in-person meetings. All project coordination is handled exclusively via WhatsApp and our Client Portal." : "Não oferecemos chamadas de vídeo ou reuniões presenciais. Toda a coordenação do projeto é feita exclusivamente via WhatsApp e nosso Portal do Cliente."}
              </p>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
              <div className="hww-comm-grid">
                {[
                  lang === 'EN' ? "Full online project management" : "Gestão de projeto totalmente online",
                  lang === 'EN' ? "Direct communication via WhatsApp during business hours" : "Comunicação direta via WhatsApp em horário comercial",
                  lang === 'EN' ? "Continuous updates throughout each phase" : "Atualizações contínuas em cada fase",
                  lang === 'EN' ? "Client portal access for files, timelines, and invoices" : "Acesso ao portal do cliente para arquivos, prazos e faturas"
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <span style={{ fontSize: '14px', color: 'var(--text-color)', opacity: 0.9, lineHeight: '1.4' }}>{item}</span>
                  </div>
                ))}
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-color)', opacity: 0.5, fontStyle: 'italic' }}>
                {lang === 'EN' ? "We have proudly supported builders and investors across multiple U.S. states." : "Apoiamos com orgulho construtores e investidores em vários estados dos EUA."}
              </p>
            </div>
          </div>

          {/* Why DARA Studio */}
          <div className="animate-float-up" style={{ animationDelay: '290ms', width: '100%', maxWidth: '860px', margin: '80px auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span style={{ color: 'var(--color-neon-purple)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              </span>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: '#FFFFFF', margin: 0, fontWeight: 400 }}>
                Why DA·RA Studio
              </h3>
            </div>

            <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
              <div className="hww-comm-grid" style={{ marginBottom: 0 }}>
                {WHY_DARA.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: '3px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12"/></svg>
                    <div>
                      <span style={{ fontSize: '14px', color: 'var(--text-color)', opacity: 0.9, lineHeight: '1.4', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                        {item.title[lang]}
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--text-color)', opacity: 0.6, lineHeight: '1.4' }}>
                        {item.desc[lang]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="hww-cta-section animate-float-up" style={{ animationDelay: '300ms', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '80px', padding: '40px 20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '24px', maxWidth: '860px', margin: '0 auto 80px' }}>
            <h2 className="page-main-title" style={{ fontSize: '36px', marginBottom: '16px' }}>
              {lang === 'EN' ? 'Request a Free Quote' : 'Solicite um Orçamento Gratuito'}
            </h2>
            <p className="page-subtitle-standard" style={{ marginBottom: '32px', maxWidth: '600px' }}>
              {lang === 'EN' 
                ? 'Tell us about your project. Receive a personalized proposal within 2–3 business days.' 
                : 'Fale-nos sobre o seu projeto. Receba uma proposta personalizada em 2 a 3 dias úteis.'}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-glow" onClick={handleStartProject} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 28px', fontSize: '14px', letterSpacing: '0.1em' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                {lang === 'EN' ? 'REQUEST A FREE QUOTE' : 'SOLICITAR ORÇAMENTO'}
              </button>
              <a href={`https://wa.me/5548996503350?text=${encodeURIComponent(lang === 'EN' ? "Hi DA·RA Studio! I would like to request a free quote." : "Olá DA·RA Studio! Gostaria de solicitar um orçamento gratuito.")}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                <button style={{ 
                  background: 'transparent', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: '#FFFFFF', 
                  padding: '14px 28px', 
                  borderRadius: '100px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--color-neon-purple)'; e.currentTarget.style.color = 'var(--color-neon-purple)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#FFFFFF'; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  WHATSAPP
                </button>
              </a>
            </div>
          </div>

        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

