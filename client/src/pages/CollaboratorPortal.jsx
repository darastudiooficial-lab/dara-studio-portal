import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import GlobalControls from '../components/GlobalControls';
import Icon from '../components/Icon';
import Chat from '../components/Chat';
import SplashScreen from '../components/SplashScreen';
import BackgroundOrbs from '../components/BackgroundOrbs';
import './ClientPortal.css';

const CollaboratorPortal = () => {
  const { theme } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [ready, setReady] = useState(false);
  const { logout, profile, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchAssignedProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*, profiles(full_name)')
        .eq('assigned_collaborator_id', user.id);
      
      if (!error && data) setProjects(data);
      setLoading(false);
    };

    fetchAssignedProjects();

    const channel = supabase
      .channel('collaborator-projects')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'projects',
        filter: `assigned_collaborator_id=eq.${user.id}`
      }, (payload) => {
        const updated = payload.new;
        setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (!ready) {
    return <SplashScreen portalName="Portal Colaborador" onComplete={() => setReady(true)} />;
  }

  const PHASE_NAMES = {
    survey: '🔍 Vistoria',
    floor_plans: '📐 Plantas',
    design_review: '🎨 Design',
    permit_drawings: '📋 Aprovação',
    final_delivery: '📦 Entrega'
  };

  return (
    <div id="layout" className={theme === 'dark' ? 'dark' : ''}>
      <BackgroundOrbs />
      <aside className="sidebar">
        <div className="sb-head">
          <div className="sb-logo">D</div>
          <div className="sb-text">
            <div className="sb-name">DARA STUDIO</div>
            <div className="sb-tag">COLLABORATOR</div>
          </div>
        </div>
        <nav className="sb-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'act' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Icon name="home" /> <span className="nav-lbl">Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'drawings' ? 'act' : ''}`} onClick={() => setActiveTab('drawings')}>
            <Icon name="layers" /> <span className="nav-lbl">Technical Drawings</span>
          </button>
          <button className={`nav-item ${activeTab === 'tasks' ? 'act' : ''}`} onClick={() => setActiveTab('tasks')}>
            <Icon name="target" /> <span className="nav-lbl">Task Management</span>
          </button>
          <button className={`nav-item ${activeTab === 'specs' ? 'act' : ''}`} onClick={() => setActiveTab('specs')}>
            <Icon name="briefcase" /> <span className="nav-lbl">Material Specs</span>
          </button>
          <button className={`nav-item ${activeTab === 'logs' ? 'act' : ''}`} onClick={() => setActiveTab('logs')}>
            <Icon name="file" /> <span className="nav-lbl">Site Logs</span>
          </button>
          <button className={`nav-item ${activeTab === 'chat' ? 'act' : ''}`} onClick={() => setActiveTab('chat')}>
            <Icon name="chat" /> <span className="nav-lbl">Direct Chat</span>
          </button>
        </nav>
        <div className="sb-bot">
          <button className="nav-item sign-out-btn" onClick={logout}><Icon name="out" /> <span className="nav-lbl">Sign Out</span></button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="tb-brand">Collaborator Workspace</div>
          <div className="tb-right">
            <GlobalControls />
            <div className="tb-avatar">{profile?.full_name?.[0]}</div>
          </div>
        </header>

        <div className="page-content" style={{ padding: '40px' }}>
          <h1 className="page-title" style={{ fontSize: '28px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', marginBottom: '8px' }}>
            {profile?.full_name?.split(' ')[0]}, Excellence in every detail.
          </h1>
          <p className="page-sub" style={{ opacity: 0.5, marginBottom: '40px' }}>
            {profile?.role === 'admin' ? 'Studio Management & Control' : 'Acesso técnico para parceiros e execução de obras DARA Studio.'}
          </p>

          {activeTab === 'dashboard' && (
            <>
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div className="kpi" onClick={() => setActiveTab('drawings')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="folder" size={12} /> Technical Drawings
                  </div>
                  <div className="kpi-val" style={{ fontSize: '18px', fontWeight: '600' }}>Plantas & Cortes</div>
                  <div className="kpi-trend" style={{ fontSize: '11px', opacity: 0.5 }}>Detalhamentos técnicos</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('tasks')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="target" size={12} /> Task Management
                  </div>
                  <div className="kpi-val" style={{ fontSize: '18px', fontWeight: '600' }}>Cronograma</div>
                  <div className="kpi-trend" style={{ fontSize: '11px', opacity: 0.5 }}>Lista de entregas e prazos</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('specs')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="briefcase" size={12} /> Material Specs
                  </div>
                  <div className="kpi-val" style={{ fontSize: '18px', fontWeight: '600' }}>Especificações</div>
                  <div className="kpi-trend" style={{ fontSize: '11px', opacity: 0.5 }}>Dados técnicos de fornecedores</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('logs')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="file" size={12} /> Site Logs
                  </div>
                  <div className="kpi-val" style={{ fontSize: '18px', fontWeight: '600' }}>Diário de Obra</div>
                  <div className="kpi-trend" style={{ fontSize: '11px', opacity: 0.5 }}>Registro de vistorias</div>
                </div>
              </div>
              
              {loading ? (
                <div style={{ color: 'var(--a)' }}>Loading assigned projects...</div>
              ) : projects.length === 0 ? (
                <div className="card" style={{ padding: '60px', textAlign: 'center', opacity: 0.3, border: '1px dashed var(--border)' }}>
                   <Icon name="briefcase" size={32} />
                   <p style={{ marginTop: '16px' }}>No active collaborations found.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '32px' }}>
                  {projects.map(p => (
                    <div key={p.id} className="card anim" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{p.address || 'Untitled Project'}</h3>
                          <p style={{ fontSize: '12px', opacity: 0.4 }}>Client: {p.profiles?.full_name}</p>
                        </div>
                        <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: 'var(--a)' }}>{p.status?.toUpperCase() || 'ACTIVE'}</span>
                      </div>
                      
                      <div style={{ marginTop: '20px' }}>
                        <div style={{ fontSize: '11px', opacity: 0.4, textTransform: 'uppercase', marginBottom: '8px' }}>Current Phase</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(212,175,55,0.05)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.1)' }}>
                          <span style={{ fontSize: '18px' }}>{PHASE_NAMES[p.timeline_phase]?.split(' ')[0] || '📐'}</span>
                          <span style={{ fontWeight: '600', color: 'var(--a)' }}>{PHASE_NAMES[p.timeline_phase]?.split(' ')[1] || 'Design'}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '24px', height: '300px', background: 'rgba(0,0,0,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
                        <Chat projectId={p.id} lang="EN" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'drawings' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Technical Drawings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
                {['DARA-0010_REV01.dwg', 'DARA-0008_LAYOUT.pdf', 'SITE_PLAN_V3.cad'].map(file => (
                  <div key={file} className="card vault-card anim" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ width: 32, height: 32, background: 'rgba(99,102,241,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                        <Icon name="layers" size={16} />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{file}</div>
                    </div>
                    <button className="btn-o btn-sm" style={{ width: '100%' }}>Download CAD</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Task Management</h3>
              <div className="card" style={{ padding: '24px' }}>
                {[
                  { task: 'Survey measurements at 41 Bowdoin', due: 'Tomorrow', priority: 'High' },
                  { task: 'Export PDF set for project DARA-0008', due: 'Friday', priority: 'Medium' },
                  { task: 'Review materials for Commonwealth Ave', due: 'Next week', priority: 'Low' }
                ].map(t => (
                  <div key={t.task} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{t.task}</div>
                      <div style={{ fontSize: '11px', opacity: 0.5 }}>Due: {t.due}</div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: t.priority === 'High' ? '#dc2626' : '#fff' }}>{t.priority}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Material Specs</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {['Hardware', 'Lighting', 'Finishes', 'Furniture', 'Plumbing'].map(spec => (
                  <div key={spec} className="card vault-card anim" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(167,139,250,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', margin: '0 auto 12px' }}>
                      <Icon name="briefcase" size={20} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{spec} Catalog</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Site Logs</h3>
              <div className="card" style={{ padding: '24px' }}>
                <button className="btn-p" style={{ marginBottom: '24px' }}>+ New Entry</button>
                {[
                  { date: '21/03/2026', title: 'Site Inspection - Foundation', by: 'Carlos Maia' },
                  { date: '18/03/2026', title: 'Initial Measurement Session', by: 'Ana Ferreira' }
                ].map(log => (
                  <div key={log.date} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '11px', opacity: 0.5, width: '80px' }}>{log.date}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600' }}>{log.title}</div>
                      <div style={{ fontSize: '11px', opacity: 0.5 }}>Logged by: {log.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Direct Chat</h3>
              <div className="card" style={{ height: '550px', padding: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Chat projectId="collab-team" lang="EN" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollaboratorPortal;
