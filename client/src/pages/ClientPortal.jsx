import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import Chat from "../components/Chat";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import GlobalControls from '../components/GlobalControls';
import Icon from '../components/Icon';
import SplashScreen from '../components/SplashScreen';
import BackgroundOrbs from '../components/BackgroundOrbs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import './ClientPortal.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

/**
 * ClientPortal.jsx — DARA Studio
 * Refactored from unified legacy portal.
 */

/* ══ DATA CONSTANTS ══ */
const TIMELINE_PHASES = [
  { id: 'survey', label_en: 'As-Built Survey', label_pt: 'Levantamento As-Built', note_en: 'Field measurements finalized.', note_pt: 'Medições de campo finalizadas.' },
  { id: 'floor_plans', label_en: 'Floor Plans', label_pt: 'Plantas de Layout', note_en: 'Architectural layouts verified.', note_pt: 'Layouts arquitetônicos verificados.' },
  { id: 'design_review', label_en: 'Design Review', label_pt: 'Revisão de Design', note_en: 'Reviewing 3D perspectives.', note_pt: 'Revisando perspectivas 3D.' },
  { id: 'permit_drawings', label_en: 'Permit Drawings', label_pt: 'Permit Drawings', note_en: 'Engineering coordination.', note_pt: 'Coordenação de engenharia.' },
  { id: 'final_delivery', label_en: 'Final Delivery', label_pt: 'Entrega Final', note_en: 'Final documentation set.', note_pt: 'Conjunto final de documentos.' },
];

const PHASE_ORDER = ['survey', 'floor_plans', 'design_review', 'permit_drawings', 'final_delivery'];

const ALL_PROJECTS = [
  { id: 1, code: 'DARA-0010', address: '41 Bowdoin Ave', city: 'Dorchester, MA', service: 'New Construction — Single Family', stage: 'Detalhamento', status: 'waiting', budget: 2718, paid: 0, progress: 6, updatedAt: '18/03/2026', pending: 'Aguardando informações do cliente', client: 'Jackson Da Silva', freelancer: 'Carlos Maia', due: '15/04/2026' },
  { id: 2, code: 'DARA-0008', address: '88 Dover St', city: 'Boston, MA', service: 'Commercial Office Renovation', stage: 'Estudo Preliminar', status: 'on_track', budget: 4200, paid: 2100, progress: 50, updatedAt: '14/03/2026', pending: null, client: 'Jackson Da Silva', freelancer: 'Ana Ferreira', due: '30/06/2026' },
  { id: 3, code: 'DARA-0005', address: '215 Hampton Rd', city: 'Brookline, MA', service: 'Interior Design — Living Room', stage: 'Entrega Final', status: 'completed', budget: 1800, paid: 1800, progress: 100, updatedAt: '28/02/2026', pending: null, client: 'Maria Silva', freelancer: 'Carlos Maia', due: '28/02/2026' },
  { id: 4, code: 'DARA-0012', address: '99 Commonwealth Ave', city: 'Boston, MA', service: 'Landscape Design', stage: 'Conceituação', status: 'attention', budget: 3200, paid: 800, progress: 25, updatedAt: '10/03/2026', pending: 'Aguardando aprovação de orçamento', client: 'Robert Chen', freelancer: 'Ana Ferreira', due: '20/05/2026' },
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
    welcomeBack: 'Welcome to your Sanctuary',
    welcomeBackSub: 'Acompanhe cada detalhe da transformação do seu espaço em tempo real.',
    activeProjects: 'Projetos Ativos',
    paid: 'Pago',
    pendingInvoices: 'Faturas Pendentes',
    recentProjects: 'Projetos Recentes',
    recentActivity: 'Atividade Recente',
    backToSite: 'Voltar ao Site',
    portalTitle: 'Portal do Cliente',
    welcomeTo: 'Bem-vindo ao',
    loginTitle: 'Acesse seu santuário',
    loginSub: 'Acompanhe cada detalhe da transformação do seu espaço em tempo real.',

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
    phone: 'TELEFONE',
    company: 'EMPRESA',
    portal_lang: 'IDIOMA DO PORTAL',
    visual_theme: 'TEMA VISUAL',
    
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
    projectTimeline: 'Cronograma do Projeto',
    estDelivery: 'Entrega Estimada',
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
    welcomeBack: 'Welcome to your Sanctuary',
    welcomeBackSub: 'Track every detail of your space transformation in real-time.',
    activeProjects: 'Active Projects',
    paid: 'Paid',
    pendingInvoices: 'Pending Invoices',
    recentProjects: 'Recent Projects',
    recentActivity: 'Recent Activity',
    backToSite: 'Back to Site',
    portalTitle: 'Client Portal',
    welcomeTo: 'Welcome to',
    loginTitle: 'Access your sanctuary',
    loginSub: 'Track every detail of your space transformation in real-time.',

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
    phone: 'PHONE',
    company: 'COMPANY',
    portal_lang: 'PORTAL LANGUAGE',
    visual_theme: 'VISUAL THEME',
    save_changes: 'Save Changes',
    
    curr_pw: 'CURRENT PASSWORD',
    new_pw: 'NEW PASSWORD',
    conf_pw: 'CONFIRMER NEW PASSWORD',
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
    company_details: 'Company Information',
    company_desc: 'Corporate data and brand logo',
    tax_id: 'Tax ID (CNPJ/EIN)',
    address: 'Address',
    website: 'Website / Portfolio',
    projectTimeline: 'Project Timeline',
    estDelivery: 'Estimated Delivery',
  }
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



const Badge = ({ status, lang }) => {
  const st = STATUS(lang)[status] || STATUS(lang).on_track;
  return (
    <span className={`st-badge ${status}`} style={{ backgroundColor: st.bg, color: st.c, padding: '2px 8px', borderRadius: '12px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: st.dot }}></span>
      {st.label}
    </span>
  );
};

const ProjectTimeline = ({ lang, currentPhase }) => {
  const isPT = lang === 'PT';
  const currentIndex = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="timeline-container">
      {TIMELINE_PHASES.map((phase, idx) => {
        const isLast = idx === TIMELINE_PHASES.length - 1;
        const phaseIndex = PHASE_ORDER.indexOf(phase.id);
        
        let status = 'pending';
        if (phaseIndex < currentIndex) status = 'completed';
        if (phaseIndex === currentIndex) status = 'on_track';
        
        return (
          <div key={phase.id} className={`timeline-step ${status}`} style={{ transition: 'all 0.5s ease' }}>
            {!isLast && <div className="timeline-connector" style={{ background: phaseIndex < currentIndex ? 'var(--a)' : 'var(--border)' }}></div>}
            
            <div className="timeline-marker" style={{ 
               transform: status === 'on_track' ? 'scale(1.2)' : 'scale(1)',
               boxShadow: status === 'on_track' ? '0 0 15px var(--a-glow)' : 'none'
            }}>
              {status === 'completed' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
              {status === 'on_track' && <div className="marker-pulse"></div>}
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <span className="timeline-title" style={{ color: status !== 'pending' ? 'var(--tx)' : 'var(--mu)' }}>
                  {isPT ? phase.label_pt : phase.label_en}
                </span>
              </div>
              <div className="timeline-note">
                {isPT ? phase.note_pt : phase.note_en}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Toast = ({ msg, onDismiss }) => (
  <div className="toast-anim" style={{ 
    position: 'fixed', bottom: '24px', right: '24px', 
    background: 'var(--a)', color: '#fff', 
    padding: '16px 24px', borderRadius: '12px', 
    boxShadow: '0 8px 30px rgba(0,0,0,0.5)', 
    zIndex: 1000, display: 'flex', alignItems: 'center', gap: '12px' 
  }}>
    <div style={{ fontSize: '20px' }}>🚀</div>
    <div style={{ fontSize: '14px', fontWeight: '600' }}>{msg}</div>
    <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', padding: '0 0 0 12px' }}>✕</button>
  </div>
);

/* ══ MAIN COMPONENT ══ */
export default function ClientPortal() {
  const { user, profile, logout } = useAuth();
  const { lang, theme } = useAppContext();
  const navigate = useNavigate();

  const [splashDone, setSplashDone] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(true);

  const t = (key) => I18N[lang][key] || key;
  const isPT = lang === 'PT';
  const isUS = lang === 'EN';
  const T = I18N[lang];
  const userName = profile?.full_name || user?.email?.split('@')[0];
  const unreadCount = NOTIFICATIONS_DATA.filter(n => n.unread).length;

  const [S, setS] = useState({
    projects: [],
    realtimeProject: null,
    toast: null,
    loadingFiles: false,
    projectFiles: [],
    selectedProject: null,
    showNotif: false,
    sbCol: false
  });

  // Fetch projects and setup Realtime
  useEffect(() => {
    if (!user) return;

    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', user.id);
      
      if (!error && data) {
        setS(prev => ({ ...prev, projects: data }));
        // Default to the first project for the dashboard
        if (data.length > 0) {
          setS(prev => ({ ...prev, realtimeProject: data[0] }));
        }
      } else {
        setS(prev => ({ ...prev, projects: [], realtimeProject: null }));
      }
    };

    fetchProjects();

    // Subscribe to all projects owned by this client
    const channel = supabase
      .channel('client-projects')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'projects',
        filter: `client_id=eq.${user.id}`
      }, (payload) => {
        const updated = payload.new;
        setS(prev => {
          // If the phase advanced, show toast
          if (prev.realtimeProject && prev.realtimeProject.id === updated.id) {
            if (PHASE_ORDER.indexOf(updated.timeline_phase) > PHASE_ORDER.indexOf(prev.realtimeProject.timeline_phase)) {
              const phaseName = lang === 'PT' 
                ? TIMELINE_PHASES.find(p => p.id === updated.timeline_phase)?.label_pt 
                : TIMELINE_PHASES.find(p => p.id === updated.timeline_phase)?.label_en;
              
              const toastMsg = lang === 'PT' 
                ? `Seu projeto avançou para: ${phaseName}` 
                : `Your project has advanced to: ${phaseName}`;
              
              return { ...prev, realtimeProject: updated, toast: toastMsg };
            }
          }
          
          // Update the projects list too
          const newProjects = prev.projects.map(p => p.id === updated.id ? updated : p);
          return { ...prev, projects: newProjects, realtimeProject: prev.realtimeProject?.id === updated.id ? updated : prev.realtimeProject };
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, lang]);

  if (!splashDone) {
    return <SplashScreen portalName={t('role_client')} onComplete={() => setSplashDone(true)} />;
  }

  const handleProjectClick = async (project) => {
    setS(prev => ({ ...prev, selectedProject: project, loadingFiles: true }));
    const { data, error } = await supabase.from('files').select('*').eq('project_id', project.id);
    if (!error) {
      setS(prev => ({ ...prev, projectFiles: data, loadingFiles: false }));
    } else {
      setS(prev => ({ ...prev, loadingFiles: false }));
    }
  };

  return (
    <div id="layout" className={theme === 'dark' ? 'dark' : ''}>
      <BackgroundOrbs />
      
      {/* ── SIDEBAR ── */}
      <aside className={`sidebar ${collapsed ? 'col' : ''}`}>
        <div className="sb-head">
          <div className="sb-logo">D</div>
          {!collapsed && (
            <div className="sb-text">
              <div className="sb-name">DARA STUDIO</div>
            </div>
          )}
          <button className="sb-toggle" onClick={() => setCollapsed(!collapsed)}><Icon name="menu" /></button>
        </div>

        <nav className="sb-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'act' : ''}`} 
            onClick={() => setActiveTab('dashboard')}
          >
            <Icon name="home" /> 
            <span className="nav-lbl">{t('dashboard')}</span>
            {collapsed && <div className="nav-tip">{t('dashboard')}</div>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'projects' ? 'act' : ''}`} 
            onClick={() => setActiveTab('projects')}
          >
            <Icon name="folder" /> 
            <span className="nav-lbl">{t('projects')}</span>
            {collapsed && <div className="nav-tip">{t('projects')}</div>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'invoices' ? 'act' : ''}`} 
            onClick={() => setActiveTab('invoices')}
          >
            <Icon name="file" /> 
            <span className="nav-lbl">{t('invoices')}</span>
            {collapsed && <div className="nav-tip">{t('invoices')}</div>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'act' : ''}`} 
            onClick={() => setActiveTab('calendar')}
          >
            <Icon name="calendar" /> 
            <span className="nav-lbl">{t('calendar')}</span>
            {collapsed && <div className="nav-tip">{t('calendar')}</div>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'documents' ? 'act' : ''}`} 
            onClick={() => setActiveTab('documents')}
          >
            <Icon name="lock" /> 
            <span className="nav-lbl">{t('documents')}</span>
            {collapsed && <div className="nav-tip">{t('documents')}</div>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'notifications' ? 'act' : ''}`} 
            onClick={() => setActiveTab('notifications')}
          >
            <Icon name="bell" /> 
            <span className="nav-lbl">{t('notifications')}</span>
            {collapsed && <div className="nav-tip">{t('notifications')}</div>}
            {unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'act' : ''}`} 
            onClick={() => setActiveTab('settings')}
          >
            <Icon name="settings" /> 
            <span className="nav-lbl">{t('settings')}</span>
            {collapsed && <div className="nav-tip">{t('settings')}</div>}
          </button>
        </nav>

        <div className="sb-bot">
          <button className="nav-item sign-out-btn" onClick={logout}>
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
          <div className="tb-right">
            <GlobalControls />
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
        </header>

        <div className="page">
          {activeTab === 'dashboard' && (
            <div className="page-content">
              <h1 className="page-title">{T.welcomeBack}, {userName.split(' ')[0]}</h1>
              <p className="page-sub">{T.welcomeBackSub}</p>

              <div className="dashboard-content" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginTop: '24px' }}>
                <div className="dash-col-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  
                  {/* Interactive Charts Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                     <div className="dash-card main-chart" style={{ background: 'var(--bg2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--br)' }}>
                        <div className="card-head" style={{ marginBottom: '20px' }}>
                           <div className="card-title" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--a)' }}>{lang === 'PT' ? 'Progresso do Projeto' : 'Project Progress'}</div>
                        </div>
                        <div style={{ height: '180px' }}>
                           <Line 
                             data={{
                               labels: ['Phase 1', 'Phase 2', 'Phase 3', 'Phase 4', 'Phase 5'],
                               datasets: [{
                                 fill: true,
                                 label: 'Progress',
                                 data: [10, 30, 50, 75, 100],
                                 borderColor: '#6366f1',
                                 backgroundColor: 'rgba(99, 102, 241, 0.1)',
                                 tension: 0.4
                               }]
                             }}
                             options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: 'var(--dm)', font: { size: 9 } } } } }}
                           />
                        </div>
                     </div>
                     <div className="dash-card side-chart" style={{ background: 'var(--bg2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--br)' }}>
                        <div className="card-head" style={{ marginBottom: '20px' }}>
                           <div className="card-title" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--a)' }}>{lang === 'PT' ? 'Previsão Financeira' : 'Financial Forecast'}</div>
                        </div>
                        <div style={{ height: '180px' }}>
                           <Bar 
                             data={{
                               labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                               datasets: [{
                                 label: 'Revenue',
                                 data: [1200, 1900, 3000, 5000],
                                 backgroundColor: '#a78bfa',
                                 borderRadius: 4
                               }]
                             }}
                             options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: 'var(--dm)', font: { size: 9 } } } } }}
                           />
                        </div>
                     </div>
                  </div>

                  <div className="sec-header">
                    <h3>{T.recentProjects}</h3>
                    <button className="btn-link" onClick={() => setActiveTab('projects')}>{T.view_all}</button>
                  </div>
                  
                  <div className="project-list">
                    {S.projects.slice(0, 2).map(p => (
                      <div key={p.id} className="card project-card" onClick={() => handleProjectClick(p)} style={{ cursor: 'pointer' }}>
                        <div className="p-card-top">
                          <div>
                            <strong className="p-card-title">{p.address}</strong>
                            <div className="p-card-sub">{p.service}</div>
                            <div className="p-card-stage">{p.timeline_phase}</div>
                          </div>
                          <Badge status={p.status} lang={lang} />
                        </div>
                        <div className="p-card-progress">
                          <div className="prog-track">
                            <div className="prog-fill" style={{ width: p.timeline_phase === 'final_delivery' ? '100%' : '35%' }}></div>
                          </div>
                          <span className="prog-pct">{p.timeline_phase === 'final_delivery' ? '100%' : '35%'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="dash-col-right">
                  <div className="sec-header">
                    <h3>{T.projectTimeline}</h3>
                  </div>
                  <div className="card timeline-card">
                    <ProjectTimeline lang={lang} currentPhase={S.realtimeProject?.timeline_phase || 'survey'} />
                  </div>

                  <div className="sec-header" style={{ marginTop: 24 }}>
                    <h3>{T.recentActivity}</h3>
                  </div>
                  <div className="activity-list">
                    {NOTIFICATIONS_DATA.slice(0, 3).map(n => (
                      <div key={n.id} className="activity-item">
                        <div className={`act-icon ${n.type}`}><Icon name="bell" size={12} /></div>
                        <div className="act-content">
                          <div className="act-title">{n.title}</div>
                          <div className="act-time">{n.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {S.selectedProject && (
            <div className="modal-overlay" onClick={() => setS(prev => ({ ...prev, selectedProject: null }))}>
              <div className="project-detail-modal anim" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div>
                    <div className="pj-code">{S.selectedProject.code}</div>
                    <h2 className="modal-title">{S.selectedProject.address}</h2>
                    <p className="modal-sub">{S.selectedProject.city}</p>
                  </div>
                  <button className="btn-close" onClick={() => setS(prev => ({ ...prev, selectedProject: null }))}>✕</button>
                </div>

                <div className="modal-body">
                  <div className="modal-grid">
                    <div className="modal-left">
                      <div className="card detail-card">
                        <h3>{lang === 'PT' ? 'Progresso do Projeto' : 'Project Progress'}</h3>
                        <div className="pj-prog-cell" style={{ margin: '16px 0' }}>
                          <div className="prog-track" style={{ height: 12 }}>
                            <div className="prog-fill" style={{ width: `${S.selectedProject.progress}%`, background: 'var(--a)' }}></div>
                          </div>
                          <span className="prog-pct">{S.selectedProject.progress}% {lang === 'PT' ? 'Concluído' : 'Completed'}</span>
                        </div>
                        <div className="detail-meta">
                          <div className="meta-row"><span>{T.col_service}:</span> <strong>{S.selectedProject.service}</strong></div>
                          <div className="meta-row"><span>{T.col_stage}:</span> <strong>{S.selectedProject.stage}</strong></div>
                          <div className="meta-row"><span>{T.col_due}:</span> <strong>{S.selectedProject.due}</strong></div>
                        </div>
                      </div>

                      <div className="card detail-card" style={{ marginTop: 20 }}>
                        <h3>{lang === 'PT' ? 'Equipe Design' : 'Design Team'}</h3>
                        <div className="team-row">
                          <div className="st-avatar-min"><Icon name="user" size={14} /></div>
                          <div className="team-info">
                            <div className="team-name">{S.selectedProject.freelancer}</div>
                            <div className="team-role">Lead Architect</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="modal-right">
                      <div className="card vault-card">
                        <div className="vault-header">
                          <h3><Icon name="folder" size={16} /> File Vault</h3>
                          <p>{lang === 'PT' ? 'Arquivos seguros e links expiráveis' : 'Secure files and expiring links'}</p>
                        </div>

                        <div className="vault-content" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {S.loadingFiles ? (
                            <div className="vault-empty">Loading files...</div>
                          ) : S.projectFiles.length === 0 ? (
                            <div className="vault-empty">
                              <Icon name="out" size={32} />
                              <p>{lang === 'PT' ? 'Nenhum arquivo encontrado' : 'No files found for this project'}</p>
                            </div>
                          ) : (
                            <div className="file-groups">
                              {['Inspiration', 'Video', 'Technical', 'Rush'].map(cat => {
                                const catFiles = S.projectFiles.filter(f => f.type === cat);
                                if (catFiles.length === 0) return null;
                                return (
                                  <div key={cat} className="file-group">
                                    <h4 className="group-title">{cat}</h4>
                                    <div className="file-list">
                                      {catFiles.map(file => (
                                        <div key={file.id} className="file-row">
                                          <div className="file-info">
                                            <div className="file-icon"><Icon name="file" size={14} /></div>
                                            <div className="file-meta">
                                              <div className="file-name">{file.name}</div>
                                              <div className="file-date">{new Date(file.created_at).toLocaleDateString()}</div>
                                            </div>
                                          </div>
                                          <a href={file.signedUrl} target="_blank" rel="noreferrer" className="btn-o btn-xs">
                                            <Icon name="out" size={12} /> {lang === 'PT' ? 'Baixar' : 'Download'}
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="card chat-card" style={{ marginTop: 20, height: '350px', padding: 0, display: 'flex', flexDirection: 'column' }}>
                        <div className="vault-header" style={{ padding: '16px 20px 10px' }}>
                          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Icon name="chat" size={16} /> Live Project Chat</h3>
                        </div>
                        <div style={{ flex: 1, minHeight: 0 }}>
                          <Chat projectId={S.selectedProject.id} lang={lang} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="page-content">
               <h1 className="page-title">{T.projects}</h1>
               <p className="page-sub">Gerenciamento completo dos seus projetos ativos e concluídos.</p>
               <div className="projects-grid">
                  {S.projects.map(p => (
                    <div key={p.id} className="card project-card" onClick={() => handleProjectClick(p)} style={{ cursor: 'pointer' }}>
                       <div className="p-card-top">
                          <div>
                             <strong className="p-card-title">{p.address}</strong>
                             <div className="p-card-sub">{p.service}</div>
                          </div>
                          <Badge status={p.status} lang={lang} />
                       </div>
                       <div className="p-card-progress">
                          <div className="prog-track">
                             <div className="prog-fill" style={{ width: p.timeline_phase === 'final_delivery' ? '100%' : '35%' }}></div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="page-content">
              <h1 className="page-title">{T.fin_ov}</h1>
              <p className="page-sub">{T.fin_sub}</p>
              <div className="fin-mid-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '32px' }}>
                 <div className="card fin-chart-card" style={{ background: 'var(--bg2)', padding: '24px', borderRadius: '16px', border: '1px solid var(--br)' }}>
                    <div className="card-head" style={{ marginBottom: '20px' }}>
                       <div className="card-title" style={{ fontSize: '14px', fontWeight: '700', color: 'var(--a)' }}>Investimento Acumulado</div>
                    </div>
                    <div style={{ height: '220px' }}>
                       <Line 
                         data={{
                           labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai'],
                           datasets: [{
                             label: 'Investimento',
                             data: [2000, 4500, 7800, 11000, 14000],
                             borderColor: '#a78bfa',
                             backgroundColor: 'rgba(167, 139, 250, 0.1)',
                             fill: true,
                             tension: 0.4
                           }]
                         }}
                         options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false }, ticks: { color: 'var(--dm)', font: { size: 9 } } } } }}
                       />
                    </div>
                 </div>
                 <div className="card fin-kpi-card" style={{ background: 'var(--bg3)', padding: '24px', borderRadius: '16px', border: '1px solid var(--br)' }}>
                    <div className="kpi-label" style={{ fontSize: '10px', fontWeight: '700', color: 'var(--a)', textTransform: 'uppercase', marginBottom: '16px' }}>Status Financeiro</div>
                    <div className="kpi-val" style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>{fmt(14000, isUS)}</div>
                    <div className="kpi-sub" style={{ fontSize: '12px', opacity: 0.6 }}>Total em projetos ativos</div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="page-content">
               <h1 className="page-title">{T.cal_ov}</h1>
               <p className="page-sub">{T.cal_sub}</p>
               <div style={{ padding: '60px', textAlign: 'center', opacity: 0.5 }}>Calendário interativo em desenvolvimento.</div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="page-content">
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

          {activeTab === 'documents' && (
            <div className="page-content">
              <h1 className="page-title">{T.documents}</h1>
              <p className="page-sub">{lang === 'PT' ? 'Acesso centralizado a todos os seus arquivos técnicos e documentos.' : 'Centralized access to all your technical files and documents.'}</p>
              
              <div className="documents-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', marginTop: '32px' }}>
                {S.projects.map(p => (
                  <div key={p.id} className="card vault-card anim" style={{ padding: '24px' }}>
                    <div className="vault-header" style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--a-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--a)' }}>
                          <Icon name="folder" size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '14px', fontWeight: '700' }}>{p.address}</h3>
                          <p style={{ fontSize: '11px', opacity: 0.5 }}>{p.service}</p>
                        </div>
                      </div>
                    </div>
                    <button className="btn-p btn-sm" style={{ width: '100%' }} onClick={() => handleProjectClick(p)}>
                      {lang === 'PT' ? 'Abrir File Vault' : 'Open File Vault'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="page-content">
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
      </main>

      {S.toast && <Toast msg={S.toast} onDismiss={() => setS(prev => ({ ...prev, toast: null }))} />}
    </div>
  );
}
