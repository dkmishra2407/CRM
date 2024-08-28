import React, { useState } from 'react';
import './Mycart.css';
import { useCart } from '../../Context/card.context';
import Sidebar from '../../components/SideBar/SideBar';
import axios from 'axios';

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

  const subtotal = ShoppingCart.reduce((acc, item) => acc + item.rate * item.quantity, 0);
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
              <th>Products</th>
              <th>Description</th>
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
                <td>{item.rate}</td>
                <td>{item.quantity}</td>
                <td>{item.tax || 0}</td>
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
          <button className="download-button">Download</button>
          <button className="pay-button">Pay</button>
        </div>
      </div>
    </div>
  );
};

export default MyCart;
