import React, { useEffect, useState } from "react";
import ClassicInvoiceForm from "./InvoiceTemplates/ClassicInvoice";
import axios from "axios";

const EditInvoice = ({ invoice }) => {
  const [business, setBusiness] = useState({});
  const [billTo, setBillTo] = useState({});
  const [items, setItems] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState("");
  const [billDate, setBillDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Due");
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [vat, setVat] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [currency, setCurrency] = useState("₹");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (invoice) {
      setBusiness(invoice.business || {});
      setBillTo(invoice.billTo || {});
      setItems(invoice.items || []);
      setInvoiceNo(invoice.invoiceNo || "");
      setBillDate(invoice.billDate?.slice(0, 10) || "");
      setDueDate(invoice.dueDate?.slice(0, 10) || "");
      setStatus(invoice.status || "Due");
      setDiscount(invoice.discount || 0);
      setTax(invoice.tax || 0);
      setVat(invoice.vat || 0);
      setShipping(invoice.shipping || 0);
      setCurrency(invoice.currency || "₹");
      setNotes(invoice.notes || "");
    }
  }, [invoice]);

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);

  const removeItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const updateItem = (index, key, value) => {
    const updated = [...items];
    updated[index][key] = key === "quantity" || key === "rate" ? Number(value) : value;
    setItems(updated);
  };

  const calcSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const calcDiscount = () => (calcSubtotal() * discount) / 100;
  const calcTax = () => (calcSubtotal() * tax) / 100;
  const calcVat = () => (calcSubtotal() * vat) / 100;
  const calcTotal = () =>
    (calcSubtotal() - calcDiscount() + calcTax() + calcVat() + Number(shipping || 0)).toFixed(2);

  const handleUpdate = async () => {
    try {
      const updatedInvoice = {
        business,
        billTo,
        items,
        invoiceNo,
        billDate,
        dueDate,
        status,
        discount,
        tax,
        vat,
        shipping,
        currency,
        notes,
        template: invoice.template || "classic", // fallback
      };

      const res = await axios.put(`http://localhost:5000/api/invoices/${invoice._id}`, updatedInvoice);
      setMessage("Invoice updated successfully!");
      console.log("Updated:", res.data);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Failed to update invoice.");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Invoice #{invoice?.invoiceNo}</h2>

      <ClassicInvoiceForm
        business={business}
        billTo={billTo} setBillTo={setBillTo}
        items={items} addItem={addItem} removeItem={removeItem} updateItem={updateItem}
        invoiceNo={invoiceNo} setInvoiceNo={setInvoiceNo}
        billDate={billDate} dueDate={dueDate} setBillDate={setBillDate} setDueDate={setDueDate}
        status={status} setStatus={setStatus}
        discount={discount} tax={tax} vat={vat} shipping={shipping} currency={currency}
        notes={notes} setNotes={setNotes}
        calcSubtotal={calcSubtotal} calcDiscount={calcDiscount} calcTax={calcTax} calcVat={calcVat} calcTotal={calcTotal}
      />

      <button
        onClick={handleUpdate}
        className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Update Invoice
      </button>

      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </div>
  );
};

export default EditInvoice;
