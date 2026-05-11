const { daraSaveForLaterEmail } = require('./templates/confirmation');
const fs = require('fs');
const path = require('path');

const testData = {
  client: { name: "Daniel Rabello", email: "daniel@example.com", phone: "+55 48 9999-9999", role: "Client" },
  location: { address: "123 Ocean Drive, Miami, FL", region: "United States" },
  project: { propertyType: "Single Family", sqft: 1800 },
  resumeUrl: "http://localhost:5173/wizard?resume=1&email=daniel@example.com",
  lang: 'EN'
};

const html = daraSaveForLaterEmail(testData);
const scratchDir = path.join(__dirname, 'scratch');
if (!fs.existsSync(scratchDir)) fs.mkdirSync(scratchDir);

fs.writeFileSync(path.join(scratchDir, 'test_save_for_later.html'), html);
console.log("HTML generated at server/scratch/test_save_for_later.html");
