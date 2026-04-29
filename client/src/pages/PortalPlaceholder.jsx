/**
 * PortalPlaceholder.jsx  —  DARA Studio · Client Portal (placeholder)
 */

export default function PortalPlaceholder() {
  return (
    <div className="page-center" style={{ gap: 16 }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: "var(--a)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: "#fff", fontStyle: "italic" }}>D</span>
      </div>
      <h1 style={{ color: "var(--tx)", fontSize: 22, fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
        Client Portal
      </h1>
      <p style={{ color: "var(--mu)", fontSize: 13, textAlign: "center", maxWidth: 320 }}>
        Bem-vindo ao portal DARA Studio. Seu acesso está sendo configurado.
      </p>
      <a href="/" style={{
        marginTop: 8, padding: "10px 22px", borderRadius: 8,
        border: "1.5px solid rgba(255,255,255,.12)", color: "var(--mu)",
        fontSize: 13, textDecoration: "none",
      }}>
        ← Voltar ao início
      </a>
    </div>
  );
}
