import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DaraLogo from './DaraLogo';

const FOOTER_CONTENT = {
  EN: {
    address: `SC, Brazil · Worldwide Remote Support`,
    drafting: "Architectural Production & CAD Drafting",
    copyright: <>WORLDWIDE ARCHITECTURAL <br />PRODUCTION & REMOTE TECHNICAL SUPPORT</>,
    legal: <>All technical documentation and design assets are the <br />exclusive property of DARA Studio and its global partners.</>,
    ipNotice: "INTELLECTUAL PROPERTY NOTICE",
    confidentiality: <>Our processes follow rigorous data-security and <br />confidentiality protocols, ensuring full protection of our <br />clients' assets.</>,
    readMore: "Read the full notice →",
    indexTitle: "INDEX",
    links: [
      { label: "Home", path: "/" },
      { label: "What We Do", path: "/services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "How It Works", path: "/how-we-work" },
      { label: "Team", path: "/team" },
      { label: "Notice", path: "/ip-notice" }
    ]
  },
  PT: {
    address: `SC, Brasil · Suporte Remoto Mundial`,
    drafting: `Produção Arquitetônica e Desenho CAD`,
    copyright: <>PRODUÇÃO ARQUITETÔNICA <br />MUNDIAL E SUPORTE TÉCNICO REMOTO</>,
    legal: <>Toda a documentação técnica e ativos de design são a <br />propriedade exclusiva da DARA Studio e de seus parceiros globais.</>,
    ipNotice: "AVISO DE PROPRIEDADE INTELECTUAL",
    confidentiality: <>Nossos processos seguem protocolos rigorosos de segurança de dados e <br />confidencialidade, garantindo total proteção ao patrimônio dos nossos <br />clientes.</>,
    readMore: "Leia o aviso completo →",
    indexTitle: "INDEX",
    links: [
      { label: "Home", path: "/" },
      { label: "What We Do", path: "/services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "How It Works", path: "/how-we-work" },
      { label: "Team", path: "/team" },
      { label: "Notice", path: "/ip-notice" }
    ]
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
            <DaraLogo size={42} variant="horizontal" />
          </div>
          <p className="footer-address">
            {T.address}<br />
            {T.drafting}
          </p>
          <a href="mailto:darastudiooficial@gmail.com" className="footer-email-link">
            darastudiooficial@gmail.com
          </a>
          <div className="footer-social-simple" style={{ gap: '10px' }}>
            <a href="https://api.whatsapp.com/send/?phone=5548996503350&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" className="footer-social-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.01 2.01c-5.51 0-9.98 4.47-9.98 9.98 0 1.94.55 3.75 1.5 5.3L2.01 22l4.87-1.49c1.51.91 3.27 1.44 5.13 1.44 5.51 0 9.98-4.47 9.98-9.98 0-5.51-4.47-9.98-9.98-9.98zm5.55 14.37c-.24.67-1.37 1.25-1.91 1.34-.51.09-1.17.15-3.32-.73-2.58-1.05-4.24-3.7-4.37-3.87-.13-.17-1.04-1.39-1.04-2.65 0-1.26.66-1.88.89-2.13.23-.25.51-.31.68-.31s.34 0 .5-.01c.15-.01.37-.06.57.43.21.51.72 1.76.79 1.88.06.13.11.28.02.45-.08.17-.13.28-.26.43-.13.15-.28.32-.39.43-.13.13-.27.27-.13.51.15.24.66 1.07 1.41 1.74.97.87 1.78 1.13 2.02 1.26.24.13.38.11.53-.06.15-.17.65-.75.82-1.01.17-.26.34-.21.57-.13.24.08 1.51.71 1.77.84.26.13.43.21.49.33.06.13.06.74-.18 1.41z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/darastudiooficial" target="_blank" rel="noreferrer" className="footer-social-box">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/>
                <path d="M12 7.163a4.837 4.837 0 1 0 0 9.674 4.837 4.837 0 0 0 0-9.674zm0 7.974a3.137 3.137 0 1 1 0-6.274 3.137 3.137 0 0 1 0 6.274zm5.143-6.712a1.14 1.14 0 1 1-2.28 0 1.14 1.14 0 0 1 2.28 0z" fill="var(--footer-bg)"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/company/darastudio-drafting-3dsupport" target="_blank" rel="noreferrer" className="footer-social-box">
              <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="var(--footer-bg)"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/daniellerabello/" target="_blank" rel="noreferrer" className="footer-social-box linkedin-text-box">
              <svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="currentColor"/>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="var(--footer-bg)"/>
              </svg>
              <span className="linkedin-name">DANIELLE</span>
            </a>
          </div>
        </div>

        {/* Zone 2 — Center: Index */}
        <div className="footer-zone zone-center">
          <p className="footer-index-title">{T.indexTitle}</p>
          <div className="footer-index-list">
            {(T.links || []).map(link => (
              <Link key={link.path} to={link.path} className="footer-index-link">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Zone 3 — Right: Copyright, Legal & IP Notice */}
        <div className="footer-zone zone-right">
          <p className="footer-copyright-main">
            © {year} DARA STUDIO · {T.copyright}
          </p>
          <p className="footer-legal">
            {T.legal}
          </p>
          <h4 className="footer-ip-title-text" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', fontWeight: '600', color: 'var(--text-color)', textAlign: 'right', letterSpacing: '0.05em', margin: '16px 0 0 0', textTransform: 'uppercase' }}>
            {T.ipNotice}
          </h4>
          <p className="footer-ip-notice-small" style={{ margin: '8px 0 4px 0' }}>
            {T.confidentiality}
          </p>
          <Link to="/ip-notice" className="footer-ip-read-more" style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: '#A1824A', textAlign: 'right', textDecoration: 'underline', textUnderlineOffset: '4px', cursor: 'pointer', display: 'block', marginTop: '8px' }}>
            {T.readMore}
          </Link>
        </div>
      </div>
    </footer>
  );
}
