import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function EstimateModal({ isOpen, onClose }) {
  const { lang, theme } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    description: ''
  });

  if (!isOpen) return null;

  const T = {
    EN: {
      title: 'Get an Estimate',
      subtitle: 'Start your architectural journey with DARA Studio.',
      name: 'Full Name',
      email: 'Professional Email',
      projectType: 'Project Type',
      description: 'Project Description',
      submit: 'Send Request',
      types: ['New Construction', 'Addition/Renovation', '3D Visualization', 'Technical Drafting']
    },
    PT: {
      title: 'Peça um Orçamento',
      subtitle: 'Comece sua jornada arquitetônica com o DARA Studio.',
      name: 'Nome Completo',
      email: 'E-mail Profissional',
      projectType: 'Tipo de Projeto',
      description: 'Descrição do Projeto',
      submit: 'Enviar Solicitação',
      types: ['Nova Construção', 'Ampliação/Reforma', 'Visualização 3D', 'Desenho Técnico']
    }
  }[lang];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    alert(lang === 'EN' ? 'Request sent! We will contact you soon.' : 'Solicitação enviada! Entraremos em contato em breve.');
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content glass-premium animate-scale-up" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>

        <h2 className="modal-title">{T.title}</h2>
        <p className="modal-subtitle">{T.subtitle}</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <input 
              type="text" 
              placeholder={T.name}
              required
              className="glass-input"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <input 
              type="email" 
              placeholder={T.email}
              required
              className="glass-input"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%' }}
            />
          </div>

          <div className="form-group">
            <select 
              required
              className="glass-input"
              value={formData.projectType}
              onChange={e => setFormData({...formData, projectType: e.target.value})}
              style={{ width: '100%', appearance: 'none' }}
            >
              <option value="" disabled>{T.projectType}</option>
              {T.types.map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          <div className="form-group">
            <textarea 
              placeholder={T.description}
              required
              className="glass-input"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              style={{ width: '100%', minHeight: '120px', padding: '15px 20px', height: 'auto' }}
            />
          </div>

          <button type="submit" className="lp-btn-primary" style={{
            marginTop: '10px', height: '48px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, var(--brand-purple), var(--brand-pink))',
            color: '#fff', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s'
          }}>
            {T.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
