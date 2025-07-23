import Invoice from '../models/Invoice.js';

const updateOverdueInvoices = async (businessId) => {
  const today = new Date();

  const overdueInvoices = await Invoice.find({
    business: businessId,
    status: 'Due',
    dueDate: { $lt: today },
  });

  for (const invoice of overdueInvoices) {
    invoice.status = 'Overdue';
    await invoice.save();
  }
};

export default updateOverdueInvoices;
