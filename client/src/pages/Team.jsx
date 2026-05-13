import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const TEAM_MEMBERS = [
  {
    name: "Marco V.",
    role: { EN: "Design Director", PT: "Diretor de Design" },
    bio: { 
      EN: "15+ years of experience in luxury residential architecture.",
      PT: "Mais de 15 anos de experiência em arquitetura residencial de luxo."
    },
    avatar: "👨‍💼"
  },
  {
    name: "Elena G.",
    role: { EN: "Lead Architect", PT: "Arquiteta Líder" },
    bio: { 
      EN: "Expert in sustainable building codes and permit optimization.",
      PT: "Especialista em normas sustentáveis e aprovação de projetos."
    },
    avatar: "👩‍🎨"
  },
  {
    name: "Julian K.",
    role: { EN: "Head of 3D", PT: "Líder de 3D" },
    bio: { 
      EN: "Transforming technical drawings into hyper-realistic visualizations.",
      PT: "Transformando desenhos técnicos em visualizações hiper-realistas."
    },
    avatar: "👨‍💻"
  }
];

export default function Team() {
  const { lang } = useAppContext();

  return (
    <div className="lp-root">
      <Navbar />
      <main className="independent-page">
        <BackButton />
        <section className="team-section" style={{ padding: 0, border: 'none' }}>
          <div className="team-header">
            <span style={{ fontSize: 11, color: "var(--a)", fontWeight: 700, letterSpacing: ".2em", textTransform: "uppercase" }}>Collective</span>
            <h2 style={{ marginTop: 12 }}>{lang === "EN" ? "The Team Behind Your Project" : "A Equipe por Trás do Seu Projeto"}</h2>
          </div>
          <div className="team-grid">
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} className="team-card">
                <div className="team-avatar">{m.avatar}</div>
                <h3 className="team-name">{m.name}</h3>
                <span className="team-role">{m.role[lang]}</span>
                <p className="team-bio">{m.bio[lang]}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
