const fs = require('fs');
const filePath = 'd:/DARA Studio - Portal/client/src/components/Footer.jsx';
let text = fs.readFileSync(filePath, 'utf8');

text = text.replace(
  /copyright: "WORLDWIDE ARCHITECTURAL PRODUCTION & SUPPORT",/g,
  'copyright: "GLOBAL ARCHITECTURAL PRODUCTION & REMOTE TECHNICAL SUPPORT",'
);
text = text.replace(
  /legal: "All technical documentation and design assets are the exclusive property of DARA Studio. Original content is protected under international intellectual property laws for the benefit of our global partners.",/g,
  'legal: "All technical documentation, drafting files, and design assets remain the exclusive intellectual property of DARA Studio and its global partners.",'
);
text = text.replace(
  /confidentiality: "Confidentiality and data protection for all projects. Technical data is processed following strict security protocols to ensure your architectural assets are safe.",/g,
  'confidentiality: "Projects are executed under strict data protection protocols and non-disclosure agreements (NDA) to guarantee absolute asset security.",'
);

// Portuguese fixes
text = text.replace(
  /copyright: "PRODU.*?",/g,
  'copyright: "PRODUÇÃO ARQUITETÔNICA MUNDIAL E SUPORTE TÉCNICO REMOTO",'
);
text = text.replace(
  /legal: "Toda a documenta.*?globais.",/g,
  'legal: "Toda a documentação técnica e ativos de design são propriedade exclusiva da DARA Studio e de seus parceiros globais.",'
);
text = text.replace(
  /confidentiality: "Confidencialidade.*?seguros.",/g,
  'confidentiality: "Nossos processos seguem protocolos rigorosos de segurança de dados e confidencialidade, garantindo total proteção ao patrimônio dos nossos clientes.",'
);

fs.writeFileSync(filePath, text, 'utf8');
