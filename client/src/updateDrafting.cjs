const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

// The new drafting object string
const replacementObject = `{
    id: "drafting",
    icon: <Icons.Drafting />,
    badge: { EN: "PACKAGE 01 · COMPREHENSIVE PERMIT SET | Phase: CD & PERMITTING", PT: "PACOTE 01 · CONJUNTO COMPLETO PARA PERMIT | Phase: PROJETO EXECUTIVO" },
    title: { EN: "As-Built Drawings & Permit Packages", PT: "Desenhos As-Built e Pacotes de Prefeitura" },
    desc: { 
      EN: "Our flagship end-to-end solution. A complete architectural suite covering existing conditions (As-Built), full design development, and high-precision construction documents (CD) required for municipal approval and field execution.",
      PT: "Nossa solução completa de ponta a ponta. Um conjunto arquitetônico abrangente que cobre desde o levantamento (As-Built) até o desenvolvimento de design e documentação técnica de alta precisão exigida para aprovação municipal e execução em obra."
    },
    calloutBox: {
      EN: "We don’t just draft; we engineer for approval. Our profound knowledge of US building codes (IBC/IRC) ensures fewer RFIs, faster permit issuance, and a project that is truly ready for construction—saving you time, money, and administrative friction.",
      PT: "Nós não apenas desenhamos; nós projetamos para aprovação. Nosso profundo conhecimento dos códigos de construção americanos (IBC/IRC) garante menos RFIs, emissão de alvará mais rápida e um projeto pronto para construir — economizando tempo, recursos e dores de cabeça burocráticas."
    },
    bentoExtras: {
      EN: [
        { title: "Architectural Development", desc: "Refined exterior styling, material selection, and aesthetic consistency." },
        { title: "Strategic Space Planning", desc: "Macro-level layout optimization for maximum square footage functionality." },
        { title: "Interior Layout Design", desc: "Precise placement of furniture, cabinetry, and fixtures for interior flow." },
        { title: "Framing & Constructive Detail", desc: "Specialized wall and floor framing layouts with technical schedules to minimize site waste." },
        { title: "Regulatory Code Compliance", desc: "Professional annotations and citations of local municipal codes to streamline the plan review process." },
        { title: "Exterior Photorealistic Rendering", desc: "High-fidelity 3D visualization of the building's exterior included to showcase design intent and curb appeal.", highlight: true }
      ],
      PT: [
        { title: "Desenvolvimento Arquitetônico", desc: "Refino de estilo exterior, seleção de materiais e consistência estética." },
        { title: "Planejamento Espacial Estratégico", desc: "Otimização de layout em nível macro para funcionalidade máxima da metragem." },
        { title: "Design de Layout Interno", desc: "Posicionamento preciso de mobiliário, marcenaria e equipamentos para fluxo interno." },
        { title: "Detalhamento de Framing e Construção", desc: "Layouts especializados de framing (paredes e pisos) com tabelas técnicas para minimizar desperdícios na obra." },
        { title: "Conformidade com Códigos Municipais", desc: "Anotações e citações profissionais dos códigos locais para agilizar o processo de revisão da prefeitura." },
        { title: "Renderização Externa Fotorrealista", desc: "Visualização 3D de alta fidelidade da fachada inclusa para demonstrar a intenção do design e valorização do imóvel.", highlight: true }
      ]
    },
    output: "Output: DWG, PDF",
    tools: "Chief Architect Expert",
    deliverables: {
      EN: "Permit-Ready PDF Set | Layered DWG Files",
      PT: "Set em PDF Pronto para Permit | Arquivos DWG em Camadas"
    },
    disclaimer: {
      EN: "Interior 3D Modules: Check availability for custom angles of interior areas.",
      PT: "Módulos de Interiores: Consultar disponibilidade para ângulos personalizados de áreas internas."
    },
    notIncluded: {
      EN: ["Structural Engineering Stamp (PE)", "Civil & MEP Engineering", "Interior Finish Specification", "Material Procurement"],
      PT: ["Carimbo de Engenharia Estrutural (PE Stamp)", "Engenharia Civil e MEP", "Especificação de Acabamentos de Interiores", "Compra de Materiais"]
    }
  }`;

const regex = /{\s*id:\s*"drafting"[\s\S]*?(?=\s*},\s*{\s*id:\s*"redrawing")/;
content = content.replace(regex, replacementObject);


// Now inject the notIncluded block into the bentoExtras rendering in the JSX
const targetJSX = `                      {service.bentoExtras[lang].map((bento, idx) => (
                        <div key={idx} style={{ 
                          background: bento.highlight ? "var(--a-dim)" : "rgba(255,255,255,0.02)", 
                          border: bento.highlight ? "1px solid var(--a-glow)" : "1px solid rgba(255,255,255,0.05)", 
                          borderRadius: "12px", 
                          padding: 16 
                        }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: bento.highlight ? "var(--a)" : "#fff", marginBottom: 8, lineHeight: 1.3 }}>{bento.title}</h4>
                          <p style={{ fontSize: 13, color: bento.highlight ? "#fff" : "var(--mu)", lineHeight: 1.5 }}>{bento.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : service.notIncluded ? (`;

const replacementJSX = `                      {service.bentoExtras[lang].map((bento, idx) => (
                        <div key={idx} style={{ 
                          background: bento.highlight ? "var(--a-dim)" : "rgba(255,255,255,0.02)", 
                          border: bento.highlight ? "1px solid var(--a-glow)" : "1px solid rgba(255,255,255,0.05)", 
                          borderRadius: "12px", 
                          padding: 16 
                        }}>
                          <h4 style={{ fontSize: 14, fontWeight: 700, color: bento.highlight ? "var(--a)" : "#fff", marginBottom: 8, lineHeight: 1.3 }}>{bento.title}</h4>
                          <p style={{ fontSize: 13, color: bento.highlight ? "#fff" : "var(--mu)", lineHeight: 1.5 }}>{bento.desc}</p>
                        </div>
                      ))}
                    </div>
                    {service.notIncluded && (
                      <div style={{ marginTop: 16, background: "rgba(233, 30, 99, 0.03)", border: "1px solid rgba(233, 30, 99, 0.15)", borderRadius: "12px", padding: 16 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#9c7c3a", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "NOT INCLUDED" : "NÃO INCLUSO"}</p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                          {service.notIncluded[lang].map((item, i) => (
                            <li key={i} style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                              <span style={{ color: "#9c7c3a", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : service.notIncluded ? (`;

if (content.includes('background: bento.highlight ? "var(--a-dim)"')) {
    content = content.replace(targetJSX, replacementJSX);
}

fs.writeFileSync(path, content, 'utf-8');
console.log("Successfully updated drafting package");
