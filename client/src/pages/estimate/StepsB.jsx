import { useState } from "react";
import { ROOM_GROUPS, ROOM_DEFAULTS, SERVICES } from "./constants";
import { SectionTitle, FieldGroup, Counter } from "./components";

/* ═══ STEP 6: PROGRAM ═══ */
export function Step6({ data, update }) {
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

/* ═══ STEP 7: FILES ═══ */
export function Step7({ data, update }) {
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

/* ═══ STEP 8: RUSH ═══ */
export function Step8({ data, update }) {
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
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 14 }}>Unlock Faster Delivery</p>
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

/* ═══ STEP 9: REVIEW ═══ */
export function Step9({ data, estimate, navigate }) {
  const isUS = data.region === "US";
  const selectedSvcs = (data.selectedServices || [])
    .map(id => SERVICES.find(s => s.id === id)?.label)
    .filter(Boolean);

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
    { label: "Scope",      val: data.scopeType || "—" },
    { label: "Services",   val: selectedSvcs.length > 0 ? selectedSvcs.join(", ") : "Base package" },
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
      <div style={{ background: "var(--bg3)", border: "1.5px solid var(--border)", borderRadius: "var(--r)", padding: 20, marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 14 }}>Your Information</p>
        {rows.map(row => (
          <div key={row.label} className="wz-review-row">
            <span style={{ color: "var(--dm)", minWidth: 130 }}>{row.label}</span>
            <span style={{ color: "var(--tx)", fontWeight: 500, textAlign: "right" }}>{row.val}</span>
          </div>
        ))}
      </div>
      <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,.14) 0%, rgba(99,102,241,.06) 100%)", border: "1.5px solid var(--a)", borderRadius: "var(--r)", padding: 22, marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--a)", marginBottom: 12 }}>Estimate Range</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontStyle: "italic", color: "var(--tx)" }}>{estimate.lo}</span>
          <span style={{ color: "var(--dm)" }}>—</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--mu)" }}>{estimate.hi}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--dm)", marginTop: 6 }}>Confidence: {estimate.confidence}%</p>
      </div>
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
      <div style={{ display: "flex", gap: 12 }}>
        <button className="wz-btn-primary" style={{ flex: 1, justifyContent: "center" }}
          onClick={() => navigate("/portal")}>
          Accept & Continue
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button className="wz-btn-ghost"
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
          onClick={() => alert("A link to resume your estimate has been sent to " + (data.email || "your email") + ". Your lead has been recorded.")}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          Save for Later
        </button>
      </div>
    </div>
  );
}
