import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import sendEmail from '../utils/sendEmail.js';
import Invoice from '../models/Invoice.js'; 
import updateOverdueInvoices from '../utils/updateOverdueInvoices.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


// Get invoices for a business
export const getInvoicesByBusiness = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    await updateOverdueInvoices(businessId);
    const invoices = await Invoice.find({ business: businessId }).populate("business");
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err);
    res.status(500).json({ message: "Failed to fetch invoices" });
  }
};


// Generate PDF buffer from template
const generateInvoicePDFBuffer = async (data, templateName = 'classic') => {
  const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
  const templateHtml = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = Handlebars.compile(templateHtml);

  // Helpers
  Handlebars.registerHelper('inc', val => parseInt(val) + 1);
  Handlebars.registerHelper('calcItemTotal', (qty, rate) => {
    const q = Number(qty) || 0;
    const r = Number(rate) || 0;
    return (q * r).toFixed(2);
  });

  // Safe subtotal calculation
  const subtotal = data.items.reduce((sum, item) =>
    sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

  const discountAmount = ((Number(data.discount) || 0) / 100) * subtotal;
  const taxAmount = ((Number(data.tax) || 0) / 100) * subtotal;
  const vatAmount = ((Number(data.vat) || 0) / 100) * subtotal;
  const shippingAmount = Number(data.shipping) || 0;
  const total = subtotal - discountAmount + taxAmount + vatAmount + shippingAmount;

  // Compile template with all values formatted to 2 decimal places
  const html = compiledTemplate({
    ...data,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    shippingAmount: shippingAmount.toFixed(2),
    total: total.toFixed(2)
  });

  // Generate PDF using Puppeteer
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
};


// ✅ Save invoice to databas

export const saveInvoiceToDB = async (data, template) => {
  const subtotal = data.items.reduce((sum, item) =>
    sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0), 0);

  const discountAmount = ((Number(data.discount) || 0) / 100) * subtotal;
  const taxAmount = ((Number(data.tax) || 0) / 100) * subtotal;
  const vatAmount = ((Number(data.vat) || 0) / 100) * subtotal;
  const shippingAmount = Number(data.shipping) || 0;
  const total = subtotal - discountAmount + taxAmount + vatAmount + shippingAmount;

  // 🔁 Auto-generate invoiceNo if not provided
  let invoiceNo = data.invoiceNo;
  if (!invoiceNo) {
    const lastInvoice = await Invoice.findOne({ business: data.business._id })
      .sort({ createdAt: -1 });

    if (lastInvoice?.invoiceNo) {
      const lastNumber = parseInt(lastInvoice.invoiceNo.split("-")[1] || "0");
      const nextNumber = lastNumber + 1;
      invoiceNo = `INV-${String(nextNumber).padStart(4, "0")}`;
    } else {
      invoiceNo = "INV-0001";
    }
  }

  const newInvoice = new Invoice({
    ...data,
    invoiceNo,
    business: data.business._id,
    template,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    shippingAmount: shippingAmount.toFixed(2),
    total: total.toFixed(2),
  });

  await newInvoice.save();
};


export const getNextInvoiceNumber = async (req, res) => {
  try {
    const { businessId } = req.query;

    const lastInvoice = await Invoice.findOne({ business: businessId })
      .sort({ createdAt: -1 });

    let nextInvoiceNo = "INV-0001";

    if (lastInvoice?.invoiceNo) {
      const lastNum = parseInt(lastInvoice.invoiceNo.split("-")[1] || "0");
      const nextNum = lastNum + 1;
      nextInvoiceNo = `INV-${String(nextNum).padStart(4, "0")}`;
    }

    res.status(200).json({ invoiceNo: nextInvoiceNo });
  } catch (error) {
    console.error("Error fetching next invoice number:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInvoice = await Invoice.findByIdAndDelete(id);

    if (!deletedInvoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ message: 'Server error while deleting invoice' });
  }
};

// ✅ POST /invoices/share
export const shareInvoice = async (req, res) => {
  try {
    const {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes,
      template, email, shouldSave = true // Default true
    } = req.body;

    const invoiceData = {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes
    };

    // Generate PDF buffer
    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData, template);

    // Send email
    await sendEmail({
      to: email,
      subject: `Invoice ${invoiceNo} from ${business.name}`,
      html: `<p>Hello ${billTo.name},<br/>Please find attached your invoice <strong>#${invoiceNo}</strong> from <strong>${business.name}</strong>.</p>`,
      attachments: [
        {
          filename: `Invoice-${invoiceNo}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    // ✅ Only save if explicitly requested
    if (shouldSave) {
      await saveInvoiceToDB(invoiceData, template);
    }

    res.status(200).json({ message: 'Invoice shared successfully!' });

  } catch (err) {
    console.error('Error in shareInvoice:', err.message);
    res.status(500).json({ error: 'Something went wrong while sharing invoice' });
  }
};


// ✅ POST /invoices/download
export const generateInvoicePDF = async (req, res) => {
  try {
    const {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes,
      template,
      shouldSave = true 
    } = req.body;

    const invoiceData = {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes
    };

    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData, template);

    // 🔑 Save only if shouldSave is true
    if (shouldSave) {
      await saveInvoiceToDB(invoiceData, template);
    }

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=Invoice_${invoiceNo}.pdf`
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error('Error generating PDF:', err.message);
    res.status(500).json({ error: 'Failed to generate invoice PDF' });
  }
};


// ✅ POST /invoices/save (for print or manual save)
export const saveInvoiceOnly = async (req, res) => {
  try {
    const {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes,
      template
    } = req.body;

    const invoiceData = {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes
    };

    await saveInvoiceToDB(invoiceData, template);

    res.status(200).json({ message: 'Invoice saved to database successfully' });

  } catch (err) {
    console.error('Error in saveInvoiceOnly:', err.message);
    res.status(500).json({ error: 'Failed to save invoice' });
  }
};

// ✅ GET /invoices/:id
export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id).populate('business');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.status(200).json(invoice);
  } catch (err) {
    console.error('Error fetching invoice by ID:', err.message);
    res.status(500).json({ error: 'Failed to fetch invoice' });
  }
};
