import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import GlobalControls from '../components/GlobalControls';
import Icon from '../components/Icon';
import Chat from '../components/Chat';
import SplashScreen from '../components/SplashScreen';
import BackgroundOrbs from '../components/BackgroundOrbs';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import './ClientPortal.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminPortal = () => {
  const { theme } = useAppContext();
  const [ready, setReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectFiles, setProjectFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*, profiles(full_name), files(count), messages(count)')
      .order('created_at', { ascending: false });

    if (!error) {
       // Format data to include counts
       const formatted = data.map(p => ({
          ...p,
          files_count: p.files?.[0]?.count || 0,
          messages_count: p.messages?.[0]?.count || 0
       }));
       setProjects(formatted);
    }
  };

  const fetchProjectFiles = async (projectId) => {
    setLoadingFiles(true);
    try {
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;

      // Generate signed URLs
      const filesWithUrls = await Promise.all(files.map(async (file) => {
        const { data, error: urlError } = await supabase.storage
          .from('project-files')
          .createSignedUrl(file.url, 3600);
        return { ...file, signedUrl: data?.signedUrl };
      }));

      setProjectFiles(filesWithUrls);
    } catch (err) {
      console.error(err);
    }
    setLoadingFiles(false);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    fetchProjectFiles(project.id);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error) setUsers(data);
    setLoading(false);
  };

  const updateRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    
    setIsInviting(true);
    setTimeout(() => {
      alert(`Invitation sent to ${inviteEmail} (Simulated)`);
      setInviteEmail('');
      setIsInviting(false);
    }, 1000);
  };

  const updateProjectField = async (projectId, field, value) => {
    const { error } = await supabase
      .from('projects')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', projectId);

    if (!error) {
      setProjects(projects.map(p => p.id === projectId ? { ...p, [field]: value } : p));
      if (selectedProject?.id === projectId) {
        setSelectedProject({ ...selectedProject, [field]: value });
      }
    }
  };

  if (!ready) {
    return <SplashScreen portalName="Portal Admin" onComplete={() => setReady(true)} />;
  }

  return (
    <div id="layout" className={theme === 'dark' ? 'dark' : ''}>
      <BackgroundOrbs />
      <aside className="sidebar">
        <div className="sb-head">
          <div className="sb-logo">D</div>
          <div className="sb-text">
            <div className="sb-name">DARA STUDIO</div>
            <div className="sb-tag">ADMIN ACCESS</div>
          </div>
        </div>
        <nav className="sb-nav">
          <button className={`nav-item ${activeTab === 'dashboard' ? 'act' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Icon name="home" size={16} /> <span className="nav-lbl">Dashboard</span>
          </button>
          <button className={`nav-item ${activeTab === 'leads' ? 'act' : ''}`} onClick={() => setActiveTab('leads')}>
            <Icon name="user" size={16} /> <span className="nav-lbl">Lead Manager</span>
          </button>
          <button className={`nav-item ${activeTab === 'projects' ? 'act' : ''}`} onClick={() => setActiveTab('projects')}>
            <Icon name="briefcase" size={16} /> <span className="nav-lbl">Project Control</span>
          </button>
          <button className={`nav-item ${activeTab === 'assets' ? 'act' : ''}`} onClick={() => setActiveTab('assets')}>
            <Icon name="folder" size={16} /> <span className="nav-lbl">Asset Library</span>
          </button>
          <button className={`nav-item ${activeTab === 'users' ? 'act' : ''}`} onClick={() => setActiveTab('users')}>
            <Icon name="shield" size={16} /> <span className="nav-lbl">User Control</span>
          </button>
          <button className={`nav-item ${activeTab === 'chat' ? 'act' : ''}`} onClick={() => setActiveTab('chat')}>
            <Icon name="chat" size={16} /> <span className="nav-lbl">System Chat</span>
          </button>
        </nav>
        <div className="sb-bot">
          <button className="nav-item" onClick={logout}>
            <Icon name="out" size={16} /> <span className="nav-lbl">Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="tb-brand">Admin Control Panel</div>
          <div className="tb-right">
            <GlobalControls />
            <div className="tb-avatar">A</div>
          </div>
        </header>

        <div className="page-content" style={{ padding: '40px' }}>
          <div className="admin-header" style={{ marginBottom: '48px' }}>
            <h1 className="page-title" style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--a)' }}>Mastering the Vision.</h1>
            <p className="page-sub" style={{ opacity: 0.5 }}>Gestão administrativa, leads e controle global de projetos.</p>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <div className="kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
                <div className="kpi" onClick={() => setActiveTab('projects')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="home" size={12} /> Projects
                  </div>
                  <div className="kpi-val" style={{ fontSize: '20px', fontWeight: '600' }}>{projects.length} Ativos</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('assets')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="folder" size={12} /> Assets
                  </div>
                  <div className="kpi-val" style={{ fontSize: '20px', fontWeight: '600' }}>Library</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('leads')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="user" size={12} /> Leads
                  </div>
                  <div className="kpi-val" style={{ fontSize: '20px', fontWeight: '600' }}>Manager</div>
                </div>
                <div className="kpi" onClick={() => setActiveTab('users')} style={{ cursor: 'pointer', background: 'var(--bg1)', padding: '24px', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <div className="kpi-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--a)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
                    <Icon name="shield" size={12} /> Users
                  </div>
                  <div className="kpi-val" style={{ fontSize: '20px', fontWeight: '600' }}>Control</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '48px' }}>
                <div className="card" style={{ padding: '24px', background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: '24px' }}>Lead Volume (7 Days)</h3>
                  <div style={{ height: '300px' }}>
                    <Bar 
                      data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{ data: [12, 19, 15, 22, 28, 14, 10], backgroundColor: '#6366f1', borderRadius: 6 }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                    />
                  </div>
                </div>
                <div className="card" style={{ padding: '24px', background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--mu)', textTransform: 'uppercase', marginBottom: '24px' }}>Project Status</h3>
                  <div style={{ height: '300px' }}>
                    <Doughnut 
                      data={{
                        labels: ['Active', 'Pending', 'Done'],
                        datasets: [{ data: [15, 8, 22], backgroundColor: ['#6366f1', '#a78bfa', '#10b981'], borderWidth: 0 }]
                      }}
                      options={{ responsive: true, maintainAspectRatio: false, cutout: '70%' }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className="admin-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>User Management</h3>
                <form onSubmit={handleInvite} style={{ display: 'flex', gap: '10px' }}>
                  <input type="email" placeholder="email@dara.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px 16px', color: '#fff' }} />
                  <button style={{ background: 'var(--a)', color: '#000', border: 'none', borderRadius: '8px', padding: '0 20px', fontWeight: '600' }}>Invite</button>
                </form>
              </div>
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '10px', textTransform: 'uppercase' }}>
                    <tr><th style={{ padding: '16px 20px' }}>Name</th><th style={{ padding: '16px 20px' }}>Role</th><th style={{ padding: '16px 20px' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px 20px' }}>{u.full_name}</td>
                        <td style={{ padding: '16px 20px' }}>{u.role}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <select value={u.role} onChange={(e) => updateRole(u.id, e.target.value)} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '4px' }}>
                            <option value="client">Client</option><option value="collaborator">Collab</option><option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Project Control</h3>
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '10px', textTransform: 'uppercase' }}>
                    <tr><th style={{ padding: '16px 20px' }}>Project</th><th style={{ padding: '16px 20px' }}>Status</th><th style={{ padding: '16px 20px' }}>Actions</th></tr>
                  </thead>
                  <tbody>
                    {projects.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px 20px' }}>{p.address}</td>
                        <td style={{ padding: '16px 20px' }}>{p.status}</td>
                        <td style={{ padding: '16px 20px' }}><button onClick={() => handleProjectClick(p)} style={{ border: '1px solid var(--a)', color: 'var(--a)', background: 'none', padding: '4px 12px', borderRadius: '4px' }}>View</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Lead Manager</h3>
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'rgba(255,255,255,0.03)', fontSize: '10px', textTransform: 'uppercase' }}>
                    <tr><th style={{ padding: '16px 20px' }}>Contact</th><th style={{ padding: '16px 20px' }}>Project Type</th><th style={{ padding: '16px 20px' }}>Date</th><th style={{ padding: '16px 20px' }}>Status</th></tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, name: 'Amara Diallo', email: 'amara@diallo.com', type: 'New Construction', date: '21/03/2026', status: 'New' },
                      { id: 2, name: 'Robert Chen', email: 'robert@chen.com', type: 'Landscape Design', date: '20/03/2026', status: 'In Review' },
                      { id: 3, name: 'Maria Silva', email: 'maria@gmail.com', type: 'Interior Design', date: '19/03/2026', status: 'Contacted' }
                    ].map(l => (
                      <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ fontWeight: '600' }}>{l.name}</div>
                          <div style={{ fontSize: '11px', opacity: 0.5 }}>{l.email}</div>
                        </td>
                        <td style={{ padding: '16px 20px' }}>{l.type}</td>
                        <td style={{ padding: '16px 20px' }}>{l.date}</td>
                        <td style={{ padding: '16px 20px' }}>
                          <span style={{ fontSize: '10px', padding: '4px 8px', borderRadius: '4px', background: 'rgba(99,102,241,0.1)', color: '#818cf8' }}>{l.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>Asset Library</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {['3D Blocks', 'Textures', 'Portfólio', 'Templates', 'Legal Docs'].map(cat => (
                  <div key={cat} className="card vault-card anim" style={{ padding: '24px', textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, background: 'rgba(167,139,250,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', margin: '0 auto 16px' }}>
                      <Icon name="folder" size={24} />
                    </div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cat}</div>
                    <div style={{ fontSize: '11px', opacity: 0.5 }}>Manage assets</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="admin-section">
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '32px' }}>System Chat</h3>
              <div className="card" style={{ height: '600px', padding: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <Chat projectId="system-admin" lang="EN" />
                </div>
              </div>
            </div>
          )}
        </div>

          {selectedProject && (
            <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
               <div className="project-detail-modal anim" onClick={e => e.stopPropagation()} style={{ background: '#0a0a0a', border: '1px solid rgba(212,175,55,0.2)', padding: '40px', maxWidth: '800px', width: '90%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px' }}>
                     <div>
                        <h2 style={{ fontSize: '24px', fontFamily: 'var(--font-serif)', color: '#D4AF37' }}>{selectedProject.address}</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Manage files and project deliverables</p>
                     </div>
                     <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>✕</button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                     <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                        <h4 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Project Status</h4>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                           {['pending', 'active', 'on_hold', 'completed'].map(s => (
                              <button 
                                 key={s} 
                                 onClick={() => updateProjectField(selectedProject.id, 'status', s)}
                                 style={{ 
                                    padding: '6px 12px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '11px', cursor: 'pointer',
                                    background: selectedProject.status === s ? 'var(--a)' : 'transparent',
                                    color: selectedProject.status === s ? '#000' : '#fff'
                                 }}
                              >
                                 {s.replace('_', ' ')}
                              </button>
                           ))}
                        </div>
                     </div>

                     <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '20px' }}>
                        <h4 style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: '12px' }}>Timeline Phase</h4>
                        <select 
                           value={selectedProject.timeline_phase || 'survey'} 
                           onChange={(e) => updateProjectField(selectedProject.id, 'timeline_phase', e.target.value)}
                           style={{ 
                              width: '100%', background: '#111', border: '1px solid rgba(255,255,255,0.1)', 
                              color: '#fff', padding: '8px', borderRadius: '4px', fontSize: '12px' 
                           }}
                        >
                           <option value="survey">🔍 Vistoria (As-Built)</option>
                           <option value="floor_plans">📐 Plantas (Layout)</option>
                           <option value="design_review">🎨 Revisão de Design</option>
                           <option value="permit_drawings">📋 Aprovação (Permit)</option>
                           <option value="final_delivery">📦 Entrega Final</option>
                        </select>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                     <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: '24px' }}>
                        <h3 style={{ fontSize: '14px', marginBottom: '16px' }}>Uploaded Files</h3>
                        {loadingFiles ? (
                           <div style={{ padding: '40px', textAlign: 'center', color: '#D4AF37' }}>Loading vault...</div>
                        ) : projectFiles.length === 0 ? (
                           <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No files uploaded for this project yet.</p>
                        ) : (
                           <div style={{ display: 'grid', gap: '10px' }}>
                              {projectFiles.map(f => (
                                 <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                    <div>
                                       <div style={{ fontSize: '13px', fontWeight: '600' }}>{f.name}</div>
                                       <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>{f.type} • {new Date(f.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <a href={f.signedUrl} target="_blank" rel="noreferrer" style={{ color: '#D4AF37', fontSize: '12px', textDecoration: 'none', fontWeight: '600' }}>Download</a>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>

                     <div className="card" style={{ background: 'rgba(255,255,255,0.02)', padding: 0, height: '400px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                           <h3 style={{ fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Icon name="chat" size={16} /> Live Project Chat
                           </h3>
                        </div>
                        <div style={{ flex: 1, minHeight: 0 }}>
                           <Chat projectId={selectedProject.id} lang="EN" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
      </main>
    </div>
  );
};

export default AdminPortal;
