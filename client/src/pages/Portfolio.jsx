import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const PORTFOLIO_ITEMS = [
  { img: "/portfolio/p1.png", cat: "Residential", title: "Modern Glass Villa" },
  { img: "/portfolio/p2.png", cat: "Exterior", title: "Minimalist Garden Home" },
  { img: "/portfolio/p3.png", cat: "Interior", title: "Open Concept Living" },
  { img: "/portfolio/p4.png", cat: "ADU", title: "Backyard Guest Studio" },
  { img: "/portfolio/p5.png", cat: "Commercial", title: "Sleek Office Facade" },
  { img: "/portfolio/p6.png", cat: "Kitchen", title: "Contemporary Culinary Space" },
];

export default function Portfolio() {
  const { lang } = useAppContext();

  return (
    <div className="lp-root">
      <Navbar />
      <main className="independent-page">
        <BackButton />
        <section className="portfolio-page-header" style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 11, color: "var(--a)", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" }}>Work</span>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 56, color: "#fff", lineHeight: 1.1, marginTop: 12 }}>
            {lang === "EN" ? "Featured Projects" : "Projetos em Destaque"}
          </h2>
          <p style={{ color: "#9896b8", fontSize: 16, marginTop: 16, maxWidth: 600 }}>
            {lang === "EN" 
              ? "A selection of our latest architectural visualizations and technical drafting projects."
              : "Uma seleção de nossas últimas visualizações arquitetônicas e projetos de desenho técnico."}
          </p>
        </section>

        <section className="portfolio-strip" style={{ padding: 0, border: 'none' }}>
          <div className="portfolio-grid" style={{ gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))' }}>
            {PORTFOLIO_ITEMS.map((item, i) => (
              <div key={i} className="portfolio-card" style={{ borderRadius: 24 }}>
                <img src={item.img} alt={item.title} className="portfolio-img" />
                <div className="portfolio-overlay" style={{ borderRadius: 24 }}>
                  <span className="portfolio-cat">{item.cat}</span>
                  <h3 className="portfolio-title">{item.title}</h3>
                  <button className="portfolio-btn">
                    View Project
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
