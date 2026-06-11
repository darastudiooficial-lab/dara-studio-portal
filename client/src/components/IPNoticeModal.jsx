import React from 'react';

const IP_NOTICE_TEXT = {
  EN: {
    title: `Copyright & IP Notice`,
    subtitle: `LAST UPDATED: FEBRUARY 2011 — © THE AUTHORSHIP OF THE CONTENTS, MATERIALS AND IMAGES DISPLAYED ON DA·RA STUDIO IS PROTECTED BY NATIONAL AND INTERNATIONAL COPYRIGHT LAWS.`,
    sections: [
      {
        number: "1",
        title: `Ownership of Content`,
        content: `All materials on this website — including house plans, floor plans, 2D/3D artwork, technical drawings, architectural renderings, images, videos, and written content — are the exclusive property of DARA Studio and are protected under United States Federal Copyright Laws (Title 17 of the U.S. Code).`
      },
      {
        number: "2",
        title: `Protected Materials`,
        content: `Protection includes, but is not limited to:`,
        list: [
          `Architectural Assets: CAD files, blueprints, floor plans, elevations, and layouts.`,
          `Visual Media: 3D photorealistic renderings, conceptual models, walkthrough videos, and project photography.`,
          `Digital Content: Website copy, blog posts, and marketing materials.`
        ]
      },
      {
        number: "3",
        title: `Single-Use Licensing Policy`,
        content: `Unless explicitly stated otherwise in a written contract, all purchased plans or media assets are licensed for single-use only.`,
        list: [
          "One Build: You are authorized to construct only one (1) structure per set of plans.",
          `No Redistribution: Plans and media may not be resold, licensed, or shared with third parties without prior written authorization.`,
          `Multi-Use: To build multiple homes or use content for multiple projects, an Extended Media License or Multi-Use License must be purchased.`
        ]
      },
      {
        number: "4",
        title: `Prohibited Actions`,
        content: `Unauthorized use constitutes copyright infringement. This includes:`,
        list: [
          `Copying or Redrawing: Modifying, tracing, or redrawing any design — even with alterations — is illegal.`,
          `Digital Distribution: Scanning, uploading to social media, or posting to marketing sites without a license.`,
          "Derivative Works: Any modification to our designs remains a derivative work owned by DARA Studio and cannot be reused outside the original project scope."
        ]
      },
      {
        number: "5",
        title: `Liability and Infringement`,
        content: `Copyright infringement is a serious federal offense. All parties involved can be held legally liable.`,
        list: [
          `Statutory Damages: Up to $150,000 per infringement.`,
          "Legal Fees: Violators may be required to cover all legal and court costs.",
          "DMCA: Unauthorized online use of our media will result in immediate DMCA takedown actions and potential platform bans."
        ]
      }
    ],
    warning: `Federal Law: Copyright infringement may result in statutory damages of up to $150,000 per infringement plus attorney fees under 17 U.S.C. § 504.`,
    button: "I UNDERSTAND — CLOSE"
  }
};

/**
 * IPNoticeModal
 * Modal component for displaying Copyright and Intellectual Property notice.
 * Implemented with exact text from project assets.
 */
export default function IPNoticeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const T = IP_NOTICE_TEXT.EN;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease'
    }} onClick={onClose}>
      <div style={{
        background: '#0d0a1e',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85vh',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        animation: 'scaleIn 0.3s cubic-bezier(0.22, 0.68, 0, 1.15)'
      }} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '24px', 
              color: '#fff', 
              marginBottom: '8px' 
            }}>{T.title}</h2>
            <p style={{ 
              fontSize: '9px', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              lineHeight: '1.5' 
            }}>{T.subtitle}</p>
          </div>
          <button onClick={onClose} style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '20px'
          }}>×</button>
        </div>

        {/* Content */}
        <div style={{
          padding: '32px',
          overflowY: 'auto',
          flex: 1,
          color: '#c4c2dc',
          fontSize: '14px',
          lineHeight: '1.7'
        }} className="custom-scrollbar">
          {T.sections.map((section, idx) => (
            <div key={idx} style={{ marginBottom: '32px' }}>
              <h3 style={{ 
                color: '#fff', 
                fontSize: '15px', 
                fontWeight: '700', 
                marginBottom: '12px' 
              }}>{section.number}. {section.title}</h3>
              <p style={{ marginBottom: '12px' }}>{section.content}</p>
              {section.list && (
                <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                  {section.list.map((item, i) => (
                    <li key={i} style={{ 
                      position: 'relative', 
                      paddingLeft: '18px', 
                      marginBottom: '8px',
                      opacity: 0.85
                    }}>
                      <span style={{ position: 'absolute', left: 0, color: 'var(--accent)' }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Warning Box */}
          <div style={{
            background: 'rgba(217, 119, 6, 0.05)',
            border: '1px solid rgba(217, 119, 6, 0.2)',
            padding: '20px',
            borderRadius: '12px',
            marginTop: '16px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <span style={{ fontSize: '18px' }}>⚠️</span>
            <div style={{ fontSize: '13px', color: '#fcd34d', fontWeight: '500' }}>
              <span style={{ color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>Federal Law:</span>
              {' '}
              {T.warning.replace('Federal Law:', '').split('$150,000').map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i === 0 && <span style={{ color: '#fff', fontWeight: '800', fontSize: '14px' }}>$150,000</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Button */}
        <div style={{
          padding: '24px 32px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <button onClick={onClose} style={{
            background: 'none',
            border: '1.5px solid rgba(255,255,255,0.12)',
            borderRadius: '8px',
            color: '#fff',
            padding: '12px 32px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.12em',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }} className="lp-btn-secondary">
            {T.button}
          </button>
        </div>
      </div>
    </div>
  );
}
