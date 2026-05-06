const puppeteer = require('puppeteer');
const { daraConfirmationPDF } = require('../templates/confirmation');

/**
 * Generate a Project Confirmation PDF using Puppeteer
 * @param {Object} data - Confirmation data
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateProjectPDF(data) {
  let browser;
  try {
    const html = daraConfirmationPDF(data);
    
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set HTML content
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });
    
    return pdfBuffer;
  } catch (err) {
    console.error('[pdfGenerator] Error:', err.message);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generateProjectPDF };
