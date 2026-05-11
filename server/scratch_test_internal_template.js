const { daraInternalNotificationEmail } = require('./templates/confirmation');
const fs = require('fs');
const path = require('path');

const testData = {
  client: { name: "Daniel Rabello", email: "daniel@example.com", phone: "+55 48 9999-9999", role: "Owner" },
  location: { address: "123 Ocean Drive, Miami, FL", region: "United States" },
  project: { propertyType: "Single Family", floors: "2", serviceType: "Architectural Design", sqft: 1800 },
  summary: {
    floorPlans: "$990.00",
    minFee: "$200.00",
    total: "$1,190.00 – $1,309.00"
  },
  notes: "O cliente gostaria de priorizar a iluminação natural na sala de estar e mencionou que possui um pet grande, então o piso precisa ser resistente.",
  projectId: "452",
  timestamp: "06/05/2026 10:30:15"
};

const html = daraInternalNotificationEmail(testData);
const scratchDir = path.join(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir);

fs.writeFileSync(path.join(scratchDir, 'test_internal_notification.html'), html);
console.log("HTML generated at server/scratch/test_internal_notification.html");
