import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const TRANSLATIONS = {
  EN: {
    title: "Welcome back",
    subtitle: "Access your DARA Studio portal",
    email: "Email Address",
    password: "Password",
    login: "Log In",
    google: "Continue with Google",
    noAccount: "Don't have an account?",
    contact: "Contact our team",
    error: "Invalid email or password",
    loading: "Processing..."
  },
  PT: {
    title: "Bem-vindo de volta",
    subtitle: "Acesse seu portal DARA Studio",
    email: "Endereço de E-mail",
    password: "Senha",
    login: "Entrar",
    google: "Continuar com Google",
    noAccount: "Não tem uma conta?",
    contact: "Contate nossa equipe",
    error: "E-mail ou senha inválidos",
    loading: "Processando..."
  }
};

const LoginPage = () => {
  const { lang, toggleLang } = useAppContext();
  const { loginWithGoogle, role } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.EN;

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t.error);
      setLoading(false);
    } else {
      // Redirect handled by AuthContext listener or manual redirect
      // We'll wait a bit for the profile to load in AuthContext
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      setError(err.message);
    }
  };

  // Effect to redirect when role is loaded
  React.useEffect(() => {
    if (role) {
      if (role === 'admin') navigate('/admin');
      else if (role === 'collaborator') navigate('/collaborator');
      else navigate('/portal');
    }
  }, [role, navigate]);

  return (
    <div className="login-container">
      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
          color: #fff;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }
        .login-card {
          width: 100%;
          max-width: 420px;
          background: rgba(20, 20, 25, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        .login-card::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), transparent, rgba(212, 175, 55, 0.1));
          border-radius: 26px;
          z-index: -1;
        }
        .logo-wrap {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-box {
          width: 56px;
          height: 56px;
          background: #D4AF37;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 32px;
          color: #000;
          margin-bottom: 16px;
        }
        h1 {
          font-family: Georgia, serif;
          font-style: italic;
          font-size: 28px;
          margin: 0 0 8px;
          color: #fff;
        }
        p.subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 32px;
        }
        .lang-toggle {
          position: absolute;
          top: 24px;
          right: 24px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.6);
          padding: 4px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }
        .form-group {
          margin-bottom: 20px;
        }
        label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: rgba(212, 175, 55, 0.8);
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        input {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-size: 14px;
          transition: all 0.2s;
        }
        input:focus {
          outline: none;
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.02);
        }
        .btn-primary {
          width: 100%;
          background: linear-gradient(135deg, #D4AF37, #B8963E);
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 14px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: transform 0.2s, opacity 0.2s;
          margin-top: 10px;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          opacity: 0.95;
        }
        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .divider {
          display: flex;
          align-items: center;
          margin: 24px 0;
          color: rgba(255, 255, 255, 0.15);
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 12px;
        }
        .btn-google {
          width: 100%;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 12px;
          padding: 12px;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-google:hover {
          background: #f0f0f0;
        }
        .error-msg {
          background: rgba(255, 80, 80, 0.1);
          border: 1px solid rgba(255, 80, 80, 0.3);
          color: #ff8080;
          padding: 12px;
          border-radius: 10px;
          font-size: 13px;
          margin-bottom: 24px;
          text-align: center;
        }
        .footer-links {
          text-align: center;
          margin-top: 32px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
        }
        .footer-links a {
          color: #D4AF37;
          text-decoration: none;
          font-weight: 600;
        }
      `}</style>

      <div className="login-card">
        <button className="lang-toggle" onClick={toggleLang}>{lang}</button>
        
        <div className="logo-wrap">
          <div className="logo-box">D</div>
          <h1>{t.title}</h1>
          <p className="subtitle">{t.subtitle}</p>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleEmailLogin}>
          <div className="form-group">
            <label>{t.email}</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com"
              required 
            />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
              required 
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t.loading : t.login}
          </button>
        </form>

        <div className="divider">OR</div>

        <button className="btn-google" onClick={handleGoogleLogin}>
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84c-.21 1.12-.84 2.07-1.79 2.7l2.85 2.22c1.67-1.55 2.63-3.83 2.63-6.57z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.85-2.22c-.79.53-1.8.85-3.11.85-2.39 0-4.41-1.61-5.14-3.78H.9v2.33C2.39 16.03 5.46 18 9 18z"/>
            <path fill="#FBBC05" d="M3.86 10.67c-.19-.55-.3-1.14-.3-1.67s.11-1.12.3-1.67V5H.9C.33 6.13 0 7.47 0 9s.33 2.87.9 4h2.96l.1-1.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.47.89 11.43 0 9 0 5.46 0 2.39 1.97.9 4.97L3.86 7.3C4.59 5.13 6.61 3.58 9 3.58z"/>
          </svg>
          {t.google}
        </button>

        <div className="footer-links">
          {t.noAccount} <a href="#contact">{t.contact}</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
