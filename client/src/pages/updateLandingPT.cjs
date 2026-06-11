const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/pages/LandingPage.jsx';
let text = fs.readFileSync(filePath, 'utf8');

const parts = text.split('PT: {');
if (parts.length > 1) {
    let ptPart = parts[1];
    
    ptPart = ptPart.replace(
      /heroTitle1: "US Construction Standards.",/,
      'heroTitle1: "Projetos no Padrão Americano.",'
    );
    ptPart = ptPart.replace(
      /heroTitle2: "Seamless Remote Execution.",/,
      'heroTitle2: "Execução Remota sem Barreiras.",'
    );
    ptPart = ptPart.replace(
      /heroSubtitle: "We deliver high-precision permit sets, architectural drafting, and detailed construction documentation tailored to US municipal codes\. Scale your construction or development pipeline with an agile, dedicated technical partner\.",/,
      'heroSubtitle: "Desenvolvemos Permit Sets, detalhamentos executivos e documentação técnica de alta precisão para o mercado dos EUA. A união exata entre o rigor dos códigos de construção americanos e a proximidade de um atendimento humanizado e transparente.",'
    );
    ptPart = ptPart.replace(
      /statsRating: "Certified Workflow",/,
      'statsRating: "Suporte Credenciado",'
    );
    ptPart = ptPart.replace(
      /statsRatingTooltip: "High-end drafting and architectural support for builders and investors.",/,
      'statsRatingTooltip: "Estrutura técnica sob medida para construtores, empreiteiros e investidores.",'
    );
    ptPart = ptPart.replace(
      /statsMarket: "US Code Compliance",/,
      'statsMarket: "Conformidade de Códigos",'
    );
    ptPart = ptPart.replace(
      /statsMarketTooltip: "Projects executed strictly under IBC, IRC, and local zoning frameworks.",/,
      'statsMarketTooltip: "Projetos alinhados estritamente às normas locais norte-americanas.",'
    );
    ptPart = ptPart.replace(
      /statsTurnaround: "Turnaround Efficiency",/,
      'statsTurnaround: "Velocidade de Entrega",'
    );
    ptPart = ptPart.replace(
      /statsTurnaroundTooltip: "Production cycles optimized for 8 to 16 days.",/,
      'statsTurnaroundTooltip: "Fluxo de produção calibrado para entregas entre 8 e 16 dias.",'
    );
    ptPart = ptPart.replace(
      /getEstimate: "REQUEST PROPOSAL",/,
      'getEstimate: "SOLICITAR ORÇAMENTO",'
    );
    ptPart = ptPart.replace(
      /accessPortal: "ACCESS PORTAL",/,
      'accessPortal: "ACESSAR PORTAL",'
    );

    text = parts[0] + 'PT: {' + ptPart;
    fs.writeFileSync(filePath, text, 'utf8');
}
