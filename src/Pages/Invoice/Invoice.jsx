import React, { useState } from 'react';
import Sidebar from '../../components/SideBar/SideBar';
import { useCart } from '../../Context/card.context';
import axios from 'axios';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';
import Header from '../../components/Header/Header';

const InvoicePage = () => {
  const { state: { ShoppingCart } } = useCart();
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState({
    customerName: '',
    billingAddress: '',
    shippingAddress: '',
    phoneNumber: '',
    emailAddress: '',
  });
  const [invoiceDate, setInvoiceDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [invoiceNo] = useState('1001');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  const subtotal = ShoppingCart.reduce((acc, item) => acc + (item.rate || 0) * (item.quantity || 0), 0);
  const amountReceived = 0;
  const balanceDue = subtotal - amountReceived;

  const handleCustomer = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/customers/${customerId}`);
      if (response.data) {
        const { customerName, billingAddress, shippingAddress, phoneNumber, emailAddress } = response.data;
        setCustomerData({
          customerName,
          billingAddress,
          shippingAddress,
          phoneNumber,
          emailAddress,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const user = localStorage.getItem('user');
  const agentId = user.associateId;

  const handleDownload = () => {
    const props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: false,
      fileName: `Invoice_${invoiceNo}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: '', 
        type: 'JPEG',
        width: 53.33,
        height: 26.66,
        margin: {
          top: 0,
          left: 0,
        },
      },
      business: {
        name: "SADHGURU TILES & MARBLES",
        address: "Sr. No. 1/3, Yojana Nagar, near HP Petrol Pump...",
        phone: "0980101989 / 7620870603 / 9011719000",
        email: "sadhgurutiles@gmail.com",
        website: "www.sadhgurutiles.com",
      },
      contact: {
        label: "Invoice issued for:",
        name: customerData.customerName || 'N/A',
        address: customerData.billingAddress || 'N/A',
        phone: customerData.phoneNumber || 'N/A',
        email: customerData.emailAddress || 'N/A',
      },
      invoice: {
        label: "Invoice #: ",
        num: invoiceNo,
        invDate: `Invoice Date: ${invoiceDate || 'N/A'}`,
        invGenDate: `Due Date: ${dueDate || 'N/A'}`,
        headerBorder: false,
        tableBodyBorder: false,
        header: [
          { title: "#", style: { width: 10 } },
          { title: "Product", style: { width: 30 } },
          { title: "Category", style: { width: 30 } },
          { title: "SKU/HSN", style: { width: 30 } },
          { title: "Qty", style: { width: 10 } },
          { title: "Rate", style: { width: 30 } },
          { title: "Amount", style: { width: 30 } },
        ],
        table: ShoppingCart.map((item, index) => ([
          index + 1,
          item.name || 'N/A',
          item.category || 'N/A',
          item.sku || 'N/A',
          item.quantity?.toString() || '0',
          `Rs ${item.rate?.toString() || '0'}`,
          `Rs ${(item.rate * item.quantity)?.toString() || '0'}`,
        ])),
        additionalRows: [
          {
            col1: 'Subtotal:',
            col2: `Rs ${subtotal}.00`,
            col3: '',
            style: { fontSize: 12, fontStyle: 'bold' },
          },
          {
            col1: 'Amount Received:',
            col2: `Rs ${amountReceived}.00`,
            col3: '',
            style: { fontSize: 12, fontStyle: 'bold' },
          },
          {
            col1: 'Balance Due:',
            col2: `Rs ${balanceDue}.00`,
            col3: '',
            style: { fontSize: 12, fontStyle: 'bold' },
          },
        ],
        invDescLabel: "Invoice Note",
        invDesc: "Thank you for your business! Please make the payment by the due date.",
      },
      footer: {
        text: "The invoice is created on a computer and is valid without the signature and stamp.",
      },
      pageEnable: true,
      pageLabel: "Page ",
    };

    jsPDFInvoiceTemplate(props);
  };

  return (
    <>
      <Header className="header" />
      <div className={`flex ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-6 w-full">
          {/* Invoice Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Invoice {invoiceNo}</h2>
            <h2 className="text-2xl font-bold">RS {subtotal}.00</h2>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                type="text"
                placeholder="Enter Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <button
                onClick={handleCustomer}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Check
              </button>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerData.customerName || ''}
                readOnly
                className="mt-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Address"
                value={customerData.billingAddress || ''}
                readOnly
                className="mt-2 p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Contact No"
                value={customerData.phoneNumber || ''}
                readOnly
                className="mt-2 p-2 border rounded w-full"
              />
            </div>

            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={customerData.emailAddress || ''}
                readOnly
                className="p-2 border rounded w-full"
              />
              <label className="block mt-4">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate || ''}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
              <label className="block mt-4">Due Date</label>
              <input
                type="date"
                value={dueDate || ''}
                onChange={(e) => setDueDate(e.target.value)}
                className="p-2 border rounded w-full"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4">Details</h3>
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-4 py-2">Products</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">Category</th>
                  <th className="border px-4 py-2">SKU/HSN</th>
                  <th className="border px-4 py-2">Qty</th>
                  <th className="border px-4 py-2">Rate</th>
                  <th className="border px-4 py-2">Amount</th>
                  <th className="border px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {ShoppingCart.map((item, index) => (
                  <tr key={item.sku} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      <img src={item.image} alt={item.sku} className="w-12 h-12" />
                    </td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.category}</td>
                    <td className="border px-4 py-2">{item.sku}</td>
                    <td className="border px-4 py-2">{item.quantity}</td>
                    <td className="border px-4 py-2">Rs {item.rate}</td>
                    <td className="border px-4 py-2">Rs {item.rate * item.quantity}</td>
                    <td className="border px-4 py-2">
                      <button className="text-red-500 hover:text-red-700">🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <input
                type="text"
                placeholder="Agent ID"
                value={localStorage.getItem('user').associateId}
                readOnly
                className="p-2 border rounded w-full"
              />
              <textarea
                placeholder="Terms & Conditions"
                className="mt-4 p-2 border rounded w-full"
              />
            </div>
            <div className="flex flex-col justify-end">
              <label className="inline-flex items-center">
                <input type="checkbox" className="form-checkbox" /> Apply GST
              </label>
              <input
                type="text"
                placeholder="Amount"
                className="mt-2 p-2 border rounded w-full"
              />
            </div>
          </div>

          {/* Invoice Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-semibold">Total: <span>RS {subtotal}.00</span></p>
            <p className="text-lg font-semibold">Balance Due: <span>RS {balanceDue}.00</span></p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button onClick={handleDownload} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              PRINT
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>

  );
};

export default InvoicePage;
