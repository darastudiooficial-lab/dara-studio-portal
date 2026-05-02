import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import GlobalControls from '../components/GlobalControls';
import './ClientPortal.css';

/**
 * ClientPortal.jsx — DARA Studio
 * Refactored from unified legacy portal.
 */

/* ══ DATA CONSTANTS ══ */
const ALL_PROJECTS = [
  { id: 1, code: 'DARA-0010', address: '41 Bowdoin Ave', city: 'Dorchester, MA', service: 'New Construction — Single Family', stage: 'Detalhamento', status: 'waiting', budget: 2718, paid: 0, progress: 6, updatedAt: '18/03/2026', pending: 'Aguardando informações do cliente', client: 'Jackson Da Silva', freelancer: 'Carlos Maia', due: '15/04/2026' },
  { id: 2, code: 'DARA-0008', address: '88 Dover St', city: 'Boston, MA', service: 'Commercial Office Renovation', stage: 'Estudo Preliminar', status: 'on_track', budget: 4200, paid: 2100, progress: 50, updatedAt: '14/03/2026', pending: null, client: 'Jackson Da Silva', freelancer: 'Ana Ferreira', due: '30/06/2026' },
  { id: 3, code: 'DARA-0005', address: '215 Hampton Rd', city: 'Brookline, MA', service: 'Interior Design — Living Room', stage: 'Entrega Final', status: 'completed', budget: 1800, paid: 1800, progress: 100, updatedAt: '28/02/2026', pending: null, client: 'Maria Silva', freelancer: 'Carlos Maia', due: '28/02/2026' },
  { id: 4, code: 'DARA-0012', address: '99 Commonwealth Ave', city: 'Boston, MA', service: 'Landscape Design', stage: 'Conceituação', status: 'attention', budget: 3200, paid: 800, progress: 25, updatedAt: '10/03/2026', pending: 'Aguardando aprovação de orçamento', client: 'Robert Chen', freelancer: 'Ana Ferreira', due: '20/05/2026' },
];

const ACTIVITY = [
  { id: 1, text: 'Novo arquivo publicado em 41 Bowdoin Ave', time: '2h atrás', ico: 'F', unread: true },
  { id: 2, text: 'Fatura INV-2026-002 vence em 10 dias', time: '1d atrás', ico: '$', unread: true },
  { id: 3, text: 'Nova mensagem de Daniela (DARA Studio)', time: '2d atrás', ico: 'M', unread: false },
  { id: 4, text: 'Projeto 99 Commonwealth Ave — status: Atenção', time: '3d atrás', ico: '!', unread: false },
];

const INVOICES = [
  { id: 'INV-2026-003', project: '41 Bowdoin Ave', client: 'Jackson Da Silva', amount: 2718, entry: 1359, entryPct: 50, paid: 0, status: 'pending', due: '15/04/2026', issued: '20/03/2026', phase: 'Conceptual Design' },
  { id: 'INV-2026-002', project: '88 Dover St', client: 'Jackson Da Silva', amount: 4200, entry: 2100, entryPct: 50, paid: 2100, status: 'pending', due: '30/03/2026', issued: '14/03/2026', phase: 'Drafting & Coord.' },
  { id: 'INV-2026-001', project: '88 Dover St', client: 'Jackson Da Silva', amount: 700, entry: 700, entryPct: 100, paid: 700, status: 'paid', due: '10/03/2026', issued: '01/03/2026', phase: 'Initial Deposit' },
  { id: 'INV-2026-004', project: '215 Hampton Rd', client: 'Maria Silva', amount: 1800, entry: 900, entryPct: 50, paid: 1800, status: 'paid', due: '28/02/2026', issued: '15/02/2026', phase: 'Final Delivery' },
  { id: 'INV-2026-005', project: '99 Commonwealth Ave', client: 'Robert Chen', amount: 3200, entry: 800, entryPct: 25, paid: 800, status: 'pending', due: '20/05/2026', issued: '10/03/2026', phase: 'Landscape Design' },
];

const I18N = {
  PT: {
    dashboard: 'Dashboard',
    projects: 'Meus Projetos',
    invoices: 'Finance Overview',
    calendar: 'Calendário',
    notifications: 'Notificações',
    documents: 'Documentos',
    logout: 'Sign Out',
    settings: 'Configurações',
    welcomeBack: 'Bem-vindo de volta',
    activeProjects: 'Projetos Ativos',
    paid: 'Pago',
    pendingInvoices: 'Faturas Pendentes',
    recentProjects: 'Projetos Recentes',
    recentActivity: 'Atividade Recente',
    backToSite: 'Voltar ao Site',
    portalTitle: 'Portal do Cliente',
    welcomeTo: 'Bem-vindo ao',
    loginTitle: 'Acesse seus projetos',
    loginSub: 'Acompanhe arquivos e comunicações com a qualidade DARA Studio.',
    email: 'E-MAIL',
    password: 'SENHA',
    forgotPw: 'Esqueceu sua senha?',
    enter: 'Entrar →',
    entering: 'Entrando...',
    googleLogin: 'Entrar com Google',
    or: 'OU',
    feat1: 'Acompanhe o progresso de cada projeto em tempo real',
    feat2: 'Gerencie faturas e exporte relatórios PDF',
    feat3: 'Calendário de entregas e notificações em tempo real',
    createAccount: 'Criar Conta',
    login: 'Entrar',
    client: 'Cliente',
    freelancer: 'Colaborador',
    admin: 'Admin',
    status_waiting: 'Aguardando Cliente',
    status_on_track: 'Em Andamento',
    status_attention: 'Atenção / Atrasado',
    status_completed: 'Entregue',
    role_client: 'Portal do Cliente',
    role_freelancer: 'Portal do Colaborador',
    role_admin: 'Portal do Admin',
    total_budget: 'Orçamento Total',
    total_paid: 'Total Pago',
    balance_due: 'Saldo Devedor',
    fin_progress: 'Progresso Financeiro',
    view_all: 'Ver todos →',
  },
  EN: {
    dashboard: 'Dashboard',
    projects: 'My Projects',
    invoices: 'Finance Overview',
    calendar: 'Calendar',
    notifications: 'Notifications',
    documents: 'Documents',
    logout: 'Sign Out',
    settings: 'Settings',
    welcomeBack: 'Welcome back',
    activeProjects: 'Active Projects',
    paid: 'Paid',
    pendingInvoices: 'Pending Invoices',
    recentProjects: 'Recent Projects',
    recentActivity: 'Recent Activity',
    backToSite: 'Back to Site',
    portalTitle: 'Client Portal',
    welcomeTo: 'Welcome to',
    loginTitle: 'Access your projects',
    loginSub: 'Track files and communications with DARA Studio quality.',
    email: 'EMAIL',
    password: 'PASSWORD',
    forgotPw: 'Forgot your password?',
    enter: 'Sign In →',
    entering: 'Signing in...',
    googleLogin: 'Sign in with Google',
    or: 'OR',
    feat1: 'Track progress of each project in real-time',
    feat2: 'Manage invoices and export PDF reports',
    feat3: 'Delivery calendar and real-time notifications',
    createAccount: 'Create Account',
    login: 'Sign In',
    client: 'Client',
    freelancer: 'Collaborator',
    admin: 'Admin',
    status_waiting: 'Awaiting Client',
    status_on_track: 'On Track',
    status_attention: 'Attention / Late',
    status_completed: 'Delivered',
    role_client: 'Client Portal',
    role_freelancer: 'Collaborator Portal',
    role_admin: 'Admin Portal',
    total_budget: 'Total Budget',
    total_paid: 'Total Paid',
    balance_due: 'Balance Due',
    fin_progress: 'Financial Progress',
    view_all: 'View all →',
  }
};

const PATHS = {
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M9 22V12h6v10',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',
  rcpt: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2',
  menu: 'M3 12h18M3 6h18M3 18h18',
  back: 'M19 12H5M12 19l-7-7 7-7',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  cal: 'M8 2v3M16 2v3M3 9h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  briefcase: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0',
  file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
};

const STATUS = (lang) => ({
  waiting: { label: I18N[lang].status_waiting, bg: 'rgba(217,119,6,.08)', c: '#92400e', dot: '#d97706' },
  on_track: { label: I18N[lang].status_on_track, bg: 'rgba(99,102,241,.08)', c: '#3730a3', dot: '#6366f1' },
  attention: { label: I18N[lang].status_attention, bg: 'rgba(220,38,38,.08)', c: '#991b1b', dot: '#dc2626' },
  completed: { label: I18N[lang].status_completed, bg: 'rgba(16,185,129,.08)', c: '#065f46', dot: '#10b981' },
});

/* ══ UTILITIES ══ */
const t = (k, lang) => (I18N[lang] || I18N.PT)[k] || k;
const fmt = (n, isUS) => (isUS ? '$' : 'R$') + Number(n).toLocaleString(isUS ? 'en-US' : 'pt-BR', { minimumFractionDigits: 2 });

const Icon = ({ name, size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={PATHS[name] || ''} />
  </svg>
);

const Badge = ({ status, lang }) => {
  const st = STATUS(lang)[status] || STATUS(lang).on_track;
  return (
    <span className={`st-badge ${status}`} style={{ backgroundColor: st.bg, color: st.c, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: st.dot }}></span>
      {st.label}
    </span>
  );
};

/* ══ MAIN COMPONENT ══ */
export default function ClientPortal() {
  const navigate = useNavigate();
  const { lang, theme } = useAppContext();
  const isUS = lang === 'EN';
  const T = I18N[lang];

  const [S, setS] = useState({
    loggedIn: false,
    role: 'cliente', // 'cliente', 'freelancer', 'admin'
    page: 'dashboard',
    sbCol: false,
    busy: false,
    err: '',
    em: '',
    pw: '',
    splash: true,
    redirecting: false,
    ltab: 'in',
    showPw: false,
  });

  const userName = S.role === 'admin' ? 'Daniela' : S.role === 'freelancer' ? 'Carlos' : 'Jackson';

  useEffect(() => {
    if (S.redirecting) {
      const timer = setTimeout(() => setS(prev => ({ ...prev, redirecting: false })), 2000);
      return () => clearTimeout(timer);
    }
  }, [S.redirecting]);

  useEffect(() => {
    const timer = setTimeout(() => setS(prev => ({ ...prev, splash: false })), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setS(prev => ({ ...prev, busy: true }));
    setTimeout(() => {
      setS(prev => ({ ...prev, loggedIn: true, busy: false, redirecting: true }));
    }, 800);
  };

  if (S.redirecting) {
    return (
      <div id="redirect-screen">
        <div className="rs-content">
          <div className="rs-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h2 className="rs-title">{lang === 'PT' ? 'Bem-vindo' : 'Welcome'}, {userName}!</h2>
          <div className="rs-sub">
            {S.role === 'admin' ? 'ADMIN PORTAL' : S.role === 'freelancer' ? 'COLLABORATOR PORTAL' : 'CLIENT PORTAL'} / REDIRECTING
          </div>
          <div className="rs-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        </div>
      </div>
    );
  }

  if (S.splash) {
    return (
      <div id="splash">
        <div id="splash-bg"></div>
        <div id="splash-content">
          <div id="sp-logo-wrap"><div className="sp-logo-d">D</div></div>
          <div id="sp-name-wrap">
            <div className="sp-name">DARA STUDIO</div>
            <div className="sp-tagline">Drafting & 3D Support</div>
          </div>
          <div className="sp-line"></div>
          <div id="sp-portal">
            <div className="sp-portal-label">{T.welcomeTo}</div>
            <div className="sp-portal-title">{T.portalTitle}</div>
          </div>
          <div className="sp-bar-wrap"><div className="sp-bar"></div></div>
        </div>
      </div>
    );
  }

  if (!S.loggedIn) {
    const ROLES = [
      { v: 'cliente', ico: 'user', lbl: T.client, badge: null },
      { v: 'freelancer', ico: 'briefcase', lbl: T.freelancer, badge: { txt: 'PRO', cls: 'free' } },
      { v: 'admin', ico: 'shield', lbl: T.admin, badge: { txt: 'ADM', cls: 'admin' } },
    ];

    return (
      <div id="login-screen">
        <div className="login-left">
          <div className="login-mark">
            <div className="login-d">D</div>
            <div className="login-wm">
              <div className="lw-name">DARA STUDIO</div>
              <div className="lw-tag">DRAFTING & 3D SUPPORT</div>
            </div>
          </div>
          <h1 className="login-h1">
            {lang === 'PT' ? 'Portal' : (S.role === 'admin' ? 'Admin' : S.role === 'freelancer' ? 'Collaborator' : 'Client')}<br />
            {lang === 'PT' ? 'do' : ''} <em>{lang === 'PT' ? (S.role === 'admin' ? 'Admin' : S.role === 'freelancer' ? 'Colaborador' : 'Cliente') : 'Portal'}</em>
          </h1>
          <div className="login-line"></div>
          <p className="login-sub">{T.loginSub}</p>

          <div className="feat"><div className="feat-ico"><Icon name="folder" size={13} color="#6366f1" /></div><p className="feat-txt">{T.feat1}</p></div>
          <div className="feat"><div className="feat-ico"><Icon name="rcpt" size={13} color="#6366f1" /></div><p className="feat-txt">{T.feat2}</p></div>
          <div className="feat"><div className="feat-ico"><Icon name="cal" size={13} color="#6366f1" /></div><p className="feat-txt">{T.feat3}</p></div>

        </div>

        <div className="login-card">
          <div className="role-row">
            {ROLES.map((r, i) => (
              <React.Fragment key={r.v}>
                {i > 0 && <div className="role-sep"></div>}
                <button
                  className={`role-btn ${S.role === r.v ? 'act' : ''}`}
                  onClick={() => setS(prev => ({ ...prev, role: r.v }))}
                >
                  {r.badge && <span className={`role-badge ${r.badge.cls}`}>{r.badge.txt}</span>}
                  <span className="role-ico"><Icon name={r.ico} size={16} /></span>
                  <span className="role-lbl">{r.lbl}</span>
                </button>
              </React.Fragment>
            ))}
          </div>

          <div className="ltab-row">
            <button className={`ltab-btn ${S.ltab === 'in' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, ltab: 'in' }))}>{T.login}</button>
            <button className={`ltab-btn ${S.ltab === 'up' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, ltab: 'up' }))}>{T.createAccount}</button>
          </div>

          <div className="login-title">{T.loginTitle}</div>
          <p className="login-sub2">{T.loginSub}</p>

          <form onSubmit={handleLogin}>
            <button type="button" className="google-btn">
              <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              {T.googleLogin}
            </button>
            <div className="or-row"><div className="or-line"></div><span className="or-txt">{T.or}</span><div className="or-line"></div></div>

            <div className="lfield">
              <label>{T.email}</label>
              <input type="email" value={S.em} onChange={e => setS(prev => ({ ...prev, em: e.target.value }))} placeholder="seu@email.com" />
            </div>
            <div className="lfield">
              <label>{T.password}</label>
              <div className="lfield-wrap">
                <input type={S.showPw ? 'text' : 'password'} value={S.pw} onChange={e => setS(prev => ({ ...prev, pw: e.target.value }))} placeholder="••••••••" />
                <button type="button" className="eye-btn" onClick={() => setS(prev => ({ ...prev, showPw: !prev.showPw }))}>
                  <Icon name="eye" size={14} color="#9b99b0" />
                </button>
              </div>
            </div>

            <div className="forgot-row"><button type="button" className="forgot-btn">{T.forgotPw}</button></div>

            <button className="submit-btn" disabled={S.busy}>
              {S.busy ? T.entering : T.enter}
            </button>
          </form>
        </div>

        <div className="login-controls" style={{ position: 'fixed', top: 20, right: 20 }}>
          <GlobalControls />
        </div>

        <button className="back-to-site" onClick={() => navigate('/')}>
          <Icon name="back" size={12} /> {T.backToSite}
        </button>
      </div>
    );
  }

  const roleTitle = S.role === 'admin' ? T.role_admin : S.role === 'freelancer' ? T.role_freelancer : T.role_client;

  return (
    <div id="layout" className={theme}>
      <aside className={`sidebar ${S.sbCol ? 'col' : ''}`}>
        <div className="sb-head">
          <div className="sb-logo">D</div>
          {!S.sbCol && (
            <div className="sb-text">
              <div className="sb-name">DARA STUDIO</div>
              <div className="sb-tag">PORTAL DO CLIENTE</div>
            </div>
          )}
          <button className="sb-toggle" onClick={() => setS(prev => ({ ...prev, sbCol: !prev.sbCol }))}><Icon name="menu" /></button>
        </div>

        {!S.sbCol && (
          <div className="sb-user-profile">
            <div className="sb-user-avatar">{userName.split(' ').map(n => n[0]).join('')}</div>
            <div className="sb-user-info">
              <div className="sb-user-name">{userName} {S.role !== 'admin' && 'Da Silva'}</div>
              <div className="sb-user-role-tag">{T[S.role]}</div>
            </div>
          </div>
        )}

        <nav className="sb-nav">
          {!S.sbCol && <div className="sb-nav-group">{lang === 'PT' ? 'PRINCIPAL' : 'MAIN'}</div>}
          <button className={`nav-item ${S.page === 'dashboard' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'dashboard' }))}>
            <Icon name="home" /> <span className="nav-lbl">{T.dashboard}</span>
          </button>
          <button className={`nav-item ${S.page === 'projects' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'projects' }))}>
            <Icon name="folder" /> <span className="nav-lbl">{T.projects}</span>
          </button>
          <button className={`nav-item ${S.page === 'invoices' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'invoices' }))}>
            <Icon name="rcpt" /> <span className="nav-lbl">{T.invoices}</span>
            <span className="nav-badge">4</span>
          </button>
          <button className={`nav-item ${S.page === 'calendar' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'calendar' }))}>
            <Icon name="cal" /> <span className="nav-lbl">{T.calendar}</span>
          </button>
          <button className={`nav-item ${S.page === 'notifications' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'notifications' }))}>
            <Icon name="eye" /> <span className="nav-lbl">{T.notifications}</span>
          </button>
        </nav>

        <div className="sb-bot">
          <button className="nav-item">
            <Icon name="shield" /> <span className="nav-lbl">{T.settings}</span>
          </button>
          <button className="nav-item sign-out-btn" onClick={() => setS(prev => ({ ...prev, loggedIn: false }))}>
            <Icon name="out" /> <span className="nav-lbl">{T.logout}</span>
          </button>
          <button className="nav-item back-btn" onClick={() => navigate('/')}>
            <Icon name="back" /> <span className="nav-lbl">{T.backToSite}</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="tb-brand">
            <span style={{ opacity: 0.5 }}>DARA Studio</span> <span style={{ margin: '0 8px', opacity: 0.3 }}>|</span> <span>Client Portal</span>
          </div>
          <div className="tb-right" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <GlobalControls />
            <div className="tb-icons">
               <button className="tb-icon-btn"><Icon name="eye" size={18} /></button>
               <div className="tb-avatar">{userName[0]}</div>
            </div>
          </div>
        </header>

        <div className="page">
          <div className="page-anim">
            {S.page === 'dashboard' && (
              <>
                <h1 className="page-title">{T.welcomeBack}, {userName.split(' ')[0]}</h1>
                <p className="page-sub">{isUS ? 'Seus projetos e pendências de hoje' : 'Seus projetos e pendências de hoje'}</p>

                <div className="kpi-grid">
                  <div className="kpi">
                    <div className="kpi-label"><Icon name="folder" size={12} /> {T.activeProjects}</div>
                    <div className="kpi-val">2</div>
                    <div className="kpi-trend pos">+1 {isUS ? 'this month' : 'este mês'}</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-label"><Icon name="rcpt" size={12} /> {T.pendingInvoices}</div>
                    <div className="kpi-val">4</div>
                    <div className="kpi-trend neg">{isUS ? 'Due in 10 days' : 'Vence em 10 dias'}</div>
                  </div>
                  <div className="kpi">
                    <div className="kpi-label"><Icon name="rcpt" size={12} /> {fmt(0, isUS).split('0')[0]} {isUS ? 'Total Paid' : 'Total Pago'}</div>
                    <div className="kpi-val">{fmt(2500, isUS)}</div>
                    <div className="kpi-trend">{isUS ? 'Balance:' : 'Saldo:'} {fmt(11477, isUS)}</div>
                  </div>
                </div>

                <div className="dashboard-content">
                  <div className="dash-col-left">
                    <div className="sec-header">
                      <h3>{T.recentProjects}</h3>
                      <button className="btn-link" onClick={() => setS(prev => ({ ...prev, page: 'projects' }))}>{T.view_all}</button>
                    </div>
                    
                    <div className="project-list">
                      {ALL_PROJECTS.slice(0, 2).map(p => (
                        <div key={p.id} className="card project-card">
                          <div className="p-card-top">
                            <div>
                              <strong className="p-card-title">{p.address}</strong>
                              <div className="p-card-sub">{p.service}</div>
                              <div className="p-card-stage">{p.stage}</div>
                            </div>
                            <Badge status={p.status} lang={lang} />
                          </div>
                          <div className="p-card-progress">
                            <div className="prog-track">
                              <div className="prog-fill" style={{ width: `${p.progress}%` }}></div>
                            </div>
                            <span className="prog-pct">{p.progress}%</span>
                          </div>
                          {p.pending && (
                            <div className="p-card-alert">
                              {p.pending}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dash-col-right">
                    <div className="sec-header">
                      <h3>{T.fin_progress}</h3>
                    </div>
                    <div className="card chart-card">
                       <div className="chart-legend">
                          <div className="leg-item"><span className="dot dot-pago"></span> {T.paid}</div>
                          <div className="leg-item"><span className="dot dot-pendente"></span> {lang === 'PT' ? 'Pendente' : 'Pending'}</div>
                       </div>
                       <div className="chart-placeholder">
                          <svg width="100%" height="160" viewBox="0 0 400 160" preserveAspectRatio="none">
                             <path d="M0 140 L80 110 L160 120 L240 125 L320 115 L400 60" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                             <circle cx="0" cy="140" r="4" fill="#10b981" />
                             <circle cx="80" cy="110" r="4" fill="#10b981" />
                             <circle cx="160" cy="120" r="4" fill="#10b981" />
                             <circle cx="240" cy="125" r="4" fill="#10b981" />
                             <circle cx="320" cy="115" r="4" fill="#10b981" />
                             <circle cx="400" cy="60" r="4" fill="#10b981" />
                             <line x1="0" y1="50" x2="400" y2="50" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
                          </svg>
                          <div className="chart-labels">
                             <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span>
                          </div>
                       </div>
                    </div>

                    <div className="sec-header" style={{ marginTop: 24 }}>
                      <h3>{T.recentActivity}</h3>
                    </div>
                    <div className="card activity-card">
                      {ACTIVITY.slice(0, 3).map(a => (
                        <div key={a.id} className="activity-item">
                          <div className="act-ico">{a.ico}</div>
                          <div className="act-info">
                            <div className="act-text">{a.text}</div>
                            <div className="act-time">{a.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {S.page === 'invoices' && (
              <div className="anim">
                <div className="fin-kpi-grid">
                  <div className="fin-kpi">
                    <div className="fin-kpi-label">{T.total_budget}</div>
                    <div className="fin-kpi-val">{fmt(12500, isUS)}</div>
                  </div>
                  <div className="fin-kpi">
                    <div className="fin-kpi-label">{T.total_paid}</div>
                    <div className="fin-kpi-val" style={{ color: 'var(--gn)' }}>{fmt(8200, isUS)}</div>
                  </div>
                  <div className="fin-kpi">
                    <div className="fin-kpi-label">{T.balance_due}</div>
                    <div className="fin-kpi-val" style={{ color: 'var(--rd)' }}>{fmt(4300, isUS)}</div>
                  </div>
                </div>

                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <table className="fin-table">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Project</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Due Date</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVOICES.map(inv => (
                        <tr key={inv.id}>
                          <td style={{ fontWeight: 600 }}>{inv.id}</td>
                          <td>{inv.project}</td>
                          <td>{fmt(inv.amount, isUS)}</td>
                          <td>
                            <span className={`badge ${inv.status}`} style={{ background: inv.status === 'paid' ? 'var(--gnb)' : 'var(--amb)', color: inv.status === 'paid' ? 'var(--gn)' : 'var(--am)' }}>
                              {inv.status.toUpperCase()}
                            </span>
                          </td>
                          <td>{inv.due}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="fin-action-btn"><Icon name="eye" size={14} /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {S.page === 'projects' && (
              <div className="anim">
                <div className="card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                  {ALL_PROJECTS.map(p => (
                    <div key={p.id} className="card" style={{ padding: 20 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                        <Badge status={p.status} lang={lang} />
                        <span style={{ fontSize: 10, color: 'var(--dm)', fontWeight: 700 }}>{p.code}</span>
                      </div>
                      <h3 style={{ fontSize: 18, marginBottom: 4 }}>{p.address}</h3>
                      <p style={{ fontSize: 12, color: 'var(--mu)', marginBottom: 16 }}>{p.service}</p>

                      <div style={{ background: 'var(--lav)', borderRadius: 8, padding: 12, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 6 }}>
                          <span>{isUS ? 'Current Stage' : 'Etapa Atual'}</span>
                          <span style={{ fontWeight: 600, color: 'var(--a)' }}>{p.stage}</span>
                        </div>
                        <div className="prog"><div className="prog-bar" style={{ width: `${p.progress}%`, background: 'var(--a)' }}></div></div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--dm)' }}>
                          {isUS ? 'Updated' : 'Atualizado'}: {p.updatedAt}
                        </div>
                        <button className="btn-o" style={{ padding: '6px 12px', fontSize: 12 }}>{isUS ? 'Details' : 'Detalhes'}</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
