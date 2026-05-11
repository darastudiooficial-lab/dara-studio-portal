const puppeteer = require('puppeteer');
const { daraConfirmationPDF, daraDraftPDF } = require('../templates/confirmation');

/**
 * Generate a Project Confirmation PDF using Puppeteer
 * @param {Object} data - Confirmation data
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateProjectPDF(data) {
  return _generate(daraConfirmationPDF(data));
}

/**
 * Generate a Project Draft PDF using Puppeteer
 * @param {Object} data - Draft data
 * @returns {Promise<Buffer>} - PDF buffer
 */
async function generateDraftPDF(data) {
  return _generate(daraDraftPDF(data));
}

async function _generate(html) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });
  } catch (err) {
    console.error('[pdfGenerator] Error:', err.message);
    throw err;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generateProjectPDF, generateDraftPDF };
