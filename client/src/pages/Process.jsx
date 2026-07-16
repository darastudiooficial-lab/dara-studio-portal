import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import PageTransition from '../components/PageTransition';
import { useNavigate } from 'react-router-dom';

const WORKFLOW_STEPS = [
  {
    num: "00",
    title: { EN: `Solutions & Engagement Model`, PT: `Nossos Serviços & Modelos de Engajamento` },
    desc: {
      EN: `Select the precise architectural support or documentation package that aligns with your pipeline’s current demand. Our specialized capability acts as an extension of your team, whether you need high-volume Chief Architect X17 conversions from PDFs or sketches, regulatory Permit Sets, or highly detailed executive documentation. We recommend reviewing our full capabilities in the Specialization section under the What We Do menu to optimize and calibrate your scope before initiating production.`,
      PT: `Escolha o pacote ou o suporte técnico pontual que melhor atenda ao volume e à velocidade atual da sua empresa. Nosso catálogo completo de soluções foi estruturado para dar escala à sua operação, incluindo desde conversões de arquivos para Chief Architect X17 até a aprovação de projetos como Permit Sets e documentação executiva de alta complexidade. Recomendamos consultar nossa matriz técnica na aba de Especialização dentro do menu What We Do para calibrar o escopo ideal antes de iniciar o fluxo de trabalho.`
    },
    cta: {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
      label: { EN: `EXPLORE CAPABILITIES & SERVICES`, PT: `VER CATÁLOGO DE SERVIÇOS` },
      path: "/services"
    }
  },
  {
    num: "01",
    title: { EN: `Initial Consultation`, PT: `Primeiro Contato` },
    desc: { 
      EN: `Start with what you have. You don't need a finalized blueprint to get moving. A preliminary sketch, visual references, or a clear objective is more than enough for our team to understand your requirements and build a precise project scope.`,
      PT: `Comece com o que você tem em mãos. Você não precisa chegar com um projeto definitivo ou perfeito para iniciar o fluxo. Um croqui preliminar, referências visuais ou um direcionamento claro já são suficientes para compreendermos a sua demanda e estruturarmos um escopo assertivo.`
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
    title: { EN: `Scope & Estimate`, PT: `Escopo & estimate` },
    desc: { 
      EN: `We carefully analyze every piece of data you share to map out the actual structural and architectural needs of the project. Then, we provide a highly transparent proposal specifying the exact scope, clear delivery milestones, and payment terms.`,
      PT: `Analisamos minuciosamente as informações enviadas para mapear as reais necessidades do projeto. Em seguida, estruturamos uma proposta transparente, especificando o escopo exato, cronograma de prazos e as condições de pagamento.`
    },
    customLists: [
      {
        title: { EN: `WHAT YOUR ESTIMATE ALWAYS INCLUDES`, PT: `SEU ESTIMATE SEMPRE INCLUI` },
        boxClass: "service-box-gold",
        titleClass: "service-box-gold-title",
        iconColor: "#9c7c3a",
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
            `Plantas baixas com dimensionamentos e anotações técnicas`,
            `Elevações externas — as quatro fachadas principais`,
            `Cortes e seções construtivas detalhadas`,
            "Schedules (quadros) de portas e janelas",
            `Layout interno e posicionamento de fixtures (peças e acabamentos fixos)`,
            "Renders 3D (conforme o pacote selecionado)",
            `Plantas de Wood Framing (quando aplicável ao escopo)`,
            "Estrutura de pagamento clara — modelo 40 / 40 / 20"
          ]
        }
      },
      {
        title: { EN: `SERVICES NOT INCLUDED — REQUIRE SEPARATE CONTRACTS`, PT: `SERVIÇOS NÃO INCLUÍDOS — REQUEREM CONTRATOS SEPARADOS` },
        boxClass: "service-box-red",
        titleClass: "service-box-red-title",
        iconColor: "#ef4444",
        icon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
        items: {
          EN: [
            "Structural engineering calculations and professional engineering stamps (PE Stamp)",
            `MEP engineering plans covering electrical, plumbing, and HVAC systems`,
            "Boundary and topographical land surveys",
            "Energy efficiency assessment reports such as HERS rating or Blower Door testing",
            "On-site technical visits or physical construction inspections",
            `Native editable project files including .plan from Chief Architect or .dwg, which can be made available upon a separate release fee`
          ],
          PT: [
            `Cálculo estrutural e assinatura/selo de engenharia (PE Stamp)`,
            `Projetos complementares de Engenharia (Elétrico, Hidráulico e HVAC)`,
            `Levantamento topográfico do terreno`,
            `Relatórios de eficiência energética (como HERS rating ou Blower Door test)`,
            `Visitas técnicas presenciais ou inspeções de obra`,
            `Fornecimento de arquivos editáveis nativos (como .plan ou .dwg) — disponíveis mediante taxa de liberação`
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
    num: "03",
    title: { EN: `Approval & Activation`, PT: `Aprovação & Ativação` },
    desc: { 
      EN: `Once you review and sign the estimate, the initial payment confirmation formalizes the project start date and secures the immediate allocation of our production team.`,
      PT: `Após revisar e assinar o estimate, a confirmação do pagamento inicial formaliza a data de início do projeto e assegura a alocação imediata da nossa equipe de produção.`
    },
    customLists: [
      {
        title: { EN: `ACTIVATION CHECKLIST`, PT: `CHECKLIST DE ATIVAÇÃO` },
        boxClass: "service-box-gold",
        titleClass: "service-box-gold-title",
        iconColor: "#9c7c3a",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Estimate reviewed and all scope items confirmed by you",
            "Estimate digitally signed",
            "Initial 40% payment received and processed — the project is officially scheduled only after this confirmation",
            <>40% — <em>Project Initiation and Conceptual Design</em></>
          ],
          PT: [
            `Estimate revisado e todos os itens de escopo confirmados por você`,
            "Estimate assinado digitalmente",
            `Pagamento inicial de 40% recebido e processado — somente então o projeto é oficialmente agendado`,
            <>40% — <em>Início do Projeto e Design Conceitual</em></>
          ]
        }
      }
    ],
    paymentMethods: {
      title: { EN: `PAYMENT METHODS & PROCESSING TIMES`, PT: `FORMAS DE PAGAMENTO & PRAZOS DE PROCESSAMENTO` },
      methods: [
        {
          icon: "💳",
          name: { EN: `Credit Card via Stripe`, PT: `Cartão de Crédito via Stripe` },
          desc: { EN: `A secure payment link is sent directly with your invoice. All major credit cards are accepted.`, PT: `Um link de pagamento seguro é enviado junto com a sua fatura. Aceitamos as principais bandeiras do mercado.` },
          details: {
            EN: [
              <><strong>Fees:</strong> A processing fee of 7.99% is added to the project total.</>,
              <><strong>Project Start:</strong> Funds are typically cleared within 5 to 10 business days, and the project enters our production queue only after this processing window.</>
            ],
            PT: [
              <><strong>Encargos:</strong> Uma taxa de processamento de 7,99% é adicionada sobre o valor total do projeto.</>,
              <><strong>Início do Projeto:</strong> O valor normalmente é compensado de 5 a 10 dias úteis — o projeto entra na fila somente após isso.</>
            ]
          }
        },
        {
          icon: "🏦",
          name: { EN: `Wire Transfer / ACH`, PT: `Wire Transfer / ACH` },
          desc: { EN: `No additional processing fees. ACH is available for US bank accounts, and international wire transfers are also accepted.`, PT: `Sem taxa adicional de processamento. ACH disponível para contas bancárias nos EUA. Wire internacional também aceito.` },
          details: {
            EN: [
              <><strong>Processing Window:</strong> Funds are typically received within 2 to 5 business days.</>,
              <><strong>Instructions:</strong> Complete banking details are provided directly on your invoice.</>
            ],
            PT: [
              <><strong>Prazos:</strong> Valores normalmente recebidos em 2 a 5 dias úteis.</>,
              <><strong>Instruções:</strong> Dados bancários fornecidos na fatura.</>
            ]
          }
        }
      ]
    },
    note: {
      EN: <><strong>WHY THIS PHASE MATTERS:</strong> We work with a limited number of active projects simultaneously to guarantee exceptional technical quality and meet every single deadline. Signing the document alone does not reserve your spot. Your project is placed in our production queue only when the payment is fully cleared on our end, regardless of the chosen payment method.</>,
      PT: <><strong>POR QUE ESSA ETAPA IMPORTA:</strong> Trabalhamos com um número limitado de projetos ativos ao mesmo tempo para garantir o máximo rigor técnico e cumprir cada prazo com precisão. A assinatura isolada não reserva a sua vaga. O projeto só entra na nossa fila de execução quando o pagamento é recebido e processado do nosso lado, independentemente da forma de pagamento escolhida.</>
    },
    planningNote: {
      EN: `Planning Note: The allocation of your project in our schedule is validated exclusively after the full clearing of funds, not upon the issuance date or proof of transfer. We highly recommend factoring in these processing times when planning your project kickoff.`,
      PT: `Nota de Planejamento: A alocação da sua demanda em nosso cronograma é validada exclusivamente após a compensação integral dos fundos, e não na data de envio do comprovante. Recomendamos considerar os prazos de processamento de cada método ao planejar o início do seu projeto.`
    }
  },
  {
    num: "04",
    title: { EN: `Final Drawing Set`, PT: `Conjunto de Desenhos Final` },
    badge: { EN: `25–30 Business Days`, PT: `25–30 Dias Úteis` },
    desc: { 
      EN: `Complete architectural drawing package delivered digitally in PDF format. Timeline: 25–30 business days after preview approval.`,
      PT: `Pacote completo de desenhos arquitetônicos entregue digitalmente em PDF. Prazo: 25–30 dias úteis após aprovação da prévia.`
    }
  },
  {
    num: "05",
    title: { EN: `Ongoing Coordination`, PT: `Coordenação Contínua` },
    desc: { 
      EN: `We remain available via WhatsApp and the client portal to answer questions from your construction team and clarify design intent.`,
      PT: `Permanecemos disponíveis via WhatsApp e portal do cliente para esclarecer dúvidas da sua equipe de obra.`
    }
  }
];

export default function Process() {
  const { lang } = useAppContext();
  const navigate = useNavigate();

  return (
    <PageTransition variant="default">
    <div className="lp-root">
      {/* Brilho radial verde suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>
      <Navbar />
      <main className="independent-page">
        <BackButton />
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

          <div className="workflow-notice" style={{ background: 'rgba(156, 124, 58, 0.05)', border: '1px solid rgba(156, 124, 58, 0.2)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
            <div style={{ color: 'var(--brand-purple)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.8, fontStyle: 'italic' }}>
              {lang === "EN" 
                ? "DA·RA Studio operates 100% remotely. All coordination is handled via WhatsApp and our Client Portal. We do not offer video calls or in-person meetings."
                : `A DA·RA Studio opera 100% remotamente. Toda a coordenação é feita via WhatsApp e nosso Portal do Cliente. Não oferecemos chamadas de vídeo ou reuniões presenciais.`}
            </p>
          </div>

          <div className="workflow-list">
            {WORKFLOW_STEPS.map(step => (
              <div key={step.num} className="workflow-step-card">
                <div className="workflow-step-header">
                  <div className="workflow-step-title-wrap">
                    <span className="workflow-step-num">{step.num}</span>
                    <h3 className="workflow-step-title">{step.title[lang]}</h3>
                  </div>
                  {step.badge && <span className="timeline-badge">{step.badge[lang]}</span>}
                </div>
                {step.desc && <p className="workflow-step-desc">{step.desc[lang]}</p>}
                
                {step.list && (
                  <ul className="service-list" style={{ marginTop: '16px' }}>
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

                {step.paymentMethods && (
                  <div style={{ marginTop: '16px' }}>
                    <h4 style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--text-color)', opacity: 0.5, marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
                      {step.paymentMethods.title[lang]}
                    </h4>
                    {step.paymentMethods.methods.map((m, i) => (
                      <div key={i} style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: i < step.paymentMethods.methods.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>{m.icon}</span> {m.name[lang]}
                        </p>
                        <p style={{ fontSize: '13px', opacity: 0.7, marginBottom: '10px', lineHeight: 1.5 }}>{m.desc[lang]}</p>
                        {m.details[lang].map((d, j) => (
                          <p key={j} style={{ fontSize: '12px', opacity: 0.65, lineHeight: 1.6, marginBottom: '4px' }}>{d}</p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {step.note && (
                  <div className="service-disclaimer" style={{ marginTop: '16px' }}>
                    {step.note[lang]}
                  </div>
                )}

                {step.planningNote && (
                  <p style={{ marginTop: '16px', fontSize: '12px', opacity: 0.55, lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
                    {step.planningNote[lang]}
                  </p>
                )}
                {step.cta && (
                  <div style={{ marginTop: '24px', width: '100%' }}>
                    <button 
                      className="btn-primary" 
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
        </main>
      <Footer />
    </div>
    </PageTransition>
  );
}
