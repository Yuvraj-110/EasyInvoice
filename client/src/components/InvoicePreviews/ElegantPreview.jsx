import React from 'react';

const ElegantPreview = ({ invoiceData }) => {
  if (!invoiceData || !invoiceData.business || !invoiceData.billTo) {
    return (
      <div className="text-center text-red-500 p-6">
        Error: Incomplete invoice data provided. Please check the input.
      </div>
    );
  }

  const {
    business, billTo, items = [], invoiceNo, billDate, dueDate, status,
    currency, discount, tax, vat, shipping, notes,
    calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal
  } = invoiceData;

  return (
    <div className="flex items-start justify-between border-b pb-4">
      {/* Invoice Content */}
      <div className="flex-1 p-10 overflow-y-auto text-sm font-sans text-neutral-700">
        <div className="flex justify-between mb-8">
          <div>
            {business.logoUrl && (
              <img src={`http://localhost:5000${business.logoUrl}`} alt="logo" className="h-10 mb-3" />
            )}
            <h1 className="text-xl font-bold text-red-600">{business.name}</h1>
            <p className="text-xs leading-snug">{business.address}</p>
            <p className="text-xs">{business.phone}</p>
            <p className="text-xs">{business.website}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-red-600 tracking-wide mb-2">INVOICE</h2>
            <p className="text-bold text-gray-900 font-medium">Tax ID: {business.taxId}</p>
            <p className="text-sm">Invoice No: #{invoiceNo}</p>
            <p className="text-sm">Bill Date: {billDate}</p>
            <p className="text-sm">Due Date: {dueDate}</p>
            <p className="text-sm">Status: <span className="font-medium">{status}</span></p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8 border-b border-red-200 pb-4">
          <h3 className="text-base font-bold text-red-600 mb-2">Invoice To:</h3>
          <div className="text-xs space-y-1">
            <p>{billTo.name}</p>
            <p>{billTo.address}</p>
            <p>{billTo.contact}</p>
            <p>{billTo.email}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-5 overflow-hidden rounded-t-xl border border-red-500">
          <thead className="bg-red-500 text-white text-xs">
            <tr>
              <th className="py-1 text-center">S. No.</th>
              <th className="py-2 px-3 text-left w-1/2">ITEM DESCRIPTION</th>
              <th className="py-2 px-3 text-center w-1/6">UNIT PRICE</th>
              <th className="py-2 px-3 text-center w-1/12">QTY</th>
              <th className="py-2 px-3 text-right w-1/6">TOTAL</th>
            </tr>
          </thead>
          <tbody className="text-xs">
            {items.map((item, idx) => (
              <tr key={idx} className="border-t border-gray-200">
                <td className="text-center">{idx + 1}</td>
                <td className="px-3 py-2 w-1/2">{item.description}</td>
                <td className="px-3 py-2 text-center w-1/6">{item.rate}</td>
                <td className="px-3 py-2 text-center w-1/12">{item.quantity}</td>
                <td className="px-3 py-2 text-right w-1/6">
                  {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Box */}
        <div className="max-w-sm ml-auto space-y-2 bg-red-50 p-4 rounded shadow text-sm">
          <div className="flex justify-between"><span>Subtotal:</span><span>{currency} {calcSubtotal().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount ({discount}%):</span><span>-{currency} {calcDiscount().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax ({tax}%):</span><span>{currency} {calcTax().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>VAT ({vat}%):</span><span>{currency} {calcVat().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>{currency} {Number(shipping).toFixed(2)}</span></div>
          <div className="flex justify-between text-base font-bold border-t pt-2">
            <span>Total:</span><span>{currency} {calcTotal()}</span>
          </div>
        </div>

        {/* Notes */}
        {notes && (
          <div className="mt-6 text-xs italic">
            <strong>Notes:</strong> {notes}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElegantPreview;
