import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function GlobalControls({ style = {} }) {
  const { lang, toggleLang, theme, toggleTheme } = useAppContext();

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
      ...style 
    }}>
      <button 
        onClick={toggleTheme} 
        style={{ 
          background: "none", 
          border: "none", 
          color: "var(--mu)", 
          cursor: "pointer", 
          fontSize: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "4px"
        }}
        title={theme === "dark" ? "Light Mode" : "Dark Mode"}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </button>
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
          textAlign: "center"
        }}
        title="Change Language"
      >
        {lang}
      </button>
    </div>
  );
}
