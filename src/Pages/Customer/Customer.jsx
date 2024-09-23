import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddCustomerForm from '../../components/AddCustomer/AddCustomer'; 
import Header from '../../components/Header/Header';
import { FaSearch } from 'react-icons/fa'; // Optional icon for search
import { toast } from 'react-toastify';

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10; 
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
      
      // toast.success("Details updated successfully!", {
      //   style: { backgroundColor: 'black', color: 'white' }, // Black background with white text
      // });
    
      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerId === id ? { ...customer, ...updatedData } : customer
        )
      );
      
      handleCloseModal();
    } catch (err) {
      toast.error("Failed to update customer", {
        style: { backgroundColor: 'black', color: 'white' }, // Black background with white text
      });
      console.error('Failed to update customer', err);
    }
  }

  const handleDelete = async (id,name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
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
    setCurrentPage(1); 
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      <Header className="UniversalHeader" />
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Customers</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
            >
              Add Customer
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by name, phone, or email"
              className="border p-2 rounded-lg w-64 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <FaSearch className="ml-2 text-gray-600 text-lg" />
          </div>

          {/* Customer Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.customerId} className="hover:bg-gray-100">
                      <td className="border px-4 py-2">{customer.customerId}</td>
                      <td className="border px-4 py-2">{customer.customerName || 'N/A'}</td>
                      <td className="border px-4 py-2">{customer.phoneNumber || 'N/A'}</td>
                      <td className="border px-4 py-2">{customer.emailAddress || 'N/A'}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleEdit(customer.customerId)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(customer.customerId,customer.customerName)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No customers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>

          {/* Add Customer Modal */}
          {isModalOpen && (
            <AddCustomerForm
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              customerId={selectedCustomerId}
              onUpdate={updateCustomer}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Customer;
