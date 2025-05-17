const logger = require('../utils/logger');
const {waitForFile} = require('./../utils/apputils')
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ConvertedFile = require('../models/ConvertedFile');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

exports.docToPdfController = async (buffer,originalname)=>{
    try{
        logger.info("Entering docToPdfController().");
        const tempDir = path.join(__dirname, '../../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
    
        const inputFile = path.join(tempDir, originalname);
        const outputFile = inputFile.replace(/\.[^/.]+$/, '.pdf');
    
        fs.writeFileSync(inputFile, buffer);
    
        const convertCommand = `libreoffice --headless --convert-to pdf --outdir "${tempDir}" "${inputFile}"`;

        const saved = await new Promise((resolve,reject) => {
            exec(convertCommand, async (error, stdout, stderr) => {
                // const fs = require('fs');
                console.log('LibreOffice stdout:', stdout);
                console.error('LibreOffice stderr:', stderr);
        
                if (error) {
                console.error('LibreOffice conversion error:', error);
                throw new Error("No LibreOffice");
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
            
                    // res.json({ message: 'File converted successfully', id: saved._id });
                    // return saved;
                    resolve(saved);
                } 
                catch (waitErr) {
                    console.error('PDF file did not appear in time:', waitErr);
                    // throw new Error("File Creation TimeOut.")
                    reject("File Creation Failed");
                }
            });
        })

        return saved;

        
    }catch(error){
        logger.error('error occured at docToPdfController():', err);
        throw error;
    }
}

exports.getDocToPdfService = async (id)=>{
    try{
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('No Id Found!!');
        }
    
        const file = await ConvertedFile.findById(id);
        if (!file) {
            throw new Error("File Not Found.")
        }
    
        const header = {
            'Content-Type': file.mimetype,
            'Content-Disposition': `attachment; filename="${file.filename}"`,
        };
    
        // res.send(file.pdfBuffer);
        return {pdfBuffer : file.pdfBuffer, header};
            
    }catch(err){
        logger.info("Error occured at getDocToPdfService()", err);
        throw err;
    }
}

exports.pdfToDocService = async (buffer, originalname) => {
  try {
    logger.info('Entering pdfToDocService()');

    const tempDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const uniqueId = uuidv4();
    const inputPath = path.join(tempDir, `${uniqueId}.pdf`);
    const outputPath = path.join(tempDir, `${uniqueId}.docx`);

    fs.writeFileSync(inputPath, buffer);

    const command = `libreoffice --headless --convert-to docx --outdir ${tempDir} ${inputPath}`;

    return new Promise((resolve, reject) => {
      exec(command, (err) => {
        if (err) {
          logger.error('LibreOffice conversion failed', err);
          fs.unlinkSync(inputPath);
          return reject(err);
        }

        const filename = originalname.replace(/\.pdf$/i, '') + '.docx';
        resolve({ inputPath, outputPath, filename });
      });
    });

  } catch (err) {
    logger.error('Error Occurred at pdfToDocService()', err);
    throw err;
  }
};