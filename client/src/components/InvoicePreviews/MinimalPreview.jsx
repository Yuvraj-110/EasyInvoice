import React from 'react';

const MinimalPreview = ({ invoiceData }) => {
  const {
    business,
    billTo,
    items,
    invoiceNo,
    billDate,
    dueDate,
    status,
    currency,
    discount,
    tax,
    vat,
    shipping,
    notes,
    calcSubtotal,
    calcDiscount,
    calcTax,
    calcVat,
    calcTotal,
  } = invoiceData;

  return (
    <div className="c">
      {/* Business Header */}
      <div className="flex items-start justify-between border-b pb-4">
        <div className="flex gap-4">
          {business?.logoUrl && (
            <img
              src={`http://localhost:5000${business.logoUrl}`}
              alt="Logo"
              className="w-16 h-16 object-contain"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">{business?.name || 'Business Name'}</h2>
            <p className="text-sm">{business?.address}</p>
            <p className="text-sm">{business?.phone}</p>
            {business?.taxId && (
              <p className="text-sm font-medium mt-1">Tax ID: {business.taxId}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bill To & Invoice Info */}
      <div className="flex justify-between mt-4">
        <div>
          <h4 className="font-semibold">Invoice To:</h4>
          <p>{billTo?.name}</p>
          <p>{billTo?.address}</p>
          <p>{billTo?.email}</p>
        </div>
        <div className="text-sm text-right">
          <p><strong>Invoice #: </strong>{invoiceNo}</p>
          <p><strong>Date: </strong>{billDate}</p>
          <p><strong>Due: </strong>{dueDate}</p>
          <p><strong>Status: </strong>{status}</p>
        </div>
      </div>

      {/* Items Table */}
        <table className="w-full mt-4 text-sm">
  <thead className="bg-slate-50 text-gray-700 border-b">
    <tr className="text-left">
      <th className="px-2 py-2 w-10">#</th>
      <th className="px-2 py-2">Description</th>
      <th className="px-2 py-2 text-center w-20">Qty</th>
      <th className="px-2 py-2 text-center w-24">Rate</th>
      <th className="px-2 py-2 text-right w-28">Amount</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item, idx) => (
      <tr key={idx} className="border-b">
        <td className="px-2 py-2 text-center">{idx + 1}</td>
        <td className="px-2 py-2">{item.description}</td>
        <td className="px-2 py-2 text-center">{item.quantity}</td>
        <td className="px-2 py-2 text-center">{item.rate}</td>
        <td className="px-2 py-2 text-right">
          {currency} {(item.quantity * item.rate).toFixed(2)}
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Totals */}
        <div className="max-w-sm ml-auto space-y-2 bg-slate-50 p-4 rounded shadow text-sm mt-5">
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
        <div className="mt-6 text-sm">
          <h4 className="font-semibold">Notes:</h4>
          <p>{notes}</p>
        </div>
      )}
    </div>
  );
};

export default MinimalPreview;
