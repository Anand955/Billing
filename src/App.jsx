import React, { useState } from 'react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import InvoiceForm from './InvoiceForm';
import InvoicePDF from './InvoicePDF';

function App() {
  const [invoiceData, setInvoiceData] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleGenerate = async (data) => {
    setInvoiceData(data);
    // Generate PDF blob
    const blob = await pdf(<InvoicePDF invoiceData={data} />).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  const handlePrint = async () => {
    if (!invoiceData) return;

    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {!invoiceData ? (
        <InvoiceForm onGenerate={handleGenerate} />
      ) : (
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-end mb-4 gap-4">
            <button
              onClick={() => setInvoiceData(null)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Form
            </button>

            <PDFDownloadLink
              document={<InvoicePDF invoiceData={invoiceData} />}
              fileName={`invoice_${invoiceData.invoiceNumber}.pdf`}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {({ loading }) => (loading ? 'Preparing PDF...' : 'Download PDF')}
            </PDFDownloadLink>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Print Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
