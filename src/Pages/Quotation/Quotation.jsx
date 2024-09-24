import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import { useCart } from '../../Context/card.context'; // Import the useCart hook
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import QoutationModal from '../../components/QoutationModal/QoutationModal';

function Quotation() {
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null); // To store the selected quotation
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const quotationsPerPage = 10; // Number of quotations per page
  const apiUrl = process.env.REACT_APP_API_URL;

  const { dispatch } = useCart(); // Access the cart context

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quotations`);
      setQuotations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch quotations', err);
      setQuotations([]);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = (id) => async () => {
    try {
      await axios.delete(`${apiUrl}/api/quotations/${id}`);
      setQuotations(quotations.filter(quotation => quotation.quotationId !== id));
      toast.success("Quotation deleted successfully!");
    } catch (err) {
      console.error('Error deleting quotation:', err);
      toast.error("Failed to delete the quotation. Please try again.");
    }
  };

  const openQuotationModal = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedQuotation(null);
    setIsModalOpen(false);
  };

  const handleSale = () => {
    // Dispatch each product to the cart context
    selectedQuotation.quotationItemDetails.forEach((item) => {
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          sku: item.product.sku,
          name: item.product.name,
          quantity: item.qty,
          rate: item.rate,
        },
      });
    });
    closeModal();
  };

  const indexOfLastQuotation = currentPage * quotationsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;

  const filteredQuotations = quotations
    .filter(
      (quotation) =>
        quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstQuotation, indexOfLastQuotation);

  const totalPages = Math.ceil(
    quotations.filter(
      (quotation) =>
        quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quotation.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / quotationsPerPage
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
      <Header />
      <div className={`flex ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-4 w-full">
          <h1 className="text-2xl font-bold mb-4">Quotations</h1>

          <div className="flex mb-4">
            <input
              type="text"
              placeholder="Search by quotation number or customer name"
              className="p-2 border rounded w-full"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <span className="ml-2 text-gray-500 material-icons">search</span>
          </div>

          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Quotation Number</th>
                <th className="border p-2">Customer Name</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Subtotal</th>
                <th className="border p-2">Total</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((quotation) => (
                  <tr key={quotation.quotationId}>
                    <td className="border p-2 cursor-pointer" onClick={() => openQuotationModal(quotation)}>{quotation.quotationNumber}</td>
                    <td className="border p-2 cursor-pointer" onClick={() => openQuotationModal(quotation)}>{quotation.customer.customerName}</td>
                    <td className="border p-2">{quotation.quotationDate}</td>
                    <td className="border p-2">Rs {quotation.subtotal}</td>
                    <td className="border p-2">Rs {quotation.totalAmount}</td>
                    <td className="border p-2">{quotation.quotationStatus}</td>
                    <td className="border p-2">
                      <button className="text-red-500" onClick={handleDelete(quotation.quotationId)}>
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-2">No quotations found</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={previousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="px-4">Page {currentPage} of {totalPages}</span>
            <button
              className="px-4 py-2 bg-gray-200 rounded"
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && selectedQuotation && (
        <QoutationModal onClose={closeModal}>
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-2">Quotation Details</h2>
            <div className="mb-2">
              <p><strong>Validity Period:</strong> {selectedQuotation.validityPeriod}</p>
            </div>
            <div className="mb-4">
              <p><strong>Customer Name:</strong> {selectedQuotation.customer.customerName}</p>
              <p><strong>Email:</strong> {selectedQuotation.customer.emailAddress}</p>
              <p><strong>Phone:</strong> {selectedQuotation.customer.phoneNumber}</p>
            </div>
            {/* Quotation Items */}
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2">No</th>
                  <th className="border p-2">SKU</th>
                  <th className="border p-2">Product Name</th>
                  <th className="border p-2">Image</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Tax</th>
                  <th className="border p-2">Discount</th>
                  <th className="border p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedQuotation.quotationItemDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{index + 1}</td>
                    <td className="border p-2">{item.product.sku}</td>
                    <td className="border p-2">{item.product.name}</td>
                    <td className="border p-2">
                      <img src={item.product.images[0].imageUrl} alt={item.product.name} className="w-12 h-12 object-cover" />
                    </td>
                    <td className="border p-2">Rs {item.rate}</td>
                    <td className="border p-2">{item.qty}</td>
                    <td className="border p-2">Rs {item.rate * item.qty * 0.18}</td>
                    <td className="border p-2">{item.discount || 0}</td>
                    <td className="border p-2">Rs {item.rate * item.qty + (item.rate * item.qty * 0.18)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="px-4 py-2 mt-4 bg-blue-500 text-white rounded"
              onClick={handleSale}
            >
              Process Sale
            </button>
          </div>
        </QoutationModal>
      )}
    </>
  );
}

export default Quotation;
