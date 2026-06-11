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
  XIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Star: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
  ),
};

/* ── Data ── */
const STEPS = [
  {
    num: "00",
    icon: <Icons.Layers />,
    title: { EN: "Solutions & Engagement Model", PT: "Nossos Serviços & Modelos de Engajamento" },
    summary: { EN: "Definition of the engagement model.", PT: "Definição do modelo de engajamento." },
    body: {
      EN: "Select the precise architectural support or documentation package that aligns with your pipeline’s current demand. Our specialized capability acts as an extension of your team, whether you need high-volume Chief Architect X17 conversions from PDFs or sketches, regulatory Permit Sets, or highly detailed executive documentation. We recommend reviewing our full capabilities in the Specialization section under the What We Do menu to optimize and calibrate your scope before initiating production.",
      PT: "Escolha o pacote ou o suporte técnico pontual que melhor atenda ao volume e à velocidade atual da sua empresa. Nosso catálogo completo de soluções foi estruturado para dar escala à sua operação, incluindo desde conversões de arquivos para Chief Architect X17 até a aprovação de projetos como Permit Sets e documentação executiva de alta complexidade. Recomendamos consultar nossa matriz técnica na aba de Especialização dentro do menu What We Do para calibrar o escopo ideal antes de iniciar o fluxo de trabalho."
    },
    cta: {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
      label: { EN: "EXPLORE CAPABILITIES & SERVICES", PT: "VER CATÁLOGO DE SERVIÇOS" },
      path: "/services"
    }
  },
  {
    num: "01",
    icon: <Icons.MessageCircle />,
    title: { EN: "Initial Consultation", PT: "Primeiro Contato" },
    summary: { EN: "Start with what you have.", PT: "Comece com o que você tem em mãos." },
    body: {
      EN: "You don't need a finalized blueprint to get moving. A preliminary sketch, visual references, or a clear objective is more than enough for our team to understand your requirements and build a precise project scope.",
      PT: "Você não precisa chegar com um projeto definitivo ou perfeito para iniciar o fluxo. Um croqui preliminar, referências visuais ou um direcionamento claro já são suficientes para compreendermos a sua demanda e estruturarmos um escopo assertivo."
    },
    list: {
      EN: [
        <><strong>Reference Images —</strong> Visual concepts, style directions, and your desired finishes.</>,
        <><strong>Site Information —</strong> Property photos, topographical data, or simply the project address.</>,
        <><strong>Sketches or Drafts —</strong> Hand-drawn concepts or preliminary spatial zoning ideas.</>,
        <><strong>Existing Documentation —</strong> Prior surveys, old files, or existing floor plans in PDF.</>,
        <><strong>Plot Plan or Existing Layout —</strong> Site documentation that significantly accelerates our technical workflow.</>,
        <><strong>Intended Scope —</strong> A brief description of your goals, whether it is a remodel, a new build, an addition, or specialized drafting support.</>
      ],
      PT: [
        <><strong>Imagens de Referência —</strong> Conceitos visuais, referências de estilo e os acabamentos que você deseja.</>,
        <><strong>Informações do Terreno —</strong> Fotos do local, dados topográficos ou simplesmente o endereço da propriedade.</>,
        <><strong>Croquis ou Esboços —</strong> Desenhos à mão livre ou zoneamentos espaciais preliminares.</>,
        <><strong>Levantamentos Anteriores —</strong> Plantas existentes em PDF, imagens ou arquivos antigos que você já possua.</>,
        <><strong>Plot Plan ou Implantação Existente —</strong> Documentação do lote que agiliza significativamente o nosso processo técnico.</>,
        <><strong>Escopo Pretendido —</strong> Uma breve descrição da sua demanda, seja ela uma reforma, construção nova, ampliação (addition) ou um suporte técnico específico.</>
      ]
    },
    note: {
      EN: <><strong>WHY THIS PHASE MATTERS:</strong> The more context you provide upfront, the more accurate our initial estimate will be. A realistic, well-founded estimate protects your budget against unexpected costs and establishes a solid foundation for every phase that follows.</>,
      PT: <><strong>POR QUE ESSA ETAPA IMPORTA:</strong> Quanto mais contexto você compartilhar de início, mais preciso será o seu estimate. Uma estimativa realista e bem fundamentada protege o seu orçamento contra custos inesperados e estabelece uma base sólida para todas as etapas seguintes.</>
    }
  },
  {
    num: "02",
    icon: <Icons.Eye />,
    title: { EN: "Scope & Estimate", PT: "Escopo & estimate" },
    summary: { EN: "You receive a comprehensive, itemized estimate.", PT: "Você recebe um estimate detalhado." },
    body: {
      EN: "We carefully analyze every piece of data you share to map out the actual structural and architectural needs of the project. Then, we provide a highly transparent proposal specifying the exact scope, clear delivery milestones, and payment terms.",
      PT: "Analisamos minuciosamente as informações enviadas para mapear as reais necessidades do projeto. Em seguida, estruturamos uma proposta transparente, especificando o escopo exato, cronograma de prazos e as condições de pagamento."
    },
    customLists: [
      {
        title: { EN: "WHAT YOUR ESTIMATE ALWAYS INCLUDES", PT: "SEU ESTIMATE SEMPRE INCLUI" },
        boxClass: "service-box-green",
        titleClass: "service-box-green-title",
        iconColor: "#10b981",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Fully dimensioned floor plans with comprehensive technical annotations",
            "Exterior elevations detailing all four main facades",
            "Highly detailed cross-sections and structural construction details",
            "Detailed window and door schedules",
            "Internal layouts with precise placement for all architectural fixtures and fixed finishes",
            "3D renderings customized to your selected package",
            "Wood Framing plans whenever applicable to the project scope",
            "A clear payment breakdown following our 40 / 40 / 20 milestone structure"
          ],
          PT: [
            "Plantas baixas com dimensionamentos e anotações técnicas",
            "Elevações externas — as quatro fachadas principais",
            "Cortes e seções construtivas detalhadas",
            "Schedules (quadros) de portas e janelas",
            "Layout interno e posicionamento de fixtures (peças e acabamentos fixos)",
            "Renders 3D (conforme o pacote selecionado)",
            "Plantas de Wood Framing (quando aplicável ao escopo)",
            "Estrutura de pagamento clara — modelo 40 / 40 / 20"
          ]
        }
      },
      {
        title: { EN: "SERVICES NOT INCLUDED — REQUIRE SEPARATE CONTRACTS", PT: "SERVIÇOS NÃO INCLUÍDOS — REQUEREM CONTRATOS SEPARADOS" },
        boxClass: "service-box-red",
        titleClass: "service-box-red-title",
        iconColor: "#ef4444",
        icon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
        items: {
          EN: [
            "Structural engineering calculations and professional engineering stamps (PE Stamp)",
            "MEP engineering plans covering electrical, plumbing, and HVAC systems",
            "Boundary and topographical land surveys",
            "Energy efficiency assessment reports such as HERS rating or Blower Door testing",
            "On-site technical visits or physical construction inspections",
            "Native editable project files including .plan from Chief Architect or .dwg, which can be made available upon a separate release fee"
          ],
          PT: [
            "Cálculo estrutural e assinatura/selo de engenharia (PE Stamp)",
            "Projetos complementares de Engenharia (Elétrico, Hidráulico e HVAC)",
            "Levantamento topográfico do terreno",
            "Relatórios de eficiência energética (como HERS rating ou Blower Door test)",
            "Visitas técnicas presenciais ou inspeções de obra",
            "Fornecimento de arquivos editáveis nativos (como .plan ou .dwg) — disponíveis mediante taxa de liberação"
          ]
        }
      }
    ],
    note: {
      EN: <><strong>WHY THIS PHASE MATTERS:</strong> The estimate serves as our commercial roadmap and your ultimate consumer protection. It draws a clear line around what is included and what sits outside the scope, alongside the precise cost of each milestone. At DARA Studio, we eliminate verbal agreements by documenting every technical alignment before production begins.</>,
      PT: <><strong>POR QUE ESSA ETAPA IMPORTA:</strong> O estimate atua como nossa diretriz comercial e a sua segurança. Ele delimita com precisão o que está contemplado e o que está descontinuado do escopo, além do custo de cada fase. No DARA Studio, eliminamos acordos verbais — documentamos cada alinhamento antes de iniciar a produção técnica.</>
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
  {
    num: 6,
    icon: <Icons.Package />,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.1)",
    listIconColor: "#10b981",
    title: { EN: "What's Included", PT: "O Que Está Incluído" },
    summary: { EN: "Depending on the selected package, deliverables may include:", PT: "Dependendo do pacote selecionado, as entregas podem incluir:" },
    list: {
      EN: [
        "Architectural floor plans & Exterior elevations",
        "Basic building sections & Interior layout planning",
        "Kitchen and bathroom layouts",
        "Fixture and equipment placement",
        "Door and window schedules",
        "Dimensioned construction drawings",
        "3D visualization (if included)"
      ],
      PT: [
        "Plantas baixas arquitetônicas & Elevações externas",
        "Cortes básicos do edifício & Planejamento de layout",
        "Layouts de cozinha e banheiro",
        "Posicionamento de equipamentos e fixtures",
        "Tabelas de portas e janelas",
        "Desenhos de construção dimensionados",
        "Visualização 3D (se inclusa)"
      ]
    },
    note: { EN: "All drawings are prepared in accordance with standard U.S. residential drafting practices.", PT: "Todos os desenhos são preparados de acordo com práticas padrão de desenho residencial dos EUA." }
  },
  {
    num: 7,
    icon: <Icons.XIcon />,
    iconColor: "#E91E63",
    iconBg: "rgba(233, 30, 99, 0.1)",
    listIconColor: "#E91E63",
    listIcon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    title: { EN: "What's Not Included", PT: "O Que Não Está Incluído" },
    summary: { EN: "To maintain clarity and compliance, the following are not part of our scope:", PT: "Para manter clareza e conformidade, os seguintes não fazem parte do nosso escopo:" },
    list: {
      EN: [
        "Structural engineering calculations",
        "Engineer stamp or sealed drawings",
        "Full electrical, plumbing & HVAC design",
        "Site surveys or topographic mapping",
        "Soil testing or geotechnical reports",
        "Energy compliance reports",
        "In-person site visits or inspections"
      ],
      PT: [
        "Cálculos de engenharia estrutural",
        "Carimbo de engenheiro ou desenhos selados",
        "Projeto elétrico, hidráulico e HVAC completo",
        "Levantamentos topográficos",
        "Ensaios de solo ou relatórios geotécnicos",
        "Relatórios de conformidade energética",
        "Visitas presenciais ao local ou inspeções"
      ]
    },
    note: { EN: "When required, licensed professionals must be hired locally by the client.", PT: "Quando necessário, profissionais licenciados devem ser contratados localmente pelo cliente." }
  },
  {
    num: 8,
    icon: <Icons.Shield />,
    title: { EN: "Compliance & Responsibility", PT: "Conformidade e Responsabilidade" },
    summary: { EN: "Our drawings are intended for design development and permit documentation support.", PT: "Nossos desenhos são destinados ao desenvolvimento do projeto e suporte à documentação de alvará." },
    body: {
      EN: "Final approval is subject to review by local authorities and licensed engineers, when required by state or municipal regulations.",
      PT: "A aprovação final está sujeita à revisão por autoridades locais e engenheiros licenciados, quando exigido pelas regulamentações estaduais ou municipais."
    },
    list: {
      EN: [
        "Hiring licensed structural engineers (if required)",
        "Coordinating required technical reports",
        "Verifying local zoning and code restrictions"
      ],
      PT: [
        "Contratar engenheiros estruturais licenciados (se exigido)",
        "Coordenar relatórios técnicos necessários",
        "Verificar restrições de zoneamento e código local"
      ]
    },
    note: { EN: "We design in alignment with U.S. standards; final compliance depends on local jurisdiction.", PT: "Projetamos em alinhamento com padrões dos EUA; a conformidade final depende da jurisdição local." }
  },
  {
    num: 9,
    icon: <Icons.MessageCircle />,
    title: { EN: "Meetings & Communication", PT: "Reuniões e Comunicação" },
    summary: { EN: "DA·RA Studio operates 100% remotely with a structured digital workflow.", PT: "O DA·RA Studio opera 100% remotamente com um fluxo de trabalho digital estruturado." },
    body: {
      EN: "We do not offer video calls or in-person meetings. All project coordination is handled exclusively via WhatsApp and our Client Portal.",
      PT: "Não oferecemos chamadas de vídeo ou reuniões presenciais. Toda a coordenação do projeto é feita exclusivamente via WhatsApp e nosso Portal do Cliente."
    },
    list: {
      EN: [
        "Full online project management",
        "Direct communication via WhatsApp during business hours",
        "Continuous updates throughout each phase",
        "Client portal access for files, timelines, and invoices"
      ],
      PT: [
        "Gestão de projeto totalmente online",
        "Comunicação direta via WhatsApp em horário comercial",
        "Atualizações contínuas em cada fase",
        "Acesso ao portal para arquivos, prazos e faturas"
      ]
    }
  },
  {
    num: 10,
    icon: <Icons.Star />,
    title: { EN: "Why DA·RA Studio", PT: "Por que o DA·RA Studio" },
    summary: { EN: "We serve clients across the United States and Brazil with precision and speed.", PT: "Atendemos clientes nos Estados Unidos e Brasil com precisão e velocidade." },
    list: {
      EN: [
        "Code-conscious documentation (IRC, IBC, NBR)",
        "Builder-friendly drawing sets",
        "Efficient turnaround with defined milestones",
        "Clear scope and professional boundaries",
        "Trusted by developers and construction teams",
        "Remote-first digital workflow"
      ],
      PT: [
        "Documentação voltada a normas (IRC, IBC, NBR)",
        "Projetos focados na execução",
        "Prazos de entrega eficientes",
        "Escopo e limites profissionais claros",
        "Aprovado por incorporadores e construtores",
        "Fluxo de trabalho 100% remoto"
      ]
    }
  }
];

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
        {/* Brilho radial roxo suave no topo centralizado */}
        <div className="radial-glow"></div>
        <div className="radial-glow-navy"></div>
        <Navbar />
        <main className="independent-page">

          {/* Header */}
          <header className="page-header-premium animate-float-up">
            <h1 className="page-main-title">
              {lang === "EN" ? (
                <>
                  <span className="title-gradient-italic">Workflow</span>{" "}
                  <span className="title-white">& Professional Scope</span>
                </>
              ) : (
                <>
                  <span className="title-gradient-italic">Processo</span>{" "}
                  <span className="title-white">& Escopo Profissional</span>
                </>
              )}
            </h1>
            <p className="page-subtitle-standard">
              {lang === "EN" ? (
                <>
                  A structured, efficient, and fully remote workflow engineered for discerning builders, developers, and homeowners. By leveraging cutting-edge technical accuracy and robust communication via WhatsApp and our dedicated client portal, we eliminate friction and deliver construction-ready documentation wherever you are.
                  <br /><br />
                  <strong>The Benefit:</strong> No overhead, no communication gaps. Just high-precision Permit Sets and 3D modeling delivered through a seamless, transparent pipeline.
                </>
              ) : (
                <>
                  Eliminamos a distância com um fluxo de trabalho estruturado, ágil e 100% remoto, projetado especificamente para construtores, incorporadores e proprietários exigentes. Toda a coordenação técnica e o gerenciamento das entregas acontecem direto via WhatsApp e no nosso portal do cliente, garantindo controle absoluto do seu projeto em tempo real.
                  <br /><br />
                  <strong>O Benefício:</strong> A segurança de um processo executivo rigoroso com a agilidade que o mercado imobiliário exige. Sem ruídos, sem burocracia, com total transparência.
                </>
              )}
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
                  <div 
                    className="service-icon-box"
                    style={{ 
                      color: step.iconColor || 'var(--color-neon-purple)',
                      background: step.iconBg || 'rgba(123, 31, 162, 0.1)'
                    }}
                  >
                    {step.icon}
                  </div>
                  <h3 className="service-title">
                    {step.num}. {step.title[lang]}
                  </h3>
                  <p className="service-desc">{step.summary[lang]}</p>
                  
                  {step.body && (
                    <p className="service-desc" style={{ marginTop: '-8px' }}>
                      {step.body[lang]}
                    </p>
                  )}

                  {step.list && (
                    <ul className="service-list">
                      {step.list[lang].map((item, i) => (
                        <li key={i} className="service-list-item">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={step.listIconColor || "var(--color-neon-purple)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {step.listIcon || <polyline points="20 6 9 17 4 12"/>}
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {step.customLists && step.customLists.map((clist, i) => (
                    <div key={i} className={clist.boxClass}>
                      <h4 className={clist.titleClass}>
                        {clist.title[lang]}
                      </h4>
                      <ul className="service-list" style={{ marginTop: 0 }}>
                        {clist.items[lang].map((item, j) => (
                          <li key={j} className="service-list-item">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={clist.iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              {clist.icon}
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                  {step.badge && (
                    <div className="service-output-badge" style={{ marginTop: 'auto' }}>
                      {step.badge[lang]}
                    </div>
                  )}

                  {step.note && (
                    <div className="service-disclaimer" style={{ marginTop: !step.badge && !step.cta ? 'auto' : '6px' }}>
                      {step.note[lang]}
                    </div>
                  )}

                  {step.cta && (
                    <div style={{ marginTop: 'auto', paddingTop: '16px', width: '100%' }}>
                      <button 
                        className="btn-glow" 
                        style={{ width: '100%', gap: '8px' }}
                        onClick={() => navigate(step.cta.path)}
                      >
                        {step.cta.icon}
                        {step.cta.label[lang]}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}

          <div className="hww-cta-section animate-float-up" style={{ animationDelay: '300ms', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', maxWidth: '860px', margin: '48px auto 0' }}>
            <h2 className="page-main-title" style={{ fontSize: '36px', marginBottom: '16px' }}>
              {lang === 'EN' ? 'Request a Free Quote' : 'Solicite um Orçamento Gratuito'}
            </h2>
            <p className="page-subtitle-standard" style={{ marginBottom: '24px', maxWidth: '600px' }}>
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
                  border: '1px solid #25D366', 
                  color: '#25D366', 
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
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(37, 211, 102, 0.1)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; }}
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

