import React, { useState } from 'react';
import './Invoice.css';
import Sidebar from '../../components/SideBar/SideBar';
import { useCart } from '../../Context/card.context';
import axios from 'axios';
import jsPDFInvoiceTemplate, { OutputType } from 'jspdf-invoice-template';

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
  const amountReceived = 0; // Example value, adjust as needed
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

  const handleDownload = () => {
    const props = {
      outputType: OutputType.Save, // Automatically save the file
      returnJsPDFDocObject: false, // Do not return the jsPDF object
      fileName: `Invoice_${invoiceNo}`,
      orientationLandscape: false, // Portrait orientation
      compress: true,
      logo: {
        src: '', // Add your logo image path or URL here
        type: 'JPEG', // Image type
        width: 53.33, // Adjust width as needed
        height: 26.66, // Adjust height as needed
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
    <div className={`invoice-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="invoice-page">
        <div className="invoice-header">
          <div className="invoice-header-left">
            <h2>Invoice {invoiceNo}</h2>
          </div>
          <div className="invoice-header-right">
            <h2>RS {subtotal}.00</h2>
          </div>
        </div>

        <div className="customer-info">
          <div className="customer-info-left">
            <input
              type="text"
              placeholder="Enter Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
            <button onClick={handleCustomer}>Check</button>
            <input
              type="text"
              placeholder="Customer Name"
              value={customerData.customerName || ''}
              readOnly
            />
            <input
              type="text"
              placeholder="Address"
              value={customerData.billingAddress || ''}
              readOnly
            />
            <input
              type="text"
              placeholder="Contact No"
              value={customerData.phoneNumber || ''}
              readOnly
            />
          </div>
          <div className="customer-info-right">
            <input
              type="email"
              placeholder="Email Address"
              value={customerData.emailAddress || ''}
              readOnly
            />
            <label>Invoice Date</label>
            <input
              type="date"
              value={invoiceDate || ''}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate || ''}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="details-section">
          <h3>Details</h3>
          <table className="details-table">
            <thead>
              <tr>
                <th>Products</th>
                <th>Description</th>
                <th>Category</th>
                <th>SKU/HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ShoppingCart.map((item, index) => (
                <tr key={item.sku}>
                  <td>
                    <img src={item.image} alt={item.sku} className="product-image" />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.sku}</td>
                  <td>{item.quantity}</td>
                  <td>{item.rate}</td>
                  <td>{item.rate * item.quantity}</td>
                  <td>
                    <button className="delete-button">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="footer-section">
          <div className="footer-left">
            <input
              type="text"
              placeholder="Agent ID"
              readOnly
              className="agent-input"
            />
            <textarea placeholder="Terms & Conditions"></textarea>
          </div>
          <div className="footer-right">
            <label>
              <input type="checkbox" /> Apply GST
            </label>
            <input type="text" placeholder='Amount' className="gst-input" />
          </div>
        </div>

        <div className="invoice-summary">
          <p>Total <span>RS {subtotal}.00</span></p>
          <p>Balance Due <span>RS {balanceDue}.00</span></p>
        </div>

        <div className="action-buttons">
          <button onClick={handleDownload} className="print-button">PRINT</button>
          <button className="save-button">SAVE</button>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
