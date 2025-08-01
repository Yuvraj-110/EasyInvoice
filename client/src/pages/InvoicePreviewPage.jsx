import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InvoicePreview from '../components/InvoicePreview';
import axios from '../api/axios';
import toast from 'react-hot-toast';

const InvoicePreviewPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const { data } = await axios.get(`/invoices/${id}`);
        setInvoice(data);
      } catch (err) {
        console.error('Failed to fetch invoice', err);
        toast.error('Invoice not found');
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.post(
        '/invoices/generate-pdf',
        { ...invoice, shouldSave: false },
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Invoice_${invoice.invoiceNo}_${invoice.template}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Invoice downloaded!');
    } catch (err) {
      console.error(err);
      toast.error('Download failed');
    }
  };

  const handlePrint = async () => {
    try {
      const response = await axios.post(
        '/invoices/generate-pdf',
        { ...invoice, shouldSave: false },
        { responseType: 'blob' }
      );
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
      } else {
        toast.error('Popup blocked. Please allow popups.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Print failed');
    }
  };

  const handleShareInvoice = async () => {
  try {
    setActionLoading(true);
    setLoadingText('Sharing invoice...');

    await axios.post('/invoices/share', {
      ...invoice,
      email: invoice?.billTo?.email,
      shouldSave: false,
    });

    toast.success('Invoice shared via email!');
  } catch (err) {
    console.error(err);
    toast.error('Sharing failed.');
  } finally {
    setActionLoading(false);
    setLoadingText('');
  }
};

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!invoice) return <div className="p-6 text-center">Invoice not found</div>;

  const {
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
  } = invoice;

  const calcSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const calcDiscount = () => (discount / 100) * calcSubtotal();
  const calcTax = () => (tax / 100) * calcSubtotal();
  const calcVat = () => (vat / 100) * calcSubtotal();
  const calcTotal = () =>
    calcSubtotal() - calcDiscount() + calcTax() + calcVat() + parseFloat(shipping || 0);

  return (
    <div className="mt-7">
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
        setPreviewMode={() => window.history.back()}
        handleDownloadPDF={handleDownloadPDF}
        handlePrint={handlePrint}
        handleShareInvoice={handleShareInvoice}
      />

      {actionLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-white text-lg">{loadingText || 'Processing...'}</div>
        </div>
      )}
    </div>
  );
};

export default InvoicePreviewPage;
