const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/LandingPage.jsx';
let text = fs.readFileSync(filePath, 'utf8');

text = text.replace(
  /heroTitle1:\s*".*?",/g,
  'heroTitle1: "US Construction Standards.",'
);
text = text.replace(
  /heroTitle2:\s*".*?",/g,
  'heroTitle2: "Seamless Remote Execution.",'
);
text = text.replace(
  /heroSubtitle:\s*".*?",/g,
  'heroSubtitle: "We deliver high-precision permit sets, architectural drafting, and detailed construction documentation tailored to US municipal codes. Scale your construction or development pipeline with an agile, dedicated technical partner.",'
);
text = text.replace(
  /statsRating:\s*".*?",/g,
  'statsRating: "Certified Workflow",\n      statsRatingTooltip: "High-end drafting and architectural support for builders and investors.",'
);
text = text.replace(
  /statsMarket:\s*".*?",/g,
  'statsMarket: "US Code Compliance",\n      statsMarketTooltip: "Projects executed strictly under IBC, IRC, and local zoning frameworks.",'
);
text = text.replace(
  /statsTurnaround:\s*".*?",/g,
  'statsTurnaround: "Turnaround Efficiency",\n      statsTurnaroundTooltip: "Production cycles optimized for 8 to 16 days.",'
);
text = text.replace(
  /getEstimate:\s*".*?",/g,
  'getEstimate: "REQUEST PROPOSAL",'
);
text = text.replace(
  /accessPortal:\s*".*?",/g,
  'accessPortal: "ACCESS PORTAL",'
);

// Portuguese fixes
text = text.replace(
  /heroTitle1:\s*"Projetos no Padr.*?Americano.*?",/g,
  'heroTitle1: "Projetos no Padrão Americano.",'
);
text = text.replace(
  /heroTitle2:\s*"com o Atendimento que.*?",/g,
  'heroTitle2: "Execução Remota sem Barreiras.",'
);
text = text.replace(
  /heroSubtitle:\s*"Desenvolvemos seus blueprints.*?",/g,
  'heroSubtitle: "Desenvolvemos Permit Sets, detalhamentos executivos e documentação técnica de alta precisão para o mercado dos EUA. A união exata entre o rigor dos códigos de construção americanos e a proximidade de um atendimento humanizado e transparente.",'
);
text = text.replace(
  /statsRating:\s*"Nota 4.9.*?projetos",/g,
  'statsRating: "Suporte Credenciado",\n      statsRatingTooltip: "Estrutura técnica sob medida para construtores, empreiteiros e investidores.",'
);
text = text.replace(
  /statsMarket:\s*"Padr.*?o EUA \(US Codes\)",/g,
  'statsMarket: "Conformidade de Códigos",\n      statsMarketTooltip: "Projetos alinhados estritamente às normas locais norte-americanas.",'
);
text = text.replace(
  /statsTurnaround:\s*"Entrega em 8-16 dias",/g,
  'statsTurnaround: "Velocidade de Entrega",\n      statsTurnaroundTooltip: "Fluxo de produção calibrado para entregas entre 8 e 16 dias.",'
);
text = text.replace(
  /getEstimate:\s*"Solicitar Or.*?amento",/g,
  'getEstimate: "SOLICITAR ORÇAMENTO",'
);
text = text.replace(
  /accessPortal:\s*"Acessar Portal",/g,
  'accessPortal: "ACESSAR PORTAL",'
);

fs.writeFileSync(filePath, text, 'utf8');
