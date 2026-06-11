import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function BackButton() {
  const navigate = useNavigate();
  const { lang } = useAppContext();
  
  const text = lang === "EN" ? "Back to Home" : `Voltar ao Início`;

  return (
    <button 
      className="back-to-home-btn"
      onClick={() => navigate("/")}
      aria-label={text}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{text}</span>
    </button>
  );
}
