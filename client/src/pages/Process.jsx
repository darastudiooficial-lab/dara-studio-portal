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
    title: { EN: "Solutions & Engagement Model", PT: "Nossos Serviços & Modelos de Engajamento" },
    desc: {
      EN: "Select the precise architectural support or documentation package that aligns with your pipeline’s current demand. From high-volume CAD conversions to regulatory Permit Sets and highly detailed executive documentation, our specialized capability acts as an extension of your team. We recommend reviewing our full capabilities under What We Do → Specialization to optimize and calibrate your scope before initiating production.",
      PT: "Escolha o pacote ou o suporte técnico pontual que melhor atenda ao volume e à velocidade atual da sua empresa. Nosso catálogo completo de soluções — focado em conversões em CAD, aprovação de projetos (Permit Sets) e documentação executiva de alta complexidade — foi estruturado para dar escala à sua operação. Recomendamos consultar nossa matriz técnica na aba What We Do → Especialization para calibrar o escopo ideal antes de iniciar o fluxo de trabalho."
    },
    cta: {
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
      label: { EN: "EXPLORE CAPABILITIES & SERVICES", PT: "VER CATÁLOGO DE SERVIÇOS" },
      path: "/services"
    }
  },
  {
    num: "01",
    title: { EN: "Alignment & Commercial Proposal", PT: "Alinhamento & Proposta Comercial" },
    desc: { 
      EN: "The starting point to turn your vision into reality. We define scope, deadlines, and investment. After signing and the initial deposit, your project slot is secured.",
      PT: "O ponto de partida para transformar sua visão em realidade. Definimos escopo, prazos e investimento. Após assinatura e o sinal, sua vaga é garantida."
    }
  },
  {
    num: "02",
    title: { EN: "Design Preview", PT: "Prévia do Design" },
    badge: { EN: "8–16 Business Days", PT: "8–16 Dias Úteis" },
    desc: { 
      EN: "Initial layout and visual direction are delivered for review. Timeline: 8–16 business days from receipt of all project information.",
      PT: "Layout inicial e direção visual são entregues para revisão. Prazo: 8–16 dias úteis após o recebimento de todas as informações."
    }
  },
  {
    num: "03",
    title: { EN: "Revisions Phase", PT: "Fase de Revisões" },
    desc: { 
      EN: "Two revision rounds included to refine layout and design intent. Additional revisions available upon request.",
      PT: "Duas rodadas de revisão incluídas para refinar o layout e a intenção do design. Revisões adicionais sob consulta."
    }
  },
  {
    num: "04",
    title: { EN: "Final Drawing Set", PT: "Conjunto de Desenhos Final" },
    badge: { EN: "25–30 Business Days", PT: "25–30 Dias Úteis" },
    desc: { 
      EN: "Complete architectural drawing package delivered digitally in PDF format. Timeline: 25–30 business days after preview approval.",
      PT: "Pacote completo de desenhos arquitetônicos entregue digitalmente em PDF. Prazo: 25–30 dias úteis após aprovação da prévia."
    }
  },
  {
    num: "05",
    title: { EN: "Ongoing Coordination", PT: "Coordenação Contínua" },
    desc: { 
      EN: "We remain available via WhatsApp and the client portal to answer questions from your construction team and clarify design intent.",
      PT: "Permanecemos disponíveis via WhatsApp e portal do cliente para esclarecer dúvidas da sua equipe de obra."
    }
  }
];

export default function Process() {
  const { lang } = useAppContext();
  const navigate = useNavigate();

  return (
    <PageTransition variant="default">
    <div className="lp-root">
      {/* Brilho radial roxo suave no topo centralizado */}
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

          <div className="workflow-notice" style={{ background: 'rgba(123, 31, 162, 0.05)', border: '1px solid rgba(123, 31, 162, 0.2)', borderRadius: '16px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', width: '100%' }}>
            <div style={{ color: 'var(--brand-purple)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </div>
            <p style={{ fontSize: '14px', opacity: 0.8, fontStyle: 'italic' }}>
              {lang === "EN" 
                ? "DA·RA Studio operates 100% remotely. All coordination is handled via WhatsApp and our Client Portal. We do not offer video calls or in-person meetings."
                : "A DA·RA Studio opera 100% remotamente. Toda a coordenação é feita via WhatsApp e nosso Portal do Cliente. Não oferecemos chamadas de vídeo ou reuniões presenciais."}
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
                <p className="workflow-step-desc">{step.desc[lang]}</p>
                {step.cta && (
                  <div style={{ marginTop: '24px', width: '100%' }}>
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
        </main>
      <Footer />
    </div>
    </PageTransition>
  );
}
