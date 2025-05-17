const express = require('express');
const { docToPdfController, getMyDocument, pdfToDocController } = require("../controllers/transformController")


const router = express.Router();
const upload = require('./../middleware/upload');

router.post('/convert-doc-to-pdf', upload.single('file'), docToPdfController);

router.get('/download/:id', getMyDocument);

router.post('/convert-pdf-to-doc',upload.single('file'), pdfToDocController);

router.get('/download-pdf/:id');

module.exports = router;
