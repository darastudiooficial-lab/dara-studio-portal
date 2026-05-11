import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

const Chat = ({ projectId, lang = 'EN' }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();

  const T = {
    EN: { placeholder: 'Type your message...', send: 'Send' },
    PT: { placeholder: 'Digite sua mensagem...', send: 'Enviar' }
  }[lang];

  useEffect(() => {
    if (!projectId) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*, profiles(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });
      
      if (!error && data) setMessages(data);
      setLoading(false);
      scrollToBottom();
    };

    fetchMessages();

    const channel = supabase
      .channel(`project-chat-${projectId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `project_id=eq.${projectId}`
      }, async (payload) => {
        // Fetch the sender profile for the new message
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', payload.new.sender_id)
          .single();
        
        const msgWithProfile = { ...payload.new, profiles: profileData };
        setMessages(prev => [...prev, msgWithProfile]);
        scrollToBottom();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !profile) return;

    const messageData = {
      project_id: projectId,
      sender_id: user.id,
      sender_role: profile.role,
      content: newMessage.trim()
    };

    const { error } = await supabase.from('messages').insert(messageData);
    if (!error) {
      setNewMessage('');
    } else {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
      <div 
        ref={scrollRef}
        className="chat-messages" 
        style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', opacity: 0.5, fontSize: '12px' }}>Loading conversation...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', opacity: 0.3, fontSize: '11px', marginTop: '20px' }}>
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <span style={{ fontSize: '10px', fontWeight: '600', opacity: 0.6 }}>{msg.profiles?.full_name || 'System'}</span>
                  <span style={{ 
                    fontSize: '9px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', 
                    background: msg.sender_role === 'admin' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)',
                    color: msg.sender_role === 'admin' ? 'var(--a)' : 'inherit'
                  }}>
                    {msg.sender_role}
                  </span>
                </div>
                <div style={{ 
                  padding: '10px 14px', borderRadius: isMe ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: isMe ? 'var(--a)' : 'rgba(255,255,255,0.05)',
                  color: isMe ? '#fff' : 'inherit',
                  fontSize: '13px', lineBreak: 'anywhere'
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: '9px', opacity: 0.4, marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '8px' }}>
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={T.placeholder}
          style={{ 
            flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '13px' 
          }}
        />
        <button 
          type="submit" 
          style={{ 
            background: 'var(--a)', border: 'none', borderRadius: '8px', width: '36px', height: '36px', 
            display: 'flex', alignItems: 'center', justifyCenter: 'center', cursor: 'pointer', color: '#fff' 
          }}
        >
          <Icon name="send" size={16} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
