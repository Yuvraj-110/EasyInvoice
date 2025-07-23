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

  Handlebars.registerHelper('inc', val => parseInt(val) + 1);
  Handlebars.registerHelper('calcItemTotal', (qty, rate) => (qty * rate).toFixed(2));

  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (data.discount / 100) * subtotal;
  const taxAmount = (data.tax / 100) * subtotal;
  const vatAmount = (data.vat / 100) * subtotal;
  const total = subtotal - discountAmount + taxAmount + vatAmount + Number(data.shipping || 0);

  const html = compiledTemplate({
    ...data,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    total: total.toFixed(2)
  });

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
};

// ✅ Save invoice to databas

export const saveInvoiceToDB = async (data, template) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const discountAmount = (data.discount / 100) * subtotal;
  const taxAmount = (data.tax / 100) * subtotal;
  const vatAmount = (data.vat / 100) * subtotal;
  const total = subtotal - discountAmount + taxAmount + vatAmount + Number(data.shipping || 0);

  const newInvoice = new Invoice({
    ...data,
    business: data.business._id,
    template,
    subtotal: subtotal.toFixed(2),
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    total: total.toFixed(2)
  });

  await newInvoice.save();
};



// ✅ POST /invoices/share
export const shareInvoice = async (req, res) => {
  try {
    const {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes,
      template, email
    } = req.body;

    const invoiceData = {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes
    };

    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData, template);

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

    await saveInvoiceToDB(invoiceData, template);

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
      template
    } = req.body;

    const invoiceData = {
      business, billTo, items, invoiceNo, billDate, dueDate,
      status, discount, tax, vat, shipping, currency, notes
    };

    const pdfBuffer = await generateInvoicePDFBuffer(invoiceData, template);

    await saveInvoiceToDB(invoiceData, template);

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
