import React, { useState, useEffect } from 'react';
import './Quotation.css'; // CSS specific for Quotations
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import QoutationModal from '../../components/QoutationModal/QoutationModal'; // Import a Modal component for quotation details

function Quotation() {
  const [quotations, setQuotations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuotation, setSelectedQuotation] = useState(null); // To store the selected quotation
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const quotationsPerPage = 10; // Number of quotations per page
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/quotations`);
      console.log(response.data);
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

  // Open the modal with quotation details
  const openQuotationModal = (quotation) => {
    setSelectedQuotation(quotation);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedQuotation(null);
    setIsModalOpen(false);
  };

  // Handle the "Sale" button click inside the modal
  const handleSale = () => {
    // Logic to process the sale can go here
    console.log('Processing sale for quotation:', selectedQuotation);
    // Close the modal after processing
    closeModal();
  };

  // Pagination logic
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
      <Header className="UniversalHeader" />
      <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="heading-no-1">
          <h1 className="quotations-page-title">Quotations</h1>
        </div>

        <div className="quotation-search-container">
          <input
            type="text"
            placeholder="Search by quotation number or customer name"
            className="quotation-search-bar"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <div className="quotation-search-icon">
            <span className="material-icons">search</span>
          </div>
        </div>

        <table className="quotation-table">
          <thead>
            <tr>
              <th>Quotation Number</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <tr key={quotation.quotationId} onClick={() => openQuotationModal(quotation)}>
                  <td>{quotation.quotationNumber}</td>
                  <td>{quotation.customer.customerName}</td>
                  <td>{quotation.quotationDate}</td>
                  <td>Rs {quotation.subtotal}</td>
                  <td>Rs {quotation.totalAmount}</td>
                  <td>{quotation.quotationStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No quotations found</td>
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
      </div>

      {/* Modal for showing quotation details */}
      {isModalOpen && selectedQuotation && (
        <QoutationModal onClose={closeModal}>
          <h2>Quotation Details</h2>
          <p><strong>Quotation Number:</strong> {selectedQuotation.quotationNumber}</p>
          <p><strong>Customer Name:</strong> {selectedQuotation.customer.customerName}</p>
          <p><strong>Date:</strong> {selectedQuotation.quotationDate}</p>
          <p><strong>Subtotal:</strong> Rs {selectedQuotation.subtotal}</p>
          <p><strong>Total Amount:</strong> Rs {selectedQuotation.totalAmount}</p>
          <p><strong>Status:</strong> {selectedQuotation.quotationStatus}</p>

          {/* Display all items in the quotation */}
          <h3>Items:</h3>
          <ul>
            {selectedQuotation.quotationItemDetails.map((item, index) => (
              <li key={index}>
                <p><strong>Product ID:</strong> {item.product.productId}</p>
                <p><strong>Quantity:</strong> {item.qty}</p>
                <p><strong>Rate:</strong> Rs {item.rate}</p>
              </li>
            ))}
          </ul>

          {/* Sale button */}
          <button className="sale-btn" onClick={handleSale}>Sale</button>
        </QoutationModal>
      )}
    </>
  );
}

export default Quotation;
