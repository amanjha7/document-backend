const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ConvertedFile = require('../models/ConvertedFile');
const mongoose = require('mongoose');
const { docToPdfController, getMyDocument } = require("./../controllers/transformController")


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/convert-doc-to-pdf', upload.single('file'), docToPdfController);

router.get('/download/:id', getMyDocument);

module.exports = router;
