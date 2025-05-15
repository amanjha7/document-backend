const mongoose = require('mongoose');

const convertedFileSchema = new mongoose.Schema({
  filename: String,
  mimetype: String,
  pdfBuffer: {
    type: Buffer,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 120 // auto-delete after 2 minutes
  }
});

module.exports = mongoose.model('ConvertedFile', convertedFileSchema);
