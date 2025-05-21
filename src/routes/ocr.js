const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { JSDOM } = require('jsdom');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', (req, res) => {
  res.send('OCR API is working');
});

router.get('/extract-text',(req,res)=>{
    res.send('Hello from OCR');
})

router.post('/extract-text', upload.single('file'), async (req, res) => {
  const file = req?.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const filePath = path.resolve(file.path);

    let extractedText = '';

    if (file.mimetype === 'application/pdf') {
      const tempDir = `./uploads/${uuidv4()}`;
      fs.mkdirSync(tempDir);

      const convert = fromPath(filePath, {
        density: 300,
        saveFilename: 'page',
        savePath: tempDir,
        format: 'png',
        width: 1200,
        height: 1600,
      });

      const totalPages = 3; // Optional: limit pages for performance
      for (let i = 1; i <= totalPages; i++) {
        const output = await convert(i);
        const imagePath = output.path;

        const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
        extractedText +=  text;

        fs.unlinkSync(imagePath); // cleanup
      }

      fs.unlinkSync(filePath);
      fs.rmdirSync(tempDir);
    } else {
      const { data } = await Tesseract.recognize(filePath, 'eng');
      extractedText = data.text || '';
      // extractedText = processHOCR(data.hocr); // Implement hOCR parser
    }

    res.json({ text: extractedText.trim() });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error processing file: ' + err.message });
  } finally {
    if (file && fs.existsSync(file.path)) {
      try { fs.unlinkSync(file.path); } catch (e) {}
    }
  }
});

function processHOCR(hocr) {
  const dom = new JSDOM(hocr);
  const doc = dom.window.document;
  const words = doc.querySelectorAll('.ocrx_word');
  
  let result = '';
  words.forEach(word => {
    const text = word.textContent;
    const bold = word.querySelector('.ocr_strong') ? '**' : '';
    const italic = word.querySelector('.ocr_em') ? '_' : '';
    result += `${bold}${italic}${text}${italic}${bold} `;
  });

  return result;
}

module.exports = router;
