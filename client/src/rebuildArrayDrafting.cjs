const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

const newArray = `[
  {
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
      EN: \`[ Custom Estimate Based on Views → ]\\n*Rates are calculated per camera angle and complexity. Generate your instant quote via our Estimate portal.\`,
      PT: \`[ Solicitar Estimativa por Ângulo → ]\\n*Valores calculados com base no número de vistas e complexidade. Gere seu orçamento instantâneo no painel Estimate.\`
    },
    output: "Output: JPG, MP4, PDF",
    deliverables: {
      EN: "4K Still Renders | Board-Ready Assets",
      PT: "Renders 4K | Ativos para Reunião"
    }
  },
  {
    id: "pdf_cad",
    icon: <Icons.PdfCad />,
    badge: { EN: "PACKAGE 04 · CHIEF ARCHITECT CONVERSION | Phase: TECHNICAL DOCUMENTATION", PT: "PACOTE 04 · CONVERSÃO CHIEF ARCHITECT | Phase: DOCUMENTAÇÃO TÉCNICA" },
    title: { EN: "Chief Architect Conversion", PT: "Conversão Chief Architect" },
    desc: { 
      EN: "High-precision vectorization turning legacy blueprints, static PDFs, and sketches into fully editable, production-ready Chief Architect X17 native files and precise digital exports. Modeled directly within Chief Architect to ensure absolute spatial integrity.",
      PT: "Vetorização de alta precisão que transforma plantas antigas, PDFs estáticos e esboços em arquivos nativos do Chief Architect X17 totalmente editáveis e prontos para produção. Modelagem realizada na plataforma para garantir total integridade espacial."
    },
    calloutBox: {
      EN: "Precision is everything. We deliver millimeter-accurate digital conversions, structured under professional architectural layer standards. This allows your engineers and builders to begin working immediately, eliminating hours spent cleaning up messy files.",
      PT: "A precisão é tudo. Garantimos conversões digitais milimetricamente exatas, estruturadas sob padrões profissionais de camadas (layers). Isso permite que seus engenheiros e construtores comecem a trabalhar imediatamente, eliminando horas perdidas ajustando arquivos bagunçados."
    },
    list: {
      EN: [
        { label: "Fully Editable Native Files", desc: "Native Chief Architect X17 formats and clean exports compatible with industry-leading architectural software." },
        { label: "Precise Scalement & Verification", desc: "Rigorous verification and scaling adjustments to ensure real-world accuracy (1:1)." },
        { label: "Advanced Layer Management", desc: "Structured layer and plan views mapping for walls, dimensions, annotations, and blocks." },
        { label: "Digital Archiving Setup", desc: "Clean, high-performance file architecture ideal for contractors and digital storage." }
      ],
      PT: [
        { label: "Arquivos Nativos Totalmente Editáveis", desc: "Arquivo original em formato Chief Architect X17 e exportações limpas compatíveis com os principais softwares do mercado." },
        { label: "Escalonamento e Verificação Precisos", desc: "Ajustes e verificações rigorosas para garantir precisão absoluta no mundo real (escala 1:1)." },
        { label: "Organização Avançada de Camadas (Layers)", desc: "Estruturação inteligente de camadas e vistas técnicas para paredes, dimensões, anotações e atributos." },
        { label: "Infraestrutura para Arquivamento Digital", desc: "Arquivos limpos e otimizados, ideais para o dia a dia de empreiteiros e construtores." }
      ]
    },
    output: "Output: .PLAN, .DWG, .PDF",
    deliverables: {
      EN: "100% Native Modeling | Production-Ready Files",
      PT: "Modelagem 100% Nativa | Arquivos Prontos para Produção"
    },
    notIncluded: {
      EN: ["Architectural Design", "Code & Zoning Compliance Review", "On-Site Field Measurements", "3D Modeling & Rendering"],
      PT: ["Design Arquitetônico", "Revisão de Códigos e Zoneamento", "Medições de Campo (no Local)", "Modelagem 3D e Renderização"]
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
    id: "office_support",
    icon: <Icons.OfficeSupport />,
    badge: { EN: "CORPORATE SOLUTIONS · B2B SUPPORT", PT: "SOLUÇÕES CORPORATIVAS · SUPORTE B2B" },
    title: { EN: "High-Performance Back-Office Support", PT: "Suporte Back-Office de Alta Performance" },
    desc: { 
      EN: "Scale your firm’s production capacity without the overhead of expanding your local team. DARA Studio operates as your dedicated technical back-office, seamlessly handling high-volume drafting, precision documentation, and complex revisions.",
      PT: "Escale a capacidade de produção do seu escritório ou construtora sem os custos fixos de expandir sua equipe local nos EUA. Atuamos como seu back-office técnico dedicado, absorvendo grandes volumes de desenho, detalhamento e revisões complexas."
    },
    list: {
      EN: [
        { label: "Accelerated Revision Cycles", desc: "Fast turnaround times to keep your active projects moving forward." },
        { label: "On-Demand Scalability", desc: "Instant technical capacity to absorb sudden increases in project volume." },
        { label: "Standardized Technical Workflows", desc: "Seamless file integration aligned with US graphic standards." },
        { label: "Complex Layout & Project Management", desc: "End-to-end technical production and drafting oversight." }
      ],
      PT: [
        { label: "Ciclos de Revisão Ágeis", desc: "Prazos otimizados para manter o fluxo dos seus projetos em andamento." },
        { label: "Capacidade Sob Demanda", desc: "Infraestrutura técnica imediata para absorver picos de demanda." },
        { label: "Fluxos de Trabalho Padronizados", desc: "Processos integrados e alinhados aos padrões gráficos americanos." },
        { label: "Modelagem e Gestão Documental", desc: "Produção de documentação técnica e detalhamentos complexos." }
      ]
    },
    output: "Consultative Extension",
    deliverables: {
      EN: "White-Label Integration | Time-Zone Advantage",
      PT: "Integração White-Label | Vantagem de Fuso Horário"
    }
  }
];`;

content = content.replace(/const SERVICES_DATA = \[\s*\{[\s\S]*?\}\s*\];/, 'const SERVICES_DATA = ' + newArray);

fs.writeFileSync(path, content, 'utf-8');
console.log("Successfully rebuilt array again");
