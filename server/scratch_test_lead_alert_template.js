const { daraInternalLeadAlertEmail } = require('./templates/confirmation');
const fs = require('fs');
const path = require('path');

const testData = {
  client: { name: "Juliana Mendes", email: "juliana@design.com", phone: "+55 11 98888-7777" },
  location: { address: "Av. Paulista, 1000 - São Paulo, SP", region: "Brasil" },
  project: { propertyType: "Apartment", sqft: 1200 },
  estimate: "R$ 4.500,00 – R$ 5.200,00",
  timestamp: "06/05/2026 14:15:30"
};

const html = daraInternalLeadAlertEmail(testData);
const scratchDir = path.join(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir);

fs.writeFileSync(path.join(scratchDir, 'test_lead_alert.html'), html);
console.log("HTML generated at server/scratch/test_lead_alert.html");
