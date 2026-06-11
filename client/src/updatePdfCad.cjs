const fs = require('fs');

const path = 'd:/DARA Studio - Portal/client/src/pages/Services.jsx';
let content = fs.readFileSync(path, 'utf-8');

// The new object string
const replacementObject = `{
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
  }`;

// Regular expression to replace the pdf_cad block.
// This matches from id: "pdf_cad" to the end of its object before the next element or end of array.
const regex = /{\s*id:\s*"pdf_cad"[\s\S]*?(?=\s*},\s*{|\s*}\s*];)/;

content = content.replace(regex, replacementObject);

fs.writeFileSync(path, content, 'utf-8');
console.log("Successfully updated pdf_cad");
