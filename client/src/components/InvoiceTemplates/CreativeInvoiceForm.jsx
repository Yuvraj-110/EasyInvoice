import React from 'react';

export default function CreativeInvoiceForm({
  business, billTo, setBillTo,
  items, addItem, removeItem, updateItem,
  invoiceNo, billDate, dueDate, setBillDate, setDueDate,
  status, setStatus,
  discount, tax, vat, shipping, currency, notes, setNotes,
  calcSubtotal, calcDiscount, calcTax, calcVat, calcTotal
}) {
  return (
    <div className="w-full lg:w-3/4 bg-white border shadow-xl rounded-2xl p-10 relative max-h-[950px] overflow-y-auto text-sm font-[Inter]">

      {/* Header */}
      <div className="flex justify-between items-center mb-8 border-b-2 pb-4 border-teal-700">
        <div>
          {business.logoUrl && (
            <img src={`http://localhost:5000${business.logoUrl}`} alt={`${business.name} logo`} className="h-16 mb-2" />
          )}
          <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">{business.name}</h1>
          <p className="text-sm text-gray-500">{business.address}</p>
          <p className="text-sm text-gray-500">{business.phone}</p>
          <p className="text-sm text-gray-500">{business.website}</p>
        </div>

        <div className="text-right space-y-1 bg-teal-600 text-white px-6 py-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold tracking-widest">INVOICE</h2>
          <p>Invoice #: <span className="font-bold">#{invoiceNo}</span></p>
          <p>
            Bill Date:
            <input
              type="date"
              value={billDate}
              onChange={(e) => setBillDate(e.target.value)}
              className="text-white bg-transparent border-b border-white ml-2 focus:outline-none"
            />
          </p>
          <p>
            Due Date:
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-white bg-transparent border-b border-white ml-2 focus:outline-none"
            />
          </p>
          <p>
            Status:
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="bg-transparent text-white font-semibold ml-2 focus:outline-none"
            >
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
              <option value="Hold">Hold</option>
            </select>
          </p>
        </div>
      </div>

      {/* Bill To Section */}
      <h3 className="text-lg font-semibold text-gray-700 border-l-4 border-teal-600 pl-3 mb-2">Bill To:</h3>
      <div className="space-y-2 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={billTo.name}
          onChange={(e) => setBillTo({ ...billTo, name: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="text"
          placeholder="Address"
          value={billTo.address}
          onChange={(e) => setBillTo({ ...billTo, address: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="text"
          placeholder="Contact"
          value={billTo.contact}
          onChange={(e) => setBillTo({ ...billTo, contact: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="email"
          placeholder="Email"
          value={billTo.email}
          onChange={(e) => setBillTo({ ...billTo, email: e.target.value })}
          className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400"
        />
      </div>

      {/* Items Table */}
      <table className="w-full mb-6 border-t-2 border-teal-300">
        <thead className="bg-teal-600 text-white text-sm">
          <tr>
            <th className="py-2 px-3 text-left">ITEM</th>
            <th className="py-2 px-3 text-center">RATE</th>
            <th className="py-2 px-3 text-center">QTY</th>
            <th className="py-2 px-3 text-right">TOTAL</th>
            <th className="py-2 px-3 text-center">🗑️</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b border-gray-200">
              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(idx, "description", e.target.value)}
                  className="w-full bg-transparent px-2 py-1 focus:outline-none"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateItem(idx, "rate", e.target.value)}
                  className="w-full text-center bg-transparent px-2 py-1 font-medium focus:outline-none"
                />
              </td>
              <td>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, "quantity", e.target.value)}
                  className="w-full text-center bg-transparent px-2 py-1 font-medium focus:outline-none"
                />
              </td>
              <td className="text-right font-semibold text-gray-800 px-2">
                {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
              </td>
              <td className="text-center">
                <button onClick={() => removeItem(idx)} className="text-red-500 hover:text-red-700 font-bold">✖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add Item Button */}
      <button
        onClick={addItem}
        className="mt-4 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded shadow-sm font-semibold transition duration-150 ease-in-out"
      >
        + Add Item
      </button>

      {/* Totals Summary */}
      <div className="max-w-sm ml-auto bg-teal-50 border border-teal-200 rounded-lg p-4 space-y-2 shadow-sm mt-6">
        <div className="flex justify-between font-medium"><span>Subtotal:</span><span>{currency || "₹"} {calcSubtotal().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Discount ({discount}%):</span><span>-{currency || "₹"} {calcDiscount().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Tax ({tax}%):</span><span>{currency || "₹"} {calcTax().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>VAT ({vat}%):</span><span>{currency || "₹"} {calcVat().toFixed(2)}</span></div>
        <div className="flex justify-between"><span>Shipping:</span><span>{currency || "₹"} {shipping || "0.00"}</span></div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2 text-teal-700">
          <span>Total:</span><span>{currency || "₹"} {calcTotal()}</span>
        </div>
      </div>

      {/* Notes */}
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes"
        rows="2"
        className="w-full bg-gray-50 border border-gray-300 rounded-md p-2 mt-6 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm resize-y"
      />
    </div>
  );
}
