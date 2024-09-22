import React, { useState, useEffect } from 'react';
import './Sales.css'; // CSS specific for Sales
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import SaleModal from '../../components/SaleModal/SaleModal'; // Import a Modal component for Sale details
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Sales() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null); // To store the selected Sale
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const salesPerPage = 10; // Number of sales per page
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get('http://localhost:7171/api/sales');
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch sales', err);
      setSales([]);
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
      // Make an axios DELETE request to the API to delete the sale
      await axios.delete(`${apiUrl}/api/sales/${id}`);
      
      // Remove the deleted sale from the state
      setSales(sales.filter(sale => sale.saleId !== id));
  
      // Show success message
      toast.success("Sale deleted successfully!");
    } catch (err) {
      console.error('Error deleting sale:', err);
      // Show error message
      toast.error("Failed to delete the sale. Please try again.");
    }
  };

  // Open the modal with sale details
  const openSaleModal = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setSelectedSale(null);
    setIsModalOpen(false);
  };

  // Handle the "Sale" button click inside the modal
  const handleSale = () => {
    console.log('Processing sale for:', selectedSale);
    closeModal();
  };

  // Pagination logic
  const indexOfLastSale = currentPage * salesPerPage;
  const indexOfFirstSale = indexOfLastSale - salesPerPage;

  const filteredSales = sales
    .filter(
      (sale) =>
        sale.saleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstSale, indexOfLastSale);

  const totalPages = Math.ceil(
    sales.filter(
      (sale) =>
        sale.saleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.purchaseOrderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / salesPerPage
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
          <h1 className="sales-page-title">Sales</h1>
        </div>
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by sale name or PO number"
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <div className="search-icon">
            <span className="material-icons">search</span>
          </div>
        </div>

        <table className="quotation-table">
          <thead>
            <tr>
              <th>Sale ID</th>
              <th>Sale Name</th>
              <th>Quotation Number</th>
              <th>Sale Date</th>
              <th>Due Date</th>
              <th>Purchase Order Number</th>
              <th>Currency</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.length > 0 ? (
              filteredSales.map((sale) => (
                <tr key={sale.saleId}>
                  <td onClick={() => openSaleModal(sale)}>{sale.saleId}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.saleName}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.quotation.quotationNumber}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.saleDate}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.dueDate}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.purchaseOrderNumber}</td>
                  <td onClick={() => openSaleModal(sale)}>{sale.currency}</td>
                  <td>
                    <button className="delete-btn" onClick={handleDelete(sale.saleId)}>
                      <FaTimes className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No sales found</td>
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
      
      {/* Modal for Sale Details */}
      {isModalOpen && selectedSale && (
        <SaleModal onClose={closeModal}>
          <div className="quotation-details-container">
            <div className='display-flex-2'>
              <h1>Sale Details</h1>
              <h4>Validity Period: {selectedSale.dueDate}</h4>
            </div>

            <div className="customer-info">
              <fieldset>
                <legend>Customer Information</legend>
                
                <div className='display-flex-1'>
                  <label>
                    Customer Name:
                    <input type="text" placeholder="Customer Name" value={selectedSale.quotation.customer.customerName} readOnly />
                  </label>

                  <label>
                    Email Address:
                    <input type="email" placeholder="Email Address" value={selectedSale.quotation.customer.emailAddress} readOnly />
                  </label>

                  <label>
                    Phone Number:
                    <input type="text" placeholder="Phone Number" value={selectedSale.quotation.customer.phoneNumber} readOnly />
                  </label>
                </div>

                <div className='display-flex-1'>
                  <label>
                    Shipping Address:
                    <input type="text" placeholder="Shipping Address" value={selectedSale.quotation.customer.shippingAddress} readOnly />
                  </label>

                  <label>
                    Agent Name:
                    <input type="text" placeholder="Agent Name" value={selectedSale.quotation.associate.associateName} readOnly />
                  </label>

                  <label>
                    Sale Date:
                    <input type="text" placeholder="Sale Date" value={new Date(selectedSale.saleDate).toLocaleDateString()} readOnly />
                  </label>
                </div>
              </fieldset>
            </div>

            {/* Sale Summary Table */}
            <table className="cart-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Quotation Number</th>
                  <th>Subtotal</th>
                  <th>Discount</th>
                  <th>Tax Amount</th>
                  <th>Total Amount</th>
                  <th>Discount Offer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{selectedSale.quotation.quotationNumber}</td>
                  <td>{selectedSale.quotation.subtotal}</td>
                  <td>{selectedSale.quotation.discounts || 0}</td>
                  <td>{selectedSale.quotation.taxAmount || 0}</td>
                  <td>{selectedSale.quotation.totalAmount}</td>
                  <td>{selectedSale.discountOffers || 0}</td>
                  <td>
                    <button className="delete-btn">
                      <FaTimes className="delete-icon" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Quotation Product Details Table */}
            <table className="cart-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Rate (INR)</th>
                  <th>Quantity</th>
                  <th>Tax</th>
                  <th>Discounts</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedSale.quotation.quotationItemDetails.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.product.sku}</td>
                    <td>{item.product.name}</td>
                    <td><img src={item.product.images[0].imageUrl} alt={item.product.name} width="50" /></td>
                    <td>{item.product.category.categoryName}</td>
                    <td>Rs {item.rate}</td>
                    <td>{item.qty}</td>
                    <td>Rs {item.rate * item.qty * 0.18}</td>
                    <td>{item.discount || 0}</td>
                    <td>Rs {item.rate * item.qty + (item.rate * item.qty * 0.18)}</td>
                    <td>
                      <button className="delete-btn">
                        <FaTimes className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Sale button */}
            <Link to='/invoice'>
              <button className="sale-btn" onClick={handleSale}>Process Sale</button>
            </Link>
          </div>
        </SaleModal>
      )}
    </>
  );
}

export default Sales;
