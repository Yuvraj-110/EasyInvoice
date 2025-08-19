import React from 'react';
import ClassicInvoiceForm from '../InvoiceTemplates/ClassicInvoice';
import MinimalInvoiceForm from '../InvoiceTemplates/MinimalInvoice';
import ElegantInvoiceForm from '../InvoiceTemplates/ElegantInvoiceForm';

const templateMap = {
  classic: ClassicInvoiceForm,
  minimal: MinimalInvoiceForm,
  elegant: ElegantInvoiceForm
};

const InvoiceFormRenderer = ({ invoice }) => {
  const TemplateForm = templateMap[invoice.template?.toLowerCase()] || ClassicInvoiceForm;
  return <TemplateForm existingData={invoice} />;
};

export default InvoiceFormRenderer;
