import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function GlobalControls({ style = {} }) {
  const { lang, toggleLang, theme, toggleTheme } = useAppContext();

  // Handle data-theme attribute on <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dara-theme', theme);
  }, [theme]);

  // Inject animated favicon
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%236366f1'%3E%3Canimate attributeName='stop-color' values='%236366f1;%23a78bfa;%236366f1' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3Cstop offset='100%25' stop-color='%23a78bfa'%3E%3Canimate attributeName='stop-color' values='%23a78bfa;%236366f1;%23a78bfa' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='32' height='32' rx='8' fill='url(%23g)'/%3E%3Ctext x='16' y='22' font-family='Georgia,serif' font-size='18' font-weight='700' fill='white' text-anchor='middle'%3ED%3C/text%3E%3C/svg%3E`;
    }
  }, []);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: 10, 
      background: "var(--bg3)", 
      padding: "4px 8px", 
      borderRadius: "24px", 
      border: "1px solid var(--border)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      ...style 
    }}>
      <button 
        onClick={toggleTheme} 
        className="dark-toggle"
        title={theme === "dark" ? "Modo Claro" : "Modo Escuro"}
      />
      <div style={{ width: 1, height: 14, background: "var(--border)" }} />
      <button 
        onClick={toggleLang} 
        style={{ 
          background: "none", 
          border: "none", 
          color: "var(--tx)", 
          fontSize: 11, 
          fontWeight: 800, 
          cursor: "pointer",
          padding: "4px 6px",
          minWidth: 28,
          textAlign: "center",
          fontFamily: "var(--font-sans)"
        }}
        title="Alterar Idioma"
      >
        {lang.toUpperCase()}
      </button>
    </div>
  );
}
