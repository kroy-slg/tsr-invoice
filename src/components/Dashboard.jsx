import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { InvoiceList } from './InvoiceList.jsx';
import { InvoiceForm } from './InvoiceForm.jsx';
import { InvoiceView } from './InvoiceView.jsx';
import { FileText, Plus, LogOut } from 'lucide-react';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleInvoiceCreated = () => {
    setShowInvoiceForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleViewInvoice = (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
  };

  const handleCloseInvoiceView = () => {
    setSelectedInvoiceId(null);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Invoice Generator</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Invoices</h2>
            <p className="text-gray-600">Create, manage, and track all your invoices</p>
          </div>
          <button
            onClick={() => setShowInvoiceForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </button>
        </div>

        <InvoiceList onViewInvoice={handleViewInvoice} refreshTrigger={refreshTrigger} />
      </main>

      {showInvoiceForm && (
        <InvoiceForm
          onClose={() => setShowInvoiceForm(false)}
          onSuccess={handleInvoiceCreated}
        />
      )}

      {selectedInvoiceId && (
        <InvoiceView
          invoiceId={selectedInvoiceId}
          onClose={handleCloseInvoiceView}
          onStatusChange={() => setRefreshTrigger((prev) => prev + 1)}
        />
      )}
    </div>
  );
}
