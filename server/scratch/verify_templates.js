const { 
  daraConfirmationEmail, 
  daraInternalNotificationEmail, 
  daraSaveForLaterEmail, 
  daraInternalLeadAlertEmail 
} = require('../templates/confirmation');

const testData = {
  client: { name: "Test User", email: "test@example.com", phone: "123456789", role: "Lead" },
  location: { address: "123 Test St", region: "US" },
  project: { propertyType: "Single Family", sqft: "2000", serviceType: "New Construction", floors: 2 },
  summary: { floorPlans: "Standard", minFee: "Included", total: "$5,000 - $7,000" },
  estimate: "$5,000 - $7,000",
  resumeUrl: "http://localhost:5173/estimate?resume=123",
  timestamp: new Date().toLocaleString(),
  lang: "EN"
};

try {
  console.log("Testing Save for Later Template...");
  const html1 = daraSaveForLaterEmail(testData);
  console.log("HTML length:", html1.length);

  console.log("Testing Internal Lead Alert Template...");
  const html2 = daraInternalLeadAlertEmail(testData);
  console.log("HTML length:", html2.length);

  console.log("Testing Confirmation Template...");
  const html3 = daraConfirmationEmail(testData);
  console.log("HTML length:", html3.length);

  console.log("Testing Internal Notification Template...");
  const html4 = daraInternalNotificationEmail({ ...testData, projectId: "PROJ-001", notes: "Test notes" });
  console.log("HTML length:", html4.length);

  console.log("\n✅ All templates rendered successfully.");
} catch (err) {
  console.error("❌ Template rendering failed:", err);
}
