const logger = require('../utils/logger')
const { docToPdfController, getDocToPdfService, getPdfFileService, pdfToDocService } = require('./../services/transformService')

exports.docToPdfController = async (req,res)=>{
    try{
        logger.info("Entering docToPdfController()");
        const { buffer, originalname } = req.file;
        const saved = await docToPdfController(buffer,originalname);
        return res.status(200).json({message:'Successfully converted to pdf.', id: saved._id });
    }catch(err){
        logger.error("Error occured in docToPdfController() ", err);
        return res.status(500).json({message:'Error occured while converting to pdf.'})
    } finally {
        logger.info("Leaving docToPdfController()");
    }
}

exports.getMyDocument = async (req,res) => {
    try{
        logger.info("Entering getMyDocument()");
        const id = req.params.id 
        const  {header, pdfBuffer} = await getDocToPdfService(id)
        res.set(header);
        res.send(pdfBuffer);
    }catch(error){
        logger.error("Error getting getMyDocument()");
        res.status(500).json({message:'Download Failed'});
    } finally {
        logger.info("Leaving getMyDocument()");
    }
}

exports.pdfToDocController = async (req, res) => {
  try {
    logger.info("Entering pdfToDocController()");
    const { buffer, originalname } = req.file;
    const saved = await pdfToDocService(buffer, originalname);
    return res.status(200).json({ message: 'Successfully converted to DOCX.', id: saved._id });
  } catch (err) {
    logger.error("Error occurred in pdfToDocController() ", err);
    return res.status(500).json({ message: 'Error occurred while converting to DOCX.' });
  } finally {
    logger.info("Leaving pdfToDocController()");
  }
};

exports.getMyPdfDocument = async (req,res) => {
    try{
        logger.info("Entering getMyDocument()");
        const id = req.params.id 
        const  {header, pdfBuffer} = await getPdfFileService(id)
        res.set(header);
        res.send(pdfBuffer);
    }catch(error){
        logger.error("Error getting getMyDocument()");
        res.status(500).json({message:'Download Failed'});
    } finally {
        logger.info("Leaving getMyDocument()");
    }
}