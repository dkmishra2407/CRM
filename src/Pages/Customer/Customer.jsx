import React, { useState, useEffect } from 'react';
import './Customer.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddCustomerForm from '../../components/AddCustomer/AddCustomer';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/customers`);
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch customers', err);
      setCustomers([]);
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      await axios.put(`${apiUrl}/api/customers/${id}`, updatedData);
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerId === id ? { ...customer, ...updatedData } : customer
        )
      );
      handleCloseModal(); // Close the modal after updating
    } catch (err) {
      console.error('Failed to update customer', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`${apiUrl}/api/customers/${id}`);
        setCustomers((prevCustomers) => prevCustomers.filter((customer) => customer.customerId !== id));
      } catch (err) {
        console.error('Failed to delete customer', err);
      }
    }
  };

  const handleEdit = (id) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Filter customers based on search term with null checks
  const filteredCustomers = customers.filter((customer) =>
    (customer.customerName && customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (customer.phoneNumber && customer.phoneNumber.includes(searchTerm)) ||
    (customer.emailAddress && customer.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1 className="customers-page-title">CUSTOMERS</h1>
      <div className="customer-search-container">
        <input
          type="text"
          placeholder="Search by name, phone, or email"
          className="customer-search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="customer-search-icon">
          <span className="material-icons">search</span>
        </div>
        <div className="customer-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Customer
        </div>
      </div>
      <table className="customer-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.customerName || 'N/A'}</td>
                <td>{customer.phoneNumber || 'N/A'}</td>
                <td>{customer.emailAddress || 'N/A'}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleEdit(customer.customerId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(customer.customerId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No customers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {isModalOpen && (
        <AddCustomerForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          customerId={selectedCustomerId}
          onUpdate={updateCustomer} // Pass the update function as a prop
        />
      )}
    </div>
  );
}

export default Customer;
