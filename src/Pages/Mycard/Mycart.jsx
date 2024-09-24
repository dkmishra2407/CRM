import React, { useState, useEffect } from 'react';
import './Mycart.css';
import { useCart } from '../../Context/card.context';
import Sidebar from '../../components/SideBar/SideBar';
import axios from 'axios';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Link } from 'react-router-dom';
import SadhguruTilesLogo from './logos/sadhgurtiles.jpeg';
import DTSLogo from './logos/company_logo.png';
import Header from '../../components/Header/Header';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AddCustomerForm from '../../components/AddCustomer/AddCustomer';
import { useNavigate } from 'react-router-dom';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const MyCart = () => {
  const { state: { ShoppingCart }, dispatch } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [agentId, setAgentId] = useState('');
  const [customerData, setCustomerData] = useState({
    customerId: '',
    customerName: '',
    billingAddress: '',
    shippingAddress: '',
    phoneNumber: '',
    emailAddress: '',
  });
  const [customers, setCustomers] = useState([]);
  const [suggestedCustomers, setSuggestedCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const apiUrl = process.env.REACT_APP_API_URL;

  // Calculate subtotal, discount, tax, and total for each product
  const calculateProductTotal = (item) => {
    const discountAmount = (item.rate * item.quantity * (item.discount || 0)) / 100;
    const totalAfterDiscount = (item.rate * item.quantity) - discountAmount;
    const taxAmount = totalAfterDiscount * 0.18; // 18% tax
    return totalAfterDiscount + taxAmount;
  };

  const subtotal = ShoppingCart.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
  const discountAmount = ShoppingCart.reduce((acc, item) => acc + ((item.rate * item.quantity * (item.discount || 0)) / 100), 0);
  const totalAfterDiscount = subtotal - discountAmount;
  const taxAmount = totalAfterDiscount * 0.18; // 18% tax
  const grandTotal = totalAfterDiscount + taxAmount;

  const amountReceived = 0;
  const balanceDue = grandTotal - amountReceived;

  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user && user.associateId) {
          setAgentId(user.associateId);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    fetchCustomers();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/customers`);
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch customers', err);
      setCustomers([]);
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    if (searchValue.length > 0) {
      const filteredCustomers = customers.filter(cust =>
        cust.customerName.toLowerCase().includes(searchValue.toLowerCase())
      );
      setSuggestedCustomers(filteredCustomers);
    } else {
      setSuggestedCustomers([]);
    }
  };

  const getBase64ImageFromUrl = async (imageUrl) => {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleCustomerSelect = (customer) => {
    setCustomerData({
      customerId: customer.customerId,
      customerName: customer.customerName,
      billingAddress: customer.billingAddress,
      shippingAddress: customer.shippingAddress,
      phoneNumber: customer.phoneNumber,
      emailAddress: customer.emailAddress,
    });
    setSearchTerm(customer.customerName);
    setSuggestedCustomers([]);
    toast.success("Customer Selected");
  };

  const handleAddCustomer = () => {
    setIsModalOpen(true);
  };



  const handleDeleteItem = (sku) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { sku },
    });
  };

  const handleCustomerSearch = () => {
    const customer = customers.find(cust => cust.customerName.toLowerCase() === searchTerm.toLowerCase());
    
    if (customer) {
      const { customerId, customerName, billingAddress, shippingAddress, phoneNumber, emailAddress } = customer;
      setCustomerData({
        customerId,
        customerName,
        billingAddress,
        shippingAddress,
        phoneNumber,
        emailAddress,
      });
      toast.success("Customer Found");
    } else {
      setCustomerData({
        customerId: '',
        customerName: '',
        billingAddress: '',
        shippingAddress: '',
        phoneNumber: '',
        emailAddress: '',
      });
      toast.error("Customer Not Found");
    }
  };

  const handleDiscountChange = (e, sku) => {
    const discount = e.target.value;
    dispatch({
      type: 'UPDATE_DISCOUNT',
      payload: { sku, discount: parseFloat(discount) },
    });
  };

  const generatePDF = async (customerData, ShoppingCart, subtotal, discountAmount, taxAmount, grandTotal) => {
    try {
      const SadhguruTilesLogoBase64 = await getBase64ImageFromUrl(SadhguruTilesLogo || '');
      const DTSLogoBase64 = await getBase64ImageFromUrl(DTSLogo || '');

      const tableBody = [
        [
          { text: "#", style: 'tableHeader' },
          { text: "SKU", style: 'tableHeader' },
          { text: "Product Name", style: 'tableHeader' },
          { text: "Image", style: 'tableHeader' },
          { text: "Category", style: 'tableHeader' },
          { text: "Rate (INR)", style: 'tableHeader' },
          { text: "Qty", style: 'tableHeader' },
          { text: "Discount (%)", style: 'tableHeader' },
          { text: "Tax", style: 'tableHeader' },
          { text: "Total", style: 'tableHeader' },
        ],
        ...await Promise.all(ShoppingCart.map(async (item, index) => [
          index + 1,
          item.sku?.toString() || 'N/A',
          item.name?.toString() || 'N/A',
          { image: await getBase64ImageFromUrl(item.image), fit: [50, 50] },
          item.category?.toString() || 'N/A',
          `Rs ${(item.rate || 0)}`,
          item.quantity?.toString() || '0',
          `${item.discount || 0}%`,
          `Rs ${(item.rate * item.quantity * 0.18)}`,
          `Rs ${calculateProductTotal(item).toFixed(2)}`,
        ])),
      ];

      const docDefinition = {
        background: {
          image: DTSLogoBase64,
          width: 300,
          opacity: 0.2,
          absolutePosition: { x: 150, y: 250 }
        },
        content: [
          {
            columns: [
              { image: SadhguruTilesLogoBase64, width: 100 },
              [
                { text: "SADHGURU TILES & MARBLES", fontSize: 18, bold: true },
                { text: "Sr. No. 1/3, Yojana Nagar, near HP Petrol Pump...", fontSize: 10 },
                { text: "Phone: 0980101989 / 7620870603 / 9011719000", fontSize: 10 },
                { text: "Email: sadhgurutiles@gmail.com", fontSize: 10 },
                { text: "Website: www.sadhgurutiles.com", fontSize: 10 }
              ],
              { image: DTSLogoBase64, width: 50 }
            ]
          },
          { text: '\n' },
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: "Invoice issued for:", bold: true },
                  { text: `Name: ${customerData.customerName || 'N/A'}` },
                  { text: `Address: ${customerData.shippingAddress || 'N/A'}` },
                  { text: `Phone: ${customerData.phoneNumber || 'N/A'}` },
                  { text: `Email: ${customerData.emailAddress || 'N/A'}` },
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: "Quotation #:", bold: true },
                  { text: customerData.customerId || 'Unknown' },
                  { text: `Payment Date: ${new Date().toLocaleDateString()}` },
                  { text: `Invoice Date: ${new Date().toLocaleDateString()}` }
                ]
              }
            ]
          },
          { text: '\n' },
          {
            table: {
              headerRows: 1,
              body: tableBody
            },
            layout: 'lightHorizontalLines'
          },
          { text: '\n' },
          {
            columns: [
              { width: '60%', text: '' },
              {
                width: '50%',
                table: {
                  widths: ['50%', '30%'],
                  body: [
                    [
                      { text: 'Subtotal:', bold: true, alignment: 'right' },
                      { text: `Rs ${subtotal}`, alignment: 'right' }
                    ],
                    [
                      { text: 'Discount:', bold: true, alignment: 'right' },
                      { text: `Rs ${discountAmount}`, alignment: 'right' }
                    ],
                    [
                      { text: 'Tax:', bold: true, alignment: 'right' },
                      { text: `Rs ${taxAmount}`, alignment: 'right' }
                    ],
                    [
                      { text: 'Total Amount:', bold: true, alignment: 'right' },
                      { text: `Rs ${grandTotal}`, alignment: 'right' }
                    ]
                  ]
                },
                layout: 'noBorders'
              }
            ]
          },
          { text: '\n' },
          {
            text: "The invoice is created on a computer and is valid without the signature and stamp.",
            fontSize: 10,
            alignment: 'center'
          }
        ],
        styles: {
          tableHeader: { bold: true, fontSize: 12, color: 'black' }
        }
      };

      pdfMake.createPdf(docDefinition).download(`Quotation_${customerData.customerId || 'Unknown'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDownload = async () => {
    generatePDF(customerData, ShoppingCart, subtotal, discountAmount, taxAmount, grandTotal);
  };

  return (
    <>
  <Header className="UniversalHeader" />
  <div className={`flex ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
    <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className="p-6 w-full">
      {/* Page Title */}
      <h1 className="text-2xl font-bold mb-4">Generate Quotation</h1>

      {/* Customer Search and Suggestions */}
      <div className="mb-6">
        <div className="flex items-center mb-2">
          <input
            type="text"
            placeholder="Search Customer by Name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="p-2 border rounded w-full"
          />
          <button
            onClick={handleCustomerSearch}
            className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Search
          </button>
          {/* {!customerData.customerName && (
          <button
            onClick={handleAddCustomer}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Customer
          </button>
        )} */}
        </div>

        {suggestedCustomers.length > 0 && (
          <ul className="border rounded p-2 bg-white shadow-md">
            {suggestedCustomers.map((customer) => (
              <li
                key={customer.customerId}
                onClick={() => handleCustomerSelect(customer)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {customer.customerName}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Customer Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Customer Name"
          value={customerData.customerName}
          readOnly
          className="p-2 border rounded w-full"
        />
        <input
          type="email"
          placeholder="Email Address"
          value={customerData.emailAddress}
          readOnly
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Billing Address"
          value={customerData.billingAddress}
          readOnly
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Shipping Address"
          value={customerData.shippingAddress}
          readOnly
          className="p-2 border rounded w-full"
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={customerData.phoneNumber}
          readOnly
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Cart Table */}
      <table className="min-w-full border-collapse border border-gray-200 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">No</th>
            <th className="border px-4 py-2">SKU</th>
            <th className="border px-4 py-2">Product Name</th>
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Rate (INR)</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Discount (%)</th>
            <th className="border px-4 py-2">Tax</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ShoppingCart.map((item, index) => (
            <tr key={item.sku} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">
                <img src={item.image} alt={item.sku} className="w-12 h-12 object-cover" />
                <p>{item.sku}</p>
              </td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">Rs {item.rate}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">
                <input
                  type="text"
                  max={100}
                  onChange={(e) => handleDiscountChange(e, item.sku)}
                  placeholder="Discount %"
                  className="p-2 border rounded w-full"
                />
              </td>
              <td className="border px-4 py-2">Rs {(item.rate * item.quantity * 0.18).toFixed(2)}</td>
              <td className="border px-4 py-2">Rs {calculateProductTotal(item).toFixed(2)}</td>
              <td className="border px-4 py-2">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteItem(item.sku)}
                >
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Cart Summary */}
      <div className="mb-6 right-40">
        <p className="text-lg font-semibold">
          Total: <span>Rs {subtotal}.00</span>
        </p>
        <p className="text-lg font-semibold">
          Discount: <span>Rs {discountAmount}.00</span>
        </p>
        <p className="text-lg font-semibold">
          Tax: <span>Rs {taxAmount}.00</span>
        </p>
        <p className="text-lg font-semibold">
          Balance Due: <span>Rs {grandTotal}.00</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download
        </button>
        <Link to="createinvoice">
          <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Pay
          </button>
        </Link>
      </div>
    </div>

    {/* Add Customer Modal */}
    {isModalOpen && (
      <AddCustomerForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    )}
  </div>
</>

  );
};

export default MyCart;
