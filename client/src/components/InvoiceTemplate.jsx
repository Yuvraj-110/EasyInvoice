// src/components/InvoiceTemplate.jsx
export default function InvoiceTemplate({
  business, billTo, items, invoiceNo, billDate, dueDate,
  status, discount, tax, vat, shipping, currency, notes, template
}) {
  const calcSubtotal = () =>
    items.reduce((acc, item) =>
      acc + (Number(item.quantity || 0) * Number(item.rate || 0)), 0
    );
  const calcDiscount = () => (calcSubtotal() * (Number(discount) || 0)) / 100;
  const calcTax = () => (calcSubtotal() * (Number(tax) || 0)) / 100;
  const calcVat = () => (calcSubtotal() * (Number(vat) || 0)) / 100;
  const calcTotal = () => {
    const subtotal = calcSubtotal();
    const totalAfterDiscount = subtotal - calcDiscount();
    return (totalAfterDiscount + calcTax() + calcVat() + Number(shipping || 0)).toFixed(2);
  };

  return (
    <div className={`p-8 rounded-2xl shadow-xl bg-white text-xs max-w-4xl mx-auto border 
      ${template === 'classic' ? 'border-gray-300' : ''}
      ${template === 'minimal' ? 'border-0' : ''}
      ${template === 'bold' ? 'border-4 border-blue-500' : ''}
    `}>
      <div className="flex justify-between items-center mb-4">
        <div>
          {business.logoUrl && (
            <img src={`http://localhost:5000${business.logoUrl}`} alt="logo" className="h-12 mb-1" />
          )}
          <h1 className="text-2xl font-bold text-blue-700">{business.name}</h1>
          <p className="font-bold text-sm">Tax Id : {business.taxId}</p>
          <p className="text-sm">{business.address}</p>
          <p className="text-sm">{business.phone}</p>
          <p className="text-sm">{business.website}</p>
        </div>
        <div className="text-right space-y-2">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-sm"><span className="font-semibold">Invoice No:</span> #{invoiceNo}</p>
          <p className="text-sm"><span className="font-semibold">Bill Date:</span> {billDate}</p>
          <p className="text-sm"><span className="font-semibold">Due Date:</span> {dueDate}</p>
          <div className="flex justify-end items-center gap-2">
            <span className="text-sm font-semibold">Status:</span>
            <span
              className={`
                w-3 h-3 rounded-full inline-block
                ${status === "Due" ? "bg-red-500" : ""}
                ${status === "Paid" ? "bg-green-500" : ""}
                ${status === "Overdue" ? "bg-yellow-500" : ""}
                ${status === "Hold" ? "bg-gray-500" : ""}
              `}
            ></span>
            <span className="text-sm font-semibold text-gray-800">{status}</span>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold text-blue-700 mb-1">To:</h1>
        <p>{billTo.name}</p>
        <p>{billTo.address}</p>
        <p>{billTo.contact}</p>
        <p>{billTo.email}</p>
      </div>

      <table className="w-full mb-4 border-collapse min-h-[300px]">
        <thead>
          <tr className="border-b text-gray-600">
            <th className="py-1 w-10 text-left">S.No.</th>
            <th className="py-1 text-left">Description</th>
            <th className="py-1 w-16 text-center">Qty</th>
            <th className="py-1 w-20 text-center">Rate</th>
            <th className="py-1 w-20 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx} className="border-b">
              <td className="px-1">{idx + 1}</td>
              <td>{item.description}</td>
              <td className="text-center">{item.quantity}</td>
              <td className="text-center">{item.rate}</td>
              <td className="text-right pr-1">
                {(Number(item.quantity || 0) * Number(item.rate || 0)).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="max-w-xs ml-auto space-y-0.5">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{currency} {calcSubtotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount ({discount || 0}%):</span>
          <span>-{currency} {calcDiscount().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax ({tax || 0}%):</span>
          <span>{currency} {calcTax().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>VAT ({vat || 0}%):</span>
          <span>{currency} {calcVat().toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping:</span>
          <span>{currency} {shipping || "0.00"}</span>
        </div>
        <div className="flex justify-between mt-1 pt-1 border-t font-bold text-blue-700">
          <h2>Total:</h2>
          <h2>{currency} {calcTotal()}</h2>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-700">{notes}</p>
      </div>

      <div className="mt-6 text-center text-gray-400 text-xs">
        Generated by <span><span className="text-green-600">Easy</span><span className="text-black">invoice</span><span className="text-red-500">.</span></span>
      </div>
    </div>
  );
}
