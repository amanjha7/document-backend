const mongoose = require('mongoose');

const convertedDocxFileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  docxBuffer: Buffer,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ConvertedDocxFile', convertedDocxFileSchema);