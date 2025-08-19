import express from 'express';
import { generateInvoicePDF, shareInvoice,saveInvoiceToDB, getInvoicesByBusiness,getNextInvoiceNumber,deleteInvoice,getInvoiceById,updateInvoice } from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/generate-pdf', generateInvoicePDF);
router.post('/share', shareInvoice);
router.post("/save", saveInvoiceToDB); 
router.get('/next-invoice-no', getNextInvoiceNumber);
router.get("/business/:businessId", getInvoicesByBusiness);
router.delete("/:id", deleteInvoice);
router.get('/:id', getInvoiceById); 
router.put("/:id", updateInvoice);



export default router;
