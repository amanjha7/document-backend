const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const logger = require('../utils/logger');


router.post('/generate-pdf', async (req, res) => {
  const { htmlContent } = req.body;

  try {
    logger.info("Entering generate-pdf route");
    if (!htmlContent) {
      return res.status(400).send('HTML content is required');
    }
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=document.pdf',
    });

    logger.info("PDF generated successfully");
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).send('Failed to generate PDF');
  }
});


module.exports = router;