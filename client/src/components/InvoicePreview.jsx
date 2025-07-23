import React, { forwardRef } from 'react';
import ClassicPreview from './InvoicePreviews/ClassicPreview';
import MinimalPreview from './InvoicePreviews/MinimalPreview';
import ElegantPreview from './InvoicePreviews/ElegantPreview';

const InvoicePreview = forwardRef((props, ref) => {
  const {
    business, billTo, items, invoiceNo, billDate, dueDate, status,
    discount, tax, vat, shipping, currency, notes,
    calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal,
    setPreviewMode, handleDownloadPDF, handlePrint, template,handleShareInvoice
  } = props;

  const invoiceData = {
    business, billTo, items, invoiceNo, billDate, dueDate, status,
    discount, tax, vat, shipping, currency, notes,
    calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal
  };

  const templateMap = {
    classic: ClassicPreview,
    minimal: MinimalPreview,
    elegant: ElegantPreview
  };

  const SelectedPreview = templateMap[template.toLowerCase()] || ClassicPreview;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Top Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 bg-gray-100 border-b">
         <button
  onClick={() => setPreviewMode(false)}
  className="flex items-center gap-2 text-gray-700 hover:text-blue-600 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-semibold transition"
>
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
  Back to Edit
</button>

<div className="flex flex-col sm:flex-row gap-2">
  <button
    onClick={handlePrint}
    className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
  >
    Print Invoice
  </button>
  <button
    onClick={handleDownloadPDF}
    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
  >
    Download PDF
  </button>
  <button
    onClick={handleShareInvoice}
    className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md text-sm transition"
  >
    Share Invoice
  </button>
</div>

        </div>

        {/* Preview Section */}
        <div ref={ref} className="px-4 py-6 sm:px-6 lg:px-8 bg-white">
          <SelectedPreview invoiceData={invoiceData} />
        </div>
      </div>
    </div>
  );
});

export default InvoicePreview;
