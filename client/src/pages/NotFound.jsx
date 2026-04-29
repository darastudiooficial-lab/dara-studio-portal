/**
 * NotFound.jsx  —  DARA Studio · 404
 */

export default function NotFound() {
  return (
    <div className="page-center">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 64, color: "rgba(99,102,241,.3)", fontWeight: 500 }}>404</span>
      <p style={{ color: "var(--mu)", fontSize: 14 }}>Page not found.</p>
      <a href="/" style={{ color: "var(--a)", fontSize: 13, textDecoration: "none" }}>← Go home</a>
    </div>
  );
}
