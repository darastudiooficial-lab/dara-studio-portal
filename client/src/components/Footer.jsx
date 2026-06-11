import React from 'react';
import { Link } from 'react-router-dom';
import DaraLogo from './DaraLogo';
import { useAppContext } from '../context/AppContext';

const FOOTER_CONTENT = {
  EN: {
    address: `SC, Brazil · Remote Support Worldwide`,
    drafting: "Architectural Production & CAD Drafting",
    copyright: "GLOBAL ARCHITECTURAL PRODUCTION & REMOTE TECHNICAL SUPPORT",
    legal: `All technical documentation, drafting files, and design assets remain the exclusive intellectual property of DARA Studio and its global partners.`,
    ipNotice: "INTELLECTUAL PROPERTY NOTICE →",
    confidentiality: "Projects are executed under strict data protection protocols and non-disclosure agreements (NDA) to guarantee absolute asset security.",
  },
  PT: {
    address: `SC, Brasil · Suporte Remoto Mundial`,
    drafting: `Produção Arquitetônica e Desenho CAD`,
    copyright: `PRODUÇÃO ARQUITETÔNICA MUNDIAL E SUPORTE TÉCNICO REMOTO`,
    legal: `Toda a documentação técnica e ativos de design são propriedade exclusiva da DARA Studio e de seus parceiros globais.`,
    ipNotice: "AVISO DE PROPRIEDADE INTELECTUAL →",
    confidentiality: `Nossos processos seguem protocolos rigorosos de segurança de dados e confidencialidade, garantindo total proteção ao patrimônio dos nossos clientes.`,
  }
};

export default function Footer() {
  const { lang } = useAppContext();
  const T = FOOTER_CONTENT[lang] || FOOTER_CONTENT.EN;
  const year = 2026;

  return (
    <footer className="new-footer animate-float-up delay-500">
      <div className="footer-container">
        {/* Zone 1 — Left: Logo + Address + Socials */}
        <div className="footer-zone zone-left">
          <div className="footer-logo-wrap">
            <DaraLogo size={22} />
            <span className="footer-logo-text">DARA<strong>Studio</strong></span>
          </div>
          <p className="footer-address">
            {T.address}<br />
            {T.drafting}
          </p>
          <a href="mailto:darastudiooficial@gmail.com" className="footer-email-link">
            darastudiooficial@gmail.com
          </a>
          <div className="footer-social-simple">
            <a href="https://wa.me/5548991234567" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
            </a>
            <a href="https://instagram.com/darastudio" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://linkedin.com/company/darastudio" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>

        {/* Zone 2 — Center: Copyright + Legal */}
        <div className="footer-zone zone-center">
          <p className="footer-copyright-main">
            © {year} DARA STUDIO · {T.copyright}
          </p>
          <p className="footer-legal">
            {T.legal}
          </p>
        </div>

        {/* Zone 3 — Right: IP Notice Link + Description + Email */}
        <div className="footer-zone zone-right">
          <Link to="/ip-notice" className="footer-ip-notice-link">
            {T.ipNotice}
          </Link>
          <p className="footer-ip-notice-small">
            {T.confidentiality}
          </p>
        </div>
      </div>
    </footer>
  );
}
