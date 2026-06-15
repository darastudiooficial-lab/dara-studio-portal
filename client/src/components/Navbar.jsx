import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DaraLogo from './DaraLogo';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const NAV_TRANSLATIONS = {
  EN: {
    portal: "Client Portal",
    nav: [
      { label: `Home`, path: "/" },
      { label: `What We Do`, path: "/services" },
      { label: "Portfolio", path: "/portfolio" },
      { label: `How It Works`, path: "/how-we-work" },
      { label: "Team", path: "/team" },
      { label: `IP Notice`, path: "/ip-notice" },
    ]
  },
  PT: {
    portal: "Portal do Cliente",
    nav: [
      { label: `Home`, path: "/" },
      { label: `Especialização`, path: "/services" },
      { label: `Portfólio`, path: "/portfolio" },
      { label: `Como Trabalhamos`, path: "/how-we-work" },
      { label: "Equipe", path: "/team" },
      { label: `Aviso de IP`, path: "/ip-notice" },
    ]
  }
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, setLang, theme, toggleTheme } = useAppContext();
  const { user, profile } = useAuth();
  const T = NAV_TRANSLATIONS[lang];

  const portalPath = profile?.role === 'admin' 
    ? '/admin' 
    : (profile?.role === 'collaborator' ? '/collaborator' : '/portal');

  const isSubPage = location.pathname !== "/";

  return (
    <header className="header-nav">
      <Link to="/" className="header-logo">

        <span className="header-logo-text">
          <strong>DARA</strong><em>Studio</em>
        </span>
      </Link>

      {/* Menu centralizado — Glass Nav Links */}
      <nav className="header-center-nav">
        {T.nav.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`glass-nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          );
        })}

        {/* Builders Hub Dropdown */}
        <div className="nav-dropdown" style={{ position: 'relative', zIndex: 100 }}>
          <span className={`glass-nav-link dropdown-trigger ${["/interior-reference", "/code-inspector", "/field-guide"].includes(location.pathname) ? "active" : ""}`}>
            {lang === 'EN' ? 'Builders Hub' : 'Central do Construtor'} <span style={{ fontSize: '9px', marginLeft: '4px', opacity: 0.8 }}>▼</span>
          </span>
          <div className="dropdown-content">
            <Link to="/interior-reference" className="dropdown-item">
              {lang === 'EN' ? 'Interior Reference Guide' : `Guia de Referência de Interiores`}
            </Link>
            <Link to="/code-inspector" className="dropdown-item">
              {lang === 'EN' ? 'Code Inspector v4' : `Inspetor de Código v4`}
            </Link>
            <Link to="/field-guide" className="dropdown-item">
              {lang === 'EN' ? 'MA Code Field Guide' : 'Guia de Campo (MA Code)'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="header-actions">


        {/* Language Toggle */}
        <div className="pill-button lang-toggle">
          <span 
            className={lang === 'EN' ? 'active' : 'inactive'} 
            onClick={() => setLang('EN')}
          >
            EN
          </span>
          <span className="divider">|</span>
          <span 
            className={lang === 'PT' ? 'active' : 'inactive'} 
            onClick={() => setLang('PT')}
          >
            PT
          </span>
        </div>

        {/* Theme Toggle */}
        <button className="pill-button theme-toggle" onClick={toggleTheme}>
          <div className="theme-icon-aura">
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="half-moon-sun"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="half-moon-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </div>
        </button>

        {/* Authentication State Portal Actions */}
        {user ? (
          <>
            <Link to={portalPath} className="pill-button client-portal-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {lang === 'EN' ? 'My Portal' : 'Meu Portal'}
            </Link>
            <Link to="/logout" className="pill-button logout-btn">
              {lang === 'EN' ? 'Sign Out' : 'Sair'}
            </Link>
          </>
        ) : (
          <Link to="/login" className="pill-button client-portal-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            {T.portal}
          </Link>
        )}
      </div>
    </header>
  );
}
