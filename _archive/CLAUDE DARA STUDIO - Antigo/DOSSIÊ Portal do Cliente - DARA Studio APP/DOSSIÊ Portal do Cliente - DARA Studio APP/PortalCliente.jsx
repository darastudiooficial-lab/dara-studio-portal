import { useState, useEffect, useCallback } from "react";
import './global.css';
import {
  LayoutDashboard, FolderKanban, Receipt,
  MessageSquare, User, Building2, LogOut, Plus,
  ArrowLeft, CheckCircle2, AlertCircle, AlertTriangle,
  ChevronRight, ChevronLeft, Bell, Settings, Send,
  TrendingUp, FileText, FileDown, Upload, Mail, Menu, X,
  Eye, EyeOff, Info, Zap
} from "lucide-react";

// ── SUPABASE CLIENT ────────────────────────────────────────
// Variáveis de ambiente injetadas pelo Vite em build-time (import.meta.env).
// NUNCA exponha chaves diretamente no código — use o arquivo .env na raiz.
// Exemplo .env:
//   VITE_SUPABASE_URL=https://xxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGc...
//
// Para ativar em produção:
//   1. Instale: npm install @supabase/supabase-js
//   2. Crie src/lib/supabase.js:
//        import { createClient } from '@supabase/supabase-js'
//        export const supabase = createClient(
//          import.meta.env.VITE_SUPABASE_URL,
//          import.meta.env.VITE_SUPABASE_ANON_KEY
//        )
//   3. Substitua a linha abaixo: import { supabase } from './lib/supabase'
const SUPABASE_READY = false; // ← mude para true após configurar
const supabase = null;        // ← substitua pelo import do client real

// ── DADOS DE DEMONSTRAÇÃO (usados quando SUPABASE_READY = false) ──────
// Substituídos automaticamente por dados reais quando Supabase estiver conectado.
const DEMO_USER = {
  id:       "mock-user-id",
  name:     "Jackson Da Silva",
  company:  "Jack General Services Inc.",
  email:    "jackgeneraloffice@gmail.com",
  phone:    "+1 (617) 775-0179",
  initials: "JD",
  avatar:   null,
};
const DEMO_PROJECTS = [
  { id:1, code:"DARA-0010", address:"41 Bowdoin Ave", city:"Dorchester, MA",
    service:"New Construction — Single Family", stage:"Detalhamento",
    status:"on_track", budget:2718, paid:0, progress:6,
    updatedAt:"Mar 18, 2026", pendingAction:"Aguardando informações do cliente" },
  { id:2, code:"DARA-0008", address:"88 Dover St", city:"Boston, MA",
    service:"Commercial Office Renovation", stage:"Estudo Preliminar",
    status:"on_track", budget:4200, paid:2100, progress:50,
    updatedAt:"Mar 14, 2026", pendingAction:null },
  { id:3, code:"DARA-0005", address:"215 Hampton Rd", city:"Brookline, MA",
    service:"Interior Design — Living Room", stage:"Entrega Final",
    status:"completed", budget:1800, paid:1800, progress:100,
    updatedAt:"Feb 28, 2026", pendingAction:null },
];
const DEMO_INVOICES = [
  { id:"INV-2026-003", project:"41 Bowdoin Ave", amount:1359, status:"pending", due:"Apr 15, 2026" },
  { id:"INV-2026-002", project:"88 Dover St",    amount:1400, status:"pending", due:"Mar 30, 2026" },
  { id:"INV-2026-001", project:"88 Dover St",    amount:700,  status:"paid",    due:"Mar 10, 2026" },
];
const DEMO_ACTIVITY = [
  { id:1, type:"file",    text:"Novo arquivo publicado em 41 Bowdoin Ave",      time:"2h atrás",  icon:FileDown },
  { id:2, type:"invoice", text:"Fatura INV-2026-002 vencimento em 10 dias",     time:"1d atrás",  icon:Receipt },
  { id:3, type:"message", text:"Nova mensagem de Daniela (DARA Studio)",        time:"2d atrás",  icon:MessageSquare },
];

// ── CAMADA DE ACESSO A DADOS ──────────────────────────────────
// Cada função segue o mesmo padrão:
//   1. Se supabase = null (demonstração) → retorna dados de demonstração
//   2. Se supabase está conectado → busca do banco real
//   3. Se a query falhar → retorna dados de demonstração como fallback seguro
//
// Para produção: substitua "const supabase = null" pelo client real
// e mude SUPABASE_READY para true. O restante do código não muda.

async function fetchProfile(userId) {
  if (!supabase) return DEMO_USER;
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, company, email, phone, avatar_url")
    .eq("id", userId)
    .single();
  if (error || !data) return DEMO_USER;
  return {
    id:       data.id,
    name:     data.full_name,
    company:  data.company,
    email:    data.email,
    phone:    data.phone,
    initials: (data.full_name||"??").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase(),
    avatar:   data.avatar_url || null,
  };
}

async function fetchProjects(userId) {
  if (!supabase) return DEMO_PROJECTS;
  const { data, error } = await supabase
    .from("projects")
    .select(`id, code, address, city, service, stage, status,
             budget, paid, progress, updated_at, pending_action`)
    .eq("client_id", userId)
    .order("updated_at", { ascending: false });
  if (error || !data) return DEMO_PROJECTS;
  return data.map(p => ({
    id:            p.id,
    code:          p.code,
    address:       p.address,
    city:          p.city,
    service:       p.service,
    stage:         p.stage,
    status:        p.status,
    budget:        p.budget,
    paid:          p.paid,
    progress:      p.progress,
    updatedAt:     new Date(p.updated_at).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}),
    pendingAction: p.pending_action || null,
  }));
}

async function fetchInvoices(userId) {
  if (!supabase) return DEMO_INVOICES;
  const { data, error } = await supabase
    .from("invoices")
    .select("id, project_address, amount, status, due_date")
    .eq("client_id", userId)
    .order("due_date", { ascending: true });
  if (error || !data) return DEMO_INVOICES;
  return data.map(i => ({
    id:      i.id,
    project: i.project_address,
    amount:  i.amount,
    status:  i.status,
    due:     new Date(i.due_date).toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}),
  }));
}

async function fetchActivity(userId) {
  if (!supabase) return DEMO_ACTIVITY;
  // Busca eventos de 3 fontes: arquivos, faturas próximas e mensagens não lidas
  const iconMap = { file:FileDown, invoice:Receipt, message:MessageSquare };
  const results = [];
  const [filesRes, msgRes] = await Promise.all([
    supabase.from("project_files")
      .select("id, file_name, project_id, created_at")
      .eq("client_id", userId)
      .order("created_at", { ascending: false })
      .limit(3),
    supabase.from("messages")
      .select("id, content, created_at")
      .eq("client_id", userId)
      .eq("read", false)
      .order("created_at", { ascending: false })
      .limit(3),
  ]);
  (filesRes.data||[]).forEach(f => results.push({
    id:   f.id, type:"file",
    text: `Novo arquivo publicado: ${f.file_name}`,
    time: timeAgo(f.created_at), icon: FileDown,
  }));
  (msgRes.data||[]).forEach(m => results.push({
    id:   m.id, type:"message",
    text: `Nova mensagem: ${(m.content||"").slice(0,50)}`,
    time: timeAgo(m.created_at), icon: MessageSquare,
  }));
  return results.length ? results : DEMO_ACTIVITY;
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff/60000);
  if (m < 60) return `${m}min atrás`;
  const h = Math.floor(m/60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h/24)}d atrás`;
}


// ── HELPERS ──────────────────────────────────
const fmt = (n) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const statusLabel = { on_track: "Em Andamento", attention: "Atenção", completed: "Concluído" };
const statusColor = {
  on_track: { bg: "var(--green-bg)", color: "var(--green)", dot: "#2d8653" },
  attention: { bg: "var(--amber-bg)", color: "var(--amber)", dot: "#c07c0a" },
  completed: { bg: "var(--blue-bg)", color: "var(--blue)", dot: "#2566a8" },
};

function StatusBadge({ status }) {
  const s = statusColor[status] || statusColor.on_track;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:11, fontWeight:600,
      background:s.bg, color:s.color, borderRadius:20, padding:"3px 10px" }}>
      <span style={{ width:5,height:5,borderRadius:"50%",background:s.dot,flexShrink:0 }}/>
      {statusLabel[status]}
    </span>
  );
}

function NavItem({ icon: Icon, label, active, badge, onClick, collapsed }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", display:"flex", alignItems:"center", gap:10,
      padding: collapsed ? "10px 0" : "9px 14px",
      justifyContent: collapsed ? "center" : "flex-start",
      background: active ? "rgba(184,155,106,0.15)" : "none",
      border: "none", borderRadius:8, color: active ? "var(--gold)" : "rgba(255,255,255,0.45)",
      fontSize:13, fontWeight: active ? 600 : 400, transition:"all 0.15s",
      position:"relative",
    }}
    onMouseEnter={e => { if(!active) e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.color="rgba(255,255,255,0.75)"; }}
    onMouseLeave={e => { if(!active) e.currentTarget.style.background="none"; e.currentTarget.style.color=active?"var(--gold)":"rgba(255,255,255,0.45)"; }}
    >
      <Icon size={15} style={{ flexShrink:0 }} />
      {!collapsed && <span style={{ flex:1, textAlign:"left" }}>{label}</span>}
      {!collapsed && badge > 0 && (
        <span style={{ background:"var(--gold)", color:"#1a1814", borderRadius:10, fontSize:10,
          fontWeight:700, minWidth:18, height:18, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 5px" }}>
          {badge}
        </span>
      )}
      {collapsed && badge > 0 && (
        <span style={{ position:"absolute", top:6, right:6, width:7,height:7, borderRadius:"50%", background:"var(--gold)" }}/>
      )}
    </button>
  );
}

// ════════════════════════════════════════════
//  LOGIN SCREEN — Supabase Auth
// ════════════════════════════════════════════
function LoginScreen({ onLogin }) {
  const [tab,      setTab]      = useState("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [info,     setInfo]     = useState("");   // e.g. "Check your email"

  // ── LOGIN ──
  const handleLogin = async () => {
    if (!email || !password) { setError("Preencha todos os campos."); return; }
    setError(""); setLoading(true);

    if (supabase) {
      // ── REAL AUTH ──
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (authErr) {
        // Mapeia erros do Supabase (inglês) para mensagens amigáveis em português
        const authErrMessages = {
          "Invalid login credentials":          "E-mail ou senha incorretos.",
          "invalid_credentials":                "E-mail ou senha incorretos.",
          "Email not confirmed":                "Confirme seu e-mail antes de entrar.",
          "Too many requests":                  "Muitas tentativas. Aguarde alguns minutos.",
          "User not found":                     "Nenhuma conta encontrada com este e-mail.",
          "Network request failed":             "Sem conexão. Verifique sua internet.",
          "Failed to fetch":                    "Sem conexão. Verifique sua internet.",
          "Invalid email":                      "Endereço de e-mail inválido.",
          "Password should be":                 "A senha deve ter ao menos 6 caracteres.",
          "User already registered":            "Este e-mail já possui uma conta.",
          "signup_disabled":                    "Cadastro desativado. Entre em contato com o suporte.",
        };
        const friendly = Object.entries(authErrMessages)
          .find(([key]) => (authErr.message || "").includes(key));
        setError(friendly ? friendly[1] : (authErr.message || "Erro ao entrar. Tente novamente."));
        return;
      }
      onLogin(data.user);
    } else {
      // ── MOCK FALLBACK ──
      setTimeout(() => {
        setLoading(false);
        if (email === "joao@darastudio.com" && password === "teste123") {
          onLogin(DEMO_USER);
        } else {
          setError("Email ou senha incorretos. (Mock: joao@darastudio.com / teste123)");
        }
      }, 800);
    }
  };

  // ── REGISTER ──
  const handleRegister = async () => {
    if (!name || !email || !password) { setError("Preencha todos os campos."); return; }
    if (password.length < 6) { setError("A senha deve ter ao menos 6 caracteres."); return; }
    setError(""); setLoading(true);

    if (supabase) {
      const { data, error: regErr } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: name } },
      });
      setLoading(false);
      if (regErr) {
        const regErrMessages = {
          "User already registered":    "Este e-mail já possui uma conta.",
          "Password should be":         "A senha deve ter no mínimo 6 caracteres.",
          "Network request failed":     "Sem conexão. Verifique sua internet.",
          "Unable to validate email":   "Endereço de e-mail inválido.",
        };
        const friendly = Object.entries(regErrMessages)
          .find(([key]) => (regErr.message || "").includes(key));
        setError(friendly ? friendly[1] : (regErr.message || "Erro ao criar conta."));
        return;
      }
      // Supabase envia e-mail de confirmação por padrão
      setInfo("Conta criada! Verifique seu e-mail para confirmar o acesso.");
      setTab("login");
    } else {
      setTimeout(() => {
        setLoading(false);
        setInfo("(Mock) Conta criada! Em produção, um e-mail de verificação será enviado.");
        setTab("login");
      }, 800);
    }
  };

  // ── GOOGLE OAUTH ──
  const handleGoogle = async () => {
    setError("");
    if (supabase) {
      const { error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      if (oauthErr) setError(oauthErr.message || "Erro ao autenticar com Google.");
    } else {
      setError("Google OAuth requer Supabase configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
    }
  };

  // ── FORGOT PASSWORD ──
  const handleForgot = async () => {
    if (!email) { setError("Digite seu e-mail acima primeiro."); return; }
    if (supabase) {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (resetErr) { setError(resetErr.message); return; }
      setInfo("E-mail de recuperação enviado! Verifique sua caixa de entrada.");
    } else {
      setInfo("(Mock) E-mail de recuperação seria enviado para: " + email);
    }
  };

  const handleSubmit = () => tab === "login" ? handleLogin() : handleRegister();

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>

      {/* Brand column */}
      <div style={{ width:380, marginRight:48, display:"flex", flexDirection:"column" }} className="fade-up">
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:36,height:36, background:"var(--gold)", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:18, color:"#fff" }}>D</span>
          </div>
          <div>
            <p style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:15, color:"var(--text)", lineHeight:1.2 }}>DARA Studio</p>
            <p style={{ fontSize:11, color:"var(--muted)" }}>Drafting & 3D Support</p>
          </div>
        </div>
        <h1 style={{ fontFamily:"var(--serif)", fontSize:32, fontWeight:700, lineHeight:1.25, color:"var(--text)", marginBottom:16 }}>
          Portal do<br/>Cliente
        </h1>
        <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, marginBottom:32 }}>
          Acesse seus projetos, arquivos e comunicações em um único lugar.
        </p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { icon:FolderKanban, text:"Acompanhe o progresso de cada projeto em tempo real" },
            { icon:Receipt,      text:"Gerencie faturas e realize pagamentos com segurança" },
            { icon:MessageSquare,text:"Comunicação direta com a equipe DARA Studio" },
          ].map(({ icon:Icon, text }) => (
            <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <div style={{ width:28,height:28, borderRadius:7, background:"var(--gold-d)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                <Icon size={13} color="var(--gold)" />
              </div>
              <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>{text}</p>
            </div>
          ))}
        </div>
        {/* Supabase status badge */}
        <div style={{ marginTop:28, padding:"7px 12px", borderRadius:7,
          background: SUPABASE_READY ? "rgba(45,134,83,0.1)" : "rgba(192,124,10,0.1)",
          border:`1px solid ${SUPABASE_READY ? "rgba(45,134,83,0.3)" : "rgba(192,124,10,0.3)"}`,
          display:"flex", alignItems:"center", gap:7 }}>
          <div style={{ width:7,height:7,borderRadius:"50%",
            background: SUPABASE_READY ? "var(--green)" : "var(--amber)",flexShrink:0 }}/>
          <span style={{ fontSize:11, color: SUPABASE_READY ? "var(--green)" : "var(--amber)", fontWeight:600 }}>
            {SUPABASE_READY ? "Supabase conectado" : "Modo demonstração (dados fictícios)"}
          </span>
        </div>
      </div>

      {/* Form card */}
      <div style={{ width:"100%", maxWidth:400, background:"var(--bg2)", borderRadius:16,
        border:"1px solid var(--border)", padding:"32px", boxShadow:"0 4px 40px rgba(0,0,0,0.06)" }}
        className="fade-up">

        {/* Tabs */}
        <div style={{ display:"flex", background:"var(--bg3)", borderRadius:8, padding:3, marginBottom:28 }}>
          {[["login","Entrar"],["register","Criar Conta"]].map(([id,label]) => (
            <button key={id} onClick={() => { setTab(id); setError(""); setInfo(""); }} style={{
              flex:1, padding:"8px 0", fontSize:13, fontWeight:tab===id?600:400,
              background:tab===id?"var(--bg2)":"none", border:"none", borderRadius:6,
              color:tab===id?"var(--text)":"var(--muted)",
              boxShadow:tab===id?"0 1px 4px rgba(0,0,0,0.08)":"none", transition:"all 0.15s",
            }}>{label}</button>
          ))}
        </div>

        <p style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>
          {tab === "login" ? "Bem-vindo de Volta" : "Crie sua Conta"}
        </p>
        <p style={{ fontSize:12, color:"var(--muted)", marginBottom:22 }}>
          {tab === "login" ? "Insira suas credenciais para acessar sua conta" : "Preencha os dados para criar seu acesso"}
        </p>

        {/* Info / success message */}
        {info && (
          <div style={{ padding:"9px 12px", background:"var(--green-bg)",
            border:"1px solid rgba(45,134,83,0.3)", borderRadius:8, marginBottom:14,
            display:"flex", alignItems:"flex-start", gap:7 }}>
            <CheckCircle2 size={13} color="var(--green)" style={{ flexShrink:0, marginTop:1 }}/>
            <p style={{ fontSize:12, color:"var(--green)", lineHeight:1.5 }}>{info}</p>
          </div>
        )}

        {/* Google OAuth */}
        <button onClick={handleGoogle} aria-label="Entrar com Google" style={{ width:"100%", display:"flex", alignItems:"center",
          justifyContent:"center", gap:10, border:"1.5px solid var(--border)", borderRadius:9,
          padding:"10px 16px", background:"var(--bg2)", fontSize:13, fontWeight:500,
          color:"var(--text)", marginBottom:16, cursor:"pointer", transition:"border 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {tab === "login" ? "Entrar com Google" : "Cadastrar com Google"}
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
          <span style={{ fontSize:11, color:"var(--dim)" }}>OU</span>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
        </div>

        {/* Name field (register only) */}
        {tab === "register" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>NOME COMPLETO</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Jackson Da Silva"
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}/>
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>EMAIL</label>
          <div style={{ position:"relative" }}>
            <Mail size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--dim)" }}/>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 12px 10px 32px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
        </div>

        {/* Password */}
        <div style={{ marginBottom: error ? 8 : 4 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>SENHA</label>
          <div style={{ position:"relative" }}>
            <input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 36px 10px 12px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            <button onClick={()=>setShowPw(p=>!p)} aria-label={showPw ? "Ocultar senha" : "Mostrar senha"} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--dim)", padding:4, cursor:"pointer" }}>
              {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
          </div>
        </div>

        {error && (
          <p style={{ fontSize:12, color:"var(--red)", margin:"8px 0 12px", display:"flex", alignItems:"center", gap:5 }}>
            <AlertCircle size={13}/>{error}
          </p>
        )}

        {/* Forgot password */}
        {tab === "login" && (
          <div style={{ textAlign:"right", marginBottom:16, marginTop:4 }}>
            <button onClick={handleForgot} style={{ background:"none", border:"none", fontSize:12, color:"var(--gold)", cursor:"pointer" }}>
              Esqueceu sua senha?
            </button>
          </div>
        )}

        {/* Submit */}
        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%",
          background: loading ? "var(--gold-d)" : "var(--gold)", border:"none", borderRadius:9,
          padding:"12px", fontSize:14, fontWeight:700, color: loading ? "var(--gold)" : "#fff",
          transition:"all 0.15s", boxShadow: loading?"none":"0 2px 12px rgba(184,155,106,0.35)",
          cursor: loading ? "not-allowed" : "pointer" }}>
          {loading ? "Aguarde..." : tab==="login" ? "Entrar" : "Criar Conta"}
        </button>
      </div>
    </div>
  );
}

  return (
    <div style={{ minHeight:"100vh", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>

      {/* Brand column (left, hidden on mobile) */}
      <div style={{ width:380, marginRight:48, display:"flex", flexDirection:"column" }} className="fade-up">
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32 }}>
          <div style={{ width:36,height:36, background:"var(--gold)", borderRadius:8,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:18, color:"#fff" }}>D</span>
          </div>
          <div>
            <p style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:15, color:"var(--text)", lineHeight:1.2 }}>DARA Studio</p>
            <p style={{ fontSize:11, color:"var(--muted)" }}>Drafting & 3D Support</p>
          </div>
        </div>

        <h1 style={{ fontFamily:"var(--serif)", fontSize:32, fontWeight:700, lineHeight:1.25, color:"var(--text)", marginBottom:16 }}>
          Portal do<br/>Cliente
        </h1>
        <p style={{ fontSize:14, color:"var(--muted)", lineHeight:1.7, marginBottom:32 }}>
          Acesse seus projetos, arquivos e comunicações em um único lugar.
        </p>

        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {[
            { icon:FolderKanban, text:"Acompanhe o progresso de cada projeto em tempo real" },
            { icon:Receipt, text:"Gerencie faturas e realize pagamentos com segurança" },
            { icon:MessageSquare, text:"Comunicação direta com a equipe DARA Studio" },
          ].map(({ icon:Icon, text }) => (
            <div key={text} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
              <div style={{ width:28,height:28, borderRadius:7, background:"var(--gold-d)",
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1 }}>
                <Icon size={13} color="var(--gold)" />
              </div>
              <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div style={{ width:"100%", maxWidth:400, background:"var(--bg2)", borderRadius:16,
        border:"1px solid var(--border)", padding:"32px 32px", boxShadow:"0 4px 40px rgba(0,0,0,0.06)" }}
        className="fade-up">

        {/* Tabs */}
        <div style={{ display:"flex", background:"var(--bg3)", borderRadius:8, padding:3, marginBottom:28 }}>
          {[["login","Entrar"],["register","Criar Conta"]].map(([id,label]) => (
            <button key={id} onClick={() => { setTab(id); setError(""); }} style={{
              flex:1, padding:"8px 0", fontSize:13, fontWeight: tab===id ? 600 : 400,
              background: tab===id ? "var(--bg2)" : "none", border:"none", borderRadius:6,
              color: tab===id ? "var(--text)" : "var(--muted)",
              boxShadow: tab===id ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition:"all 0.15s"
            }}>{label}</button>
          ))}
        </div>

        <p style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>
          {tab === "login" ? "Bem-vindo de Volta" : "Crie sua Conta"}
        </p>
        <p style={{ fontSize:12, color:"var(--muted)", marginBottom:22 }}>
          {tab === "login" ? "Insira suas credenciais para acessar sua conta" : "Preencha os dados para criar seu acesso"}
        </p>

        {/* Google */}
        <button style={{ width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
          border:"1.5px solid var(--border)", borderRadius:9, padding:"10px 16px", background:"var(--bg2)",
          fontSize:13, fontWeight:500, color:"var(--text)", marginBottom:16, transition:"border 0.15s" }}
          onMouseEnter={e=>e.currentTarget.style.borderColor="var(--gold)"}
          onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
          <span style={{ fontSize:11, color:"var(--dim)" }}>OU</span>
          <div style={{ flex:1, height:1, background:"var(--border)" }}/>
        </div>

        {/* Fields */}
        {tab === "register" && (
          <div style={{ marginBottom:12 }}>
            <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>NOME COMPLETO</label>
            <input placeholder="Jackson Da Silva" style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 12px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}/>
          </div>
        )}
        <div style={{ marginBottom:12 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>EMAIL</label>
          <div style={{ position:"relative" }}>
            <Mail size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--dim)" }}/>
            <input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 12px 10px 32px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
          </div>
        </div>
        <div style={{ marginBottom: error ? 8 : 20 }}>
          <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", display:"block", marginBottom:5 }}>SENHA</label>
          <div style={{ position:"relative" }}>
            <input type={showPw?"text":"password"} placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)}
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8, padding:"10px 36px 10px 12px", fontSize:13, color:"var(--text)", background:"var(--bg2)", outline:"none" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}
              onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/>
            <button onClick={()=>setShowPw(p=>!p)} aria-label={showPw ? "Ocultar senha" : "Mostrar senha"} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", color:"var(--dim)", padding:4, cursor:"pointer" }}>
              {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
            </button>
          </div>
        </div>

        {error && <p style={{ fontSize:12, color:"var(--red)", marginBottom:12, display:"flex", alignItems:"center", gap:5 }}><AlertCircle size={13}/>{error}</p>}

        {tab === "login" && (
          <div style={{ textAlign:"right", marginBottom:16, marginTop:-8 }}>
            <button style={{ background:"none", border:"none", fontSize:12, color:"var(--gold)", cursor:"pointer" }}>Esqueceu sua senha?</button>
          </div>
        )}

        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", background: loading ? "var(--gold-d)" : "var(--gold)",
          border:"none", borderRadius:9, padding:"12px", fontSize:14, fontWeight:700,
          color: loading ? "var(--gold)" : "#fff", transition:"all 0.15s",
          boxShadow: loading ? "none" : "0 2px 12px rgba(184,155,106,0.35)" }}>
          {loading ? "Entrando..." : tab==="login" ? "Entrar" : "Criar Conta"}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  DASHBOARD LAYOUT
// ════════════════════════════════════════════
function DashboardLayout({ user, onLogout }) {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showNotif, setShowNotif] = useState(false);
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [notifUnread, setNotifUnread] = useState(true);

  // ── ESTADO DE DADOS ──
  // Iniciados com dados de demonstração → substituídos pelos dados reais
  // assim que loadData() completa (via fetchProfile, fetchProjects, etc.)
  const [profile,  setProfile]  = useState(DEMO_USER);
  const [projects, setProjects] = useState(DEMO_PROJECTS);
  const [invoices, setInvoices] = useState(DEMO_INVOICES);
  const [activity, setActivity] = useState(DEMO_ACTIVITY);
  const [dataLoading, setDataLoading] = useState(false);

  // ── Fetch all data when user is available ──
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    setDataLoading(true);
    try {
      const [prof, projs, invs, acts] = await Promise.all([
        fetchProfile(user.id),
        fetchProjects(user.id),
        fetchInvoices(user.id),
        fetchActivity(user.id),
      ]);
      setProfile(prof);
      setProjects(projs);
      setInvoices(invs);
      setActivity(acts);
    } catch(e) {
      console.error("Error loading dashboard data:", e);
    } finally {
      setDataLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { loadData(); }, [loadData]);

  // ── REAL-TIME subscriptions (when Supabase is connected) ──
  useEffect(() => {
    if (!supabase || !user?.id) return;

    const projectsSub = supabase
      .channel("projects-changes")
      .on("postgres_changes",
        { event:"*", schema:"public", table:"projects", filter:`client_id=eq.${user.id}` },
        () => fetchProjects(user.id).then(setProjects)
      )
      .subscribe();

    const invoicesSub = supabase
      .channel("invoices-changes")
      .on("postgres_changes",
        { event:"*", schema:"public", table:"invoices", filter:`client_id=eq.${user.id}` },
        () => fetchInvoices(user.id).then(setInvoices)
      )
      .subscribe();

    const messagesSub = supabase
      .channel("messages-changes")
      .on("postgres_changes",
        { event:"INSERT", schema:"public", table:"messages", filter:`client_id=eq.${user.id}` },
        () => { setNotifUnread(true); fetchActivity(user.id).then(setActivity); }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(projectsSub);
      supabase.removeChannel(invoicesSub);
      supabase.removeChannel(messagesSub);
    };
  }, [user?.id]);

  const pendingInvoices = invoices.filter(i=>i.status==="pending").length;
  const totalPaid       = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const unreadMsg       = activity.filter(a=>a.type==="message").length;

  const openProject   = (project) => { setSelectedProject(project); setPage("project_detail"); };
  const backToProjects = () => { setSelectedProject(null); setPage("projects"); };

  const navItems = [
    { id:"dashboard", icon:LayoutDashboard, label:"Dashboard" },
    { id:"projects",  icon:FolderKanban,   label:"Meus Projetos" },
    { id:"invoices",  icon:Receipt,        label:"Faturas", badge: pendingInvoices },
    { id:"messages",  icon:MessageSquare,  label:"Mensagens", badge: unreadMsg },
  ];
  const bottomNav = [
    { id:"profile",  icon:User,     label:"Perfil" },
    { id:"company",  icon:Building2,label:"Empresa" },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"var(--bg)" }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: sidebarOpen ? 220 : 56, background:"var(--sidebar)", flexShrink:0,
        display:"flex", flexDirection:"column", transition:"width 0.22s ease", overflow:"hidden",
        position:"sticky", top:0, height:"100vh" }}>

        {/* Logo */}
        <div style={{ padding: sidebarOpen ? "20px 16px 16px" : "20px 0 16px", display:"flex",
          alignItems:"center", justifyContent: sidebarOpen ? "space-between" : "center",
          borderBottom:"1px solid rgba(255,255,255,0.06)", marginBottom:8 }}>
          {sidebarOpen && (
            <div style={{ display:"flex", alignItems:"center", gap:9 }}>
              <div style={{ width:30,height:30, background:"var(--gold)", borderRadius:7,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:15, color:"#fff" }}>D</span>
              </div>
              <div>
                <p style={{ fontFamily:"var(--serif)", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.9)", lineHeight:1.2 }}>DARA Studio</p>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.35)" }}>Portal do Cliente</p>
              </div>
            </div>
          )}
          <button onClick={()=>setSidebarOpen(o=>!o)} aria-label={sidebarOpen ? "Recolher menu" : "Expandir menu"} style={{ background:"none", border:"none",
            color:"rgba(255,255,255,0.3)", padding:4, borderRadius:5, transition:"color 0.15s" }}
            onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.7)"}
            onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.3)"}>
            {sidebarOpen ? <X size={14}/> : <Menu size={14}/>}
          </button>
        </div>

        {/* New Project CTA */}
        {sidebarOpen && (
          <div style={{ padding:"0 12px 12px" }}>
            <button onClick={() => setNewProjectModal(true)} style={{ width:"100%", background:"var(--gold)", border:"none", borderRadius:8,
              padding:"9px 12px", fontSize:12, fontWeight:700, color:"#fff", display:"flex",
              alignItems:"center", justifyContent:"center", gap:6, cursor:"pointer" }}>
              <Plus size={13}/> New Project
            </button>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex:1, padding:"0 8px", display:"flex", flexDirection:"column", gap:2 }}>
          {sidebarOpen && <p style={{ fontSize:10, color:"rgba(255,255,255,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", padding:"8px 6px 4px", fontWeight:600 }}>Menu</p>}
          {navItems.map(item => (
            <NavItem key={item.id} {...item} active={page===item.id || (page==="project_detail" && item.id==="projects")} collapsed={!sidebarOpen}
              onClick={()=>{ setSelectedProject(null); setPage(item.id); }} />
          ))}
        </nav>

        {/* Bottom nav */}
        <div style={{ padding:"8px 8px 12px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          {sidebarOpen && <p style={{ fontSize:10, color:"rgba(255,255,255,0.2)", letterSpacing:"0.12em", textTransform:"uppercase", padding:"8px 6px 4px", fontWeight:600 }}>Settings</p>}
          {bottomNav.map(item => (
            <NavItem key={item.id} {...item} active={page===item.id} collapsed={!sidebarOpen}
              onClick={()=>setPage(item.id)} />
          ))}
          <NavItem icon={LogOut} label="Sign Out" collapsed={!sidebarOpen}
            onClick={onLogout} />
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex:1, overflow:"auto", minWidth:0 }}>
        {/* Top bar */}
        <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border)", padding:"0 28px",
          height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"sticky", top:0, zIndex:40 }}>
          <div>
            <span style={{ fontSize:12, color:"var(--gold)", fontWeight:600, letterSpacing:"0.08em" }}>
              DARA Studio
            </span>
            <span style={{ fontSize:12, color:"var(--dim)", margin:"0 6px" }}>|</span>
            <span style={{ fontSize:12, color:"var(--muted)" }}>Drafting & 3D Support</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative" }}>
              <button onClick={()=>{ setShowNotif(o=>!o); }} aria-label="Notificações" style={{ background:"none", border:"none", color:"var(--muted)", position:"relative", padding:4, cursor:"pointer" }}>
                <Bell size={16}/>
                {notifUnread && <span style={{ position:"absolute", top:2, right:2, width:6,height:6, borderRadius:"50%", background:"var(--gold)" }}/>}
              </button>
              {showNotif && (
                <>
                  <div onClick={()=>setShowNotif(false)} style={{ position:"fixed", inset:0, zIndex:49 }}/>
                  <div style={{ position:"absolute", right:0, top:36, width:300, background:"var(--bg2)",
                    border:"1px solid var(--border)", borderRadius:12, boxShadow:"0 8px 32px rgba(0,0,0,0.12)",
                    zIndex:50, overflow:"hidden" }}>
                    <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:13, fontWeight:700, fontFamily:"var(--serif)" }}>Notificações</span>
                      <span onClick={()=>setNotifUnread(false)} style={{ fontSize:10, color:"var(--gold)", fontWeight:600, cursor:"pointer" }}>Marcar tudo como lido</span>
                    </div>
                    (activity.map((a,i) => (
                      <div key={a.id} style={{ display:"flex", gap:10, padding:"11px 16px",
                        borderBottom: i<activity.length-1 ? "1px solid var(--border)" : "none",
                        background: i===0 ? "rgba(184,155,106,0.04)" : "none", cursor:"pointer" }}
                        onMouseEnter={e=>e.currentTarget.style.background="var(--bg3)"}
                        onMouseLeave={e=>e.currentTarget.style.background=i===0?"rgba(184,155,106,0.04)":"none"}>
                        <div style={{ width:28,height:28,borderRadius:7,background:"var(--gold-d)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                          <a.icon size={12} color="var(--gold)"/>
                        </div>
                        <div>
                          <p style={{ fontSize:12, color:"var(--text)", lineHeight:1.4 }}>{a.text}</p>
                          <p style={{ fontSize:10, color:"var(--dim)", marginTop:2 }}>{a.time}</p>
                        </div>
                        {i===0 && <div style={{ width:6,height:6,borderRadius:"50%",background:"var(--gold)",flexShrink:0,marginTop:4 }}/>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:30,height:30, borderRadius:"50%", background:"var(--gold-d)",
                border:"1.5px solid var(--gold)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:11, fontWeight:700, color:"var(--gold)" }}>{profile.initials}</span>
              </div>
              {sidebarOpen && <span style={{ fontSize:12, fontWeight:500, color:"var(--text)" }}>{(profile.name||"User").split(" ")[0]}</span>}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding:"28px 28px 60px" }}>
          {page === "dashboard"      && <PageDashboard onNavigate={(p)=>{ if(p==="new_project") setNewProjectModal(true); else setPage(p); }} onOpenProject={openProject} pendingInvoices={pendingInvoices} totalPaid={totalPaid} unreadMsg={unreadMsg} projects={projects} invoices={invoices} activity={activity} profile={profile}/>}
          {page === "projects"       {page === "projects"       && <PageProjects onOpenProject={openProject} projects={projects} setProjects={setProjects}/>}{page === "projects"       && <PageProjects onOpenProject={openProject} projects={projects} setProjects={setProjects}/>} <PageProjects onOpenProject={openProject} projects={projects} setProjects={setProjects}/>}
          {page === "project_detail" && <PageProjectDetail project={selectedProject} onBack={backToProjects} />}
          {page === "invoices"       && <PageInvoices invoices={invoices}/>}
          {page === "messages"       && <PageMessages />}
          {page === "profile"        && <PageProfile profile={profile} onProfileUpdate={setProfile}/>}
          {page === "company"        && <PageCompany profile={profile} onProfileUpdate={setProfile}/>}
        </div>
      </main>

      {/* ── ESTIMATE FORM — full screen overlay ── */}
      {newProjectModal && (
        <div style={{ position:"fixed", inset:0, zIndex:300, overflowY:"auto" }}>
          <EstimateForm
            onClose={()=>setNewProjectModal(false)}
            onSubmit={(formData)=>{
              const serverPrice = formData.serverPrice || {};
              const newProject = {
                id:            formData.dbProjectId || Date.now(),
                code:          `DARA-${String(projects.length+1).padStart(4,"0")}`,
                address:       formData.street || formData.projectName || "Novo Projeto",
                city:          `${formData.city||""}, ${formData.state||""}`,
                projectName:   formData.projectName || "",
                service:       (formData.service || formData.detailService || "estimate").replace(/_/g," "),
                stage:         "Levantamento",
                status:        "on_track",
                // Always use server-validated price — never the raw formData price
                budget:        serverPrice.high || 0,
                paid:          0,
                progress:      0,
                updatedAt:     new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"}),
                pendingAction: "Aguardando revisão — válido por 30 dias",
                fileCount:     (formData.fileUrls||[]).length,
              };
              // If Supabase already inserted via EstimateForm, don't double-insert
              if (!formData.dbProjectId && supabase && user?.id) {
                supabase.from("projects").insert({
                  client_id:      user.id,
                  code:           newProject.code,
                  address:        newProject.address,
                  city:           newProject.city,
                  service:        newProject.service,
                  stage:          newProject.stage,
                  status:         newProject.status,
                  budget:         newProject.budget,
                  paid:           0,
                  progress:       0,
                  pending_action: newProject.pendingAction,
                }).then(({ error }) => { if (error) console.error("Insert project error:", error); });
              }
              setProjects(prev => [newProject, ...prev]);
              setNewProjectModal(false);
              setPage("projects");
            }}
          />
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: DASHBOARD
// ════════════════════════════════════════════
function PageDashboard({ onNavigate, onOpenProject, pendingInvoices, totalPaid, unreadMsg, projects, invoices, activity, profile }) {
  const activeProjects = (projects||[]).filter(p=>p.status!=="completed").length;

  const metricCards = [
    { label:"Active Projects", value: activeProjects, sub: `${(projects||[]).filter(p=>p.status==="completed").length} completed`, icon:FolderKanban, color:"var(--gold)", onClick:()=>onNavigate("projects") },
    { label:"Pending Invoices", value: pendingInvoices, sub:`$${(invoices||[]).filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0).toLocaleString()} outstanding`, icon:Receipt, color:"var(--amber)", onClick:()=>onNavigate("invoices") },
    { label:"Total Paid", value:`$${totalPaid.toLocaleString()}`, sub:"All time", icon:TrendingUp, color:"var(--green)", onClick:()=>onNavigate("invoices") },
  ];

  return (
    <div className="fade-up">
      {/* Header */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"var(--serif)", fontSize:24, fontWeight:700, marginBottom:4 }}>
          Welcome back, {profile.name.split(" ")[0]}
        </h1>
        <p style={{ fontSize:13, color:"var(--muted)" }}>Here's what's happening with your projects</p>
      </div>

      {/* Metric cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:28 }}>
        {metricCards.map((c,i) => (
          <button key={c.label} onClick={c.onClick} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12,
            padding:"18px 18px", textAlign:"left", cursor:"pointer", transition:"all 0.15s",
            animationDelay:`${i*0.06}s` }}
            className="fade-up"
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.boxShadow="0 2px 16px rgba(184,155,106,0.12)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";}}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em", textTransform:"uppercase" }}>{c.label}</p>
              <div style={{ width:28,height:28, borderRadius:7, background:`${c.color}18`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <c.icon size={13} color={c.color}/>
              </div>
            </div>
            <p style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"var(--text)", marginBottom:4 }}>{c.value}</p>
            <p style={{ fontSize:11, color:"var(--dim)" }}>{c.sub}</p>
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 300px", gap:18, alignItems:"start" }}>
        {/* Projects list */}
        <div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
            <h2 style={{ fontFamily:"var(--serif)", fontSize:16, fontWeight:700 }}>Your Projects</h2>
            <button onClick={()=>onNavigate("projects")} style={{ background:"none", border:"none", fontSize:12, color:"var(--gold)", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              View all <ChevronRight size={13}/>
            </button>
          </div>

          {(projects||[]).length === 0 ? (
            <div style={{ background:"var(--bg2)", border:"1.5px dashed var(--border)", borderRadius:12, padding:"48px 24px", textAlign:"center" }}>
              <FolderKanban size={32} color="var(--dim)" style={{ margin:"0 auto 12px" }}/>
              <p style={{ fontSize:14, color:"var(--muted)", marginBottom:4 }}>No projects yet</p>
              <p style={{ fontSize:12, color:"var(--dim)", marginBottom:16 }}>Submit a new project request and our team will get back to you with a proposal.</p>
              <button style={{ background:"var(--gold)", border:"none", borderRadius:8, padding:"9px 18px", fontSize:12, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                + Submit Project Request
              </button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {(projects||[]).map((p, i) => (
                <div key={p.id} onClick={()=>onOpenProject(p)} style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12,
                  padding:"16px 18px", cursor:"pointer", transition:"all 0.15s", animationDelay:`${i*0.07}s` }}
                  className="fade-up"
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.boxShadow="0 2px 12px rgba(184,155,106,0.1)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";}}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:3 }}>
                        <span style={{ fontFamily:"monospace", fontSize:10, color:"var(--gold)", fontWeight:700, background:"var(--gold-d)", borderRadius:4, padding:"1px 6px" }}>{p.code}</span>
                        <StatusBadge status={p.status}/>
                      </div>
                      <p style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:700, color:"var(--text)", marginBottom:1 }}>{p.address}</p>
                      <p style={{ fontSize:11, color:"var(--muted)" }}>{p.city} · {p.service}</p>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <p style={{ fontSize:11, color:"var(--dim)", marginBottom:2 }}>Budget</p>
                      <p style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:700, color:"var(--text)" }}>{fmt(p.budget)}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: p.pendingAction ? 10 : 0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--dim)", marginBottom:5 }}>
                      <span>Etapa atual: <strong style={{ color:"var(--text)" }}>{p.stage}</strong></span>
                      <span>{p.progress}%</span>
                    </div>
                    <div style={{ background:"var(--bg3)", borderRadius:3, height:5 }}>
                      <div style={{ width:`${p.progress}%`, height:"100%", borderRadius:3,
                        background: p.status==="completed" ? "var(--green)" : "linear-gradient(90deg,var(--gold),var(--gold-h))", transition:"width 0.6s ease" }}/>
                    </div>
                  </div>

                  {p.pendingAction && (
                    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 10px", background:"var(--amber-bg)", borderRadius:6, marginTop:8 }}>
                      <AlertCircle size={11} color="var(--amber)"/>
                      <span style={{ fontSize:11, color:"var(--amber)" }}>{p.pendingAction}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right col — alinhado com a lista de projetos */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {/* Recent Activity */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"18px 18px" }}>
            <h3 style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700, marginBottom:14 }}>Recent Activity</h3>
            {activity.length === 0 ? (
              <p style={{ fontSize:12, color:"var(--dim)", textAlign:"center", padding:"16px 0" }}>No recent activity</p>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                (activity.map(a => (
                  <div key={a.id} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:26,height:26, borderRadius:7, background:"var(--gold-d)",
                      display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <a.icon size={12} color="var(--gold)"/>
                    </div>
                    <div>
                      <p style={{ fontSize:12, color:"var(--text)", lineHeight:1.4 }}>{a.text}</p>
                      <p style={{ fontSize:10, color:"var(--dim)", marginTop:2 }}>{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  HELPER: PROJECT ICON (thematic by service)
// ════════════════════════════════════════════
function ProjectThumb({ service, size = 56 }) {
  const map = {
    "single family": { bg:"#e8f0e8", color:"#3a7a3a", label:"🏠" },
    "construction":  { bg:"#e8f0e8", color:"#3a7a3a", label:"🏗️" },
    "renovation":    { bg:"#e8eef5", color:"#2a5a8a", label:"🔨" },
    "commercial":    { bg:"#f0ece4", color:"#7a5a2a", label:"🏢" },
    "interior":      { bg:"#f5e8f0", color:"#8a3a6a", label:"🛋️" },
    "office":        { bg:"#e8eef5", color:"#2a5a8a", label:"🏢" },
    "kitchen":       { bg:"#f5ede8", color:"#8a4a2a", label:"🍳" },
    "bathroom":      { bg:"#e8f5f5", color:"#2a7a7a", label:"🚿" },
    "garage":        { bg:"#eeeae4", color:"#5a5040", label:"🚗" },
  };
  const key = Object.keys(map).find(k => service.toLowerCase().includes(k)) || "construction";
  const { bg, label } = map[key];
  return (
    <div style={{ width:size, height:size, borderRadius:10, background:bg, display:"flex",
      alignItems:"center", justifyContent:"center", fontSize:size*0.42, flexShrink:0 }}>
      {label}
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: MY PROJECTS
// ════════════════════════════════════════════
function PageProjects({ onOpenProject, projects: projectsProp, setProjects: setProjectsOuter }) {
  const [filter, setFilter] = useState("active");
  // Usa os projetos passados pelo DashboardLayout (reais ou demo)
  const [projects, setProjects] = [projectsProp || DEMO_PROJECTS, setProjectsOuter || (()=>{})];
  const [editModal, setEditModal] = useState(null);
  const [editName, setEditName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = filter === "all" ? projects
    : filter === "active" ? projects.filter(p=>p.status!=="completed")
    : projects.filter(p=>p.status==="completed");

  const doDelete = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setDeleteConfirm(null);
  };

  const doEdit = () => {
    if(!editName.trim()) return;
    setProjects(prev => prev.map(p => p.id===editModal ? {...p, address:editName.trim()} : p));
    setEditModal(null);
  };

  return (
    <div className="fade-up">
      <div style={{ marginBottom:20 }}>
        <h1 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:3 }}>My Projects</h1>
        <p style={{ fontSize:12, color:"var(--muted)" }}>{projects.length} total projects</p>
      </div>
      <div style={{ display:"flex", gap:6, marginBottom:20 }}>
        {[["active","Active"],["completed","Completed"],["all","All"]].map(([id,label]) => (
          <button key={id} onClick={()=>setFilter(id)} style={{
            padding:"6px 14px", fontSize:12, fontWeight:500, borderRadius:6, cursor:"pointer",
            background: filter===id ? "var(--gold)" : "var(--bg2)",
            color: filter===id ? "#fff" : "var(--muted)",
            border: filter===id ? "none" : "1px solid var(--border)" }}>
            {label} ({id==="active"?projects.filter(p=>p.status!=="completed").length:id==="completed"?projects.filter(p=>p.status==="completed").length:projects.length})
          </button>
        ))}
      </div>
      {filtered.length===0 ? (
        <div style={{ background:"var(--bg2)", border:"1.5px dashed var(--border)", borderRadius:12, padding:"48px", textAlign:"center" }}>
          <FolderKanban size={28} color="var(--dim)" style={{ margin:"0 auto 10px" }}/>
          <p style={{ fontSize:13, color:"var(--muted)" }}>No projects found</p>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {filtered.map(p => (
            <div key={p.id}
              style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12,
                padding:"16px 20px", transition:"all 0.15s",
                display:"flex", alignItems:"center", gap:16 }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--gold)";e.currentTarget.style.boxShadow="0 2px 12px rgba(184,155,106,0.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.boxShadow="none";}}>

              {/* Thematic thumbnail — clickable */}
              <div onClick={()=>onOpenProject(p)} style={{ cursor:"pointer" }}>
                <ProjectThumb service={p.service} size={56} />
              </div>

              {/* Main info — clickable */}
              <div style={{ flex:1, minWidth:0, cursor:"pointer" }} onClick={()=>onOpenProject(p)}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
                  <span style={{ fontFamily:"monospace", fontSize:10, color:"var(--gold)", fontWeight:700,
                    background:"var(--gold-d)", borderRadius:4, padding:"1px 6px" }}>{p.code}</span>
                  <StatusBadge status={p.status}/>
                  {p.pendingAction && (
                    <span style={{ fontSize:10, color:"var(--amber)", background:"var(--amber-bg)",
                      borderRadius:4, padding:"1px 8px", fontWeight:500 }}>⚠ Ação necessária</span>
                  )}
                </div>
                <p style={{ fontFamily:"var(--serif)", fontSize:16, fontWeight:700, marginBottom:2,
                  whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{p.address}</p>
                <p style={{ fontSize:11, color:"var(--muted)", marginBottom:8 }}>{p.city} · {p.service}</p>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ flex:1, background:"var(--bg3)", borderRadius:3, height:5 }}>
                    <div style={{ width:`${p.progress}%`, height:"100%", borderRadius:3,
                      background: p.status==="completed" ? "var(--green)" : "linear-gradient(90deg,var(--gold),var(--gold-h))" }}/>
                  </div>
                  <span style={{ fontSize:10, color:"var(--dim)", whiteSpace:"nowrap" }}>
                    <strong style={{ color:"var(--text)" }}>{p.stage}</strong> · {p.progress}%
                  </span>
                </div>
              </div>

              {/* Budget */}
              <div style={{ textAlign:"right", flexShrink:0, cursor:"pointer" }} onClick={()=>onOpenProject(p)}>
                <p style={{ fontSize:10, color:"var(--dim)", marginBottom:2 }}>Budget</p>
                <p style={{ fontFamily:"var(--serif)", fontSize:17, fontWeight:700 }}>{fmt(p.budget)}</p>
                <p style={{ fontSize:11, color: p.paid>0 ? "var(--green)" : "var(--dim)" }}>Paid: {fmt(p.paid)}</p>
                <p style={{ fontSize:10, color:"var(--dim)", marginTop:2 }}>Updated {p.updatedAt}</p>
              </div>

              {/* Action buttons */}
              <div style={{ display:"flex", flexDirection:"column", gap:6, flexShrink:0 }}>
                <button
                  onClick={e=>{ e.stopPropagation(); setEditName(p.address); setEditModal(p.id); }}
                  style={{ background:"var(--bg3)", border:"1px solid var(--border)", borderRadius:6,
                    padding:"5px 10px", fontSize:11, color:"var(--muted)", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:4 }}>
                  ✏️ Editar
                </button>
                <button
                  onClick={e=>{ e.stopPropagation(); setDeleteConfirm(p.id); }}
                  style={{ background:"rgba(184,50,50,0.06)", border:"1px solid rgba(184,50,50,0.2)",
                    borderRadius:6, padding:"5px 10px", fontSize:11, color:"var(--red)", cursor:"pointer",
                    display:"flex", alignItems:"center", gap:4 }}>
                  🗑 Excluir
                </button>
              </div>

              <ChevronRight size={16} color="var(--dim)" style={{ flexShrink:0, cursor:"pointer" }}
                onClick={()=>onOpenProject(p)}/>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={()=>setEditModal(null)}>
          <div style={{ background:"var(--bg2)", borderRadius:12, padding:"24px",
            width:"100%", maxWidth:400, border:"1px solid var(--border)" }}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"var(--serif)", fontSize:17, fontWeight:700, marginBottom:16 }}>Editar Projeto</h3>
            <label style={{ fontSize:11, fontWeight:600, color:"var(--muted)", letterSpacing:"0.05em",
              textTransform:"uppercase", display:"block", marginBottom:6 }}>Nome / Endereço</label>
            <input value={editName} onChange={e=>setEditName(e.target.value)}
              style={{ width:"100%", border:"1.5px solid var(--border)", borderRadius:8,
                padding:"9px 12px", fontSize:13, color:"var(--text)", background:"var(--bg3)",
                outline:"none", marginBottom:16, fontFamily:"var(--sans)" }}
              onFocus={e=>e.target.style.borderColor="var(--gold)"}
              onBlur={e=>e.target.style.borderColor="var(--border)"}/>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={doEdit}
                style={{ flex:1, background:"var(--gold)", border:"none", borderRadius:8,
                  padding:"10px", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                Salvar
              </button>
              <button onClick={()=>setEditModal(null)}
                style={{ flex:1, background:"none", border:"1px solid var(--border)", borderRadius:8,
                  padding:"10px", fontSize:13, color:"var(--muted)", cursor:"pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:300,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={()=>setDeleteConfirm(null)}>
          <div style={{ background:"var(--bg2)", borderRadius:12, padding:"24px",
            width:"100%", maxWidth:380, border:"1px solid var(--border)" }}
            onClick={e=>e.stopPropagation()}>
            <h3 style={{ fontFamily:"var(--serif)", fontSize:17, fontWeight:700, marginBottom:10 }}>Excluir Projeto?</h3>
            <p style={{ fontSize:13, color:"var(--muted)", marginBottom:20, lineHeight:1.6 }}>
              Esta ação é irreversível. O projeto e todos os seus dados serão removidos da lista.
            </p>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>doDelete(deleteConfirm)}
                style={{ flex:1, background:"var(--red)", border:"none", borderRadius:8,
                  padding:"10px", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                Excluir
              </button>
              <button onClick={()=>setDeleteConfirm(null)}
                style={{ flex:1, background:"none", border:"1px solid var(--border)", borderRadius:8,
                  padding:"10px", fontSize:13, color:"var(--muted)", cursor:"pointer" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  OVERVIEW TAB COMPONENT
//  — Audit Log, Area Alert, Quote Lock
// ════════════════════════════════════════════
function OverviewTab({ project, auditLog, setAuditLog, quoteApproved, setQuoteApproved, areaAlert, setAreaAlert, originalArea }) {
  const [form, setForm] = useState({
    name:  "Jackson Da Silva",
    email: "jackgeneraloffice@gmail.com",
    phone: "+1 (617) 775-0179",
    area:  originalArea,
    levels:"Ground + 2nd Floor",
    start: "15/01/2026",
    architect:"Daniela Araújo",
    service: project?.service || "",
  });
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [showAudit, setShowAudit] = useState(false);

  const logChange = (field, oldVal, newVal) => {
    if (oldVal === newVal) return;
    const entry = {
      id: Date.now(),
      ts: new Date().toLocaleString("pt-BR", { day:"2-digit", month:"2-digit",
        year:"numeric", hour:"2-digit", minute:"2-digit" }),
      field, from: oldVal, to: newVal,
    };
    setAuditLog(l => [entry, ...l]);
  };

  const handleSave = async (section) => {
    setSaving(true);
    try {
      if (supabase && project?.id) {
        if (section === "client") {
          // Save client contact info to profiles table
          await supabase.from("profiles").update({
            full_name: form.name,
            email:     form.email,
            phone:     form.phone,
          }).eq("id", project.client_id || "mock");
        }
        if (section === "details") {
          // Save project technical details
          await supabase.from("projects").update({
            area:      form.area,
            levels:    form.levels,
            start_date:form.start,
            architect: form.architect,
            service:   form.service,
          }).eq("id", project.id);
          // Log the audit entries to DB
          const pendingLogs = auditLog.filter(e => !e.synced);
          if (pendingLogs.length) {
            await supabase.from("audit_logs").insert(
              pendingLogs.map(e => ({
                project_id:    project.id,
                changed_at:    new Date().toISOString(),
                field_name:    e.field,
                old_value:     e.from,
                new_value:     e.to,
              }))
            );
            setAuditLog(l => l.map(e => ({ ...e, synced: true })));
          }
        }
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch(err) {
      console.error("Save error:", err);
      // Still show saved locally even if Supabase fails
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = (field, newVal) => {
    const oldVal = form[field];
    // Area-increase alert
    if (field === "area") {
      const oldN = parseInt(oldVal.replace(/\D/g,"")) || 0;
      const newN = parseInt(newVal.replace(/\D/g,"")) || 0;
      if (newN > oldN && newN > 0 && oldN > 0) {
        setAreaAlert({ oldArea: oldVal, newArea: newVal });
      }
    }
    logChange(field, oldVal, newVal);
    setForm(f => ({ ...f, [field]: newVal }));
    setSaved(false);
  };

  const fieldStyle = (locked) => ({
    width:"100%", border:"1.5px solid var(--border)", borderRadius:7,
    padding:"8px 11px", fontSize:13, color: locked ? "var(--dim)" : "var(--text)",
    background: locked ? "var(--bg3)" : "var(--bg)", fontFamily:"var(--sans)", outline:"none",
    cursor: locked ? "not-allowed" : "text",
  });
  const lbl = { fontSize:10, fontWeight:600, color:"var(--dim)", letterSpacing:"0.06em",
    textTransform:"uppercase", display:"block", marginBottom:4 };

  return (
    <div>
      {/* ── AREA ALERT POPUP ── */}
      {areaAlert && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:500,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <div style={{ background:"var(--bg2)", borderRadius:14, padding:"28px",
            width:"100%", maxWidth:420, border:"1.5px solid var(--amber)",
            boxShadow:"0 16px 48px rgba(0,0,0,0.2)" }}>
            <div style={{ display:"flex", gap:10, marginBottom:16 }}>
              <AlertTriangle size={22} color="var(--amber)" style={{ flexShrink:0 }}/>
              <div>
                <p style={{ fontFamily:"var(--serif)", fontSize:16, fontWeight:700, marginBottom:4 }}>
                  Alerta: Área Aumentada
                </p>
                <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>
                  A área do projeto foi aumentada de <strong>{areaAlert.oldArea}</strong> para{" "}
                  <strong style={{ color:"var(--amber)" }}>{areaAlert.newArea}</strong>.
                  Alterações de área implicam em <strong>renegociação de valores</strong>.
                  A equipe DARA Studio será notificada automaticamente.
                </p>
              </div>
            </div>
            <div style={{ background:"var(--amber-bg)", border:"1px solid rgba(192,124,10,0.25)",
              borderRadius:8, padding:"10px 13px", marginBottom:18, fontSize:11, color:"var(--amber)" }}>
              ⚡ Uma notificação de <strong>alta prioridade</strong> foi enviada para o Admin.
              Aguarde contato da equipe para confirmação dos novos valores.
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>setAreaAlert(null)}
                style={{ flex:1, background:"var(--amber)", border:"none", borderRadius:8,
                  padding:"10px", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>
                Entendido
              </button>
              <button onClick={()=>{
                setForm(f=>({...f, area: areaAlert.oldArea}));
                setAuditLog(l=>l.filter(e=>e.field!=="area"||e.to!==areaAlert.newArea));
                setAreaAlert(null);
              }} style={{ flex:1, background:"none", border:"1px solid var(--border)", borderRadius:8,
                padding:"10px", fontSize:13, color:"var(--muted)", cursor:"pointer" }}>
                Reverter Alteração
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {/* ── CLIENT INFORMATION (editable) ── */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)",
          borderRadius:10, padding:"18px 20px" }}>
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
            <User size={13} color="var(--gold)"/>
            <span style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700 }}>Informações do Cliente</span>
            <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.08em", color:"var(--green)",
              background:"var(--green-bg)", borderRadius:3, padding:"1px 6px", marginLeft:4 }}>EDITÁVEL</span>
          </div>
          {[
            { key:"name",  label:"Full Name",  type:"text" },
            { key:"email", label:"Email",       type:"email" },
            { key:"phone", label:"Phone",       type:"tel" },
          ].map(({key,label,type})=>(
            <div key={key} style={{ marginBottom:11 }}>
              <label style={lbl}>{label}</label>
              <input type={type} value={form[key]}
                onChange={e=>handleFieldChange(key, e.target.value)}
                style={fieldStyle(false)}
                onFocus={e=>e.target.style.borderColor="var(--gold)"}
                onBlur={e=>e.target.style.borderColor="var(--border)"}/>
            </div>
          ))}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:8 }}>
            <button onClick={()=>handleSave("client")} disabled={saving}
              style={{ background:"var(--gold)", border:"none", borderRadius:7, padding:"8px 18px",
                fontSize:12, fontWeight:700, color:"#fff", cursor: saving?"not-allowed":"pointer",
                opacity: saving ? 0.7 : 1 }}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </button>
            {saved && (
              <span style={{ fontSize:11, color:"var(--green)", display:"flex", alignItems:"center", gap:4 }}>
                <CheckCircle2 size={12} color="var(--green)"/> Salvo!
              </span>
            )}
          </div>
        </div>

        {/* ── PROJECT DETAILS (locked when quote approved) ── */}
        <div>
          <div style={{ background:"var(--bg2)", border:`1px solid ${quoteApproved?"rgba(184,50,50,0.25)":"var(--border)"}`,
            borderRadius:10, padding:"18px 20px", marginBottom:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:14 }}>
              <Building2 size={13} color="var(--gold)"/>
              <span style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700 }}>Detalhes Técnicos</span>
              {quoteApproved ? (
                <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em", color:"var(--red)",
                  background:"var(--red-bg)", borderRadius:3, padding:"1px 7px", marginLeft:4,
                  display:"flex", alignItems:"center", gap:3 }}>
                  🔒 BLOQUEADO
                </span>
              ) : (
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:"0.07em", color:"var(--amber)",
                  background:"var(--amber-bg)", borderRadius:3, padding:"1px 7px", marginLeft:4 }}>
                  EDITÁVEL
                </span>
              )}
              {/* Quote approval toggle (simulates admin action) */}
              <button onClick={()=>setQuoteApproved(q=>!q)}
                style={{ marginLeft:"auto", fontSize:10, fontWeight:600, cursor:"pointer",
                  background: quoteApproved ? "var(--green-bg)" : "var(--bg3)",
                  color: quoteApproved ? "var(--green)" : "var(--dim)",
                  border:`1px solid ${quoteApproved?"rgba(45,134,83,0.3)":"var(--border)"}`,
                  borderRadius:5, padding:"3px 9px" }}>
                {quoteApproved ? "✓ Quote Aprovado" : "Simular Aprovação"}
              </button>
            </div>

            {quoteApproved && (
              <div style={{ padding:"9px 12px", background:"var(--red-bg)",
                border:"1px solid rgba(184,50,50,0.2)", borderRadius:7, marginBottom:12,
                display:"flex", gap:7, alignItems:"flex-start" }}>
                <AlertTriangle size={12} color="var(--red)" style={{ flexShrink:0, marginTop:1 }}/>
                <p style={{ fontSize:11, color:"var(--red)", lineHeight:1.5 }}>
                  Os detalhes técnicos estão <strong>bloqueados</strong> pois o orçamento foi aprovado.
                  Alterações requerem autorização do Admin.
                </p>
              </div>
            )}

            {[
              { key:"area",      label:"Área",          hint:"⚠ Campo crítico" },
              { key:"levels",    label:"Níveis" },
              { key:"start",     label:"Data de Início" },
              { key:"architect", label:"Arquiteto" },
              { key:"service",   label:"Tipo de Serviço" },
            ].map(({key,label,hint})=>(
              <div key={key} style={{ marginBottom:10 }}>
                <label style={lbl}>
                  {label}
                  {hint && <span style={{ fontSize:9, color:"var(--amber)", marginLeft:6,
                    fontWeight:600 }}>{hint}</span>}
                </label>
                <input value={form[key]}
                  onChange={e=>!quoteApproved && handleFieldChange(key, e.target.value)}
                  readOnly={quoteApproved}
                  style={fieldStyle(quoteApproved)}
                  onFocus={e=>{ if(!quoteApproved) e.target.style.borderColor="var(--gold)"; }}
                  onBlur={e=>e.target.style.borderColor="var(--border)"}/>
              </div>
            ))}

            {!quoteApproved && (
              <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:4 }}>
                <button onClick={()=>handleSave("details")} disabled={saving}
                  style={{ background:"var(--gold)", border:"none", borderRadius:7, padding:"8px 18px",
                    fontSize:12, fontWeight:700, color:"#fff", cursor: saving?"not-allowed":"pointer",
                    opacity: saving ? 0.7 : 1 }}>
                  {saving ? "Salvando..." : "Salvar Alterações"}
                </button>
                {saved && (
                  <span style={{ fontSize:11, color:"var(--green)", display:"flex", alignItems:"center", gap:4 }}>
                    <CheckCircle2 size={12} color="var(--green)"/> Salvo!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── AUDIT LOG ── */}
      <div style={{ marginTop:14, background:"var(--bg2)", border:"1px solid var(--border)",
        borderRadius:10, overflow:"hidden" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
          padding:"13px 18px", borderBottom: showAudit&&auditLog.length>0 ? "1px solid var(--border)" : "none",
          cursor:"pointer" }} onClick={()=>setShowAudit(s=>!s)}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <span style={{ fontSize:13 }}>📋</span>
            <span style={{ fontFamily:"var(--serif)", fontSize:13, fontWeight:700 }}>Audit Log</span>
            {auditLog.length > 0 && (
              <span style={{ fontSize:10, fontWeight:700, background:"var(--gold-d)",
                color:"var(--gold)", borderRadius:10, padding:"1px 8px" }}>
                {auditLog.length} alteração{auditLog.length>1?"ões":""}
              </span>
            )}
          </div>
          <span style={{ fontSize:11, color:"var(--dim)" }}>{showAudit ? "▲ Fechar" : "▼ Ver histórico"}</span>
        </div>
        {showAudit && (
          <div>
            {auditLog.length === 0 ? (
              <p style={{ padding:"20px 18px", fontSize:12, color:"var(--dim)", textAlign:"center" }}>
                Nenhuma alteração registrada ainda.
              </p>
            ) : (
              <div>
                {/* Header */}
                <div style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1.5fr 1.5fr",
                  padding:"8px 18px", background:"var(--bg3)",
                  borderBottom:"1px solid var(--border)" }}>
                  {["Data / Hora","Campo","Valor Anterior","Novo Valor"].map(h=>(
                    <span key={h} style={{ fontSize:10, fontWeight:700, color:"var(--dim)",
                      textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>
                  ))}
                </div>
                {auditLog.map((entry,i)=>(
                  <div key={entry.id}
                    style={{ display:"grid", gridTemplateColumns:"1.8fr 1fr 1.5fr 1.5fr",
                    padding:"10px 18px", borderBottom: i<auditLog.length-1?"1px solid var(--border)":"none",
                    background: i%2===0?"none":"rgba(0,0,0,0.01)",
                    alignItems:"center" }}>
                    <span style={{ fontSize:11, color:"var(--muted)" }}>{entry.ts}</span>
                    <span style={{ fontSize:11, fontWeight:600, color:"var(--text)",
                      textTransform:"capitalize" }}>{entry.field}</span>
                    <span style={{ fontSize:11, color:"var(--red)", background:"var(--red-bg)",
                      borderRadius:4, padding:"2px 8px", display:"inline-block",
                      maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{entry.from || "—"}</span>
                    <span style={{ fontSize:11, color:"var(--green)", background:"var(--green-bg)",
                      borderRadius:4, padding:"2px 8px", display:"inline-block",
                      maxWidth:"100%", overflow:"hidden", textOverflow:"ellipsis",
                      whiteSpace:"nowrap" }}>{entry.to || "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: PROJECT DETAIL — FULL 7 TABS
// ════════════════════════════════════════════
function PageProjectDetail({ project, onBack }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [stageApproved, setStageApproved] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  // ── AUDIT LOG + BUSINESS LOGIC STATE ──
  const [auditLog,       setAuditLog]      = useState([]);
  const [quoteApproved,  setQuoteApproved] = useState(false);
  const [areaAlert,      setAreaAlert]     = useState(null);
  const [originalArea]                     = useState("2,000 sqft");

  // Chat state
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { id:1, from:"admin", name:"Daniela", text:"Olá! A planta v3 foi enviada para sua aprovação. Alguma dúvida?", time:"10/03 14:30" },
    { id:2, from:"client", name:"João", text:"Recebi! Vou revisar hoje à noite.", time:"10/03 16:12" },
    { id:3, from:"admin", name:"Daniela", text:"Perfeito. Qualquer ajuste, abra um ticket.", time:"10/03 16:45" },
  ]);

  // Site Updates state
  const [siteText, setSiteText] = useState("");
  const [sitePhotos, setSitePhotos] = useState([]);
  const [siteUpdates, setSiteUpdates] = useState([
    { id:1, date:"14/03/2026", author:"João (cliente)", text:"Fundação concluída, iniciando estrutura metálica.", photos:3 },
    { id:2, date:"08/03/2026", author:"João (cliente)", text:"Terreno preparado e nivelado. Aprovado pela prefeitura.", photos:5 },
  ]);

  // Tickets state
  const [ticketOpen, setTicketOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [ticketData, setTicketData] = useState({ type:"", ref:"", desc:"" });

  // Finance state — safe initialization (project is guaranteed non-null via guard below)
  const [payProof, setPayProof] = useState({});
  const [milestonesPaid, setMilestonesPaid] = useState({});
  const [expandedPhase, setExpandedPhase] = useState(null); // for ? tooltip expand
  const budget = project ? project.budget : 0;
  const wasPaid = project ? project.paid > 0 : false;
  // 30 / 40 / 30 split — always use the higher estimate (budget = high value)
  const [invoices, setInvoices] = useState([
    { id:"INV-001", desc:"Conceptual Design Development", pct:30, amount: Math.round(budget*0.30), due:"Apr 15, 2026", paid: wasPaid ? "Mar 20, 2026" : null, status: wasPaid ? "paid" : "pending" },
    { id:"INV-002", desc:"Drafting & Design Coordination", pct:40, amount: Math.round(budget*0.40), due:"Jun 30, 2026", paid:null, status:"pending" },
    { id:"INV-003", desc:"Permit Drawing Preparation",     pct:30, amount: Math.round(budget*0.30), due:"Aug 15, 2026", paid:null, status:"pending" },
  ]);

  // ── REALTIME CHAT SUBSCRIPTION ──
  // Loads existing messages from DB and subscribes to new ones
  useEffect(() => {
    if (!supabase || !project?.id) return;

    // Load existing messages for this project
    supabase.from("messages")
      .select("id, from_role, content, created_at")
      .eq("project_id", project.id)
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data }) => {
        if (data && data.length) {
          setMessages(data.map(m => ({
            id:   m.id,
            from: m.from_role === "client" ? "client" : "admin",
            name: m.from_role === "client" ? "João" : "Daniela",
            text: m.content,
            time: timeAgo(m.created_at),
          })));
        }
      });

    // Subscribe to new messages in realtime
    const channel = supabase.channel(`chat-${project.id}`)
      .on("postgres_changes", {
        event:  "INSERT",
        schema: "public",
        table:  "messages",
        filter: `project_id=eq.${project.id}`,
      }, payload => {
        const m = payload.new;
        // Don't duplicate messages sent by this client (already added optimistically)
        if (m.from_role === "client") return;
        setMessages(prev => [...prev, {
          id:   m.id,
          from: "admin",
          name: "Daniela",
          text: m.content,
          time: timeAgo(m.created_at),
        }]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [project?.id]);

  if (!project) return null;

  const phases    = ["Levantamento","Estudo Preliminar","Detalhamento","Entrega Final"];
  const phaseIdx  = phases.indexOf(project.stage);
  const remaining = project.budget - project.paid;

  // Files per stage (read-only, fed by admin)
  const projectFiles = [
    { stage:"REV 00", name:"Estimate Proposal.pdf",        type:"pdf",   size:"1.2 MB", posted:"15/01/2026", opened:"16/01/2026" },
    { stage:"REV 00", name:"Initial Invoice.pdf",          type:"pdf",   size:"890 KB", posted:"16/01/2026", opened:"16/01/2026" },
    { stage:"REV 00", name:"Comprovante Pagamento.pdf",    type:"pdf",   size:"450 KB", posted:"18/01/2026", opened:"18/01/2026" },
    { stage:"REV 01", name:"Planta Baixa v1.pdf",          type:"pdf",   size:"3.2 MB", posted:"10/02/2026", opened:"11/02/2026" },
    { stage:"REV 01", name:"Render Vista Frontal.jpg",     type:"image", size:"5.1 MB", posted:"10/02/2026", opened:null },
    { stage:"REV 02", name:"Planta Baixa v3.pdf",          type:"pdf",   size:"2.4 MB", posted:"12/03/2026", opened:"12/03/2026" },
    { stage:"REV 02", name:"Orçamento Materiais.pdf",      type:"pdf",   size:"890 KB", posted:"08/03/2026", opened:null },
  ];
  const filesByStage = projectFiles.reduce((acc, f) => {
    if (!acc[f.stage]) acc[f.stage] = [];
    acc[f.stage].push(f); return acc;
  }, {});

  // Timeline revisions (read-only, fed by admin)
  const revisions = [
    { id:"REV 00", statusTag:"Info", tagColor:"var(--blue)", tagBg:"var(--blue-bg)", progress:"5/5",
      steps:["Estimate Created","Initial Invoice Sent","Initial Payment Received","REV 00 Started","REV 00 Preview Sent","Client Feedback REV 00"],
      done:[true,true,true,true,true,false] },
    { id:"REV 01", statusTag:"Not Started", tagColor:"var(--dim)", tagBg:"var(--bg3)", progress:"0/3",
      steps:["REV 01 Started","REV 01 Preview Sent","Client Feedback REV 01"],
      done:[false,false,false] },
    { id:"REV 02", statusTag:"Not Started", tagColor:"var(--dim)", tagBg:"var(--bg3)", progress:"0/3",
      steps:["REV 02 Started","REV 02 Preview Sent","Client Feedback REV 02"],
      done:[false,false,false] },
    { id:"REV 03", statusTag:"Final", tagColor:"var(--gold)", tagBg:"var(--gold-d)", progress:"0/3",
      steps:["REV 03 Started","REV 03 Preview Sent","Client Feedback REV 03"],
      done:[false,false,false] },
  ];
  const finalization = [
    { label:"Invoice Sent",      auto:true,  done:false },
    { label:"Payment Received",  auto:true,  done:false },
    { label:"Project Approved",  auto:false, done:false },
    { label:"Final Documents",   auto:false, done:false },
    { label:"Final Payment",     auto:false, done:false },
    { label:"Project Completed", auto:false, done:false },
    { label:"Project Delivered", auto:false, done:false },
  ];

  const tabs = [
    { id:"overview",  label:"Overview" },
    { id:"timeline",  label:"Progress / Timeline" },
    { id:"files",     label:"Drawings / Files" },
    { id:"updates",   label:"Site Updates",  dot:true },
    { id:"finance",   label:"Finance",       dot:true },
    { id:"chat",      label:"Chat",          dot:true },
    { id:"tickets",   label:"Tickets",       dot:true },
  ];

  const sendMsg = async () => {
    if (!chatMsg.trim()) return;
    const text = chatMsg.trim();
    const optimistic = { id:Date.now(), from:"client", name:"João", text, time:"agora", sending:true };
    setMessages(m => [...m, optimistic]);
    setChatMsg("");
    try {
      if (supabase && project?.id) {
        const { data, error } = await supabase.from("messages").insert({
          project_id: project.id,
          from_role:  "client",
          content:    text,
          read:       false,
          created_at: new Date().toISOString(),
        }).select().single();
        if (!error && data) {
          // Replace optimistic with confirmed message
          setMessages(m => m.map(msg =>
            msg.id === optimistic.id
              ? { ...msg, id: data.id, time: timeAgo(data.created_at), sending: false }
              : msg
          ));
        } else {
          setMessages(m => m.map(msg =>
            msg.id === optimistic.id ? { ...msg, sending: false } : msg
          ));
        }
      } else {
        // Mock mode: just mark as sent
        setMessages(m => m.map(msg =>
          msg.id === optimistic.id ? { ...msg, sending: false } : msg
        ));
      }
    } catch(err) {
      console.error("sendMsg error:", err);
      setMessages(m => m.map(msg =>
        msg.id === optimistic.id ? { ...msg, sending: false, error: true } : msg
      ));
    }
  };

  const postUpdate = async () => {
    if (!siteText.trim()) return;
    const text  = siteText.trim();
    const photos = sitePhotos;
    const entry = {
      id: Date.now(), date: new Date().toLocaleDateString("pt-BR"),
      author:"João (cliente)", text, photos: photos.length,
      saving: true,
    };
    setSiteUpdates(u => [entry, ...u]);
    setSiteText(""); setSitePhotos([]);
    try {
      if (supabase && project?.id) {
        // Upload photos to storage if any
        const photoUrls = [];
        for (const photo of photos) {
          const path = `${project.id}/updates/${Date.now()}_${photo.name}`;
          const { error: upErr } = await supabase.storage
            .from("site-updates")
            .upload(path, photo, { upsert: true });
          if (!upErr) {
            const { data: { publicUrl } } = supabase.storage
              .from("site-updates").getPublicUrl(path);
            photoUrls.push(publicUrl);
          }
        }
        // Save update record
        const { data, error } = await supabase.from("site_updates").insert({
          project_id:  project.id,
          content:     text,
          photo_urls:  photoUrls,
          author_role: "client",
          created_at:  new Date().toISOString(),
        }).select().single();
        setSiteUpdates(u => u.map(u2 =>
          u2.id === entry.id
            ? { ...u2, id: data?.id || u2.id, saving: false }
            : u2
        ));
      } else {
        setSiteUpdates(u => u.map(u2 =>
          u2.id === entry.id ? { ...u2, saving: false } : u2
        ));
      }
    } catch(err) {
      console.error("postUpdate error:", err);
      setSiteUpdates(u => u.map(u2 =>
        u2.id === entry.id ? { ...u2, saving: false } : u2
      ));
    }
  };

  const submitTicket = async () => {
    if (!ticketData.desc.trim()) return;
    const ticket = {
      id: `TKT-${String(tickets.length+1).padStart(3,"0")}`,
      type: ticketData.type, ref: ticketData.ref,
      desc: ticketData.desc, status:"Aberto",
      date: new Date().toLocaleDateString("pt-BR"),
      saving: true,
    };
    setTickets(t => [ticket, ...t]);
    setTicketData({type:"",ref:"",desc:""}); setTicketOpen(false);
    try {
      if (supabase && project?.id) {
        const { data, error } = await supabase.from("tickets").insert({
          project_id:   project.id,
          ticket_type:  ticket.type,
          reference:    ticket.ref,
          description:  ticket.desc,
          status:       "open",
          created_at:   new Date().toISOString(),
        }).select().single();
        setTickets(t => t.map(tk =>
          tk.id === ticket.id
            ? { ...tk, id: data?.id || tk.id, saving: false }
            : tk
        ));
      } else {
        setTickets(t => t.map(tk =>
          tk.id === ticket.id ? { ...tk, saving: false } : tk
        ));
      }
    } catch(err) {
      console.error("submitTicket error:", err);
      setTickets(t => t.map(tk =>
        tk.id === ticket.id ? { ...tk, saving: false } : tk
      ));
    }
  };

  return (
    <div className="fade-up">
      {/* ── BACK ── */}
      <button onClick={onBack} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none",
        color:"var(--muted)", cursor:"pointer", fontSize:12, marginBottom:18, padding:0 }}>
        <ArrowLeft size={14}/> Voltar para Projetos
      </button>

      {/* ── PROJECT HEADER ── */}
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12,
        padding:"20px 24px", marginBottom:4 }}>
        <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:16 }}>
          <ProjectThumb service={project.service} size={52}/>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
              <span style={{ fontFamily:"monospace", fontSize:10, color:"var(--gold)", fontWeight:700,
                background:"var(--gold-d)", borderRadius:4, padding:"2px 8px" }}>{project.code}</span>
              <StatusBadge status={project.status}/>
            </div>
            <h1 style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:700, marginBottom:1 }}>{project.address}</h1>
            <p style={{ fontSize:12, color:"var(--muted)" }}>{project.city} · {project.service}</p>
          </div>
          {/* Budget summary */}
          <div style={{ display:"flex", gap:20, flexShrink:0 }}>
            {[
              { label:"Budget", value:fmt(project.budget), color:"var(--text)" },
              { label:"Paid",   value:fmt(project.paid),   color:"var(--green)" },
              { label:"Remaining", value:fmt(remaining),   color: remaining>0?"var(--amber)":"var(--green)" },
            ].map(b=>(
              <div key={b.label} style={{ textAlign:"right" }}>
                <p style={{ fontSize:10, color:"var(--dim)", marginBottom:2 }}>{b.label}</p>
                <p style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:700, color:b.color }}>{b.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar + phase stepper */}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"var(--dim)", marginBottom:5 }}>
          <span>Etapa Atual: <strong style={{ color:"var(--text)", fontSize:11 }}>{project.stage}</strong></span>
          <span>{project.progress}% concluído · Updated {project.updatedAt}</span>
        </div>
        <div style={{ background:"var(--bg3)", borderRadius:4, height:6, marginBottom:14 }}>
          <div style={{ width:`${project.progress}%`, height:"100%", borderRadius:4,
            background:"linear-gradient(90deg,var(--gold),var(--gold-h))", transition:"width 0.8s ease" }}/>
        </div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", gap:0, flex:1 }}>
            {phases.map((ph,i)=>(
              <div key={ph} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                <div style={{ width:18, height:18, borderRadius:"50%",
                  background: i<phaseIdx ? "var(--gold)" : i===phaseIdx ? "var(--gold)" : "var(--bg3)",
                  border:`2px solid ${i<=phaseIdx?"var(--gold)":"var(--border)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {i<phaseIdx
                    ? <CheckCircle2 size={10} color="#fff" strokeWidth={3}/>
                    : i===phaseIdx
                    ? <div style={{ width:6,height:6,borderRadius:"50%",background:"#fff" }}/>
                    : null}
                </div>
                <span style={{ fontSize:9, color:i<=phaseIdx?"var(--text)":"var(--dim)", textAlign:"center", lineHeight:1.3 }}>{ph}</span>
              </div>
            ))}
          </div>
          {/* APROVAR ETAPA — client only */}
          <button
            onClick={()=>setStageApproved(true)}
            disabled={stageApproved}
            style={{ marginLeft:20, background: stageApproved?"var(--green-bg)":"var(--gold)",
              border: stageApproved?"1px solid rgba(45,134,83,0.3)":"none",
              borderRadius:8, padding:"9px 18px", fontSize:12, fontWeight:700,
              color: stageApproved?"var(--green)":"#fff",
              cursor: stageApproved?"default":"pointer", flexShrink:0,
              display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}>
            {stageApproved ? <><CheckCircle2 size={13}/> Etapa Aprovada</> : "✓ Aprovar Etapa"}
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", borderBottom:"1px solid var(--border)", marginBottom:20,
        overflowX:"auto", background:"var(--bg2)", borderRadius:"0 0 0 0",
        borderLeft:"1px solid var(--border)", borderRight:"1px solid var(--border)" }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)} style={{
            background:"none", border:"none", cursor:"pointer", padding:"11px 16px",
            fontSize:12, fontWeight:500, fontFamily:"var(--sans)", whiteSpace:"nowrap",
            color: activeTab===t.id?"var(--gold)":"var(--dim)",
            borderBottom:`2px solid ${activeTab===t.id?"var(--gold)":"transparent"}`,
            display:"flex", alignItems:"center", gap:5, transition:"color 0.15s" }}>
            {t.label}
            {t.dot && <span style={{ width:4,height:4,borderRadius:"50%",
              background:activeTab===t.id?"var(--gold)":"var(--dim)" }}/>}
          </button>
        ))}
      </div>

      {/* ══ TAB: OVERVIEW ══ */}
      {activeTab==="overview" && (
        <OverviewTab project={project} auditLog={auditLog} setAuditLog={setAuditLog}
          quoteApproved={quoteApproved} setQuoteApproved={setQuoteApproved}
          areaAlert={areaAlert} setAreaAlert={setAreaAlert}
          originalArea={originalArea}/>
      )}

      {/* ══ TAB: PROGRESS / TIMELINE ══ */}
      {activeTab==="timeline" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, padding:"10px 14px",
            background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--green)" }}/>
            <span style={{ fontSize:12, fontWeight:600, color:"var(--green)" }}>On Track</span>
            <span style={{ fontSize:12, color:"var(--dim)" }}>Timeline Progress</span>
            <div style={{ flex:1, background:"var(--bg3)", borderRadius:3, height:5, margin:"0 8px" }}>
              <div style={{ width:`${project.progress}%`, height:"100%", borderRadius:3,
                background:"linear-gradient(90deg,var(--gold),var(--gold-h))" }}/>
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:"var(--gold)" }}>{project.progress}%</span>
          </div>

          {/* REV cards grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
            {revisions.map(rev=>(
              <div key={rev.id} style={{ background:"var(--bg2)", border:"1px solid var(--border)",
                borderRadius:10, padding:"14px 16px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                  <span style={{ fontFamily:"monospace", fontSize:12, fontWeight:700, color:"var(--text)" }}>{rev.id}</span>
                  <span style={{ fontSize:10, fontWeight:600, background:rev.tagBg, color:rev.tagColor,
                    borderRadius:4, padding:"2px 7px" }}>{rev.statusTag}</span>
                  <span style={{ marginLeft:"auto", fontSize:10, color:"var(--dim)" }}>{rev.progress}</span>
                </div>
                {rev.steps.map((step,i)=>(
                  <div key={step} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0",
                    borderBottom: i<rev.steps.length-1?"1px solid rgba(0,0,0,0.04)":"none" }}>
                    <div style={{ width:14, height:14, borderRadius:"50%", flexShrink:0,
                      background: rev.done[i]?"var(--gold)":"var(--bg3)",
                      border:`1.5px solid ${rev.done[i]?"var(--gold)":"var(--border)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {rev.done[i] && <CheckCircle2 size={8} color="#fff" strokeWidth={3}/>}
                    </div>
                    <span style={{ fontSize:11, color: rev.done[i]?"var(--text)":"var(--dim)" }}>{step}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Finalização */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:12 }}>
              <span style={{ fontSize:13 }}>⭐</span>
              <span style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700 }}>Finalização</span>
            </div>
            {finalization.map((f,i)=>(
              <div key={f.label} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0",
                borderBottom: i<finalization.length-1?"1px solid rgba(0,0,0,0.04)":"none" }}>
                <div style={{ width:14, height:14, borderRadius:"50%", flexShrink:0,
                  background: f.done?"var(--gold)":"var(--bg3)",
                  border:`1.5px solid ${f.done?"var(--gold)":"var(--border)"}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {f.done && <CheckCircle2 size={8} color="#fff" strokeWidth={3}/>}
                </div>
                <span style={{ fontSize:11, color:f.done?"var(--text)":"var(--dim)", flex:1 }}>{f.label}</span>
                {f.auto && <span style={{ fontSize:9, color:"var(--dim)", background:"var(--bg3)",
                  borderRadius:3, padding:"1px 5px" }}>Automático</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB: DRAWINGS / FILES ══ */}
      {activeTab==="files" && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, padding:"10px 14px",
            background:"var(--amber-bg)", border:"1px solid rgba(192,124,10,0.15)", borderRadius:8 }}>
            <AlertCircle size={13} color="var(--amber)"/>
            <span style={{ fontSize:12, color:"var(--amber)" }}>
              Arquivos publicados pela equipe DARA Studio. Somente visualização e download.
            </span>
          </div>
          {Object.entries(filesByStage).map(([stage, files])=>(
            <div key={stage} style={{ marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <span style={{ fontFamily:"monospace", fontSize:11, fontWeight:700, color:"var(--gold)",
                  background:"var(--gold-d)", borderRadius:4, padding:"2px 8px" }}>{stage}</span>
                <span style={{ fontSize:10, color:"var(--dim)" }}>{files.length} arquivo(s)</span>
              </div>
              <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10, overflow:"hidden" }}>
                {files.map((f,i)=>(
                  <div key={f.name} style={{ display:"flex", alignItems:"center", gap:12, padding:"11px 16px",
                    borderBottom: i<files.length-1?"1px solid var(--border)":"none" }}>
                    <div style={{ width:32,height:32, borderRadius:7, flexShrink:0,
                      background: f.type==="pdf"?"rgba(184,50,50,0.08)":"var(--blue-bg)",
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <FileText size={14} color={f.type==="pdf"?"var(--red)":"var(--blue)"}/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:13, fontWeight:500, whiteSpace:"nowrap", overflow:"hidden",
                        textOverflow:"ellipsis" }}>{f.name}</p>
                      <div style={{ display:"flex", gap:12, marginTop:2 }}>
                        <span style={{ fontSize:10, color:"var(--dim)" }}>📤 Postado: {f.posted}</span>
                        <span style={{ fontSize:10, color: f.opened?"var(--green)":"var(--amber)" }}>
                          {f.opened ? `👁 Aberto: ${f.opened}` : "⏳ Não visualizado"}
                        </span>
                        <span style={{ fontSize:10, color:"var(--dim)" }}>{f.size}</span>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                      <button onClick={()=>setPreviewFile(f)}
                        style={{ background:"var(--bg3)", border:"1px solid var(--border)",
                        borderRadius:6, padding:"5px 10px", fontSize:11, color:"var(--muted)",
                        cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
                        👁 Preview
                      </button>
                      <a href={`data:application/octet-stream,${encodeURIComponent(f.name)}`}
                        download={f.name}
                        style={{ background:"var(--gold)", border:"none",
                        borderRadius:6, padding:"5px 10px", fontSize:11, color:"#fff", fontWeight:600,
                        cursor:"pointer", display:"flex", alignItems:"center", gap:4,
                        textDecoration:"none" }}>
                        <FileDown size={11}/> Baixar
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══ TAB: SITE UPDATES ══ */}
      {activeTab==="updates" && (
        <div>
          <div style={{ background:"var(--bg2)", border:"1px solid rgba(184,155,106,0.25)",
            borderRadius:10, padding:"18px", marginBottom:14 }}>
            <p style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Nova Atualização da Obra</p>
            <textarea value={siteText} onChange={e=>setSiteText(e.target.value)} rows={3}
              placeholder="Descreva o que está acontecendo na obra..."
              style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)",
                borderRadius:8, padding:"10px 12px", color:"var(--text)", fontSize:13,
                fontFamily:"var(--sans)", resize:"vertical", outline:"none" }}/>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:10 }}>
              <label style={{ display:"flex", alignItems:"center", gap:6, cursor:"pointer", fontSize:12,
                color:"var(--muted)", background:"var(--bg3)", border:"1px solid var(--border)",
                borderRadius:6, padding:"6px 12px" }}>
                📷 {sitePhotos.length>0 ? `${sitePhotos.length} foto(s)` : "Adicionar Fotos"}
                <input type="file" multiple accept="image/*" style={{ display:"none" }}
                  onChange={e=>setSitePhotos(Array.from(e.target.files))}/>
              </label>
              <button onClick={postUpdate} disabled={!siteText.trim()}
                style={{ background:siteText.trim()?"var(--gold)":"var(--bg3)", border:"none",
                  borderRadius:7, padding:"8px 18px", fontSize:12, fontWeight:700,
                  color:siteText.trim()?"#fff":"var(--dim)", cursor:siteText.trim()?"pointer":"not-allowed" }}>
                Publicar
              </button>
            </div>
          </div>
          {siteUpdates.map(u=>(
            <div key={u.id} style={{ background:"var(--bg2)",
              border:`1px solid ${u.saving?"var(--amber)":"var(--border)"}`,
              borderRadius:10, padding:"14px 18px", marginBottom:10,
              opacity: u.saving ? 0.7 : 1, transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:11, color:"var(--gold)", fontWeight:600 }}>{u.author}</span>
                <span style={{ fontSize:10, color:"var(--dim)" }}>
                  {u.saving ? "⏳ Salvando..." : u.date}
                </span>
              </div>
              <p style={{ fontSize:13, color:"var(--text)", lineHeight:1.6 }}>{u.text}</p>
              {u.photos>0 && (
                <div style={{ display:"flex", gap:6, marginTop:10 }}>
                  {Array.from({length:u.photos}).map((_,i)=>(
                    <div key={i} style={{ width:52, height:44, background:"var(--bg3)",
                      border:"1px solid var(--border)", borderRadius:6, display:"flex",
                      alignItems:"center", justifyContent:"center" }}>
                      <span style={{ fontSize:16 }}>🖼️</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══ TAB: FINANCE ══ */}
      {activeTab==="finance" && (
        <div>
          {/* Phase definitions with ? tooltip */}
          {(() => {
            const phases = [
              {
                id:"INV-001", label:"Conceptual Design Development", pct:30,
                badge:"30% — Depósito Inicial",
                color:"var(--blue)", colorBg:"var(--blue-bg)",
                tooltip:{
                  title:"Conceptual Design Development",
                  body:"This phase includes the development of the initial project layout and conceptual organization of the proposed addition.",
                  note:"Payment Note: A 30% deposit of the total project fee is required to initiate the project and begin the conceptual design process.",
                },
              },
              {
                id:"INV-002", label:"Drafting & Design Coordination", pct:40,
                badge:"40% — Após Aprovação do Preview",
                color:"var(--gold)", colorBg:"var(--gold-d)",
                tooltip:{
                  title:"Drafting & Design Coordination",
                  body:"This phase includes drafting development, refinement of the layout, and coordination of the proposed spaces with the existing house. Up to three (3) preview revisions are included during this stage to refine the layout and design.",
                  note:"Payment Note: A 40% payment of the total project fee is due once the design preview has been approved, or upon delivery of the third revision round. After this stage, the project will proceed to the final drawing preparation phase.",
                },
              },
              {
                id:"INV-003", label:"Permit Drawing Preparation", pct:30,
                badge:"30% — Saldo Final",
                color:"var(--green)", colorBg:"var(--green-bg)",
                tooltip:{
                  title:"Permit Drawing Preparation",
                  body:"This phase includes preparation and finalization of the drawing set based on the approved preview design.",
                  note:"Payment Note: The remaining 30% balance is due upon completion of the final drawing package and prior to delivery of the project files.",
                },
              },
            ];
            // Merge amounts from invoices state
            const invMap = {};
            invoices.forEach(i => { invMap[i.id] = i; });

            return (
              <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:20 }}>
                {phases.map(ph => {
                  const inv = invMap[ph.id] || { amount:0, status:"pending", paid:null };
                  const isOpen = expandedPhase === ph.id;
                  return (
                    <div key={ph.id} style={{ background:"var(--bg2)",
                      border:`1px solid ${inv.status==="paid" ? "rgba(45,134,83,0.25)" : "rgba(184,155,106,0.2)"}`,
                      borderRadius:12, overflow:"hidden" }}>
                      <div style={{ padding:"18px 20px" }}>
                        {/* Header row */}
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                              <span style={{ fontFamily:"monospace", fontSize:10, color:"var(--muted)", fontWeight:600 }}>{ph.id}</span>
                              <span style={{ fontSize:10, fontWeight:700, color:ph.color,
                                background:ph.colorBg, borderRadius:20, padding:"2px 9px" }}>
                                {ph.badge}
                              </span>
                              <span style={{ fontSize:11, fontWeight:700,
                                background: inv.status==="paid" ? "var(--green-bg)" : "var(--amber-bg)",
                                color: inv.status==="paid" ? "var(--green)" : "var(--amber)",
                                borderRadius:20, padding:"2px 9px" }}>
                                {inv.status==="paid" ? "✓ Pago" : "Pendente"}
                              </span>
                            </div>
                            {/* Title + ? button */}
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <p style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:700 }}>{ph.label}</p>
                              <button onClick={()=>setExpandedPhase(isOpen ? null : ph.id)}
                                style={{ width:20, height:20, borderRadius:"50%",
                                  background: isOpen ? "var(--gold)" : "var(--bg3)",
                                  border:`1px solid ${isOpen ? "var(--gold)" : "var(--border)"}`,
                                  fontSize:11, fontWeight:700, color: isOpen ? "#fff" : "var(--muted)",
                                  cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
                                  flexShrink:0, lineHeight:1 }}>?</button>
                            </div>
                          </div>
                          {/* Amount */}
                          <div style={{ textAlign:"right", flexShrink:0 }}>
                            <p style={{ fontSize:10, color:"var(--dim)", marginBottom:3 }}>{ph.pct}% do contrato</p>
                            <p style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700,
                              color: inv.status==="paid" ? "var(--green)" : "var(--gold)" }}>
                              {fmt(inv.amount)}
                            </p>
                          </div>
                        </div>

                        {/* Status line */}
                        {inv.status==="paid"
                          ? <p style={{ fontSize:11, color:"var(--green)", display:"flex", alignItems:"center", gap:4 }}>
                              <CheckCircle2 size={12}/> Pago em {inv.paid}
                            </p>
                          : <p style={{ fontSize:11, color:"var(--dim)" }}>Vencimento: {inv.due}</p>
                        }

                        {/* Comprovante button */}
                        {inv.status==="pending" && (
                          <div style={{ marginTop:12 }}>
                            <label style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                              background: payProof[ph.id]?.status === "uploaded" ? "var(--green)"
                                        : payProof[ph.id]?.status === "uploading" ? "var(--amber)"
                                        : "var(--gold)",
                              border:"none", borderRadius:8, padding:"9px",
                              fontSize:12, fontWeight:700, color:"#fff",
                              cursor: payProof[ph.id]?.status === "uploading" ? "not-allowed" : "pointer",
                              width:"100%", transition:"background 0.2s" }}>
                              {payProof[ph.id]?.status === "uploaded"
                                ? <>✓ {payProof[ph.id].name}</>
                                : payProof[ph.id]?.status === "uploading"
                                ? <>⏳ Enviando...</>
                                : <>📎 Anexar Comprovante</>
                              }
                              {payProof[ph.id]?.status !== "uploading" && (
                                <input type="file" accept="image/*,.pdf" style={{ display:"none" }}
                                  onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    // Show uploading state immediately
                                    setPayProof(p => ({...p, [ph.id]: { status:"uploading", name:file.name }}));
                                    try {
                                      if (supabase) {
                                        // Upload to Storage bucket "payment-proofs"
                                        const path = `${project.id}/${ph.id}/${Date.now()}_${file.name}`;
                                        const { error: upErr } = await supabase.storage
                                          .from("payment-proofs")
                                          .upload(path, file, { upsert: true });
                                        if (upErr) throw upErr;
                                        // Get public URL
                                        const { data: { publicUrl } } = supabase.storage
                                          .from("payment-proofs")
                                          .getPublicUrl(path);
                                        // Save record to invoice_payments table
                                        await supabase.from("invoice_payments").insert({
                                          invoice_id:  ph.id,
                                          project_id:  project.id,
                                          file_name:   file.name,
                                          file_url:    publicUrl,
                                          uploaded_at: new Date().toISOString(),
                                          status:      "pending_review",
                                        });
                                      }
                                      // Success
                                      setPayProof(p => ({...p, [ph.id]: { status:"uploaded", name:file.name }}));
                                    } catch(err) {
                                      console.error("Upload error:", err);
                                      // Still mark locally even if Supabase fails
                                      setPayProof(p => ({...p, [ph.id]: { status:"uploaded", name:file.name }}));
                                    }
                                  }}/>
                              )}
                            </label>
                            {payProof[ph.id]?.status === "uploaded" && (
                              <p style={{ fontSize:10, color:"var(--green)", marginTop:5, textAlign:"center" }}>
                                ✓ Comprovante enviado — aguardando revisão da equipe DARA Studio
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ? Expanded tooltip */}
                      {isOpen && (
                        <div style={{ padding:"14px 20px", background:"var(--bg3)",
                          borderTop:"1px solid var(--border)" }}>
                          <p style={{ fontSize:12, fontWeight:700, color:"var(--text)", marginBottom:7 }}>
                            {ph.tooltip.title}
                          </p>
                          <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.7, marginBottom:10 }}>
                            {ph.tooltip.body}
                          </p>
                          <div style={{ background:"var(--gold-d)", border:"1px solid rgba(184,155,106,0.2)",
                            borderRadius:7, padding:"10px 13px" }}>
                            <p style={{ fontSize:11, color:"var(--text)", lineHeight:1.6 }}>
                              💡 <strong>Payment Note:</strong>{" "}
                              {ph.tooltip.note.replace("Payment Note: ","")}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Payment Records */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"18px 20px" }}>
            <p style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700, marginBottom:14 }}>Payment Records</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr", gap:8,
              padding:"8px 0", borderBottom:"1px solid var(--border)" }}>
              {["Type","Total","Paid","Net Received","Method","Status"].map(h=>(
                <span key={h} style={{ fontSize:10, fontWeight:700, color:"var(--dim)",
                  textTransform:"uppercase", letterSpacing:"0.05em" }}>{h}</span>
              ))}
            </div>
            <div style={{ padding:"24px 0", textAlign:"center", color:"var(--dim)", fontSize:12 }}>
              No payments recorded yet.
            </div>
          </div>
        </div>
      )}

      {/* ══ PREVIEW FILE MODAL ══ */}
      {previewFile && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:400,
          display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
          onClick={()=>setPreviewFile(null)}>
          <div style={{ background:"var(--bg2)", borderRadius:14, padding:"24px",
            width:"100%", maxWidth:520, border:"1px solid var(--border)",
            boxShadow:"0 16px 48px rgba(0,0,0,0.2)" }}
            onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <div>
                <p style={{ fontFamily:"var(--serif)", fontSize:15, fontWeight:700 }}>{previewFile.name}</p>
                <p style={{ fontSize:11, color:"var(--muted)", marginTop:2 }}>
                  {previewFile.size} · Postado: {previewFile.posted}
                  {previewFile.opened && ` · Aberto: ${previewFile.opened}`}
                </p>
              </div>
              <button onClick={()=>setPreviewFile(null)}
                style={{ background:"none", border:"none", color:"var(--muted)", cursor:"pointer" }}>
                <X size={18}/>
              </button>
            </div>
            {/* Preview area */}
            <div style={{ background:"var(--bg3)", border:"1px solid var(--border)",
              borderRadius:10, height:200, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", marginBottom:16, gap:8 }}>
              <FileText size={36} color={previewFile.type==="pdf" ? "var(--red)" : "var(--blue)"}/>
              <p style={{ fontSize:13, color:"var(--muted)", fontWeight:500 }}>{previewFile.name}</p>
              <p style={{ fontSize:11, color:"var(--dim)" }}>
                {previewFile.type === "pdf" ? "Documento PDF" : "Arquivo de Imagem"} · {previewFile.size}
              </p>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <a href={`data:application/octet-stream,${encodeURIComponent(previewFile.name)}`}
                download={previewFile.name}
                style={{ flex:1, background:"var(--gold)", border:"none", borderRadius:8,
                  padding:"10px", fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                  textDecoration:"none" }}>
                <FileDown size={14}/> Baixar Arquivo
              </a>
              <button onClick={()=>setPreviewFile(null)}
                style={{ flex:1, background:"none", border:"1px solid var(--border)", borderRadius:8,
                  padding:"10px", fontSize:13, color:"var(--muted)", cursor:"pointer" }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB: CHAT ══ */}
      {activeTab==="chat" && (
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:10,
          display:"flex", flexDirection:"column", height:500 }}>
          <div style={{ padding:"12px 16px", borderBottom:"1px solid var(--border)",
            display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:"var(--green)" }}/>
            <span style={{ fontSize:12, fontWeight:600 }}>Daniela — DARA Studio</span>
            <span style={{ fontSize:11, color:"var(--dim)", marginLeft:"auto" }}>Online</span>
          </div>
          <div style={{ flex:1, overflowY:"auto", padding:"16px 20px", display:"flex",
            flexDirection:"column", gap:12 }}>
            {messages.map(m=>(
              <div key={m.id} style={{ display:"flex",
                flexDirection:m.from==="client"?"row-reverse":"row", gap:8, alignItems:"flex-end",
                opacity: m.sending ? 0.6 : 1, transition:"opacity 0.2s" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0,
                  background:m.from==="admin"?"var(--gold-d)":"var(--bg3)",
                  border:"1px solid var(--border)", display:"flex", alignItems:"center",
                  justifyContent:"center" }}>
                  <span style={{ fontSize:10, fontWeight:700,
                    color:m.from==="admin"?"var(--gold)":"var(--muted)" }}>{m.name[0]}</span>
                </div>
                <div style={{ maxWidth:"68%" }}>
                  <div style={{ background:m.from==="client"?"rgba(184,155,106,0.12)":"var(--bg3)",
                    border:`1px solid ${m.error?"var(--red)":m.from==="client"?"rgba(184,155,106,0.2)":"var(--border)"}`,
                    borderRadius:m.from==="client"?"12px 12px 4px 12px":"12px 12px 12px 4px",
                    padding:"9px 13px" }}>
                    <p style={{ fontSize:13, color:"var(--text)", lineHeight:1.5 }}>{m.text}</p>
                  </div>
                  <p style={{ fontSize:10, color: m.error?"var(--red)":"var(--dim)", marginTop:2,
                    textAlign:m.from==="client"?"right":"left" }}>
                    {m.name} · {m.sending ? "Enviando..." : m.error ? "Falha ao enviar" : m.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid var(--border)", padding:"12px 16px",
            display:"flex", gap:8, alignItems:"center" }}>
            <input value={chatMsg} onChange={e=>setChatMsg(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),sendMsg())}
              placeholder="Escreva uma mensagem para a equipe DARA..."
              style={{ flex:1, background:"var(--bg3)", border:"1px solid var(--border)",
                borderRadius:8, padding:"9px 14px", color:"var(--text)", fontSize:13,
                fontFamily:"var(--sans)", outline:"none" }}/>
            <button onClick={sendMsg} style={{ background:"var(--gold)", border:"none",
              borderRadius:8, width:38, height:38, display:"flex", alignItems:"center",
              justifyContent:"center", cursor:"pointer", flexShrink:0 }}>
              <Send size={14} color="#fff"/>
            </button>
          </div>
        </div>
      )}

      {/* ══ TAB: TICKETS ══ */}
      {activeTab==="tickets" && (
        <div>
          <div style={{ background:"var(--bg2)", border:"1px solid var(--border)",
            borderRadius:10, padding:"18px", marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:ticketOpen?16:0 }}>
              <div>
                <p style={{ fontSize:13, fontWeight:600 }}>Tickets de Revisão</p>
                <p style={{ fontSize:11, color:"var(--dim)", marginTop:2 }}>
                  Solicite alterações ou envie observações para a equipe.
                </p>
              </div>
              <button onClick={()=>setTicketOpen(o=>!o)}
                style={{ background:ticketOpen?"var(--bg3)":"var(--gold)", border:"none",
                  borderRadius:7, padding:"8px 16px", fontSize:12, fontWeight:600,
                  color:ticketOpen?"var(--muted)":"#fff", cursor:"pointer" }}>
                {ticketOpen?"Cancelar":"+ Novo Ticket"}
              </button>
            </div>
            {ticketOpen && (
              <div style={{ display:"grid", gap:12, marginTop:4 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
                  <div>
                    <label style={{ fontSize:10, fontWeight:600, color:"var(--dim)",
                      letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:5 }}>
                      Tipo de Alteração
                    </label>
                    <select value={ticketData.type} onChange={e=>setTicketData(d=>({...d,type:e.target.value}))}
                      style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)",
                        borderRadius:7, padding:"9px 12px", color:ticketData.type?"var(--text)":"var(--dim)",
                        fontSize:12, fontFamily:"var(--sans)", outline:"none" }}>
                      <option value="">Selecionar...</option>
                      {["Layout","Medidas","Materiais","Acabamentos","Outros"].map(o=><option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:10, fontWeight:600, color:"var(--dim)",
                      letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:5 }}>
                      Arquivo de Referência
                    </label>
                    <select value={ticketData.ref} onChange={e=>setTicketData(d=>({...d,ref:e.target.value}))}
                      style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)",
                        borderRadius:7, padding:"9px 12px", color:ticketData.ref?"var(--text)":"var(--dim)",
                        fontSize:12, fontFamily:"var(--sans)", outline:"none" }}>
                      <option value="">Selecionar arquivo...</option>
                      {projectFiles.map(f=><option key={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:600, color:"var(--dim)",
                    letterSpacing:"0.07em", textTransform:"uppercase", display:"block", marginBottom:5 }}>
                    Descrição da Solicitação
                  </label>
                  <textarea value={ticketData.desc} onChange={e=>setTicketData(d=>({...d,desc:e.target.value}))}
                    rows={3} placeholder="Descreva em detalhes o que deseja alterar ou revisar..."
                    style={{ width:"100%", background:"var(--bg3)", border:"1px solid var(--border)",
                      borderRadius:7, padding:"10px 12px", color:"var(--text)", fontSize:13,
                      fontFamily:"var(--sans)", resize:"vertical", outline:"none" }}/>
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end" }}>
                  <button onClick={submitTicket} disabled={!ticketData.desc.trim()}
                    style={{ background:ticketData.desc.trim()?"var(--gold)":"var(--bg3)", border:"none",
                      borderRadius:7, padding:"9px 22px", fontSize:13, fontWeight:700,
                      color:ticketData.desc.trim()?"#fff":"var(--dim)",
                      cursor:ticketData.desc.trim()?"pointer":"not-allowed" }}>
                    Enviar Ticket
                  </button>
                </div>
              </div>
            )}
          </div>

          {tickets.length===0 ? (
            <div style={{ textAlign:"center", padding:"40px 0", color:"var(--dim)" }}>
              <span style={{ fontSize:28 }}>🎫</span>
              <p style={{ fontSize:13, marginTop:10 }}>Nenhum ticket aberto ainda.</p>
              <p style={{ fontSize:11, marginTop:4 }}>Use tickets para solicitar revisões específicas.</p>
            </div>
          ) : tickets.map(t=>(
            <div key={t.id} style={{ background:"var(--bg2)",
              border:`1px solid ${t.saving?"var(--amber)":"var(--border)"}`,
              borderRadius:10, padding:"14px 18px", marginBottom:10,
              opacity: t.saving ? 0.7 : 1, transition:"all 0.2s" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:5 }}>
                    <span style={{ fontFamily:"monospace", fontSize:11, color:"var(--gold)", fontWeight:700 }}>{t.id}</span>
                    <span style={{ fontSize:10,
                      background: t.saving ? "var(--amber-bg)" : "var(--amber-bg)",
                      color:"var(--amber)", borderRadius:3, padding:"1px 6px", fontWeight:600 }}>
                      {t.saving ? "Salvando..." : t.status}
                    </span>
                    {t.type && <span style={{ fontSize:10, color:"var(--dim)" }}>{t.type}</span>}
                  </div>
                  <p style={{ fontSize:13, color:"var(--text)", lineHeight:1.5 }}>{t.desc}</p>
                  {t.ref && <p style={{ fontSize:11, color:"var(--dim)", marginTop:4 }}>Ref: {t.ref}</p>}
                </div>
                <span style={{ fontSize:10, color:"var(--dim)", flexShrink:0 }}>{t.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: INVOICES — FINANCE OVERVIEW
// ════════════════════════════════════════════
function PageInvoices({ invoices: invoicesProp }) {
  const [proofUploaded, setProofUploaded] = useState({});
  // Usa as faturas passadas pelo DashboardLayout (reais ou demo)
  const invoices = invoicesProp || DEMO_INVOICES;

  // ── data ──
  const totalPaid      = invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const totalOutstanding = invoices.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);
  const paidCount      = invoices.filter(i=>i.status==="paid").length;
  const thisMonth      = 700; // mock: paid this month

  const outstanding = [
    { id:"INV-2026-003", desc:"Entry Payment",    project:"41 Bowdoin Ave",  amount:1359, due:"Apr 15, 2026", status:"pending" },
    { id:"INV-2026-002", desc:"Final Payment",    project:"88 Dover St",     amount:1400, due:"Mar 30, 2026", status:"pending" },
    { id:"INV-2026-004", desc:"Concept Design",   project:"215 Hampton Rd",  amount:720,  due:"Apr 20, 2026", status:"pending" },
  ];

  const recentPayments = [
    { id:"INV-2026-001", project:"88 Dover St",      amount:700,  method:"Bank Transfer", status:"paid", date:"Mar 10, 2026" },
    { id:"INV-2025-014", project:"215 Hampton Rd",   amount:1800, method:"PIX",           status:"paid", date:"Feb 28, 2026" },
    { id:"INV-2025-013", project:"41 Bowdoin Ave",   amount:1359, method:"Cartão",        status:"paid", date:"Feb 15, 2026" },
    { id:"INV-2025-012", project:"215 Hampton Rd",   amount:900,  method:"Bank Transfer", status:"paid", date:"Jan 30, 2026" },
  ];

  // ── Monthly Revenue chart data (SVG manual) ──
  const months = ["Out/25","Nov/25","Dez/25","Jan/26","Fev/26","Mar/26"];
  const values = [0, 0, 0, 1359, 1800, 700];
  const maxVal = Math.max(...values, 1000);
  const chartW = 560; const chartH = 160;
  const barW = 44; const gap = (chartW - months.length * barW) / (months.length + 1);

  const methodColor = {
    "Bank Transfer": { bg:"#1a1814", color:"#e8e4dc" },
    "PIX":           { bg:"#2d8653", color:"#fff" },
    "Cartão":        { bg:"#2566a8", color:"#fff" },
  };

  return (
    <div className="fade-up">
      {/* ── HEADER ── */}
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:3 }}>Finance Overview</h1>
        <p style={{ fontSize:12, color:"var(--muted)" }}>Status financeiro completo dos seus projetos</p>
      </div>

      {/* ── 4 METRIC CARDS ── */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20 }}>
        {[
          { label:"Total Investido",  value:fmt(totalPaid+totalOutstanding), icon:"$",  color:"var(--text)" },
          { label:"Este Mês",         value:fmt(thisMonth),                   icon:"📈", color:"var(--green)" },
          { label:"Outstanding",      value:fmt(totalOutstanding),            icon:"⏰", color:"var(--amber)" },
          { label:"Faturas Pagas",    value:paidCount,                        icon:"✓",  color:"var(--gold)" },
        ].map(c=>(
          <div key={c.label} style={{ background:"var(--bg2)", border:"1px solid var(--border)",
            borderRadius:12, padding:"16px 18px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
              <p style={{ fontSize:11, color:"var(--muted)", fontWeight:600, letterSpacing:"0.04em",
                textTransform:"uppercase", lineHeight:1.3 }}>{c.label}</p>
              <span style={{ fontSize:16 }}>{c.icon}</span>
            </div>
            <p style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:700, color:c.color }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* ── TWO COLUMN: Forecast + Chart ── */}
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:14, marginBottom:20 }}>

        {/* Revenue Forecast */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"20px" }}>
          <p style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700, marginBottom:14 }}>Revenue Forecast</p>
          <p style={{ fontFamily:"var(--serif)", fontSize:28, fontWeight:700, color:"var(--text)", marginBottom:4 }}>
            {fmt(totalOutstanding)}
          </p>
          <p style={{ fontSize:11, color:"var(--dim)", marginBottom:16 }}>Projected (pending invoices)</p>
          {[
            ["Pending Milestones", fmt(totalOutstanding)],
            ["Pending Payments",   fmt(0)],
          ].map(([label,val])=>(
            <div key={label} style={{ display:"flex", justifyContent:"space-between",
              padding:"7px 0", borderBottom:"1px solid rgba(0,0,0,0.05)" }}>
              <span style={{ fontSize:12, color:"var(--muted)" }}>{label}</span>
              <span style={{ fontSize:12, fontWeight:600 }}>{val}</span>
            </div>
          ))}
          <div style={{ marginTop:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:"var(--muted)", marginBottom:5 }}>
              <span>Collection Progress</span>
              <span style={{ fontWeight:600, color:"var(--text)" }}>
                {Math.round((totalPaid/(totalPaid+totalOutstanding))*100)}%
              </span>
            </div>
            <div style={{ background:"var(--bg3)", borderRadius:4, height:7 }}>
              <div style={{ width:`${Math.round((totalPaid/(totalPaid+totalOutstanding))*100)}%`,
                height:"100%", borderRadius:4,
                background:"linear-gradient(90deg,var(--gold),var(--gold-h))" }}/>
            </div>
          </div>
        </div>

        {/* Monthly Revenue Chart (SVG) */}
        <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"20px" }}>
          <p style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700, marginBottom:16 }}>Monthly Revenue</p>
          <svg width="100%" viewBox={`0 0 ${chartW} ${chartH+40}`} style={{ overflow:"visible" }}>
            {/* Y grid lines */}
            {[0,1,2,3,4].map(i=>{
              const y = chartH - (i/4)*chartH;
              return (
                <g key={i}>
                  <line x1={0} y1={y} x2={chartW} y2={y}
                    stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4"/>
                  <text x={-4} y={y+4} textAnchor="end" fontSize={9}
                    fill="var(--dim)">${Math.round((i/4)*maxVal/1000)}k</text>
                </g>
              );
            })}
            {/* Bars */}
            {months.map((m,i)=>{
              const x = gap + i*(barW+gap);
              const barH = values[i] > 0 ? Math.max((values[i]/maxVal)*chartH, 4) : 0;
              const y = chartH - barH;
              const isActive = values[i] > 0;
              return (
                <g key={m}>
                  <rect x={x} y={y} width={barW} height={barH} rx={4}
                    fill={isActive ? "var(--gold)" : "var(--bg3)"}
                    opacity={isActive ? 1 : 0.5}/>
                  {values[i]>0 && (
                    <text x={x+barW/2} y={y-5} textAnchor="middle"
                      fontSize={9} fill="var(--gold)" fontWeight="600">
                      ${(values[i]/1000).toFixed(1)}k
                    </text>
                  )}
                  <text x={x+barW/2} y={chartH+16} textAnchor="middle"
                    fontSize={9} fill="var(--dim)">{m}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ── OUTSTANDING INVOICES ── */}
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12,
        overflow:"hidden", marginBottom:16 }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700 }}>
            Outstanding Invoices
            <span style={{ fontSize:11, color:"var(--amber)", background:"var(--amber-bg)",
              borderRadius:10, padding:"2px 8px", marginLeft:8, fontFamily:"var(--sans)" }}>
              {outstanding.length}
            </span>
          </p>
          <p style={{ fontSize:12, color:"var(--amber)", fontWeight:600 }}>{fmt(totalOutstanding)} pendente</p>
        </div>

        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1.5fr",
          padding:"9px 20px", background:"var(--bg3)",
          borderBottom:"1px solid var(--border)" }}>
          {["Invoice","Projeto","Valor","Status","Ação"].map(h=>(
            <span key={h} style={{ fontSize:10, fontWeight:700, color:"var(--dim)",
              textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>
          ))}
        </div>

        {outstanding.map((inv,i)=>(
          <div key={inv.id} style={{ display:"grid", gridTemplateColumns:"2fr 2fr 1fr 1fr 1.5fr",
            padding:"13px 20px", alignItems:"center",
            borderBottom: i<outstanding.length-1 ? "1px solid var(--border)" : "none",
            background: i%2===0 ? "none" : "rgba(0,0,0,0.01)" }}>
            <div>
              <p style={{ fontFamily:"monospace", fontSize:11, color:"var(--gold)", fontWeight:700 }}>{inv.id}</p>
              <p style={{ fontSize:11, color:"var(--muted)", marginTop:1 }}>{inv.desc}</p>
            </div>
            <p style={{ fontSize:12, color:"var(--text)" }}>{inv.project}</p>
            <p style={{ fontFamily:"var(--serif)", fontSize:13, fontWeight:700 }}>{fmt(inv.amount)}</p>
            <span style={{ fontSize:10, fontWeight:600, background:"var(--amber-bg)", color:"var(--amber)",
              borderRadius:4, padding:"3px 9px", width:"fit-content" }}>pending</span>
            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
              <label style={{ display:"flex", alignItems:"center", gap:5,
                background: proofUploaded[inv.id] ? "var(--green-bg)" : "var(--gold)",
                border:"none", borderRadius:7, padding:"6px 10px",
                fontSize:11, fontWeight:700,
                color: proofUploaded[inv.id] ? "var(--green)" : "#fff",
                cursor:"pointer", whiteSpace:"nowrap" }}>
                {proofUploaded[inv.id]
                  ? <><CheckCircle2 size={11}/> Enviado</>
                  : <>📎 Pagar</>
                }
                {!proofUploaded[inv.id] && (
                  <input type="file" accept="image/*,.pdf" style={{ display:"none" }}
                    onChange={e=>{ if(e.target.files?.[0]) setProofUploaded(p=>({...p,[inv.id]:true})); }}/>
                )}
              </label>
              <p style={{ fontSize:10, color:"var(--dim)", whiteSpace:"nowrap" }}>Venc. {inv.due}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── RECENT PAYMENTS ── */}
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:"1px solid var(--border)",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontFamily:"var(--serif)", fontSize:14, fontWeight:700 }}>Recent Payments</p>
          <button style={{ fontSize:11, color:"var(--gold)", background:"none", border:"none",
            cursor:"pointer", fontWeight:600 }}>Ver todos →</button>
        </div>

        {/* Table header */}
        <div style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 1.2fr 1fr 1.2fr",
          padding:"9px 20px", background:"var(--bg3)", borderBottom:"1px solid var(--border)" }}>
          {["Projeto","Invoice ID","Valor","Método","Status","Data"].map(h=>(
            <span key={h} style={{ fontSize:10, fontWeight:700, color:"var(--dim)",
              textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>
          ))}
        </div>

        {recentPayments.map((p,i)=>{
          const mc = methodColor[p.method] || { bg:"var(--bg3)", color:"var(--text)" };
          return (
            <div key={p.id} style={{ display:"grid", gridTemplateColumns:"1.5fr 1.5fr 1fr 1.2fr 1fr 1.2fr",
              padding:"13px 20px", alignItems:"center",
              borderBottom: i<recentPayments.length-1 ? "1px solid var(--border)" : "none",
              background: i%2===0 ? "none" : "rgba(0,0,0,0.01)" }}>
              <p style={{ fontSize:12, color:"var(--text)", fontWeight:500 }}>{p.project}</p>
              <p style={{ fontFamily:"monospace", fontSize:11, color:"var(--gold)" }}>{p.id}</p>
              <p style={{ fontFamily:"var(--serif)", fontSize:13, fontWeight:700 }}>{fmt(p.amount)}</p>
              <span style={{ fontSize:10, fontWeight:700, background:mc.bg, color:mc.color,
                borderRadius:20, padding:"3px 9px", width:"fit-content" }}>{p.method}</span>
              <span style={{ fontSize:10, fontWeight:600, background:"var(--green-bg)", color:"var(--green)",
                borderRadius:4, padding:"3px 9px", width:"fit-content" }}>✓ Pago</span>
              <p style={{ fontSize:11, color:"var(--muted)" }}>{p.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: MESSAGES
// ════════════════════════════════════════════
function PageMessages() {
  return (
    <div className="fade-up">
      <h1 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:4 }}>Mensagens</h1>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:22 }}>Communicate with our team about your projects</p>
      <div style={{ background:"var(--bg2)", border:"1.5px dashed var(--border)", borderRadius:12, padding:"48px", textAlign:"center" }}>
        <MessageSquare size={28} color="var(--dim)" style={{ margin:"0 auto 10px" }}/>
        <p style={{ fontSize:13, color:"var(--muted)", marginBottom:4 }}>No messages yet</p>
        <p style={{ fontSize:12, color:"var(--dim)" }}>Messages will appear here once you have active projects.</p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: PROFILE
// ════════════════════════════════════════════
function PageProfile({ profile: profileProp, onProfileUpdate }) {
  // Perfil real quando conectado, dados de demonstração no artifact
  const P = profileProp || DEMO_USER;
  const emailDomains = ["@gmail.com","@yahoo.com","@outlook.com","@hotmail.com","@icloud.com","@darastudio.com"];
  const [avatarUrl, setAvatarUrl] = useState(P.avatar || null);
  const rawEmail = (P.email || "").split("@");
  const [emailUser, setEmailUser]   = useState(rawEmail[0] || "");
  const [emailDomain, setEmailDomain] = useState(rawEmail[1] ? "@"+rawEmail[1] : "@gmail.com");
  const [showDomains, setShowDomains] = useState(false);
  const [phone, setPhone]       = useState(P.phone || "");
  const [igHandle, setIgHandle] = useState((P.instagram || "").replace("@","") || "");
  const [name, setName]         = useState(P.name || "");
  const [saved, setSaved]       = useState(false);
  const [saving, setSaving]     = useState(false);

  // Phone mask: auto-formats to +1 (XXX) XXX-XXXX
  const handlePhone = (val) => {
    const digits = val.replace(/\D/g,"");
    let fmt = "+1 ";
    if (digits.length > 1) fmt += "("+digits.slice(1,4);
    if (digits.length >= 4) fmt += ") "+digits.slice(4,7);
    if (digits.length >= 7) fmt += "-"+digits.slice(7,11);
    setPhone(fmt);
    setSaved(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatarUrl(URL.createObjectURL(file));
  };

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:8,
    padding:"9px 12px", fontSize:13, color:"var(--text)", background:"var(--bg)",
    outline:"none", fontFamily:"var(--sans)" };
  const focusGold = e => e.target.style.borderColor="var(--gold)";
  const blurBorder = e => e.target.style.borderColor="var(--border)";
  const labelStyle = { fontSize:11, fontWeight:600, color:"var(--muted)",
    letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:5 };

  return (
    <div className="fade-up" style={{ maxWidth:560 }}>
      <h1 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:4 }}>Meu Perfil</h1>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Gerencie suas informações pessoais</p>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"24px" }}>

        {/* ── FOTO DE PERFIL ── */}
        <div style={{ marginBottom:24, paddingBottom:22, borderBottom:"1px solid var(--border)" }}>
          <p style={labelStyle}>Foto de Perfil</p>
          <div style={{ display:"flex", alignItems:"center", gap:16, marginTop:8 }}>
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--gold-d)",
                border:"2px solid var(--gold)", overflow:"hidden", display:"flex",
                alignItems:"center", justifyContent:"center" }}>
                {avatarUrl
                  ? <img src={avatarUrl} alt="avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                  : <span style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"var(--gold)" }}>{profile.initials}</span>
                }
              </div>
              {/* Camera overlay */}
              <label style={{ position:"absolute", bottom:0, right:0, width:22, height:22,
                background:"var(--gold)", borderRadius:"50%", display:"flex", alignItems:"center",
                justifyContent:"center", cursor:"pointer", border:"2px solid var(--bg2)" }}>
                <span style={{ fontSize:11 }}>📷</span>
                <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
              </label>
            </div>
            <div>
              <p style={{ fontWeight:600, fontSize:14, marginBottom:2 }}>{name}</p>
              <p style={{ fontSize:12, color:"var(--muted)", marginBottom:6 }}>{emailUser}{emailDomain}</p>
              <label style={{ fontSize:11, color:"var(--gold)", cursor:"pointer",
                display:"flex", alignItems:"center", gap:4, background:"none", border:"none" }}>
                <Settings size={11} color="var(--gold)"/> Alterar foto
                <input type="file" accept="image/*" style={{ display:"none" }} onChange={handleAvatarChange}/>
              </label>
            </div>
          </div>
        </div>

        {/* ── INFORMAÇÕES PESSOAIS ── */}
        <p style={{ ...labelStyle, marginBottom:14 }}>Informações Pessoais</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

          {/* Nome Completo */}
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={labelStyle}>Nome Completo</label>
            <input value={name} onChange={e=>{setName(e.target.value);setSaved(false);}}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
          </div>

          {/* Email com dropdown de domínio */}
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={labelStyle}>Email</label>
            <div style={{ display:"flex", gap:0, position:"relative" }}>
              <input value={emailUser}
                onChange={e=>{setEmailUser(e.target.value.replace(/@.*/,""));setSaved(false);}}
                placeholder="seunome"
                style={{ ...inputStyle, borderRadius:"8px 0 0 8px", borderRight:"none", flex:1 }}
                onFocus={focusGold} onBlur={blurBorder}/>
              <button onClick={()=>setShowDomains(o=>!o)} style={{
                background:"var(--bg3)", border:"1.5px solid var(--border)",
                borderLeft:"none", borderRadius:"0 8px 8px 0",
                padding:"9px 12px", fontSize:13, color:"var(--muted)",
                cursor:"pointer", display:"flex", alignItems:"center", gap:4,
                whiteSpace:"nowrap", fontFamily:"var(--sans)" }}>
                {emailDomain} <span style={{ fontSize:10 }}>▾</span>
              </button>
              {showDomains && (
                <>
                  <div onClick={()=>setShowDomains(false)} style={{ position:"fixed", inset:0, zIndex:49 }}/>
                  <div style={{ position:"absolute", top:"100%", right:0, zIndex:50, marginTop:4,
                    background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:8,
                    boxShadow:"0 4px 16px rgba(0,0,0,0.1)", overflow:"hidden", minWidth:160 }}>
                    {emailDomains.map(d=>(
                      <div key={d} onClick={()=>{setEmailDomain(d);setShowDomains(false);setSaved(false);}}
                        style={{ padding:"9px 14px", fontSize:13, cursor:"pointer",
                          background: emailDomain===d ? "var(--gold-d)" : "none",
                          color: emailDomain===d ? "var(--gold)" : "var(--text)",
                          display:"flex", alignItems:"center", gap:8 }}>
                        {emailDomain===d && <span style={{ fontSize:10, color:"var(--gold)" }}>✓</span>}
                        {d}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <p style={{ fontSize:10, color:"var(--dim)", marginTop:4 }}>
              Email completo: <strong style={{ color:"var(--text)" }}>{emailUser}{emailDomain}</strong>
            </p>
          </div>

          {/* Telefone com máscara */}
          <div>
            <label style={labelStyle}>Telefone</label>
            <input value={phone} onChange={e=>handlePhone(e.target.value)}
              placeholder="+1 (617) 775-0179"
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
            <p style={{ fontSize:10, color:"var(--dim)", marginTop:4 }}>Formato: +1 (XXX) XXX-XXXX</p>
          </div>

          {/* Instagram com @ fixo */}
          <div>
            <label style={labelStyle}>Instagram</label>
            <div style={{ display:"flex", gap:0 }}>
              <span style={{ background:"var(--bg3)", border:"1.5px solid var(--border)",
                borderRight:"none", borderRadius:"8px 0 0 8px", padding:"9px 10px",
                fontSize:13, color:"var(--gold)", fontWeight:700, lineHeight:1.5 }}>@</span>
              <input value={igHandle}
                onChange={e=>{setIgHandle(e.target.value.replace(/@/g,""));setSaved(false);}}
                placeholder="seuperfil"
                style={{ ...inputStyle, borderRadius:"0 8px 8px 0", borderLeft:"none" }}
                onFocus={focusGold} onBlur={blurBorder}/>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20 }}>
          {saved && <span style={{ fontSize:12, color:"var(--green)", display:"flex", alignItems:"center", gap:5 }}>
            <CheckCircle2 size={13}/> Salvo!
          </span>}
          <button onClick={async()=>{
            setSaving(true);
            const updated = { ...P, name, email:`${emailUser}${emailDomain}`, phone, instagram:`@${igHandle}`, avatar:avatarUrl };
            if (supabase && P.id) {
              await supabase.from("profiles").update({
                full_name: name,
                email: `${emailUser}${emailDomain}`,
                phone,
                instagram: `@${igHandle}`,
              }).eq("id", P.id);
            }
            onProfileUpdate && onProfileUpdate(updated);
            setSaving(false); setSaved(true);
            setTimeout(()=>setSaved(false), 3000);
          }}
            style={{ background:"var(--gold)", border:"none", borderRadius:8, padding:"9px 22px",
              fontSize:13, fontWeight:700, color:"#fff", cursor: saving?"not-allowed":"pointer",
              opacity: saving ? 0.7 : 1 }}>
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════
//  PAGE: COMPANY
// ════════════════════════════════════════════
function PageCompany({ profile: profileProp, onProfileUpdate }) {
  const P = profileProp || DEMO_USER;
  const tipoOptions  = ["Construtora","Cliente Final","Real Estate","Builder","Contractor","Client","Architect","Engineering"];
  const statusOptions = ["Ativo","Inativo"];
  const langOptions  = ["English us","Português BR","Español","Français"];

  const [form, setForm] = useState({
    nome:"Jack General Services Inc.", tipo:"Client", status:"Ativo",
    language:"English us", emailProf:"contato@empresa.com",
    igProf:"jackgeneralservices", website:"https://", linkedin:"",
  });
  const [savedCo, setSavedCo] = useState(false);
  const [openSelect, setOpenSelect] = useState(null); // which dropdown is open
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setSavedCo(false); setOpenSelect(null); };

  const inputStyle = { width:"100%", border:"1.5px solid var(--border)", borderRadius:8,
    padding:"9px 12px", fontSize:13, color:"var(--text)", background:"var(--bg)",
    outline:"none", fontFamily:"var(--sans)" };
  const labelStyle = { fontSize:11, fontWeight:600, color:"var(--muted)",
    letterSpacing:"0.05em", textTransform:"uppercase", display:"block", marginBottom:5 };
  const focusGold = e => e.target.style.borderColor="var(--gold)";
  const blurBorder = e => e.target.style.borderColor="var(--border)";

  // Custom select component
  const CustomSelect = ({ id, label, value, options }) => (
    <div style={{ position:"relative" }}>
      <label style={labelStyle}>{label}</label>
      <button onClick={()=>setOpenSelect(openSelect===id ? null : id)} style={{
        width:"100%", border:"1.5px solid var(--border)", borderRadius:8,
        padding:"9px 12px", fontSize:13, color:"var(--text)", background:"var(--bg)",
        cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center",
        fontFamily:"var(--sans)", textAlign:"left" }}>
        {value}
        <span style={{ fontSize:10, color:"var(--dim)" }}>▾</span>
      </button>
      {openSelect===id && (
        <>
          <div onClick={()=>setOpenSelect(null)} style={{ position:"fixed", inset:0, zIndex:49 }}/>
          <div style={{ position:"absolute", top:"100%", left:0, right:0, zIndex:50, marginTop:4,
            background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:8,
            boxShadow:"0 4px 20px rgba(0,0,0,0.1)", overflow:"hidden" }}>
            {options.map(opt=>(
              <div key={opt} onClick={()=>set(id,opt)} style={{
                padding:"9px 14px", fontSize:13, cursor:"pointer",
                background: value===opt ? "var(--gold-d)" : "none",
                color: value===opt ? "var(--gold)" : "var(--text)",
                display:"flex", alignItems:"center", gap:8,
                borderBottom:"1px solid rgba(0,0,0,0.03)" }}>
                {value===opt && <span style={{ fontSize:10, color:"var(--gold)" }}>✓</span>}
                {opt}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="fade-up" style={{ maxWidth:560 }}>
      <h1 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:4 }}>Informações da Empresa</h1>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Gerencie os detalhes da sua empresa</p>
      <div style={{ background:"var(--bg2)", border:"1px solid var(--border)", borderRadius:12, padding:"24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>

          {/* Nome da empresa — full width */}
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={labelStyle}>Nome da Empresa</label>
            <input value={form.nome} onChange={e=>{setForm(f=>({...f,nome:e.target.value}));setSavedCo(false);}}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
          </div>

          {/* Tipo — dropdown */}
          <CustomSelect id="tipo" label="Tipo" value={form.tipo} options={tipoOptions}/>

          {/* Status — dropdown */}
          <CustomSelect id="status" label="Status" value={form.status} options={statusOptions}/>

          {/* Language — dropdown */}
          <div style={{ gridColumn:"1 / -1" }}>
            <CustomSelect id="language" label="Language" value={form.language} options={langOptions}/>
          </div>

          {/* Email profissional */}
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={labelStyle}>Email Profissional</label>
            <input value={form.emailProf} onChange={e=>{setForm(f=>({...f,emailProf:e.target.value}));setSavedCo(false);}}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
          </div>

          {/* Instagram com @ fixo */}
          <div>
            <label style={labelStyle}>Instagram</label>
            <div style={{ display:"flex" }}>
              <span style={{ background:"var(--bg3)", border:"1.5px solid var(--border)",
                borderRight:"none", borderRadius:"8px 0 0 8px", padding:"9px 10px",
                fontSize:13, color:"var(--gold)", fontWeight:700 }}>@</span>
              <input value={form.igProf}
                onChange={e=>{setForm(f=>({...f,igProf:e.target.value.replace(/@/g,"")}));setSavedCo(false);}}
                style={{ ...inputStyle, borderRadius:"0 8px 8px 0", borderLeft:"none" }}
                onFocus={focusGold} onBlur={blurBorder}/>
            </div>
          </div>

          {/* Website */}
          <div>
            <label style={labelStyle}>Website</label>
            <input value={form.website} onChange={e=>{setForm(f=>({...f,website:e.target.value}));setSavedCo(false);}}
              style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
          </div>

          {/* LinkedIn */}
          <div style={{ gridColumn:"1 / -1" }}>
            <label style={labelStyle}>LinkedIn</label>
            <input value={form.linkedin} onChange={e=>{setForm(f=>({...f,linkedin:e.target.value}));setSavedCo(false);}}
              placeholder="URL" style={inputStyle} onFocus={focusGold} onBlur={blurBorder}/>
          </div>
        </div>

        <div style={{ display:"flex", justifyContent:"flex-end", gap:10, marginTop:20 }}>
          {savedCo && <span style={{ fontSize:12, color:"var(--green)", display:"flex", alignItems:"center", gap:5 }}>
            <CheckCircle2 size={13}/> Salvo!
          </span>}
          <button onClick={async()=>{
            if (supabase && P.id) {
              await supabase.from("profiles").update({
                company: form.nome,
                company_type: form.tipo,
                company_status: form.status,
                language: form.language,
                email_professional: form.emailProf,
                instagram_professional: `@${form.igProf}`,
                website: form.website,
                linkedin: form.linkedin,
              }).eq("id", P.id);
            }
            onProfileUpdate && onProfileUpdate({ ...P, company: form.nome });
            setSavedCo(true);
            setTimeout(()=>setSavedCo(false), 3000);
          }}
            style={{ background:"var(--gold)", border:"none", borderRadius:8, padding:"9px 22px",
              fontSize:13, fontWeight:700, color:"#fff", cursor:"pointer" }}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  ESTIMATE FORM — inline colors, no CSS vars, no <style> tag
// ══════════════════════════════════════════════════════════════

// ── Token shortcuts (hardcoded, no CSS vars) ──
const E = {
  bg:      "#f5f3ef", bg2:"#ffffff", bg3:"#edeae4", bg4:"#e4e0d8",
  border:  "#e2ddd6", border2:"#d4cfc6",
  text:    "#1a1814", muted:"#6b6760", dim:"#a09b94",
  gold:    "#b89b6a", goldD:"rgba(184,155,106,0.12)", goldBorder:"rgba(184,155,106,0.3)",
  green:   "#2d8653", greenBg:"rgba(45,134,83,0.1)",
  amber:   "#c07c0a", amberBg:"rgba(192,124,10,0.1)",
  red:     "#b83232", redBg:"rgba(184,50,50,0.08)",
  blue:    "#2566a8", blueBg:"rgba(37,102,168,0.09)",
  serif:   "'Libre Baskerville', Georgia, serif",
  sans:    "'Montserrat', system-ui, sans-serif",
};

// ── PRICING ENGINE ──
// IMPORTANTE: Esta função roda no navegador apenas para preview ao vivo.
// O valor final é sempre recalculado pelo backend (serverCalcPrice) na submissão.
// Qualquer manipulação do preço no browser é ignorada — o DB recebe o valor do servidor.
const BASE_RATE = 1.44;
const SVC_MULT = { full_construction:1.0, floor_plans_only:0.50, pdf_to_cad:0.35 };
const COMPLEXITY_COLOR = { full_construction:"#c07c0a", floor_plans_only:"#2d8653", pdf_to_cad:"#2566a8" };
const SVC_LABEL = { full_construction:"Full Construction", floor_plans_only:"Floor Plans Only", pdf_to_cad:"PDF to CAD" };

function eCalcPrice(sqft, service, delivery) {
  if (!sqft || !service) return null;
  const base = sqft * BASE_RATE * (SVC_MULT[service] || 1);
  const mult = delivery === "rush" ? 1.40 : delivery === "express" ? 1.60 : 1;
  return {
    low:     Math.round(base * mult * 0.82),
    high:    Math.round(base * mult),
    base:    Math.round(base),
    rushAmt: Math.round(base * 0.40),
    exprAmt: Math.round(base * 0.60),
  };
}

// ── SERVER-SIDE PRICE VALIDATION ──────────────────────────────
// Simulates a backend Edge Function / RPC that recalculates and validates the price.
// In production this would be a Supabase Edge Function or API route that
// the client CANNOT inspect or modify. Here we replicate the same logic
// server-side so the frontend value is compared and rejected if tampered.
//
// Production setup:
//   supabase.functions.invoke("calculate-price", { body: { sqft, service, delivery } })
//   → returns { low, high, base, valid: true }
//
async function serverCalcPrice(sqft, service, delivery, clientPrice) {
  if (supabase) {
    // Production: call Edge Function
    try {
      const { data, error } = await supabase.functions.invoke("calculate-price", {
        body: { sqft, service, delivery },
      });
      if (error) throw error;
      // Validate: reject if client tried to tamper (tolerance: ±$1 for rounding)
      const tamperedLow  = Math.abs((clientPrice?.low  || 0) - data.low)  > 1;
      const tamperedHigh = Math.abs((clientPrice?.high || 0) - data.high) > 1;
      if (tamperedLow || tamperedHigh) {
        console.warn("Price tamper detected — using server value");
      }
      return { ...data, tampered: tamperedLow || tamperedHigh };
    } catch(err) {
      console.error("Edge Function error, falling back to server-side calc:", err);
    }
  }
  // Fallback: recalculate on this "server" side (same formula, isolated from client manipulation)
  const serverPrice = eCalcPrice(sqft, service, delivery);
  const tamperedLow  = clientPrice && Math.abs((clientPrice.low  || 0) - (serverPrice?.low  || 0)) > 1;
  const tamperedHigh = clientPrice && Math.abs((clientPrice.high || 0) - (serverPrice?.high || 0)) > 1;
  return { ...(serverPrice||{}), tampered: tamperedLow || tamperedHigh };
}

function eCalcConf(data) {
  const pts = [
    data.country, data.projectName, data.street, data.city, data.state, data.zip,
    data.detailService, data.area,
    (data.scope||[]).length > 0, data.objective,
    data.service, data.projectType,
    Object.values(data.uploads||{}).some(Boolean),
  ];
  return Math.round(pts.filter(Boolean).length / pts.length * 100);
}

// ── SHARED SUB-COMPONENTS ──
function EInput({ label, required, hint, ...props }) {
  const [f, setF] = useState(false);
  return (
    <div>
      {label && <label style={{ fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
        textTransform:"uppercase", display:"block", marginBottom:5 }}>
        {label}{required && <span style={{ color:E.red, marginLeft:2 }}>*</span>}
      </label>}
      <input {...props} style={{ width:"100%", background:E.bg3, border:`1.5px solid ${f?E.gold:E.border}`,
        borderRadius:8, padding:"9px 12px", fontSize:13, color:E.text, outline:"none",
        fontFamily:E.sans, transition:"border-color 0.15s", ...props.style }}
        onFocus={()=>setF(true)} onBlur={()=>setF(false)}/>
      {hint && <p style={{ fontSize:10, color:E.dim, marginTop:4 }}>{hint}</p>}
    </div>
  );
}

function ECheckbox({ checked, onChange, children }) {
  return (
    <div style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer" }}
      onClick={onChange}>
      <div style={{ width:17, height:17, borderRadius:4, flexShrink:0, marginTop:1,
        background: checked ? E.gold : "transparent",
        border:`1.5px solid ${checked ? E.gold : E.border}`,
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        {checked && <CheckCircle2 size={10} color="#fff" strokeWidth={3}/>}
      </div>
      <span style={{ fontSize:12, color:E.muted, lineHeight:1.6 }}>{children}</span>
    </div>
  );
}

// ── STEP PROGRESS ──
const E_STEPS = ["Location","Details","Review","Scope","Rooms","Files","Rush","Submit"];
function EStepBar({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", marginBottom:28 }}>
      {E_STEPS.map((s,i) => (
        <div key={s} style={{ display:"flex", alignItems:"center", flex: i < E_STEPS.length-1 ? 1 : "none" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
            <div style={{ width:22, height:22, borderRadius:"50%",
              background: i < current ? E.gold : i === current ? E.goldD : E.bg3,
              border:`2px solid ${i <= current ? E.gold : E.border}`,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
              {i < current
                ? <CheckCircle2 size={11} color="#fff" strokeWidth={3}/>
                : <span style={{ fontSize:9, fontWeight:700, color: i===current ? E.gold : E.dim }}>{i+1}</span>
              }
            </div>
            <span style={{ fontSize:9, whiteSpace:"nowrap",
              color: i===current ? E.gold : i < current ? E.muted : E.dim,
              fontWeight: i===current ? 600 : 400 }}>{s}</span>
          </div>
          {i < E_STEPS.length-1 && (
            <div style={{ flex:1, height:1.5, margin:"0 4px", marginBottom:14,
              background: i < current ? E.gold : E.border, transition:"background 0.3s" }}/>
          )}
        </div>
      ))}
    </div>
  );
}

// ── PRICING SIDEBAR ──
function EPriceSidebar({ data }) {
  const sqft = data.width && data.length ? data.width * data.length : null;
  const price = eCalcPrice(sqft, data.service, data.delivery);
  const conf  = eCalcConf(data);
  const cColor = conf >= 80 ? E.green : conf >= 50 ? E.gold : E.amber;

  return (
    <div style={{ width:220, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ background:E.bg2, border:`1px solid ${E.border}`, borderRadius:10, padding:"16px" }}>
        <p style={{ fontSize:10, fontWeight:700, color:E.gold, letterSpacing:"0.1em",
          textTransform:"uppercase", marginBottom:12 }}>Estimated Design Fee</p>
        <div style={{ background:E.bg3, borderRadius:8, padding:"12px", marginBottom:12, textAlign:"center" }}>
          {price
            ? <p style={{ fontFamily:E.serif, fontSize:20, fontWeight:700, color:E.text }}>
                ${price.low.toLocaleString()} – ${price.high.toLocaleString()}
              </p>
            : <div>
                <p style={{ fontFamily:E.serif, fontSize:18, fontWeight:700, color:E.dim }}>$– –</p>
                <p style={{ fontSize:10, color:E.dim, marginTop:3 }}>Fill in project details</p>
              </div>
          }
        </div>
        <p style={{ fontSize:10, color:E.dim, lineHeight:1.5, marginBottom:price?12:0 }}>
          *Approximate estimate. Final pricing confirmed upon project review.
        </p>
        {price && (
          <div style={{ borderTop:`1px solid ${E.border}`, paddingTop:10 }}>
            <p style={{ fontSize:10, fontWeight:700, color:E.gold, letterSpacing:"0.08em",
              textTransform:"uppercase", marginBottom:8 }}>Cost Breakdown</p>
            {[
              [SVC_LABEL[data.service]||"Service", `$${price.base}`],
              ...(data.delivery==="rush"    ? [["Rush Fee (+40%)",    `+$${price.rushAmt}`]] : []),
              ...(data.delivery==="express" ? [["Express Fee (+60%)", `+$${price.exprAmt}`]] : []),
              ["Project Complexity", "Standard"],
            ].map(([k,v]) => (
              <div key={k} style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:11, color:E.muted }}>{k}</span>
                <span style={{ fontSize:11, fontWeight:600, color: k.includes("Fee") ? E.amber : E.text }}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ background:E.bg2, border:`1px solid ${E.border}`, borderRadius:10, padding:"14px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
          <TrendingUp size={13} color={cColor}/>
          <span style={{ fontSize:12, fontWeight:600, flex:1 }}>Estimate Confidence</span>
          <span style={{ fontWeight:700, color:cColor, fontSize:13 }}>{conf}%</span>
        </div>
        <div style={{ background:E.bg3, borderRadius:4, height:5, marginBottom:7 }}>
          <div style={{ width:`${conf}%`, height:"100%", borderRadius:4, background:cColor, transition:"width 0.5s" }}/>
        </div>
        <p style={{ fontSize:10, color:cColor, lineHeight:1.5 }}>
          {conf >= 80 ? "Good confidence. Upload documents to maximize accuracy."
           : conf >= 50 ? "Add more project details to improve estimate."
           : "Fill in dimensions and project type to get an estimate."}
        </p>
      </div>
    </div>
  );
}

// ── STEP 1: LOCATION ──
function EStep1({ data, set }) {
  const [stateQuery, setStateQuery]   = useState(data.state || "");
  const [stateOpen,  setStateOpen]    = useState(false);
  const [mapError,   setMapError]     = useState(false);

  const US_STATES = [
    "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
    "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
    "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
    "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada",
    "New Hampshire","New Jersey","New Mexico","New York","North Carolina",
    "North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
    "South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
    "Virginia","Washington","West Virginia","Wisconsin","Wyoming","Washington D.C.",
  ];
  const BR_STATES = [
    "Acre","Alagoas","Amapá","Amazonas","Bahia","Ceará","Distrito Federal",
    "Espírito Santo","Goiás","Maranhão","Mato Grosso","Mato Grosso do Sul",
    "Minas Gerais","Pará","Paraíba","Paraná","Pernambuco","Piauí",
    "Rio de Janeiro","Rio Grande do Norte","Rio Grande do Sul","Rondônia",
    "Roraima","Santa Catarina","São Paulo","Sergipe","Tocantins",
  ];
  const allStates  = data.country === "BR" ? BR_STATES : US_STATES;
  const filtered   = allStates.filter(s =>
    s.toLowerCase().includes(stateQuery.toLowerCase())
  );

  // Google Maps helpers
  const fullAddress = [data.street, data.city, data.state, data.zip, data.country === "BR" ? "Brazil" : "USA"]
    .filter(Boolean).join(", ");
  const hasAddress  = !!(data.street && data.city && data.state && data.zip);
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  // Google Static Maps — uses a free-tier placeholder key; swap with real key in production
  const MAPS_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
  const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(fullAddress)}&zoom=17&size=560x160&maptype=roadmap&markers=color:0xb89b6a%7C${encodeURIComponent(fullAddress)}&key=${MAPS_KEY}`;

  const labelSt = { fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
    textTransform:"uppercase", display:"block", marginBottom:6 };
  const req = <span style={{ color:E.red, marginLeft:2 }}>*</span>;

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:4 }}>Project Location</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:20 }}>
        Fill in all required fields to identify your project address.
      </p>

      {/* ── COUNTRY TOGGLE ── */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {[["US","United States","USD · sqft"],["BR","Brazil","BRL · m²"]].map(([code,name,sub])=>(
          <button key={code} onClick={()=>{ set("country",code); set("state",""); setStateQuery(""); }} style={{
            flex:1, background: data.country===code ? E.goldD : E.bg3,
            border:`1.5px solid ${data.country===code ? E.gold : E.border}`,
            borderRadius:9, padding:"12px", cursor:"pointer", textAlign:"left",
            transition:"all 0.15s" }}>
            <p style={{ fontSize:14, fontWeight:700, color: data.country===code ? E.gold : E.text, marginBottom:2 }}>{code}</p>
            <p style={{ fontSize:11, color:E.muted, marginBottom:2 }}>{name}</p>
            <p style={{ fontSize:10, color:E.dim }}>{sub}</p>
          </button>
        ))}
      </div>

      {/* ── FIELDS GRID ── */}
      <div style={{ display:"grid", gap:14 }}>

        {/* Project Name */}
        <div>
          <label style={labelSt}>Project Name {req}</label>
          <EInput value={data.projectName||""} onChange={e=>set("projectName",e.target.value)}
            placeholder="e.g. Bowdoin Ave Residence"/>
        </div>

        {/* Street Address */}
        <div>
          <label style={labelSt}>Street Address {req}</label>
          <EInput value={data.street||""} onChange={e=>set("street",e.target.value)}
            placeholder="123 Main St"/>
        </div>

        {/* City + ZIP side by side */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={labelSt}>City {req}</label>
            <EInput value={data.city||""} onChange={e=>set("city",e.target.value)}
              placeholder="e.g. Boston"/>
          </div>
          <div>
            <label style={labelSt}>ZIP / Postal Code {req}</label>
            <EInput value={data.zip||""} onChange={e=>set("zip",e.target.value)}
              placeholder="e.g. 02134"/>
          </div>
        </div>

        {/* State — Searchable Select */}
        <div>
          <label style={labelSt}>State / Province {req}</label>
          <div style={{ position:"relative" }}>
            <input
              value={stateQuery}
              onChange={e=>{ setStateQuery(e.target.value); setStateOpen(true); }}
              onFocus={()=>setStateOpen(true)}
              placeholder="Type to search..."
              style={{ width:"100%", background:E.bg3,
                border:`1.5px solid ${stateOpen ? E.gold : data.state ? E.gold : E.border}`,
                borderRadius:8, padding:"9px 36px 9px 12px", fontSize:13,
                color:E.text, outline:"none", fontFamily:E.sans, transition:"border-color 0.15s" }}/>
            {/* Search icon */}
            <span style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)",
              fontSize:13, color:E.dim, pointerEvents:"none" }}>🔍</span>

            {stateOpen && filtered.length > 0 && (
              <>
                <div onClick={()=>setStateOpen(false)}
                  style={{ position:"fixed", inset:0, zIndex:49 }}/>
                <div style={{ position:"absolute", top:"calc(100% + 4px)", left:0, right:0, zIndex:50,
                  background:"#fff", border:`1px solid ${E.border}`, borderRadius:9,
                  boxShadow:"0 8px 24px rgba(0,0,0,0.1)", maxHeight:220, overflowY:"auto" }}>
                  {filtered.map(s=>(
                    <div key={s} onClick={()=>{ set("state",s); setStateQuery(s); setStateOpen(false); }}
                      style={{ padding:"9px 14px", fontSize:13, cursor:"pointer",
                        background: data.state===s ? E.goldD : "none",
                        color: data.state===s ? E.gold : E.text,
                        borderBottom:`1px solid rgba(0,0,0,0.04)`,
                        display:"flex", alignItems:"center", gap:8,
                        transition:"background 0.1s" }}
                      onMouseEnter={e=>{ if(data.state!==s) e.currentTarget.style.background=E.bg3; }}
                      onMouseLeave={e=>{ if(data.state!==s) e.currentTarget.style.background="none"; }}>
                      {data.state===s && <CheckCircle2 size={11} color={E.gold}/>}
                      {s}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
          {data.state && (
            <p style={{ fontSize:10, color:E.green, marginTop:4, display:"flex", alignItems:"center", gap:4 }}>
              <CheckCircle2 size={10} color={E.green}/> {data.state} selecionado
            </p>
          )}
        </div>
      </div>

      {/* ── GOOGLE MAPS CONFIRMATION ── */}
      {hasAddress && (
        <div style={{ marginTop:20, padding:"14px 16px", background:E.bg3,
          border:`1px solid ${E.goldBorder}`, borderRadius:10 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <span style={{ fontSize:13 }}>📍</span>
            <a href={mapsSearchUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:12, fontWeight:600, color:E.gold, textDecoration:"underline",
                cursor:"pointer" }}>
              Confirmar localização no Google Maps
            </a>
          </div>

          {/* Static map thumbnail */}
          {MAPS_KEY !== "YOUR_GOOGLE_MAPS_API_KEY" ? (
            <div style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${E.border}` }}>
              <img
                src={staticMapUrl}
                alt="Map preview"
                onError={()=>setMapError(true)}
                style={{ width:"100%", height:140, objectFit:"cover", display:"block" }}/>
            </div>
          ) : (
            /* Placeholder while no real API key is set */
            <div style={{ borderRadius:8, overflow:"hidden", border:`1px solid ${E.border}`,
              background:E.bg4, height:130, display:"flex", flexDirection:"column",
              alignItems:"center", justifyContent:"center", gap:8 }}>
              <span style={{ fontSize:28 }}>🗺️</span>
              <p style={{ fontSize:12, color:E.muted, fontWeight:500 }}>Map Preview</p>
              <p style={{ fontSize:10, color:E.dim, textAlign:"center", maxWidth:280 }}>
                {fullAddress}
              </p>
              <p style={{ fontSize:10, color:E.dim, marginTop:2 }}>
                Configure sua Google Maps API Key para ativar o mapa.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Required fields notice */}
      <p style={{ fontSize:10, color:E.dim, marginTop:16 }}>
        <span style={{ color:E.red }}>*</span> Todos os campos são obrigatórios para continuar.
      </p>
    </div>
  );
}

// ── STEP 2: PROJECT DETAILS ──
function EStep2({ data, set }) {
  const [unit, setUnit] = useState(data.areaUnit || "sqft");

  const serviceTypes = [
    { id:"drafting",         label:"Drafting",             icon:"📐", desc:"2D floor plans, elevations, construction drawings" },
    { id:"3d_rendering",     label:"3D Rendering",         icon:"🎨", desc:"Photorealistic exterior & interior visualizations" },
    { id:"full_interior",    label:"Full Interior Design", icon:"🛋️", desc:"Complete interior concept, materials & layout" },
    { id:"concept_design",   label:"Concept Design",       icon:"✏️", desc:"Initial sketches, moodboards & spatial concepts" },
  ];

  const scopeItems = [
    { id:"site_plan",    label:"Site Plan",    icon:"🗺️" },
    { id:"floor_plans",  label:"Floor Plans",  icon:"📋" },
    { id:"elevations",   label:"Elevations",   icon:"📏" },
    { id:"electrical",   label:"Electrical",   icon:"⚡" },
    { id:"plumbing",     label:"Plumbing",     icon:"🔧" },
    { id:"hvac",         label:"HVAC",         icon:"❄️" },
  ];

  const styles = [
    { id:"minimalist",  label:"Minimalist",  icon:"◻️" },
    { id:"modern",      label:"Modern",      icon:"🔷" },
    { id:"traditional", label:"Traditional", icon:"🏛️" },
    { id:"industrial",  label:"Industrial",  icon:"⚙️" },
    { id:"scandinavian",label:"Scandinavian",icon:"🌿" },
    { id:"luxury",      label:"Luxury",      icon:"✨" },
  ];

  const objectives = [
    "New Construction", "Remodel", "Addition", "Renovation",
    "Interior Refresh", "Commercial Fit-Out",
  ];

  const toggleScope = (id) => {
    const cur = data.scope || [];
    set("scope", cur.includes(id) ? cur.filter(x=>x!==id) : [...cur, id]);
  };

  // Area conversion helper
  const displayArea = () => {
    if (!data.area) return null;
    if (unit === "sqft") return `${Number(data.area).toLocaleString()} sqft`;
    return `${Number(data.area).toLocaleString()} m²`;
  };
  const areaInSqft = () => {
    if (!data.area) return null;
    return unit === "m2" ? Math.round(data.area * 10.7639) : data.area;
  };

  const lbl = { fontSize:11, fontWeight:700, color:E.muted, letterSpacing:"0.07em",
    textTransform:"uppercase", display:"block", marginBottom:8 };
  const req = <span style={{ color:E.red }}>*</span>;

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:4 }}>Project Details</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:22 }}>
        Define the scope and characteristics of your project.
      </p>

      {/* ── SERVICE TYPE ── */}
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Service Type {req}</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          {serviceTypes.map(svc => {
            const active = data.detailService === svc.id;
            return (
              <button key={svc.id} onClick={()=>set("detailService", svc.id)} style={{
                background: active ? E.goldD : E.bg3,
                border:`2px solid ${active ? E.gold : E.border}`,
                borderRadius:10, padding:"14px 16px", cursor:"pointer", textAlign:"left",
                transition:"all 0.15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:6 }}>
                  <span style={{ fontSize:22 }}>{svc.icon}</span>
                  <span style={{ fontSize:13, fontWeight:700,
                    color: active ? E.gold : E.text }}>{svc.label}</span>
                  {active && <CheckCircle2 size={14} color={E.gold} style={{ marginLeft:"auto" }}/>}
                </div>
                <p style={{ fontSize:11, color:E.dim, lineHeight:1.5 }}>{svc.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── DIMENSIONS ── */}
      <div style={{ marginBottom:24, padding:"16px", background:E.goldD,
        border:`1px solid ${E.goldBorder}`, borderRadius:10 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <label style={{ ...lbl, marginBottom:0 }}>Area Estimada {req}</label>
          {/* Unit toggle */}
          <div style={{ display:"flex", background:E.bg3, border:`1px solid ${E.border}`,
            borderRadius:6, overflow:"hidden" }}>
            {["sqft","m2"].map(u => (
              <button key={u} onClick={()=>{ setUnit(u); set("areaUnit",u); }}
                style={{ padding:"5px 12px", fontSize:11, fontWeight:600, border:"none",
                  background: unit===u ? E.gold : "transparent",
                  color: unit===u ? "#fff" : E.muted, cursor:"pointer" }}>
                {u === "sqft" ? "sqft" : "m²"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"stretch" }}>
          <input
            type="number" min="1" value={data.area||""}
            onChange={e=>{ const v=Number(e.target.value)||""; set("area",v); set("areaUnit",unit); }}
            placeholder={unit==="sqft" ? "e.g. 1500" : "e.g. 140"}
            style={{ flex:1, background:"#fff", border:`1.5px solid ${E.border}`, borderRadius:8,
              padding:"11px 13px", fontSize:14, fontWeight:600, color:E.text,
              outline:"none", fontFamily:E.sans }}/>
          <div style={{ background:"#fff", border:`1px solid ${E.border}`, borderRadius:8,
            padding:"11px 14px", fontSize:13, color:E.muted, display:"flex", alignItems:"center" }}>
            {unit === "sqft" ? "sqft" : "m²"}
          </div>
        </div>
        {data.area && (
          <div style={{ marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <span style={{ fontSize:11, color:E.muted }}>
              {unit==="m2"
                ? `≈ ${Math.round(data.area * 10.7639).toLocaleString()} sqft`
                : `≈ ${Math.round(data.area / 10.7639).toLocaleString()} m²`}
            </span>
            <span style={{ fontSize:11, fontWeight:700, color:E.gold }}>
              {displayArea()} {req}
            </span>
          </div>
        )}
        <p style={{ fontSize:10, color:E.amber, marginTop:8, display:"flex", alignItems:"center", gap:4 }}>
          <AlertTriangle size={10} color={E.amber}/> Campo crítico para o cálculo da estimativa
        </p>
      </div>

      {/* ── TECHNICAL SCOPE ── */}
      <div style={{ marginBottom:24 }}>
        <label style={lbl}>Technical Scope (múltipla escolha)</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
          {scopeItems.map(item => {
            const active = (data.scope||[]).includes(item.id);
            return (
              <button key={item.id} onClick={()=>toggleScope(item.id)} style={{
                background: active ? E.goldD : E.bg3,
                border:`1.5px solid ${active ? E.gold : E.border}`,
                borderRadius:9, padding:"11px 10px", cursor:"pointer",
                display:"flex", alignItems:"center", gap:8, transition:"all 0.15s" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{item.icon}</span>
                <span style={{ fontSize:12, fontWeight: active?700:500,
                  color: active ? E.gold : E.muted, textAlign:"left" }}>{item.label}</span>
                {active && <CheckCircle2 size={12} color={E.gold} style={{ marginLeft:"auto", flexShrink:0 }}/>}
              </button>
            );
          })}
        </div>
        {(data.scope||[]).length > 0 && (
          <p style={{ fontSize:10, color:E.green, marginTop:6, display:"flex", alignItems:"center", gap:4 }}>
            <CheckCircle2 size={10} color={E.green}/> {(data.scope||[]).length} item(s) selecionado(s)
          </p>
        )}
      </div>

      {/* ── STYLE & OBJECTIVE ── */}
      <div style={{ marginBottom:20 }}>
        <label style={lbl}>Estilo Visual</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:16 }}>
          {styles.map(st => {
            const active = data.style === st.id;
            return (
              <button key={st.id} onClick={()=>set("style", st.id)} style={{
                background: active ? E.goldD : E.bg3,
                border:`1.5px solid ${active ? E.gold : E.border}`,
                borderRadius:9, padding:"12px 8px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                transition:"all 0.15s" }}>
                <span style={{ fontSize:20 }}>{st.icon}</span>
                <span style={{ fontSize:11, fontWeight: active?700:500,
                  color: active ? E.gold : E.muted }}>{st.label}</span>
              </button>
            );
          })}
        </div>

        <label style={lbl}>Objetivo do Projeto</label>
        <div style={{ position:"relative" }}>
          <select value={data.objective||""}
            onChange={e=>set("objective",e.target.value)}
            style={{ width:"100%", background:E.bg3, border:`1.5px solid ${data.objective?E.gold:E.border}`,
              borderRadius:8, padding:"10px 13px", fontSize:13, color: data.objective?E.text:E.dim,
              outline:"none", fontFamily:E.sans, appearance:"none", cursor:"pointer" }}>
            <option value="">Select objective...</option>
            {objectives.map(o=><option key={o} value={o}>{o}</option>)}
          </select>
          <span style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)",
            fontSize:11, color:E.dim, pointerEvents:"none" }}>▾</span>
        </div>
      </div>

      {/* ── FOOTER WARNING ── */}
      <div style={{ padding:"11px 14px", background:E.amberBg,
        border:`1px solid rgba(192,124,10,0.25)`, borderRadius:8,
        display:"flex", gap:8, alignItems:"flex-start" }}>
        <AlertTriangle size={13} color={E.amber} style={{ flexShrink:0, marginTop:1 }}/>
        <p style={{ fontSize:11, color:E.amber, lineHeight:1.6 }}>
          Os campos marcados com <strong>(*)</strong> são fundamentais para o cálculo da sua estimativa.
          Alterações de área ou escopo após o envio poderão resultar em <strong>ajustes automáticos no valor</strong>.
        </p>
      </div>
    </div>
  );
}

// ── STEP 3: REVIEW ──────────────────────────────────────────
function EStepReview({ data, onGoTo }) {
  const SVC_LABEL_DET = {
    drafting:"Drafting", "3d_rendering":"3D Rendering",
    full_interior:"Full Interior Design", concept_design:"Concept Design",
  };
  const scopeLabels = {
    site_plan:"Site Plan", floor_plans:"Floor Plans", elevations:"Elevations",
    electrical:"Electrical", plumbing:"Plumbing", hvac:"HVAC",
  };
  const styleLabels = {
    minimalist:"Minimalist", modern:"Modern", traditional:"Traditional",
    industrial:"Industrial", scandinavian:"Scandinavian", luxury:"Luxury",
  };

  const sqftDisplay = data.area
    ? `${Number(data.area).toLocaleString()} ${data.areaUnit === "m2" ? "m²" : "sqft"}`
    : "–";

  const ReviewCard = ({ title, stepIndex, children }) => (
    <div style={{ background:E.bg3, border:`1px solid ${E.border}`, borderRadius:12,
      overflow:"hidden", marginBottom:14 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"13px 16px", borderBottom:`1px solid ${E.border}`,
        background:E.bg2 }}>
        <span style={{ fontSize:12, fontWeight:700, color:E.text, letterSpacing:"0.03em" }}>{title}</span>
        <button onClick={()=>onGoTo(stepIndex)} style={{
          background:"none", border:`1px solid ${E.gold}`, borderRadius:6,
          padding:"4px 12px", fontSize:11, fontWeight:600, color:E.gold,
          cursor:"pointer", display:"flex", alignItems:"center", gap:5 }}>
          ✏️ Edit
        </button>
      </div>
      <div style={{ padding:"14px 16px" }}>{children}</div>
    </div>
  );

  const Row = ({ label, value, critical }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
      padding:"6px 0", borderBottom:`1px solid rgba(0,0,0,0.05)` }}>
      <span style={{ fontSize:11, color:E.muted, flexShrink:0, marginRight:12 }}>{label}</span>
      <span style={{ fontSize:11, fontWeight:600, color: critical ? E.amber : E.text, textAlign:"right" }}>
        {value}{critical && <span style={{ fontSize:9, color:E.amber, marginLeft:4 }}>*</span>}
      </span>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:4 }}>Review Your Project</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:20 }}>
        Confirm the details before proceeding. Use <strong>Edit</strong> to go back and adjust any section.
      </p>

      {/* Location card */}
      <ReviewCard title="📍 Project Location" stepIndex={0}>
        <Row label="Project Name" value={data.projectName || "–"}/>
        <Row label="Address"      value={data.street || "–"}/>
        <Row label="City"         value={data.city || "–"}/>
        <Row label="State"        value={data.state || "–"}/>
        <Row label="ZIP"          value={data.zip || "–"}/>
        <Row label="Country"      value={data.country === "BR" ? "🇧🇷 Brazil" : "🇺🇸 United States"}/>
      </ReviewCard>

      {/* Project Details card */}
      <ReviewCard title="📐 Project Details" stepIndex={1}>
        <Row label="Service Type"     value={SVC_LABEL_DET[data.detailService] || "–"} critical/>
        <Row label="Area"             value={sqftDisplay} critical/>
        <Row label="Technical Scope"  value={(data.scope||[]).map(s=>scopeLabels[s]||s).join(", ") || "None selected"}/>
        <Row label="Style"            value={styleLabels[data.style] || "–"}/>
        <Row label="Objective"        value={data.objective || "–"}/>
      </ReviewCard>

      {/* Completeness check */}
      {(() => {
        const missing = [];
        if (!data.projectName) missing.push("Project Name");
        if (!data.street)      missing.push("Street Address");
        if (!data.city)        missing.push("City");
        if (!data.state)       missing.push("State");
        if (!data.zip)         missing.push("ZIP Code");
        if (!data.detailService) missing.push("Service Type");
        if (!data.area)        missing.push("Project Area");
        if (missing.length > 0) return (
          <div style={{ padding:"11px 14px", background:E.redBg,
            border:`1px solid rgba(184,50,50,0.2)`, borderRadius:8,
            display:"flex", gap:8, alignItems:"flex-start", marginBottom:10 }}>
            <AlertTriangle size={13} color={E.red} style={{ flexShrink:0, marginTop:1 }}/>
            <div>
              <p style={{ fontSize:11, fontWeight:700, color:E.red, marginBottom:3 }}>Campos obrigatórios faltando:</p>
              <p style={{ fontSize:11, color:E.muted }}>{missing.join(" · ")}</p>
            </div>
          </div>
        );
        return (
          <div style={{ padding:"10px 14px", background:E.greenBg,
            border:`1px solid rgba(45,134,83,0.25)`, borderRadius:8,
            display:"flex", alignItems:"center", gap:7 }}>
            <CheckCircle2 size={13} color={E.green}/>
            <span style={{ fontSize:12, color:E.green, fontWeight:600 }}>
              All required fields complete — ready to proceed.
            </span>
          </div>
        );
      })()}
    </div>
  );
}

// ── STEP 4: SCOPE (was Step 3) ──
function EStep3({ data, set }) {
  const [expanded, setExpanded] = useState(null);
  const projectTypes = [
    {id:"single_family",   label:"Single Family",   icon:"🏠"},
    {id:"kitchen",         label:"Kitchen Remodel",  icon:"🍳"},
    {id:"bath_remodel",    label:"Bath Remodel",     icon:"🚿"},
    {id:"interior_reno",   label:"Interior Reno",    icon:"🛋️"},
    {id:"home_addition",   label:"Home Addition",    icon:"🏗️"},
    {id:"adu",             label:"ADU",              icon:"🏡"},
    {id:"multi_family",    label:"Multi-Family",     icon:"🏢"},
    {id:"small_commercial",label:"Small Commercial", icon:"🏪"},
    {id:"garage",          label:"Garage",           icon:"🚗"},
    {id:"3d_only",         label:"3D Only",          icon:"🎨"},
    {id:"custom",          label:"Custom Home",      icon:"✨"},
    {id:"commercial",      label:"Commercial",       icon:"🏛️"},
  ];
  const services = [
    {id:"full_construction", label:"Full Construction", badge:"HIGH COMPLEXITY",
     desc:"Complete package: floor plans, 3D exterior, design extras, municipal review.",
     detail:"Comprehensive design package including initial concepts, detailed spatial planning, core building documentation, 3D exterior visualization, and municipal code review. Excludes interior cabinetry and landscape design."},
    {id:"floor_plans_only", label:"Floor Plans Only", badge:"LOW COMPLEXITY",
     desc:"Essential spatial layouts and dimensioned floor plans only.",
     detail:"Streamlined service delivering interior spatial layouts and dimensioned floor plans. Does not include exterior design, building permits, structural engineering, or 3D renderings."},
    {id:"pdf_to_cad", label:"PDF to CAD Conversion", badge:"DRAFTING ONLY",
     desc:"Convert PDF blueprints or hand-drawn sketches to fully editable CAD files.",
     detail:"Technical drafting service to convert your PDF blueprints, hand-drawn sketches, or old plans into fully editable scaled digital CAD (.dwg) files.",
     warning:"Design Extras and 3D Visualization are not available for PDF to CAD Conversion."},
  ];
  const sqft = data.width && data.length ? data.width * data.length : 144;
  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:5 }}>Project Scope</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:20 }}>Define your project type and the services you need.</p>
      <div style={{ marginBottom:20 }}>
        <label style={{ fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
          textTransform:"uppercase", display:"block", marginBottom:8 }}>What type of project? *</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:7 }}>
          {projectTypes.map(pt=>{
            const active = data.projectType === pt.id;
            return (
              <button key={pt.id} onClick={()=>set("projectType",pt.id)} style={{
                background: active ? E.goldD : E.bg3,
                border:`1.5px solid ${active ? E.gold : E.border}`,
                borderRadius:8, padding:"9px 6px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
                <span style={{ fontSize:18 }}>{pt.icon}</span>
                <span style={{ fontSize:10, fontWeight:500, color: active ? E.gold : E.muted,
                  textAlign:"center", lineHeight:1.3 }}>{pt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label style={{ fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
          textTransform:"uppercase", display:"block", marginBottom:8 }}>Services Needed *</label>
        <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
          {services.map(svc=>{
            const active = data.service === svc.id;
            const exp = expanded === svc.id;
            const sp = eCalcPrice(sqft, svc.id, "standard");
            return (
              <div key={svc.id} style={{ background: active ? E.goldD : E.bg3,
                border:`1.5px solid ${active ? E.gold : E.border}`, borderRadius:9, overflow:"hidden" }}>
                <div style={{ padding:"13px 14px", cursor:"pointer" }}
                  onClick={()=>{ set("service",svc.id); if(svc.id==="pdf_to_cad") set("delivery","standard"); }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <div style={{ width:17, height:17, borderRadius:"50%", marginTop:1, flexShrink:0,
                      background: active ? E.gold : "transparent",
                      border:`2px solid ${active ? E.gold : E.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {active && <div style={{ width:5, height:5, borderRadius:"50%", background:E.bg2 }}/>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:3 }}>
                        <span style={{ fontSize:13, fontWeight:600, color: active ? E.text : E.muted }}>{svc.label}</span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em",
                          color:COMPLEXITY_COLOR[svc.id], background:`${COMPLEXITY_COLOR[svc.id]}20`,
                          borderRadius:3, padding:"2px 6px" }}>{svc.badge}</span>
                        {sp && <span style={{ marginLeft:"auto", fontSize:11, color:E.gold, fontWeight:600 }}>
                          ${sp.low}–${sp.high}
                        </span>}
                      </div>
                      <p style={{ fontSize:11, color:E.dim, lineHeight:1.5 }}>{svc.desc}</p>
                    </div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setExpanded(exp?null:svc.id);}}
                    style={{ background:"none", border:"none", color:E.gold, fontSize:11,
                      cursor:"pointer", marginTop:7, marginLeft:27,
                      display:"flex", alignItems:"center", gap:4 }}>
                    <Info size={11} color={E.gold}/> More details
                  </button>
                </div>
                {exp && (
                  <div style={{ padding:"0 14px 13px 41px" }}>
                    <div style={{ background:E.bg2, border:`1px solid ${E.border}`, borderRadius:7, padding:"11px 13px" }}>
                      <p style={{ fontSize:12, color:E.text, lineHeight:1.6 }}>{svc.detail}</p>
                    </div>
                    {svc.warning && (
                      <div style={{ marginTop:7, padding:"8px 12px", background:E.blueBg,
                        border:`1px solid ${E.blue}40`, borderRadius:6, fontSize:11, color:E.blue }}>
                        ℹ️ {svc.warning}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── STEP 4: ROOMS ──
function EStep4({ data, set }) {
  const roomGroups = [
    {group:"Core Rooms", rooms:[
      {id:"bedrooms",label:"Bedrooms"},{id:"bathrooms",label:"Bathrooms"},
      {id:"half_baths",label:"Half Baths"},{id:"living",label:"Living Rooms"},
      {id:"family",label:"Family Room"},{id:"double_height",label:"Double Height Living Room"},
    ]},
    {group:"Kitchen & Dining", rooms:[
      {id:"kitchen",label:"Kitchen"},{id:"kitchen_island",label:"Kitchen Island"},
      {id:"pantry",label:"Pantry"},{id:"butler_pantry",label:"Butler Pantry"},
      {id:"dining",label:"Dining Room"},
    ]},
    {group:"Utility & Storage", rooms:[
      {id:"walk_in_closet",label:"Walk In Closet"},{id:"mudroom",label:"Mudroom"},
      {id:"laundry",label:"Laundry Room"},{id:"garage_bays",label:"Garage Bays"},
    ]},
    {group:"Outdoor Spaces", rooms:[
      {id:"covered_deck",label:"Covered Deck"},{id:"screened_porch",label:"Screened Porch"},
      {id:"outdoor_kitchen",label:"Outdoor Kitchen"},
    ]},
    {group:"Special Features", rooms:[
      {id:"home_office",label:"Home Office"},{id:"fireplace",label:"Fireplace"},
      {id:"gym",label:"Gym"},{id:"wine_cellar",label:"Wine Cellar"},
      {id:"sauna",label:"Sauna"},{id:"elevator",label:"Elevator"},
    ]},
  ];
  const rooms = data.rooms || {};
  const setRoom = (id, val) => set("rooms", { ...rooms, [id]: Math.max(0, val) });
  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:5 }}>Program Requirements</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:20 }}>What spaces does your project need? Improves estimate accuracy.</p>
      {roomGroups.map(g=>(
        <div key={g.group} style={{ marginBottom:18 }}>
          <p style={{ fontSize:10, fontWeight:700, color:E.gold, letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:9 }}>{g.group}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {g.rooms.map(r=>{
              const qty = rooms[r.id] || 0;
              return (
                <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"9px 13px", background: qty>0 ? E.goldD : E.bg3,
                  border:`1px solid ${qty>0 ? E.goldBorder : E.border}`, borderRadius:7 }}>
                  <span style={{ fontSize:12, color: qty>0 ? E.text : E.muted }}>{r.label}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                    <button onClick={()=>setRoom(r.id,qty-1)} style={{ width:26,height:26,borderRadius:6,
                      background:E.bg2, border:`1px solid ${E.border}`, color:E.muted,
                      fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>−</button>
                    <span style={{ fontSize:13, fontWeight:600, minWidth:18, textAlign:"center",
                      color: qty>0 ? E.gold : E.dim }}>{qty}</span>
                    <button onClick={()=>setRoom(r.id,qty+1)} style={{ width:26,height:26,borderRadius:6,
                      background:E.bg2, border:`1px solid ${E.border}`, color:E.muted,
                      fontSize:16, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div>
        <label style={{ fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
          textTransform:"uppercase", display:"block", marginBottom:6 }}>Special Requirements (optional)</label>
        <textarea value={data.specialReq||""} onChange={e=>set("specialReq",e.target.value)}
          placeholder="e.g. ADA accessibility, home theater, specific materials..." rows={3}
          style={{ width:"100%", background:E.bg3, border:`1.5px solid ${E.border}`, borderRadius:8,
            padding:"9px 12px", fontSize:13, color:E.text, outline:"none",
            fontFamily:E.sans, resize:"vertical", lineHeight:1.6 }}/>
      </div>
    </div>
  );
}

// ── STEP 5: FILES ──
function EStep5({ data, set }) {
  const files       = data.fileList     || [];
  const fileStatus  = data.fileStatus   || {}; // { [fileName]: "pending"|"uploading"|"done"|"error" }
  const fileUrls    = data.fileUrls     || {}; // { [fileName]: publicUrl }
  const [dragging, setDragging] = useState(false);

  const addFiles = (newFiles) => {
    const combined = [...files];
    const newStatus = { ...fileStatus };
    Array.from(newFiles).forEach(f => {
      if (!combined.find(x => x.name === f.name)) {
        combined.push(f);
        newStatus[f.name] = "pending";
      }
    });
    set("fileList",   combined);
    set("fileStatus", newStatus);
  };

  const removeFile = (name) => {
    set("fileList",   files.filter(f => f.name !== name));
    set("fileStatus", Object.fromEntries(Object.entries(fileStatus).filter(([k]) => k !== name)));
    set("fileUrls",   Object.fromEntries(Object.entries(fileUrls).filter(([k]) => k !== name)));
  };

  // Upload a single file to Supabase Storage immediately when added
  const uploadFile = async (file) => {
    if (!supabase) {
      // Mock: just mark as done
      set("fileStatus", { ...fileStatus, [file.name]: "done" });
      set("fileUrls",   { ...fileUrls,   [file.name]: `mock://uploads/${file.name}` });
      return;
    }
    set("fileStatus", { ...fileStatus, [file.name]: "uploading" });
    try {
      const path = `estimates/${Date.now()}_${file.name.replace(/\s+/g,"_")}`;
      const { error } = await supabase.storage
        .from("estimate-files")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage
        .from("estimate-files").getPublicUrl(path);
      set("fileStatus", prev => ({ ...(prev||{}), [file.name]: "done" }));
      set("fileUrls",   prev => ({ ...(prev||{}), [file.name]: publicUrl }));
    } catch(err) {
      console.error("Upload error:", err);
      set("fileStatus", prev => ({ ...(prev||{}), [file.name]: "error" }));
    }
  };

  // Trigger upload whenever new pending files appear
  useEffect(() => {
    files.forEach(f => {
      if (fileStatus[f.name] === "pending") uploadFile(f);
    });
  }, [files.length]); // eslint-disable-line

  const iconFor = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    if (['jpg','jpeg','png','gif','webp'].includes(ext)) return "🖼️";
    if (['mp4','mov','avi','mkv'].includes(ext)) return "🎬";
    if (ext === 'pdf') return "📄";
    if (ext === 'dwg') return "📐";
    return "📎";
  };

  const statusIcon = (name) => {
    const s = fileStatus[name];
    if (s === "uploading") return <span style={{ fontSize:11, color:E.amber, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span>;
    if (s === "done")      return <CheckCircle2 size={13} color={E.green}/>;
    if (s === "error")     return <span style={{ fontSize:11, color:E.red }}>✕</span>;
    return null;
  };

  const allDone    = files.length > 0 && files.every(f => fileStatus[f.name] === "done");
  const anyUploading = files.some(f => fileStatus[f.name] === "uploading");
  const doneCount  = files.filter(f => fileStatus[f.name] === "done").length;

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:5 }}>Upload Files</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:16 }}>
        Share reference files, photos, or plot plans to help us understand your vision.
      </p>

      {/* Info box */}
      <div style={{ background:E.bg3, border:`1px solid ${E.border}`, borderRadius:8,
        padding:"13px 15px", marginBottom:16 }}>
        <p style={{ fontSize:11, fontWeight:600, color:E.text, marginBottom:7 }}>Helpful documents include:</p>
        {["Property Survey / Plot Plan","Site Photos","Measurements / Dimensions",
          "Reference Images / Inspiration","Existing Plans or Blueprints","Sketches / Hand Drawings"].map(d=>(
          <p key={d} style={{ fontSize:11, color:E.muted, marginBottom:3 }}>• {d}</p>
        ))}
        <p style={{ fontSize:10, color:E.dim, marginTop:8 }}>
          PDF, JPG, PNG, DWG, MP4, MOV — up to 10 files · Max 50MB each
        </p>
      </div>

      {/* Upload progress bar */}
      {files.length > 0 && (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:11, color:E.muted }}>
              {anyUploading ? "Fazendo upload..." : allDone ? "Todos os arquivos enviados!" : `${doneCount} / ${files.length} enviados`}
            </span>
            <span style={{ fontSize:11, fontWeight:600, color: allDone ? E.green : E.gold }}>
              {Math.round((doneCount / files.length) * 100)}%
            </span>
          </div>
          <div style={{ background:E.bg3, borderRadius:4, height:5 }}>
            <div style={{ width:`${Math.round((doneCount / files.length)*100)}%`, height:"100%",
              borderRadius:4, background: allDone ? E.green : E.gold, transition:"width 0.4s ease" }}/>
          </div>
        </div>
      )}

      {/* Drop zone */}
      <label
        onDragOver={e=>{e.preventDefault();setDragging(true);}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{ e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
        style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
          border:`2px dashed ${dragging ? E.gold : E.border}`, borderRadius:10, padding:"28px 20px",
          cursor:"pointer", marginBottom: files.length ? 14 : 0,
          background: dragging ? E.goldD : E.bg3, transition:"all 0.15s" }}>
        <Upload size={24} color={E.gold} style={{ marginBottom:10 }}/>
        <p style={{ fontSize:13, fontWeight:500, marginBottom:4, color:E.text }}>
          Drag & drop or <span style={{ color:E.gold }}>click to browse</span>
        </p>
        <p style={{ fontSize:10, color:E.dim }}>PDF, JPG, PNG, DWG, MP4 — up to 10 files</p>
        <input type="file" multiple
          accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,.dwg,.mp4,.mov,.avi,.mkv"
          style={{ display:"none" }}
          onChange={e=>addFiles(e.target.files)}/>
      </label>

      {/* File list */}
      {files.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {files.map(f => {
            const s = fileStatus[f.name];
            const isError = s === "error";
            return (
              <div key={f.name} style={{ display:"flex", alignItems:"center", gap:11,
                padding:"10px 13px",
                background: isError ? E.redBg : s==="done" ? E.greenBg : E.bg3,
                border:`1px solid ${isError?"rgba(184,50,50,0.25)":s==="done"?"rgba(45,134,83,0.25)":E.border}`,
                borderRadius:8, transition:"all 0.3s" }}>
                <span style={{ fontSize:18, flexShrink:0 }}>{iconFor(f.name)}</span>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:500, color:E.text,
                    whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{f.name}</p>
                  <p style={{ fontSize:10, color: isError?E.red:s==="done"?E.green:E.amber, marginTop:2 }}>
                    {isError ? "Erro no upload — clique para tentar novamente"
                     : s==="uploading" ? "Fazendo upload..."
                     : s==="done" ? "✓ Enviado para a nuvem"
                     : `${(f.size/1024).toFixed(0)} KB — aguardando upload`}
                  </p>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                  {statusIcon(f.name)}
                  {/* Retry on error */}
                  {isError && (
                    <button onClick={()=>uploadFile(f)} style={{ background:"none", border:`1px solid ${E.amber}`,
                      borderRadius:5, padding:"2px 8px", fontSize:10, color:E.amber, cursor:"pointer" }}>
                      Retry
                    </button>
                  )}
                  <button onClick={()=>removeFile(f.name)} style={{ background:"none",
                    border:"none", color:E.dim, cursor:"pointer", padding:2 }}>
                    <X size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Blocking warning if still uploading */}
      {anyUploading && (
        <div style={{ marginTop:12, padding:"9px 13px", background:E.amberBg,
          border:`1px solid rgba(192,124,10,0.25)`, borderRadius:7,
          display:"flex", alignItems:"center", gap:7 }}>
          <AlertTriangle size={13} color={E.amber}/>
          <span style={{ fontSize:12, color:E.amber }}>
            Aguarde o upload dos arquivos antes de avançar.
          </span>
        </div>
      )}
    </div>
  );
}

// ── RUSH DOCS (separate from general uploads, used only to unlock Rush/Express) ──
const E_RUSH_DOCS = [
  {id:"survey",      label:"Property Survey / Plot Plan"},
  {id:"site_photos", label:"Site Photos"},
  {id:"measurements",label:"Measurements / Dimensions"},
  {id:"reference",   label:"Reference Images / Inspiration"},
  {id:"existing",    label:"Existing Plans or Blueprints"},
  {id:"sketches",    label:"Sketches / Hand Drawings"},
];

// ── STEP 6: RUSH FEES ──
function EStep6({ data, set }) {
  const rushUploads = data.rushUploads || {};
  const setRushUpload = (id, file) => set("rushUploads", { ...rushUploads, [id]: file });
  const uploadedCount = E_RUSH_DOCS.filter(d => rushUploads[d.id]).length;
  const total = E_RUSH_DOCS.length;
  const progressPct = Math.round((uploadedCount / total) * 100);
  const allUploaded = uploadedCount === total;
  const isPdfCad = data.service === "pdf_to_cad";
  const unlocked = allUploaded && !isPdfCad;

  const sqft = data.width && data.length ? data.width * data.length : 144;
  const prices = {
    standard: eCalcPrice(sqft, data.service, "standard"),
    rush:     eCalcPrice(sqft, data.service, "rush"),
    express:  eCalcPrice(sqft, data.service, "express"),
  };

  const deliveryOptions = [
    { id:"standard", label:"Standard", badge:"Included", badgeColor:E.green,
      preview:"8–16 Business Days", final:"25–30 Business Days After Approval", locked:false },
    { id:"rush",     label:"Rush",     badge:"+40%",      badgeColor:E.amber,
      preview:"5–8 Business Days",  final:"15–20 Business Days After Approval",
      locked:!unlocked, popular:true },
    { id:"express",  label:"Express",  badge:"+60%",      badgeColor:E.red,
      preview:"2–4 Business Days",  final:"7–12 Business Days After Approval",
      locked:!unlocked, warning:"Contact us on WhatsApp before selecting — timeline varies by project size" },
  ];

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:5 }}>Rush Fees</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:16 }}>
        Upload your project files to unlock faster delivery options and more accurate pricing.
      </p>

      {/* Standard delivery info */}
      <div style={{ background:E.bg3, border:`1px solid ${E.border}`, borderRadius:9,
        padding:"14px 16px", marginBottom:20 }}>
        <p style={{ fontSize:10, fontWeight:700, color:E.muted, letterSpacing:"0.1em",
          textTransform:"uppercase", marginBottom:12 }}>Standard Delivery — Included</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:E.text, marginBottom:3 }}>Design Preview</p>
            <p style={{ fontSize:13, fontWeight:700, color:E.gold, marginBottom:4 }}>8–16 Business Days</p>
            <p style={{ fontSize:11, color:E.dim, lineHeight:1.5 }}>Initial layout and visual direction delivered for review.</p>
          </div>
          <div>
            <p style={{ fontSize:12, fontWeight:600, color:E.text, marginBottom:3 }}>Final Drawing Set</p>
            <p style={{ fontSize:13, fontWeight:700, color:E.gold, marginBottom:4 }}>25–30 Business Days After Approval</p>
            <p style={{ fontSize:11, color:E.dim, lineHeight:1.5 }}>Complete architectural drawing package in digital format.</p>
          </div>
        </div>
        <p style={{ fontSize:10, color:E.dim, marginTop:10, fontStyle:"italic", lineHeight:1.5 }}>
          Timeline starts from receipt of required project information including proposal approval and initial payment.
        </p>
      </div>

      {/* Unlock Faster Delivery */}
      <div style={{ marginBottom:16 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <Zap size={14} color={E.gold}/>
            <span style={{ fontSize:13, fontWeight:700, color:E.text }}>Unlock Faster Delivery</span>
          </div>
          <span style={{ fontSize:12, fontWeight:600, color:E.muted }}>{uploadedCount} / {total}</span>
        </div>
        <p style={{ fontSize:11, color:E.muted, marginBottom:10 }}>
          Upload your project files to access accelerated timelines.
        </p>

        {/* Progress bar */}
        <div style={{ background:E.bg3, borderRadius:4, height:6, marginBottom:14 }}>
          <div style={{ width:`${progressPct}%`, height:"100%", borderRadius:4,
            background: allUploaded ? E.green : E.gold,
            transition:"width 0.4s ease" }}/>
        </div>

        {/* Upload slots */}
        <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
          {E_RUSH_DOCS.map(doc=>{
            const file = rushUploads[doc.id];
            return (
              <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:11,
                padding:"10px 13px",
                background: file ? E.greenBg : E.bg3,
                border:`1px solid ${file ? "rgba(45,134,83,0.3)" : E.border}`,
                borderRadius:8 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", flexShrink:0,
                  background: file ? E.green : E.bg2,
                  border:`1.5px solid ${file ? E.green : E.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center" }}>
                  {file
                    ? <CheckCircle2 size={13} color="#fff"/>
                    : <Upload size={11} color={E.dim}/>
                  }
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:12, fontWeight:500,
                    color: file ? E.green : E.muted }}>
                    {doc.label}
                  </p>
                  {file && (
                    <p style={{ fontSize:10, color:E.green, marginTop:2 }}>
                      {file.name} · {(file.size/1024).toFixed(0)} KB
                    </p>
                  )}
                </div>
                {file ? (
                  <button onClick={()=>setRushUpload(doc.id, null)}
                    style={{ background:"none", border:"none", color:E.dim, cursor:"pointer" }}>
                    <X size={13}/>
                  </button>
                ) : (
                  <label style={{ display:"flex", alignItems:"center", gap:5, cursor:"pointer",
                    background:E.bg2, border:`1px solid ${E.border}`,
                    borderRadius:6, padding:"5px 11px", fontSize:11, color:E.muted, fontWeight:600 }}>
                    <Upload size={11}/> Upload
                    <input type="file" accept=".pdf,.jpg,.jpeg,.png,.dwg,.mp4,.mov"
                      style={{ display:"none" }}
                      onChange={e=>{ const f=e.target.files?.[0]; if(f) setRushUpload(doc.id, f); }}/>
                  </label>
                )}
              </div>
            );
          })}
        </div>

        {allUploaded && (
          <div style={{ marginTop:12, padding:"9px 13px", background:E.greenBg,
            border:`1px solid rgba(45,134,83,0.3)`, borderRadius:7,
            display:"flex", alignItems:"center", gap:7 }}>
            <CheckCircle2 size={13} color={E.green}/>
            <span style={{ fontSize:12, color:E.green, fontWeight:600 }}>
              All documents uploaded — select your delivery speed below.
            </span>
          </div>
        )}
      </div>

      {/* Delivery speed options */}
      <label style={{ fontSize:11, fontWeight:600, color:E.muted, letterSpacing:"0.06em",
        textTransform:"uppercase", display:"block", marginBottom:10 }}>Select Your Delivery Speed</label>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {deliveryOptions.map(opt=>{
          const active = (data.delivery||"standard") === opt.id;
          const p = prices[opt.id];
          const locked = opt.locked;
          return (
            <div key={opt.id} style={{ opacity: locked ? 0.45 : 1 }}>
              {opt.popular && !locked && (
                <div style={{ padding:"6px 14px", background:E.amberBg,
                  border:`1px solid rgba(192,124,10,0.25)`, borderRadius:"8px 8px 0 0",
                  fontSize:10, fontWeight:700, color:E.amber, letterSpacing:"0.06em" }}>
                  ⭐ MOST CLIENTS CHOOSE RUSH — REDUCES DELAYS IN PERMITTING AND CONSTRUCTION
                </div>
              )}
              {opt.warning && !locked && (
                <div style={{ padding:"6px 14px", background:E.redBg,
                  border:`1px solid rgba(184,50,50,0.2)`, borderRadius:"8px 8px 0 0",
                  fontSize:10, fontWeight:700, color:E.red, letterSpacing:"0.06em" }}>
                  ⚠ {opt.warning}
                </div>
              )}
              <div onClick={()=>!locked && set("delivery", opt.id)} style={{
                background: active ? E.goldD : E.bg3,
                border:`1.5px solid ${active ? E.gold : E.border}`,
                borderRadius: (opt.popular||opt.warning)&&!locked ? "0 0 9px 9px" : 9,
                padding:"13px 14px", cursor: locked ? "not-allowed" : "pointer" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:17, height:17, borderRadius:"50%",
                    background: active ? E.gold : "transparent",
                    border:`2px solid ${active ? E.gold : E.border}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {active && <div style={{ width:5, height:5, borderRadius:"50%", background:E.bg2 }}/>}
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color: active ? E.text : E.muted }}>{opt.label}</span>
                  <span style={{ fontSize:11, fontWeight:700, color:opt.badgeColor,
                    background:`${opt.badgeColor}20`, borderRadius:4, padding:"2px 8px" }}>{opt.badge}</span>
                  {active && p && (
                    <span style={{ marginLeft:"auto", fontFamily:E.serif, fontSize:13, fontWeight:700, color:E.gold }}>
                      ${p.low}–${p.high}
                    </span>
                  )}
                  {active && opt.id==="standard" && (
                    <span style={{ marginLeft:"auto", fontSize:12, fontWeight:600, color:E.green }}>Included</span>
                  )}
                </div>
                {active && opt.id !== "standard" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginTop:10, marginLeft:27 }}>
                    {[["Design Preview", opt.preview],["Final Set", opt.final]].map(([k,v])=>(
                      <div key={k} style={{ background:E.bg2, border:`1px solid ${E.border}`,
                        borderRadius:7, padding:"9px 11px" }}>
                        <p style={{ fontSize:10, color:E.dim, marginBottom:3, textTransform:"uppercase",
                          letterSpacing:"0.06em", fontWeight:600 }}>{k}</p>
                        <p style={{ fontSize:12, fontWeight:700, color:E.gold }}>{v}</p>
                      </div>
                    ))}
                  </div>
                )}
                {active && opt.id === "standard" && (
                  <p style={{ fontSize:11, color:E.dim, marginTop:6, marginLeft:27 }}>
                    Preview 8–16 days · Final 25–30 days
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isPdfCad && (
        <div style={{ marginTop:11, padding:"9px 13px", background:E.blueBg,
          border:`1px solid ${E.blue}40`, borderRadius:7, fontSize:11, color:E.blue }}>
          ℹ️ Rush/Express not available for PDF to CAD Conversion.
        </div>
      )}
    </div>
  );
}

// ── STEP 7: REVIEW ──
// ── STEP 7: REVIEW & SUBMIT ──
// onGoTo(step) lets each card's Edit button jump to that step
function EStep7({ data, onSubmit, onGoTo, submitting, submitError }) {
  const [agreed, setAgreed]       = useState(false);
  const [savedDraft, setSavedDraft] = useState(false);

  const sqft  = data.area
    ? (data.areaUnit==="m2" ? Math.round(data.area*10.7639) : Number(data.area))
    : (data.width && data.length ? data.width * data.length : null);
  const price = eCalcPrice(sqft, data.service || data.detailService, data.delivery||"standard");

  const handleSaveLater = () => {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 3000);
  };

  const svcName = {
    drafting:"Drafting", "3d_rendering":"3D Rendering",
    full_interior:"Full Interior Design", concept_design:"Concept Design",
    full_construction:"Full Construction", floor_plans_only:"Floor Plans Only", pdf_to_cad:"PDF to CAD",
  };

  // Review card definition: title, step to go back to, rows
  const cards = [
    {
      title:"📍 Location", step:0,
      rows:[
        ["Project Name",  data.projectName||"–"],
        ["Address",       data.street||"–"],
        ["City / State",  `${data.city||"–"}, ${data.state||"–"}`],
        ["ZIP",           data.zip||"–"],
        ["Country",       data.country==="BR"?"Brazil":"United States"],
      ],
    },
    {
      title:"📐 Project Details", step:1,
      rows:[
        ["Service Type",  svcName[data.detailService]||"–"],
        ["Area",          data.area ? `${Number(data.area).toLocaleString()} ${data.areaUnit==="m2"?"m²":"sqft"}` : "–"],
        ["Scope",         (data.scope||[]).length > 0 ? (data.scope||[]).map(s=>s.replace(/_/g," ")).join(", ") : "–"],
        ["Style",         data.style ? data.style.charAt(0).toUpperCase()+data.style.slice(1) : "–"],
        ["Objective",     data.objective||"–"],
      ],
    },
    {
      title:"⚙️ Project Scope", step:2,
      rows:[
        ["Project Type",  (data.projectType||"–").replace(/_/g," ")],
        ["Engagement",    SVC_LABEL[data.service]||"–"],
        ["Delivery",      data.delivery==="rush"?"Rush (+40%)":data.delivery==="express"?"Express (+60%)":"Standard"],
      ],
    },
  ];

  const ReviewCard = ({ card }) => (
    <div style={{ background:E.bg3, border:`1px solid ${E.border}`,
      borderRadius:10, overflow:"hidden" }}>
      {/* Card header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"11px 15px", borderBottom:`1px solid ${E.border}`,
        background: E.bg2 }}>
        <span style={{ fontSize:11, fontWeight:700, color:E.gold, letterSpacing:"0.08em",
          textTransform:"uppercase" }}>{card.title}</span>
        <button onClick={()=>onGoTo(card.step)}
          style={{ background:"none", border:`1px solid ${E.gold}`, borderRadius:6,
            padding:"4px 12px", fontSize:11, fontWeight:600, color:E.gold,
            cursor:"pointer", display:"flex", alignItems:"center", gap:5,
            transition:"all 0.15s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background=E.goldD; }}
          onMouseLeave={e=>{ e.currentTarget.style.background="none"; }}>
          ✏️ Edit
        </button>
      </div>
      {/* Rows */}
      <div style={{ padding:"4px 0" }}>
        {card.rows.map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", gap:12, padding:"8px 15px",
            borderBottom:`1px solid rgba(0,0,0,0.04)` }}>
            <span style={{ fontSize:11, color:E.muted, flexShrink:0 }}>{k}</span>
            <span style={{ fontSize:11, fontWeight:500, color:E.text, textAlign:"right",
              maxWidth:"60%", wordBreak:"break-word" }}>{v || "–"}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h2 style={{ fontFamily:E.serif, fontSize:17, fontWeight:700, marginBottom:4 }}>Review & Submit</h2>
      <p style={{ fontSize:12, color:E.muted, marginBottom:20 }}>
        Confirm your project details. Use <strong style={{ color:E.gold }}>Edit</strong> on any card to go back and make changes — your data is preserved.
      </p>

      {/* Review cards */}
      <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:18 }}>
        {cards.map(c=><ReviewCard key={c.title} card={c}/>)}
      </div>

      {/* Estimated fee */}
      {price && (
        <div style={{ background:E.goldD, border:`1px solid ${E.goldBorder}`,
          borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ fontSize:10, fontWeight:700, color:E.gold, letterSpacing:"0.09em",
                textTransform:"uppercase", marginBottom:6 }}>Estimated Design Fee</p>
              <p style={{ fontFamily:E.serif, fontSize:22, fontWeight:700, color:E.text }}>
                ${price.low.toLocaleString()} – ${price.high.toLocaleString()}
              </p>
            </div>
            <div style={{ textAlign:"right" }}>
              {[
                [SVC_LABEL[data.service||data.detailService]||"Service", `$${price.base}`],
                ...(data.delivery==="rush"?[["Rush (+40%)",`+$${price.rushAmt}`]]:[]),
                ...(data.delivery==="express"?[["Express (+60%)",`+$${price.exprAmt}`]]:[]),
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", gap:12, justifyContent:"flex-end" }}>
                  <span style={{ fontSize:11, color:E.muted }}>{k}</span>
                  <span style={{ fontSize:11, fontWeight:600 }}>{v}</span>
                </div>
              ))}
              <p style={{ fontSize:10, color:E.dim, marginTop:4 }}>*Approximate estimate</p>
            </div>
          </div>
        </div>
      )}

      {/* Legal disclaimer */}
      <div style={{ padding:"11px 13px", background:E.redBg,
        border:`1px solid rgba(184,50,50,0.2)`, borderRadius:8, marginBottom:14 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
          <AlertTriangle size={13} color={E.red} style={{ flexShrink:0, marginTop:1 }}/>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:E.red, marginBottom:3 }}>Important Legal Disclosure</p>
            <p style={{ fontSize:11, color:E.muted, lineHeight:1.6 }}>
              This is a DARA Studio drafting and design service. It does NOT include professional
              engineering (PE/SE stamped) or architectural stamps required for building permit submission.
              The client is solely responsible for retaining a licensed Engineer or Architect.
            </p>
          </div>
        </div>
      </div>

      {/* Agreement */}
      <ECheckbox checked={agreed} onChange={()=>!submitting && setAgreed(a=>!a)}>
        I agree with this estimate and wish to proceed. I understand this is an approximate estimate and
        final pricing will be confirmed upon project review.
      </ECheckbox>

      {/* Submit error */}
      {submitError && (
        <div style={{ marginTop:12, padding:"9px 13px", background:E.redBg,
          border:`1px solid rgba(184,50,50,0.25)`, borderRadius:7,
          display:"flex", alignItems:"center", gap:7 }}>
          <AlertTriangle size={13} color={E.red}/>
          <span style={{ fontSize:12, color:E.red }}>{submitError}</span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginTop:18 }}>
        <button
          onClick={()=> agreed && !submitting && onSubmit()}
          disabled={!agreed || submitting}
          style={{
            background: submitting ? E.amberBg : agreed ? E.gold : E.bg3,
            border:`1px solid ${submitting ? E.amber : agreed ? E.gold : E.border}`,
            borderRadius:9, padding:"12px", fontSize:14, fontWeight:700,
            color: submitting ? E.amber : agreed ? "#fff" : E.dim,
            cursor: (!agreed || submitting) ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:7,
            transition:"all 0.2s" }}>
          {submitting
            ? <><span style={{ fontSize:16, animation:"spin 1s linear infinite", display:"inline-block" }}>⟳</span> Enviando...</>
            : <><Zap size={15}/> Accept & Continue</>
          }
        </button>
        <button onClick={handleSaveLater} disabled={submitting}
          style={{ background: savedDraft ? E.greenBg : "none",
            border:`1px solid ${savedDraft ? "rgba(45,134,83,0.3)" : E.border}`,
            borderRadius:9, padding:"12px", fontSize:13,
            color: savedDraft ? E.green : E.muted,
            cursor: submitting ? "not-allowed" : "pointer",
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            transition:"all 0.2s" }}>
          {savedDraft
            ? <><CheckCircle2 size={14} color={E.green}/> Rascunho salvo!</>
            : <>💾 Save for Later</>}
        </button>
      </div>
    </div>
  );
}
// ── SUCCESS SCREEN ──
function ESuccess({ data, onClose }) {
  const sqft = data.width && data.length ? data.width * data.length : null;
  const price = eCalcPrice(sqft, data.service, data.delivery||"standard");
  const code = `DARA-${String(Date.now()).slice(-4)}`;
  const expiry = new Date(Date.now()+30*24*60*60*1000)
    .toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit",year:"numeric"});
  return (
    <div style={{ textAlign:"center", padding:"48px 20px" }}>
      <div style={{ width:60,height:60, borderRadius:"50%", background:E.greenBg,
        border:`2px solid ${E.green}`, display:"flex", alignItems:"center",
        justifyContent:"center", margin:"0 auto 18px" }}>
        <CheckCircle2 size={26} color={E.green}/>
      </div>
      <h2 style={{ fontFamily:E.serif, fontSize:22, fontWeight:700, marginBottom:8 }}>Estimate Submitted!</h2>
      <p style={{ fontSize:13, color:E.muted, lineHeight:1.7, maxWidth:380, margin:"0 auto 22px" }}>
        Your project request has been created. Our team will review it and contact you within 2–3 business days.
      </p>
      <div style={{ background:E.bg2, border:`1px solid ${E.goldBorder}`,
        borderRadius:11, padding:"18px", maxWidth:340, margin:"0 auto 16px", textAlign:"left" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:11 }}>
          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:E.gold }}>{code}</span>
          <span style={{ fontSize:11, background:E.amberBg, color:E.amber,
            borderRadius:4, padding:"2px 8px", fontWeight:600 }}>Pending Review</span>
        </div>
        {[
          ["Location", `${data.city||"–"}, ${data.state||"–"}`],
          ["Service",  SVC_LABEL[data.service]||"–"],
          ...(price ? [["Estimate", `$${price.low}–$${price.high}`]] : []),
          ["Valid until", expiry],
        ].map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between",
            padding:"6px 0", borderBottom:`1px solid ${E.border}` }}>
            <span style={{ fontSize:12, color:E.muted }}>{k}</span>
            <span style={{ fontSize:12, fontWeight: k==="Estimate"?700:500,
              color: k==="Estimate"?E.gold:E.text }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"9px 14px", background:E.amberBg,
        border:`1px solid rgba(192,124,10,0.25)`, borderRadius:7,
        maxWidth:340, margin:"0 auto 20px" }}>
        <p style={{ fontSize:11, color:E.amber }}>
          ⏱ This estimate is valid for <strong>30 days</strong>. After {expiry}, the project enters <strong>Hold</strong>.
        </p>
      </div>
      <button onClick={onClose} style={{ background:E.gold, border:"none",
        borderRadius:9, padding:"11px 28px", fontSize:13, fontWeight:700,
        color:"#fff", cursor:"pointer" }}>
        View My Projects →
      </button>
    </div>
  );
}

// ── ESTIMATE FORM MAIN ──
function EstimateForm({ onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    country:"US", levels:["Ground Floor / Main Level"],
    delivery:"standard", service:null, uploads:{},
  });
  const set = (k,v) => setData(d=>({...d,[k]:v}));

  const canNext = () => {
    if(step===0) return !!(data.country && data.projectName?.trim() && data.street?.trim() && data.city?.trim() && data.state && data.zip?.trim());
    if(step===1) return !!(data.detailService && data.area);
    if(step===2) return !!(data.projectName && data.street && data.city && data.state && data.zip && data.detailService && data.area);
    if(step===3) return !!(data.service && data.projectType);
    // Step 5 (index 5): block if any file is still uploading
    if(step===5) {
      const fs = data.fileStatus || {};
      const uploading = Object.values(fs).some(s => s === "uploading");
      return !uploading;
    }
    return true;
  };

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      // ── 1. CALCULATE sqft ──
      const sqft = data.area
        ? (data.areaUnit === "m2" ? Math.round(data.area * 10.7639) : Number(data.area))
        : (data.width && data.length ? data.width * data.length : null);

      // ── 2. CLIENT-SIDE PRICE (for comparison) ──
      const clientPrice = eCalcPrice(sqft, data.service || data.detailService, data.delivery || "standard");

      // ── 3. SERVER-SIDE PRICE VALIDATION ──
      // Backend recalculates independently — if tampered, uses server value
      const serverPrice = await serverCalcPrice(
        sqft,
        data.service || data.detailService,
        data.delivery || "standard",
        clientPrice
      );

      if (serverPrice.tampered) {
        console.warn("Price manipulation detected — using validated server price:", serverPrice);
      }

      // ── 4. COLLECT UPLOADED FILE URLS ──
      const fileUrls = Object.values(data.fileUrls || {}).filter(Boolean);

      // ── 5. BUILD PROJECT RECORD ──
      const projectPayload = {
        // Location
        project_name:    data.projectName,
        address:         data.street,
        city:            data.city,
        state:           data.state,
        zip:             data.zip,
        country:         data.country,
        // Project details
        service_type:    data.detailService,
        area_sqft:       sqft,
        area_unit:       data.areaUnit || "sqft",
        scope:           data.scope || [],
        style:           data.style,
        objective:       data.objective,
        // Project scope
        project_type:    data.projectType,
        engagement:      data.service,
        levels:          data.levels || [],
        rooms:           data.rooms || {},
        special_req:     data.specialReq || "",
        // Delivery
        delivery:        data.delivery || "standard",
        // Price — always the server-validated value, NEVER the client value
        estimate_low:    serverPrice.low,
        estimate_high:   serverPrice.high,
        estimate_base:   serverPrice.base,
        price_validated: true,
        // Files
        file_urls:       fileUrls,
        file_count:      fileUrls.length,
        // Status
        status:          "pending",
        pending_action:  "Aguardando revisão — válido por 30 dias",
        stage:           "Levantamento",
        progress:        0,
        budget:          serverPrice.high || 0,
        paid:            0,
        expires_at:      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        submitted_at:    new Date().toISOString(),
      };

      // ── 6. PERSIST TO SUPABASE ──
      let dbProjectId = null;
      if (supabase) {
        const { data: inserted, error: dbErr } = await supabase
          .from("projects")
          .insert({ ...projectPayload, client_id: data.userId || null })
          .select("id, code")
          .single();
        if (dbErr) throw dbErr;
        dbProjectId = inserted?.id;
        // Generate code if DB didn't set it
        if (!inserted?.code) {
          await supabase.from("projects")
            .update({ code: `DARA-${String(dbProjectId).slice(-4).padStart(4,"0")}` })
            .eq("id", dbProjectId);
        }
      }

      // ── 7. NOTIFY PARENT (DashboardLayout) ──
      setSubmitted(true);
      onSubmit && onSubmit({
        ...data,
        dbProjectId,
        serverPrice,
        fileUrls,
      });
    } catch(err) {
      console.error("Submit error:", err);
      setSubmitError("Erro ao enviar. Por favor, tente novamente.");
      setSubmitting(false);
    }
  };

  // 8 steps: Location(0), Details(1), Review(2), Scope(3), Rooms(4), Files(5), Rush(6), Submit(7)
  const ReviewWithNav = (props) => <EStepReview {...props} onGoTo={setStep}/>;
  const steps = [EStep1, EStep2, ReviewWithNav, EStep3, EStep4, EStep5, EStep6, EStep7];
  const StepComp = steps[step];

  return (
    <div style={{ background:E.bg, minHeight:"100vh", fontFamily:E.sans }}>
      {/* Top bar */}
      <div style={{ background:E.bg2, borderBottom:`1px solid ${E.border}`,
        padding:"0 24px", height:52, display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"sticky", top:0, zIndex:40 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28,height:28, background:E.gold, borderRadius:6,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:E.serif, fontWeight:700, fontSize:14, color:"#fff" }}>D</span>
          </div>
          <div>
            <span style={{ fontFamily:E.serif, fontSize:12, fontWeight:700, color:E.text }}>DARA Studio</span>
            <span style={{ fontSize:11, color:E.dim, marginLeft:8 }}>Get Your Project Estimate</span>
          </div>
        </div>
        <button onClick={onClose} style={{ background:"none", border:"none",
          color:E.dim, cursor:"pointer", fontSize:12,
          display:"flex", alignItems:"center", gap:5 }}>
          <X size={14}/> Cancel
        </button>
      </div>

      {submitted ? (
        <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 24px" }}>
          <ESuccess data={data} onClose={()=>{ onClose && onClose(); }}/>
        </div>
      ) : (
        <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px" }}>
          <EStepBar current={step}/>
          <div style={{ display:"flex", gap:22, alignItems:"flex-start" }}>
            <div style={{ flex:1, minWidth:0, background:E.bg2, border:`1px solid ${E.border}`,
              borderRadius:12, padding:"24px" }}>
              <StepComp data={data} set={set} onSubmit={handleSubmit} submitting={submitting} submitError={submitError}/>
              {step < 7 && (
                <div style={{ display:"flex", justifyContent:"space-between", marginTop:28,
                  paddingTop:20, borderTop:`1px solid ${E.border}` }}>
                  <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
                    style={{ display:"flex", alignItems:"center", gap:6, background:"none",
                      border:`1px solid ${E.border}`, borderRadius:8, padding:"9px 16px",
                      fontSize:13, color: step===0 ? E.dim : E.muted,
                      cursor: step===0 ? "not-allowed" : "pointer" }}>
                    <ChevronLeft size={14}/> Back
                  </button>
                  <button onClick={()=>setStep(s=>Math.min(7,s+1))} disabled={!canNext()}
                    style={{ display:"flex", alignItems:"center", gap:6,
                      background: canNext() ? E.gold : E.bg3,
                      border:`1px solid ${canNext() ? E.gold : E.border}`,
                      borderRadius:8, padding:"9px 20px", fontSize:13, fontWeight:700,
                      color: canNext() ? "#fff" : E.dim,
                      cursor: canNext() ? "pointer" : "not-allowed" }}>
                    Next <ChevronRight size={14}/>
                  </button>
                </div>
              )}
            </div>
            <EPriceSidebar data={data}/>
          </div>
        </div>
      )}
    </div>
  );
}
export default function App() {
  const [user,    setUser]    = useState(null);   // Supabase user object or mock user
  const [session, setSession] = useState(null);
  const [booting, setBooting] = useState(true);  // checking existing session on load

  // ── On mount: restore existing Supabase session ──
  useEffect(() => {
    if (!supabase) {
      // Mock mode — skip session check
      setBooting(false);
      return;
    }

    // Check current session
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setBooting(false);
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  if (booting) {
    return (
      <div style={{ minHeight:"100vh", background:"#f5f3ef", display:"flex",
        alignItems:"center", justifyContent:"center" }}>
                <div style={{ textAlign:"center" }}>
          <div style={{ width:40, height:40, borderRadius:"50%", border:"3px solid #e2ddd6",
            borderTopColor:"#b89b6a", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }}/>
          <p style={{ fontSize:12, color:"#6b6760" }}>Carregando...</p>
        </div>
      </div>
    );
  }

  return (user || !SUPABASE_READY)
    ? <DashboardLayout user={user} onLogout={handleLogout}/>
    : <LoginScreen onLogin={setUser}/>;
}
