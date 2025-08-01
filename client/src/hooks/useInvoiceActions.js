import { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function useInvoiceActions(invoiceData, saveInvoiceToDB) {
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleDownloadPDF = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Downloading invoice as PDF...");
      const response = await axios.post("/invoices/generate-pdf", invoiceData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${invoiceData.invoiceNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      if (saveInvoiceToDB) await saveInvoiceToDB();
      toast.success("Invoice downloaded successfully!");
    } catch (err) {
      toast.error("Download failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Preparing invoice for print...");
      const response = await axios.post("/invoices/generate-pdf", invoiceData, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url);
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.focus();
          printWindow.print();
        };
        if (saveInvoiceToDB) await saveInvoiceToDB();
        toast.success("Invoice printed successfully!");
      } else {
        toast.error("Popup blocked.");
      }
    } catch (err) {
      toast.error("Print failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShareInvoice = async () => {
    try {
      setActionLoading(true);
      setLoadingText("Sharing invoice...");
      await axios.post("/invoices/share", {
        ...invoiceData,
        email: invoiceData?.billTo?.email,
      });

      if (saveInvoiceToDB) await saveInvoiceToDB();
      toast.success("Invoice shared via email!");
    } catch (err) {
      toast.error("Sharing failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return {
    handleDownloadPDF,
    handlePrint,
    handleShareInvoice,
    actionLoading,
    loadingText,
  };
}
