import React from 'react';

export default function MinimalInvoiceForm({
  business, billTo, setBillTo,
  items, addItem, removeItem, updateItem,
  invoiceNo, billDate, dueDate, setBillDate, setDueDate,
  status, setStatus,
  discount, tax, vat, shipping, currency, notes, setNotes,
  calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal
}) {
  return (
    <div className="w-full lg:w-3/4 bg-white p-8 border border-gray-400 text-sm font-light max-h-[950px] overflow-y-auto font-[Lato]">
      
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-6">
        {/* LEFT: Logo + Business Info */}
     <div className="flex items-start gap-4">
  {/* Logo */}
  <img
    src={`http://localhost:5000${business.logoUrl}`}
    alt="Logo"
    className="w-16 h-16 object-contain"
  />

  {/* Business Info */}
  <div>
    <h1 className="text-2xl font-semibold text-gray-900">{business.name}</h1>
    <p className="text-gray-700">{business.address}</p>
    <p className="text-gray-700">{business.phone}</p>
    {business.taxId && (
      <p className="text-bold text-gray-900 font-medium">Tax ID: {business.taxId}</p>
    )}
  </div>
</div>


        {/* RIGHT: Invoice Info */}
        <div className="text-right space-y-1 text-gray-800">
          <p><span className="font-semibold">Invoice #:</span> {invoiceNo}</p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            <input
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="border-none bg-transparent focus:ring-0 w-28 text-right"
            />
          </p>
          <p>
            <span className="font-semibold">Due:</span>{" "}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border-none bg-transparent focus:ring-0 w-28 text-right"
            />
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border-none bg-transparent focus:ring-0 appearance-none"
            >
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Hold">Hold</option>
            </select>
          </p>
        </div>
      </div>

      {/* Invoice To */}
      <div className="mb-4">
        <h3 className="font-semibold text-gray-900 mb-2">Invoice To:</h3>
        <input type="text" value={billTo.name} placeholder="Name"
          onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
          className="block border-none bg-transparent focus:ring-0 mb-0.5"/>
        <input type="text" value={billTo.address} placeholder="Address"
          onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
          className="block border-none bg-transparent focus:ring-0 mb-0.5"/>
        <input type="text" value={billTo.contact} placeholder="Contact"
          onChange={(e) => setBillTo({ ...billTo, contact: e.target.value })}
          className="block border-none bg-transparent focus:ring-0 mb-0.5"/>
        <input type="email" value={billTo.email} placeholder="Email"
          onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
          className="block border-none bg-transparent focus:ring-0"/>
      </div>

      {/* Items Table */}
        <table className="overflow-hidden border-b border-gray-200 mb-6">
          <thead className="bg-slate-50 text-black text-xs" >
  <tr>
    <th className="py-2 px-3 text-center w-1/12">S. No.</th>
    <th className="py-2 px-3 text-left w-1/2">ITEM DESCRIPTION</th>
    <th className="py-2 px-3 text-center w-1/6">UNIT PRICE</th>
    <th className="py-2 px-3 text-center w-1/6">QTY</th>
    <th className="py-2 px-3 text-right w-1/6">TOTAL</th>
    <th className="py-2 px-3 text-center w-1/12">🗑️</th>
  </tr>
</thead>
<tbody className="text-sm">
  {items.map((item, idx) => (
    <tr key={idx} className="border-t border-gray-200">
      <td className="px-3 py-1 w-1/12 text-center">{idx + 1}.</td>
      <td className="px-3 py-1 w-1/2">
        <input
          type="text"
          value={item.description}
          onChange={(e) => updateItem(idx, "description", e.target.value)}
          className="w-full border-none bg-transparent focus:ring-0"
        />
      </td>
      <td className="px-2 py-1 w-1/6">
        <input
          type="number"
          value={item.rate}
          onChange={(e) => updateItem(idx, "rate", e.target.value)}
          className="w-full text-center border-none bg-transparent focus:ring-0"
        />
      </td>
      <td className="px-2 py-1 w-1/8">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateItem(idx, "quantity", e.target.value)}
          className="w-full text-center border-none bg-transparent focus:ring-0"
        />
      </td>
      <td className="px-3 py-1 text-right w-1/6">
        {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
      </td>
      <td className="px-3 py-1 text-center w-1/12">
        <button
          onClick={() => removeItem(idx)}
          className="text-red-500 hover:text-red-700"
        >
          ✖
        </button>
      </td>
    </tr>
  ))}
</tbody>
        </table>

      <button onClick={addItem} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded mb-6">
        + Add Line Item
      </button>

        {/* Summary Section */}
        <div className="max-w-sm ml-auto space-y-1 bg-gray-50 p-4 rounded-lg shadow">
          <div className="flex justify-between"><span>Subtotal:</span><span>{currency} {calcSubtotal().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Discount ({discount}%):</span><span>-{currency} {calcDiscount().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Tax ({tax}%):</span><span>{currency} {calcTax().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>VAT ({vat}%):</span><span>{currency} {calcVat().toFixed(2)}</span></div>
          <div className="flex justify-between"><span>Shipping:</span><span>{currency} {shipping || "0.00"}</span></div>
          <div className="flex justify-between text-lg font-bold border-t mt-2 pt-2">
            <span>Total:</span><span>{currency} {calcTotal()}</span>
          </div>
        </div>

      {/* Notes + Signature */}
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes" rows="2"
        className="w-full border-none bg-transparent focus:ring-0 mt-6"/>
  
    </div>
  );
}
