import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function VeraAssistant() {
  const { lang, setLang, theme, isVeraOpen, openVera, closeVera, veraMessage } = useAppContext();
  const [messages, setMessages] = useState([]);

  const T = {
    EN: {
      name: 'VÉRA',
      role: 'Virtual Engineering & Rendering Assistant',
      welcome: 'Hello! I am VÉRA. How can I assist your project today?',
      input: 'Ask VÉRA anything...',
    },
    PT: {
      name: 'VÉRA',
      role: 'Assistente Virtual de Engenharia e Renderização',
      welcome: 'Olá! Eu sou a VÉRA. Como posso ajudar no seu projeto hoje?',
      input: 'Pergunte qualquer coisa à VÉRA...',
    }
  }[lang];

  useEffect(() => {
    const welcomeText = veraMessage || T.welcome;
    
    setMessages(prev => {
      // If the chat is empty or only contains a welcome message, update it to the new language/context
      if (prev.length === 0 || (prev.length === 1 && prev[0].isWelcome)) {
        return [{ id: 'welcome', text: welcomeText, sender: 'vera', isWelcome: true }];
      }
      // If there's an ongoing conversation, we keep it but update the initial welcome if it exists
      return prev.map(m => m.isWelcome ? { ...m, text: welcomeText } : m);
    });
  }, [lang, veraMessage, T.welcome]);

  const toggleAssistant = () => isVeraOpen ? closeVera() : openVera();

  return (
    <div className="vera-assistant-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
      {/* Floating Button / Avatar */}
      {!isVeraOpen && (
        <button 
          onClick={toggleAssistant}
          style={{
            width: '64px', height: '64px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))',
            border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px var(--neon-glow)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            visibility: 'visible', opacity: 1,
            padding: '2px'
          }}
          className="vera-trigger animate-bounce-subtle"
        >
          <img 
            src="/assets/vera-avatar.png" 
            alt="VÉRA AI"
            style={{ 
              width: '100%', height: '100%', borderRadius: '50%', 
              objectFit: 'cover', border: '1px solid var(--color-neon-purple)' 
            }} 
          />
        </button>
      )}

      {/* Assistant Window */}
      {isVeraOpen && (
        <div className="vera-window glass-premium animate-float-up" style={{
          width: '360px', height: '500px', borderRadius: '24px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div className="vera-header" style={{
            background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))',
            padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/assets/vera-avatar.png" 
                alt="VÉRA"
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', 
                  border: '1px solid rgba(255,255,255,0.4)',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{T.name}</h4>
                <p style={{ margin: 0, fontSize: '10px', opacity: 0.8 }}>{T.role}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Internal Lang Switcher */}
              <button 
                onClick={() => setLang(lang === 'EN' ? 'PT' : 'EN')}
                style={{
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px', padding: '4px 8px', color: '#fff', fontSize: '10px', fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                {lang}
              </button>
              <button onClick={toggleAssistant} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="vera-messages" style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', 
                gap: '10px', 
                alignSelf: msg.sender === 'vera' ? 'flex-start' : 'flex-end',
                flexDirection: msg.sender === 'vera' ? 'row' : 'row-reverse',
                maxWidth: '90%'
              }}>
                {msg.sender === 'vera' && (
                  <img 
                    src="/assets/vera-avatar.png" 
                    alt="V" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)', flexShrink: 0, marginTop: '2px' }} 
                  />
                )}
                <div style={{
                  padding: '12px 16px', 
                  borderRadius: msg.sender === 'vera' ? '2px 16px 16px 16px' : '16px 16px 2px 16px',
                  background: msg.sender === 'vera' ? 'rgba(255,255,255,0.05)' : 'var(--brand-purple)',
                  color: msg.sender === 'vera' ? 'inherit' : '#fff', 
                  fontSize: '13px', 
                  lineHeight: '1.5',
                  border: msg.sender === 'vera' ? '1px solid var(--glass-border)' : 'none',
                  boxShadow: msg.sender === 'vera' ? 'none' : '0 4px 15px rgba(123, 31, 162, 0.3)'
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ padding: '20px', borderTop: '1px solid var(--glass-border)' }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder={T.input}
                style={{
                  width: '100%', height: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                  borderRadius: '20px', padding: '0 45px 0 15px', color: 'inherit', fontSize: '12px', outline: 'none'
                }}
              />
              <button style={{
                position: 'absolute', right: '5px', top: '5px', width: '30px', height: '30px',
                borderRadius: '50%', background: 'var(--brand-purple)', border: 'none', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}>
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
