// import React, { useState, useEffect } from 'react';
// import './Mycart.css';
// import { useCart } from '../../Context/card.context';
// import Sidebar from '../../components/SideBar/SideBar';
// import axios from 'axios';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';
// import { Link } from 'react-router-dom';
// import SadhguruTilesLogo from './logos/sadhgurtiles.jpeg';
// import DTSLogo from './logos/company_logo.png';
// import Header from '../../components/Header/Header';
// import { FaTimes } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// import AddCustomerForm from '../../components/AddCustomer/AddCustomer';
// import { useNavigate } from 'react-router-dom';

// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const MyCart = () => {
//   const { state: { ShoppingCart }, dispatch } = useCart();
//   const [searchTerm, setSearchTerm] = useState('');
//   const [agentId, setAgentId] = useState('');
//   const [discountPercent, setDiscountPercent] = useState(0); // Updated to store the discount percentage
//   const [customerData, setCustomerData] = useState({
//     customerId: '',
//     customerName: '',
//     billingAddress: '',
//     shippingAddress: '',
//     phoneNumber: '',
//     emailAddress: '',
//   });
//   const [customers, setCustomers] = useState([]);
//   const [suggestedCustomers, setSuggestedCustomers] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
//   const apiUrl = process.env.REACT_APP_API_URL;

//   // Calculate subtotal and tax with discount applied
//   const subtotal = ShoppingCart.reduce((acc, item) => acc + (item.rate * item.quantity), 0);
//   const discountAmount = (subtotal * discountPercent) / 100;
//   const totalAfterDiscount = subtotal - discountAmount;
//   const taxAmount = totalAfterDiscount * 0.18; // 18% tax
//   const grandTotal = totalAfterDiscount + taxAmount;

//   const amountReceived = 0;
//   const balanceDue = grandTotal - amountReceived;

//   const navigate = useNavigate();



//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/customers`);
//       setCustomers(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       console.error('Failed to fetch customers', err);
//       setCustomers([]);
//     }
//   };

//   const handleSearchChange = (e) => {
//     const searchValue = e.target.value;
//     setSearchTerm(searchValue);

//     if (searchValue.length > 0) {
//       const filteredCustomers = customers.filter(cust =>
//         cust.customerName.toLowerCase().includes(searchValue.toLowerCase())
//       );
//       setSuggestedCustomers(filteredCustomers);
//     } else {
//       setSuggestedCustomers([]);
//     }
//   };

//   const getBase64ImageFromUrl = async (imageUrl) => {
//     const res = await fetch(imageUrl);
//     const blob = await res.blob();

//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => resolve(reader.result);
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const handleCustomerSearch = () => {
//     const customer = customers.find(cust => cust.customerName.toLowerCase() === searchTerm.toLowerCase());
    
//     if (customer) {
//       const { customerId, customerName, billingAddress, shippingAddress, phoneNumber, emailAddress } = customer;
//       setCustomerData({
//         customerId,
//         customerName,
//         billingAddress,
//         shippingAddress,
//         phoneNumber,
//         emailAddress,
//       });
//       toast.success("Customer Found");
//     } else {
//       setCustomerData({
//         customerId: '',
//         customerName: '',
//         billingAddress: '',
//         shippingAddress: '',
//         phoneNumber: '',
//         emailAddress: '',
//       });
//       toast.error("Customer Not Found");
//     }
//   };

//   const generatePDF = async (customerData, ShoppingCart, subtotal, discountAmount, taxAmount, grandTotal) => {
//     try {
//       const SadhguruTilesLogoBase64 = await getBase64ImageFromUrl(SadhguruTilesLogo || '');
//       const DTSLogoBase64 = await getBase64ImageFromUrl(DTSLogo || '');

//       const tableBody = [
//         [
//           { text: "#", style: 'tableHeader' },
//           { text: "SKU", style: 'tableHeader' },
//           { text: "Product Name", style: 'tableHeader' },
//           { text: "Image", style: 'tableHeader' },
//           { text: "Category", style: 'tableHeader' },
//           { text: "Rate (INR)", style: 'tableHeader' },
//           { text: "Qty", style: 'tableHeader' },
//           { text: "Tax", style: 'tableHeader' },
//           { text: "Total", style: 'tableHeader' },
//         ],
//         ...await Promise.all(ShoppingCart.map(async (item, index) => [
//           index + 1,
//           item.sku?.toString() || 'N/A',
//           item.name?.toString() || 'N/A',
//           { image: await getBase64ImageFromUrl(item.image), fit: [50, 50] },
//           item.category?.toString() || 'N/A',
//           `Rs ${(item.rate || 0)}`,
//           item.quantity?.toString() || '0',
//           `Rs ${(item.rate * item.quantity * 0.18)}`,
//           `Rs ${(item.rate * item.quantity + (item.rate * item.quantity * 0.18))}`,
//         ])),
//       ];

//       const docDefinition = {
//         background: {
//           image: DTSLogoBase64,
//           width: 300,
//           opacity: 0.2,
//           absolutePosition: { x: 150, y: 250 }
//         },
//         content: [
//           {
//             columns: [
//               { image: SadhguruTilesLogoBase64, width: 100 },
//               [
//                 { text: "SADHGURU TILES & MARBLES", fontSize: 18, bold: true },
//                 { text: "Sr. No. 1/3, Yojana Nagar, near HP Petrol Pump...", fontSize: 10 },
//                 { text: "Phone: 0980101989 / 7620870603 / 9011719000", fontSize: 10 },
//                 { text: "Email: sadhgurutiles@gmail.com", fontSize: 10 },
//                 { text: "Website: www.sadhgurutiles.com", fontSize: 10 }
//               ],
//               { image: DTSLogoBase64, width: 50 }
//             ]
//           },
//           { text: '\n' },
//           {
//             columns: [
//               {
//                 width: '50%',
//                 stack: [
//                   { text: "Invoice issued for:", bold: true },
//                   { text: `Name: ${customerData.customerName || 'N/A'}` },
//                   { text: `Address: ${customerData.shippingAddress || 'N/A'}` },
//                   { text: `Phone: ${customerData.phoneNumber || 'N/A'}` },
//                   { text: `Email: ${customerData.emailAddress || 'N/A'}` },
//                 ]
//               },
//               {
//                 width: '50%',
//                 stack: [
//                   { text: "Quotation #:", bold: true },
//                   { text: customerData.customerId || 'Unknown' },
//                   { text: `Payment Date: ${new Date().toLocaleDateString()}` },
//                   { text: `Invoice Date: ${new Date().toLocaleDateString()}` }
//                 ]
//               }
//             ]
//           },
//           { text: '\n' },
//           {
//             table: {
//               headerRows: 1,
//               body: tableBody
//             },
//             layout: 'lightHorizontalLines'
//           },
//           { text: '\n' },
//           {
//             columns: [
//               { width: '60%', text: '' },
//               {
//                 width: '50%',
//                 table: {
//                   widths: ['50%', '30%'],
//                   body: [
//                     [
//                       { text: 'Subtotal:', bold: true, alignment: 'right' },
//                       { text: `Rs ${subtotal}`, alignment: 'right' }
//                     ],
//                     [
//                       { text: 'Discount:', bold: true, alignment: 'right' },
//                       { text: `Rs ${discountAmount}`, alignment: 'right' }
//                     ],
//                     [
//                       { text: 'Tax:', bold: true, alignment: 'right' },
//                       { text: `Rs ${taxAmount}`, alignment: 'right' }
//                     ],
//                     [
//                       { text: 'Total Amount:', bold: true, alignment: 'right' },
//                       { text: `Rs ${grandTotal}`, alignment: 'right' }
//                     ]
//                   ]
//                 },
//                 layout: 'noBorders'
//               }
//             ]
//           },
//           { text: '\n' },
//           {
//             text: "The invoice is created on a computer and is valid without the signature and stamp.",
//             fontSize: 10,
//             alignment: 'center'
//           }
//         ],
//         styles: {
//           tableHeader: { bold: true, fontSize: 12, color: 'black' }
//         }
//       };

//       pdfMake.createPdf(docDefinition).download(`Quotation_${customerData.customerId || 'Unknown'}.pdf`);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//     }
//   };

//   const handleDownload = async () => {
//     generatePDF(customerData, ShoppingCart, subtotal, discountAmount, taxAmount, grandTotal);
//   };



//   return (
//     <>
//       <Header className="UniversalHeader" />
//       <div className={`my-cart-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="my-cart">
//           <h1>Generate Quotation</h1>

//           <div className="customer-details">
//             <input
//               type="text"
//               placeholder="Search Customer by Name"
//               value={searchTerm}
//               onChange={handleSearchChange}
//               className="customer-search-input"
//             />
//             <button onClick={handleCustomerSearch}>Search</button>
//             {suggestedCustomers.length > 0 && (
//               <ul className="suggestions-list">
//                 {suggestedCustomers.map((customer) => (
//                   <li
//                     key={customer.customerId}
//                     onClick={() => handleCustomerSelect(customer)}
//                     className="suggestion-item"
//                   >
//                     {customer.customerName}
//                   </li>
//                 ))}
//               </ul>
//             )}

//             {!customerData.customerName && (
//               <button onClick={handleAddCustomer} className="add-customer-btn">
//                 Add Customer
//               </button>
//             )}
//           </div>

//           <div className="customer-info">
//             <input type="text" placeholder="Customer Name" value={customerData.customerName} readOnly />
//             <input type="email" placeholder="Email Address" value={customerData.emailAddress} readOnly />
//             <input type="text" placeholder="Billing Address" value={customerData.billingAddress} readOnly />
//             <input type="text" placeholder="Shipping Address" value={customerData.shippingAddress} readOnly />
//             <input type="text" placeholder="Phone Number" value={customerData.phoneNumber} readOnly />
//           </div>

//           <table className="cart-table">
//             <thead>
//               <tr>
//                 <th>No</th>
//                 <th>SKU</th>
//                 <th>Product Name</th>
//                 <th>Category</th>
//                 <th>Rate (INR)</th>
//                 <th>Quantity</th>
//                 <th>Discount (%)</th>
//                 <th>Tax</th>
//                 <th>Total</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {ShoppingCart.map((item, index) => (
//                 <tr key={item.sku}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <img src={item.image} alt={item.sku} className="cart-item-image" />
//                     <p>{item.sku}</p>
//                   </td>
//                   <td>{item.name}</td>
//                   <td>{item.category}</td>
//                   <td>Rs {item.rate}</td>
//                   <td>{item.quantity}</td>
//                   <td>
//                     <input
//                       type="text"
//                       max={100}
//                       min={0}
//                       value={discountPercent}
//                       defaultValue={0}
//                       placeholder="Discount %"
//                     />
//                   </td>
//                   <td>Rs {(item.rate * item.quantity * 0.18).toFixed(2)}</td>
//                   <td>Rs {(item.rate * item.quantity + (item.rate * item.quantity * 0.18)).toFixed(2)}</td>
//                   <td>
//                     <button className="delete-btn" onClick={() => handleDeleteItem(item.sku)}>
//                       <FaTimes className="delete-icon" />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="cart-summary">
//             <p>Total <span>Rs {subtotal}.00</span></p>
//             <p>Discount <span>Rs {discountAmount}.00</span></p>
//             <p>Tax <span>Rs {taxAmount}.00</span></p>
//             <p>Balance Due <span>Rs {grandTotal}.00</span></p>
//           </div>

//           <div className="cart-buttons">
//             <button className="download-button" onClick={handleDownload}>Download</button>
//             <Link to="createinvoice">
//               <button className="pay-button">Pay</button>
//             </Link>
//           </div>

//         </div>

//         {isModalOpen && (
//           <AddCustomerForm
//             isOpen={isModalOpen}
//             onClose={() => setIsModalOpen(false)}
//           />
//         )}
//       </div>
//     </>
//   );
// };

// export default MyCart;


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
      <div className={`my-cart-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="my-cart">
          <h1>Generate Quotation</h1>

          <div className="customer-details">
            <input
              type="text"
              placeholder="Search Customer by Name"
              value={searchTerm}
              onChange={handleSearchChange}
              className="customer-search-input"
            />
            <button onClick={handleCustomerSearch}>Search</button>
            {suggestedCustomers.length > 0 && (
              <ul className="suggestions-list">
                {suggestedCustomers.map((customer) => (
                  <li
                    key={customer.customerId}
                    onClick={() => handleCustomerSelect(customer)}
                    className="suggestion-item"
                  >
                    {customer.customerName}
                  </li>
                ))}
              </ul>
            )}

            {!customerData.customerName && (
              <button onClick={handleAddCustomer} className="add-customer-btn">
                Add Customer
              </button>
            )}
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
                <th>Discount (%)</th>
                <th>Tax</th>
                <th>Total</th>
                <th>Actions</th>
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
                  <td>
                    <input
                      type="text"
                      max={100}
                      onChange={(e) => handleDiscountChange(e, item.sku)}
                      placeholder="Discount %"
                    />
                  </td>
                  <td>Rs {(item.rate * item.quantity * 0.18).toFixed(2)}</td>
                  <td>Rs {calculateProductTotal(item).toFixed(2)}</td>
                  <td>
                    <button className="delete-btn" onClick={() => handleDeleteItem(item.sku)}>
                      <FaTimes className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <p>Total <span>Rs {subtotal}.00</span></p>
            <p>Discount <span>Rs {discountAmount}.00</span></p>
            <p>Tax <span>Rs {taxAmount}.00</span></p>
            <p>Balance Due <span>Rs {grandTotal}.00</span></p>
          </div>

          <div className="cart-buttons">
            <button className="download-button" onClick={handleDownload}>Download</button>
            <Link to="createinvoice">
              <button className="pay-button">Pay</button>
            </Link>
          </div>

        </div>

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
