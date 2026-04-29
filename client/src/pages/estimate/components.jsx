import { STEPS } from "./constants";

export function Stepper({ current }) {
  return (
    <div className="wz-stepper" style={{ width: "100%" }}>
      {STEPS.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "future";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? "1" : "none" }}>
            <div className={`wz-step-dot ${state}`} title={label} style={{ cursor: "default" }}>
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

export function Sidebar({ estimate }) {
  const { lo, hi, confidence, breakdown } = estimate;
  const gradColor = confidence < 40 ? "#ef4444" : confidence < 70 ? "#f59e0b" : "#10b981";
  return (
    <div className="wz-sidebar">
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)" }}>Estimate Confidence</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: gradColor, fontWeight: 500 }}>{confidence}%</span>
        </div>
        <div className="wz-conf-track">
          <div className="wz-conf-fill" style={{ width: `${confidence}%`, background: `linear-gradient(90deg, ${gradColor} 0%, ${gradColor}99 100%)` }} />
        </div>
        <p style={{ fontSize: 10, color: "var(--dm)", marginTop: 6 }}>
          {confidence < 40 ? "Add more details to improve accuracy" : confidence < 70 ? "Getting closer — keep going" : "High confidence estimate"}
        </p>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 10 }}>Live Estimate</p>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "var(--tx)", fontStyle: "italic" }}>{lo}</span>
          <span style={{ color: "var(--dm)", fontSize: 12 }}>—</span>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "var(--mu)" }}>{hi}</span>
        </div>
        <p style={{ fontSize: 10, color: "var(--dm)", marginTop: 4 }}>Final quote after review call</p>
      </div>
      {breakdown.length > 0 && (
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 18 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mu)", marginBottom: 10 }}>Cost Breakdown</p>
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

export function Counter({ value, onChange, min = 0, max = 20 }) {
  return (
    <div className="wz-counter">
      <button className="wz-counter-btn" onClick={() => onChange(Math.max(min, value - 1))}>−</button>
      <div className="wz-counter-val">{value}</div>
      <button className="wz-counter-btn" onClick={() => onChange(Math.min(max, value + 1))}>+</button>
    </div>
  );
}

export function SectionTitle({ label, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 400, fontStyle: "italic", color: "var(--tx)", marginBottom: 6 }}>{label}</h2>
      {sub && <p style={{ fontSize: 13, color: "var(--mu)", lineHeight: 1.6 }}>{sub}</p>}
    </div>
  );
}

export function FieldGroup({ children, style }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>{children}</div>;
}
