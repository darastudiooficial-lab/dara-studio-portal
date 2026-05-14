import React, { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';

// Minimalist Legal Icons
const LegalIcons = {
  Copyright: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></svg>
  ),
  Shield: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
  ),
  Licensing: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
  ),
  Prohibited: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
  ),
  Scales: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  )
};

const IP_NOTICE_TEXT = {
  EN: {
    title: "Copyright & IP Notice",
    subtitle: "Last updated in January 2026. The authorship of all contents, materials, and images displayed on DA·RA Studio is strictly protected by national and international copyright laws.",
    sections: [
      {
        number: "01",
        icon: <LegalIcons.Copyright />,
        badge: "FEDERAL PROTECTION",
        title: "Intellectual Property & Ownership",
        content: "Every proprietary asset hosted here, including house plans, 2D/3D BIM models, schematic designs, and technical documentation, is the exclusive Intellectual Property of DA·RA Studio. These works are protected under Title 17 of the U.S. Code and international copyright treaties. Any unauthorized reproduction, redrawing, or digital extraction is strictly prohibited and subject to federal litigation.",
        list: [
          "Title 17 U.S. Code Protected",
          "BIM & CAD Data Exclusivity",
          "Architectural & Schematic Blueprints",
          "Derivative Works Ownership"
        ],
        btnLabel: "REVIEW FULL LICENSE"
      },
      {
        number: "02",
        icon: <LegalIcons.Licensing />,
        badge: "LEGAL ENFORCEMENT",
        title: "Single-Use Licensing Protocols",
        content: "Unless otherwise ratified via a written Master Service Agreement (MSA), all deliverables are issued under a non-transferable, Single-Use License. This authorization is restricted to one (1) physical construction per set of plans. The redistribution, sub-licensing, or resale of these digital assets to third-party entities without express written consent constitutes a material breach of contract.",
        list: [
          "One Physical Construction Limit",
          "Redistribution Strictly Prohibited",
          "MSA Override Requirement",
          "Non-Transferable Usage Rights"
        ],
        btnLabel: "LICENSE DETAILS"
      },
      {
        number: "03",
        icon: <LegalIcons.Shield />,
        badge: "DMCA PROTECTED",
        title: "Digital Asset Protection (DMCA)",
        content: "DA·RA Studio actively monitors the digital landscape for unauthorized use of our visual media, architectural renderings, and website content. We reserve the right to issue immediate Takedown Notices under the Digital Millennium Copyright Act (DMCA) and pursue statutory damages for any infringement. All metadata and project signatures are encrypted to ensure traceability of origin.",
        list: [
          "Active Digital Monitoring",
          "Immediate DMCA Takedowns",
          "Statutory Damage Pursuit",
          "Encrypted Origin Metadata"
        ],
        btnLabel: "SECURITY PROTOCOLS"
      }
    ],
    warning: "Federal Law: Copyright infringement may result in statutory damages of up to $150,000 per infringement plus attorney fees under 17 U.S.C. § 504.",
    legalBadge: "LEGAL PROTECTION"
  },
  PT: {
    title: "Aviso de Copyright e IP",
    subtitle: "Última atualização em Janeiro de 2026. A autoria de todos os conteúdos, materiais e imagens exibidos no DA·RA Studio é protegida por leis de direitos autorais nacionais e internacionais.",
    sections: [
      {
        number: "01",
        icon: <LegalIcons.Copyright />,
        badge: "PROTEÇÃO FEDERAL",
        title: "Propriedade Intelectual & Autoria",
        content: "Cada ativo proprietário hospedado neste portal, incluindo planos residenciais, modelos BIM 2D/3D, designs esquemáticos e documentação técnica, constitui propriedade intelectual exclusiva do DA·RA Studio. Estas obras são protegidas pelo Título 17 do Código dos EUA e tratados internacionais. Qualquer reprodução não autorizada, redesenho ou extração digital é estritamente proibida e sujeita a litígio federal.",
        list: [
          "Proteção Título 17 Código EUA",
          "Exclusividade de Dados BIM e CAD",
          "Plantas Arquitetônicas e Esquemáticas",
          "Propriedade de Obras Derivadas"
        ],
        btnLabel: "REVISAR LICENÇA"
      },
      {
        number: "02",
        icon: <LegalIcons.Licensing />,
        badge: "CUMPRIMENTO LEGAL",
        title: "Protocolos de Licenciamento de Uso Único",
        content: "A menos que haja um Contrato de Serviço (MSA) por escrito, todos os entregáveis são emitidos sob uma Licença de Uso Único e intransferível. Esta autorização é restrita a apenas uma construção física por conjunto de planos. A redistribuição, sublicenciamento ou revenda destes ativos digitais para terceiros sem consentimento expresso constitui uma violação contratual grave.",
        list: [
          "Limite de Uma Construção Física",
          "Redistribuição Estritamente Proibida",
          "Requisito de Contrato Escrito (MSA)",
          "Direitos de Uso Intransferíveis"
        ],
        btnLabel: "DETALHES DA LICENÇA"
      },
      {
        number: "03",
        icon: <LegalIcons.Shield />,
        badge: "PROTEGIDO POR DMCA",
        title: "Proteção de Ativos Digitais (DMCA)",
        content: "O DA·RA Studio monitora ativamente o ambiente digital para identificar o uso não autorizado de nossas mídias visuais, renders arquitetônicos e conteúdo do site. Reservamo-nos o direito de emitir Notificações de Remoção imediata (DMCA) e buscar danos por qualquer infração. Todos os metadados e assinaturas de projeto são criptografados para garantir a rastreabilidade da origem.",
        list: [
          "Monitoramento Digital Ativo",
          "Remoção Imediata via DMCA",
          "Busca de Danos Estatutários",
          "Metadados de Origem Criptografados"
        ],
        btnLabel: "PROTOCOLOS DE SEGURANÇA"
      }
    ],
    warning: "Lei Federal: A violação de direitos autorais pode resultar em danos estatutários de até $150.000 por infração, além de honorários advocatícios nos termos do 17 U.S.C. § 504.",
    legalBadge: "PROTEÇÃO JURÍDICA"
  }
};

export default function IPNotice() {
  const { lang, openVera } = useAppContext();
  const T = IP_NOTICE_TEXT[lang] || IP_NOTICE_TEXT.EN;
  const scrollRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = 412; // card width + gap
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const cardWidth = 412;
      const newIdx = Math.round(scrollLeft / cardWidth);
      if (newIdx !== activeIdx) setActiveIdx(newIdx);
    }
  };

  const scrollToIdx = (idx) => {
    if (scrollRef.current) {
      const cardWidth = 412;
      scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
    }
  };

  const handleLegalConsult = (label) => {
    const msg = lang === 'EN'
      ? `Hi! I'm VÉRA. I see you're reviewing our ${label}. Would you like to discuss specific licensing terms or intellectual property protections?`
      : `Olá! Eu sou a VÉRA. Vejo que você está revisando nossos ${label}. Gostaria de discutir termos de licenciamento específicos ou proteções de propriedade intelectual?`;
    openVera(msg);
  };

  return (
    <div className="lp-root services-page-root">
      <Navbar />
      <main className="independent-page" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        minHeight: 'calc(100vh - 80px)',
        paddingTop: '10px',
        paddingBottom: '20px',
        overflowX: 'hidden'
      }}>
        {/* Header Section */}
        <header className="services-header-premium animate-float-up" style={{ paddingBottom: '0px' }}>
          <h1 className="services-main-title" style={{ marginBottom: '8px', fontSize: 'clamp(2rem, 5vh, 3.5rem)' }}>
            {lang === "EN" ? (
              <>
                <span className="title-white">Copyright &</span> <span className="title-gradient-italic">IP Notice</span>
              </>
            ) : (
              <>
                <span className="title-white">Aviso de</span> <span className="title-gradient-italic">Copyright e IP</span>
              </>
            )}
          </h1>
          <p className="service-desc" style={{ maxWidth: '1150px', margin: '0 auto -90px', fontSize: '15px', opacity: 0.8, lineHeight: '1.4', position: 'relative', zIndex: 5 }}>
            {T.subtitle}
          </p>
        </header>

        {/* Legal Carousel */}
        <div className="services-carousel-wrap" style={{ marginTop: '-60px', paddingTop: '0', paddingBottom: '0' }}>
          <button className="carousel-arrow left" onClick={() => scroll('left')} style={{ opacity: activeIdx === 0 ? 0.3 : 1 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          
          <div 
            className="services-grid carousel" 
            ref={scrollRef} 
            onScroll={handleScroll}
            style={{ paddingBottom: '10px' }}
          >
            {T.sections.map((section, idx) => (
              <div 
                key={idx} 
                className={`service-card-premium legal-card-compact animate-float-up ${activeIdx === idx ? 'active' : ''}`}
                style={{ 
                  animationDelay: `${(idx + 1) * 50}ms`
                }}
              >
                <span className="service-badge-us" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {section.badge}
                </span>

                <div className="service-icon-box">
                  {section.icon}
                </div>
                <h3 className="service-title" style={{ lineHeight: '1.2' }}>
                  <span style={{ opacity: 0.5, marginRight: '8px', fontFamily: 'var(--font-sans)', fontWeight: 400 }}>{section.number}.</span>
                  {section.title}
                </h3>
                <p className="service-desc">{section.content}</p>
                
                {section.list && (
                  <ul className="service-list" style={{ marginTop: '8px' }}>
                    {section.list.map((item, i) => (
                      <li key={i} className="service-list-item">
                        <LegalIcons.Check />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                <button 
                  className="btn-legal-static" 
                  onClick={() => handleLegalConsult(section.title)}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  {section.btnLabel}
                </button>
              </div>
            ))}
          </div>

          <button className="carousel-arrow right" onClick={() => scroll('right')} style={{ opacity: activeIdx === T.sections.length - 1 ? 0.3 : 1 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Federal Warning Box */}
        <div style={{ maxWidth: '800px', margin: '-120px auto 20px', width: '100%', padding: '0 24px', zIndex: 20, position: 'relative' }}>
          <div style={{
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(123, 31, 162, 0.3)',
            padding: '16px 40px',
            borderRadius: '20px',
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
          }}>
            <span style={{ fontSize: '28px', color: '#e91e63', filter: 'drop-shadow(0 0 10px rgba(233, 30, 99, 0.4))' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </span>
            <div style={{ 
              fontSize: '14px', 
              fontFamily: 'var(--font-sans)', 
              color: 'var(--text-color)',
              lineHeight: '1.6',
              fontStyle: 'italic',
              opacity: 0.85
            }}>
              <span style={{ 
                color: 'var(--brand-purple)', 
                fontWeight: '800', 
                fontStyle: 'normal',
                textTransform: 'uppercase',
                marginRight: '12px',
                letterSpacing: '0.1em',
                fontFamily: 'var(--font-sans)'
              }}>
                {lang === "EN" ? "FEDERAL LAW:" : "LEI FEDERAL:"}
              </span>
              
              {lang === "EN" ? (
                <>
                  Copyright infringement may result in statutory damages of up to{" "}
                  <span style={{ color: '#e91e63', fontWeight: '800', fontStyle: 'normal' }}>$150,000</span>{" "}
                  per infringement plus attorney fees under 17 U.S.C. § 504. All parties involved, including those copying or redrawing designs, can be held legally liable.
                </>
              ) : (
                <>
                  A violação de direitos autorais pode resultar em danos estatutários de até{" "}
                  <span style={{ color: '#e91e63', fontWeight: '800', fontStyle: 'normal' }}>$150,000</span>{" "}
                  por infração, além de honorários advocatícios nos termos do 17 U.S.C. § 504. Todas as partes envolvidas, inclusive aquelas que copiam ou redesenham projetos, podem ser responsabilizadas legalmente.
                </>
              )}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
