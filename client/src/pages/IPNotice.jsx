import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackButton from '../components/BackButton';
import { useAppContext } from '../context/AppContext';

const IP_NOTICE_TEXT = {
  EN: {
    title: "Copyright & IP Notice",
    subtitle: "LAST UPDATED: FEBRUARY 2011 — © THE AUTHORSHIP OF THE CONTENTS, MATERIALS AND IMAGES DISPLAYED ON DA·RA STUDIO IS PROTECTED BY NATIONAL AND INTERNATIONAL COPYRIGHT LAWS.",
    sections: [
      {
        number: "1",
        title: "Ownership of Content",
        content: "All materials on this website — including house plans, floor plans, 2D/3D artwork, technical drawings, architectural renderings, images, videos, and written content — are the exclusive property of DARA Studio and are protected under United States Federal Copyright Laws (Title 17 of the U.S. Code)."
      },
      {
        number: "2",
        title: "Protected Materials",
        content: "Protection includes, but is not limited to:",
        list: [
          "Architectural Assets: CAD files, blueprints, floor plans, elevations, and layouts.",
          "Visual Media: 3D photorealistic renderings, conceptual models, walkthrough videos, and project photography.",
          "Digital Content: Website copy, blog posts, and marketing materials."
        ]
      },
      {
        number: "3",
        title: "Single-Use Licensing Policy",
        content: "Unless explicitly stated otherwise in a written contract, all purchased plans or media assets are licensed for single-use only.",
        list: [
          "One Build: You are authorized to construct only one (1) structure per set of plans.",
          "No Redistribution: Plans and media may not be resold, licensed, or shared with third parties without prior written authorization.",
          "Multi-Use: To build multiple homes or use content for multiple projects, an Extended Media License or Multi-Use License must be purchased."
        ]
      },
      {
        number: "4",
        title: "Prohibited Actions",
        content: "Unauthorized use constitutes copyright infringement. This includes:",
        list: [
          "Copying or Redrawing: Modifying, tracing, or redrawing any design — even with alterations — is illegal.",
          "Digital Distribution: Scanning, uploading to social media, or posting to marketing sites without a license.",
          "Derivative Works: Any modification to our designs remains a derivative work owned by DARA Studio and cannot be reused outside the original project scope."
        ]
      },
      {
        number: "5",
        title: "Liability and Infringement",
        content: "Copyright infringement is a serious federal offense. All parties involved can be held legally liable.",
        list: [
          "Statutory Damages: Up to $150,000 per infringement.",
          "Legal Fees: Violators may be required to cover all legal and court costs.",
          "DMCA: Unauthorized online use of our media will result in immediate DMCA takedown actions and potential platform bans."
        ]
      }
    ],
    warning: "Federal Law: Copyright infringement may result in statutory damages of up to $150,000 per infringement plus attorney fees under 17 U.S.C. § 504.",
  },
  PT: {
    title: "Aviso de Copyright e IP",
    subtitle: "ÚLTIMA ATUALIZAÇÃO: FEVEREIRO DE 2011 — © A AUTORIA DOS CONTEÚDOS, MATERIAIS E IMAGENS EXIBIDOS NO DA·RA STUDIO É PROTEGIDA POR LEIS DE DIREITOS AUTORAIS NACIONAIS E INTERNACIONAIS.",
    sections: [
      {
        number: "1",
        title: "Propriedade do Conteúdo",
        content: "Todos os materiais neste site — incluindo plantas de casas, plantas baixas, arte 2D/3D, desenhos técnicos, renders arquitetônicos, imagens, vídeos e conteúdo escrito — são de propriedade exclusiva do DARA Studio e estão protegidos pelas Leis Federais de Direitos Autorais dos Estados Unidos (Título 17 do Código dos EUA)."
      },
      {
        number: "2",
        title: "Materiais Protegidos",
        content: "A proteção inclui, mas não se limita a:",
        list: [
          "Ativos Arquitetônicos: Arquivos CAD, projetos, plantas baixas, fachadas e layouts.",
          "Mídia Visual: Renders 3D fotorrealistas, modelos conceituais, vídeos de tour virtual e fotografia de projetos.",
          "Conteúdo Digital: Textos do site, postagens em blogs e materiais de marketing."
        ]
      },
      {
        number: "3",
        title: "Política de Licenciamento de Uso Único",
        content: "A menos que explicitamente indicado de outra forma em um contrato escrito, todos os planos ou ativos de mídia adquiridos são licenciados apenas para uso único.",
        list: [
          "Uma Construção: Você está autorizado a construir apenas uma (1) estrutura por conjunto de planos.",
          "Sem Redistribuição: Planos e mídias não podem ser revendidos, licenciados ou compartilhados com terceiros sem autorização prévia por escrito.",
          "Uso Múltiplo: Para construir várias casas ou usar conteúdo para vários projetos, uma Licença de Mídia Estendida ou Licença de Uso Múltiplo deve ser adquirida."
        ]
      },
      {
        number: "4",
        title: "Ações Proibidas",
        content: "O uso não autorizado constitui violação de direitos autorais. Isso inclui:",
        list: [
          "Copiar ou Redesenhar: Modificar, traçar ou redesenhar qualquer design — mesmo com alterações — é ilegal.",
          "Distribuição Digital: Digitalizar, enviar para redes sociais ou postar em sites de marketing sem licença.",
          "Obras Derivadas: Qualquer modificação em nossos designs permanece uma obra derivada de propriedade do DARA Studio e não pode ser reutilizada fora do escopo original do projeto."
        ]
      },
      {
        number: "5",
        title: "Responsabilidade e Infração",
        content: "A violação de direitos autorais é uma ofensa federal grave. Todas as partes envolvidas podem ser responsabilizadas legalmente.",
        list: [
          "Danos Estatutários: Até $150.000 por infração.",
          "Honorários Advocatícios: Os infratores podem ser obrigados a cobrir todos os custos legais e judiciais.",
          "DMCA: O uso online não autorizado de nossa mídia resultará em ações imediatas de remoção do DMCA e possíveis banimentos de plataformas."
        ]
      }
    ],
    warning: "Lei Federal: A violação de direitos autorais pode resultar em danos estatutários de até $150.000 por infração, além de honorários advocatícios nos termos do 17 U.S.C. § 504.",
  }
};

export default function IPNotice() {
  const { lang } = useAppContext();
  const T = IP_NOTICE_TEXT[lang] || IP_NOTICE_TEXT.EN;

  return (
    <div className="lp-root">
      <Navbar />
      <main className="independent-page">
        <BackButton />
        
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h1 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: '48px', 
              color: '#fff', 
              marginBottom: '16px' 
            }}>{T.title}</h1>
            <p style={{ 
              fontSize: '11px', 
              color: 'rgba(255,255,255,0.4)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.12em', 
              lineHeight: '1.5' 
            }}>{T.subtitle}</p>
          </div>

          <div style={{ color: '#c4c2dc', fontSize: '16px', lineHeight: '1.8' }}>
            {T.sections.map((section, idx) => (
              <div key={idx} style={{ marginBottom: '48px' }}>
                <h3 style={{ 
                  color: '#fff', 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  marginBottom: '16px' 
                }}>{section.number}. {section.title}</h3>
                <p style={{ marginBottom: '20px' }}>{section.content}</p>
                {section.list && (
                  <ul style={{ listStyle: 'none', paddingLeft: '0' }}>
                    {section.list.map((item, i) => (
                      <li key={i} style={{ 
                        position: 'relative', 
                        paddingLeft: '24px', 
                        marginBottom: '12px',
                        opacity: 0.85
                      }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--accent)', fontWeight: 'bold' }}>•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            <div style={{
              background: 'rgba(217, 119, 6, 0.05)',
              border: '1px solid rgba(217, 119, 6, 0.2)',
              padding: '32px',
              borderRadius: '16px',
              marginTop: '40px',
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '24px' }}>⚠️</span>
              <div style={{ fontSize: '15px', color: '#fcd34d', fontWeight: '500' }}>
                <span style={{ color: '#ef4444', fontWeight: '800', textTransform: 'uppercase' }}>{lang === "EN" ? "Federal Law:" : "Lei Federal:"}</span>
                {' '}
                {T.warning.replace(lang === "EN" ? "Federal Law:" : "Lei Federal:", '').split('$150,000').map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span style={{ color: '#fff', fontWeight: '800', fontSize: '16px' }}>$150,000</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
