const express = require('express');
const { docToPdfController, getMyDocument, pdfToDocController, getMyPdfDocument } = require("../controllers/transformController")


const router = express.Router();
const upload = require('./../middleware/upload');

router.post('/convert-doc-to-pdf', upload.single('file'), docToPdfController);

router.get('/download/:id', getMyDocument);

router.post('/pdf-to-doc',upload.single('file'), pdfToDocController);

router.get('/download-pdf/:id', getMyPdfDocument);

module.exports = router;
