// utils/generateInvoiceBuffer.js
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import puppeteer from 'puppeteer';

export default async function generateInvoiceBuffer(data) {
  const {
    business, billTo, items, invoiceNo, billDate, dueDate,
    status, discount, tax, vat, shipping, currency, notes, template
  } = data;

  // Register helpers
  Handlebars.registerHelper('inc', (value) => parseInt(value) + 1);
  Handlebars.registerHelper('calcItemTotal', (qty, rate) => {
    const total = parseFloat(qty) * parseFloat(rate);
    return isNaN(total) ? '0.00' : total.toFixed(2);
  });

  // Load and compile template
  const templatePath = path.join('templates', `${template || 'classic'}.html`);
  const templateHtml = fs.readFileSync(templatePath, 'utf8');
  const compiledTemplate = Handlebars.compile(templateHtml);

  // Totals
  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);
  const discountAmount = (discount / 100) * subtotal;
  const taxAmount = (tax / 100) * subtotal;
  const vatAmount = (vat / 100) * subtotal;
  const total = subtotal - discountAmount + taxAmount + vatAmount + Number(shipping || 0);

  const html = compiledTemplate({
    business, billTo, items, invoiceNo, billDate, dueDate, status,
    discountAmount: discountAmount.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    vatAmount: vatAmount.toFixed(2),
    shipping, currency, notes,
    subtotal: subtotal.toFixed(2),
    total: total.toFixed(2)
  });

  // Generate PDF with Puppeteer
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdfBuffer = await page.pdf({ format: 'A4' });
  await browser.close();

  return pdfBuffer;
}
