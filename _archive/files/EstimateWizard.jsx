import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

/* ─────────────────────────────────────────────────────────────
   DESIGN SYSTEM TOKENS  (Instrument Serif + DM Mono)
───────────────────────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg0:    #090910;
    --bg1:    #0f0f1a;
    --bg2:    #14141f;
    --bg3:    #1a1a28;
    --bg4:    #20203200;
    --border: rgba(255,255,255,.08);
    --border2:rgba(255,255,255,.14);
    --a:      #6366f1;
    --a-dim:  rgba(99,102,241,.18);
    --a-glow: rgba(99,102,241,.35);
    --tx:     #f0eff8;
    --mu:     #9896b8;
    --dm:     #5c5a7a;
    --gn:     #10b981;
    --am:     #f59e0b;
    --rd:     #ef4444;
    --font-serif: 'Instrument Serif', Georgia, serif;
    --font-mono:  'DM Mono', monospace;
    --font-sans:  'DM Sans', system-ui, sans-serif;
    --r:      14px;
    --r-sm:   8px;
    --shadow: 0 24px 64px rgba(0,0,0,.6);
  }

  body { background: var(--bg0); font-family: var(--font-sans); color: var(--tx); }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px }
  ::-webkit-scrollbar-track { background: transparent }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px }

  /* ── Inputs ── */
  .wz-inp {
    width: 100%; padding: 11px 14px;
    background: var(--bg3); border: 1.5px solid var(--border);
    border-radius: var(--r-sm); color: var(--tx);
    font-family: var(--font-sans); font-size: 13px;
    outline: none; transition: border-color .18s, box-shadow .18s;
  }
  .wz-inp::placeholder { color: var(--dm) }
  .wz-inp:focus { border-color: var(--a); box-shadow: 0 0 0 3px var(--a-dim) }

  .wz-label {
    display: block; font-size: 10px; font-weight: 700;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--mu); margin-bottom: 6px;
  }

  /* ── Clickable card ── */
  .wz-card {
    padding: 16px 20px;
    background: var(--bg3); border: 1.5px solid var(--border);
    border-radius: var(--r); cursor: pointer;
    transition: all .2s; user-select: none;
  }
  .wz-card:hover { border-color: var(--border2); background: var(--bg2) }
  .wz-card.active {
    border-color: var(--a); background: var(--a-dim);
    box-shadow: 0 0 0 1px var(--a), 0 0 20px var(--a-glow);
  }

  /* ── Big toggle cards ── */
  .wz-toggle {
    flex: 1; padding: 28px 24px;
    background: var(--bg3); border: 2px solid var(--border);
    border-radius: var(--r); cursor: pointer;
    transition: all .22s; text-align: center; user-select: none;
  }
  .wz-toggle:hover { border-color: var(--border2); transform: translateY(-2px) }
  .wz-toggle.active {
    border-color: var(--a); background: var(--a-dim);
    box-shadow: 0 0 0 1px var(--a), 0 0 32px var(--a-glow);
    transform: translateY(-3px);
  }

  /* ── Counter ── */
  .wz-counter {
    display: flex; align-items: center; gap: 0;
    background: var(--bg3); border: 1.5px solid var(--border);
    border-radius: var(--r-sm); overflow: hidden;
  }
  .wz-counter-btn {
    width: 36px; height: 36px; border: none;
    background: transparent; color: var(--mu);
    font-size: 18px; cursor: pointer;
    transition: all .15s; display: flex; align-items: center; justify-content: center;
  }
  .wz-counter-btn:hover { background: var(--bg2); color: var(--tx) }
  .wz-counter-val {
    min-width: 42px; text-align: center;
    font-family: var(--font-mono); font-size: 14px; font-weight: 500;
    color: var(--tx); border-left: 1px solid var(--border);
    border-right: 1px solid var(--border); padding: 0 8px;
  }

  /* ── Stepper ── */
  .wz-stepper {
    display: flex; align-items: center; gap: 0;
    padding: 0 4px;
  }
  .wz-step-dot {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 600; font-family: var(--font-mono);
    transition: all .25s; flex-shrink: 0; position: relative; z-index: 1;
  }
  .wz-step-dot.done { background: var(--a); color: #fff }
  .wz-step-dot.active { background: var(--a); color: #fff; box-shadow: 0 0 0 4px var(--a-dim), 0 0 16px var(--a-glow) }
  .wz-step-dot.future { background: var(--bg3); border: 1.5px solid var(--border); color: var(--dm) }
  .wz-step-line {
    flex: 1; height: 2px;
    background: var(--border); position: relative; overflow: hidden;
  }
  .wz-step-line-fill {
    position: absolute; left: 0; top: 0; bottom: 0;
    background: var(--a); transition: width .4s cubic-bezier(.4,0,.2,1);
  }

  /* ── Buttons ── */
  .wz-btn-primary {
    padding: 12px 28px; border-radius: var(--r-sm);
    background: var(--a); border: none; color: #fff;
    font-family: var(--font-sans); font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all .18s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .wz-btn-primary:hover { background: #4f46e5; transform: translateY(-1px); box-shadow: 0 8px 24px var(--a-glow) }
  .wz-btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; box-shadow: none }
  .wz-btn-ghost {
    padding: 12px 28px; border-radius: var(--r-sm);
    background: transparent; border: 1.5px solid var(--border2); color: var(--mu);
    font-family: var(--font-sans); font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all .18s;
  }
  .wz-btn-ghost:hover { border-color: var(--a); color: var(--tx) }

  /* ── Map placeholder ── */
  .wz-map {
    width: 100%; height: 180px; border-radius: var(--r);
    border: 1.5px solid var(--border); background: var(--bg3);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden;
  }
  .wz-map::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 40% 40%, rgba(99,102,241,.12) 0%, transparent 65%);
  }

  /* ── Drop zone ── */
  .wz-drop {
    border: 2px dashed var(--border2); border-radius: var(--r);
    padding: 48px 24px; text-align: center; cursor: pointer;
    transition: all .2s; background: var(--bg3);
  }
  .wz-drop:hover, .wz-drop.dragging {
    border-color: var(--a); background: var(--a-dim);
    box-shadow: 0 0 0 1px var(--a);
  }

  /* ── Sidebar estimate ── */
  .wz-sidebar {
    position: sticky; top: 24px;
    background: var(--bg2); border: 1.5px solid var(--border);
    border-radius: var(--r); padding: 22px; display: flex; flex-direction: column; gap: 20px;
  }

  /* ── Confidence bar ── */
  .wz-conf-track {
    height: 6px; background: var(--bg3); border-radius: 3px; overflow: hidden;
  }
  .wz-conf-fill {
    height: 100%; border-radius: 3px;
    background: linear-gradient(90deg, var(--a) 0%, #818cf8 100%);
    transition: width .6s cubic-bezier(.22,.68,0,1.15);
  }

  /* ── Section fade-in ── */
  @keyframes wz-in {
    from { opacity: 0; transform: translateY(12px) }
    to   { opacity: 1; transform: translateY(0) }
  }
  .wz-animate { animation: wz-in .3s ease both }

  /* ── Textarea ── */
  .wz-textarea {
    width: 100%; min-height: 100px; padding: 12px 14px; resize: vertical;
    background: var(--bg3); border: 1.5px solid var(--border);
    border-radius: var(--r-sm); color: var(--tx);
    font-family: var(--font-sans); font-size: 13px; line-height: 1.6;
    outline: none; transition: border-color .18s;
  }
  .wz-textarea:focus { border-color: var(--a); box-shadow: 0 0 0 3px var(--a-dim) }

  /* ── Review section ── */
  .wz-review-row {
    display: flex; justify-content: space-between; align-items: baseline;
    padding: 9px 0; border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .wz-review-row:last-child { border-bottom: none }
`;

/* ─────────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────────── */
const STEPS = [
  "Location", "About You", "Project", "Scope", "Services",
  "Program", "Files", "Rush", "Review"
];

const ROLES = [
  { id: "homeowner",  label: "Homeowner",       icon: "🏠" },
  { id: "builder",    label: "Builder",          icon: "🔨" },
  { id: "architect",  label: "Architect",        icon: "📐" },
  { id: "developer",  label: "Developer",        icon: "🏗️" },
  { id: "investor",   label: "Investor",         icon: "💼" },
  { id: "agent",      label: "Real Estate Agent",icon: "🤝" },
];

const STATUSES = [
  { id: "vacant",      label: "Vacant Lot",          icon: "🌿" },
  { id: "construction",label: "Under Construction",   icon: "🔧" },
  { id: "occupied",    label: "Occupied",             icon: "🏡" },
];

const ROOM_GROUPS = [
  {
    label: "Core Rooms",
    items: [
      { id: "bedrooms",     label: "Bedrooms"    },
      { id: "bathrooms",    label: "Bathrooms"   },
      { id: "halfBaths",    label: "Half Baths"  },
      { id: "livingRooms",  label: "Living Rooms"},
      { id: "familyRoom",   label: "Family Room" },
      { id: "diningRoom",   label: "Dining Room" },
    ],
  },
  {
    label: "Kitchen & Utility",
    items: [
      { id: "kitchen",      label: "Kitchen"         },
      { id: "pantry",       label: "Pantry"          },
      { id: "closet",       label: "Walk-in Closet"  },
      { id: "laundry",      label: "Laundry"         },
      { id: "garageBays",   label: "Garage Bays"     },
    ],
  },
  {
    label: "Outdoor & Special",
    items: [
      { id: "deck",         label: "Covered Deck"    },
      { id: "porch",        label: "Screened Porch"  },
      { id: "office",       label: "Home Office"     },
      { id: "gym",          label: "Gym"             },
      { id: "fireplace",    label: "Fireplace"       },
      { id: "wineCellar",   label: "Wine Cellar"     },
      { id: "elevator",     label: "Elevator"        },
    ],
  },
];

const ROOM_DEFAULTS = {
  bedrooms: 3, bathrooms: 2, halfBaths: 0, livingRooms: 1,
  familyRoom: 0, diningRoom: 1, kitchen: 1, pantry: 0,
  closet: 1, laundry: 1, garageBays: 1, deck: 0, porch: 0,
  office: 0, gym: 0, fireplace: 0, wineCellar: 0, elevator: 0,
};

/* ─────────────────────────────────────────────────────────────
   PRICING ENGINE (simplified)
───────────────────────────────────────────────────────────── */
function calcEstimate(data) {
  const isUS = data.region === "US";
  const unit = isUS ? 1 : 10.764; // m² to sqft conversion
  const w = parseFloat(data.width) || 0;
  const l = parseFloat(data.length) || 0;
  const baseArea = w * l * unit;

  const baseRate = isUS ? 4.5 : 48; // per sqft in USD / per m² in BRL
  let lo = baseArea * baseRate;
  let hi = lo * 1.22;

  // levels
  if (data.levels?.second)  { lo += baseArea * 4.5;  hi += baseArea * 5.5; }
  if (data.levels?.basement){ lo += baseArea * 0.80;  hi += baseArea * 0.90; }
  if (data.levels?.attic)   { lo += baseArea * 0.60;  hi += baseArea * 0.72; }

  // rush
  if (data.rush === "express") { lo *= 1.60; hi *= 1.60; }

  const confidence = Math.min(
    20 + (data.region ? 10 : 0) + (baseArea > 0 ? 20 : 0) +
    (data.role ? 10 : 0) + (data.status ? 10 : 0) +
    (data.rooms?.bedrooms ? 10 : 0) + (data.rush ? 10 : 0),
    100
  );

  const symbol = isUS ? "$" : "R$";
  const fmt = (n) =>
    symbol + Math.round(n).toLocaleString(isUS ? "en-US" : "pt-BR");

  const breakdown = [];
  if (baseArea > 0) {
    breakdown.push({ label: `Base Area (${Math.round(baseArea)} ${isUS?"sqft":"m²"})`, val: fmt(baseArea * baseRate) });
  }
  if (data.levels?.second)   breakdown.push({ label: "2nd Floor",  val: `+${fmt(baseArea*4.5)}` });
  if (data.levels?.basement) breakdown.push({ label: "Basement",   val: `+${fmt(baseArea*0.80)}` });
  if (data.levels?.attic)    breakdown.push({ label: "Attic",      val: `+${fmt(baseArea*0.60)}` });
  if (data.rush==="express") breakdown.push({ label: "Rush Express (60%)", val: `×1.60` });

  return { lo: fmt(lo), hi: fmt(hi), confidence, breakdown };
}

/* ─────────────────────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────────────────────── */
function Stepper({ current }) {
  return (
    <div className="wz-stepper" style={{ width: "100%" }}>
      {STEPS.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "future";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "none" }}>
            <div
              className={`wz-step-dot ${state}`}
              title={label}
              style={{ cursor: "default" }}
            >
              {state === "done" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : i + 1}
            </div>
            {i < STEPS.length - 1 && (
              <div className="wz-step-line">
                <div className="wz-step-line-fill" style={{ width: state === "done" ? "100%" : "0%" }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Sidebar({ estimate }) {
  const { lo, hi, confidence, breakdown } = estimate;
  const gradColor = confidence < 40 ? "#ef4444" : confidence < 70 ? "#f59e0b" : "#10b981";
  return (
    <div className="wz-sidebar">
      {/* Confidence */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)" }}>
            Estimate Confidence
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: gradColor, fontWeight: 500 }}>
            {confidence}%
          </span>
        </div>
        <div className="wz-conf-track">
          <div className="wz-conf-fill" style={{ width: `${confidence}%`, background: `linear-gradient(90deg, ${gradColor} 0%, ${gradColor}99 100%)` }} />
        </div>
        <p style={{ fontSize: 10, color: "var(--dm)", marginTop: 6 }}>
          {confidence < 40 ? "Add more details to improve accuracy" :
           confidence < 70 ? "Getting closer — keep going" :
           "High confidence estimate"}
        </p>
      </div>

      {/* Live Estimate */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 10 }}>
          Live Estimate
        </p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--tx)", fontStyle: "italic" }}>{lo}</span>
          <span style={{ color: "var(--dm)", fontSize: 12 }}>—</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--mu)" }}>{hi}</span>
        </div>
        <p style={{ fontSize: 10, color: "var(--dm)", marginTop: 4 }}>
          Final quote after review call
        </p>
      </div>

      {/* Breakdown */}
      {breakdown.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 10 }}>
            Cost Breakdown
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {breakdown.map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: "var(--mu)" }}>{item.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--tx)", fontWeight: 500 }}>{item.val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust badge */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(99,102,241,.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "var(--tx)" }}>No commitment required</p>
            <p style={{ fontSize: 10, color: "var(--dm)" }}>Free estimate · reviewed by DARA</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Counter({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="wz-counter">
      <button className="wz-counter-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <div className="wz-counter-val">{value}</div>
      <button className="wz-counter-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

function SectionTitle({ label, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, fontStyle: "italic", color: "var(--tx)", marginBottom: 6 }}>
        {label}
      </h2>
      {sub && <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

function FieldGroup({ children, style }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>{children}</div>;
}

/* ─────────────────────────────────────────────────────────────
   STEP COMPONENTS
───────────────────────────────────────────────────────────── */
function Step1({ data, update }) {
  const [query, setQuery] = useState("");
  const suggestions = ["Massachusetts", "California", "New York", "Texas", "Florida",
    "São Paulo", "Rio de Janeiro", "Minas Gerais"].filter(s =>
    query.length > 1 && s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="wz-animate">
      <SectionTitle
        label="Where is your project located?"
        sub="This helps us apply the right codes, rates, and regulations."
      />

      {/* Region Toggle */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[
          { id: "US", flag: "🇺🇸", title: "US", sub: "USD · sqft" },
          { id: "BR", flag: "🇧🇷", title: "BR", sub: "BRL · m²" },
        ].map(opt => (
          <div
            key={opt.id}
            className={`wz-toggle ${data.region === opt.id ? "active" : ""}`}
            onClick={() => update("region", opt.id)}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>{opt.flag}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--tx)" }}>{opt.title}</div>
            <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>{opt.sub}</div>
          </div>
        ))}
      </div>

      {/* Address inputs */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <FieldGroup>
          <label className="wz-label">Street Address</label>
          <input className="wz-inp" placeholder="123 Main Street" value={data.street || ""} onChange={e => update("street", e.target.value)} />
        </FieldGroup>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FieldGroup>
            <label className="wz-label">City</label>
            <input className="wz-inp" placeholder="Boston" value={data.city || ""} onChange={e => update("city", e.target.value)} />
          </FieldGroup>
          <FieldGroup style={{ position: "relative" }}>
            <label className="wz-label">{data.region === "BR" ? "State (UF)" : "State"}</label>
            <input className="wz-inp" placeholder={data.region === "BR" ? "São Paulo" : "Massachusetts"}
              value={query || data.state || ""}
              onChange={e => { setQuery(e.target.value); update("state", e.target.value) }}
            />
            {suggestions.length > 0 && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg2)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", zIndex: 10, marginTop: 2, overflow: "hidden" }}>
                {suggestions.map(s => (
                  <div key={s} onClick={() => { update("state", s); setQuery(""); }}
                    style={{ padding: "9px 14px", fontSize: 13, cursor: "pointer", color: "var(--mu)", transition: "background .12s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg3)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >{s}</div>
                ))}
              </div>
            )}
          </FieldGroup>
        </div>
        <FieldGroup>
          <label className="wz-label">{data.region === "BR" ? "CEP" : "ZIP Code"}</label>
          <input className="wz-inp" placeholder={data.region === "BR" ? "00000-000" : "00000"} style={{ maxWidth: 200 }}
            value={data.zip || ""} onChange={e => update("zip", e.target.value)} />
        </FieldGroup>
      </div>

      {/* Map placeholder */}
      {(data.street || data.city) && (
        <div className="wz-map" style={{ marginTop: 20 }}>
          <div style={{ textAlign: "center", zIndex: 1 }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 8, opacity: .8 }}>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
            <p style={{ fontSize: 12, color: "var(--mu)" }}>{data.street}{data.city ? ", " + data.city : ""}</p>
            <p style={{ fontSize: 10, color: "var(--dm)", marginTop: 4 }}>Map preview · powered by Google Maps</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Step2({ data, update }) {
  const isUS = data.region === "US";
  const showCompany = data.role && data.role !== "homeowner";
  const phoneMask = isUS ? "+1 (000) 000-0000" : "+55 (00) 00000-0000";

  return (
    <div className="wz-animate">
      <SectionTitle label="Tell us about you." sub="We'll use this to personalize your estimate and reach out." />

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <FieldGroup>
            <label className="wz-label">Full Name</label>
            <input className="wz-inp" placeholder="Jane Smith" value={data.name || ""} onChange={e => update("name", e.target.value)} />
          </FieldGroup>
          <FieldGroup>
            <label className="wz-label">Email</label>
            <input className="wz-inp" type="email" placeholder="jane@example.com" value={data.email || ""} onChange={e => update("email", e.target.value)} />
          </FieldGroup>
        </div>
        <FieldGroup>
          <label className="wz-label">Phone</label>
          <input className="wz-inp" placeholder={phoneMask} style={{ maxWidth: 260 }} value={data.phone || ""} onChange={e => update("phone", e.target.value)} />
        </FieldGroup>
      </div>

      {/* Role selector */}
      <label className="wz-label" style={{ marginBottom: 12 }}>Who are you?</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 24 }}>
        {ROLES.map(r => (
          <div key={r.id} className={`wz-card ${data.role === r.id ? "active" : ""}`} onClick={() => update("role", r.id)}
            style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 22, marginBottom: 6 }}>{r.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: data.role === r.id ? "var(--a)" : "var(--tx)" }}>{r.label}</div>
          </div>
        ))}
      </div>

      {/* Company info (conditional) */}
      {showCompany && (
        <div className="wz-animate" style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 16 }}>
            Company Information
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FieldGroup><label className="wz-label">Business Name</label><input className="wz-inp" placeholder="ACME Corp" value={data.companyName || ""} onChange={e => update("companyName", e.target.value)} /></FieldGroup>
              <FieldGroup><label className="wz-label">Website</label><input className="wz-inp" placeholder="https://" value={data.website || ""} onChange={e => update("website", e.target.value)} /></FieldGroup>
            </div>
            <FieldGroup><label className="wz-label">Business Address</label><input className="wz-inp" placeholder="Address" value={data.bizAddress || ""} onChange={e => update("bizAddress", e.target.value)} /></FieldGroup>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 120px", gap: 12 }}>
              <FieldGroup><label className="wz-label">City</label><input className="wz-inp" placeholder="City" value={data.bizCity || ""} onChange={e => update("bizCity", e.target.value)} /></FieldGroup>
              <FieldGroup><label className="wz-label">State</label><input className="wz-inp" placeholder="State" value={data.bizState || ""} onChange={e => update("bizState", e.target.value)} /></FieldGroup>
              <FieldGroup><label className="wz-label">ZIP</label><input className="wz-inp" placeholder="00000" value={data.bizZip || ""} onChange={e => update("bizZip", e.target.value)} /></FieldGroup>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FieldGroup><label className="wz-label">Business Email</label><input className="wz-inp" placeholder="info@company.com" value={data.bizEmail || ""} onChange={e => update("bizEmail", e.target.value)} /></FieldGroup>
              <FieldGroup><label className="wz-label">Business Phone</label><input className="wz-inp" placeholder={phoneMask} value={data.bizPhone || ""} onChange={e => update("bizPhone", e.target.value)} /></FieldGroup>
            </div>
            <FieldGroup><label className="wz-label">Instagram</label><input className="wz-inp" placeholder="@handle" value={data.instagram || ""} onChange={e => update("instagram", e.target.value)} /></FieldGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function Step3({ data, update }) {
  const isUS = data.region === "US";
  const unit = isUS ? "ft" : "m";
  const areaUnit = isUS ? "sqft" : "m²";
  const w = parseFloat(data.width) || 0;
  const l = parseFloat(data.length) || 0;
  const area = w * l;
  const levels = data.levels || {};
  const setLevel = (key, val) => update("levels", { ...levels, [key]: val });

  const levelOptions = [
    { key: "ground",   label: "Ground Floor / Main Level", note: "(always included)", locked: true },
    { key: "second",   label: "2nd Floor", note: "doubles total area" },
    { key: "basement", label: "Basement", note: isUS ? "+$0.80/sqft" : "+R$8/m²" },
    { key: "attic",    label: "Attic",    note: isUS ? "+$0.60/sqft" : "+R$6/m²" },
  ];

  return (
    <div className="wz-animate">
      <SectionTitle label="Tell us about the project." sub="Don't worry about exactness — a rough estimate works here." />

      {/* Dimensions */}
      <label className="wz-label" style={{ marginBottom: 10 }}>Project Dimensions</label>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <FieldGroup style={{ flex: 1 }}>
          <label className="wz-label">Width ({unit})</label>
          <input className="wz-inp" type="number" placeholder="0" value={data.width || ""} onChange={e => update("width", e.target.value)} />
        </FieldGroup>
        <span style={{ color: "var(--dm)", fontSize: 20, marginTop: 18 }}>×</span>
        <FieldGroup style={{ flex: 1 }}>
          <label className="wz-label">Length ({unit})</label>
          <input className="wz-inp" type="number" placeholder="0" value={data.length || ""} onChange={e => update("length", e.target.value)} />
        </FieldGroup>
        {area > 0 && (
          <div style={{ background: "var(--a-dim)", border: "1px solid var(--a)", borderRadius: "var(--r-sm)", padding: "8px 14px", marginTop: 18, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--a)", fontWeight: 600 }}>
              {area.toLocaleString()} {areaUnit}
            </span>
          </div>
        )}
      </div>
      {area > 0 && <p style={{ fontSize: 11, color: "var(--dm)", marginBottom: 20 }}>Base Area: {area.toLocaleString()} {areaUnit}</p>}

      {/* Levels */}
      <label className="wz-label" style={{ marginTop: 4, marginBottom: 12 }}>Levels / Floors</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {levelOptions.map(lv => {
          const isActive = lv.locked ? true : !!levels[lv.key];
          return (
            <div key={lv.key}
              className={`wz-card ${isActive ? "active" : ""}`}
              onClick={() => !lv.locked && setLevel(lv.key, !levels[lv.key])}
              style={{ display: "flex", alignItems: "center", gap: 14, opacity: lv.locked ? .7 : 1, cursor: lv.locked ? "default" : "pointer" }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                border: `2px solid ${isActive ? "var(--a)" : "var(--border2)"}`,
                background: isActive ? "var(--a)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                transition: "all .18s"
              }}>
                {isActive && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </div>
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--tx)", flex: 1 }}>{lv.label}</span>
              <span style={{ fontSize: 11, color: isActive ? "var(--a)" : "var(--dm)" }}>{lv.note}</span>
            </div>
          );
        })}
      </div>

      {/* Lot size */}
      <FieldGroup style={{ marginBottom: 24 }}>
        <label className="wz-label">Lot Size (optional, {areaUnit})</label>
        <input className="wz-inp" type="number" placeholder="e.g. 5000" style={{ maxWidth: 200 }}
          value={data.lotSize || ""} onChange={e => update("lotSize", e.target.value)} />
      </FieldGroup>

      {/* Current status */}
      <label className="wz-label" style={{ marginBottom: 12 }}>Current Status of the Site</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {STATUSES.map(s => (
          <div key={s.id} className={`wz-card ${data.status === s.id ? "active" : ""}`}
            onClick={() => update("status", s.id)}
            style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepPlaceholder({ label, step }) {
  return (
    <div className="wz-animate">
      <SectionTitle label={label} />
      <div style={{ border: "2px dashed var(--border2)", borderRadius: "var(--r)", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 14 }}>🔧</div>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tx)", marginBottom: 8 }}>Step {step} Placeholder</p>
        <p style={{ fontSize: 13, color: "var(--dm)" }}>Dynamic pricing logic will be inserted here in a future sprint.</p>
      </div>
    </div>
  );
}

function Step6({ data, update }) {
  const rooms = data.rooms || ROOM_DEFAULTS;
  const setRoom = (key, val) => update("rooms", { ...rooms, [key]: val });
  return (
    <div className="wz-animate">
      <SectionTitle label="Program Requirements" sub="How many of each space do you need?" />
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {ROOM_GROUPS.map(group => (
          <div key={group.label}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 14 }}>{group.label}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {group.items.map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 14px" }}>
                  <span style={{ fontSize: 13, color: "var(--mu)" }}>{item.label}</span>
                  <Counter value={rooms[item.id] ?? 0} onChange={val => setRoom(item.id, val)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 24 }}>
        <label className="wz-label" style={{ marginBottom: 8 }}>Special Requirements <span style={{ color: "var(--dm)", textTransform: "none", letterSpacing: 0 }}>(optional)</span></label>
        <textarea className="wz-textarea" placeholder="Describe any special needs, accessibility requirements, or custom spaces..."
          value={data.specialReqs || ""} onChange={e => update("specialReqs", e.target.value)} />
      </div>
    </div>
  );
}

function Step7({ data, update }) {
  const [dragging, setDragging] = useState(false);
  const files = data.uploadedFiles || [];
  const addFiles = (newFiles) => update("uploadedFiles", [...files, ...Array.from(newFiles).map(f => f.name)]);
  const removeFile = (i) => update("uploadedFiles", files.filter((_, fi) => fi !== i));

  return (
    <div className="wz-animate">
      <SectionTitle label="Upload Reference Files" sub="Plans, photos, inspiration images, videos — anything helps us understand your vision." />
      <label
        className={`wz-drop ${dragging ? "dragging" : ""}`}
        style={{ display: "block", cursor: "pointer" }}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
      >
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.mp4" style={{ display: "none" }}
          onChange={e => addFiles(e.target.files)} />
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 14px", display: "block" }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
        </svg>
        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--tx)", marginBottom: 6 }}>Drop files here or click to browse</p>
        <p style={{ fontSize: 12, color: "var(--dm)" }}>PDF · JPG · PNG · DOC · MP4 · up to 100MB each</p>
      </label>
      {files.length > 0 && (
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
          {files.map((name, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r-sm)", padding: "10px 14px" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--a)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
              <span style={{ fontSize: 13, color: "var(--mu)", flex: 1 }}>{name}</span>
              <button onClick={() => removeFile(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--dm)", fontSize: 16 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step8({ data, update }) {
  const docs = data.rushDocs || { survey: false, photos: false, measurements: false };
  const setDoc = (key, val) => update("rushDocs", { ...docs, [key]: val });
  const allDone = docs.survey && docs.photos && docs.measurements;

  const docItems = [
    { key: "survey",       label: "Property Survey",   icon: "📋" },
    { key: "photos",       label: "Site Photos",        icon: "📷" },
    { key: "measurements", label: "Measurements",       icon: "📏" },
  ];

  return (
    <div className="wz-animate">
      <SectionTitle label="Rush Fees & Delivery" sub="Mark off items you have ready to potentially unlock faster delivery." />
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {docItems.map(item => (
          <div key={item.key} style={{ display: "flex", alignItems: "center", gap: 14, background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: "14px 18px" }}>
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: "var(--tx)" }}>{item.label}</span>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={!!docs[item.key]} onChange={e => setDoc(item.key, e.target.checked)}
                style={{ accentColor: "var(--a)", width: 16, height: 16, cursor: "pointer" }} />
              <span style={{ fontSize: 12, color: "var(--mu)" }}>I have it</span>
            </label>
            <button className="wz-btn-ghost" style={{ padding: "6px 14px", fontSize: 11 }}>Upload</button>
          </div>
        ))}
      </div>

      {/* Rush selector */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 14 }}>
        Unlock Faster Delivery
      </p>
      {!allDone && (
        <div style={{ background: "rgba(239,68,68,.08)", border: "1.5px solid rgba(239,68,68,.3)", borderRadius: "var(--r-sm)", padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <p style={{ fontSize: 12, color: "#ef4444" }}>Please confirm all 3 items above to unlock Rush Express.</p>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, opacity: allDone ? 1 : .5, pointerEvents: allDone ? "auto" : "none" }}>
        {[
          { id: "standard", label: "Standard Delivery", sub: "Included in base price", price: "", icon: "📦" },
          { id: "express",  label: "Rush Express",      sub: "+60% on total estimate", price: "+60%", icon: "⚡" },
        ].map(opt => (
          <div key={opt.id} className={`wz-card ${data.rush === opt.id ? "active" : ""}`}
            onClick={() => allDone && update("rush", opt.id)}
            style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center", textAlign: "center", padding: 20 }}>
            <span style={{ fontSize: 28, marginBottom: 4 }}>{opt.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--tx)" }}>{opt.label}</span>
            <span style={{ fontSize: 11, color: "var(--dm)" }}>{opt.sub}</span>
            {opt.price && <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--am)", fontWeight: 600 }}>{opt.price}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function Step9({ data, estimate, navigate }) {
  const isUS = data.region === "US";
  const rows = [
    { label: "Name",       val: data.name || "—" },
    { label: "Email",      val: data.email || "—" },
    { label: "Phone",      val: data.phone || "—" },
    { label: "Region",     val: data.region || "—" },
    { label: "Address",    val: [data.street, data.city, data.state].filter(Boolean).join(", ") || "—" },
    { label: "Role",       val: data.role || "—" },
    { label: "Width × Length", val: data.width && data.length ? `${data.width} × ${data.length} ${isUS?"ft":"m"}` : "—" },
    { label: "Levels",    val: Object.entries(data.levels || {}).filter(([,v])=>v).map(([k])=>k).join(", ") || "Ground only" },
    { label: "Status",     val: data.status || "—" },
    { label: "Delivery",   val: data.rush || "standard" },
    { label: "Files",      val: (data.uploadedFiles || []).length ? `${data.uploadedFiles.length} file(s)` : "None" },
  ];

  const steps = [
    { n: "01", label: "Estimate Review",    sub: "Our team reviews your brief within 24 hours." },
    { n: "02", label: "Discovery Call",     sub: "A 30-min call to align on scope and goals." },
    { n: "03", label: "Formal Quote",       sub: "You receive a detailed, no-surprise proposal." },
  ];

  return (
    <div className="wz-animate">
      <SectionTitle label="Almost done — review your brief." />

      {/* Summary */}
      <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 14 }}>Your Information</p>
        {rows.map(row => (
          <div key={row.label} className="wz-review-row">
            <span style={{ color: "var(--dm)", minWidth: 130 }}>{row.label}</span>
            <span style={{ color: "var(--tx)", fontWeight: 500, textAlign: "right" }}>{row.val}</span>
          </div>
        ))}
      </div>

      {/* Estimate summary */}
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,.14) 0%, rgba(99,102,241,.06) 100%)", border: "1.5px solid var(--a)", borderRadius: "var(--r)", padding: 22, marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 12 }}>Estimate Range</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontStyle: "italic", color: "var(--tx)" }}>{estimate.lo}</span>
          <span style={{ color: "var(--dm)" }}>—</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--mu)" }}>{estimate.hi}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--dm)", marginTop: 6 }}>Confidence: {estimate.confidence}%</p>
      </div>

      {/* Next steps */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 16 }}>What Happens Next</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
        {steps.map(s => (
          <div key={s.n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--a-dim)", border: "1.5px solid var(--a)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--a)", fontWeight: 600 }}>{s.n}</span>
            </div>
            <div style={{ paddingTop: 4 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)", marginBottom: 3 }}>{s.label}</p>
              <p style={{ fontSize: 12, color: "var(--dm)" }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA buttons */}
      {/* CTA state: submitted */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          className="wz-btn-primary"
          style={{ flex: 1, justifyContent: "center" }}
          onClick={() => {
            /* Simulate account creation → redirect to client portal */
            navigate("/portal");
          }}
        >
          Accept & Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button
          className="wz-btn-ghost"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={() => {
            /* Simulate email delivery — in prod: POST /api/save-estimate */
            alert("A link to resume your estimate has been sent to " + (data.email || "your email") + ". Your lead has been recorded.");
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Save for Later
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN WIZARD
───────────────────────────────────────────────────────────── */
export default function EstimateWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ region: "US", levels: { ground: true }, rooms: { ...ROOM_DEFAULTS } });
  const topRef = useRef(null);

  const update = useCallback((key, val) => {
    setData(prev => ({ ...prev, [key]: val }));
  }, []);

  const estimate = calcEstimate(data);
  const showSidebar = step >= 3;

  const canAdvance = () => {
    if (step === 0) return !!data.region;
    if (step === 1) return !!data.name && !!data.email && !!data.role;
    return true;
  };

  const next = () => {
    if (step < STEPS.length - 1 && canAdvance()) {
      setStep(s => s + 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };
  const prev = () => {
    if (step > 0) {
      setStep(s => s - 1);
      topRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const stepLabels = ["Location", "About You", "Project", "Scope", "Services", "Program", "Files", "Rush", "Review"];

  return (
    <>
      <style>{css}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg0)", fontFamily: "var(--font-sans)" }}>
        {/* ── Top bar ── */}
        <div ref={topRef} style={{ borderBottom: "1px solid var(--border)", padding: "16px 0", background: "var(--bg1)", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
            {/* Logo + step label */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "var(--font-serif)", fontSize: 14, color: "#fff", fontStyle: "italic" }}>D</span>
                </div>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: 15, fontStyle: "italic", color: "var(--tx)" }}>DARA Studio</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--dm)" }}>Step {step + 1} of {STEPS.length}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--a)" }}>— {stepLabels[step]}</span>
              </div>
            </div>
            {/* Stepper */}
            <Stepper current={step} />
          </div>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 80px" }}>
          <div style={{
            display: showSidebar ? "grid" : "block",
            gridTemplateColumns: showSidebar ? "1fr 320px" : "1fr",
            gap: 28, alignItems: "start",
          }}>
            {/* Main */}
            <div style={{ maxWidth: showSidebar ? "none" : 660, margin: showSidebar ? 0 : "0 auto" }}>
              {step === 0 && <Step1 data={data} update={update} />}
              {step === 1 && <Step2 data={data} update={update} />}
              {step === 2 && <Step3 data={data} update={update} />}
              {step === 3 && <StepPlaceholder label="Scope of Services" step={4} />}
              {step === 4 && <StepPlaceholder label="Service Add-ons" step={5} />}
              {step === 5 && <Step6 data={data} update={update} />}
              {step === 6 && <Step7 data={data} update={update} />}
              {step === 7 && <Step8 data={data} update={update} />}
              {step === 8 && <Step9 data={data} estimate={estimate} navigate={navigate} />}

              {/* Navigation */}
              {step < STEPS.length - 1 && (
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 36, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
                  <button className="wz-btn-ghost" onClick={prev} style={{ visibility: step === 0 ? "hidden" : "visible" }}>
                    ← Back
                  </button>
                  <button className="wz-btn-primary" onClick={next} disabled={!canAdvance()}>
                    Continue →
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            {showSidebar && (
              <div>
                <Sidebar estimate={estimate} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
