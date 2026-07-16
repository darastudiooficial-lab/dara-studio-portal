import React from 'react';
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
    label: { EN: "STAGE 00", PT: "ETAPA 00" },
    title: { EN: `Our Services & Engagement Models`, PT: `Nossos Serviços & Modelos de Engajamento` },
    summary: { EN: `Defining your engagement model.`, PT: `Definição do modelo de engajamento.` },
    body: {
      EN: `Choose the package or point technical support that best fits your current volume and pace. Our complete solution catalog is structured to scale your operation - from file conversions to Chief Architect X17 to full Permit Sets and complex executive documentation. We recommend consulting our technical matrix under the What We Do menu to calibrate the ideal scope before starting the workflow.`,
      PT: `Escolha o pacote ou o suporte técnico pontual que melhor atenda ao volume e à velocidade atual da sua empresa. Nosso catálogo completo de soluções foi estruturado para dar escala à sua operação, incluindo desde conversões de arquivos para Chief Architect X17 até a aprovação de projetos como Permit Sets e documentação executiva de alta complexidade. Recomendamos consultar nossa matriz técnica na aba de Especialização dentro do menu What We Do para calibrar o escopo ideal antes de iniciar o fluxo de trabalho.`
    },
    cta: {
      icon: null,
      label: { EN: `VIEW SERVICE CATALOG`, PT: `VER CATÁLOGO DE SERVIÇOS` },
      path: "/services"
    }
  },
  {
    num: "01",
    icon: <Icons.MessageCircle />,
    label: { EN: "STAGE 01", PT: "ETAPA 01" },
    title: { EN: `First Contact`, PT: `Primeiro Contato` },
    summary: { EN: `Start with what you have.`, PT: `Comece com o que você tem em mãos.` },
    body: {
      EN: `You don't need a finalized or perfect project to start the process. A preliminary sketch, visual references, or a clear brief are enough for us to understand your needs and structure an accurate scope.`,
      PT: `Você não precisa chegar com um projeto definitivo ou perfeito para iniciar o fluxo. Um croqui preliminar, referências visuais ou um direcionamento claro já são suficientes para compreendermos a sua demanda e estruturarmos um escopo assertivo.`
    },
    listTitle: { EN: `START WITH WHAT YOU HAVE.`, PT: `COMECE COM O QUE VOCÊ TEM EM MÃOS.` },
    list: {
      EN: [
        <><strong>Reference Images</strong> Visual concepts, style references, and desired finishes.</>,
        <><strong>Site Information</strong> Site photos, topographic data, or simply the property address.</>,
        <><strong>Sketches or Drafts</strong> Freehand drawings or preliminary spatial zoning.</>,
        <><strong>Previous Surveys</strong> Existing floor plans in PDF, images, or legacy files you already have.</>,
        <><strong>Plot Plan or Site Plan</strong> Lot documentation that significantly accelerates our technical process.</>,
        <><strong>Intended Scope</strong> A brief description of your need - renovation, new construction, addition, or specific technical support.</>
      ],
      PT: [
        <><strong>Imagens de Referência</strong> Conceitos visuais, referências de estilo e os acabamentos que você deseja.</>,
        <><strong>Informações do Terreno</strong> Fotos do local, dados topográficos ou simplesmente o endereço da propriedade.</>,
        <><strong>Croquis ou Esboços</strong> Desenhos à mão livre ou zoneamentos espaciais preliminares.</>,
        <><strong>Levantamentos Anteriores</strong> Plantas existentes em PDF, imagens ou arquivos antigos que você já possua.</>,
        <><strong>Plot Plan ou Implantação Existente</strong> Documentação do lote que agiliza significativamente o nosso processo técnico.</>,
        <><strong>Escopo Pretendido</strong> Uma breve descrição da sua demanda, seja ela uma reforma, construção nova, ampliação (addition) ou um suporte técnico específico.</>
      ]
    },
    note: {
      title: { EN: "WHY THIS STAGE MATTERS", PT: "POR QUE ESSA ETAPA IMPORTA" },
      text: { 
        EN: `The more context you share upfront, the more accurate your estimate will be. A realistic, well-grounded estimate protects your budget from unexpected costs and sets a solid foundation for every stage that follows.`,
        PT: `Quanto mais contexto você compartilhar de início, mais preciso será o seu estimate. Uma estimativa realista e bem fundamentada protege o seu orçamento contra custos inesperados e estabelece uma base sólida para todas as etapas seguintes.`
      }
    }
  },
  {
    num: "02",
    icon: <Icons.Eye />,
    title: { EN: `Scope & Estimate`, PT: `Escopo & estimate` },
    summary: { EN: `You receive a detailed estimate.`, PT: `Você recebe um estimate detalhado.` },
    body: {
      EN: `We carefully analyze the information provided to map the project's real needs. We then build a transparent proposal specifying the exact scope, timeline, and payment terms.`,
      PT: `Analisamos minuciosamente as informações enviadas para mapear as reais necessidades do projeto. Em seguida, estruturamos uma proposta transparente, especificando o escopo exato, cronograma de prazos e as condições de pagamento.`
    },
    customLists: [
      {
        title: { EN: `YOUR ESTIMATE ALWAYS INCLUDES`, PT: `SEU ESTIMATE SEMPRE INCLUI` },
        boxClass: "service-box-gold",
        titleClass: "service-box-gold-title",
        iconColor: "#9c7c3a",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Floor plans with dimensions and technical annotations",
            "Exterior elevations - all four primary facades",
            "Detailed building sections and constructive cuts",
            "Door and window schedules",
            "Interior layout and fixture placement",
            "3D renders (per selected package)",
            "Wood framing plans (when applicable to scope)",
            "Clear payment structure - 40 / 40 / 20 model"
          ],
          PT: [
            "Plantas baixas com dimensionamentos e anotações técnicas",
            "Elevações externas - as quatro fachadas principais",
            "Cortes e seções construtivas detalhadas",
            "Schedules (quadros) de portas e janelas",
            "Layout interno e posicionamento de fixtures (peças e acabamentos fixos)",
            "Renders 3D (conforme o pacote selecionado)",
            "Plantas de Wood Framing (quando aplicável ao escopo)",
            "Estrutura de pagamento clara - modelo 40 / 40 / 20"
          ]
        }
      },
      {
        title: { EN: `SERVICES NOT INCLUDED - REQUIRE SEPARATE CONTRACTS`, PT: `SERVIÇOS NÃO INCLUÍDOS - REQUEREM CONTRATOS SEPARADOS` },
        boxClass: "service-box-red",
        titleClass: "service-box-red-title",
        iconColor: "#ef4444",
        icon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
        items: {
          EN: [
            "Structural calculations and engineering seal (PE Stamp)",
            "Complementary engineering (Electrical, Plumbing, HVAC)",
            "Site topographic survey",
            "Energy efficiency reports (HERS rating, Blower Door test)",
            "On-site technical visits or construction inspections",
            "Native editable files (.plan or .dwg) - available for a release fee"
          ],
          PT: [
            "Cálculo estrutural e assinatura/selo de engenharia (PE Stamp)",
            "Projetos complementares de Engenharia (Elétrico, Hidráulico e HVAC)",
            "Levantamento topográfico do terreno",
            "Relatórios de eficiência energética (como HERS rating ou Blower Door test)",
            "Visitas técnicas presenciais ou inspeções de obra",
            "Fornecimento de arquivos editáveis nativos (.plan ou .dwg) - disponíveis mediante taxa de liberação"
          ]
        }
      }
    ],
    note: {
      title: { EN: "WHY THIS STAGE MATTERS", PT: "POR QUE ESSA ETAPA IMPORTA" },
      text: {
        EN: `The estimate is our commercial guideline and your protection. It precisely defines what is and isn't in scope, plus the cost of each phase. At DARA Studio, we eliminate verbal agreements — every alignment is documented before technical production begins.`,
        PT: `O estimate atua como nossa diretriz comercial e a sua segurança. Ele delimita com precisão o que está contemplado e o que está descontinuado do escopo, além do custo de cada fase. No DARA Studio, eliminamos acordos verbais — documentamos cada alinhamento antes de iniciar a produção técnica.`
      }
    }
  },
  {
    num: "03",
    icon: <Icons.Clock />,
    title: { EN: `Approval & Activation`, PT: `Aprovação & Ativação` },
    summary: { EN: `Sign, pay, and we begin.`, PT: `Assine, pague e começamos.` },
    body: {
      EN: `After reviewing and signing the estimate, confirmation of the initial payment formalizes the project start date and secures immediate allocation of our production team.`,
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
            "Estimate signed digitally",
            "Initial 40% payment received and processed - only then is the project officially scheduled",
            "40% - Project Start and Conceptual Design"
          ],
          PT: [
            "Estimate revisado e todos os itens de escopo confirmados por você",
            "Estimate assinado digitalmente",
            "Pagamento inicial de 40% recebido e processado - somente então o projeto é oficialmente agendado",
            "40% - Início do Projeto e Design Conceitual"
          ]
        }
      }
    ],
    paymentMethods: {
      title: { EN: `PAYMENT METHODS & PROCESSING TIMELINES`, PT: `FORMAS DE PAGAMENTO & PRAZOS DE PROCESSAMENTO` },
      methods: [
        {
          name: { EN: `CREDIT CARD VIA STRIPE`, PT: `CARTÃO DE CRÉDITO VIA STRIPE` },
          desc: { 
            EN: <><strong>A secure payment link is sent with your invoice. We accept all major card networks.</strong></>, 
            PT: <><strong>Um link de pagamento seguro é enviado junto com a sua fatura. Aceitamos as principais bandeiras do mercado.</strong></> 
          },
          details: {
            EN: [
              <><strong>Fees:</strong> A 7.99% processing fee is added to the total project value.</>,
              <><strong>Project Start:</strong> Funds typically clear within 5-10 business days - the project enters the queue only after that.</>
            ],
            PT: [
              <><strong>Encargos:</strong> Uma taxa de processamento de 7,99% é adicionada sobre o valor total do projeto.</>,
              <><strong>Início do Projeto:</strong> O valor normalmente é compensado de 5 a 10 dias úteis - o projeto entra na fila somente após isso.</>
            ]
          }
        },
        {
          name: { EN: `WIRE TRANSFER / ACH`, PT: `WIRE TRANSFER / ACH` },
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
      title: { EN: "WHY THIS STAGE MATTERS", PT: "POR QUE ESSA ETAPA IMPORTA" },
      text: {
        EN: `We limit the number of active projects at any given time to ensure maximum technical rigor and meet every deadline. Signing alone does not reserve your slot. The project only enters our execution queue once payment is received and processed on our end, regardless of payment method.`,
        PT: `Trabalhamos com um número limitado de projetos ativos ao mesmo tempo para garantir o máximo rigor técnico e cumprir cada prazo com precisão. A assinatura isolada não reserva a sua vaga. O projeto só entra na nossa fila de execução quando o pagamento é recebido e processado do nosso lado, independentemente da forma de pagamento escolhida.`
      }
    },
    planningNote: {
      EN: `Planning Note: Your project's slot in our schedule is confirmed only after full fund clearance - not on the date of payment submission. We recommend factoring in each method's processing time when planning your project start.`,
      PT: `Nota de Planejamento: A alocação da sua demanda em nosso cronograma é validada exclusivamente após a compensação integral dos fundos, e não na data de envio do comprovante. Recomendamos considerar os prazos de processamento de cada método ao planejar o início do seu projeto.`
    }
  },
  {
    num: "04",
    icon: <Icons.Eye />,
    badge: { EN: `8–16 Business Days Per Round`, PT: `8–16 Dias úteis Por Rodada` },
    title: { EN: `Design Development & Previews`, PT: `Desenvolvimento de Design & Prévias` },
    summary: { EN: `Watch Your Project Come to Life.`, PT: `Veja Seu Projeto Ganhar Vida.` },
    body: {
      EN: `This is where your project begins. We develop your brief and deliver structured previews combining floor plans with 3D simulations - so you can visualize the real proportions and validate every element before technical detailing is finalized.`,
      PT: `É aqui que o seu projeto começa. Desenvolvemos a sua demanda e enviamos prévias estruturadas que combinam plantas baixas com simulações em 3D. Assim, você consegue visualizar a real proporção dos espaços e validar cada elemento antes que o detalhamento técnico seja finalizado.`
    },
    note: {
      title: { EN: "WHY THIS STAGE MATTERS", PT: "POR QUE ESSA ETAPA IMPORTA" },
      text: {
        EN: `Moving a wall in the design costs nothing. Moving that same wall during construction costs thousands of dollars. Preview rounds exist specifically to protect your investment - this is your opportunity to refine every detail before the project enters executive production, a phase that cannot be undone without additional cost.`,
        PT: `Mudar uma parede no projeto não custa nada. Mudar a mesma parede durante a obra custa milhares de dólares. As rodadas de prévias existem especificamente para proteger o seu investimento, sendo a sua grande oportunidade de lapidar cada detalhe antes que o projeto entre na fila de produção executiva, uma fase que não pode ser desfeita sem custos adicionais.`
      }
    },
    customLists: [
      {
        title: { EN: `HOW PREVIEW ROUNDS WORK`, PT: `COMO FUNCIONAM AS RODADAS DE PRÉVIAS` },
        boxClass: "service-box-gold",
        titleClass: "service-box-gold-title",
        iconColor: "#9c7c3a",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "We deliver the floor plan layout alongside the 3D visualization at each submission.",
            "You review the files, consolidate your feedback, and send it to us.",
            "We apply all changes systematically and return the updated preview.",
            "Each round takes 8-16 business days to develop and deliver."
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
        label: { EN: `REV 01, 02 & 03 - INCLUDED REVISION ROUNDS`, PT: `REV 01, 02 & 03 - RODADAS DE REVISÃO INCLUSAS` },
        items: {
          EN: [
            "Up to 3 alignment and refinement rounds are fully covered by your package.",
            "Each delivery within the standard 8-16 business day window.",
            "Feedback must be consolidated - partial messages or daily inputs do not count as an official revision round."
          ],
          PT: [
            "Até 3 rodadas de alinhamento e refinamento estão totalmente cobertas pelo seu pacote.",
            "Cada entrega dentro do prazo padrão de 8 a 16 dias úteis.",
            "Os feedbacks precisam ser consolidados - mensagens parciais ou feedbacks diários não contam como uma rodada de revisão oficial."
          ]
        }
      },
      extended: {
        label: { EN: `REV 04, 05, 06+ - EXTENSION MODEL BY TECHNICAL HOUR`, PT: `REV 04, 05, 06+ - MODELO DE EXTENSÃO POR HORA TÉCNICA` },
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
          EN: `Real Operational Example: You submit a request for REV 04 to move the kitchen island, adjust the master closet layout, and change two window placements. DARA Studio evaluates the technical scope and estimates 3 hours of work. We send you the clear quote of 3 hours at $95 per hour, totaling $285. You approve and pay, and we deliver the new preview within 8 to 16 business days.`,
          PT: `Exemplo Prático Operacional: Você envia os comentários para a REV 04 solicitando a mudança da ilha da cozinha, o ajuste do layout do closet principal e a alteração de duas janelas. A DARA Studio avalia o impacto técnico e projeta 3 horas de trabalho. Enviamos o orçamento claro de 3 horas a $95 por hora, resultando em $285. Você aprova e realiza o pagamento, e nós entregamos a nova prévia de 8 a 16 dias úteis.`
        }
      },
      guidelines: {
        title: { EN: `ESSENTIAL GUIDELINES - 3D & SCOPE CHANGES`, PT: `DIRETRIZES ESSENCIAIS - 3D & ALTERAÇÕES DE ESCOPO` },
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
    num: "04.1",
    icon: <Icons.FileText />,
    badge: { EN: `25–30 BUSINESS DAYS AFTER APPROVAL`, PT: `25–30 DIAS ÚTEIS APÓS APROVAÇÃO` },
    title: { EN: `Final Drawing Set`, PT: `Conjunto de Desenhos Final` },
    summary: { EN: `The complete architectural documentation package delivered in high-resolution digital format, ready for construction.`, PT: `O pacote completo de documentação arquitetônica entregue em formato digital de alta resolução, pronto para a obra.` },
    body: {
      EN: `After final design validation, our team begins full technical production of all executive construction documentation. This delivery includes fully dimensioned floor plans, detailed exterior elevations, constructive sections, and precise door and window schedules. We consolidate every detail required for permit submission and field execution. All documentation is developed strictly following US residential drafting standards within Chief Architect X17, delivered as industry-standard PDF files.`,
      PT: `Após a validação final da etapa de design, nossa equipe inicia a produção técnica de todo o detalhamento executivo para construção. Essa entrega engloba plantas baixas totalmente cotadas, elevações externas detalhadas, cortes construtivos e as tabelas exatas de portas e janelas. Agrupamos todos os detalhes necessários para a submissão de alvarás e orientação do canteiro de obras. Toda a documentação é desenvolvida seguindo rigorosamente as normas norte-americanas de desenho residencial diretamente no sistema do Chief Architect X17, garantindo a entrega em arquivos PDF que são o padrão absoluto da indústria.`
    },
    note: {
      EN: `Timeline may vary depending on project complexity, requested revisions, and technical coordination throughout development.`,
      PT: `O prazo pode variar dependendo da complexidade do projeto, revisões solicitadas e coordenação técnica durante o desenvolvimento do projeto.`
    }
  },
  {
    num: "05",
    icon: <Icons.FileText />,
    iconColor: "#9c7c3a",
    iconBg: "rgba(156, 124, 58, 0.08)",
    title: { EN: `Final Set Review & Retention`, PT: `Revisão do Set Final & Retenção` },
    summary: { EN: `Precision down to the last detail.`, PT: `Precisão até o último detalhe.` },
    body: {
      EN: `Once our technical team completes the full executive drawing set, we release a low-resolution watermarked preview directly to your client portal. This stage allows you to verify that all specifications, notes, and structural elements are in full compliance before contract closure.`,
      PT: `Assim que nossa equipe técnica conclui todo o conjunto de desenhos executivos, disponibilizamos uma prévia técnica em baixa resolução com marca d'água diretamente no seu portal do cliente. Essa etapa serve para você verificar se todas as especificações, notas e elementos estruturais estão em perfeita conformidade antes do encerramento do contrato.`
    },
    note: {
      title: { EN: "WHY THIS STAGE MATTERS", PT: "POR QUE ESSA ETAPA IMPORTA" },
      text: {
        EN: `This is the safety valve of our process. It gives you absolute certainty that the material is complete and correct before your final financial transaction. Once the preview is approved, the final payment releases the full high-resolution, watermark-free files - ready for permit submission or field execution.`,
        PT: `Esta é a válvula de segurança do nosso processo. Ela traz a certeza absoluta de que o material está completo e correto antes de você realizar a última movimentação financeira. Uma vez validada a prévia, o pagamento final libera os arquivos em alta resolução e sem marcas, totalmente prontos para dar entrada na prefeitura ou guiar o canteiro de obras.`
      }
    },
    customLists: [
      {
        title: { EN: `FINAL RELEASE CHECKLIST`, PT: `CHECKLIST DE LIBERAÇÃO FINAL` },
        boxClass: "service-box-gold",
        titleClass: "service-box-gold-title",
        iconColor: "#9c7c3a",
        icon: <polyline points="20 6 9 17 4 12"/>,
        items: {
          EN: [
            "Final drawing set produced and compiled by DARA Studio",
            "Low-resolution watermarked technical preview available on portal",
            "Full file package reviewed and verified by you",
            "Final 20% milestone payment received and cleared",
            "20% - Final Drawing Set and Project Closure"
          ],
          PT: [
            "Conjunto de desenhos final produzido e compilado pela DARA Studio",
            "Prévia técnica em baixa resolução com marca d'água disponível no portal",
            "Todo o pacote de arquivos revisado e verificado por você",
            "Pagamento do milestone final de 20% recebido e compensado",
            "20% - Conjunto de Desenhos Final e Encerramento do Projeto"
          ]
        }
      }
    ],
    gantt: {
      title: { EN: `PROJECT TIMELINE & OPERATIONAL FLOW`, PT: `LINHA DO TEMPO DO PROJETO & FLUXO OPERACIONAL` },
      intro: {
        EN: `For full timeline transparency, here is how your project advances through our production calendar - calculated from the moment funds clear and kickoff is authorized.`,
        PT: `Para garantir total transparência em relação aos prazos, veja como a sua demanda avança dentro do nosso calendário de produção, calculada a partir do momento em que os fundos são compensados e o kickoff é autorizado.`
      },
      note: {
        EN: `Production cycles are dynamic. While main phases operate within an 8-16 business day window, your project's overall pace depends directly on how quickly consolidated feedback is submitted through your portal.`,
        PT: `Os ciclos de produção são dinâmicos. Embora as fases principais aconteçam na janela de 8 a 16 dias úteis, a velocidade total do seu projeto depende diretamente da rapidez com que os seus feedbacks consolidados são enviados no nosso portal.`
      },
      phases: [
        {
          label: { EN: `Phase 1: Initial Alignment & Scope Validation`, PT: `Fase 1: Alinhamento Inicial & Validação de Escopo` },
          duration: { EN: `1-3 Business Days · 20%`, PT: `1 a 3 Dias Úteis · 20%` }
        },
        {
          label: { EN: `Phase 2: First Design Preview Delivery`, PT: `Fase 2: Entrega da Primeira Prévia de Design` },
          duration: { EN: `8-16 Business Days · 40%`, PT: `8 a 16 Dias Úteis · 40%` }
        },
        {
          label: { EN: `Phase 3: Adjustment and Revision Cycles (REV 01-03)`, PT: `Fase 3: Ciclos de Ajuste e Revisão (REV 01 a REV 03)` },
          duration: { EN: `8-16 Business Days per round · 60%`, PT: `8 a 16 Dias Úteis por rodada · 60%` }
        },
        {
          label: { EN: `Phase 4: Technical Production & Final Set Compilation`, PT: `Fase 4: Produção Técnica & Compilação do Set Final` },
          duration: { EN: `8-16 Business Days · 80%`, PT: `8 a 16 Dias Úteis · 80%` }
        },
        {
          label: { EN: `Phase 5: Quality Control Review, Final 20% Release & Closure`, PT: `Fase 5: Revisão de Controle de Qualidade, Liberação dos 20% e Encerramento` },
          duration: { EN: `1-3 Business Days · 100%`, PT: `1 a 3 Dias Úteis · 100%` }
        }
      ]
    }
  },
  {
    num: "05.1",
    icon: <Icons.Clock />,
    iconColor: "#9c7c3a",
    iconBg: "rgba(123, 31, 162, 0.08)",
    title: { EN: `Technical Hour Rates & Post-Delivery Support`, PT: `Tabela de Horas Técnicas & Suporte Pós-Entrega` },
    summary: {
      EN: `Executive projects are dynamic and municipal requirements can change.`,
      PT: `Projetos executivos são dinâmicos e as exigências municipais podem mudar.`
    },
    body: {
      EN: `If your project requires modifications beyond the original package or after contract closure, our structure offers on-demand support through a highly predictable technical hour model.`,
      PT: `Se a sua demanda exigir modificações além do pacote original ou após o encerramento do contrato, nossa estrutura oferece suporte sob demanda através de um modelo de hora técnica altamente previsível.`
    },
    paymentMethods: {
      title: { EN: `TECHNICAL HOUR RATES FOR OUT-OF-SCOPE & POST-DELIVERY ITEMS`, PT: `VALORES DE HORA TÉCNICA PARA ITENS FORA DO ESCOPO E PÓS-ENTREGA` },
      methods: [
        {
          name: { EN: `TECHNICAL DRAFTING & PROJECT MODIFICATIONS`, PT: `DESENHO TÉCNICO E MODIFICAÇÕES DE PROJETO` },
          desc: { EN: `Fixed at $95 per hour.`, PT: `Fixado em $95 por hora.` },
          details: {
            EN: ["Covers any layout changes, code corrections requested by public agencies, or structural calibrations within Chief Architect X17."],
            PT: ["Cobre qualquer alteração de layout, correções de código solicitadas por órgãos públicos ou calibrações estruturais dentro do sistema Chief Architect X17."]
          }
        },
        {
          name: { EN: `ON-DEMAND TECHNICAL MEETINGS`, PT: `REUNIÕES TÉCNICAS SOB DEMANDA` },
          desc: { EN: `Fixed at $95 per hour.`, PT: `Fixado em $95 por hora.` },
          details: {
            EN: ["Applies to dedicated video calls or phone consultations needed to discuss scope changes after a stage has been closed."],
            PT: ["Aplica-se a videoconferências dedicadas ou alinhamentos telefônicos necessários para debater mudanças de escopo após uma etapa ser encerrada."]
          }
        },
        {
          name: { EN: `GENERAL TECHNICAL CONSULTING`, PT: `CONSULTORIA TÉCNICA GERAL` },
          desc: { EN: `Fixed at $95 per hour.`, PT: `Fixado em $95 por hora.` },
          details: {
            EN: ["Includes in-depth analysis of zoning code changes or specific municipal regulations outside the initial contract."],
            PT: ["Inclui análises profundas de mudanças em códigos de zoneamento ou leis municipais específicas que estejam fora do contrato inicial."]
          }
        }
      ]
    },
    revisionSystem: {
      included: {
        label: { EN: `30-DAY POST-DELIVERY TECHNICAL WARRANTY - WHAT'S INCLUDED`, PT: `GARANTIA TÉCNICA DE 30 DIAS PÓS-ENTREGA - O QUE ESTÁ INCLUSO` },
        items: {
          EN: [
            "Each final drawing set includes a 30-day technical support period from the date of high-resolution file release.",
            "If the municipality or local building department issues correction notes (redlines) within this period, our team will apply the adjustments in Chief Architect X17 at no additional cost.",
            "Valid only when corrections do not alter the previously approved architectural layout, built area, or structural scope."
          ],
          PT: [
            "Cada conjunto de desenhos final possui um período de suporte técnico de 30 dias corridos, contados a partir da data de liberação dos arquivos em alta resolução.",
            "Se a prefeitura ou o departamento de construções local emitir notas de correção (redlines) dentro desse prazo, nossa equipe aplicará os ajustes no Chief Architect X17 sem qualquer custo adicional.",
            "Válido exclusivamente quando as correções não alterem o layout arquitetônico já aprovado, a área construída ou o escopo estrutural."
          ]
        }
      },
      extended: {
        label: { EN: `WHAT IS NOT COVERED BY THE WARRANTY`, PT: `O QUE NÃO FAZ PARTE DA GARANTIA` },
        steps: {
          EN: [
            "Any adjustment request driven by a change of mind, structural layout changes, or correction requests received after the 30-day period will be billed at the standard rate of $95 per technical hour."
          ],
          PT: [
            "Qualquer solicitação de ajuste motivada por mudança de ideia, alterações no layout estrutural ou pedidos de correção recebidos após o término do prazo de 30 dias serão faturados com base no valor padrão de $95 por hora técnica."
          ]
        }
      }
    }
  },
  {
    num: "06",
    icon: <Icons.Shield />,
    iconColor: "#9c7c3a",
    iconBg: "rgba(123, 31, 162, 0.08)",
    title: { EN: `Administrative Terms & Conditions`, PT: `Termos & Condições Administrativas` },
    summary: {
      EN: `Clear guidelines for communication and deadline management throughout the contract.`,
      PT: `Diretrizes claras para a comunicação e o gerenciamento de prazos ao longo do contrato.`
    },
    body: {
      EN: `To maintain the high execution speed and technical rigor that define DARA Studio, we establish clear guidelines for our daily communication and deadline management throughout the contract.`,
      PT: `Para manter a alta velocidade de execução e o rigor técnico que definem a DARA Studio, estabelecemos diretrizes claras para a nossa comunicação diária e para o gerenciamento de prazos ao longo do contrato.`
    },
    paymentMethods: {
      title: { EN: `COMMUNICATION PROTOCOLS`, PT: `PROTOCOLOS DE COMUNICAÇÃO` },
      methods: [
        {
          name: { EN: `CENTRALIZED CHANNELS`, PT: `CANAIS CENTRALIZADOS` },
          desc: { EN: `The client portal and WhatsApp are the only official channels for updates, file submissions, and feedback.`, PT: `O portal do cliente e o atendimento via WhatsApp são os únicos canais oficiais para atualizações, envios de arquivos e recebimento de feedbacks.` },
          details: {
            EN: ["We do not use voice messages for design approvals or changes — every technical alignment must be fully documented and traceable."],
            PT: ["Não utilizamos mensagens de áudio para aprovações ou alterações de design, pois cada alinhamento técnico precisa ser totalmente documentado e rastreável."]
          }
        },
        {
          name: { EN: `RESPONSE WINDOWS`, PT: `JANELAS DE RESPOSTA` },
          desc: { EN: `Our standard response time is 2–4 business hours, with up to 24‑hour technical depth.`, PT: `Nosso tempo padrão de retorno é de 2–4 horas úteis, com profundidade técnica de até 24 horas.` },
          details: {
            EN: ["For deeply technical questions or structural revisions that require detailed analysis from our drafting team, we allow up to 24 business hours for a complete response."],
            PT: ["Para dúvidas profundamente técnicas ou revisões estruturais que exigem análise detalhada da equipe de desenho, permitimos até 24 horas úteis para resposta completa."]
          }
        },
        {
          name: { EN: `INACTIVITY PERIODS & CONTRACT EXPIRATION`, PT: `PRAZOS DE INATIVIDADE & EXPIRAÇÃO DE CONTRATO` },
          details: {
            EN: ["On‑Hold Status: If project progress stalls due to missing feedback, delayed approvals, or absent documents for more than 45 consecutive days, the original contract becomes void."],
            PT: ["Status em Espera: Se o andamento do projeto ficar estagnado por falta de feedbacks, atrasos em aprovações ou ausência de documentos por mais de 45 dias seguidos, o contrato original perde a validade."]
          }
        },
        {
          name: { EN: `REACTIVATION STRUCTURE`, PT: `ESTRUTURA DE REATIVAÇÃO` },
          desc: { EN: `To reinsert an inactive project back into our production queue after the 45‑day limit, a reactivation fee equivalent to 15% of the total estimate value will be charged.`, PT: `Para reinserir um projeto inativo de volta à nossa linha de produção após o limite de 45 dias, será cobrada uma taxa de reativação equivalente a 15% do valor total do estimate.` },
          details: {
            EN: ["The project will be repositioned in the queue according to our current availability — original timelines and schedules will be recalculated."],
            PT: ["O projeto será reposicionado na fila de acordo com a nossa disponibilidade atual — os prazos e cronogramas originais serão recalculados."]
          }
        }
      ]
    },

  },
  {
    num: "06.1",
    icon: <Icons.Target />,
    iconColor: "#9c7c3a",
    iconBg: "rgba(156, 124, 58, 0.1)",
    label: { EN: "STAGE 06.1", PT: "ETAPA 06.1" },
    title: { EN: `Welcome to DARA Studio`, PT: `Seja Bem-Vindo à DARA Studio` },
    body: {
      EN: `We are ready to structure and scale your architectural demand. Now that your project is officially activated and positioned in our production queue, we will guide you through the initial steps to ensure full alignment before technical drawings begin.`,
      PT: `Estamos prontos para estruturar e dar escala à sua demanda arquitetônica. Agora que o seu projeto está oficialmente ativado e posicionado na nossa linha de produção, vamos guiar você pelas etapas iniciais para garantir total alinhamento antes do início dos desenhos técnicos.`
    },
    cta: {
      label: { EN: `START MY PROJECT`, PT: `INICIAR MEU PROJETO` },
      path: "/estimate"
    }
  },
  {
    num: "07",
    icon: <Icons.Package />,
    iconColor: "#9c7c3a",
    iconBg: "rgba(156, 124, 58, 0.1)",
    listIconColor: "#9c7c3a",
    title: { EN: `What's Included`, PT: `O Que Está Incluído` },
    summary: { EN: `Depending on the selected package, deliverables may include:`, PT: `Dependendo do pacote selecionado, as entregas podem incluir:` },
    list: {
      EN: [
        "Architectural floor plans & Exterior elevations",
        "Basic building sections & Layout planning",
        "Kitchen and bathroom layouts",
        "Equipment and fixture placement",
        "Door and window schedules",
        "Dimensioned construction drawings",
        "3D visualization (if included)"
      ],
      PT: [
        `Plantas baixas arquitetônicas & Elevações externas`,
        `Cortes básicos do edifício & Planejamento de layout`,
        "Layouts de cozinha e banheiro",
        "Posicionamento de equipamentos e fixtures",
        "Tabelas de portas e janelas",
        `Desenhos de construção dimensionados`,
        `Visualização 3D (se inclusa)`
      ]
    },
    note: { EN: `All drawings are prepared in accordance with US residential drafting standards.`, PT: `Todos os desenhos são preparados de acordo com práticas padrão de desenho residencial dos EUA.` }
  },
  {
    num: "08",
    icon: <Icons.XIcon />, // red X icon
    iconColor: "#9c7c3a",
    iconBg: "rgba(233, 30, 99, 0.1)",
    listIconColor: "#9c7c3a",
    listIcon: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    label: { EN: "STAGE 08", PT: "ETAPA 08" },
    title: { EN: `What's Not Included`, PT: `O Que Não Está Incluído` },
    summary: { EN: `To maintain clarity and compliance, the following are not part of our scope:`, PT: `Para manter clareza e conformidade, os seguintes não fazem parte do nosso escopo:` },
    listTitle: { EN: `TO MAINTAIN CLARITY AND COMPLIANCE, THE FOLLOWING ARE NOT PART OF OUR SCOPE:`, PT: `PARA MANTER CLAREZA E CONFORMIDADE, OS SEGUINTES NÃO FAZEM PARTE DO NOSSO ESCOPO:` },
    list: {
      EN: [
        "Structural engineering calculations",
        "Engineer stamp or sealed drawings",
        "Full electrical, plumbing, and HVAC design",
        "Topographic surveys",
        "Soil testing or geotechnical reports",
        "Energy compliance reports",
        "On-site visits or inspections"
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
    note: { EN: `When required, licensed professionals must be hired locally by the client.`, PT: `Quando necessário, profissionais licenciados devem ser contratados localmente pelo cliente.` }
  },
  {
    num: "09",
    icon: <Icons.Shield />, // shield icon
    label: { EN: "STAGE 09", PT: "ETAPA 09" },
    title: { EN: `Compliance and Responsibility`, PT: `Conformidade e Responsabilidade` },
    summary: { EN: `Our drawings are intended for project development and permit documentation support.`, PT: `Nossos desenhos são destinados ao desenvolvimento do projeto e suporte à documentação de alvará.` },
    body: {
      EN: `Final approval is subject to review by local authorities and licensed engineers, when required by state or municipal regulations.`,
      PT: `A aprovação final está sujeita à revisão por autoridades locais e engenheiros licenciados, quando exigido pelas regulamentações estaduais ou municipais.`
    },
    listTitle: { EN: `OUR DRAWINGS ARE INTENDED FOR PROJECT DEVELOPMENT AND PERMIT DOCUMENTATION SUPPORT.`, PT: `NOSSOS DESENHOS SÃO DESTINADOS AO DESENVOLVIMENTO DO PROJETO E SUPORTE À DOCUMENTAÇÃO DE ALVARÁ.` },
    list: {
      EN: [
        "Hire licensed structural engineers (if required)",
        "Coordinate any required technical reports",
        "Verify local zoning and code restrictions"
      ],
      PT: [
        "Contratar engenheiros estruturais licenciados (se exigido)",
        "Coordenar relatórios técnicos necessários",
        "Verificar restrições de zoneamento e código local"
      ]
    },
    note: { EN: `We design in alignment with U.S. standards; final compliance depends on the local jurisdiction.`, PT: `Projetamos em alinhamento com padrões dos EUA; a conformidade final depende da jurisdição local.` }
  },


  {
    num: "10",
    icon: <Icons.MessageCircle />,
    label: { EN: "STAGE 10", PT: "ETAPA 10" },
    title: { EN: `Meetings and Communication`, PT: `Reuniões e Comunicação` },
    summary: { EN: `DA·RA Studio operates 100% remotely with a structured digital workflow.`, PT: `O DA·RA Studio opera 100% remotamente com um fluxo de trabalho digital estruturado.` },
    body: {
      EN: `We do not offer video calls or in-person meetings. All project coordination is handled exclusively via WhatsApp and our Client Portal.`,
      PT: `Não oferecemos chamadas de vídeo ou reuniões presenciais. Toda a coordenação do projeto é feita exclusivamente via WhatsApp e nosso Portal do Cliente.`
    },
    listTitle: { EN: `DA·RA STUDIO OPERATES 100% REMOTELY WITH A STRUCTURED DIGITAL WORKFLOW.`, PT: `O DA·RA STUDIO OPERA 100% REMOTAMENTE COM UM FLUXO DE TRABALHO DIGITAL ESTRUTURADO.` },
    list: {
      EN: [
        "Fully online project management",
        "Direct communication via WhatsApp during business hours",
        "Continuous updates at every phase",
        "Portal access for files, deadlines, and invoices"
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
    num: "11",
    icon: <Icons.Star />, // star icon
    label: { EN: "STAGE 11", PT: "ETAPA 11" },
    title: { EN: `Why DARA Studio`, PT: `Por Que o DARA Studio` },
    summary: { EN: `We serve clients in the United States and Brazil with precision and speed.`, PT: `Atendemos clientes nos Estados Unidos e Brasil com precisão e velocidade.` },
    listTitle: { EN: `WE SERVE CLIENTS IN THE UNITED STATES AND BRAZIL WITH PRECISION AND SPEED.`, PT: `ATENDEMOS CLIENTES NOS ESTADOS UNIDOS E BRASIL COM PRECISÃO E VELOCIDADE.` },
    list: {
      EN: [
        "Code-driven documentation (IRC, IBC, NBR)",
        "Execution-focused project drawings",
        "Efficient delivery timelines",
        "Clear professional scope and boundaries",
        "Trusted by developers and builders",
        "100% remote workflow"
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
  const { lang } = useAppContext();
  const navigate = useNavigate();
  const [openAccordion, setOpenAccordion] = React.useState(STEPS.map((_, i) => i));

  const toggleAccordion = (idx) => {
    setOpenAccordion(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleStartProject = () => { navigate('/estimate'); };

  return (
    <PageTransition variant="fade">
      <div className="lp-root services-page-root">
        {/* Brilho radial verde suave no topo centralizado */}
        <div className="radial-glow"></div>
        <div className="radial-glow-navy"></div>
        <Navbar />
        <main className="independent-page">

          {/* Header */}
          <header className="editorial-header animate-float-up">
            {/* Top Divider */}
            <div className="preview-header">
              <h2 className="preview-title">(03) METHOD</h2>
              <div className="preview-line"></div>
              <h2 className="preview-title">8-16 DAY CYCLES</h2>
            </div>

            {/* Main Content */}
            <div className="editorial-content">
              <h1 className="editorial-title" style={{ display: 'flex', flexDirection: 'column' }}>
                {lang === 'EN' ? (
                  <>
                    <span>Process &</span>
                    <span className="editorial-title-italic">Professional Scope</span>
                  </>
                ) : (
                  <>
                    <span>Processo &</span>
                    <span className="editorial-title-italic">Escopo Profissional</span>
                  </>
                )}
              </h1>
              <p className="editorial-subtitle">
                {lang === 'EN' 
                  ? 'We eliminate distance through a structured, agile, and 100% remote workflow designed specifically for builders, developers, and demanding owners. All technical coordination and delivery management happen directly via WhatsApp and our client portal, ensuring full control of your project in real time.'
                  : 'Eliminamos a distância com um fluxo de trabalho estruturado, ágil e 100% remoto, projetado especificamente para construtores, incorporadores e proprietários exigentes. Toda a coordenação técnica e o gerenciamento das entregas acontecem direto via WhatsApp e no nosso portal do cliente, garantindo controle absoluto do seu projeto em tempo real.'}
              </p>
            </div>

            {/* The Benefit Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'flex-start', marginBottom: '40px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                {lang === 'EN' ? 'THE BENEFIT' : 'O BENEFÍCIO'}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '18px', lineHeight: 1.5, color: 'var(--text-color)' }}>
                {lang === 'EN' 
                  ? 'The security of a rigorous executive process with the agility the real estate market demands. No noise, no bureaucracy, full transparency.'
                  : 'A segurança de um processo executivo rigoroso com a agilidade que o mercado imobiliário exige. Sem ruídos, sem burocracia, com total transparência.'}
              </div>
            </div>

            {/* Bottom Divider */}
            <div className="preview-header">
              <h2 className="preview-title">
                <span style={{  marginRight: '8px' }}>(A)</span>
                {lang === 'EN' ? 'THE ENGAGEMENT FLOW' : 'O FLUXO DE ENGAJAMENTO'}
              </h2>
              <div className="preview-line"></div>
            </div>
          </header>

          {/* Engagement Flow Accordion */}
          <div className="engagement-accordion-wrap">
            {STEPS.map((step, idx) => (
                  <div key={step.num} className="engagement-accordion-item">
                <button 
                  className="engagement-accordion-header" 
                  onClick={() => toggleAccordion(idx)}
                >
                  <span className="accordion-num">{step.num}</span>
                  <span className="accordion-title">{step.title[lang]}</span>
                  <span className={`accordion-icon ${openAccordion.includes(idx) ? 'open' : ''}`}>
                    {openAccordion.includes(idx) ? '-' : '+'}
                  </span>
                </button>
                <div className={`engagement-accordion-body ${openAccordion.includes(idx) ? 'open' : ''}`}>
                  <div className="step-card-split accordion-content-inner" style={{ border: 'none', padding: '0 0 40px', background: 'transparent' }}>
                    <div className="step-col-left">
                      {step.badge && (
                        <div className="service-output-badge" style={{ alignSelf: 'flex-start' }}>{step.badge[lang]}</div>
                      )}

                      {step.summary && (
                        <p className="service-desc" style={{ margin: '0 0 16px 0', fontWeight: 600, color: 'var(--text-color)' }}>{step.summary[lang]}</p>
                      )}

                      {step.body && (
                        <p className="service-desc" style={{ margin: 0 }}>{step.body[lang]}</p>
                      )}

                      {step.note && (
                        <div className="service-disclaimer" style={{ 
                          marginTop: 'auto', 
                          padding: '16px', 
                          borderLeft: '2px solid var(--text-color)', 
                          background: 'rgba(255,255,255,0.02)' 
                        }}>
                          {typeof step.note === 'object' && step.note.title ? (
                            <>
                              <div style={{ fontSize: '10px', letterSpacing: '0.15em', fontFamily: 'var(--font-mono)', marginBottom: '8px', textTransform: 'uppercase' }}>
                                {step.note.title[lang]}
                              </div>
                              <div style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
                                {step.note.text[lang]}
                              </div>
                            </>
                          ) : (
                            <div style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
                              {step.note[lang]}
                            </div>
                          )}
                        </div>
                      )}

                      {step.planningNote && (
                        <div style={{ 
                          marginTop: 'auto', 
                          padding: '24px 24px 24px 20px', 
                          borderLeft: '2px solid rgba(255,255,255,0.2)', 
                          background: 'rgba(255,255,255,0.02)' 
                        }}>
                          <div style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5 }}>
                            {step.planningNote[lang]}
                          </div>
                        </div>
                      )}

                      {step.cta && (
                        <div style={{ marginTop: 'auto' }}>
                          <button 
                            onClick={() => navigate(step.cta.path)}
                            style={{ 
                              background: '#1F3C2C', 
                              color: '#ffffff', 
                              border: 'none', 
                              borderRadius: '4px',
                              padding: '16px 28px', 
                              fontSize: '11px', 
                              fontWeight: 700,
                              letterSpacing: '0.12em', 
                              textTransform: 'uppercase', 
                              cursor: 'pointer', 
                              fontFamily: 'var(--font-sans)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease',
                              width: '100%',
                              gap: '8px'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.filter = 'brightness(1.1)';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.filter = 'brightness(1)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {step.cta.icon}{step.cta.label[lang]}
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="step-col-right">
                      {step.list && (
                        <div style={{ 
                          border: '1px solid rgba(255,255,255,0.1)', 
                          padding: '24px', 
                          background: 'rgba(0,0,0,0.1)' 
                        }}>
                          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', fontFamily: 'var(--font-sans)', marginBottom: '16px' }}>
                            {step.listTitle ? step.listTitle[lang] : step.summary[lang]}
                          </p>
                          <div className="step-item-grid">
                            {step.list && step.list[lang] && step.list[lang].map((item, i) => (
                              <div key={i} className="step-item-grid-cell">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={step.listIconColor || 'var(--color-neon-purple)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                                  {step.listIcon || <polyline points="20 6 9 17 4 12"/>}
                                </svg>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.customLists && step.customLists.map((clist, i) => (
                        <div key={i} className={clist.boxClass}>
                          <h4 className={clist.titleClass}>{clist.title[lang]}</h4>
                          <div className="step-item-grid">
                            {clist.items && clist.items[lang] && clist.items[lang].map((item, j) => (
                              <div key={j} className="step-item-grid-cell">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={clist.iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{clist.icon}</svg>
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}

                      {step.paymentMethods && (
                        <div style={{ marginTop: '24px' }}>
                          <h4 style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '16px' }}>{step.paymentMethods.title[lang]}</h4>
                          <div style={{ display: 'grid', gap: '16px' }}>
                            {step.paymentMethods.methods.map((method, i) => (
                              <div key={i} style={{ padding: '16px', background: 'rgba(0,0,0,0.03)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                  {method.icon && <span style={{ fontSize: '20px' }}>{method.icon}</span>}
                                  <h5 style={{ margin: 0, fontSize: '13px', fontFamily: 'var(--font-sans)', fontWeight: 700 }}>{method.name[lang]}</h5>
                                </div>
                                {method.desc && (
                                  <p style={{ fontSize: '13px', marginBottom: '12px', lineHeight: 1.5 }}>{method.desc[lang]}</p>
                                )}
                                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                  {method.details && method.details[lang] && method.details[lang].map((detail, j) => <li key={j}>{detail}</li>)}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.gantt && (
                        <div className="service-box-gold" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {step.gantt.title && step.gantt.title[lang] && (
                            <h4 className="service-box-gold-title" style={{ color: 'var(--text-color)' }}>{step.gantt.title[lang]}</h4>
                          )}
                          {step.gantt.intro && step.gantt.intro[lang] && (
                            <p style={{ fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
                              {step.gantt.intro[lang]}
                            </p>
                          )}
                          <div className="step-gantt-phases">
                            {step.gantt.phases && step.gantt.phases.map((phase, i) => (
                              <div key={i} className="step-gantt-phase-item">
                                <div style={{ fontSize: '10px', letterSpacing: '0.1em' }}>{phase.label?.[lang]}</div>
                                <div style={{ fontSize: '13px', fontWeight: 600 }}>{phase.duration?.[lang]}</div>
                                {phase.desc && phase.desc[lang] && (
                                  <div style={{ fontSize: '12px', lineHeight: 1.4 }}>{phase.desc[lang]}</div>
                                )}
                              </div>
                            ))}
                          </div>
                          {step.gantt.note && step.gantt.note[lang] && (
                            <p style={{ marginTop: '14px', fontSize: '11px', lineHeight: 1.7, fontStyle: 'italic' }}>
                              {step.gantt.note[lang]}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline & Operational Flow */}
          <div className="preview-header" style={{ marginTop: '80px', marginBottom: '24px' }}>
            <h2 className="preview-title" style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{  marginRight: '16px' }}>(B)</span>
              <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }}>{lang === "EN" ? "PROJECT TIMELINE & OPERATIONAL FLOW" : "CRONOGRAMA DO PROJETO & FLUXO OPERACIONAL"}</span>
            </h2>
            <div className="preview-line" style={{ margin: '0 0 0 16px' }}></div>
          </div>
          <div style={{ maxWidth: '900px', margin: '0 0 40px', padding: '0 20px' }}>
            <p className="editorial-subtitle" style={{ fontSize: '16.5px', lineHeight: 1.6, color: 'var(--text-color)' }}>
              {lang === "EN" 
                ? "For full transparency on schedule, here is how your project advances through our production calendar - measured from the moment funds clear and kickoff is authorized." 
                : "Para total transparência no cronograma, eis como o seu projeto avança pelo nosso calendário de produção - medido a partir do momento em que os fundos são liberados e o início é autorizado."}
            </p>
          </div>

          <div className="timeline-grid">
            <div className="timeline-card">
              <div className="timeline-phase">PHASE 1</div>
              <div className="timeline-line-container"><div className="timeline-line-progress" style={{ width: '20%' }}></div></div>
              <div className="timeline-title">{lang === "EN" ? "Initial alignment & scope validation" : "Alinhamento inicial & validação de escopo"}</div>
              <div className="timeline-duration">{lang === "EN" ? "1-3 business days" : "1-3 dias úteis"}</div>
              <div className="timeline-percentage">20%</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-phase">PHASE 2</div>
              <div className="timeline-line-container"><div className="timeline-line-progress" style={{ width: '40%' }}></div></div>
              <div className="timeline-title">{lang === "EN" ? "First design preview delivered" : "Primeira prévia de design entregue"}</div>
              <div className="timeline-duration">{lang === "EN" ? "8-16 business days" : "8-16 dias úteis"}</div>
              <div className="timeline-percentage">40%</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-phase">PHASE 3</div>
              <div className="timeline-line-container"><div className="timeline-line-progress" style={{ width: '60%' }}></div></div>
              <div className="timeline-title">{lang === "EN" ? "Adjustment & revision cycles (REV 01-03)" : "Ciclos de ajuste & revisão (REV 01-03)"}</div>
              <div className="timeline-duration">{lang === "EN" ? "8-16 days / round" : "8-16 dias / rodada"}</div>
              <div className="timeline-percentage">60%</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-phase">PHASE 4</div>
              <div className="timeline-line-container"><div className="timeline-line-progress" style={{ width: '80%' }}></div></div>
              <div className="timeline-title">{lang === "EN" ? "Technical production & final set compilation" : "Produção técnica & compilação do set final"}</div>
              <div className="timeline-duration">{lang === "EN" ? "8-16 business days" : "8-16 dias úteis"}</div>
              <div className="timeline-percentage">80%</div>
            </div>
            <div className="timeline-card">
              <div className="timeline-phase">PHASE 5</div>
              <div className="timeline-line-container"><div className="timeline-line-progress" style={{ width: '100%' }}></div></div>
              <div className="timeline-title">{lang === "EN" ? "QA review, 20% release & closeout" : "Revisão QA, liberação de 20% & encerramento"}</div>
              <div className="timeline-duration">{lang === "EN" ? "1-3 business days" : "1-3 dias úteis"}</div>
              <div className="timeline-percentage">100%</div>
            </div>
          </div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px 80px' }}>
            <p style={{ fontSize: '12px', lineHeight: 1.6, fontFamily: 'var(--font-sans)', color: 'var(--text-color)' }}>
              {lang === "EN" 
                ? "Production cycles are dynamic. While the main phases run in the 8-16 business-day window, your total speed depends directly on how quickly your consolidated feedback is sent through our portal."
                : "Os ciclos de produção são dinâmicos. Embora as fases principais ocorram na janela de 8 a 16 dias úteis, a sua velocidade total depende diretamente de quão rápido o seu feedback consolidado é enviado através do nosso portal."}
            </p>
          </div>

          {/* Dark CTA Section */}
          <div className="hww-dark-cta">
            <div className="hww-dark-cta-inner">
              <div>
                <div className="hww-cta-welcome">{lang === "EN" ? "WELCOME" : "BEM-VINDO"}</div>
                <h2 className="hww-cta-title">{lang === "EN" ? "Ready to structure and scale your architectural demand." : "Pronto para estruturar e escalar sua demanda arquitetônica."}</h2>
              </div>
              <div>
                <p className="hww-cta-desc">
                  {lang === "EN" 
                    ? "Once your project is activated and queued, we guide you through the initial steps to ensure full alignment before technical drawings begin."
                    : "Assim que o seu projeto é ativado e enfileirado, nós o guiamos pelos passos iniciais para garantir alinhamento total antes do início dos desenhos técnicos."}
                </p>
                <button className="hww-cta-btn" onClick={handleStartProject}>
                  {lang === "EN" ? "START MY PROJECT" : "INICIAR MEU PROJETO"}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}

