import express from 'express';
import { generateInvoicePDF, shareInvoice,saveInvoiceToDB, getInvoicesByBusiness } from '../controllers/invoiceController.js';

const router = express.Router();

router.post('/generate-pdf', generateInvoicePDF);
router.post('/share', shareInvoice);
router.post("/save", saveInvoiceToDB); 
router.get("/business/:businessId", getInvoicesByBusiness);


export default router;
