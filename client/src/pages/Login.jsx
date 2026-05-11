import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAppContext } from '../context/AppContext';
import GlobalControls from '../components/GlobalControls';
import Icon from '../components/Icon';
import BackgroundOrbs from '../components/BackgroundOrbs';

const PORTAL_DATA = {
  client: {
    EN: {
      title: "Welcome to your Sanctuary.",
      subtitle: "Track every detail of your space's transformation in real time.",
      features: [
        { icon: 'rcpt', label: 'Project Status', desc: 'Detailed schedule and next steps.' },
        { icon: 'image', label: 'Selection Gallery', desc: 'Choose materials, textures, and finishes.' },
        { icon: 'dollar', label: 'Financial Hub', desc: 'View estimates and payment schedule.' },
        { icon: 'chat', label: 'Direct Chat', desc: 'Direct channel with your design team.' }
      ]
    },
    PT: {
      title: "Bem-vindo ao seu Santuário.",
      subtitle: "Acompanhe cada detalhe da transformação do seu espaço em tempo real.",
      features: [
        { icon: 'rcpt', label: 'Project Status', desc: 'Cronograma detalhado e próximas etapas.' },
        { icon: 'image', label: 'Selection Gallery', desc: 'Escolha de materiais, texturas e acabamentos.' },
        { icon: 'dollar', label: 'Financial Hub', desc: 'Visualização de orçamentos e cronograma de pagamentos.' },
        { icon: 'chat', label: 'Direct Chat', desc: 'Canal direto com sua equipe de design.' }
      ]
    }
  },
  collaborator: {
    EN: {
      title: "Excellence in every detail.",
      subtitle: "Technical access for DARA Studio partners and project execution.",
      features: [
        { icon: 'layers', label: 'Technical Drawings', desc: 'Access floor plans, sections, and technical details.' },
        { icon: 'rcpt', label: 'Task Management', desc: 'List of deliverables and project deadlines.' },
        { icon: 'folder', label: 'Material Specs', desc: 'Complete technical specs from suppliers.' },
        { icon: 'cal', label: 'Site Logs', desc: 'Inspection records and construction diary.' }
      ]
    },
    PT: {
      title: "Excelência em cada detalhe.",
      subtitle: "Acesso técnico para parceiros e execução de obras DARA Studio.",
      features: [
        { icon: 'layers', label: 'Technical Drawings', desc: 'Acesso a plantas, cortes e detalhamentos técnicos.' },
        { icon: 'rcpt', label: 'Task Management', desc: 'Lista de entregas e prazos da obra.' },
        { icon: 'folder', label: 'Material Specs', desc: 'Especificações técnicas completas dos fornecedores.' },
        { icon: 'cal', label: 'Site Logs', desc: 'Registro de vistorias e diário de obra.' }
      ]
    }
  },
  admin: {
    EN: {
      title: "Mastering the Vision.",
      subtitle: "Administrative management, leads, and global project control.",
      features: [
        { icon: 'chart', label: 'Dashboard', desc: 'Overview of new estimates and active projects.' },
        { icon: 'layers', label: 'Asset Library', desc: 'Management of 3D blocks, textures, and portfolio.' },
        { icon: 'target', label: 'Lead Manager', desc: 'Control of contacts received through the site.' },
        { icon: 'users', label: 'User Control', desc: 'Access management for clients and partners.' }
      ]
    },
    PT: {
      title: "Mastering the Vision.",
      subtitle: "Gestão administrativa, leads e controle global de projetos.",
      features: [
        { icon: 'chart', label: 'Dashboard', desc: 'Visão geral de novos orçamentos e projetos ativos.' },
        { icon: 'layers', label: 'Asset Library', desc: 'Gestão de blocos 3D, texturas e portfólio.' },
        { icon: 'target', label: 'Lead Manager', desc: 'Controle dos contatos recebidos pelo site.' },
        { icon: 'users', label: 'User Control', desc: 'Gestão de acessos para clientes e parceiros.' }
      ]
    }
  }
};

const Login = () => {
  const { lang, theme } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const portalType = searchParams.get('portal') || 'client';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const activePortal = useMemo(() => PORTAL_DATA[portalType] || PORTAL_DATA.client, [portalType]);
  const content = activePortal[lang] || activePortal.EN;

  const T = {
    EN: {
      formTitle: 'Portal Access',
      email: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      signInGoogle: 'Continue with Google',
      forgot: 'Forgot password?',
      noAccount: "Don't have an account?",
      contact: 'Contact us',
      error: 'Invalid login credentials',
    },
    PT: {
      formTitle: 'Acesso ao Portal',
      email: 'E-mail',
      password: 'Senha',
      signIn: 'Entrar',
      signInGoogle: 'Continuar com Google',
      forgot: 'Esqueceu a senha?',
      noAccount: 'Não tem uma conta?',
      contact: 'Entre em contato',
      error: 'Credenciais inválidas',
    }
  }[lang];

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(T.error);
      setLoading(false);
    } else {
      // Redirect based on portal type or profile
      const redirectPath = portalType === 'admin' ? '/admin' : (portalType === 'collaborator' ? '/collaborator' : '/portal');
      navigate(redirectPath);
    }
  };

  const handleGoogleLogin = async () => {
    const redirectPath = portalType === 'admin' ? '/admin' : (portalType === 'collaborator' ? '/collaborator' : '/portal');
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + redirectPath }
    });
  };

  return (
    <div className={`login-root ${theme}`} style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      background: 'linear-gradient(135deg, #0d0a1e 0%, #1a1040 50%, #0d0a1e 100%)', 
      color: '#fff', 
      position: 'relative',
      overflow: 'hidden' 
    }}>
      <BackgroundOrbs />
      <div style={{
        position:'fixed',inset:0,zIndex:0,
        background:'radial-gradient(ellipse 70% 60% at 15% 50%,rgba(99,102,241,0.15) 0%,transparent 70%),radial-gradient(ellipse 45% 55% at 85% 25%,rgba(167,139,250,0.1) 0%,transparent 70%)',
        pointerEvents:'none'
      }} />

      {/* Left side - Branding & Dynamic Portal Info */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10%', position: 'relative', zIndex: 1 }}>
        <div style={{ marginBottom: '40px', maxWidth: '500px' }}>
          <div className="sp-logo-d" style={{
            width:52,height:52,
            background:'linear-gradient(135deg,#6366f1,#a78bfa)',
            borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:'Instrument Serif,serif',fontSize:26,color:'#fff',
            animation:'glowPulse 3s infinite',
            boxShadow:'0 8px 32px rgba(99,102,241,0.4)',
            marginBottom: 24
          }}>D</div>
          
          <h1 style={{
            fontFamily:'Instrument Serif,serif',fontSize:44,fontWeight:400,
            color: '#fff',
            marginBottom:12,
            lineHeight: 1.1
          }}>{content.title}</h1>
          
          <p style={{fontStyle:'italic',color:'rgba(255,255,255,0.5)',fontSize:15,marginBottom:40, lineHeight: 1.5}}>{content.subtitle}</p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
           {content.features.map(f => (
             <div key={f.label} style={{display:'flex', gap:16, alignItems:'flex-start'}}>
                <div style={{width:36,height:36,borderRadius:10,background:'rgba(99,102,241,0.12)',border:'1px solid rgba(99,102,241,0.25)',display:'flex',alignItems:'center',justifyContent:'center',color:'#818cf8', flexShrink: 0}}>
                  <Icon name={f.icon} size={16} color="inherit" />
                </div>
                <div>
                  <h4 style={{fontSize:13, fontWeight:600, color:'#fff', marginBottom:2}}>{f.label}</h4>
                  <p style={{color:'rgba(255,255,255,0.4)',fontSize:12, lineHeight: 1.4}}>{f.desc}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1, paddingRight: '5%' }}>
        <div style={{ position: 'absolute', top: '40px', right: '40px' }}>
          <GlobalControls />
        </div>

        <div style={{
          width:400,background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(99,102,241,0.2)',
          borderRadius:20,padding:32,
          backdropFilter:'blur(20px)',
          boxShadow:'0 8px 40px rgba(99,102,241,0.15)'
        }}>
          <h2 style={{fontFamily:'Instrument Serif,serif',fontSize:24,color:'#fff',marginBottom:4}}>{T.formTitle}</h2>
          <p style={{color:'rgba(255,255,255,0.4)',fontSize:13,marginBottom:24}}>{lang === 'EN' ? 'Welcome back to the studio.' : 'Bem-vindo de volta ao estúdio.'}</p>

          <button onClick={handleGoogleLogin} style={{
            width:'100%',display:'flex',alignItems:'center',justifyContent:'center',
            gap:10,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:12,padding:'11px 16px',color:'#fff',fontSize:13,cursor:'pointer',
            marginBottom:20,transition:'all 0.2s'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            {T.signInGoogle}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: '700' }}>{lang === 'EN' ? 'OR EMAIL' : 'OU E-MAIL'}</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

          <form onSubmit={handleEmailLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(99,102,241,0.8)',display:'block',marginBottom:6}}>{T.email}</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                style={{width:'100%',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:10,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box'}} 
                placeholder="architect@example.com" 
              />
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label style={{fontSize:10,fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',color:'rgba(99,102,241,0.8)',display:'block',marginBottom:6}}>{T.password}</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                style={{width:'100%',background:'rgba(99,102,241,0.08)',border:'1px solid rgba(99,102,241,0.2)',borderRadius:10,padding:'10px 14px',color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box'}} 
                placeholder="••••••••" 
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: '24px' }}>
              <button type="button" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '11px', cursor: 'pointer', fontWeight: '500' }}>{T.forgot}</button>
            </div>

            {error && <p style={{ color: '#ff4d4d', fontSize: '12px', marginBottom: '16px', textAlign: 'center', fontWeight: '600' }}>{error}</p>}

            <button type="submit" disabled={loading} style={{
              width:'100%',background:'linear-gradient(135deg,#6366f1,#a78bfa)',
              border:'none',borderRadius:12,padding:'12px',color:'#fff',fontSize:14,
              fontWeight:600,cursor:'pointer',boxShadow:'0 4px 20px rgba(99,102,241,0.4)',
              marginTop:8,transition:'all 0.2s', opacity: loading ? 0.7 : 1
            }}>
              {loading ? '...' : T.signIn}
            </button>
          </form>

          <p style={{textAlign:'center',marginTop:20,color:'rgba(255,255,255,0.3)',fontSize:12}}>
            {T.noAccount} <button style={{ background: 'none', border: 'none', color:'#818cf8', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>{T.contact}</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
