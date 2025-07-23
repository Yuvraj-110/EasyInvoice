import React from 'react';

export default function BoldInvoiceForm({
  business, billTo, setBillTo,
  items, addItem, removeItem, updateItem,
  invoiceNo, billDate, dueDate, setBillDate, setDueDate,
  status, setStatus,
  discount, tax, vat, shipping, currency, notes, setNotes,
  calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal
}) {
  return (
    <div className="w-full lg:w-3/4 bg-white p-8 rounded-xl shadow-2xl text-sm max-h-[950px] overflow-y-auto">

      <div className="flex justify-between items-center border-b-4 border-gray-800 pb-4 mb-6">
        <div>
          {business.logoUrl && (
            <img src={`http://localhost:5000${business.logoUrl}`} alt={`${business.name} logo`} className="h-12 mb-2" />
          )}
          <h1 className="text-3xl font-black text-gray-900">{business.name}</h1>
          <p className="text-xs">{business.address}</p>
          <p className="text-xs">{business.phone}</p>
          <p className="text-xs">{business.website}</p>
        </div>
        <div className="text-right space-y-1">
          <h2 className="text-4xl font-extrabold text-gray-800">INVOICE</h2>
          <p className="font-bold">Invoice #: <span className="text-gray-700">#{invoiceNo}</span></p>
          <div>
            <span>Bill Date:</span>
            <input type="date" value={billDate} onChange={(e) => setBillDate(e.target.value)}
              className="ml-2 border-none bg-transparent focus:ring-0 text-right" />
          </div>
          <div>
            <span>Due Date:</span>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="ml-2 border-none bg-transparent focus:ring-0 text-right" />
          </div>
          <div className="flex items-center gap-2 mt-1 justify-end">
            <span>Status:</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="border-none bg-transparent focus:ring-0 appearance-none font-bold">
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Hold">Hold</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 border-b-2 border-gray-800 pb-4">
        <h3 className="text-lg font-extrabold text-gray-800 mb-1">Bill To:</h3>
        <div className="space-y-1">
          <input type="text" placeholder="Name" value={billTo.name}
            onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
            className="w-full border-none bg-transparent focus:ring-0 font-bold" />
          <input type="text" placeholder="Address" value={billTo.address}
            onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
            className="w-full border-none bg-transparent focus:ring-0" />
          <input type="text" placeholder="Contact" value={billTo.contact}
            onChange={(e) => setBillTo({ ...billTo, contact: e.target.value })}
            className="w-full border-none bg-transparent focus:ring-0" />
          <input type="email" placeholder="Email" value={billTo.email}
            onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
            className="w-full border-none bg-transparent focus:ring-0" />
        </div>
      </div>

      <table className="w-full mb-6">
        <thead>
          <tr className="bg-gray-800 text-white text-left">
            <th className="py-2 px-2">ITEM</th>
            <th className="py-2 px-2 text-center">RATE</th>
            <th className="py-2 px-2 text-center">QTY</th>
            <th className="py-2 px-2 text-right">TOTAL</th>
            <th className="py-2 px-2 text-center">🗑️</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td><input type="text" value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
                className="w-full border-none bg-transparent focus:ring-0 font-semibold"/></td>
              <td><input type="number" value={item.rate}
                onChange={(e) => updateItem(idx, "rate", e.target.value)}
                className="w-full text-center border-none bg-transparent focus:ring-0 font-semibold"/></td>
              <td><input type="number" value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                className="w-full text-center border-none bg-transparent focus:ring-0 font-semibold"/></td>
              <td className="text-right font-bold text-gray-800">
                {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
              </td>
              <td className="text-center">
                <button onClick={() => removeItem(idx)} className="text-red-600 hover:text-red-800 font-bold">✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={addItem} className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded mb-6 font-bold">
        + Add Item
      </button>

      <div className="max-w-sm ml-auto space-y-2 bg-gray-800 text-white p-4 rounded-xl shadow-lg">
        <div className="flex justify-between font-bold"><span>Subtotal:</span><span>{currency} {calcSubtotal().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount ({discount}%):</span><span>-{currency} {calcDiscount().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax ({tax}%):</span><span>{currency} {calcTax().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>VAT ({vat}%):</span><span>{currency} {calcVat().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping:</span><span>{currency} {shipping || "0.00"}</span></div>
        <div className="flex justify-between text-xl font-extrabold border-t border-white pt-3 mt-2">
          <span>Total:</span><span>{currency} {calcTotal()}</span>
        </div>
      </div>

      <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes" rows="2"
        className="w-full border-none bg-transparent focus:ring-0 mt-6 text-sm"/>
    </div>
  );
}
