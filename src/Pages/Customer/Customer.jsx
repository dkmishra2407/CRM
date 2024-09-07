import React, { useState, useEffect } from 'react';
import './Customer.css';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddCustomerForm from '../../components/AddCustomer/AddCustomer';
import Header from '../../components/Header/Header';
function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10; // Number of customers per page
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
        setCustomers((prevCustomers) =>
          prevCustomers.filter((customer) => customer.customerId !== id)
        );
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
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;

  const filteredCustomers = customers
    .filter(
      (customer) =>
        (customer.customerName && customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phoneNumber && customer.phoneNumber.includes(searchTerm)) ||
        (customer.emailAddress && customer.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstCustomer, indexOfLastCustomer);

  const totalPages = Math.ceil(
    customers.filter(
      (customer) =>
        (customer.customerName && customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phoneNumber && customer.phoneNumber.includes(searchTerm)) ||
        (customer.emailAddress && customer.emailAddress.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / customersPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
    <Header className="UniversalHeader"/>
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className='heading-no-1'>
        <h1 className="customers-page-title">Customers</h1>
        <div className="customer-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Customer
        </div>
      </div>
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

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
        <button className="pagination-btn" onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

      {isModalOpen && (
        <AddCustomerForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          customerId={selectedCustomerId}
          onUpdate={updateCustomer} // Pass the update function as a prop
        />
      )}
    </div>
    </>
  );
}

export default Customer;
