import React from 'react';

const ClassicPreview = ({ invoiceData }) => {
  const {
    business,
    billTo,
    items,
    invoiceNo,
    billDate,
    dueDate,
    status,
    currency,
    shipping,
    notes,
    calcSubtotal,
    calcDiscount,
    calcTax,
    calcVat,
    calcTotal,
  } = invoiceData;

  return (
    <div id="classic-preview" className="p-10 font-Lato bg-white text-black text-sm leading-relaxed">
      {/* Header */}
      <div className="flex justify-between mb-8">
        <div>
          {business.logoUrl && (
            <img src={`http://localhost:5000${business.logoUrl}`} alt="logo" className="h-12 mb-3" />
          )}
          <h1 className="text-2xl font-bold text-blue-700">{business.name}</h1>
          <p className="text-sm leading-snug">{business.address}</p>
          <p className="text-sm">{business.phone}</p>
          <p className="text-sm">{business.website}</p>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold text-blue-700 tracking-wide mb-2">INVOICE</h2>
          <p className="text-bold text-gray-900 font-medium">Tax ID: {business.taxId}</p>
          <p className="text-sm">Invoice No: #{invoiceNo}</p>
          <p className="text-sm">Bill Date: {billDate}</p>
          <p className="text-sm">Due Date: {dueDate}</p>
          <p className="text-sm">Status: <span className="font-medium">{status}</span></p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8 border-b border-red-200 pb-4">
        <h3 className="text-base font-bold text-blue-700 mb-2">Invoice To:</h3>
        <div className="text-sm space-y-0.1">
          <p>{billTo.name}</p>
          <p>{billTo.address}</p>
          <p>{billTo.contact}</p>
          <p>{billTo.email}</p>
        </div>
      </div>

      {/* Items Table */}
      <div className="border-t border-gray-200 mt-6">
        <table className="w-full border-collapse mt-4 text-sm">
          <thead className="bg-gray-100 text-blue-700">
            <tr className="text-left">
              <th className="border px-2 py-2 w-10">#</th>
              <th className="border px-2 py-2">Description</th>
              <th className="border px-2 py-2 text-center w-20">Qty</th>
              <th className="border px-2 py-2 text-center w-24">Rate</th>
              <th className="border px-2 py-2 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-2 text-center">{idx + 1}</td>
                <td className="border px-2 py-2">{item.description}</td>
                <td className="border px-2 py-2 text-center">{item.quantity}</td>
                <td className="border px-2 py-2 text-center">{item.rate}</td>
                <td className="border px-2 py-2 text-right">
                  {currency} {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Box */}
      <div className="flex justify-end mt-8">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-white rounded-md shadow-md p-4 space-y-1">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{currency} {calcSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Discount (%):</span>
            <span>-{currency} {calcDiscount().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (%):</span>
            <span>{currency} {calcTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>VAT (%):</span>
            <span>{currency} {calcVat().toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>{currency} {Number(shipping).toFixed(2)}</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg text-blue-700 mt-1">
            <span>Total:</span>
            <span>{currency} {calcTotal()}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mt-6">
          <h4 className="font-semibold text-sm text-gray-700 mb-1">Notes</h4>
          <p className="text-gray-800 text-sm">{notes}</p>
        </div>
      )}
    </div>
  );
};

export default ClassicPreview;
