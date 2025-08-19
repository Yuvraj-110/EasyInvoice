import React from 'react';
import InvoiceFormRenderer from './InvoiceFormRenderer';

const InvoiceEditLayout = ({ invoice }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Edit Invoice #{invoice.invoiceNo}</h2>
      <InvoiceFormRenderer invoice={invoice} />
    </div>
  );
};

export default InvoiceEditLayout;
