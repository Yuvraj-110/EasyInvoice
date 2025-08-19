import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";
import InvoiceSidebar from "./InvoiceSidebar";
import InvoicePreview from "./InvoicePreview";

// Templates
import ClassicTemplate from './InvoiceTemplates/ClassicInvoice';
import MinimalTemplate from './InvoiceTemplates/MinimalInvoice';
import ElegantTemplate from './InvoiceTemplates/ElegantInvoiceForm';

export default function CreateInvoice() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const { businessId, invoiceId } = useParams(); // ✅ Extract invoiceId for edit mode
  const isEditMode = !!invoiceId; // ✅ Determine if we are in edit mode

  const [business, setBusiness] = useState({});
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const [items, setItems] = useState(Array(5).fill().map(() => ({ description: "", quantity: "", rate: "" })));
  const [discount, setDiscount] = useState("");
  const [tax, setTax] = useState("");
  const [vat, setVat] = useState("");
  const [shipping, setShipping] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [dueDate, setDueDate] = useState("");
  const [billDate, setBillDate] = useState("");
  const [status, setStatus] = useState("Due");
  const [billTo, setBillTo] = useState({ name: "", address: "", contact: "", email: "" });
  const [notes, setNotes] = useState("");
  const [template, setTemplate] = useState(queryParams.get("template") || "classic");
  const [invoiceNo, setInvoiceNo] = useState("");

  // Fetch for Create or Edit mode
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isEditMode) {
          const { data } = await axios.get(`/invoices/${invoiceId}`);
          const {
            business, billTo, items, invoiceNo, billDate, dueDate,
            status, discount, tax, vat, shipping, currency, notes, template
          } = data;

          setBusiness(business);
          setBillTo(billTo);
          setItems(items);
          setInvoiceNo(invoiceNo);
          setBillDate(billDate);
          setDueDate(dueDate);
          setStatus(status);
          setDiscount(discount);
          setTax(tax);
          setVat(vat);
          setShipping(shipping);
          setCurrency(currency);
          setNotes(notes);
          setTemplate(template);
        } else {
          const { data } = await axios.get(`/businesses/${businessId}`);
          setBusiness(data);
          if (data.currency) setCurrency(data.currency);

          const res = await axios.get(`/invoices/next-invoice-no?businessId=${data._id}`);
          setInvoiceNo(res.data.invoiceNo);
        }
      } catch (err) {
        toast.error("Failed to load invoice or business data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [businessId, invoiceId, isEditMode]);

  const calcSubtotal = () => items.reduce((acc, item) => acc + Number(item.quantity || 0) * Number(item.rate || 0), 0);
  const calcDiscount = () => (calcSubtotal() * (Number(discount) || 0)) / 100;
  const calcTax = () => (calcSubtotal() * (Number(tax) || 0)) / 100;
  const calcVat = () => (calcSubtotal() * (Number(vat) || 0)) / 100;
 const calcTotal = () => {
  const subtotal = calcSubtotal();
  const total =
    subtotal - calcDiscount() + calcTax() + calcVat() + Number(shipping || 0);
  return Number(total.toFixed(2)); // return as Number not string
};

const saveInvoiceToDB = async () => {
  try {
    const subtotal = calcSubtotal(); // 👈 Add this

    const payload = {
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
      template,
      subtotal: Number(subtotal.toFixed(2)), // ✅ Add subtotal
      total: calcTotal(), // ✅ Already fixed above
    };

    if (isEditMode) {
      await axios.put(`/invoices/${invoiceId}`, payload);
      toast.success("Invoice updated successfully!");
    } else {
      await axios.post("/api/invoices/save", payload);
      toast.success("Invoice created successfully!");
    }
  } catch (error) {
    toast.error("Failed to save invoice.");
  }
};

  const handleDownloadPDF = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Downloading invoice as PDF...");
      const response = await axios.post('/invoices/generate-pdf', {
        business, billTo, items, invoiceNo, billDate, dueDate,
        status, discount, tax, vat, shipping, currency, notes, template,
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoiceNo}_${template}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      await saveInvoiceToDB();
      toast.success("Invoice downloaded & saved successfully!");
    } catch (err) {
      toast.error("Download failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Preparing invoice for print...");
      const response = await axios.post('/invoices/generate-pdf', {
        business, billTo, items, invoiceNo, billDate, dueDate,
        status, discount, tax, vat, shipping, currency, notes, template
      }, { responseType: 'blob' });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = function () {
          printWindow.focus();
          printWindow.print();
        };
        await saveInvoiceToDB();
        toast.success("Invoice printed & saved!");
      } else {
        toast.error("Popup blocked. Please allow popups.");
      }
    } catch (err) {
      toast.error("Print failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareInvoice = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Sharing invoice via email...");
      await axios.post("/invoices/share", {
        business, billTo, items, invoiceNo, billDate, dueDate,
        status, discount, tax, vat, shipping, currency, notes, template,
        email: billTo.email
      });
      await saveInvoiceToDB();
      toast.success("Invoice shared & saved!");
    } catch (err) {
      toast.error("Failed to share invoice");
    } finally {
      setActionLoading(false);
    }
  };

  const addItem = () => setItems([...items, { description: "", quantity: "", rate: "" }]);
  const removeItem = (index) => setItems(items.filter((_, idx) => idx !== index));
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const templateMap = {
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    elegant: ElegantTemplate
  };
  const SelectedForm = templateMap[template.toLowerCase()] || ClassicTemplate;

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="mt-7 max-w-7xl mx-auto px-6 py-12 font-sans text-sm relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? "Edit Invoice" : "Create Invoice"} — <span className="text-blue-600 capitalize">{template}</span> template
        </h1>
      </div>

      {previewMode ? (
        <InvoicePreview
          business={business}
          billTo={billTo}
          items={items}
          invoiceNo={invoiceNo}
          billDate={billDate}
          dueDate={dueDate}
          status={status}
          discount={discount}
          tax={tax}
          vat={vat}
          shipping={shipping}
          currency={currency}
          notes={notes}
          template={template}
          calcSubtotal={calcSubtotal}
          calcDiscount={calcDiscount}
          calcTax={calcTax}
          calcVat={calcVat}
          calcTotal={calcTotal}
          setPreviewMode={setPreviewMode}
          handleDownloadPDF={handleDownloadPDF}
          handlePrint={handlePrint}
          handleShareInvoice={handleShareInvoice}
        />
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          <InvoiceSidebar
            discount={discount} setDiscount={setDiscount}
            tax={tax} setTax={setTax}
            vat={vat} setVat={setVat}
            shipping={shipping} setShipping={setShipping}
            currency={currency} setCurrency={setCurrency}
            setPreviewMode={setPreviewMode}
            handleDownloadPDF={handleDownloadPDF}
            handlePrint={handlePrint}
            handleShareInvoice={handleShareInvoice}
          />
          <SelectedForm
            business={business}
            items={items} addItem={addItem} removeItem={removeItem} updateItem={updateItem}
            invoiceNo={invoiceNo} setInvoiceNo={setInvoiceNo}
            billDate={billDate} setBillDate={setBillDate}
            dueDate={dueDate} setDueDate={setDueDate}
            status={status} setStatus={setStatus}
            billTo={billTo} setBillTo={setBillTo}
            notes={notes} setNotes={setNotes}
            discount={discount} tax={tax} vat={vat} shipping={shipping} currency={currency}
            calcSubtotal={calcSubtotal} calcDiscount={calcDiscount}
            calcTax={calcTax} calcVat={calcVat} calcTotal={calcTotal}
          />
        </div>
      )}

      {actionLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 text-white animate-fadeIn">
            <div className="relative w-14 h-14">
              <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-ping"></div>
              <div className="w-full h-full rounded-full border-t-4 border-b-4 border-white border-opacity-90 animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-md shadow-white/70"></div>
            </div>
            <p className="text-lg font-semibold tracking-wide animate-pulse">
              {loadingText || "Processing your invoice..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
