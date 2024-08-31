import React, { useState } from 'react';
import './Mycart.css';
import { useCart } from '../../Context/card.context';
import Sidebar from '../../components/SideBar/SideBar';
import axios from 'axios';
import jsPDFInvoiceTemplate, { OutputType, jsPDF } from 'jspdf-invoice-template';
import { Link } from 'react-router-dom';
import SadhguruTilesLogo from './logos/sadhgurtiles.jpeg'; // Replace with actual path
import DTSLogo from './logos/company_logo.png'; // Replace with actual path

const MyCart = () => {
  const { state: { ShoppingCart } } = useCart();
  const [customerId, setCustomerId] = useState('');
  const [customerData, setCustomerData] = useState({
    customerName: '',
    billingAddress: '',
    shippingAddress: '',
    phoneNumber: '',
    emailAddress: '',
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state

  const subtotal = ShoppingCart.reduce((acc, item) => acc + (item.rate || 0) * (item.quantity || 0), 0);
  const amountReceived = 0; // Example value, adjust as needed
  const balanceDue = subtotal - amountReceived;

  const handleCustomer = async () => {
    try {
      const response = await axios.get(`http://localhost:7171/api/customers/${customerId}`);
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
      console.log(err);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };

  const handleDownload = () => {
    const props = {
      outputType: OutputType.Save,
      returnJsPDFDocObject: false,
      fileName: `Quotation_${customerId || 'Unknown'}`,
      orientationLandscape: false,
      compress: true,
      logo: {
        src: SadhguruTilesLogo || '', // Default to empty string if logo is missing
        type: 'JPEG',
        width: 53.33,
        height: 26.66,
        margin: {
          top: 0,
          left: 0,
        },
      },
      stamp: {
        inAllPages: false,
        src: DTSLogo || '',
        type: 'PNG',
        width: 20,
        height: 20,
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
        website: "www.sadhgurutiles.com", // Add your website if any
      },
      contact: {
        label: "Invoice issued for:",
        name: customerData.customerName || 'N/A',
        address: customerData.shippingAddress || 'N/A',
        phone: customerData.phoneNumber || 'N/A',
        email: customerData.emailAddress || 'N/A',
        otherInfo: "",
      },
      invoice: {
        label: "Quotation #: ",
        num: customerId || 'Unknown',
        invDate: `Payment Date: ${new Date().toLocaleDateString()}`,
        invGenDate: `Invoice Date: ${new Date().toLocaleDateString()}`,
        headerBorder: true,
        tableBodyBorder: true,
        header: [
          { title: "#", style: { width: 10 } },
          { title: "SKU", style: { width: 30 } },
          { title: "Product Name", style: { width: 80 } },
          { title: "Category", style: { width: 30 } },
          { title: "Rate (INR)", style: { width: 30 } },
          { title: "Quantity", style: { width: 20 } },
          { title: "Tax", style: { width: 20 } },
          { title: "Total", style: { width: 30 } },
        ],
        table: ShoppingCart.map((item, index) => ([
          index + 1,
          item.sku?.toString() || 'N/A',
          item.name?.toString() || 'N/A',
          item.category?.toString() || 'N/A',
          `Rs ${(item.rate || 0).toString()}`,
          (item.quantity || 0).toString(),
          `Rs ${(item.tax || 0).toString()}`,
          `Rs ${(item.rate * item.quantity || 0).toString()}`,
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
    <div className={`my-cart-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="my-cart">
        <div className="customer-details">
          <input
            type="text"
            placeholder="Enter Customer Id"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <button onClick={handleCustomer}>Check</button>
        </div>

        <div className="customer-info">
          <input type="text" placeholder="Customer Name" value={customerData.customerName} readOnly />
          <input type="email" placeholder="Email Address" value={customerData.emailAddress} readOnly />
          <input type="text" placeholder="Billing Address" value={customerData.billingAddress} readOnly />
          <input type="text" placeholder="Shipping Address" value={customerData.shippingAddress} readOnly />
          <input type="text" placeholder="Phone Number" value={customerData.phoneNumber} readOnly />
        </div>

        <table className="cart-table">
          <thead>
            <tr>
              <th>No</th>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Rate (INR)</th>
              <th>Quantity</th>
              <th>Tax</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ShoppingCart.map((item, index) => (
              <tr key={item.sku}>
                <td>{index + 1}</td>
                <td>
                  <img src={item.image} alt={item.sku} className="cart-item-image" />
                  <p>{item.sku}</p>
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs {item.rate}</td>
                <td>{item.quantity}</td>
                <td>Rs {item.tax || 0}</td>
                <td>Rs {item.rate * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-summary">
          <p>Total <span>Rs {subtotal}.00</span></p>
          <p>Amount Received <span>Rs {amountReceived}.00</span></p>
          <p>Balance Due <span>Rs {balanceDue}.00</span></p>
        </div>

        <div className="cart-buttons">
          <button className="download-button" onClick={handleDownload}>Download</button>
          <Link to="createinvoice">
            <button className="pay-button">Pay</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
