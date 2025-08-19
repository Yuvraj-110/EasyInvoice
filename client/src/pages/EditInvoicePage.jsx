import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import EditInvoice from '../components/EditInvoice'; // adjust if in a different folder

const EditInvoicePage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/invoices/${id}`)
      .then(res => setInvoice(res.data))
      .catch(err => console.error('Error fetching invoice:', err));
  }, [id]);

  if (!invoice) return <p>Loading invoice...</p>;

  return <EditInvoice invoice={invoice} />;
};

export default EditInvoicePage;
