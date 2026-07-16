import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function VeraAssistant() {
  const { lang, setLang, isVeraOpen, openVera, closeVera, veraMessage } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { id: Date.now(), text: inputMessage, sender: 'user' }];
    setMessages(newMessages);
    setInputMessage("");

    // Simulate VÉRA response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: lang === 'EN' 
          ? "I am currently in presentation mode. My AI core will be connected in a future update." 
          : `No momento, estou em modo de apresentação. Meu núcleo de IA será conectado em uma atualização futura.`, 
        sender: 'vera' 
      }]);
    }, 1000);
  };

  const T = {
    EN: {
      name: `VÉRA`,
      role: 'Virtual Engineering & Rendering Assistant',
      welcome: `Hello! I am VÉRA. How can I assist your project today?`,
      input: `Ask VÉRA anything...`,
    },
    PT: {
      name: `VÉRA`,
      role: `Assistente Virtual de Engenharia e Renderização`,
      welcome: `Olá! Eu sou a VÉRA. Como posso ajudar no seu projeto hoje?`,
      input: `Pergunte qualquer coisa à VÉRA...`,
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
    <div className="vera-assistant-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '16px' }}>
      
      {/* Floating WhatsApp Button */}
      {!isVeraOpen && (
        <a 
          href="https://wa.me/" 
          target="_blank"
          rel="noreferrer"
          className="whatsapp-float-btn"
          style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: '#A1824A',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(161, 130, 74, 0.4)',
            color: '#FFF', textDecoration: 'none',
            transition: 'transform 0.3s ease',
            marginRight: '4px' /* Align center with Vera's 64px button */
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </a>
      )}

      {/* Floating Button / Avatar */}
      {!isVeraOpen && (
        <div className="vera-trigger-container">
          <span className="vera-tooltip">DARA AI · Online</span>
          <button 
            onClick={toggleAssistant}
            style={{
              width: '64px', height: '64px', borderRadius: '50%', 
              background: 'linear-gradient(135deg, #A1824A, #8F723E)',
              border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(156, 124, 58, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              padding: '2px', overflow: 'hidden'
            }}
            className="vera-trigger animate-bounce-subtle"
          >
            <img 
              src="/assets/vera-avatar.jpg" 
              alt={`VÉRA AI`}
              style={{ 
                width: '100%', height: '100%', borderRadius: '50%', 
                objectFit: 'cover', border: '1px solid rgba(255,255,255,0.2)' 
              }} 
            />
          </button>
        </div>
      )}

      {/* Assistant Window */}
      {isVeraOpen && (
        <div className="vera-window glass-premium animate-float-up" style={{
          width: '360px', height: '500px', borderRadius: '24px', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Header */}
          <div className="vera-header" style={{
            background: 'linear-gradient(135deg, #A1824A, #8F723E)',
            padding: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img 
                src="/assets/vera-avatar.jpg" 
                alt={`VÉRA`}
                style={{
                  width: '32px', height: '32px', borderRadius: '50%', 
                  border: '1px solid rgba(255,255,255,0.4)',
                  objectFit: 'cover'
                }}
              />
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700' }}>{T.name}</h4>
                <p style={{ margin: 0, fontSize: '10px', color: "#000000" }}>{T.role}</p>
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
                    src="/assets/vera-avatar.jpg" 
                    alt="V" 
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--glass-border)', flexShrink: 0, marginTop: '2px' }} 
                  />
                )}
                <div style={{
                  padding: '12px 16px', 
                  borderRadius: msg.sender === 'vera' ? '2px 16px 16px 16px' : '16px 16px 2px 16px',
                  background: msg.sender === 'vera' ? 'rgba(255,255,255,0.05)' : '#A1824A',
                  color: msg.sender === 'vera' ? 'inherit' : '#fff', 
                  fontSize: '13px', 
                  lineHeight: '1.5',
                  border: msg.sender === 'vera' ? '1px solid var(--glass-border)' : 'none',
                  boxShadow: msg.sender === 'vera' ? 'none' : '0 4px 15px rgba(156, 124, 58, 0.3)'
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
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={T.input}
                style={{
                  width: '100%', height: '40px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)',
                  borderRadius: '20px', padding: '0 45px 0 15px', color: 'inherit', fontSize: '12px', outline: 'none'
                }}
              />
              <button 
                onClick={handleSend}
                style={{
                position: 'absolute', right: '5px', top: '5px', width: '30px', height: '30px',
                borderRadius: '50%', background: '#A1824A', border: 'none', color: '#fff',
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
