import { useState, useEffect, useRef } from "react";

// ── Tokens ──────────────────────────────────────────────────────────────────
const G = "#b89b6a", GD = "rgba(184,155,106,0.13)", GB = "rgba(184,155,106,0.28)";
const BG = "#f5f3ef", BG2 = "#fff", BG3 = "#edeae4", SB = "#1a1814";
const TX = "#1a1814", MU = "#6b6760", DM = "#a09b94", BR = "#e2ddd6";
const GN = "#2d8653", GNB = "rgba(45,134,83,0.10)";
const AM = "#c07c0a", AMB = "rgba(192,124,10,0.10)";
const RD = "#b83232", RDB = "rgba(184,50,50,0.09)";
const BL = "#2566a8", BLB = "rgba(37,102,168,0.09)";
const fmt = n => "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: 2 });

// ── Data ─────────────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: 1, code: "DARA-0010", address: "41 Bowdoin Ave", city: "Dorchester, MA", service: "New Construction — Single Family", stage: "Detalhamento", status: "on_track", budget: 2718, paid: 0, progress: 6, updatedAt: "18/03/2026", pending: "Aguardando informações do cliente" },
  { id: 2, code: "DARA-0008", address: "88 Dover St", city: "Boston, MA", service: "Commercial Office Renovation", stage: "Estudo Preliminar", status: "on_track", budget: 4200, paid: 2100, progress: 50, updatedAt: "14/03/2026", pending: null },
  { id: 3, code: "DARA-0005", address: "215 Hampton Rd", city: "Brookline, MA", service: "Interior Design — Living Room", stage: "Entrega Final", status: "completed", budget: 1800, paid: 1800, progress: 100, updatedAt: "28/02/2026", pending: null },
];
const INVOICES = [
  { id: "INV-2026-003", project: "41 Bowdoin Ave", amount: 1359, status: "pending", due: "15/04/2026" },
  { id: "INV-2026-002", project: "88 Dover St", amount: 1400, status: "pending", due: "30/03/2026" },
  { id: "INV-2026-001", project: "88 Dover St", amount: 700, status: "paid", due: "10/03/2026" },
];
const ACTIVITY = [
  { id: 1, text: "Novo arquivo publicado em 41 Bowdoin Ave", time: "2h atrás", ico: "F" },
  { id: 2, text: "Fatura INV-2026-002 vence em 10 dias", time: "1d atrás", ico: "$" },
  { id: 3, text: "Nova mensagem de Daniela (DARA Studio)", time: "2d atrás", ico: "M" },
];
const USER = { name: "Jackson Da Silva", company: "Jack General Services Inc.", email: "jackgeneraloffice@gmail.com", phone: "+1 (617) 775-0179", initials: "JD" };

// ── Status helpers ────────────────────────────────────────────────────────────
const sLabel = { on_track: "Em Andamento", attention: "Atenção", completed: "Concluído" };
const sColor = {
  on_track: { bg: GNB, c: GN },
  attention: { bg: AMB, c: AM },
  completed: { bg: BLB, c: BL },
};

// ── SVG Icon ─────────────────────────────────────────────────────────────────
const Svg = ({ d, s = 14, c = "currentColor" }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const I = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  folder: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
  rcpt: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  usr: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  bld: "M3 21h18M9 21V7l6-4v18M9 21H3V9l6-2",
  out: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14",
  back: "M19 12H5M12 19l-7-7 7-7",
  bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4z",
  x: "M18 6 6 18M6 6l12 12",
  menu: "M3 12h18M3 6h18M3 18h18",
  trend: "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0",
  eyex: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22",
  tkt: "M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z",
};

// ── Badge ─────────────────────────────────────────────────────────────────────
const Badge = ({ s }) => {
  const sc = sColor[s] || sColor.on_track;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.c, borderRadius: 20, padding: "2px 9px" }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.c, flexShrink: 0 }} />
      {sLabel[s] || s}
    </span>
  );
};

// ── NavItem ───────────────────────────────────────────────────────────────────
const NavItem = ({ ico, label, active, badge, collapsed, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 9, padding: collapsed ? "10px 0" : "9px 12px",
      border: "none", borderRadius: 8, width: "100%", textAlign: "left", cursor: "pointer",
      background: active ? "rgba(184,155,106,0.15)" : "none",
      color: active ? G : "rgba(255,255,255,0.45)",
      fontWeight: active ? 600 : 400, fontSize: 13, fontFamily: "inherit",
      transition: "all .15s", justifyContent: collapsed ? "center" : "flex-start", position: "relative"
    }}
    onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = active ? G : "rgba(255,255,255,0.78)"; }}
    onMouseLeave={e => { e.currentTarget.style.background = active ? "rgba(184,155,106,0.15)" : "none"; e.currentTarget.style.color = active ? G : "rgba(255,255,255,0.45)"; }}
  >
    <Svg d={I[ico]} s={15} c="currentColor" />
    {!collapsed && <span style={{ flex: 1 }}>{label}</span>}
    {!collapsed && badge > 0 && <span style={{ background: G, color: SB, borderRadius: 10, fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{badge}</span>}
    {collapsed && badge > 0 && <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: G }} />}
  </button>
);

// ── Login ─────────────────────────────────────────────────────────────────────
const Login = ({ onLogin }) => {
  const [tab, setTab] = useState("in");
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [nm, setNm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const go = () => {
    if (!em || !pw) { setErr("Preencha todos os campos."); return; }
    setErr(""); setBusy(true);
    setTimeout(() => {
      setBusy(false);
      if (tab === "in") {
        if (em === "joao@darastudio.com" && pw === "teste123") onLogin({ ...USER });
        else setErr("E-mail ou senha incorretos.");
      } else {
        if (pw.length < 6) { setErr("Senha: mínimo 6 caracteres."); return; }
        setOk("Conta criada! Verifique seu e-mail."); setTab("in");
      }
    }, 700);
  };

  const inp = { width: "100%", border: "1.5px solid " + BR, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: TX, background: BG, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 11, fontWeight: 600, color: DM, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" };

  return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", gap: 48, padding: 24, flexWrap: "wrap" }}>
      {/* Left panel */}
      <div style={{ width: 320, minWidth: 260 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 38, height: 38, background: G, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19, color: "#fff", fontFamily: "Georgia, serif", flexShrink: 0 }}>D</div>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 15, color: TX }}>DARA Studio</p>
            <p style={{ fontSize: 11, color: MU }}>Drafting & 3D Support</p>
          </div>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: TX, marginBottom: 10, lineHeight: 1.25 }}>Portal do Cliente</h1>
        <p style={{ fontSize: 13, color: MU, lineHeight: 1.7, marginBottom: 20 }}>Acesse seus projetos, arquivos e comunicações em um único lugar.</p>
        {[["folder", "Acompanhe o progresso de cada projeto em tempo real"], ["rcpt", "Gerencie faturas e realize pagamentos com segurança"], ["chat", "Comunicação direta com a equipe DARA Studio"]].map(([ic, tx]) => (
          <div key={ic} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: GD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              <Svg d={I[ic]} s={13} c={G} />
            </div>
            <p style={{ fontSize: 12, color: MU, lineHeight: 1.6 }}>{tx}</p>
          </div>
        ))}
        <div style={{ marginTop: 16, padding: "7px 12px", borderRadius: 7, background: AMB, border: "1px solid rgba(192,124,10,0.3)", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: AM, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: AM, fontWeight: 600 }}>Modo demonstração — dados fictícios</span>
        </div>
      </div>

      {/* Right panel */}
      <div style={{ width: 360, minWidth: 300, background: BG2, borderRadius: 16, border: "1px solid " + BR, padding: 28 }}>
        <div style={{ display: "flex", background: BG3, borderRadius: 8, padding: 3, marginBottom: 22 }}>
          {["in", "up"].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(""); setOk(""); }}
              style={{ flex: 1, padding: 7, fontSize: 13, fontWeight: tab === t ? 600 : 400, background: tab === t ? BG2 : "none", border: "none", borderRadius: 6, color: tab === t ? TX : MU, cursor: "pointer", fontFamily: "inherit" }}>
              {t === "in" ? "Entrar" : "Criar Conta"}
            </button>
          ))}
        </div>
        <p style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, marginBottom: 4 }}>{tab === "in" ? "Bem-vindo de Volta" : "Crie sua Conta"}</p>
        <p style={{ fontSize: 12, color: MU, marginBottom: 16 }}>{tab === "in" ? "Insira suas credenciais para acessar" : "Preencha os dados para criar seu acesso"}</p>
        {ok && <div style={{ padding: "8px 12px", background: GNB, border: "1px solid rgba(45,134,83,0.3)", borderRadius: 7, marginBottom: 12, fontSize: 12, color: GN }}>{ok}</div>}

        {/* Google button */}
        <button onClick={() => setErr("Google OAuth disponível em produção com Supabase.")}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1.5px solid " + BR, borderRadius: 9, padding: 10, background: BG2, fontSize: 13, color: TX, marginBottom: 14, cursor: "pointer", fontFamily: "inherit" }}>
          <svg width={16} height={16} viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Entrar com Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: BR }} />
          <span style={{ fontSize: 11, color: DM }}>OU</span>
          <div style={{ flex: 1, height: 1, background: BR }} />
        </div>

        {tab === "up" && (
          <div style={{ marginBottom: 10 }}>
            <label style={lbl}>Nome Completo</label>
            <input style={inp} value={nm} onChange={e => setNm(e.target.value)} placeholder="Jackson Da Silva" />
          </div>
        )}
        <div style={{ marginBottom: 10 }}>
          <label style={lbl}>E-mail</label>
          <input style={inp} type="email" value={em} onChange={e => setEm(e.target.value)} placeholder="seu@email.com" onKeyDown={k => k.key === "Enter" && go()} />
        </div>
        <div style={{ marginBottom: err ? 8 : 14 }}>
          <label style={lbl}>Senha</label>
          <div style={{ position: "relative" }}>
            <input style={{ ...inp, paddingRight: 38 }} type={show ? "text" : "password"} value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" onKeyDown={k => k.key === "Enter" && go()} />
            <button aria-label={show ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShow(s => !s)}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: DM, padding: 4, background: "none", border: "none", cursor: "pointer" }}>
              <Svg d={show ? I.eyex : I.eye} s={14} c={DM} />
            </button>
          </div>
        </div>
        {err && <p style={{ fontSize: 12, color: RD, marginBottom: 10 }}>{err}</p>}
        {tab === "in" && (
          <div style={{ textAlign: "right", marginBottom: 10 }}>
            <button onClick={() => setOk("Link de recuperação enviado (demo).")} style={{ background: "none", border: "none", fontSize: 12, color: G, cursor: "pointer", fontFamily: "inherit" }}>Esqueceu sua senha?</button>
          </div>
        )}
        <button onClick={go} disabled={busy}
          style={{ width: "100%", background: busy ? GD : G, borderRadius: 9, padding: 11, fontSize: 14, fontWeight: 700, color: busy ? G : "#fff", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
          {busy ? "Aguarde..." : tab === "in" ? "Entrar" : "Criar Conta"}
        </button>
        <p style={{ textAlign: "center", fontSize: 11, color: DM, marginTop: 12 }}>Demo: joao@darastudio.com / teste123</p>
      </div>
    </div>
  );
};

// ── Project Detail ────────────────────────────────────────────────────────────
const ProjectDetail = ({ proj, onBack }) => {
  const [tab, setTab] = useState("overview");
  const [msgs, setMsgs] = useState([
    { id: 1, from: "admin", name: "Daniela", text: "A planta v3 foi enviada para aprovação. Alguma dúvida?", time: "10/03 14:30" },
    { id: 2, from: "client", name: "João", text: "Recebi! Vou revisar hoje à noite.", time: "10/03 16:12" },
    { id: 3, from: "admin", name: "Daniela", text: "Perfeito. Qualquer ajuste, abra um ticket.", time: "10/03 16:45" },
  ]);
  const [cmsg, setCmsg] = useState("");
  const [updates, setUpdates] = useState([
    { id: 1, date: "14/03/2026", auth: "João (cliente)", text: "Fundação concluída, iniciando estrutura metálica." },
    { id: 2, date: "08/03/2026", auth: "João (cliente)", text: "Terreno preparado e nivelado. Aprovado pela prefeitura." },
  ]);
  const [utxt, setUtxt] = useState("");
  const [tkts, setTkts] = useState([]);
  const [tdesc, setTdesc] = useState("");
  const [qApproved, setQApproved] = useState(false);
  const [proofs, setProofs] = useState({});
  const cref = useRef(null);
  useEffect(() => { if (cref.current) cref.current.scrollTop = 9999; }, [msgs]);

  const sendMsg = () => { if (!cmsg.trim()) return; setMsgs(m => [...m, { id: Date.now(), from: "client", name: "João", text: cmsg.trim(), time: "agora" }]); setCmsg(""); };
  const postUpdate = () => { if (!utxt.trim()) return; setUpdates(u => [{ id: Date.now(), date: new Date().toLocaleDateString("pt-BR"), auth: "João (cliente)", text: utxt.trim() }, ...u]); setUtxt(""); };
  const openTicket = () => { if (!tdesc.trim()) return; setTkts(t => [{ id: "TKT-" + (t.length + 1).toString().padStart(3, "0"), desc: tdesc.trim(), date: new Date().toLocaleDateString("pt-BR"), status: "Aberto" }, ...t]); setTdesc(""); };

  const tabs = [{ id: "overview", l: "Overview" }, { id: "finance", l: "Finance" }, { id: "chat", l: "Chat" }, { id: "updates", l: "Site Updates" }, { id: "tickets", l: "Tickets" }];
  const bgt = proj.budget;
  const phases = [
    { id: "p1", l: "Conceptual Design Development", pct: 30, amt: Math.round(bgt * .3), due: "15/04/2026" },
    { id: "p2", l: "Drafting & Design Coordination", pct: 40, amt: Math.round(bgt * .4), due: "30/06/2026" },
    { id: "p3", l: "Permit Drawing Preparation", pct: 30, amt: Math.round(bgt * .3), due: "15/08/2026" },
  ];

  const card = { background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" };
  const inp = { width: "100%", border: "1.5px solid " + BR, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: TX, background: BG, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const ta = { width: "100%", border: "1.5px solid " + BR, borderRadius: 8, padding: "9px 12px", fontSize: 12, color: TX, background: BG3, fontFamily: "inherit", outline: "none", boxSizing: "border-box", resize: "vertical", minHeight: 70 };
  const lbl = { fontSize: 10, fontWeight: 600, color: DM, display: "block", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".05em" };

  return (
    <div style={{ animation: "fu .28s ease both" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, color: MU, fontSize: 12, marginBottom: 14, padding: 0, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
        <Svg d={I.back} s={14} c={MU} /> Voltar para Projetos
      </button>

      {/* Header card */}
      <div style={{ ...card, marginBottom: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 10 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "monospace", fontSize: 10, color: G, fontWeight: 700, background: GD, borderRadius: 4, padding: "2px 8px" }}>{proj.code}</span>
              <Badge s={proj.status} />
            </div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{proj.address}</h2>
            <p style={{ fontSize: 12, color: MU }}>{proj.city} · {proj.service}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: 11, color: DM }}>{proj.stage}</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: G, marginTop: 2 }}>{fmt(proj.budget)}</p>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: DM, marginBottom: 4 }}>
          <span>Etapa: <strong style={{ color: TX }}>{proj.stage}</strong></span>
          <span>{proj.progress}% concluído</span>
        </div>
        <div style={{ background: BG3, borderRadius: 4, height: 6 }}>
          <div style={{ width: proj.progress + "%", height: "100%", borderRadius: 4, background: G, transition: "width .6s ease" }} />
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid " + BR, background: BG2, overflowX: "auto" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: "none", border: "none", padding: "10px 14px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", borderBottom: "2px solid " + (tab === t.id ? G : "transparent"), color: tab === t.id ? G : DM, whiteSpace: "nowrap", transition: "color .15s" }}>
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ paddingTop: 14 }}>
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Svg d={I.usr} s={13} c={G} />
                <span style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700 }}>Informações do Cliente</span>
                <span style={{ fontSize: 9, fontWeight: 600, color: GN, background: GNB, borderRadius: 3, padding: "1px 6px", marginLeft: 4 }}>EDITÁVEL</span>
              </div>
              {["Nome completo", "E-mail", "Telefone"].map((l, i) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <label style={lbl}>{l}</label>
                  <input style={inp} defaultValue={[USER.name, USER.email, USER.phone][i]} />
                </div>
              ))}
              <button style={{ background: G, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}>Salvar Alterações</button>
            </div>
            <div style={card}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                <Svg d={I.bld} s={13} c={G} />
                <span style={{ fontFamily: "Georgia, serif", fontSize: 13, fontWeight: 700 }}>Detalhes Técnicos</span>
                {qApproved
                  ? <span style={{ fontSize: 9, fontWeight: 700, color: RD, background: RDB, borderRadius: 3, padding: "1px 6px", marginLeft: 4 }}>BLOQUEADO</span>
                  : <span style={{ fontSize: 9, fontWeight: 600, color: AM, background: AMB, borderRadius: 3, padding: "1px 6px", marginLeft: 4 }}>EDITÁVEL</span>
                }
                <button onClick={() => setQApproved(q => !q)}
                  style={{ marginLeft: "auto", fontSize: 10, fontWeight: 600, background: qApproved ? GNB : BG3, color: qApproved ? GN : DM, border: "1px solid " + (qApproved ? "rgba(45,134,83,0.3)" : BR), borderRadius: 5, padding: "2px 8px", cursor: "pointer", fontFamily: "inherit" }}>
                  {qApproved ? "Aprovado" : "Simular Aprovação"}
                </button>
              </div>
              {qApproved && <div style={{ padding: "7px 11px", background: RDB, border: "1px solid rgba(184,50,50,0.2)", borderRadius: 7, marginBottom: 10, fontSize: 11, color: RD }}>Detalhes bloqueados — orçamento aprovado. Alterações requerem autorização do Admin.</div>}
              {["Área", "Níveis", "Início", "Arquiteto"].map((k, i) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                  <span style={{ fontSize: 11, color: MU }}>{k}</span>
                  {qApproved
                    ? <span style={{ fontSize: 11, fontWeight: 500, color: DM }}>{["2.000 sqft", "Térreo + 2º Andar", "15/01/2026", "Daniela Araújo"][i]}</span>
                    : <input defaultValue={["2.000 sqft", "Térreo + 2º Andar", "15/01/2026", "Daniela Araújo"][i]} style={{ fontSize: 11, fontWeight: 500, color: TX, background: "none", border: "none", textAlign: "right", outline: "none", fontFamily: "inherit", borderBottom: "1px dashed " + BR, padding: "1px 4px", width: 140 }} />
                  }
                </div>
              ))}
              {!qApproved && <button style={{ background: G, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 10 }}>Salvar Alterações</button>}
            </div>
          </div>
        )}

        {/* FINANCE */}
        {tab === "finance" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
              {[[fmt(bgt), "Total", G], [fmt(proj.paid), "Pago", GN], [fmt(bgt - proj.paid), "Saldo", AM]].map(([v, l, c]) => (
                <div key={l} style={{ ...card, textAlign: "center" }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700, color: c }}>{v}</p>
                  <p style={{ fontSize: 11, color: DM, marginTop: 3 }}>{l}</p>
                </div>
              ))}
            </div>
            {phases.map(ph => (
              <div key={ph.id} style={{ ...card, marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: TX }}>{ph.l}</p>
                    <p style={{ fontSize: 11, color: MU }}>{ph.pct}% — {fmt(ph.amt)}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 10, fontWeight: 600, background: proofs[ph.id] ? GNB : AMB, color: proofs[ph.id] ? GN : AM, borderRadius: 4, padding: "2px 8px" }}>{proofs[ph.id] ? "Comprovante enviado" : "Pendente"}</span>
                    <p style={{ fontSize: 10, color: DM, marginTop: 3 }}>Vencimento: {ph.due}</p>
                  </div>
                </div>
                {!proofs[ph.id] && (
                  <label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: G, border: "none", borderRadius: 8, padding: 8, fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", width: "100%" }}>
                    Anexar Comprovante de Pagamento
                    <input type="file" accept="image/*,.pdf" style={{ display: "none" }} onChange={v => { const f = v.target.files?.[0]; if (f) setProofs(p => ({ ...p, [ph.id]: f.name })); }} />
                  </label>
                )}
                {proofs[ph.id] && <p style={{ fontSize: 11, color: GN, marginTop: 4, textAlign: "center" }}>✓ {proofs[ph.id]} — aguardando confirmação</p>}
              </div>
            ))}
          </div>
        )}

        {/* CHAT */}
        {tab === "chat" && (
          <div style={{ background: BG2, border: "1px solid " + BR, borderRadius: 10, overflow: "hidden", display: "flex", flexDirection: "column", height: 400 }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid " + BR, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: GN, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>Chat com DARA Studio</span>
              <span style={{ fontSize: 11, color: DM, marginLeft: "auto" }}>Online</span>
            </div>
            <div ref={cref} style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {msgs.map(m => (
                <div key={m.id} style={{ display: "flex", flexDirection: m.from === "client" ? "row-reverse" : "row", gap: 8, alignItems: "flex-end" }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: m.from === "admin" ? GD : BG3, border: "1px solid " + BR, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.from === "admin" ? G : MU }}>{m.name[0]}</span>
                  </div>
                  <div style={{ maxWidth: "70%" }}>
                    <div style={{ background: m.from === "client" ? GD : BG3, border: "1px solid " + (m.from === "client" ? GB : BR), borderRadius: m.from === "client" ? "10px 10px 3px 10px" : "10px 10px 10px 3px", padding: "8px 12px" }}>
                      <p style={{ fontSize: 12, color: TX, lineHeight: 1.5 }}>{m.text}</p>
                    </div>
                    <p style={{ fontSize: 10, color: DM, marginTop: 2, textAlign: m.from === "client" ? "right" : "left" }}>{m.name} · {m.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: "1px solid " + BR, padding: "10px 14px", display: "flex", gap: 8 }}>
              <input value={cmsg} onChange={e => setCmsg(e.target.value)} onKeyDown={k => k.key === "Enter" && sendMsg()} placeholder="Escreva uma mensagem..."
                style={{ flex: 1, background: BG3, border: "1px solid " + BR, borderRadius: 8, padding: "8px 12px", fontSize: 12, color: TX, fontFamily: "inherit", outline: "none" }} />
              <button onClick={sendMsg} style={{ background: G, border: "none", borderRadius: 8, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                <Svg d={I.send} s={13} c="#fff" />
              </button>
            </div>
          </div>
        )}

        {/* UPDATES */}
        {tab === "updates" && (
          <div>
            <div style={{ ...card, marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: TX, marginBottom: 8 }}>Nova Atualização de Obra</p>
              <textarea style={ta} value={utxt} onChange={e => setUtxt(e.target.value)} placeholder="Descreva o progresso da obra..." />
              <button onClick={postUpdate} style={{ background: G, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>Publicar Atualização</button>
            </div>
            {updates.map(u => (
              <div key={u.id} style={{ ...card, marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: G, fontWeight: 600 }}>{u.auth}</span>
                  <span style={{ fontSize: 10, color: DM }}>{u.date}</span>
                </div>
                <p style={{ fontSize: 12, color: TX, lineHeight: 1.6 }}>{u.text}</p>
              </div>
            ))}
          </div>
        )}

        {/* TICKETS */}
        {tab === "tickets" && (
          <div>
            <div style={{ ...card, marginBottom: 14 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: TX, marginBottom: 8 }}>Abrir Ticket de Revisão</p>
              <textarea style={ta} value={tdesc} onChange={e => setTdesc(e.target.value)} placeholder="Descreva a revisão solicitada..." />
              <button onClick={openTicket} style={{ background: G, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>Abrir Ticket</button>
            </div>
            {tkts.length === 0 && <div style={{ textAlign: "center", padding: "32px 0", color: DM }}><p style={{ fontSize: 28, marginBottom: 8 }}>🎫</p><p style={{ fontSize: 13 }}>Nenhum ticket aberto ainda.</p></div>}
            {tkts.map(t => (
              <div key={t.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontFamily: "monospace", fontSize: 11, color: G, fontWeight: 700 }}>{t.id}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, background: AMB, color: AM, borderRadius: 3, padding: "1px 6px" }}>{t.status}</span>
                  </div>
                  <p style={{ fontSize: 12, color: TX }}>{t.desc}</p>
                </div>
                <span style={{ fontSize: 10, color: DM, flexShrink: 0 }}>{t.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Dashboard ─────────────────────────────────────────────────────────────────
const Dashboard = ({ user, projects, invoices, activity, onNav, onOpen }) => {
  const active = projects.filter(p => p.status !== "completed").length;
  const pend = invoices.filter(i => i.status === "pending");
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const card = { background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" };

  return (
    <div style={{ animation: "fu .28s ease both" }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 21, fontWeight: 700, marginBottom: 3 }}>Bem-vindo, {user.name.split(" ")[0]}</h1>
        <p style={{ fontSize: 12, color: MU }}>Resumo dos seus projetos em andamento</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 20 }}>
        {[[active, "Projetos Ativos", G, "folder", "projects"], [pend.length, "Faturas Pendentes", AM, "rcpt", "invoices"], [fmt(paid), "Total Pago", GN, "trend", "invoices"]].map(([v, l, c, ic, pg]) => (
          <button key={l} onClick={() => onNav(pg)}
            style={{ ...card, textAlign: "left", cursor: "pointer", transition: "border-color .15s", width: "100%", background: BG2, fontFamily: "inherit" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = c}
            onMouseLeave={e => e.currentTarget.style.borderColor = BR}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Svg d={I[ic]} s={14} c={c} />
              <span style={{ fontSize: 11, color: MU }}>{l}</span>
            </div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: c }}>{v}</p>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700 }}>Projetos Recentes</h2>
            <button onClick={() => onNav("projects")} style={{ background: "none", border: "none", fontSize: 12, color: G, cursor: "pointer", fontFamily: "inherit" }}>Ver todos →</button>
          </div>
          {projects.slice(0, 2).map(p => (
            <div key={p.id} style={{ ...card, marginBottom: 8, cursor: "pointer", transition: "border-color .15s" }}
              onClick={() => onOpen(p)}
              onMouseEnter={e => e.currentTarget.style.borderColor = G}
              onMouseLeave={e => e.currentTarget.style.borderColor = BR}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, flexWrap: "wrap", gap: 6 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: TX }}>{p.address}</p>
                  <p style={{ fontSize: 11, color: MU, marginTop: 1 }}>{p.service}</p>
                </div>
                <Badge s={p.status} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: DM, marginBottom: 4 }}>
                <span>{p.stage}</span><span>{p.progress}%</span>
              </div>
              <div style={{ background: BG3, borderRadius: 3, height: 4 }}>
                <div style={{ width: p.progress + "%", height: "100%", borderRadius: 3, background: G }} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Atividade Recente</h2>
          {activity.map(a => (
            <div key={a.id} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ width: 26, height: 26, borderRadius: 7, background: GD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 12, color: G, fontWeight: 700 }}>{a.ico}</div>
              <div>
                <p style={{ fontSize: 12, color: TX, lineHeight: 1.4 }}>{a.text}</p>
                <p style={{ fontSize: 10, color: DM, marginTop: 1 }}>{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Projects ──────────────────────────────────────────────────────────────────
const Projects = ({ projects, onOpen }) => {
  const [f, setF] = useState("active");
  const list = projects.filter(p => f === "all" ? true : f === "active" ? p.status !== "completed" : p.status === "completed");
  const card = { background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" };

  return (
    <div style={{ animation: "fu .28s ease both" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Meus Projetos</h1>
          <p style={{ fontSize: 12, color: MU }}>{projects.length} projeto(s)</p>
        </div>
        <div style={{ display: "flex", background: BG3, borderRadius: 8, padding: 3 }}>
          {[["active", "Ativos"], ["completed", "Concluídos"], ["all", "Todos"]].map(([id, l]) => (
            <button key={id} onClick={() => setF(id)}
              style={{ padding: "6px 12px", fontSize: 11, fontWeight: f === id ? 600 : 400, background: f === id ? BG2 : "none", borderRadius: 6, color: f === id ? TX : MU, border: "none", cursor: "pointer", fontFamily: "inherit" }}>
              {l}
            </button>
          ))}
        </div>
      </div>
      {list.length === 0 && <div style={{ textAlign: "center", padding: "48px 0", color: DM }}><p style={{ fontSize: 24, marginBottom: 8 }}>📁</p><p style={{ fontSize: 14 }}>Nenhum projeto nesta categoria</p></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 12 }}>
        {list.map(p => (
          <div key={p.id} style={{ ...card, cursor: "pointer", transition: "border-color .15s" }}
            onClick={() => onOpen(p)}
            onMouseEnter={e => e.currentTarget.style.borderColor = G}
            onMouseLeave={e => e.currentTarget.style.borderColor = BR}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, flexWrap: "wrap", gap: 6 }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: G, fontWeight: 700, marginBottom: 3 }}>{p.code}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: TX }}>{p.address}</p>
                <p style={{ fontSize: 11, color: MU, marginTop: 2 }}>{p.city}</p>
              </div>
              <Badge s={p.status} />
            </div>
            <p style={{ fontSize: 11, color: MU, marginBottom: 10, lineHeight: 1.4 }}>{p.service}</p>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: DM, marginBottom: 4 }}>
              <span>{p.stage}</span><span>{p.progress}%</span>
            </div>
            <div style={{ background: BG3, borderRadius: 3, height: 4, marginBottom: 10 }}>
              <div style={{ width: p.progress + "%", height: "100%", borderRadius: 3, background: p.status === "completed" ? GN : G }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>{fmt(p.budget)}</span>
              <span style={{ fontSize: 10, color: DM }}>{p.updatedAt}</span>
            </div>
            {p.pending && <div style={{ marginTop: 8, padding: "4px 9px", background: AMB, borderRadius: 4, fontSize: 10, color: AM, fontWeight: 500 }}>{p.pending}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Faturas ───────────────────────────────────────────────────────────────────
const Faturas = ({ invoices }) => {
  const paid = invoices.filter(i => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const pend = invoices.filter(i => i.status === "pending").reduce((s, i) => s + i.amount, 0);
  const card = { background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" };

  return (
    <div style={{ animation: "fu .28s ease both" }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Faturas</h1>
      <p style={{ fontSize: 12, color: MU, marginBottom: 18 }}>Histórico de pagamentos e saldos</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12, marginBottom: 18 }}>
        {[[fmt(paid), "Total Pago", GN], [fmt(pend), "Saldo Pendente", AM]].map(([v, l, c]) => (
          <div key={l} style={{ ...card, textAlign: "center" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: c }}>{v}</p>
            <p style={{ fontSize: 11, color: DM, marginTop: 3 }}>{l}</p>
          </div>
        ))}
      </div>
      {invoices.map(inv => (
        <div key={inv.id} style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: G }}>{inv.id}</p>
            <p style={{ fontSize: 12, color: TX, marginTop: 2 }}>{inv.project}</p>
            <p style={{ fontSize: 11, color: DM, marginTop: 1 }}>Vencimento: {inv.due}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 700, color: TX }}>{fmt(inv.amount)}</p>
            <span style={{ fontSize: 10, fontWeight: 600, background: inv.status === "paid" ? GNB : AMB, color: inv.status === "paid" ? GN : AM, borderRadius: 4, padding: "2px 8px" }}>
              {inv.status === "paid" ? "Pago" : "Pendente"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Perfil ────────────────────────────────────────────────────────────────────
const Perfil = ({ user }) => {
  const card = { background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" };
  const inp = { width: "100%", border: "1.5px solid " + BR, borderRadius: 8, padding: "9px 12px", fontSize: 13, color: TX, background: BG, fontFamily: "inherit", outline: "none", boxSizing: "border-box" };
  const lbl = { fontSize: 11, fontWeight: 600, color: DM, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" };

  return (
    <div style={{ animation: "fu .28s ease both", maxWidth: 480 }}>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Meu Perfil</h1>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18, paddingBottom: 16, borderBottom: "1px solid " + BR }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: GD, border: "2px solid " + G, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, color: G, flexShrink: 0 }}>{user.initials}</div>
          <div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 700 }}>{user.name}</p>
            <p style={{ fontSize: 12, color: MU }}>{user.company}</p>
          </div>
        </div>
        {["Nome Completo", "E-mail", "Telefone"].map((l, i) => (
          <div key={l} style={{ marginBottom: 12 }}>
            <label style={lbl}>{l}</label>
            <input style={inp} defaultValue={[user.name, user.email, user.phone][i]} />
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
          <button style={{ background: G, border: "none", borderRadius: 8, padding: "8px 18px", fontSize: 12, fontWeight: 700, color: "#fff", cursor: "pointer", fontFamily: "inherit" }}>Salvar Alterações</button>
        </div>
      </div>
    </div>
  );
};

// ── Layout ────────────────────────────────────────────────────────────────────
const Layout = ({ user, onLogout }) => {
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(true);
  const [proj, setProj] = useState(null);
  const [notif, setNotif] = useState(true);
  const [showN, setShowN] = useState(false);
  const pend = INVOICES.filter(i => i.status === "pending").length;
  const nav = [{ id: "dashboard", ico: "home", l: "Dashboard" }, { id: "projects", ico: "folder", l: "Meus Projetos" }, { id: "invoices", ico: "rcpt", l: "Faturas", b: pend }, { id: "messages", ico: "chat", l: "Mensagens", b: 1 }];
  const bot = [{ id: "profile", ico: "usr", l: "Perfil" }, { id: "company", ico: "bld", l: "Empresa" }];
  const go = p => { setProj(null); setPage(p); };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: BG }}>
      {/* Sidebar */}
      <aside style={{ width: open ? 200 : 52, background: SB, flexShrink: 0, display: "flex", flexDirection: "column", transition: "width .2s ease", overflow: "hidden", position: "sticky", top: 0, height: "100vh" }}>
        <div style={{ padding: open ? "14px 12px 10px" : "14px 0 10px", display: "flex", alignItems: "center", justifyContent: open ? "space-between" : "center", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 6 }}>
          {open && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, background: G, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 13, color: "#fff", flexShrink: 0 }}>D</div>
              <div>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>DARA Studio</p>
                <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>Portal do Cliente</p>
              </div>
            </div>
          )}
          <button onClick={() => setOpen(o => !o)} style={{ color: "rgba(255,255,255,0.4)", padding: 4, flexShrink: 0, background: "none", border: "none", cursor: "pointer" }}>
            <Svg d={I.menu} s={14} c="rgba(255,255,255,0.4)" />
          </button>
        </div>
        <nav style={{ flex: 1, padding: "4px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {nav.map(n => <NavItem key={n.id} ico={n.ico} label={n.l} active={page === n.id || (page === "detail" && n.id === "projects")} badge={n.b || 0} collapsed={!open} onClick={() => go(n.id)} />)}
        </nav>
        <div style={{ padding: "4px 8px 12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {bot.map(n => <NavItem key={n.id} ico={n.ico} label={n.l} active={page === n.id} badge={0} collapsed={!open} onClick={() => go(n.id)} />)}
          <NavItem ico="out" label="Sair" active={false} badge={0} collapsed={!open} onClick={onLogout} />
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: "auto", minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <div style={{ background: BG2, borderBottom: "1px solid " + BR, padding: "0 20px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 40 }}>
          <div>
            <span style={{ fontSize: 12, color: G, fontWeight: 600, letterSpacing: ".08em" }}>DARA Studio</span>
            <span style={{ fontSize: 12, color: DM, margin: "0 6px" }}>|</span>
            <span style={{ fontSize: 12, color: MU }}>Drafting & 3D Support</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ position: "relative" }}>
              <button onClick={() => { setShowN(o => !o); setNotif(false); }} style={{ color: MU, padding: 4, position: "relative", background: "none", border: "none", cursor: "pointer" }}>
                <Svg d={I.bell} s={16} c={MU} />
                {notif && <span style={{ position: "absolute", top: 2, right: 2, width: 6, height: 6, borderRadius: "50%", background: G }} />}
              </button>
              {showN && (
                <>
                  <div onClick={() => setShowN(false)} style={{ position: "fixed", inset: 0, zIndex: 49 }} />
                  <div style={{ position: "absolute", right: 0, top: 36, width: 260, background: BG2, border: "1px solid " + BR, borderRadius: 10, zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", overflow: "hidden" }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid " + BR, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: TX }}>Notificações</span>
                      <button onClick={() => setShowN(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><Svg d={I.x} s={13} c={DM} /></button>
                    </div>
                    {ACTIVITY.map(a => (
                      <div key={a.id} style={{ padding: "9px 14px", borderBottom: "1px solid rgba(0,0,0,0.04)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: GD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 11, color: G, fontWeight: 700 }}>{a.ico}</div>
                        <div>
                          <p style={{ fontSize: 11, color: TX, lineHeight: 1.4 }}>{a.text}</p>
                          <p style={{ fontSize: 10, color: DM, marginTop: 1 }}>{a.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div onClick={() => go("profile")} style={{ width: 30, height: 30, borderRadius: "50%", background: GD, border: "2px solid " + G, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Georgia, serif", fontSize: 11, fontWeight: 700, color: G, cursor: "pointer" }}>
              {user.initials}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "20px 20px 60px", flex: 1 }}>
          {page === "dashboard" && <Dashboard user={user} projects={PROJECTS} invoices={INVOICES} activity={ACTIVITY} onNav={go} onOpen={p => { setProj(p); setPage("detail"); }} />}
          {page === "projects" && <Projects projects={PROJECTS} onOpen={p => { setProj(p); setPage("detail"); }} />}
          {page === "detail" && proj && <ProjectDetail proj={proj} onBack={() => { setProj(null); setPage("projects"); }} />}
          {page === "invoices" && <Faturas invoices={INVOICES} />}
          {page === "messages" && <div style={{ animation: "fu .28s ease both", textAlign: "center", padding: "60px 0", color: DM }}><p style={{ fontSize: 32, marginBottom: 10 }}>💬</p><p style={{ fontSize: 14, color: TX, marginBottom: 4, fontWeight: 600 }}>Mensagens Gerais</p><p style={{ fontSize: 12 }}>Use o Chat dentro de cada projeto para comunicação direta.</p></div>}
          {page === "profile" && <Perfil user={user} />}
          {page === "company" && <div style={{ animation: "fu .28s ease both", maxWidth: 480 }}><h1 style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 700, marginBottom: 18 }}>Minha Empresa</h1><div style={{ background: BG2, border: "1px solid " + BR, borderRadius: 10, padding: "14px 18px" }}><p style={{ fontSize: 12, color: MU, marginBottom: 4 }}>Empresa registrada:</p><p style={{ fontSize: 14, fontWeight: 700, color: TX }}>{user.company}</p></div></div>}
        </div>
      </main>

      <style>{`@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
};

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  return user ? <Layout user={user} onLogout={() => setUser(null)} /> : <Login onLogin={setUser} />;
}
