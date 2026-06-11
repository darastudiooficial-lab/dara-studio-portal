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
    num: "03",
    icon: <Icons.Clock />,
    title: { EN: "Approval & Activation", PT: "Aprovação & Ativação" },
    summary: { EN: "Sign, pay, and we begin.", PT: "Assine, pague e começamos." },
    body: {
      EN: "Once you review and sign the estimate, the initial payment confirmation formalizes the project start date and secures the immediate allocation of our production team.",
      PT: "Após revisar e assinar o estimate, a confirmação do pagamento inicial formaliza a data de início do projeto e assegura a alocação imediata da nossa equipe de produção."
    },
    customLists: [
      {
        title: { EN: "ACTIVATION CHECKLIST", PT: "CHECKLIST DE ATIVAÇÃO" },
        boxClass: "service-box-green",
        titleClass: "service-box-green-title",
        iconColor: "#10b981",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Estimate reviewed and all scope items confirmed by you",
            "Estimate digitally signed",
            "Initial 40% payment received and processed — the project is officially scheduled only after this confirmation",
            <>40% — <em>Project Initiation and Conceptual Design</em></>
          ],
          PT: [
            "Estimate revisado e todos os itens de escopo confirmados por você",
            "Estimate assinado digitalmente",
            "Pagamento inicial de 40% recebido e processado — somente então o projeto é oficialmente agendado",
            <>40% — <em>Início do Projeto e Design Conceitual</em></>
          ]
        }
      }
    ],
    paymentMethods: {
      title: { EN: "PAYMENT METHODS & PROCESSING TIMES", PT: "FORMAS DE PAGAMENTO & PRAZOS DE PROCESSAMENTO" },
      methods: [
        {
          icon: "💳",
          name: { EN: "Credit Card via Stripe", PT: "Cartão de Crédito via Stripe" },
          desc: { EN: "A secure payment link is sent directly with your invoice. All major credit cards are accepted.", PT: "Um link de pagamento seguro é enviado junto com a sua fatura. Aceitamos as principais bandeiras do mercado." },
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
          name: { EN: "Wire Transfer / ACH", PT: "Wire Transfer / ACH" },
          desc: { EN: "No additional processing fees. ACH is available for US bank accounts, and international wire transfers are also accepted.", PT: "Sem taxa adicional de processamento. ACH disponível para contas bancárias nos EUA. Wire internacional também aceito." },
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
      EN: "Planning Note: The allocation of your project in our schedule is validated exclusively after the full clearing of funds, not upon the issuance date or proof of transfer. We highly recommend factoring in these processing times when planning your project kickoff.",
      PT: "Nota de Planejamento: A alocação da sua demanda em nosso cronograma é validada exclusivamente após a compensação integral dos fundos, e não na data de envio do comprovante. Recomendamos considerar os prazos de processamento de cada método ao planejar o início do seu projeto."
    }
  },
  {
    num: "04",
    icon: <Icons.Eye />,
    badge: { EN: "8–16 Business Days Per Round", PT: "8–16 Dias úteis Por Rodada" },
    title: { EN: "Design Development & Previews", PT: "Desenvolvimento de Design & Prévias" },
    summary: { EN: "See Your Project Come to Life.", PT: "Veja Seu Projeto Ganhar Vida." },
    body: {
      EN: "This is where your vision takes shape. We develop your project and deliver structured previews combining clear layout plans with high-fidelity 3D visualizations. This approach allows you to experience the spatial flow and validate every detail before any technical production begins.",
      PT: "É aqui que o seu projeto começa. Desenvolvemos a sua demanda e enviamos prévias estruturadas que combinam plantas baixas com simulações em 3D. Assim, você consegue visualizar a real proporção dos espaços e validar cada elemento antes que o detalhamento técnico seja finalizado."
    },
    note: {
      EN: <><strong>WHY THIS PHASE MATTERS:</strong> Moving a wall on a screen costs nothing. Modifying it after construction starts costs thousands. These design preview rounds are engineered to protect your equity, giving you the control to refine every space before the documentation moves into a technical phase that cannot be undone without additional expenses.</>,
      PT: <><strong>POR QUE ESSA ETAPA IMPORTA:</strong> Mudar uma parede no projeto não custa nada. Mudar a mesma parede durante a obra custa milhares de dólares. As rodadas de prévias existem especificamente para proteger o seu investimento, sendo a sua grande oportunidade de lapidar cada detalhe antes que o projeto entre na fila de produção executiva, uma fase que não pode ser desfeita sem custos adicionais.</>
    },
    customLists: [
      {
        title: { EN: "HOW THE PREVIEW ROUNDS WORK", PT: "COMO FUNCIONAM AS RODADAS DE PRÉVIAS" },
        boxClass: "service-box-green",
        titleClass: "service-box-green-title",
        iconColor: "#10b981",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "We deliver a complete floor plan layout accompanied by a 3D visualization for each preview.",
            "You review the assets, compile your feedback, and send it back to our team.",
            "We apply your requests systematically and return the updated design.",
            "Each iteration round takes between 8 to 16 business days to be processed and delivered."
          ],
          PT: [
            "Enviamos o layout da planta baixa acompanhado da visualização em 3D a cada entrega.",
            "Você analisa os arquivos, reúne seus comentários e nos envia o feedback.",
            "Aplicamos todas as alterações de forma sistemática e devolvemos a prévia atualizada.",
            "Cada rodada leva de 8 a 16 dias úteis para ser elaborada e entregue."
          ]
        }
      }
    ],
    revisionSystem: {
      included: {
        label: { EN: "REV 01, 02 & 03 — Included Revision Rounds", PT: "REV 01, 02 & 03 — Rodadas de Revisão Inclusas" },
        items: {
          EN: [
            "Up to 3 rounds of structured feedback and refinement are completely included.",
            "Every single update is delivered within 8 to 16 business days.",
            "Feedback must be entirely consolidated — partial notes or daily messages do not count as a formal revision round."
          ],
          PT: [
            "Até 3 rodadas de alinhamento e refinamento estão totalmente cobertas pelo seu pacote.",
            "Cada entrega dentro do prazo padrão de 8 a 16 dias úteis.",
            "Os feedbacks precisam ser consolidados — mensagens parciais ou feedbacks diários não contam como uma rodada de revisão oficial."
          ]
        }
      },
      extended: {
        label: { EN: "REV 04, 05, 06+ — Hourly Extension Model", PT: "REV 04, 05, 06+ — Modelo de Extensão por Hora Técnica" },
        steps: {
          EN: [
            <><strong>The Process:</strong> You send your consolidated feedback just like the initial rounds.</>,
            <><strong>The Evaluation:</strong> DARA Studio reviews your notes and calculates the exact hours required based on technical complexity.</>,
            <><strong>The Transparency:</strong> We send over the estimated hours and the final cost for your approval. No work ever begins without your explicit green light.</>,
            <><strong>The Execution:</strong> Once approved and processed, we apply the changes and deliver your updated preview within the agreed timeframe.</>
          ],
          PT: [
            <><strong>O Fluxo:</strong> Você envia o seu feedback consolidado exatamente como nas rodadas anteriores.</>,
            <><strong>A Avaliação:</strong> A DARA Studio analisa as solicitações e calcula o tempo necessário com base no nível técnico, e não por quantidade de itens.</>,
            <><strong>A Transparência:</strong> Enviamos a estimativa de horas e o valor total para a sua validação. Nenhuma alteração começa sem a sua autorização.</>,
            <><strong>A Execução:</strong> Após a aprovação e o pagamento, executamos as mudanças e entregamos a nova prévia dentro do prazo combinado.</>
          ]
        },
        example: {
          EN: "Real Operational Example: You submit a request for REV 04 to move the kitchen island, adjust the master closet layout, and change two window placements. DARA Studio evaluates the technical scope and estimates 3 hours of work. We send you the clear quote of 3 hours at $95 per hour, totaling $285. You approve and pay, and we deliver the new preview within 8 to 16 business days.",
          PT: "Exemplo Prático Operacional: Você envia os comentários para a REV 04 solicitando a mudança da ilha da cozinha, o ajuste do layout do closet principal e a alteração de duas janelas. A DARA Studio avalia o impacto técnico e projeta 3 horas de trabalho. Enviamos o orçamento claro de 3 horas a $95 por hora, resultando em $285. Você aprova e realiza o pagamento, e nós entregamos a nova prévia de 8 a 16 dias úteis."
        }
      },
      guidelines: {
        title: { EN: "IMPORTANT GUIDELINES — 3D & SCOPE CHANGES", PT: "DIRETRIZES ESSENCIAIS — 3D & ALTERAÇÕES DE ESCOPO" },
        items: {
          EN: [
            <><strong>Exterior 3D:</strong> Included volumetric renders are tied directly to your closed package as outlined in your initial Estimate. This covers the baseline exterior models agreed upon during signing.</>,
            <><strong>Interior 3D:</strong> Interior renders are always handled separately and are not included in the base package. Each room is billed individually at $150 to $200 per interior space, with subsequent post-delivery revisions at $150 per round.</>,
            <><strong>AI and Conceptual References:</strong> Any layout changes or new render requests inspired by AI-generated mockups or external references are treated as new interior work and billed per room without exception.</>,
            <><strong>Post-Approval Changes:</strong> Any structural change to a previously approved layout is billed at our standard technical hour rate of $95 per hour, regardless of your package. Significant scope alterations will always require a revised Estimate.</>
          ],
          PT: [
            <><strong>3D Externo:</strong> As renderizações volumétricas externas estão vinculadas ao seu pacote fechado conforme estabelecido no seu Estimate inicial, cobrindo o que foi acordado no momento da assinatura.</>,
            <><strong>3D Interno:</strong> As imagens internas não fazem parte do pacote base e são tratadas separadamente. Cada ambiente é faturado individualmente com valores entre $150 e $200 por espaço, e revisões pós-entrega possuem o custo de $150 por rodada.</>,
            <><strong>Referências e Imagens de IA:</strong> Novas demandas de renders ou alterações de layout baseadas em imagens conceituais externas ou maquetes geradas por IA são processadas como novos trabalhos internos e faturadas por ambiente, sem exceções.</>,
            <><strong>Alterações Pós-Aprovação:</strong> Qualquer modificação estrutural em um layout já aprovado será faturada com base na nossa hora técnica padrão de $95 por hora, independente do pacote contratado. Mudanças profundas de escopo sempre exigirão um novo Estimate.</>
          ]
        }
      }
    }
  },
  {
    num: "04.5",
    icon: <Icons.FileText />,
    badge: { EN: "25–30 Business Days After Approval", PT: "25–30 Dias úteis Após Aprovação" },
    title: { EN: "Final Drawing Set", PT: "Conjunto de Desenhos Final" },
    summary: { EN: "Your comprehensive blueprint package delivered in a high-resolution, construction-ready digital format.", PT: "O pacote completo de documentação arquitetônica entregue em formato digital de alta resolução, pronto para a obra." },
    body: {
      EN: "Once the design previews are fully approved, our technical production team develops the complete construction documentation. This technical phase translates your vision into fully dimensioned floor plans, detailed exterior elevations, cross-sections, and exact door and window schedules. Every structural detail required for building permit submittal and actual construction is meticulously integrated. All drawings are drafted from the ground up utilizing specialized Chief Architect X17 parameters to meet strict US residential drawing standards, delivered in industry-standard PDF format.",
      PT: "Após a validação final da etapa de design, nossa equipe inicia a produção técnica de todo o detalhamento executivo para construção. Essa entrega engloba plantas baixas totalmente cotadas, elevações externas detalhadas, cortes construtivos e as tabelas exatas de portas e janelas. Agrupamos todos os detalhes necessários para a submissão de alvarás e orientação do canteiro de obras. Toda a documentação é desenvolvida seguindo rigorosamente as normas norte-americanas de desenho residencial diretamente no sistema do Chief Architect X17, garantindo a entrega em arquivos PDF que são o padrão absoluto da indústria."
    },
    note: {
      EN: "Timeline may vary depending on project complexity, requested revisions, and technical coordination during project development.",
      PT: "O prazo pode variar dependendo da complexidade do projeto, revisões solicitadas e coordenação técnica durante o desenvolvimento do projeto."
    }
  },
  {
    num: "05",
    icon: <Icons.FileText />,
    iconColor: "#10b981",
    iconBg: "rgba(16, 185, 129, 0.08)",
    title: { EN: "Final Set Review & Retention", PT: "Revisão do Set Final & Retenção" },
    summary: { EN: "Precision down to the last detail.", PT: "Precisão até o último detalhe." },
    body: {
      EN: "When the production team finishes the full construction set, we upload a watermarked, low-resolution technical preview to your client portal. This allows you to verify that every technical specification, annotation, and structural element aligns with your expectations before the final transaction.",
      PT: "Assim que nossa equipe técnica conclui todo o conjunto de desenhos executivos, disponibilizamos uma prévia técnica em baixa resolução com marca d’água diretamente no seu portal do cliente. Essa etapa serve para você verificar se todas as especificações, notas e elementos estruturais estão em perfeita conformidade antes do encerramento do contrato."
    },
    note: {
      EN: <><strong>WHY THIS PHASE MATTERS:</strong> This is the safety valve of our workflow. It gives you the absolute certainty that the material is complete and accurate before you complete the financial milestone. Once you verify the preview, the final payment releases the high-resolution, unwatermarked files, completely ready for municipal permitting or site execution.</>,
      PT: <><strong>POR QUE ESSA ETAPA IMPORTA:</strong> Esta é a válvula de segurança do nosso processo. Ela traz a certeza absoluta de que o material está completo e correto antes de você realizar a última movimentação financeira. Uma vez validada a prévia, o pagamento final libera os arquivos em alta resolução e sem marcas, totalmente prontos para dar entrada na prefeitura ou guiar o canteiro de obras.</>
    },
    customLists: [
      {
        title: { EN: "FINAL RELEASE CHECKLIST", PT: "CHECKLIST DE LIBERAÇÃO FINAL" },
        boxClass: "service-box-green",
        titleClass: "service-box-green-title",
        iconColor: "#10b981",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Final drawing set produced and compiled by DARA Studio",
            "Low-resolution watermarked technical preview uploaded to your portal",
            "Project package thoroughly reviewed and verified by you",
            "Final 20% payment milestone received and fully cleared",
            <>20% — <em>Final Drawing Set and Project Closeout</em></>
          ],
          PT: [
            "Conjunto de desenhos final produzido e compilado pela DARA Studio",
            "Prévia técnica em baixa resolução com marca d’água disponível no portal",
            "Todo o pacote de arquivos revisado e verificado por você",
            "Pagamento do milestone final de 20% recebido e compensado",
            <>20% — <em>Conjunto de Desenhos Final e Encerramento do Projeto</em></>
          ]
        }
      }
    ]
  },
  {
    num: "05.1",
    icon: <Icons.Clock />,
    iconColor: "#7B1FA2",
    iconBg: "rgba(123, 31, 162, 0.08)",
    title: { EN: "Extended Technical Hours & Post-Delivery Framework", PT: "Tabela de Horas Técnicas & Suporte Pós-Entrega" },
    summary: {
      EN: "Architecture is a dynamic pipeline, and municipal demands can shift.",
      PT: "Projetos executivos são dinâmicos e as exigências municipais podem mudar."
    },
    body: {
      EN: "If your project requires adjustments beyond your initial package or after final delivery, we scale our technical support through a highly structured and predictable hourly ecosystem.",
      PT: "Se a sua demanda exigir modificações além do pacote original ou após o encerramento do contrato, nossa estrutura oferece suporte sob demanda através de um modelo de hora técnica altamente previsível."
    },
    paymentMethods: {
      title: { EN: "OUT-OF-SCOPE AND POST-DELIVERY TECHNICAL RATES", PT: "VALORES DE HORA TÉCNICA PARA ITENS FORA DO ESCOPO E PÓS-ENTREGA" },
      methods: [
        {
          icon: "📐",
          name: { EN: "Technical Drafting and Project Modification", PT: "Desenho Técnico e Modificações de Projeto" },
          desc: { EN: "Priced at $95 per hour.", PT: "Fixado em $95 por hora." },
          details: {
            EN: [<>Covers any layout updates, code corrections requested by local authorities, or structural calibration inside the Chief Architect X17 software.</>],
            PT: [<>Cobre qualquer alteração de layout, correções de código solicitadas por órgãos públicos ou calibrações estruturais dentro do sistema Chief Architect X17.</>]
          }
        },
        {
          icon: "🎥",
          name: { EN: "On-Demand Technical Meetings", PT: "Reuniões Técnicas Sob Demanda" },
          desc: { EN: "Priced at $95 per hour.", PT: "Fixado em $95 por hora." },
          details: {
            EN: [<>Applies to dedicated video calls or phone alignments required to discuss scope modifications after a phase is closed.</>],
            PT: [<>Aplica-se a videoconferências dedicadas ou alinhamentos telefônicos necessários para debater mudanças de escopo após uma etapa ser encerrada.</>]
          }
        },
        {
          icon: "📋",
          name: { EN: "General Technical Consultations", PT: "Consultoria Técnica Geral" },
          desc: { EN: "Priced at $95 per hour.", PT: "Fixado em $95 por hora." },
          details: {
            EN: [<>Includes deep reviews of municipal code changes or zoning alignments outside the original contract parameters.</>],
            PT: [<>Inclui análises profundas de mudanças em códigos de zoneamento ou leis municipais específicas que estejam fora do contrato inicial.</>]
          }
        }
      ]
    },
    revisionSystem: {
      included: {
        label: { EN: "THE 30-DAY POST-DELIVERY WARRANTY — What Is Included", PT: "GARANTIA TÉCNICA DE 30 DIAS PÓS-ENTREGA — O que está incluso" },
        items: {
          EN: [
            "Every final drawing set comes with a built-in 30-day technical support window that begins the exact day your unwatermarked files are released.",
            "If the city hall or local building department issues correction notices (redlines) within 30 days, our team will apply the necessary adjustments inside Chief Architect X17 at no extra cost.",
            "Valid exclusively when changes do not alter the approved architectural layout, overall square footage, or structural scope."
          ],
          PT: [
            "Cada conjunto de desenhos final possui um período de suporte técnico de 30 dias corridos, contados a partir da data de liberação dos arquivos em alta resolução.",
            "Se a prefeitura ou o departamento de construções local emitir notas de correção (redlines) dentro desse prazo, nossa equipe aplicará os ajustes no Chief Architect X17 sem qualquer custo adicional.",
            "Válido exclusivamente quando as correções não alterem o layout arquitetônico já aprovado, a área construída ou o escopo estrutural."
          ]
        }
      },
      extended: {
        label: { EN: "WHAT SITS OUTSIDE THE WARRANTY", PT: "O QUE NÃO FAZ PARTE DA GARANTIA" },
        steps: {
          EN: [
            <>Any correction request caused by a change of mind, structural layout modifications, or code inquiries received after the 30-day window has expired will be billed under our standard rate of <strong>$95 per hour</strong>.</>
          ],
          PT: [
            <>Qualquer solicitação de ajuste motivada por mudança de ideia, alterações no layout estrutural ou pedidos de correção recebidos após o término do prazo de 30 dias serão faturados com base no valor padrão de <strong>$95 por hora técnica</strong>.</>
          ]
        }
      }
    }
  },
  {
    num: "06",
    icon: <Icons.Shield />,
    iconColor: "#7B1FA2",
    iconBg: "rgba(123, 31, 162, 0.08)",
    title: { EN: "Administrative Terms & Conditions", PT: "Termos & Condições Administrativas" },
    summary: {
      EN: "Clear operational boundaries for communication and timeline management.",
      PT: "Diretrizes claras para a comunicação e o gerenciamento de prazos ao longo do contrato."
    },
    body: {
      EN: "To maintain the high operational velocity and absolute technical precision that defines DARA Studio, we establish clear behavioral boundaries for our ongoing communication and timeline management.",
      PT: "Para manter a alta velocidade de execução e o rigor técnico que definem a DARA Studio, estabelecemos diretrizes claras para a nossa comunicação diária e para o gerenciamento de prazos ao longo do contrato."
    },
    paymentMethods: {
      title: { EN: "COMMUNICATION PROTOCOLS", PT: "PROTOCOLOS DE COMUNICAÇÃO" },
      methods: [
        {
          icon: "💬",
          name: { EN: "Centralized Channels", PT: "Canais Centralizados" },
          desc: {
            EN: "Our client portal and text messaging via WhatsApp serve as the exclusive channels for all project-related updates, file transfers, and design feedback.",
            PT: "O portal do cliente e o atendimento via WhatsApp são os únicos canais oficiais para atualizações, envios de arquivos e recebimento de feedbacks."
          },
          details: {
            EN: [<>We do not utilize audio notes or voice messages for official design changes — technical alignments must remain entirely auditable and traceable.</>],
            PT: [<>Não utilizamos mensagens de áudio para aprovações ou alterações de design, pois cada alinhamento técnico precisa ser totalmente documentado e rastreável.</>]
          }
        },
        {
          icon: "⏱️",
          name: { EN: "Response Windows", PT: "Janelas de Resposta" },
          desc: {
            EN: "Our standard response time sits between 2 to 4 business hours during working days.",
            PT: "Nosso tempo padrão de retorno é de 2 a 4 horas úteis durante o horário comercial."
          },
          details: {
            EN: [<>For deeply technical inquiries or structural reviews that demand detailed analysis from our drafting team, please allow up to <strong>24 business hours</strong> for a comprehensive resolution.</>],
            PT: [<>Para dúvidas profundamente técnicas ou revisões estruturais que exijam uma análise detalhada da nossa equipe de desenho, pedimos o prazo de até <strong>24 horas úteis</strong> para uma resposta completa.</>]
          }
        }
      ]
    },
    revisionSystem: {
      included: {
        label: { EN: "SCHEDULE MANAGEMENT & PROJECT EXPIRATIONS", PT: "PRAZOS DE INATIVIDADE & EXPIRAÇÃO DE CONTRATO" },
        items: {
          EN: [
            <>On-Hold Status: If a project pipeline is paused or left inactive due to delayed client feedback or missing site documentation for more than <strong>45 consecutive days</strong>, the original contract terms are voided.</>,
          ],
          PT: [
            <>Status em Espera: Se o andamento do projeto ficar estagnado por falta de feedbacks, atrasos em aprovações ou ausência de documentos por mais de <strong>45 dias seguidos</strong>, o contrato original perde a validade.</>,
          ]
        }
      },
      extended: {
        label: { EN: "REACTIVATION ARCHITECTURE", PT: "ESTRUTURA DE REATIVAÇÃO" },
        steps: {
          EN: [
            <>A dedicated reactivation fee equal to <strong>15% of the total estimate</strong> will be assessed to bring a dormant project back into active production after the 45-day threshold.</>,
            <>The project will then be repositioned into our current production queue based on our active availability — original timelines and delivery milestones will be subject to recalibration.</>
          ],
          PT: [
            <>Para reinserir um projeto inativo de volta à nossa linha de produção após o limite de 45 dias, será cobrada uma taxa de reativação equivalente a <strong>15% do valor total do estimate</strong>.</>,
            <>O projeto será reposicionado na fila de acordo com a nossa disponibilidade atual — os prazos e cronogramas originais serão recalculados.</>
          ]
        }
      }
    }
  },
  {
    num: "06.1",
    icon: <Icons.Star />,
    iconColor: "#E91E63",
    iconBg: "rgba(233, 30, 99, 0.08)",
    title: { EN: "Welcome to DARA Studio", PT: "Seja Bem-Vindo à DARA Studio" },
    summary: {
      EN: "We are fully organized and ready to scale your architectural pipeline.",
      PT: "Estamos prontos para estruturar e dar escala à sua demanda arquitetônica."
    },
    body: {
      EN: "Now that your project is officially activated and positioned in our production queue, we will guide you through our onboarding process to ensure complete alignment before the technical work begins.",
      PT: "Agora que o seu projeto está oficialmente ativado e posicionado na nossa linha de produção, vamos guiar você pelas etapas iniciais para garantir total alinhamento antes do início dos desenhos técnicos."
    },
    cta: {
      label: { EN: "START YOUR PROJECT", PT: "INICIAR MEU PROJETO" },
      path: "/estimate",
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
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

                  {step.revisionSystem && (() => {
                    const rs = step.revisionSystem;
                    return (
                      <div style={{ marginTop: '16px' }}>
                        {/* Included Rounds */}
                        <div className="service-box-green">
                          <h4 className="service-box-green-title">{rs.included.label[lang]}</h4>
                          <ul className="service-list" style={{ marginTop: 0 }}>
                            {rs.included.items[lang].map((item, i) => (
                              <li key={i} className="service-list-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Extended Model */}
                        <div style={{ marginTop: '16px', padding: '20px', borderRadius: '12px', border: '1px solid rgba(123, 31, 162, 0.2)' }}>
                          <h4 style={{ color: 'var(--brand-purple)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
                            {rs.extended.label[lang]}
                          </h4>
                          <ul className="service-list" style={{ marginTop: 0 }}>
                            {rs.extended.steps[lang].map((step, i) => (
                              <li key={i} className="service-list-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--brand-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                                {step}
                              </li>
                            ))}
                          </ul>
                          {rs.extended.example && (
                            <p style={{ marginTop: '16px', fontSize: '12px', opacity: 0.65, lineHeight: 1.7, fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                              {rs.extended.example[lang]}
                            </p>
                          )}
                        </div>

                        {/* Guidelines */}
                        {rs.guidelines && (
                          <div className="service-box-red" style={{ border: '1px solid rgba(255, 193, 7, 0.2)' }}>
                            <h4 style={{ color: '#FFC107', fontSize: '11px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px', fontFamily: 'var(--font-sans)' }}>
                              {rs.guidelines.title[lang]}
                            </h4>
                            <ul className="service-list" style={{ marginTop: 0 }}>
                              {rs.guidelines.items[lang].map((item, i) => (
                                <li key={i} className="service-list-item">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFC107" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}

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

                  {step.planningNote && (
                    <p style={{ marginTop: '16px', fontSize: '12px', opacity: 0.55, lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
                      {step.planningNote[lang]}
                    </p>
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

