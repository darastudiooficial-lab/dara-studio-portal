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

const NOTIFICATIONS_DATA = [
  { id: 1, title: 'REV00 visualizada pelo cliente', sub: 'Jackson baixou DARA-0010_REV00.zip', date: '18/03/2026 14:32', type: 'view', unread: true },
  { id: 2, title: 'Fatura INV-2026-002 vence em 10 dias', sub: 'Valor $1.400 — projeto 88 Dover St', date: '17/03/2026 09:00', type: 'invoice', unread: true },
  { id: 3, title: 'Novo ticket aberto por Maria Silva', sub: 'TKT-001 — Revisão de planta Hampton Rd', date: '16/03/2026 17:02', type: 'ticket', unread: false },
  { id: 4, title: 'Upload de comprovante pendente', sub: 'Jackson enviou comprovante fase 1', date: '14/03/2026 18:42', type: 'upload', unread: false },
  { id: 5, title: 'Novo lead cadastrado', sub: 'Amara Diallo — Diallo Properties', date: '21/03/2026 10:00', type: 'lead', unread: true },
  { id: 6, title: 'Projeto 99 Commonwealth em Atenção', sub: 'Status alterado pelo Admin', date: '13/03/2026 12:30', type: 'alert', unread: false },
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
    project_mgmt: 'Gestão de Projetos',
    require_attention: 'requerem atenção',
    projects_found: 'projetos',
    all: 'Todos',
    col_project: 'PROJETO',
    col_service: 'SERVIÇO',
    col_stage: 'STAGE',
    col_progress: 'PROGRESSO',
    col_status: 'STATUS',
    col_due: 'VENCIMENTO',
    col_budget: 'ORÇAMENTO',
    fin_ov: 'Finance Overview',
    fin_sub: 'Receitas, pagamentos e previsões',
    total_rec: 'TOTAL RECEBIDO',
    rec_month: 'RECEITA DO MÊS',
    bal_pend: 'SALDO PENDENTE',
    inv_paid: 'FATURAS PAGAS',
    net_rev: 'NET REVENUE',
    forecast: 'PREVISÃO DE RECEITA',
    pend_pay: 'Pagamentos Pendentes',
    pend_entry: 'Entradas Pendentes',
    rec_rate: 'Taxa de Recebimento',
    monthly_rev: 'Receita Mensal',
    last_6: 'Últimos 6 meses - valores recebidos',
    pend_inv: 'Faturas Pendentes',
    rec_pay: 'Pagamentos Recentes',
    method: 'MÉTODO',
    gross: 'GROSS',
    fee: 'FEE (GATEWAY)',
    net: 'NET',
    remind: 'Lembrete',
    total_gross: 'TOTAL GROSS',
    total_fees: 'TOTAL FEES',
    eff_rate: 'EFFECTIVE RATE',
    of: 'de',
    open_inv: 'faturas em aberto',
    issued: 'emitidas',
    after_fees: 'após taxas de gateway',
    export: 'Exportar',
    cal_ov: 'Calendário',
    cal_sub: 'Entregas, vencimentos e reuniões',
    proj_deliveries: 'ENTREGAS DE PROJETOS',
    month_meetings: 'REUNIÕES DO MÊS',
    active_projs: 'PROJETOS ATIVOS',
    scheduled: 'Agendadas',
    realized: 'Realizadas',
    completion_rate: 'Taxa de realização',
    completed_f: 'concluídas',
    march_events: 'Eventos de Março',
    next_due: 'Próximo vencimento',
    week: 'Semana',
    days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    unread_count: 'não lidas',
    mark_all_read: 'Marcar todas como lidas',
    settings_desc: 'Gerencie sua conta, segurança e preferências do portal',
    account: 'Conta',
    security: 'Segurança',
    acc_info: 'Informações Pessoais',
    acc_desc: 'Gerencie seus dados de contato',
    company_details: 'Informações da Empresa',
    company_desc: 'Dados corporativos e logomarca',
    tax_id: 'CNPJ / EIN',
    address: 'Endereço',
    website: 'Site / Portfolio',
    save_changes: 'Salvar Alterações',
    full_name: 'NOME COMPLETO',
    email: 'E-MAIL',
    phone: 'TELEFONE',
    company: 'EMPRESA',
    portal_lang: 'IDIOMA DO PORTAL',
    visual_theme: 'TEMA VISUAL',
    save_changes: 'Salvar Alterações',
    curr_pw: 'SENHA ATUAL',
    new_pw: 'NOVA SENHA',
    conf_pw: 'CONFIRMAR NOVA SENHA',
    add_sec: 'Segurança Adicional',
    two_fa: 'Autenticação em duas etapas',
    two_fa_desc: 'Receba um código por e-mail ao fazer login',
    session_alerts: 'Alertas de sessão',
    session_alerts_desc: 'Notifique-me ao acessar de um novo dispositivo',
    cancel: 'Cancelar',
    save_pw: 'Salvar Senha',
    portal_alerts: 'ALERTAS DO PORTAL',
    new_inv_alert: 'Novas faturas e vencimentos',
    new_inv_desc: 'Notificar quando uma fatura for gerada ou próxima ao vencimento',
    msg_chat_alert: 'Mensagens e chat de projeto',
    msg_chat_desc: 'Notificar ao receber mensagem no chat de um projeto',
    work_upd_alert: 'Atualizações de obra',
    work_upd_desc: 'Notificar quando o Admin ou Freela publicar uma atualização',
    tkt_resp_alert: 'Tickets e respostas',
    tkt_resp_desc: 'Notificar ao abrir ou receber resposta em um ticket',
    comm: 'COMUNICAÇÃO',
    news_alert: 'Novidades e conteúdo DARA',
    news_desc: 'Receber e-mails sobre novos serviços e atualizações do portal',
    save_pref: 'Salvar Preferências',
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
    project_mgmt: 'Project Management',
    require_attention: 'require attention',
    projects_found: 'projects',
    all: 'All',
    col_project: 'PROJECT',
    col_service: 'SERVICE',
    col_stage: 'STAGE',
    col_progress: 'PROGRESSO',
    col_status: 'STATUS',
    col_due: 'DUE DATE',
    col_budget: 'BUDGET',
    fin_ov: 'Finance Overview',
    fin_sub: 'Revenue, payments and forecasts',
    total_rec: 'TOTAL RECEIVED',
    rec_month: 'MONTH REVENUE',
    bal_pend: 'PENDING BALANCE',
    inv_paid: 'PAID INVOICES',
    net_rev: 'NET REVENUE',
    forecast: 'REVENUE FORECAST',
    pend_pay: 'Pending Payments',
    pend_entry: 'Pending Entries',
    rec_rate: 'Collection Rate',
    monthly_rev: 'Monthly Revenue',
    last_6: 'Last 6 months - received values',
    pend_inv: 'Pending Invoices',
    rec_pay: 'Recent Payments',
    method: 'METHOD',
    gross: 'GROSS',
    fee: 'FEE (GATEWAY)',
    net: 'NET',
    remind: 'Remind',
    total_gross: 'TOTAL GROSS',
    total_fees: 'TOTAL FEES',
    eff_rate: 'EFFECTIVE RATE',
    of: 'of',
    open_inv: 'open invoices',
    issued: 'issued',
    after_fees: 'after gateway fees',
    export: 'Export',
    cal_ov: 'Calendar',
    cal_sub: 'Deliveries, deadlines and meetings',
    proj_deliveries: 'PROJECT DELIVERIES',
    month_meetings: 'MONTH MEETINGS',
    active_projs: 'ACTIVE PROJECTS',
    scheduled: 'Scheduled',
    realized: 'Realized',
    completion_rate: 'Completion rate',
    completed_f: 'completed',
    march_events: 'March Events',
    next_due: 'Next due date',
    week: 'Week',
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    unread_count: 'unread',
    mark_all_read: 'Mark all as read',
    settings_desc: 'Manage your account, security and portal preferences',
    account: 'Account',
    security: 'Security',
    acc_info: 'Account Information',
    acc_desc: 'Your portal profile data',
    full_name: 'FULL NAME',
    email: 'E-MAIL',
    phone: 'PHONE',
    company: 'COMPANY',
    portal_lang: 'PORTAL LANGUAGE',
    visual_theme: 'VISUAL THEME',
    save_changes: 'Save Changes',
    curr_pw: 'CURRENT PASSWORD',
    new_pw: 'NEW PASSWORD',
    conf_pw: 'CONFIRM NEW PASSWORD',
    add_sec: 'Additional Security',
    two_fa: 'Two-factor authentication',
    two_fa_desc: 'Receive a code by email when logging in',
    session_alerts: 'Session alerts',
    session_alerts_desc: 'Notify me when accessing from a new device',
    cancel: 'Cancel',
    save_pw: 'Save Password',
    portal_alerts: 'PORTAL ALERTS',
    new_inv_alert: 'New invoices and due dates',
    new_inv_desc: 'Notify when an invoice is generated or near due date',
    msg_chat_alert: 'Messages and project chat',
    msg_chat_desc: 'Notify when receiving a message in a project chat',
    work_upd_alert: 'Project updates',
    work_upd_desc: 'Notify when Admin or Freelancer posts an update',
    tkt_resp_alert: 'Tickets and replies',
    tkt_resp_desc: 'Notify when opening or receiving a reply in a ticket',
    comm: 'COMMUNICATION',
    news_alert: 'DARA news and content',
    news_desc: 'Receive emails about new services and portal updates',
    acc_info: 'Personal Information',
    acc_desc: 'Manage your contact details',
    company_details: 'Company Information',
    company_desc: 'Corporate data and brand logo',
    tax_id: 'Tax ID (CNPJ/EIN)',
    address: 'Address',
    website: 'Website / Portfolio',
    save_changes: 'Save Changes',
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
  bell: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
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
    filter: 'all',
    settingsTab: 'account',
    showNotif: false,
    company: 'Jack General Services Inc.',
    profilePic: null,
    taxId: '12.345.678/0001-90',
    address: '41 Bowdoin Ave, Boston, MA',
    website: 'www.jackservices.com',
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
          <div className="sb-logo" onClick={() => setS(prev => ({ ...prev, sbCol: false }))} style={{ cursor: 'pointer' }}>D</div>
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
            <div className="sb-user-avatar">
              {S.profilePic ? <img src={S.profilePic} alt="User" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="sb-user-info">
              <div className="sb-user-name">{userName} {S.role !== 'admin' && 'Da Silva'}</div>
              <div className="sb-user-role-tag">{S.company}</div>
            </div>
          </div>
        )}

        {!S.sbCol && (
          <button className="sb-wizard-btn" onClick={() => navigate('/wizard')}>
            <Icon name="briefcase" size={14} /> <span>{lang === 'PT' ? 'Novo Orçamento' : 'New Estimate'}</span>
          </button>
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
            <Icon name="bell" /> <span className="nav-lbl">{T.notifications}</span>
          </button>
        </nav>

        <div className="sb-bot">
          <button className={`nav-item ${S.page === 'settings' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, page: 'settings' }))}>
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
               <button className="tb-icon-btn" onClick={() => setS(prev => ({ ...prev, showNotif: !prev.showNotif }))}>
                 <Icon name="bell" size={18} />
                 <span className="tb-ndot"></span>
               </button>
               <div className="tb-avatar" onClick={() => setS(prev => ({ ...prev, page: 'settings', settingsTab: 'account' }))} style={{ cursor: 'pointer', overflow: 'hidden' }}>
                 {S.profilePic ? <img src={S.profilePic} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : userName[0]}
               </div>

               {S.showNotif && (
                 <div className="notif-panel">
                    <div className="notif-head">
                       <span>{T.notifications}</span>
                       <button className="notif-close" onClick={() => setS(prev => ({ ...prev, showNotif: false }))}>×</button>
                    </div>
                    <div className="notif-body" style={{ maxHeight: 350, overflowY: 'auto' }}>
                       {NOTIFICATIONS_DATA.slice(0, 5).map(n => (
                         <div key={n.id} className={`notif-item ${n.unread ? 'unread' : ''}`}>
                            <div className="notif-ico"><Icon name="bell" size={12} /></div>
                            <div className="notif-info">
                               <div className="notif-title" style={{ fontSize: 12, fontWeight: 600 }}>{n.title}</div>
                               <div className="notif-sub" style={{ fontSize: 10, opacity: 0.7 }}>{n.date}</div>
                            </div>
                         </div>
                       ))}
                    </div>
                    <button className="notif-mark" onClick={() => {
                      setS(prev => ({ ...prev, page: 'notifications', showNotif: false }));
                    }}>
                       {lang === 'PT' ? 'Ver mais' : 'See more'} →
                    </button>
                 </div>
               )}
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
                <h1 className="page-title">{T.fin_ov}</h1>
                <p className="page-sub">{T.fin_sub}</p>

                <div className="fin-kpi-row">
                  <div className="card kpi-fin">
                    <div className="kpi-label"><Icon name="home" size={12} /> {T.total_rec}</div>
                    <div className="kpi-val">{fmt(5400, isUS)}</div>
                    <div className="kpi-sub">{T.of} {fmt(13977, isUS)} contratados</div>
                  </div>
                  <div className="card kpi-fin">
                    <div className="kpi-label"><Icon name="cal" size={12} /> {T.rec_month}</div>
                    <div className="kpi-val" style={{ color: '#10b981' }}>{fmt(3600, isUS)}</div>
                    <div className="kpi-sub">Março 2026</div>
                  </div>
                  <div className="card kpi-fin">
                    <div className="kpi-label"><Icon name="rcpt" size={12} /> {T.bal_pend}</div>
                    <div className="kpi-val" style={{ color: '#f59e0b' }}>{fmt(8577, isUS)}</div>
                    <div className="kpi-sub">4 {T.open_inv}</div>
                  </div>
                  <div className="card kpi-fin">
                    <div className="kpi-label"><Icon name="eye" size={12} /> {T.inv_paid}</div>
                    <div className="kpi-val">2</div>
                    <div className="kpi-sub">{T.of} 6 {T.issued}</div>
                  </div>
                  <div className="card kpi-fin">
                    <div className="kpi-label"><Icon name="shield" size={12} /> {T.net_rev}</div>
                    <div className="kpi-val" style={{ color: '#10b981' }}>{fmt(5088.39, isUS)}</div>
                    <div className="kpi-sub">{T.after_fees}</div>
                  </div>
                </div>

                <div className="fin-mid-grid">
                   <div className="card fin-forecast-card">
                      <div className="f-head">{T.forecast}</div>
                      <div className="f-val">{fmt(8577, isUS)}</div>
                      <div className="f-details">
                         <div className="f-row"><span>{T.pend_pay}</span> <strong>4 faturas</strong></div>
                         <div className="f-row"><span>{T.pend_entry}</span> <strong>{fmt(4938, isUS)}</strong></div>
                         <div className="f-row"><span>{T.rec_rate}</span> <strong>39%</strong></div>
                      </div>
                   </div>
                   <div className="card fin-chart-card">
                      <div className="sec-header">
                        <h3>{T.monthly_rev}</h3>
                        <p style={{ fontSize: 10, color: 'var(--mu)' }}>{T.last_6}</p>
                      </div>
                      <div className="chart-placeholder-large">
                         <div className="chart-bars">
                            {[40, 60, 30, 80, 50, 90].map((h, i) => (
                              <div key={i} className="chart-bar-group">
                                <div className="c-bar" style={{ height: `${h}%` }}></div>
                              </div>
                            ))}
                         </div>
                         <div className="chart-labels">
                            <span>Out</span><span>Nov</span><span>Dez</span><span>Jan</span><span>Fev</span><span>Mar</span>
                         </div>
                         <div className="chart-legend-fin">
                            <div className="leg-item"><span className="dot dot-pago"></span> Recebido</div>
                            <div className="leg-item"><span className="dot dot-pendente"></span> Mês atual</div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="sec-header-fin">
                  <h3><span style={{ color: '#f59e0b' }}>⚠</span> {T.pend_inv} <span className="sec-count">4</span></h3>
                  <button className="btn-o btn-sm"><Icon name="out" size={12} /> {T.export}</button>
                </div>
                <div className="card pj-table-wrap">
                  <table className="pj-table">
                    <thead>
                      <tr>
                        <th>FATURA</th>
                        <th>PROJETO / CLIENTE</th>
                        <th>VALOR TOTAL</th>
                        <th>ENTRADA</th>
                        <th>PAGO</th>
                        <th>SALDO</th>
                        <th>STATUS</th>
                        <th>AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVOICES.filter(i => i.status !== 'paid').map(inv => (
                        <tr key={inv.id}>
                          <td style={{ color: 'var(--a)', fontWeight: 600 }}>{inv.id}</td>
                          <td>
                            <div className="pj-name">{inv.project}</div>
                            <div className="pj-city">{inv.client}</div>
                          </td>
                          <td>
                             <div className="pj-name">{fmt(inv.amount, isUS)}</div>
                             <div className="pj-city">{inv.phase}</div>
                          </td>
                          <td><span className="fin-entry-badge">{fmt(inv.entry, isUS)} — {inv.entryPct}%</span></td>
                          <td style={{ color: '#10b981', fontWeight: 600 }}>{fmt(inv.paid, isUS)}</td>
                          <td style={{ color: '#dc2626', fontWeight: 600 }}>{fmt(inv.amount - inv.paid, isUS)}</td>
                          <td><span className="fin-status-pend">{lang === 'PT' ? 'Pendente' : 'Pending'}</span></td>
                          <td>
                             <div className="fin-actions">
                                <button className="btn-o btn-xs"><Icon name="file" size={12} /> PDF</button>
                                <button className="btn-o btn-xs"><Icon name="eye" size={12} /> {T.remind}</button>
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="sec-header-fin" style={{ marginTop: 32 }}>
                  <h3><span style={{ color: '#10b981' }}>✓</span> {T.rec_pay} <span className="sec-count">4</span></h3>
                  <div className="sec-right-btns">
                     <span className="unit-eco">Unit Economics: Taxa calculada automaticamente</span>
                     <button className="btn-o btn-sm"><Icon name="out" size={12} /> {T.export}</button>
                  </div>
                </div>
                <div className="card pj-table-wrap">
                  <table className="pj-table">
                    <thead>
                      <tr>
                        <th>FATURA</th>
                        <th>PROJETO / CLIENTE</th>
                        <th>{T.method}</th>
                        <th>DATA</th>
                        <th>{T.gross}</th>
                        <th>{T.fee}</th>
                        <th>{T.net}</th>
                        <th>AÇÕES</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVOICES.filter(i => i.status === 'paid').map(inv => (
                        <tr key={inv.id}>
                          <td style={{ color: 'var(--a)', fontWeight: 600 }}>{inv.id}</td>
                          <td>
                            <div className="pj-name">{inv.project}</div>
                            <div className="pj-city">{inv.client}</div>
                          </td>
                          <td><span className="method-badge">Stripe</span></td>
                          <td>{inv.issued}</td>
                          <td style={{ fontWeight: 600 }}>{fmt(inv.amount, isUS)}</td>
                          <td style={{ color: '#dc2626' }}>
                             <div>-{fmt(inv.amount * 0.03, isUS)}</div>
                             <div style={{ fontSize: 9, opacity: 0.6 }}>3.00% fee</div>
                          </td>
                          <td style={{ fontWeight: 700 }}>{fmt(inv.amount * 0.97, isUS)}</td>
                          <td><button className="btn-o btn-xs"><Icon name="file" size={12} /> PDF</button></td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                       <tr className="fin-table-footer">
                          <td>{T.total_gross}<br/><strong>{fmt(5400, isUS)}</strong></td>
                          <td>{T.total_fees}<br/><strong style={{ color: '#dc2626' }}>{fmt(311.61, isUS)}</strong></td>
                          <td>{T.net_rev}<br/><strong style={{ color: '#10b981' }}>{fmt(5088.39, isUS)}</strong></td>
                          <td>{T.eff_rate}<br/><strong>5.77%</strong></td>
                          <td colSpan={4}></td>
                       </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            {S.page === 'calendar' && (
              <div className="anim">
                <h1 className="page-title">{T.cal_ov}</h1>
                <p className="page-sub">{T.cal_sub}</p>

                <div className="cal-top-grid">
                  <div className="card cal-stat-card">
                    <div className="kpi-label"><Icon name="folder" size={12} /> {T.proj_deliveries}</div>
                    <div className="cal-stat-main">
                      <div className="cal-stat-val">10</div>
                      <div className="cal-bars">
                        {[1, 3, 2, 4].map((v, i) => (
                          <div key={i} className="cal-bar-row">
                             <span className="cal-bar-lbl">{T.week} {i+1}</span>
                             <div className="cal-bar-track"><div className="cal-bar-fill" style={{ width: `${v*25}%` }}></div></div>
                             <span className="cal-bar-num">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="card cal-stat-card">
                    <div className="kpi-label"><Icon name="cal" size={12} /> {T.month_meetings}</div>
                    <div className="cal-stat-main">
                      <div className="cal-meet-nums">
                         <div className="meet-n"><strong>6</strong> <span>{T.scheduled}</span></div>
                         <div className="meet-n"><strong>4</strong> <span style={{ color: '#10b981' }}>{T.realized}</span></div>
                      </div>
                      <div className="cal-meet-progress">
                         <div className="meet-prog-lbl">{T.completion_rate}</div>
                         <div className="cal-bar-track" style={{ height: 6 }}><div className="cal-bar-fill" style={{ width: '67%', background: '#10b981' }}></div></div>
                         <div className="meet-prog-pct">67% {T.completed_f}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card cal-stat-card">
                    <div className="kpi-label"><Icon name="folder" size={12} /> {T.active_projs}</div>
                    <div className="cal-stat-main">
                      <div className="cal-stat-val">3</div>
                      <div className="cal-bars">
                         <div className="cal-bar-row">
                            <span className="cal-bar-lbl">DARA-0010</span>
                            <div className="cal-bar-track"><div className="cal-bar-fill" style={{ width: '6%', background: '#6366f1' }}></div></div>
                            <span className="cal-bar-num">6%</span>
                         </div>
                         <div className="cal-bar-row">
                            <span className="cal-bar-lbl">DARA-0008</span>
                            <div className="cal-bar-track"><div className="cal-bar-fill" style={{ width: '50%', background: '#818cf8' }}></div></div>
                            <span className="cal-bar-num">50%</span>
                         </div>
                         <div className="cal-bar-row">
                            <span className="cal-bar-lbl">DARA-0012</span>
                            <div className="cal-bar-track"><div className="cal-bar-fill" style={{ width: '25%', background: '#f59e0b' }}></div></div>
                            <span className="cal-bar-num">25%</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="cal-main-wrap">
                   <div className="card cal-grid-card">
                      <div className="cal-header">
                         <button className="cal-nav-btn"><Icon name="back" size={12} /></button>
                         <h2 className="cal-month-title">{T.months[2]} 2026</h2>
                         <button className="cal-nav-btn" style={{ transform: 'rotate(180deg)' }}><Icon name="back" size={12} /></button>
                      </div>
                      <div className="cal-grid">
                         <div className="cal-days-head">
                            {T.days.map(d => <div key={d}>{d}</div>)}
                         </div>
                         <div className="cal-days-grid">
                            {Array.from({ length: 31 }).map((_, i) => {
                               const day = i + 1;
                               const hasEvent = [15, 20, 28, 30].includes(day);
                               const dotColor = (day === 28 || day === 30) ? '#dc2626' : '#6366f1';
                               return (
                                 <div key={day} className={`cal-day ${hasEvent ? 'has-event' : ''}`}>
                                    <span className="day-num">{day}</span>
                                    {hasEvent && <span className="day-dot" style={{ background: dotColor }}></span>}
                                 </div>
                               );
                            })}
                         </div>
                      </div>
                   </div>

                   <div className="cal-sidebar">
                      <div className="card cal-events-card">
                         <h3 className="cal-side-title">{T.march_events}</h3>
                         <div className="cal-event-list">
                            <div className="cal-ev-item">
                               <div className="ev-date">15</div>
                               <div className="ev-info">Vencimento INV-2026-003</div>
                            </div>
                            <div className="cal-ev-item">
                               <div className="ev-date">20</div>
                               <div className="ev-info">Reunião 88 Dover St</div>
                            </div>
                            <div className="cal-ev-item">
                               <div className="ev-date">28</div>
                               <div className="ev-info">Entrega 99 Commonwealth</div>
                            </div>
                            <div className="cal-ev-item">
                               <div className="ev-date">30</div>
                               <div className="ev-info">Vencimento INV-2026-002</div>
                            </div>
                         </div>
                      </div>

                      <div className="card cal-next-card">
                         <div className="next-label">{T.next_due}</div>
                         <div className="next-date">15 de Abril</div>
                         <div className="next-info">INV-2026-003 • {fmt(1359, isUS)}</div>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {S.page === 'projects' && (() => {
              const pCount = ALL_PROJECTS.length;
              const attCount = ALL_PROJECTS.filter(p => p.status === 'attention').length;
              const filtered = S.filter === 'all' ? ALL_PROJECTS : ALL_PROJECTS.filter(p => p.status === S.filter);

              const tabs = [
                { id: 'all', lbl: T.all, count: ALL_PROJECTS.length },
                { id: 'on_track', lbl: T.status_on_track, count: ALL_PROJECTS.filter(p => p.status === 'on_track').length },
                { id: 'waiting', lbl: T.status_waiting, count: ALL_PROJECTS.filter(p => p.status === 'waiting').length },
                { id: 'attention', lbl: T.status_attention, count: ALL_PROJECTS.filter(p => p.status === 'attention').length },
                { id: 'completed', lbl: T.status_completed, count: ALL_PROJECTS.filter(p => p.status === 'completed').length },
              ];

              return (
                <div className="anim">
                  <h1 className="page-title">{T.project_mgmt}</h1>
                  <p className="page-sub">{pCount} {T.projects_found} — {attCount} {T.require_attention}</p>

                  <div className="tab-strip">
                    {tabs.map(tab => (
                      <button 
                        key={tab.id} 
                        className={`tab-item ${S.filter === tab.id ? 'act' : ''}`}
                        onClick={() => setS(prev => ({ ...prev, filter: tab.id }))}
                      >
                        {tab.id !== 'all' && <span className={`tab-dot dot-${tab.id}`}></span>}
                        {tab.lbl} <span className="tab-count">{tab.count}</span>
                      </button>
                    ))}
                  </div>

                  <div className="card pj-table-wrap">
                    <table className="pj-table">
                      <thead>
                        <tr>
                          <th>{T.col_project}</th>
                          <th>{T.col_service}</th>
                          <th>{T.col_stage}</th>
                          <th>{T.col_progress}</th>
                          <th>{T.col_status}</th>
                          <th>{T.col_due}</th>
                          <th>{T.col_budget}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map(p => (
                          <tr key={p.id}>
                            <td>
                              <div className="pj-info">
                                <div className="pj-code">{p.code}</div>
                                <div className="pj-name">{p.address}</div>
                                <div className="pj-city">{p.city}</div>
                                {p.pending && (
                                  <div className="pj-alert-min">
                                    <Icon name="eye" size={10} /> {p.pending}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="pj-srv">{p.service}</td>
                            <td className="pj-stg">{p.stage}</td>
                            <td>
                              <div className="pj-prog-cell">
                                <div className="prog-track">
                                  <div className="prog-fill" style={{ width: `${p.progress}%`, background: p.status === 'attention' ? 'var(--rd)' : 'var(--a)' }}></div>
                                </div>
                                <span className="prog-pct">{p.progress}%</span>
                              </div>
                            </td>
                            <td><Badge status={p.status} lang={lang} /></td>
                            <td>
                              <div className={`pj-due ${p.status === 'attention' || p.status === 'waiting' ? 'warn' : ''}`}>
                                {(p.status === 'attention' || p.status === 'waiting') && <span>⚠</span>} {p.due}
                              </div>
                            </td>
                            <td>
                              <div className="pj-budget">
                                <div className="bud-val">{fmt(p.budget, isUS)}</div>
                                <div className="bud-date">{p.updatedAt}</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })()}

            {S.page === 'notifications' && (
              <div className="anim">
                <div className="sec-header-fin">
                  <div>
                    <h1 className="page-title">{T.notifications}</h1>
                    <p className="page-sub">3 {T.unread_count}</p>
                  </div>
                  <button className="btn-o btn-sm" style={{ borderRadius: 20 }}>{T.mark_all_read}</button>
                </div>

                <div className="notif-list">
                  {NOTIFICATIONS_DATA.map(n => (
                    <div key={n.id} className={`notif-card ${n.unread ? 'unread' : ''}`}>
                      <div className="notif-left">
                        {n.unread && <span className="notif-unread-dot"></span>}
                        <div className={`notif-ico-box type-${n.type}`}>
                           <Icon name={
                             n.type === 'view' ? 'eye' : 
                             n.type === 'invoice' ? 'rcpt' : 
                             n.type === 'ticket' ? 'folder' : 
                             n.type === 'upload' ? 'out' : 
                             n.type === 'lead' ? 'shield' : 'eye'
                           } size={14} />
                        </div>
                        <div className="notif-content">
                           <div className="notif-title">{n.title}</div>
                           <div className="notif-sub">{n.sub}</div>
                        </div>
                      </div>
                      <div className="notif-date">{n.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {S.page === 'settings' && (
              <div className="anim">
                <h1 className="page-title">{T.settings}</h1>
                <p className="page-sub">{T.settings_desc}</p>

                <div className="settings-wrap">
                  <aside className="settings-nav">
                    <button className={`st-nav-item ${S.settingsTab === 'account' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, settingsTab: 'account' }))}>
                      <Icon name="eye" size={14} /> {T.account}
                    </button>
                    <button className={`st-nav-item ${S.settingsTab === 'security' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, settingsTab: 'security' }))}>
                      <Icon name="shield" size={14} /> {T.security}
                    </button>
                    <button className={`st-nav-item ${S.settingsTab === 'notifications' ? 'act' : ''}`} onClick={() => setS(prev => ({ ...prev, settingsTab: 'notifications' }))}>
                      <Icon name="bell" size={14} /> {T.notifications}
                    </button>
                  </aside>

                  <main className="settings-content">
                    {S.settingsTab === 'account' && (
                      <div className="card st-card anim">
                        <div className="st-head">
                          <div className="st-profile-upload">
                             <div className="st-avatar-large">
                                {S.profilePic ? <img src={S.profilePic} alt="Profile" /> : <Icon name="user" size={24} />}
                                <label className="st-upload-overlay">
                                   <Icon name="folder" size={14} color="#fff" />
                                   <input type="file" hidden accept="image/*" onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                         const url = URL.createObjectURL(file);
                                         setS(prev => ({ ...prev, profilePic: url }));
                                      }
                                   }} />
                                </label>
                             </div>
                          </div>
                          <div>
                            <h3>{T.acc_info}</h3>
                            <p>{T.acc_desc}</p>
                          </div>
                        </div>
                        <div className="st-form-grid">
                          <div className="st-field">
                            <label>{T.full_name}</label>
                            <input type="text" defaultValue="Jackson Da Silva" />
                          </div>
                          <div className="st-field">
                            <label>{T.email}</label>
                            <input type="email" defaultValue="joao@darastudio.com" />
                          </div>
                          <div className="st-field">
                            <label>{T.phone}</label>
                            <input type="text" defaultValue="+1 (617) 775-0179" />
                          </div>
                        </div>

                        <div className="st-divider"></div>

                        <div className="st-head" style={{ marginTop: 24 }}>
                           <div className="st-profile-upload">
                              <div className="st-avatar-large">
                                 {S.profilePic ? <img src={S.profilePic} alt="Logo" /> : <Icon name="briefcase" size={24} />}
                                 <label className="st-upload-overlay">
                                    <Icon name="folder" size={14} color="#fff" />
                                    <input type="file" hidden accept="image/*" onChange={(e) => {
                                       const file = e.target.files[0];
                                       if (file) {
                                          const url = URL.createObjectURL(file);
                                          setS(prev => ({ ...prev, profilePic: url }));
                                       }
                                    }} />
                                 </label>
                              </div>
                           </div>
                           <div>
                             <h3>{T.company_details}</h3>
                             <p>{T.company_desc}</p>
                           </div>
                        </div>

                        <div className="st-form-grid">
                          <div className="st-field">
                            <label>{T.company}</label>
                            <input type="text" value={S.company} onChange={e => setS(prev => ({ ...prev, company: e.target.value }))} />
                          </div>
                          <div className="st-field">
                            <label>{T.tax_id}</label>
                            <input type="text" value={S.taxId} onChange={e => setS(prev => ({ ...prev, taxId: e.target.value }))} />
                          </div>
                          <div className="st-field">
                            <label>{T.address}</label>
                            <input type="text" value={S.address} onChange={e => setS(prev => ({ ...prev, address: e.target.value }))} />
                          </div>
                          <div className="st-field">
                            <label>{T.website}</label>
                            <input type="text" value={S.website} onChange={e => setS(prev => ({ ...prev, website: e.target.value }))} />
                          </div>
                        </div>
                        
                        <div className="st-footer">
                          <button className="btn-p">{T.save_changes}</button>
                        </div>
                      </div>
                    )}

                    {S.settingsTab === 'security' && (
                      <div className="card st-card anim">
                        <div className="st-head">
                          <div className="st-ico-box"><Icon name="shield" size={16} /></div>
                          <div>
                            <h3>{T.security}</h3>
                            <p>{lang === 'PT' ? 'Gerencie sua senha e acesso' : 'Manage your password and access'}</p>
                          </div>
                        </div>
                        <div className="st-form-stack">
                          <div className="st-field">
                            <label>{T.curr_pw}</label>
                            <input type="password" placeholder="••••••••" />
                          </div>
                          <div className="st-field">
                            <label>{T.new_pw}</label>
                            <input type="password" placeholder={lang === 'PT' ? 'Mínimo 8 caracteres' : 'Minimum 8 characters'} />
                          </div>
                          <div className="st-field">
                            <label>{T.conf_pw}</label>
                            <input type="password" placeholder={lang === 'PT' ? 'Repita a nova senha' : 'Repeat new password'} />
                          </div>
                        </div>

                        <div className="st-sec-box">
                           <h4>{T.add_sec}</h4>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.two_fa}</strong>
                                 <span>{T.two_fa_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" />
                                 <span className="slider"></span>
                              </label>
                           </div>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.session_alerts}</strong>
                                 <span>{T.session_alerts_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider"></span>
                              </label>
                           </div>
                        </div>

                        <div className="st-footer-dual">
                          <button className="btn-o">{T.cancel}</button>
                          <button className="btn-p">{T.save_pw}</button>
                        </div>
                      </div>
                    )}

                    {S.settingsTab === 'notifications' && (
                      <div className="card st-card anim">
                        <div className="st-head">
                          <div className="st-ico-box"><Icon name="bell" size={16} /></div>
                          <div>
                            <h3>{T.notifications}</h3>
                            <p>{lang === 'PT' ? 'Controle o que você recebe e como' : 'Control what you receive and how'}</p>
                          </div>
                        </div>
                        
                        <div className="st-sec-box">
                           <h4>{T.portal_alerts}</h4>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.new_inv_alert}</strong>
                                 <span>{T.new_inv_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider"></span>
                              </label>
                           </div>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.msg_chat_alert}</strong>
                                 <span>{T.msg_chat_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider"></span>
                              </label>
                           </div>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.work_upd_alert}</strong>
                                 <span>{T.work_upd_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" />
                                 <span className="slider"></span>
                              </label>
                           </div>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.tkt_resp_alert}</strong>
                                 <span>{T.tkt_resp_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" defaultChecked />
                                 <span className="slider"></span>
                              </label>
                           </div>
                        </div>

                        <div className="st-sec-box">
                           <h4>{T.comm}</h4>
                           <div className="st-switch-item">
                              <div className="sw-info">
                                 <strong>{T.news_alert}</strong>
                                 <span>{T.news_desc}</span>
                              </div>
                              <label className="switch">
                                 <input type="checkbox" />
                                 <span className="slider"></span>
                              </label>
                           </div>
                        </div>

                        <div className="st-footer">
                          <button className="btn-p">{T.save_pref}</button>
                        </div>
                      </div>
                    )}
                  </main>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
