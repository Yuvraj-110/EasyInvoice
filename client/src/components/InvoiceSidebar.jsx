import React from 'react';

export default function InvoiceSidebar({
  discount, setDiscount,
  tax, setTax,
  vat, setVat,
  shipping, setShipping,
  currency, setCurrency,
  dateFormat, setDateFormat,
  setPreviewMode,
  handlePrint,
  handleDownloadPDF,
  handleShareInvoice
}) {
  return (
    <div className="w-full lg:w-1/4 bg-gray-50 p-4 rounded-2xl shadow space-y-3">
      <h2 className="text-lg font-bold text-gray-800 mb-3">Invoice Settings</h2>

      <div className="space-y-2">
        <div>
          <label className="block text-gray-600">Discount (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-gray-600">Tax (%)</label>
          <input
            type="number"
            value={tax}
            onChange={(e) => setTax(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-gray-600">VAT (%)</label>
          <input
            type="number"
            value={vat}
            onChange={(e) => setVat(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-gray-600">Shipping</label>
          <input
            type="number"
            value={shipping}
            onChange={(e) => setShipping(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          />
        </div>
        <div>
          <label className="block text-gray-600">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-600">Date Format</label>
          <select
            value={dateFormat}
            onChange={(e) => setDateFormat(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 bg-transparent"
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="pt-5 space-y-2">
        <button
          onClick={() => setPreviewMode(true)}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded shadow"
        >
          Preview Invoice
        </button>

        <button
          onClick={handlePrint}
          className="w-full bg-green-600 text-white hover:bg-green-700 py-2 rounded shadow"
        >
          Print Invoice
        </button>

        <button
          onClick={handleDownloadPDF}
          className="w-full bg-gray-800 text-white hover:bg-gray-900 py-2 rounded shadow"
        >
          Download PDF
        </button>
        <button
        onClick={handleShareInvoice}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded shadow"
      >
        Share Invoice Via Email
      </button>
      </div>
    </div>
  );
}
