import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="layout-wrapper">
      <header className="barra-superior">
        <Navbar />
      </header>
      <main className="conteudo-rolavel">
        {children}
      </main>
      <footer className="rodape">
        <Footer />
      </footer>
    </div>
  );
}
