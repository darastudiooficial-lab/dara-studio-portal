import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAppContext } from '../context/AppContext';
import PageTransition from '../components/PageTransition';


export default function Portfolio() {
  const { lang } = useAppContext();

  return (
    <PageTransition variant="default">
    <div className="lp-root">
      {/* Brilho radial roxo suave no topo centralizado */}
      <div className="radial-glow"></div>
      <div className="radial-glow-navy"></div>
      <Navbar />
      <main className="independent-page">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: '40px 20px' }} className="animate-float-up">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-neon-purple)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.8 }}>
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
          <h1 className="editorial-title" style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            {lang === "EN" ? (
              <>
                <span>Under</span>
                <span className="editorial-title-italic">Construction</span>
              </>
            ) : (
              <>
                <span>Em</span>
                <span className="editorial-title-italic">Construção</span>
              </>
            )}
          </h1>
          <p className="editorial-subtitle" style={{ maxWidth: '500px', margin: '0 auto' }}>
            {lang === "EN" 
              ? "We are currently curating our best projects. Please check back soon." 
              : "Estamos atualmente organizando nossos melhores projetos. Volte em breve."}
          </p>
        </div>
      </main>
      <Footer />
    </div>
    </PageTransition>
  );
}
