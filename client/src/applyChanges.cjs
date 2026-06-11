const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

const newArray = `[
  {
    id: "drafting",
    icon: <Icons.Drafting />,
    badge: { EN: "PACKAGE 01 · HIGH COMPLEXITY", PT: "PACOTE 01 · ALTA COMPLEXIDADE" },
    title: { EN: "As-Built Drawings & Permit Packages", PT: "Desenhos As-Built e Pacotes de Prefeitura" },
    desc: { 
      EN: "Our most comprehensive package. Covers all project levels, customizable design extras, and includes exterior 3D visualization. Developed for permit submission and full construction execution.",
      PT: "Nosso pacote mais completo. Cobre todos os níveis do projeto, extras de design personalizáveis e inclui visualização 3D externa. Desenvolvido para submissão de permit e execução completa da construção."
    },
    bentoExtras: {
      EN: [
        { title: "Architectural Detailing", desc: "Conceptual and aesthetic development — exterior elevations, structural style, and overall project appearance." },
        { title: "Space Planning", desc: "Macro-level design — ideal arrangement of walls, doors, and room flows for maximum functionality." },
        { title: "Interior Layout", desc: "Micro-level design — positioning of furniture, custom millwork, appliances, and fixtures." },
        { title: "Construction Detailing & Framing", desc: "Technical framing plans, construction details, and door/window schedules — everything the builder needs for precise execution." },
        { title: "Code Compliance & Technical Notes", desc: "Municipal code citations, safety notes, and professional annotations to expedite permit approval." },
        { title: "3D Exterior Render · Included", desc: "High-fidelity exterior 3D visualization included in this package. Interior rooms are charged separately at $150–$200 per room.", highlight: true }
      ],
      PT: [
        { title: "Detalhamento Arquitetônico", desc: "Desenvolvimento conceitual e estético — elevações externas, estilo estrutural e aparência geral do projeto." },
        { title: "Planejamento de Espaço", desc: "Design em nível macro — arranjo ideal de paredes, portas e fluxos de ambientes para máxima funcionalidade." },
        { title: "Layout de Interiores", desc: "Design em nível micro — posicionamento de móveis, marcenaria personalizada, eletrodomésticos e fixtures." },
        { title: "Detalhamento Construtivo & Framing", desc: "Plantas de framing técnico, detalhes construtivos e quadro de portas/janelas — tudo que o construtor precisa para executar com precisão." },
        { title: "Conformidade de Código & Notas Técnicas", desc: "Citações de código municipal, notas de segurança e anotações profissionais para agilizar a aprovação do permit." },
        { title: "Render 3D Externo · Incluso", desc: "Visualização 3D externa de alta fidelidade incluída neste pacote. Ambientes de interior são cobrados separadamente a $150–$200 por ambiente.", highlight: true }
      ]
    },
    output: "Output: DWG, PDF",
    tools: "Chief Architect Expert",
    deliverables: {
      EN: "Permit-Ready PDF Set | Layered DWG Files",
      PT: "Set em PDF Pronto para Permit | Arquivos DWG em Camadas"
    }
  },
  {
    id: "redrawing",
    icon: <Icons.Redrawing />,
    badge: { EN: "PACKAGE 02 · FLOOR PLANS & SPACE PLANNING | Phase: SCHEMATIC DESIGN", PT: "PACOTE 02 · LAYOUT & PLANTAS BAIXAS | Phase: ESTUDO PRELIMINAR" },
    title: { EN: "Floor Plans Only", PT: "Apenas Plantas Baixas" },
    desc: { 
      EN: "Specialized technical drafting focused on interior space optimization. Engineered for preliminary space studies, zoning analysis, and high-end 2D layout concepts.",
      PT: "Desenho técnico especializado focado na otimização de layouts internos. Ideal para estudos de viabilidade espacial, análise de zoneamento e propostas conceituais em 2D."
    },
    calloutBox: {
      EN: "Whether you are an investor pitching an asset or a property owner visualizing a space, our team delivers precise architectural drafting with a rapid turnaround and aesthetic refinement that generic drafting services simply cannot match.",
      PT: "Seja você um investidor validando um ativo ou um proprietário visualizando o potencial de um imóvel, nossa equipe entrega plantas arquitetônicas precisas, combinando agilidade e refino estético que serviços genéricos de desenho não conseguem alcançar."
    },
    list: {
      EN: [
        { label: "Core Spatial Layouts", desc: "Internal wall placement, door schedules, and space identification." },
        { label: "Dimensioned Floor Plans", desc: "High-accuracy measurements of all interior spaces and structural baselines." },
        { label: "Advanced CAD Layer Management", desc: "Organized and clean file structure for professional integration." },
        { label: "Revision & Markup Integration", desc: "Seamless processing of feedback and design markups." }
      ],
      PT: [
        { label: "Layouts Espaciais Estratégicos", desc: "Posicionamento de paredes internas, fluxos de portas e identificação técnica de ambientes." },
        { label: "Plantas Baixas Dimensionadas", desc: "Medições precisas de todos os espaços internos e eixos estruturais." },
        { label: "Organização Avançada de Camadas", desc: "Estrutura de arquivos CAD limpa e padronizada para uso profissional." },
        { label: "Integração de Revisões e Markups", desc: "Processamento ágil de feedbacks e anotações técnicas." }
      ]
    },
    output: "Output: .DWG, .PDF",
    deliverables: {
      EN: "White-Label Ready | Cloud-Integrated Workflow",
      PT: "Pronto para White-Label | Fluxo em Nuvem"
    },
    notIncluded: {
      EN: ["Exterior Design", "3D Renderings", "Municipal Permitting", "Structural Engineering"],
      PT: ["Design Exterior", "Renderizações 3D", "Aprovação em Prefeitura", "Engenharia Estrutural"]
    }
  },
  {
    id: "viz",
    icon: <Icons.Viz />,
    badge: { EN: "PACKAGE 03 · 3D VISUALIZATION | Phase: PRESENTATION & MARKETING", PT: "PACOTE 03 · VISUALIZAÇÃO 3D | Phase: APRESENTAÇÃO & MARKETING" },
    title: { EN: "High-End 3D Visualization", PT: "Visualização 3D de Alto Padrão" },
    desc: { 
      EN: "High-end architectural rendering and CGI support designed to transform technical blueprints into immersive visual assets. Engineered to elevate real estate marketing, client presentations, and pre-sale strategies.",
      PT: "Renderização arquitetônica de alto padrão desenvolvida para transformar plantas técnicas em ativos visuais imersivos. Ideal para potencializar o marketing imobiliário, apresentações a clientes e estratégias de pré-venda."
    },
    calloutBox: {
      EN: "Designed for builders, developers, and real estate professionals who need to visualize potential and secure capital. We deliver hyper-realistic 3D assets that communicate design intent and luxury value long before groundbreaking.",
      PT: "Desenvolvido para construtores, incorporadores e profissionais do mercado imobiliário que precisam tangibilizar o potencial e atrair capital. Entregamos imagens 3D hiper-realistas que comunicam valor e sofisticação muito antes do início das obras."
    },
    list: {
      EN: [
        { label: "Photorealistic Renderings", desc: "High-resolution interior and exterior 3D perspectives with premium material mapping." },
        { label: "Lighting & Atmosphere Crafting", desc: "Advanced daytime/nighttime environmental setups tailored to project aesthetics." },
        { label: "Digital Material Staging", desc: "Accurate representation of textures, finishes, fixtures, and landscape elements." },
        { label: "Marketing-Ready Deliverables", desc: "Optimized, high-fidelity files ready for web, print, and investor pitches." }
      ],
      PT: [
        { label: "Renderizações Fotorrealistas", desc: "Perspectivas 3D internas e externas em alta resolução com mapeamento de materiais premium." },
        { label: "Estudo de Iluminação e Atmosfera", desc: "Configurações avançadas de cenários diurnos ou noturnos alinhados à estética do projeto." },
        { label: "Humanização e Texturização Digital", desc: "Representação precisa de texturas, acabamentos, mobiliário e elementos de paisagismo." },
        { label: "Ativos Prontos para Marketing", desc: "Arquivos finais em alta fidelidade otimizados para uso digital, material impresso e pitches de investidores." }
      ]
    },
    notIncluded: {
      EN: ["Municipal Permitting", "Structural Engineering", "Working Construction Drawings", "CAD/BIM Floor Plans"],
      PT: ["Aprovação em Prefeitura", "Engenharia Estrutural", "Desenhos Executivos de Obra", "Plantas Baixas em CAD/BIM"]
    },
    ctaNote: {
      EN: "[ Custom Estimate Based on Views → ]\\n*Rates are calculated per camera angle and complexity. Generate your instant quote via our Estimate portal.",
      PT: "[ Solicitar Estimativa por Ângulo → ]\\n*Valores calculados com base no número de vistas e complexidade. Gere seu orçamento instantâneo no painel Estimate."
    },
    output: "Output: JPG, MP4, PDF",
    deliverables: {
      EN: "4K Still Renders | Board-Ready Assets",
      PT: "Renders 4K | Ativos para Reunião"
    }
  },
  {
    id: "permit_processing",
    icon: <Icons.OfficeSupport />,
    isUS: true,
    title: { EN: "Municipal Approval Support", PT: "Suporte para Aprovação Municipal" },
    desc: { 
      EN: "Streamline your permitting process. We ensure every drawing strictly complies with IBC/IRC standards and local zoning codes to eliminate RFIs and accelerate approvals.",
      PT: "Agilize o licenciamento do seu projeto. Garantimos total conformidade técnica com os códigos locais (IBC/IRC) e de zoneamento, blindando sua entrega contra RFIs e atrasos na prefeitura."
    },
    list: {
      EN: ["IBC/IRC Code Compliance Review", "Comprehensive Zoning Analysis", "Strategic RFI Mitigation", "ADA Accessibility Verification"],
      PT: ["Revisão de Conformidade IBC / IRC", "Análise Estratégica de Zoneamento", "Engenharia de Mitigação de RFI", "Verificação de Acessibilidade (ADA Standards)"]
    },
    output: "Standards: IBC, IRC, ADA"
  },
  {
    id: "wood_frame",
    icon: <Icons.WoodFrame />,
    isUS: true,
    title: { EN: "Wood Framing Support", PT: "Suporte em Wood Framing" },
    desc: { 
      EN: "Accurate structural drafting for seamless field execution. We deliver advanced framing layouts and preliminary sizing, providing the precise graphic foundation required to streamline final engineering and approval.",
      PT: "Engenharia gráfica precisa para o sistema construtivo americano. Desenvolvemos plantas de framing e pré-dimensionamento preliminar, fornecendo a base técnica ideal para otimizar o detalhamento final por profissionais licenciados (PE Engineers)."
    },
    list: {
      EN: ["Wall & Floor Framing Layouts", "Preliminary Structural Sizing", "3D Framing Modeling & Visualization", "Technical Documentation Support"],
      PT: ["Layouts de Framing (Wall & Floor Systems)", "Pré-dimensionamento Estrutural Preliminar", "Modelagem e Visualização 3D de Framing", "Suporte em Documentação Técnica"]
    },
    output: "Output: DWG, PDF",
    tools: "Chief Architect · AutoCAD",
    deliverables: {
      EN: "Framing Details | Submittal-Ready Plans",
      PT: "Detalhes de Framing | Plantas Prontas para Submissão"
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    title: { EN: "Precision CAD Conversion", PT: "Conversão CAD de Alta Precisão" },
    desc: { 
      EN: "Transform static PDF plans, sketches, or legacy blueprints into fully editable, high-precision CAD files. All projects are modeled in Chief Architect to ensure spatial integrity before final export.",
      PT: "Transforme plantas estáticas em PDF, esboços ou projetos antigos em arquivos CAD totalmente editáveis e de alta precisão. Projetos modelados integralmente em Chief Architect, garantindo integridade espacial antes da exportação final."
    },
    list: {
      EN: [
        "Fully Editable CAD Files (DWG)",
        "True-Scale Accuracy & Verification",
        "Custom Layer Mapping & Structuring",
        "Block & Attribute Creation",
        "Ideal for Digital Archiving & Contractors"
      ],
      PT: [
        "Arquivos CAD Totalmente Editáveis (DWG)",
        "Escala e Verificação Precisas (1:1)",
        "Mapeamento e Estruturação de Camadas",
        "Criação de Blocos e Atributos",
        "Ideal para Arquivamento Digital e Empreiteiros"
      ]
    },
    output: "Output: .DWG, .PDF",
    deliverables: {
      EN: "100% Manual Drafting | Intelligent CAD Conversion on Demand.",
      PT: "Redesenho 100% Manual | Conversão inteligente para CAD sob demanda."
    },
    notIncluded: {
      EN: ["Architectural Design", "Code Review", "Field Measurements", "3D Modeling"],
      PT: ["Design Arquitetônico", "Revisão de Códigos", "Medições no Local", "Modelagem 3D"]
    }
  },
  {
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    title: { EN: "High-Performance Back-Office Support", PT: "Suporte Back-Office de Alta Performance" },
    desc: { 
      EN: "Scale your firm’s production capacity without the overhead of expanding your local team. We act as your dedicated technical back-office, handling high-volume drafting and complex revisions so you can focus on winning new contracts and managing client relationships.",
      PT: "Escale a capacidade de produção do seu escritório sem os custos fixos de expandir sua equipe local. Atuamos como seu back-office técnico dedicado, lidando com grandes volumes de desenho e revisões complexas."
    },
    list: {
      EN: ["Agile Revision Cycles", "Capacity on Demand", "Standardized Workflows", "Complex Layout Modeling", "Project Documentation Management"],
      PT: ["Ciclos de Revisão Ágeis", "Capacidade Sob Demanda", "Fluxos de Trabalho Padronizados", "Modelagem de Layouts Complexos", "Gestão de Documentação de Projeto"]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: "White-Label Integration | Time-Zone Advantage",
      PT: "Integração White-Label | Vantagem de Fuso Horário"
    }
  }
];`;

content = content.replace(/const SERVICES_DATA = \[[\s\S]*?\];/, 'const SERVICES_DATA = ' + newArray);

// Update Header
content = content.replace(
  /<span className="title-white">Premium<\/span> <span className="title-gradient-italic">Services<\/span>/g,
  '<span className="title-white">High-Performance</span> <span className="title-gradient-italic">Drafting & 3D Support</span>'
);

content = content.replace(
  /<span className="title-gradient-italic">Suporte Técnico<\/span> <span className="title-white">Especializado<\/span>/g,
  '<span className="title-gradient-italic">Suporte Técnico</span> <span className="title-white">de Alta Performance nos EUA</span>'
);

content = content.replace(
  /"DARA Studio acts as a high-performance technical extension for architecture and engineering firms worldwide, transforming complex project demands into precision, professional-ready deliverables."/g,
  '"DARA Studio operates as a seamless technical extension for US builders, developers, and architects. We transform complex project demands into precise, permit-ready documentation. Scale your operation without the overhead."'
);

content = content.replace(
  /"DARA Studio atua como uma extensão técnica de alta performance para escritórios de arquitetura e engenharia em todo o mundo, transformando demandas complexas de projetos em entregas precisas e prontas para uso profissional."/g,
  '"A DARA Studio atua como o braço técnico estratégico de construtores, incorporadores e escritórios no mercado americano. Desenvolvemos documentação técnica precisa, do estudo preliminar ao Permit Set, garantindo agilidade e total conformidade com as normas locais."'
);

// Update Map Logic
const mapLogicOld = `<p className="service-desc">{service.desc[lang]}</p>
                
                {service.bentoExtras ? (`;

const mapLogicNew = `<p className="service-desc">{service.desc[lang]}</p>
                
                {service.calloutBox && (
                  <div style={{ background: "rgba(251, 191, 36, 0.05)", border: "1px solid rgba(251, 191, 36, 0.2)", borderRadius: "8px", padding: "12px 16px", marginTop: "16px", display: "flex", gap: "10px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "16px", marginTop: "-2px" }}>💡</span>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)", lineHeight: "1.5", margin: 0 }}>
                      {service.calloutBox[lang]}
                    </p>
                  </div>
                )}
                
                {service.bentoExtras ? (`;

content = content.replace(mapLogicOld, mapLogicNew);

const bentoIncludedOld = `<div style={{ background: "rgba(16, 185, 129, 0.04)", border: "1px solid rgba(16, 185, 129, 0.15)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "#10b981", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "WHAT'S INCLUDED" : "O QUE ESTÁ INCLUSO"}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {service.list[lang].map((item, i) => (
                          <li key={i} style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: "#10b981", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>`;

const bentoIncludedNew = `<div style={{ background: "var(--a-dim)", border: "1px solid var(--a-glow)", borderRadius: "12px", padding: 16 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".05em", color: "var(--a)", marginBottom: 12, textTransform: "uppercase" }}>{lang === "EN" ? "WHAT'S INCLUDED" : "O QUE ESTÁ INCLUSO"}</p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                        {service.list[lang].map((item, i) => (
                          <li key={i} style={{ fontSize: 13, color: "var(--tx)", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <span style={{ color: "var(--a)", fontSize: 16, lineHeight: 1, marginTop: -2 }}>•</span>
                            <span>
                              {typeof item === 'string' ? item : (
                                <>
                                  <strong style={{ color: "#fff" }}>{item.label}:</strong> {item.desc}
                                </>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>`;

content = content.replace(bentoIncludedOld, bentoIncludedNew);

const bentoNotIncludedOld = `<div style={{ background: "rgba(233, 30, 99, 0.04)", border: "1px solid rgba(233, 30, 99, 0.15)", borderRadius: "12px", padding: 16 }}>`;
const bentoNotIncludedNew = `<div style={{ background: "rgba(233, 30, 99, 0.03)", border: "1px solid rgba(233, 30, 99, 0.15)", borderRadius: "12px", padding: 16 }}>`;
content = content.replace(bentoNotIncludedOld, bentoNotIncludedNew);

const ctaLogicOld = `</ul>
                )}

                {service.output && (`;

const ctaLogicNew = `</ul>
                )}
                
                {service.ctaNote && (
                  <div style={{ marginTop: "16px", padding: "12px 16px", borderRadius: "8px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div onClick={() => navigate('/estimate')} style={{ cursor: "pointer", color: "var(--a)", fontWeight: 600, fontSize: "13px" }}>
                      {service.ctaNote[lang].split('\\n')[0]}
                    </div>
                    <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", lineHeight: "1.4", margin: 0 }}>
                      {service.ctaNote[lang].split('\\n')[1]}
                    </p>
                  </div>
                )}

                {service.output && (`;

content = content.replace(ctaLogicOld, ctaLogicNew);

const bentoStyleOld = `background: bento.highlight ? "rgba(16, 185, 129, 0.04)" : "rgba(255,255,255,0.02)", 
                          border: bento.highlight ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(255,255,255,0.05)",`;

const bentoStyleNew = `background: bento.highlight ? "var(--a-dim)" : "rgba(255,255,255,0.02)", 
                          border: bento.highlight ? "1px solid var(--a-glow)" : "1px solid rgba(255,255,255,0.05)",`;

content = content.replace(bentoStyleOld, bentoStyleNew);

const bentoTitleOld = `<h4 style={{ fontSize: 14, fontWeight: 700, color: bento.highlight ? "#10b981" : "#fff", marginBottom: 8, lineHeight: 1.3 }}>{bento.title}</h4>`;
const bentoTitleNew = `<h4 style={{ fontSize: 14, fontWeight: 700, color: bento.highlight ? "var(--a)" : "#fff", marginBottom: 8, lineHeight: 1.3 }}>{bento.title}</h4>`;

content = content.replace(bentoTitleOld, bentoTitleNew);

fs.writeFileSync(path, content, 'utf-8');
console.log("Successfully rebuilt Services.jsx");
