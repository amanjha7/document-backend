const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ConvertedFile = require('../models/ConvertedFile');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/convert-doc-to-pdf', upload.single('file'), async (req, res) => {
  try {
    const { buffer, originalname } = req.file;

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const inputFile = path.join(tempDir, originalname);
    const outputFile = inputFile.replace(/\.[^/.]+$/, '.pdf');

    fs.writeFileSync(inputFile, buffer);

    const convertCommand = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${inputFile}"`;

    exec(convertCommand, async (error, stdout, stderr) => {
      console.log('LibreOffice stdout:', stdout);
      console.error('LibreOffice stderr:', stderr);

      if (error) {
        console.error('LibreOffice conversion error:', error);
        return res.status(500).json({ error: 'Conversion process failed' });
      }

      try {
        await waitForFile(outputFile, 15000); // extended timeout

        const pdfBuffer = fs.readFileSync(outputFile);

        const saved = await ConvertedFile.create({
          filename: originalname.replace(/\.[^/.]+$/, '.pdf'),
          mimetype: 'application/pdf',
          pdfBuffer,
          createdAt: new Date(),
        });

        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        res.json({ message: 'File converted successfully', id: saved._id });
      } catch (waitErr) {
        console.error('PDF file did not appear in time:', waitErr);
        return res.status(500).json({ error: 'PDF file creation timeout' });
      }
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const waitForFile = (filePath, timeout = 15000) => {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (fs.existsSync(filePath)) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('PDF not created in time'));
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  });
};

router.get('/download/:id', async (req, res) => {
  try {
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid or missing ID' });
    }

    const file = await ConvertedFile.findById(req.params.id);
    if (!file) return res.status(404).send('File not found or expired');

    res.set({
      'Content-Type': file.mimetype,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    res.send(file.pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send('Download failed');
  }
});

module.exports = router;
