import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.js';
import { X, Printer } from 'lucide-react';

export function InvoiceView({ invoiceId, onClose, onStatusChange }) {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadInvoice();
  }, [invoiceId]);

  const loadInvoice = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('invoices')
      .select(`
        *,
        client:clients(*),
        invoice_items(*)
      `)
      .eq('id', invoiceId)
      .single();

    if (data) {
      setInvoice(data);
    }
    setLoading(false);
  };

  const updateStatus = async (newStatus) => {
    setUpdatingStatus(true);
    const { error } = await supabase
      .from('invoices')
      .update({ status: newStatus })
      .eq('id', invoiceId);

    if (!error) {
      await loadInvoice();
      onStatusChange?.();
    }
    setUpdatingStatus(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !invoice) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="text-gray-500">Loading invoice...</div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 print:hidden">
          <h2 className="text-2xl font-bold text-gray-900">Invoice Details</h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8 print:p-12">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
                <p className="text-xl text-gray-600">{invoice.invoice_number}</p>
              </div>
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium border print:hidden ${getStatusColor(
                  invoice.status
                )}`}
              >
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Bill To</h3>
                <div className="text-gray-900">
                  <p className="font-semibold text-lg">{invoice.client.name}</p>
                  {invoice.client.email && <p className="text-sm">{invoice.client.email}</p>}
                  {invoice.client.phone && <p className="text-sm">{invoice.client.phone}</p>}
                  {invoice.client.address && <p className="text-sm mt-2">{invoice.client.address}</p>}
                  {(invoice.client.city || invoice.client.state || invoice.client.zip) && (
                    <p className="text-sm">
                      {invoice.client.city && `${invoice.client.city}, `}
                      {invoice.client.state} {invoice.client.zip}
                    </p>
                  )}
                  {invoice.client.country && <p className="text-sm">{invoice.client.country}</p>}
                </div>
              </div>

              <div className="text-right">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Issue Date</p>
                  <p className="text-gray-900 font-medium">
                    {new Date(invoice.issue_date).toLocaleDateString()}
                  </p>
                </div>
                {invoice.due_date && (
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 text-sm font-semibold text-gray-700 uppercase">
                    Description
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase w-24">
                    Qty
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase w-32">
                    Rate
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-700 uppercase w-32">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.invoice_items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-4 text-gray-900">{item.description}</td>
                    <td className="py-4 text-right text-gray-900">{item.quantity}</td>
                    <td className="py-4 text-right text-gray-900">${item.rate.toFixed(2)}</td>
                    <td className="py-4 text-right text-gray-900 font-medium">
                      ${item.amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="flex justify-between py-2 text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-gray-700">
                <span>Tax ({invoice.tax_rate}%):</span>
                <span className="font-medium">${invoice.tax_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-xl font-bold border-t-2 border-gray-300 text-gray-900">
                <span>Total:</span>
                <span className="text-blue-600">${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">Notes</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}

          <div className="print:hidden space-y-3">
            <h3 className="text-sm font-semibold text-gray-700 uppercase">Update Status</h3>
            <div className="flex flex-wrap gap-2">
              {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateStatus(status)}
                  disabled={updatingStatus || invoice.status === status}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    invoice.status === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
