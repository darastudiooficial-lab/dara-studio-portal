import { useState, useEffect } from "react";
import { CheckCircle2, Upload, X, ChevronRight, ChevronLeft, AlertTriangle, Info, Zap } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
   DARA Studio — Estimate Form
   Multi-step wizard with live pricing sidebar

   Steps:
   1. Project Location (US / BR)
   2. Project Details (dimensions, levels)
   3. Project Scope (type + service tier)
   4. Program Requirements (rooms)
   5. Upload Files
   6. Rush Fees (unlocked when all files uploaded)
   7. Review & Submit

   Pricing engine:
   • Base rate: $1.44/sqft (Full Construction)
   • Floor Plans Only: 50% of base
   • PDF to CAD: 35% of base
   • Rush +40%, Express +60%
   • Confidence % grows as user fills more fields

   On submit: creates a project in "pending" state (30-day hold)
   ───────────────────────────────────────────────────────────── */

// ── DESIGN TOKENS ──────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --gold:#b89b6a;--gold-h:#c9ae82;--gold-d:rgba(184,155,106,0.14);
  --bg:#0e0d0b;--bg2:#161410;--bg3:#1e1b16;--bg4:#252118;
  --border:rgba(255,255,255,0.1);--border2:rgba(255,255,255,0.06);
  --text:#ede9e0;--muted:#8a8678;--dim:#5a5850;
  --green:#3d9970;--green-bg:rgba(61,153,112,0.15);
  --amber:#d4830a;--amber-bg:rgba(212,131,10,0.12);
  --red:#c0392b;--red-bg:rgba(192,57,43,0.12);
  --blue:#3b82c4;
  --serif:'Libre Baskerville',Georgia,serif;
  --sans:'Montserrat',system-ui,sans-serif;
}
body{background:var(--bg);font-family:var(--sans);color:var(--text);font-size:14px;-webkit-font-smoothing:antialiased;}
input,textarea,select{font-family:var(--sans);}
button{font-family:var(--sans);cursor:pointer;}
::-webkit-scrollbar{width:3px;}
::-webkit-scrollbar-thumb{background:var(--bg4);border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.6;}}
.fade-up{animation:fadeUp 0.3s ease both;}
`;

// ── PRICING ENGINE ──────────────────────────────────────────
const BASE_RATE = 1.44; // $/sqft for Full Construction
const SERVICE_MULTIPLIER = {
  "full_construction": 1.0,
  "floor_plans_only":  0.50,
  "pdf_to_cad":        0.35,
};
const RUSH_MULT   = 1.40;
const EXPRESS_MULT = 1.60;
const COMPLEXITY_TAG = { full_construction:"HIGH COMPLEXITY", floor_plans_only:"LOW COMPLEXITY", pdf_to_cad:"DRAFTING ONLY" };
const COMPLEXITY_COLOR = { full_construction:"#e8980f", floor_plans_only:"#3d9970", pdf_to_cad:"#3b82c4" };

function calcPrice(sqft, service, delivery) {
  if (!sqft || !service) return null;
  const base = sqft * BASE_RATE * SERVICE_MULTIPLIER[service];
  const mult = delivery === "rush" ? RUSH_MULT : delivery === "express" ? EXPRESS_MULT : 1;
  const low  = Math.round(base * mult * 0.82);
  const high = Math.round(base * mult * 1.0);
  return { low, high, base: Math.round(base), rush: Math.round(base*(RUSH_MULT-1)), express: Math.round(base*(EXPRESS_MULT-1)), mult };
}

function calcConfidence(data) {
  const pts = [
    data.country, data.city, data.width, data.length, data.levels?.length,
    data.service, data.projectType, data.rooms?.filter(r=>r.qty>0).length > 0,
    data.uploads?.filter(u=>u.file).length > 0,
  ];
  const filled = pts.filter(Boolean).length;
  return Math.round((filled / pts.length) * 100);
}

// ── STEP PROGRESS BAR ──────────────────────────────────────
const STEPS = ["Location","Details","Scope","Rooms","Files","Rush","Review"];

function StepBar({ current }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:0, marginBottom:28 }}>
      {STEPS.map((s,i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} style={{ display:"flex", alignItems:"center", flex: i < STEPS.length-1 ? 1 : "none" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5 }}>
              <div style={{ width:22, height:22, borderRadius:"50%",
                background: done ? "var(--gold)" : active ? "transparent" : "var(--bg4)",
                border: `2px solid ${done||active ? "var(--gold)" : "var(--border)"}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                transition:"all 0.2s" }}>
                {done
                  ? <CheckCircle2 size={12} color="#141412" strokeWidth={3}/>
                  : <span style={{ fontSize:9, fontWeight:700, color: active ? "var(--gold)" : "var(--dim)" }}>{i+1}</span>
                }
              </div>
              <span style={{ fontSize:9, color: active ? "var(--gold)" : done ? "var(--muted)" : "var(--dim)",
                fontWeight: active ? 600 : 400, whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i < STEPS.length-1 && (
              <div style={{ flex:1, height:1, background: done ? "var(--gold)" : "var(--border)",
                margin:"0 6px", marginBottom:16, transition:"background 0.3s" }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PRICING SIDEBAR ─────────────────────────────────────────
function PricingSidebar({ data }) {
  const sqft  = data.width && data.length ? data.width * data.length : null;
  const price = calcPrice(sqft, data.service, data.delivery);
  const conf  = calcConfidence(data);
  const confColor = conf >= 80 ? "var(--green)" : conf >= 50 ? "var(--gold)" : "var(--amber)";

  return (
    <div style={{ width:240, flexShrink:0, display:"flex", flexDirection:"column", gap:12 }}>
      {/* Estimated Fee */}
      <div style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"18px 16px" }}>
        <p style={{ fontSize:10, color:"var(--gold)", fontWeight:700, letterSpacing:"0.1em",
          textTransform:"uppercase", marginBottom:14 }}>Estimated Design Fee</p>

        <div style={{ background:"var(--bg4)", borderRadius:8, padding:"14px 12px", marginBottom:14, textAlign:"center" }}>
          {price ? (
            <p style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, color:"var(--text)" }}>
              ${price.low.toLocaleString()} – ${price.high.toLocaleString()}
            </p>
          ) : (
            <div>
              <p style={{ fontFamily:"var(--serif)", fontSize:20, fontWeight:700, color:"var(--dim)" }}>$– –</p>
              <p style={{ fontSize:10, color:"var(--dim)", marginTop:4 }}>Fill in project details</p>
            </div>
          )}
        </div>

        <p style={{ fontSize:10, color:"var(--dim)", lineHeight:1.5, marginBottom:14 }}>
          *Approximate estimate. Final pricing confirmed upon project review.
        </p>

        {price && (
          <div style={{ borderTop:"1px solid var(--border2)", paddingTop:12 }}>
            <p style={{ fontSize:10, color:"var(--gold)", fontWeight:700, letterSpacing:"0.08em",
              textTransform:"uppercase", marginBottom:10 }}>Cost Breakdown</p>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, color:"var(--muted)" }}>
                {data.service==="full_construction" ? "Full Construction"
                 : data.service==="floor_plans_only" ? "Floor Plans Only"
                 : "PDF to CAD"}
              </span>
              <span style={{ fontSize:12, fontWeight:600 }}>${price.base.toLocaleString()}</span>
            </div>
            {data.delivery === "rush" && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:"var(--amber)" }}>Rush Fee (+40%)</span>
                <span style={{ fontSize:12, fontWeight:600, color:"var(--amber)" }}>+${price.rush}</span>
              </div>
            )}
            {data.delivery === "express" && (
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                <span style={{ fontSize:12, color:"var(--red)" }}>Express Fee (+60%)</span>
                <span style={{ fontSize:12, fontWeight:600, color:"var(--red)" }}>+${price.express}</span>
              </div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
              <span style={{ fontSize:12, color:"var(--muted)" }}>Project Complexity</span>
              <span style={{ fontSize:12, fontWeight:600 }}>Standard</span>
            </div>
          </div>
        )}
      </div>

      {/* Confidence */}
      <div style={{ background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:10, padding:"14px 16px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
          <span style={{ fontSize:13 }}>📈</span>
          <span style={{ fontSize:12, fontWeight:600 }}>Estimate Confidence</span>
          <span style={{ marginLeft:"auto", fontWeight:700, color:confColor, fontSize:13 }}>{conf}%</span>
        </div>
        <div style={{ background:"var(--bg4)", borderRadius:4, height:5, marginBottom:8 }}>
          <div style={{ width:`${conf}%`, height:"100%", borderRadius:4,
            background: conf>=80 ? "var(--green)" : conf>=50 ? "var(--gold)" : "var(--amber)",
            transition:"width 0.5s ease" }}/>
        </div>
        <p style={{ fontSize:10, color:confColor, lineHeight:1.5 }}>
          {conf >= 80 ? "Good confidence. Upload documents to maximize accuracy."
           : conf >= 50 ? "Add more project details to improve estimate."
           : "Fill in project dimensions and type to get an estimate."}
        </p>
      </div>
    </div>
  );
}

// ── INPUT COMPONENTS ────────────────────────────────────────
const inputBase = {
  width:"100%", background:"var(--bg4)", border:"1px solid var(--border)",
  borderRadius:8, padding:"10px 13px", fontSize:13, color:"var(--text)",
  outline:"none", fontFamily:"var(--sans)",
};
const labelBase = {
  fontSize:10, fontWeight:700, color:"var(--muted)", letterSpacing:"0.1em",
  textTransform:"uppercase", display:"block", marginBottom:6,
};

function Input({ label, required, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && <label style={labelBase}>{label}{required && <span style={{ color:"var(--red)", marginLeft:2 }}>*</span>}</label>}
      <input {...props} style={{ ...inputBase, borderColor: focused ? "var(--gold)" : "var(--border)" }}
        onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}/>
    </div>
  );
}

// ── STEP 1: LOCATION ────────────────────────────────────────
function Step1({ data, set }) {
  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Project Location</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Select your region and provide the project address.</p>

      {/* Country toggle */}
      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        {[["US","United States","USD · sqft"],["BR","Brazil","BRL · m²"]].map(([code,name,sub])=>(
          <button key={code} onClick={()=>set("country",code)} style={{
            flex:1, background: data.country===code ? "var(--gold-d)" : "var(--bg4)",
            border:`1.5px solid ${data.country===code ? "var(--gold)" : "var(--border)"}`,
            borderRadius:10, padding:"14px 12px", cursor:"pointer", textAlign:"left",
            transition:"all 0.15s" }}>
            <p style={{ fontSize:14, fontWeight:700, color: data.country===code ? "var(--gold)" : "var(--text)", marginBottom:3 }}>{code}</p>
            <p style={{ fontSize:11, color:"var(--muted)", marginBottom:2 }}>{name}</p>
            <p style={{ fontSize:10, color:"var(--dim)" }}>{sub}</p>
          </button>
        ))}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <Input label="City *" required value={data.city||""} onChange={e=>set("city",e.target.value)} placeholder="e.g. Boston"/>
        <Input label="State / Province *" required value={data.state||""} onChange={e=>set("state",e.target.value)} placeholder="e.g. Massachusetts"/>
        <div style={{ gridColumn:"1/-1" }}>
          <Input label="Street Address" value={data.street||""} onChange={e=>set("street",e.target.value)} placeholder="Street address (optional)"/>
        </div>
        <Input label="ZIP / Postal Code" value={data.zip||""} onChange={e=>set("zip",e.target.value)} placeholder="e.g. 02134"/>
        <div/>
      </div>
    </div>
  );
}

// ── STEP 2: PROJECT DETAILS ─────────────────────────────────
function Step2({ data, set }) {
  const levels = ["Ground Floor / Main Level","2nd Floor","3rd Floor","Basement","Attic"];
  const sqft = data.width && data.length ? data.width * data.length : null;

  const toggleLevel = (lv) => {
    const cur = data.levels || [];
    set("levels", cur.includes(lv) ? cur.filter(l=>l!==lv) : [...cur, lv]);
  };

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Project Details</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Enter your project dimensions and select the levels included.</p>

      {/* Dimensions */}
      <div style={{ marginBottom:20 }}>
        <label style={labelBase}>Base Dimensions *</label>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
          <div style={{ position:"relative" }}>
            <Input value={data.width||""} onChange={e=>set("width",Number(e.target.value)||"")} placeholder="Width (ft)" type="number" min="1"/>
            <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:11, color:"var(--dim)" }}>ft</span>
          </div>
          <div style={{ position:"relative" }}>
            <Input value={data.length||""} onChange={e=>set("length",Number(e.target.value)||"")} placeholder="Length (ft)" type="number" min="1"/>
            <span style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", fontSize:11, color:"var(--dim)" }}>ft</span>
          </div>
        </div>
        {sqft && (
          <div style={{ marginTop:8, padding:"8px 12px", background:"var(--gold-d)",
            border:"1px solid rgba(184,155,106,0.2)", borderRadius:6, display:"flex", justifyContent:"space-between" }}>
            <span style={{ fontSize:12, color:"var(--muted)" }}>Total Base Area</span>
            <span style={{ fontSize:12, fontWeight:700, color:"var(--gold)" }}>{sqft.toLocaleString()} sqft</span>
          </div>
        )}
      </div>

      {/* Lot size */}
      <div style={{ marginBottom:20 }}>
        <Input label="Lot Size (optional)" value={data.lotSize||""} onChange={e=>set("lotSize",e.target.value)} placeholder="e.g. 0.25 acres or 10,890 sqft"/>
      </div>

      {/* Levels */}
      <div>
        <label style={labelBase}>Levels *</label>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          {levels.map(lv=>{
            const active = (data.levels||[]).includes(lv);
            const isDefault = lv === "Ground Floor / Main Level";
            return (
              <button key={lv} onClick={()=>!isDefault && toggleLevel(lv)} style={{
                display:"flex", alignItems:"center", justifyContent:"space-between",
                background: active ? "var(--gold-d)" : "var(--bg4)",
                border:`1px solid ${active ? "var(--gold)" : "var(--border)"}`,
                borderRadius:8, padding:"11px 14px", cursor: isDefault ? "default" : "pointer",
                transition:"all 0.15s" }}>
                <span style={{ fontSize:13, color: active ? "var(--text)" : "var(--muted)" }}>{lv}</span>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  {isDefault && <span style={{ fontSize:10, color:"var(--dim)", background:"var(--bg3)", borderRadius:3, padding:"1px 7px" }}>DEFAULT</span>}
                  {lv==="Basement" && !active && <span style={{ fontSize:10, color:"var(--amber)" }}>+UPCHARGE</span>}
                  {lv==="Attic"    && !active && <span style={{ fontSize:10, color:"var(--red)" }}>+REQUIRED</span>}
                  <div style={{ width:16, height:16, borderRadius:3,
                    background: active ? "var(--gold)" : "transparent",
                    border:`1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {active && <CheckCircle2 size={10} color="#141412" strokeWidth={3}/>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── STEP 3: SCOPE ────────────────────────────────────────────
function Step3({ data, set }) {
  const [expanded, setExpanded] = useState(null);

  const projectTypes = [
    { id:"single_family",   label:"Single Family Home",   icon:"🏠" },
    { id:"kitchen",         label:"Kitchen Remodel",      icon:"🍳" },
    { id:"bath_remodel",    label:"Bathroom Remodel",     icon:"🚿" },
    { id:"interior_reno",   label:"Interior Renovation",  icon:"🛋️" },
    { id:"home_addition",   label:"Home Addition",        icon:"🏗️" },
    { id:"adu",             label:"ADU",                  icon:"🏡" },
    { id:"multi_family",    label:"Multi-Family Residential", icon:"🏢" },
    { id:"small_commercial",label:"Small Commercial Building", icon:"🏪" },
    { id:"garage",          label:"Garage",               icon:"🚗" },
    { id:"3d_only",         label:"3D Visualization Only", icon:"🎨" },
    { id:"custom",          label:"Custom Home",           icon:"✨" },
    { id:"commercial",      label:"Commercial Projects",   icon:"🏛️" },
  ];

  const services = [
    {
      id:"full_construction",
      label:"Full Construction",
      complexity:"HIGH COMPLEXITY",
      desc:"Comprehensive package including all floor levels, design extras, and 3D visualization. Unlocks all add-ons.",
      detail:"Comprehensive design package including initial concepts, detailed spatial planning, core building documentation, 3D exterior visualization, and municipal code review for a complete architecture service. Excludes interior detailed cabinetry layout, material selections, and landscape design.",
    },
    {
      id:"floor_plans_only",
      label:"Floor Plans Only",
      complexity:"LOW COMPLEXITY",
      desc:"Essential spatial layouts and dimensioned floor plans. Does not include exterior design or 3D renderings.",
      detail:"A streamlined service delivering fundamental interior spatial layouts and dimensioned floor plans only. Does not include exterior design, building permits, structural engineering, or 3D renderings.",
    },
    {
      id:"pdf_to_cad",
      label:"PDF to CAD Conversion",
      complexity:"DRAFTING ONLY",
      desc:"Convert existing PDF blueprints or hand-drawn sketches into fully editable digital CAD files.",
      detail:"Technical drafting service to convert your existing PDF blueprints, hand-drawn sketches, or old plans into fully editable and scaled digital CAD (.dwg) files.",
      warning:"Design Extras and 3D Visualization are not available for PDF to CAD Conversion.",
    },
  ];

  // Design Extras (only for full_construction)
  const designExtras = [
    { id:"arch_design",   label:"Architectural Design",  included:true,  desc:"Focuses on the conceptual and aesthetic development of your project." },
    { id:"space_planning",label:"Space Planning",        included:true,  desc:"Room-to-room design focusing on optimal arrangement." },
    { id:"interior",      label:"Interior Layout",       included:true,  desc:"Micro-level design detailing placement of furniture." },
    { id:"3d_exterior",   label:"3D Exterior Rendering", included:true,  addOn:"FREE",  desc:"3D exterior visualization included." },
    { id:"3d_kitchen",    label:"3D Kitchen Design",     included:false, price:50,  desc:"Per-room 3D design for kitchen." },
    { id:"3d_bathroom",   label:"3D Bathroom Design",    included:false, price:50,  desc:"Per-room 3D design for bathroom." },
    { id:"3d_laundry",    label:"3D Laundry Design",     included:false, price:50,  desc:"Per-room 3D design for laundry." },
  ];

  const sqft = data.width && data.length ? data.width * data.length : 144; // fallback 12x12
  const p = calcPrice(sqft, data.service, data.delivery);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Project Scope</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>Define your project type and the services you need.</p>

      {/* Project Type grid */}
      <div style={{ marginBottom:24 }}>
        <label style={labelBase}>What type of project? *</label>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {projectTypes.map(pt=>{
            const active = data.projectType === pt.id;
            return (
              <button key={pt.id} onClick={()=>set("projectType",pt.id)} style={{
                background: active ? "var(--gold-d)" : "var(--bg4)",
                border:`1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                borderRadius:8, padding:"10px 8px", cursor:"pointer",
                display:"flex", flexDirection:"column", alignItems:"center", gap:6,
                transition:"all 0.15s" }}>
                <span style={{ fontSize:20 }}>{pt.icon}</span>
                <span style={{ fontSize:10, fontWeight:500, color: active ? "var(--gold)" : "var(--muted)",
                  textAlign:"center", lineHeight:1.3 }}>{pt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Service tier */}
      <div style={{ marginBottom: data.service==="full_construction" ? 20 : 0 }}>
        <label style={labelBase}>Services Needed *</label>
        <p style={{ fontSize:11, color:"var(--dim)", marginBottom:12 }}>Choose your engagement level</p>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {services.map(svc=>{
            const active = data.service === svc.id;
            const exp = expanded === svc.id;
            const sqftForPrice = data.width && data.length ? data.width * data.length : 144;
            const sp = calcPrice(sqftForPrice, svc.id, "standard");
            return (
              <div key={svc.id} style={{
                background: active ? "rgba(184,155,106,0.08)" : "var(--bg4)",
                border:`1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                borderRadius:10, overflow:"hidden", transition:"all 0.15s" }}>
                <div style={{ padding:"14px 16px", cursor:"pointer" }}
                  onClick={()=>{ set("service",svc.id); if(svc.id==="pdf_to_cad") set("delivery","standard"); }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:12 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", marginTop:1, flexShrink:0,
                      background: active ? "var(--gold)" : "transparent",
                      border:`2px solid ${active ? "var(--gold)" : "var(--border)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {active && <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--bg)" }}/>}
                    </div>
                    <div style={{ flex:1 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                        <span style={{ fontSize:13, fontWeight:600, color: active ? "var(--text)" : "var(--muted)" }}>{svc.label}</span>
                        <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.07em",
                          color: COMPLEXITY_COLOR[svc.id], background:`${COMPLEXITY_COLOR[svc.id]}20`,
                          borderRadius:3, padding:"2px 6px" }}>{svc.complexity}</span>
                        {sp && (
                          <span style={{ marginLeft:"auto", fontSize:11, color:"var(--gold)", fontWeight:600 }}>
                            ${sp.low}–${sp.high}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize:11, color:"var(--dim)", lineHeight:1.5 }}>{svc.desc}</p>
                    </div>
                  </div>
                  <button onClick={e=>{e.stopPropagation();setExpanded(exp?null:svc.id);}}
                    style={{ background:"none", border:"none", color:"var(--gold)", fontSize:11,
                      cursor:"pointer", marginTop:8, marginLeft:30, display:"flex", alignItems:"center", gap:4 }}>
                    <Info size={11}/> More details
                  </button>
                </div>
                {exp && (
                  <div style={{ padding:"0 16px 14px 46px" }}>
                    <div style={{ background:"var(--bg3)", border:"1px solid var(--border2)",
                      borderRadius:7, padding:"12px 14px" }}>
                      <p style={{ fontSize:12, color:"var(--text)", lineHeight:1.6 }}>{svc.detail}</p>
                    </div>
                    {svc.warning && (
                      <div style={{ marginTop:8, padding:"8px 12px", background:"var(--blue)15",
                        border:"1px solid var(--blue)40", borderRadius:6,
                        fontSize:11, color:"var(--blue)" }}>
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

      {/* Design Extras — only for full_construction */}
      {data.service === "full_construction" && (
        <div className="fade-up">
          <label style={{ ...labelBase, marginTop:8 }}>Design Extras</label>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {designExtras.map(de=>{
              const active = de.included || (data.extras||[]).includes(de.id);
              return (
                <div key={de.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"10px 14px", background: de.included ? "rgba(184,155,106,0.06)" : "var(--bg4)",
                  border:`1px solid ${de.included ? "rgba(184,155,106,0.2)" : "var(--border)"}`,
                  borderRadius:8, cursor: de.included ? "default" : "pointer" }}
                  onClick={()=>{
                    if(de.included) return;
                    const cur = data.extras||[];
                    set("extras", cur.includes(de.id) ? cur.filter(x=>x!==de.id) : [...cur, de.id]);
                  }}>
                  <div>
                    <span style={{ fontSize:12, color:"var(--text)" }}>{de.label}</span>
                    <p style={{ fontSize:10, color:"var(--dim)", marginTop:2 }}>{de.desc}</p>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexShrink:0 }}>
                    {de.included
                      ? <span style={{ fontSize:11, color:"var(--green)", fontWeight:600 }}>
                          {de.addOn || "Included"}
                        </span>
                      : <span style={{ fontSize:11, color:"var(--amber)", fontWeight:600 }}>+${de.price}</span>
                    }
                    {!de.included && (
                      <div style={{ width:16, height:16, borderRadius:3,
                        background: active ? "var(--gold)" : "transparent",
                        border:`1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                        display:"flex", alignItems:"center", justifyContent:"center" }}>
                        {active && <CheckCircle2 size={10} color="#141412" strokeWidth={3}/>}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEP 4: PROGRAM REQUIREMENTS ───────────────────────────
function Step4({ data, set }) {
  const roomGroups = [
    { group:"Core Rooms", rooms:[
      { id:"bedrooms",     label:"Bedrooms",              default:0 },
      { id:"bathrooms",    label:"Bathrooms",             default:0 },
      { id:"half_baths",   label:"Half Baths",            default:0 },
      { id:"living",       label:"Living Rooms",          default:0 },
      { id:"family",       label:"Family Room",           default:0 },
      { id:"double_height",label:"Double Height Living Room", default:0 },
    ]},
    { group:"Kitchen & Dining", rooms:[
      { id:"kitchen",      label:"Kitchen",               default:0 },
      { id:"kitchen_island",label:"Kitchen Island",        default:0 },
      { id:"pantry",       label:"Pantry",                default:0 },
      { id:"butler_pantry",label:"Butler Pantry",         default:0 },
      { id:"dining",       label:"Dining Room",           default:0 },
    ]},
    { group:"Utility & Storage", rooms:[
      { id:"walk_in_closet",label:"Walk In Closet",       default:0 },
      { id:"mudroom",      label:"Mudroom",               default:0 },
      { id:"laundry",      label:"Laundry Room",          default:0 },
      { id:"garage_bays",  label:"Garage Bays",           default:0 },
    ]},
    { group:"Outdoor Spaces", rooms:[
      { id:"covered_deck", label:"Covered Deck",          default:0 },
      { id:"screened_porch",label:"Screened Porch",       default:0 },
      { id:"outdoor_kitchen",label:"Outdoor Kitchen",     default:0 },
    ]},
    { group:"Special Features", rooms:[
      { id:"home_office",  label:"Home Office",           default:0 },
      { id:"fireplace",    label:"Fireplace",             default:0 },
      { id:"gym",          label:"Gym",                   default:0 },
      { id:"wine_cellar",  label:"Wine Cellar",           default:0 },
      { id:"sauna",        label:"Sauna",                 default:0 },
      { id:"elevator",     label:"Elevator",              default:0 },
    ]},
  ];

  const rooms = data.rooms || {};
  const setRoom = (id, val) => set("rooms", { ...rooms, [id]: Math.max(0, val) });

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Program Requirements</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:24 }}>What spaces does your project need? This improves estimate accuracy.</p>

      {roomGroups.map(group=>(
        <div key={group.group} style={{ marginBottom:20 }}>
          <p style={{ fontSize:10, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:10 }}>{group.group}</p>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {group.rooms.map(r=>{
              const qty = rooms[r.id] || 0;
              return (
                <div key={r.id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"9px 14px", background:"var(--bg4)", border:"1px solid var(--border)",
                  borderRadius:8 }}>
                  <span style={{ fontSize:12, color: qty>0 ? "var(--text)" : "var(--muted)" }}>{r.label}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <button onClick={()=>setRoom(r.id, qty-1)} style={{
                      width:26, height:26, borderRadius:6, background:"var(--bg3)",
                      border:"1px solid var(--border)", color:"var(--muted)", fontSize:16,
                      display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>−</button>
                    <span style={{ fontSize:13, fontWeight:600, minWidth:20, textAlign:"center",
                      color: qty>0 ? "var(--gold)" : "var(--dim)" }}>{qty}</span>
                    <button onClick={()=>setRoom(r.id, qty+1)} style={{
                      width:26, height:26, borderRadius:6, background:"var(--bg3)",
                      border:"1px solid var(--border)", color:"var(--muted)", fontSize:16,
                      display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Special Requirements */}
      <div>
        <label style={labelBase}>Special Requirements (optional)</label>
        <textarea value={data.specialReq||""}
          onChange={e=>set("specialReq",e.target.value)}
          placeholder="e.g. ADA accessibility, horse theater, specific materials..."
          rows={3}
          style={{ ...inputBase, resize:"vertical", lineHeight:1.6 }}/>
      </div>
    </div>
  );
}

// ── STEP 5: FILE UPLOADS ─────────────────────────────────────
const UPLOAD_DOCS = [
  { id:"survey",     label:"Property Survey / Plot Plan",    required:true  },
  { id:"site_photos",label:"Site Photos",                    required:true  },
  { id:"measurements",label:"Measurements / Dimensions",    required:true  },
  { id:"reference",  label:"Reference Images / Inspiration", required:false },
  { id:"existing",   label:"Existing Plans or Blueprints",   required:false },
  { id:"sketches",   label:"Sketches / Hand Drawings",       required:false },
];

function Step5({ data, set }) {
  const uploads = data.uploads || {};
  const setUpload = (id, file) => set("uploads", { ...uploads, [id]: file });
  const allRequired = UPLOAD_DOCS.filter(d=>d.required).every(d=>uploads[d.id]);
  const allUploaded = UPLOAD_DOCS.every(d=>uploads[d.id]);

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Upload Files</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:8 }}>Share reference files, photos, or plan sets to help us understand your vision.</p>

      <div style={{ marginBottom:16, padding:"10px 14px", background:"var(--bg4)",
        border:"1px solid var(--border2)", borderRadius:8 }}>
        <p style={{ fontSize:11, color:"var(--muted)", marginBottom:6 }}>Helpful documents include:</p>
        <ul style={{ paddingLeft:16 }}>
          {["Property Survey / Plot Plan","Site Photos","Measurements","Reference Images","Existing Plans or Blueprints","Lot Plan or Drawings"].map(i=>(
            <li key={i} style={{ fontSize:11, color:"var(--dim)", marginBottom:3 }}>• {i}</li>
          ))}
        </ul>
        <p style={{ fontSize:10, color:"var(--dim)", marginTop:8 }}>PDF, JPG, PNG, DWG · Max 25MB per file</p>
      </div>

      {/* Drag & drop zone */}
      <label style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
        border:"2px dashed var(--border)", borderRadius:10, padding:"24px",
        cursor:"pointer", marginBottom:16, background:"var(--bg4)",
        transition:"border-color 0.15s" }}>
        <Upload size={24} color="var(--gold)" style={{ marginBottom:10 }}/>
        <p style={{ fontSize:13, fontWeight:500, marginBottom:4 }}>Drag & drop or <span style={{ color:"var(--gold)" }}>click to browse</span></p>
        <p style={{ fontSize:10, color:"var(--dim)" }}>PDF, JPG, PNG, DWG · Max 25MB per file</p>
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.dwg" style={{ display:"none" }}
          onChange={e=>{
            // Distribute files to slots
            Array.from(e.target.files||[]).forEach((file,i)=>{
              const slot = UPLOAD_DOCS[i];
              if(slot) setUpload(slot.id, file);
            });
          }}/>
      </label>

      {/* Individual upload slots */}
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {UPLOAD_DOCS.map(doc=>{
          const file = uploads[doc.id];
          return (
            <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:12,
              padding:"11px 14px", background: file ? "var(--green-bg)" : "var(--bg4)",
              border:`1px solid ${file ? "rgba(61,153,112,0.3)" : "var(--border)"}`,
              borderRadius:8, transition:"all 0.2s" }}>
              <div style={{ width:28, height:28, borderRadius:6, flexShrink:0,
                background: file ? "var(--green)" : "var(--bg3)",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {file ? <CheckCircle2 size={14} color="#fff"/> : <Upload size={13} color="var(--dim)"/>}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <p style={{ fontSize:12, fontWeight:500, color: file ? "var(--text)" : "var(--muted)" }}>
                  {doc.label}
                  {doc.required && !file && <span style={{ color:"var(--red)", marginLeft:4, fontSize:10 }}>*obrigatório</span>}
                </p>
                {file && <p style={{ fontSize:10, color:"var(--green)", marginTop:2 }}>{file.name} · {(file.size/1024).toFixed(0)} KB</p>}
              </div>
              <label style={{ fontSize:11, color: file ? "var(--green)" : "var(--gold)",
                cursor:"pointer", fontWeight:600, flexShrink:0 }}>
                {file ? "Trocar" : "Upload"}
                <input type="file" accept=".pdf,.jpg,.jpeg,.png,.dwg" style={{ display:"none" }}
                  onChange={e=>{ const f=e.target.files?.[0]; if(f) setUpload(doc.id, f); }}/>
              </label>
              {file && (
                <button onClick={()=>setUpload(doc.id, null)} style={{ background:"none", border:"none",
                  color:"var(--dim)", cursor:"pointer", padding:2 }}>
                  <X size={13}/>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {allUploaded && (
        <div className="fade-up" style={{ marginTop:14, padding:"10px 14px",
          background:"var(--green-bg)", border:"1px solid rgba(61,153,112,0.3)",
          borderRadius:8, display:"flex", alignItems:"center", gap:8 }}>
          <CheckCircle2 size={14} color="var(--green)"/>
          <span style={{ fontSize:12, color:"var(--green)", fontWeight:600 }}>
            All documents uploaded — select your delivery speed on the next step.
          </span>
        </div>
      )}
      {!allRequired && (
        <p style={{ marginTop:10, fontSize:11, color:"var(--amber)" }}>
          ⚠ Upload the required documents to unlock Rush/Express delivery options.
        </p>
      )}
    </div>
  );
}

// ── STEP 6: RUSH FEES ────────────────────────────────────────
function Step6({ data, set }) {
  const uploads = data.uploads || {};
  const allRequired = UPLOAD_DOCS.filter(d=>d.required).every(d=>uploads[d.id]);
  const isPdfCad = data.service === "pdf_to_cad";

  const sqft = data.width && data.length ? data.width * data.length : 144;
  const base = calcPrice(sqft, data.service, "standard");
  const rush = calcPrice(sqft, data.service, "rush");
  const expr = calcPrice(sqft, data.service, "express");

  const options = [
    {
      id:"standard",
      label:"Standard",
      badge:"Included",
      badgeColor:"var(--green)",
      preview:"8–16 Business Days",
      final:"Final 25–30 Days",
      price: base,
      locked:false,
    },
    {
      id:"rush",
      label:"Rush",
      badge:"+40%",
      badgeColor:"var(--amber)",
      preview:"5–8 Business Days",
      final:"15–20 Business Days After Approval",
      price: rush,
      locked:!allRequired,
      popular:true,
    },
    {
      id:"express",
      label:"Express",
      badge:"+60%",
      badgeColor:"var(--red)",
      preview:"2–4 Business Days",
      final:"7–12 Business Days After Approval",
      price: expr,
      locked:!allRequired,
      warning:"Contact us on WhatsApp before selecting — timeline varies by project size",
    },
  ];

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Rush Fees</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:16 }}>
        Upload your project files to unlock faster delivery options and more accurate pricing.
      </p>

      {/* Uploaded files summary */}
      {Object.values(uploads).filter(Boolean).length > 0 && (
        <div style={{ marginBottom:16 }}>
          {UPLOAD_DOCS.map(doc=>{
            const file = uploads[doc.id];
            if(!file) return null;
            return (
              <div key={doc.id} style={{ display:"flex", alignItems:"center", gap:10,
                padding:"8px 12px", marginBottom:6, background:"var(--bg4)",
                border:"1px solid rgba(61,153,112,0.25)", borderRadius:7 }}>
                <CheckCircle2 size={13} color="var(--green)"/>
                <div style={{ flex:1 }}>
                  <span style={{ fontSize:12, color:"var(--text)" }}>{doc.label}</span>
                  <span style={{ fontSize:10, color:"var(--dim)", marginLeft:8 }}>{file.name} · {(file.size/1024).toFixed(0)} KB</span>
                </div>
              </div>
            );
          })}
          {allRequired && (
            <div style={{ padding:"8px 14px", background:"var(--green-bg)",
              border:"1px solid rgba(61,153,112,0.3)", borderRadius:7, marginBottom:16,
              display:"flex", alignItems:"center", gap:6 }}>
              <CheckCircle2 size={13} color="var(--green)"/>
              <span style={{ fontSize:12, color:"var(--green)", fontWeight:600 }}>All documents uploaded — select your delivery speed below.</span>
            </div>
          )}
        </div>
      )}

      <label style={{ ...labelBase, marginBottom:12 }}>Select Your Delivery Speed</label>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {options.map(opt=>{
          const active = data.delivery === opt.id;
          const locked = opt.locked || (isPdfCad && opt.id !== "standard");
          return (
            <div key={opt.id} style={{ opacity: locked ? 0.5 : 1 }}>
              {opt.popular && !locked && (
                <div style={{ padding:"6px 14px", background:"var(--amber-bg)",
                  border:"1px solid rgba(212,131,10,0.25)", borderRadius:"8px 8px 0 0",
                  fontSize:10, fontWeight:700, color:"var(--amber)", letterSpacing:"0.08em" }}>
                  ⭐ MOST CLIENTS CHOOSE RUSH — REDUCES DELAYS IN PERMITTING AND CONSTRUCTION
                </div>
              )}
              {opt.warning && !locked && (
                <div style={{ padding:"6px 14px", background:"var(--red-bg)",
                  border:"1px solid rgba(192,57,43,0.25)", borderRadius:"8px 8px 0 0",
                  fontSize:10, fontWeight:700, color:"#e05c4e", letterSpacing:"0.06em" }}>
                  ⚠ {opt.warning}
                </div>
              )}
              <div onClick={()=>!locked && set("delivery", opt.id)} style={{
                background: active ? "rgba(184,155,106,0.08)" : "var(--bg4)",
                border:`1.5px solid ${active ? "var(--gold)" : "var(--border)"}`,
                borderRadius: (opt.popular||opt.warning) && !locked ? "0 0 10px 10px" : 10,
                padding:"14px 16px", cursor: locked ? "not-allowed" : "pointer",
                transition:"all 0.15s" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom: active ? 10 : 0 }}>
                  <div style={{ width:18, height:18, borderRadius:"50%",
                    background: active ? "var(--gold)" : "transparent",
                    border:`2px solid ${active ? "var(--gold)" : "var(--border)"}`,
                    display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    {active && <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--bg)" }}/>}
                  </div>
                  <span style={{ fontSize:13, fontWeight:600, color: active ? "var(--text)" : "var(--muted)" }}>
                    {opt.label}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, color:opt.badgeColor,
                    background:`${opt.badgeColor}20`, borderRadius:4, padding:"2px 8px" }}>
                    {opt.badge}
                  </span>
                  {opt.price && (
                    <span style={{ marginLeft:"auto", fontFamily:"var(--serif)", fontSize:13,
                      fontWeight:700, color: active ? "var(--gold)" : "var(--dim)" }}>
                      ${opt.price.low}–${opt.price.high}
                    </span>
                  )}
                </div>
                {active && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginLeft:28, marginTop:8 }}>
                    <div style={{ background:"var(--bg3)", borderRadius:7, padding:"10px 12px" }}>
                      <p style={{ fontSize:10, color:"var(--dim)", marginBottom:3 }}>Design Preview</p>
                      <p style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{opt.preview}</p>
                    </div>
                    <div style={{ background:"var(--bg3)", borderRadius:7, padding:"10px 12px" }}>
                      <p style={{ fontSize:10, color:"var(--dim)", marginBottom:3 }}>Final Drawing Set</p>
                      <p style={{ fontSize:12, fontWeight:600, color:"var(--text)" }}>{opt.final}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {isPdfCad && (
        <div style={{ marginTop:12, padding:"10px 14px", background:"var(--blue)15",
          border:"1px solid var(--blue)40", borderRadius:8,
          fontSize:11, color:"var(--blue)" }}>
          ℹ️ Rush/Express delivery is not available for PDF to CAD Conversion.
        </div>
      )}
    </div>
  );
}

// ── STEP 7: REVIEW & SUBMIT ──────────────────────────────────
function Step7({ data, onSubmit }) {
  const sqft = data.width && data.length ? data.width * data.length : null;
  const price = calcPrice(sqft, data.service, data.delivery||"standard");
  const [agreed, setAgreed] = useState(false);

  const serviceName = { full_construction:"Full Construction", floor_plans_only:"Floor Plans Only", pdf_to_cad:"PDF to CAD Conversion" };
  const uploadedCount = Object.values(data.uploads||{}).filter(Boolean).length;

  return (
    <div className="fade-up">
      <h2 style={{ fontFamily:"var(--serif)", fontSize:18, fontWeight:700, marginBottom:6 }}>Review & Submit</h2>
      <p style={{ fontSize:12, color:"var(--muted)", marginBottom:20 }}>Confirm your project details and estimated fee below.</p>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {/* Client & Location */}
        <div style={{ background:"var(--bg4)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:12 }}>Client & Location</p>
          {[
            ["City / State", `${data.city||"–"}, ${data.state||"–"}`],
            ["Country", data.country === "BR" ? "Brazil" : "United States"],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0",
              borderBottom:"1px solid var(--border2)" }}>
              <span style={{ fontSize:11, color:"var(--muted)" }}>{k}</span>
              <span style={{ fontSize:11 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Project Dimensions */}
        <div style={{ background:"var(--bg4)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:12 }}>Project Dimensions</p>
          {[
            ["Width (ft)", data.width||"–"],
            ["Length (ft)", data.length||"–"],
            ["Base Area", sqft ? `${sqft} sqft` : "–"],
            ["Levels", (data.levels||["Ground Floor"]).length],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0",
              borderBottom:"1px solid var(--border2)" }}>
              <span style={{ fontSize:11, color:"var(--muted)" }}>{k}</span>
              <span style={{ fontSize:11 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Scope & Services */}
        <div style={{ background:"var(--bg4)", border:"1px solid var(--border)", borderRadius:10, padding:"14px 16px" }}>
          <p style={{ fontSize:10, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em",
            textTransform:"uppercase", marginBottom:12 }}>Scope & Services</p>
          {[
            ["Project Type", data.projectType?.replace(/_/g," ")||"–"],
            ["Engagement", serviceName[data.service]||"–"],
            ["Files Uploaded", `${uploadedCount} / ${UPLOAD_DOCS.length}`],
          ].map(([k,v])=>(
            <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0",
              borderBottom:"1px solid var(--border2)" }}>
              <span style={{ fontSize:11, color:"var(--muted)" }}>{k}</span>
              <span style={{ fontSize:11 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Estimated Design Fee */}
        {price && (
          <div style={{ background:"var(--bg4)", border:"1px solid rgba(184,155,106,0.25)", borderRadius:10, padding:"14px 16px" }}>
            <p style={{ fontSize:10, fontWeight:700, color:"var(--gold)", letterSpacing:"0.1em",
              textTransform:"uppercase", marginBottom:12 }}>Estimated Design Fee</p>
            <p style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:6 }}>
              ${price.low.toLocaleString()} – ${price.high.toLocaleString()}
            </p>
            <div style={{ borderTop:"1px solid var(--border2)", paddingTop:8 }}>
              {[
                [serviceName[data.service], `$${price.base}`],
                ...(data.delivery==="rush" ? [["Rush Fee (+40%)", `+$${price.rush}`]] : []),
                ...(data.delivery==="express" ? [["Express Fee (+60%)", `+$${price.express}`]] : []),
                ["Project Complexity", "Standard"],
              ].map(([k,v])=>(
                <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0" }}>
                  <span style={{ fontSize:11, color:"var(--muted)" }}>{k}</span>
                  <span style={{ fontSize:11, fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legal disclaimer */}
      <div style={{ padding:"12px 14px", background:"var(--red-bg)",
        border:"1px solid rgba(192,57,43,0.25)", borderRadius:8, marginBottom:16 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
          <AlertTriangle size={14} color="#e05c4e" style={{ flexShrink:0, marginTop:1 }}/>
          <div>
            <p style={{ fontSize:11, fontWeight:700, color:"#e05c4e", marginBottom:4 }}>Important Legal Disclosure</p>
            <p style={{ fontSize:11, color:"var(--muted)", lineHeight:1.6 }}>
              This is a DARA Studio drafting and design service. It DOES NOT include professional engineering
              (PE/SE stamped) or architectural stamps always required for building permit submission.
              The client is solely responsible for retaining and paying a licensed Engineer or Architect to review,
              certify, and stamp the final drawings for municipal approval.
            </p>
          </div>
        </div>
      </div>

      {/* Agree checkbox */}
      <div style={{ display:"flex", alignItems:"flex-start", gap:10, marginBottom:20, cursor:"pointer" }}
        onClick={()=>setAgreed(a=>!a)}>
        <div style={{ width:18, height:18, borderRadius:4, flexShrink:0, marginTop:1,
          background: agreed ? "var(--gold)" : "transparent",
          border:`1.5px solid ${agreed ? "var(--gold)" : "var(--border)"}`,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          {agreed && <CheckCircle2 size={11} color="#141412" strokeWidth={3}/>}
        </div>
        <p style={{ fontSize:12, color:"var(--muted)", lineHeight:1.6 }}>
          I agree with the estimate and wish to proceed. I understand this is an approximate estimate.
          Final pricing will be confirmed upon project review.
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
        <button onClick={()=>agreed && onSubmit()} disabled={!agreed} style={{
          background: agreed ? "var(--gold)" : "var(--bg4)",
          border:`1px solid ${agreed ? "var(--gold)" : "var(--border)"}`,
          borderRadius:9, padding:"13px", fontSize:14, fontWeight:700,
          color: agreed ? "#141412" : "var(--dim)",
          cursor: agreed ? "pointer" : "not-allowed",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          transition:"all 0.2s" }}>
          <Zap size={16}/> Accept & Continue
        </button>
        <button style={{ background:"none", border:"1px solid var(--border)", borderRadius:9,
          padding:"13px", fontSize:13, color:"var(--muted)", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          💾 Save for Later
        </button>
      </div>
    </div>
  );
}

// ── SUCCESS SCREEN ───────────────────────────────────────────
function SuccessScreen({ data, onClose }) {
  const sqft = data.width && data.length ? data.width * data.length : null;
  const price = calcPrice(sqft, data.service, data.delivery||"standard");
  const projectCode = `DARA-${Date.now().toString().slice(-4)}`;
  const expiresAt = new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString("en-US",{ month:"long", day:"numeric", year:"numeric" });

  return (
    <div className="fade-up" style={{ textAlign:"center", padding:"40px 20px" }}>
      <div style={{ width:64, height:64, borderRadius:"50%", background:"var(--green-bg)",
        border:"2px solid var(--green)", display:"flex", alignItems:"center",
        justifyContent:"center", margin:"0 auto 20px" }}>
        <CheckCircle2 size={28} color="var(--green)"/>
      </div>
      <h2 style={{ fontFamily:"var(--serif)", fontSize:22, fontWeight:700, marginBottom:8 }}>
        Estimate Submitted!
      </h2>
      <p style={{ fontSize:13, color:"var(--muted)", lineHeight:1.7, marginBottom:24, maxWidth:420, margin:"0 auto 24px" }}>
        Your project request has been created. Our team will review it and contact you within 2–3 business days.
      </p>

      <div style={{ background:"var(--bg4)", border:"1px solid rgba(184,155,106,0.25)",
        borderRadius:12, padding:"20px", marginBottom:20, textAlign:"left", maxWidth:380, margin:"0 auto 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:12 }}>
          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:700, color:"var(--gold)" }}>{projectCode}</span>
          <span style={{ fontSize:11, background:"var(--amber-bg)", color:"var(--amber)",
            borderRadius:4, padding:"2px 8px", fontWeight:600 }}>Pending Review</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0",
          borderBottom:"1px solid var(--border2)" }}>
          <span style={{ fontSize:12, color:"var(--muted)" }}>Address</span>
          <span style={{ fontSize:12 }}>{data.city}, {data.state}</span>
        </div>
        {price && (
          <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0",
            borderBottom:"1px solid var(--border2)" }}>
            <span style={{ fontSize:12, color:"var(--muted)" }}>Estimate</span>
            <span style={{ fontSize:12, fontWeight:700, color:"var(--gold)" }}>
              ${price.low}–${price.high}
            </span>
          </div>
        )}
        <div style={{ display:"flex", justifyContent:"space-between", padding:"6px 0" }}>
          <span style={{ fontSize:12, color:"var(--muted)" }}>Valid until</span>
          <span style={{ fontSize:12 }}>{expiresAt}</span>
        </div>
      </div>

      <div style={{ padding:"10px 16px", background:"var(--amber-bg)",
        border:"1px solid rgba(212,131,10,0.25)", borderRadius:8, marginBottom:20,
        maxWidth:380, margin:"0 auto 20px" }}>
        <p style={{ fontSize:11, color:"var(--amber)" }}>
          ⏱ This estimate is valid for <strong>30 days</strong>. After {expiresAt}, the project will be marked as <strong>Hold</strong>.
        </p>
      </div>

      <button onClick={onClose} style={{ background:"var(--gold)", border:"none",
        borderRadius:9, padding:"12px 32px", fontSize:13, fontWeight:700,
        color:"#141412", cursor:"pointer", marginTop:8 }}>
        View My Projects →
      </button>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function EstimateForm({ onClose, onSubmit }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [data, setData] = useState({
    country:"US", levels:["Ground Floor / Main Level"], delivery:"standard",
    service: null, uploads:{},
  });

  const set = (key, value) => setData(d => ({ ...d, [key]: value }));

  const canNext = () => {
    if(step === 0) return data.country && data.city && data.state;
    if(step === 1) return data.width && data.length && (data.levels||[]).length > 0;
    if(step === 2) return data.service && data.projectType;
    return true;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit && onSubmit(data);
  };

  if(submitted) return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"var(--sans)" }}>
      <style>{css}</style>
      <SuccessScreen data={data} onClose={onClose}/>
    </div>
  );

  const StepComponent = [Step1,Step2,Step3,Step4,Step5,Step6,Step7][step];

  return (
    <div style={{ background:"var(--bg)", minHeight:"100vh", fontFamily:"var(--sans)" }}>
      <style>{css}</style>

      {/* Top bar */}
      <div style={{ background:"var(--bg2)", borderBottom:"1px solid var(--border2)",
        padding:"0 28px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:0, zIndex:40 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, background:"var(--gold)", borderRadius:6,
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontFamily:"var(--serif)", fontWeight:700, fontSize:14, color:"#141412" }}>D</span>
          </div>
          <div>
            <span style={{ fontFamily:"var(--serif)", fontSize:12, fontWeight:700, color:"var(--text)" }}>DARA Studio</span>
            <span style={{ fontSize:11, color:"var(--dim)", marginLeft:8 }}>Get Your Project Estimate</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ background:"none", border:"none",
            color:"var(--dim)", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", gap:5 }}>
            <X size={14}/> Cancel
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ maxWidth:900, margin:"0 auto", padding:"28px 24px" }}>
        <StepBar current={step}/>

        <div style={{ display:"flex", gap:24, alignItems:"flex-start" }}>
          {/* Form area */}
          <div style={{ flex:1, minWidth:0 }}>
            <StepComponent data={data} set={set} onSubmit={handleSubmit}/>

            {/* Navigation */}
            {step < 6 && (
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:32 }}>
                <button onClick={()=>setStep(s=>Math.max(0,s-1))} disabled={step===0}
                  style={{ display:"flex", alignItems:"center", gap:6, background:"none",
                    border:"1px solid var(--border)", borderRadius:8, padding:"10px 18px",
                    fontSize:13, color: step===0 ? "var(--dim)" : "var(--muted)",
                    cursor: step===0 ? "not-allowed" : "pointer" }}>
                  <ChevronLeft size={15}/> Back
                </button>
                <button onClick={()=>setStep(s=>Math.min(6,s+1))} disabled={!canNext()}
                  style={{ display:"flex", alignItems:"center", gap:6,
                    background: canNext() ? "var(--gold)" : "var(--bg4)",
                    border:"none", borderRadius:8, padding:"10px 22px",
                    fontSize:13, fontWeight:700,
                    color: canNext() ? "#141412" : "var(--dim)",
                    cursor: canNext() ? "pointer" : "not-allowed",
                    transition:"all 0.15s" }}>
                  Next <ChevronRight size={15}/>
                </button>
              </div>
            )}
          </div>

          {/* Pricing sidebar */}
          <PricingSidebar data={data}/>
        </div>
      </div>
    </div>
  );
}
