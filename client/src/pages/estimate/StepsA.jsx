import { useState } from "react";
import { ROLES, STATUSES, SCOPE_TYPES, SERVICES } from "./constants";
import { SectionTitle, FieldGroup } from "./components";

/* ═══ STEP 1: LOCATION ═══ */
export function Step1({ data, update }) {
  const [query, setQuery] = useState("");
  const suggestions = ["Massachusetts", "California", "New York", "Texas", "Florida",
    "São Paulo", "Rio de Janeiro", "Minas Gerais"].filter(s =>
    query.length > 1 && s.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="wz-animate">
      <SectionTitle label="Where is your project located?" sub="This helps us apply the right codes, rates, and regulations." />
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        {[
          { id: "US", flag: "🇺🇸", title: "US", sub: "USD · sqft" },
          { id: "BR", flag: "🇧🇷", title: "BR", sub: "BRL · m²" },
        ].map(opt => (
          <div key={opt.id} className={`wz-toggle ${data.region === opt.id ? "active" : ""}`} onClick={() => update("region", opt.id)}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{opt.flag}</div>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--font-mono)", color: "var(--tx)" }}>{opt.title}</div>
            <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 4 }}>{opt.sub}</div>
          </div>
        ))}
      </div>
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

/* ═══ STEP 2: ABOUT YOU ═══ */
export function Step2({ data, update }) {
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
      {showCompany && (
        <div className="wz-animate" style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--a)", marginBottom: 16 }}>Company Information</p>
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

/* ═══ STEP 3: PROJECT ═══ */
export function Step3({ data, update }) {
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
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--a)", fontWeight: 600 }}>{area.toLocaleString()} {areaUnit}</span>
          </div>
        )}
      </div>
      {area > 0 && <p style={{ fontSize: 11, color: "var(--dm)", marginBottom: 20 }}>Base Area: {area.toLocaleString()} {areaUnit}</p>}
      <label className="wz-label" style={{ marginTop: 4, marginBottom: 12 }}>Levels / Floors</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {levelOptions.map(lv => {
          const isActive = lv.locked ? true : !!levels[lv.key];
          return (
            <div key={lv.key} className={`wz-card ${isActive ? "active" : ""}`}
              onClick={() => !lv.locked && setLevel(lv.key, !levels[lv.key])}
              style={{ display: "flex", alignItems: "center", gap: 14, opacity: lv.locked ? .7 : 1, cursor: lv.locked ? "default" : "pointer" }}>
              <div style={{
                width: 18, height: 18, borderRadius: 4,
                border: `2px solid ${isActive ? "var(--a)" : "var(--border2)"}`,
                background: isActive ? "var(--a)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .18s"
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
      <FieldGroup style={{ marginBottom: 24 }}>
        <label className="wz-label">Lot Size (optional, {areaUnit})</label>
        <input className="wz-inp" type="number" placeholder="e.g. 5000" style={{ maxWidth: 200 }}
          value={data.lotSize || ""} onChange={e => update("lotSize", e.target.value)} />
      </FieldGroup>
      <label className="wz-label" style={{ marginBottom: 12 }}>Current Status of the Site</label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {STATUSES.map(s => (
          <div key={s.id} className={`wz-card ${data.status === s.id ? "active" : ""}`}
            onClick={() => update("status", s.id)} style={{ textAlign: "center", padding: "16px 10px" }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 12, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ STEP 4: SCOPE ═══ */
export function Step4({ data, update }) {
  return (
    <div className="wz-animate">
      <SectionTitle label="Scope of Services" sub="What type of project are you planning? This helps us tailor your estimate." />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
        {SCOPE_TYPES.map(scope => (
          <div key={scope.id}
            className={`wz-card ${data.scopeType === scope.id ? "active" : ""}`}
            onClick={() => update("scopeType", scope.id)}
            style={{ display: "flex", flexDirection: "column", gap: 8, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }}>{scope.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: data.scopeType === scope.id ? "var(--a)" : "var(--tx)" }}>{scope.label}</span>
            </div>
            <p style={{ fontSize: 12, color: "var(--dm)", lineHeight: 1.5 }}>{scope.desc}</p>
          </div>
        ))}
      </div>

      {data.scopeType && (
        <div className="wz-animate">
          <label className="wz-label" style={{ marginBottom: 8 }}>
            Project Description <span style={{ color: "var(--dm)", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea className="wz-textarea"
            placeholder="Describe your project goals, any specific requirements, or design preferences..."
            value={data.projectDescription || ""}
            onChange={e => update("projectDescription", e.target.value)} />
        </div>
      )}
    </div>
  );
}

/* ═══ STEP 5: SERVICES ═══ */
export function Step5({ data, update }) {
  const selected = data.selectedServices || SERVICES.filter(s => s.included).map(s => s.id);
  const toggle = (id) => {
    const svc = SERVICES.find(s => s.id === id);
    if (svc?.included) return; // can't deselect included services
    const next = selected.includes(id) ? selected.filter(s => s !== id) : [...selected, id];
    update("selectedServices", next);
  };

  return (
    <div className="wz-animate">
      <SectionTitle label="Select Your Services" sub="Core deliverables are included. Add optional services to enhance your project." />

      {/* Included services */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gn)", marginBottom: 14 }}>
        ✓ Included in Base Package
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 28 }}>
        {SERVICES.filter(s => s.included).map(svc => (
          <div key={svc.id} className="wz-card active"
            style={{ display: "flex", alignItems: "center", gap: 14, cursor: "default" }}>
            <span style={{ fontSize: 20 }}>{svc.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--tx)" }}>{svc.label}</p>
              <p style={{ fontSize: 11, color: "var(--dm)" }}>{svc.desc}</p>
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--gn)", padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.3)" }}>
              Included
            </span>
          </div>
        ))}
      </div>

      {/* Add-on services */}
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 14 }}>
        + Optional Add-ons
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {SERVICES.filter(s => !s.included).map(svc => {
          const isSelected = selected.includes(svc.id);
          return (
            <div key={svc.id}
              className={`wz-card ${isSelected ? "active" : ""}`}
              onClick={() => toggle(svc.id)}
              style={{ display: "flex", flexDirection: "column", gap: 6, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{svc.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "var(--a)" : "var(--tx)" }}>{svc.label}</span>
              </div>
              <p style={{ fontSize: 11, color: "var(--dm)", lineHeight: 1.5 }}>{svc.desc}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <div style={{
                  width: 16, height: 16, borderRadius: 4,
                  border: `2px solid ${isSelected ? "var(--a)" : "var(--border2)"}`,
                  background: isSelected ? "var(--a)" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all .18s"
                }}>
                  {isSelected && (
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: 11, color: isSelected ? "var(--a)" : "var(--dm)" }}>
                  {isSelected ? "Selected" : "Add to package"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
