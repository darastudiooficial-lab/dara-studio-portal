import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import DaraLogo from './DaraLogo';

const FOOTER_CONTENT = {
  EN: {
    address: `SC, Brazil · Worldwide Remote Support`,
    drafting: "Architectural Production & CAD Drafting",
    copyright: <>WORLDWIDE ARCHITECTURAL <br />PRODUCTION & REMOTE TECHNICAL SUPPORT</>,
    legal: <>All technical documentation and design assets are the <br />exclusive property of DARA Studio and its global <br />partners.</>,
    ipNotice: "INTELLECTUAL PROPERTY NOTICE",
    confidentiality: <>Our processes follow strict data security and <br />confidentiality protocols, ensuring full protection of our <br />clients' assets.</>,
    indexTitle: "Index",
    links: [
      { label: "Home", path: "/" },
      { label: "What We Do", path: "/services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "Team", path: "/team" },
      { label: "How It Works", path: "/HowWeWork" }
    ]
  },
  PT: {
    address: `SC, Brasil · Suporte Remoto Mundial`,
    drafting: `Produção Arquitetônica e Desenho CAD`,
    copyright: <>PRODUÇÃO ARQUITETÔNICA <br />MUNDIAL E SUPORTE TÉCNICO REMOTO</>,
    legal: <>Toda a documentação técnica e ativos de design são <br />propriedade exclusiva da DARA Studio e de seus parceiros <br />globais.</>,
    ipNotice: "AVISO DE PROPRIEDADE INTELECTUAL",
    confidentiality: <>Nossos processos seguem protocolos rigorosos de <br />segurança de dados e confidencialidade, garantindo total <br />proteção ao patrimônio dos nossos clientes.</>,
    indexTitle: "Index",
    links: [
      { label: "Home", path: "/" },
      { label: "What We Do", path: "/services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: "Team", path: "/team" },
      { label: "How It Works", path: "/HowWeWork" }
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
          <div className="footer-social-simple">
            <a href="https://share.google/14nAbKTvWXu3jpbDO" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </a>
            <a href="https://api.whatsapp.com/send/?phone=5548991234567&text&type=phone_number&app_absent=0" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.01 2.01c-5.51 0-9.98 4.47-9.98 9.98 0 1.94.55 3.75 1.5 5.3L2.01 22l4.87-1.49c1.51.91 3.27 1.44 5.13 1.44 5.51 0 9.98-4.47 9.98-9.98 0-5.51-4.47-9.98-9.98-9.98zm5.55 14.37c-.24.67-1.37 1.25-1.91 1.34-.51.09-1.17.15-3.32-.73-2.58-1.05-4.24-3.7-4.37-3.87-.13-.17-1.04-1.39-1.04-2.65 0-1.26.66-1.88.89-2.13.23-.25.51-.31.68-.31s.34 0 .5-.01c.15-.01.37-.06.57.43.21.51.72 1.76.79 1.88.06.13.11.28.02.45-.08.17-.13.28-.26.43-.13.15-.28.32-.39.43-.13.13-.27.27-.13.51.15.24.66 1.07 1.41 1.74.97.87 1.78 1.13 2.02 1.26.24.13.38.11.53-.06.15-.17.65-.75.82-1.01.17-.26.34-.21.57-.13.24.08 1.51.71 1.77.84.26.13.43.21.49.33.06.13.06.74-.18 1.41z"/>
              </svg>
            </a>
            <a href="https://www.instagram.com/darastudiooficial" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#fdf497" offset="0"/>
                    <stop stopColor="#fdf497" offset="0.05"/>
                    <stop stopColor="#fd5949" offset="0.45"/>
                    <stop stopColor="#d6249f" offset="0.6"/>
                    <stop stopColor="#285AEB" offset="0.9"/>
                  </linearGradient>
                </defs>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" fill="url(#ig)"/>
                <path d="M12 7.163a4.837 4.837 0 1 0 0 9.674 4.837 4.837 0 0 0 0-9.674zm0 7.974a3.137 3.137 0 1 1 0-6.274 3.137 3.137 0 0 1 0 6.274zm5.143-6.712a1.14 1.14 0 1 1-2.28 0 1.14 1.14 0 0 1 2.28 0z" fill="#fff"/>
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/daniellerabello/" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="#FFFFFF"/>
              </svg>
            </a>
            <a href="http://linkedin.com/company/darastudio-drafting-3dsupport" target="_blank" rel="noreferrer" className="footer-social-link">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/>
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="#FFFFFF"/>
              </svg>
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
          <Link to="/ip-notice" className="footer-ip-title">
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
