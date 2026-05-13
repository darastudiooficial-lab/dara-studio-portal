import React from 'react';
import { Link } from 'react-router-dom';
import DaraLogo from './DaraLogo';
import { useAppContext } from '../context/AppContext';

export default function Footer() {
  const { lang } = useAppContext();
  const year = 2028; // As per the reference image

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
            SC, Brazil · Remote Support Worldwide<br />
            Architectural Production & CAD Drafting
          </p>
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
            © {year} DARA STUDIO · PREMIUM ARCHITECTURAL SUPPORT
          </p>
          <p className="footer-legal">
            All drawings and technical documentation are produced for the exclusive use of DARA Studio's clients and partners. Intellectual property rights apply to all original design content.
          </p>
        </div>

        {/* Zone 3 — Right: IP Notice Link + Description + Email */}
        <div className="footer-zone zone-right">
          <Link to="/ip-notice" className="footer-ip-notice-link">
            INTELLECTUAL PROPERTY NOTICE →
          </Link>
          <p className="footer-ip-notice-small">
            Confidentiality and data protection for all projects. Technical data is processed following strict security protocols to ensure your architectural assets are safe.
          </p>
          <a href="mailto:darastudiooficial@gmail.com" className="footer-email-link">
            darastudiooficial@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
