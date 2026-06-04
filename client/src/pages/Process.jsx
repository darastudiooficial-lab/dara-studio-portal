import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';
import PageTransition from '../components/PageTransition';

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: { EN: "Proposal Approval", PT: "Aprovação da Proposta" },
    desc: { 
      EN: "Project scope and pricing are confirmed. Once approved and the initial deposit is made, your project slot is secured in our production schedule.",
      PT: "Escopo e preços são confirmados. Após a aprovação e o depósito inicial, sua vaga no projeto é garantida em nosso cronograma."
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
          <span style={{ fontSize: 11, color: "var(--brand-purple)", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase", opacity: 0.7 }}>Workflow</span>
          <h1 className="page-main-title">
            {lang === "EN" ? "How We Work" : "Como Trabalhamos"}
          </h1>
          <p className="page-subtitle-standard">
            {lang === "EN" 
              ? "We follow a structured, fully remote digital workflow — no in-person meetings. All coordination happens via WhatsApp and our client portal." 
              : "Seguimos um fluxo de trabalho digital estruturado e totalmente remoto — sem reuniões presenciais. Toda a coordenação acontece via WhatsApp e nosso portal do cliente."}
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
              </div>
            ))}
          </div>
        </main>
      <Footer />
    </div>
    </PageTransition>
  );
}
