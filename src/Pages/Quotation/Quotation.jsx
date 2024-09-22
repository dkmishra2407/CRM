// import React, { useState, useEffect } from 'react';
// import './Quotation.css'; // CSS specific for Quotations
// import axios from 'axios';
// import Sidebar from '../../components/SideBar/SideBar';
// import Header from '../../components/Header/Header';
// import QoutationModal from '../../components/QoutationModal/QoutationModal'; // Import a Modal component for quotation details
// import { Link } from 'react-router-dom';
// import { FaTimes } from 'react-icons/fa';
// import { toast } from 'react-toastify';
// function Quotation() {
//   const [quotations, setQuotations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedQuotation, setSelectedQuotation] = useState(null); // To store the selected quotation
//   const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
//   const quotationsPerPage = 10; // Number of quotations per page
//   const apiUrl = process.env.REACT_APP_API_URL;

//   useEffect(() => {
//     fetchQuotations();
//   }, []);

//   const fetchQuotations = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/quotations`);
//       setQuotations(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       console.error('Failed to fetch quotations', err);
//       setQuotations([]);
//     }
//   };

//   const handleSearchTermChange = (e) => {
//     setSearchTerm(e.target.value);
//     setCurrentPage(1); // Reset to the first page when searching
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleDelete = (id) => async () => {
//     try {
//       // Make an axios DELETE request to the API to delete the quotation
//       await axios.delete(`${apiUrl}/api/quotations/${id}`);
      
//       // Remove the deleted quotation from the state
//       setQuotations(quotations.filter(quotation => quotation.quotationId !== id));
  
//       // Show success message
//       toast.success("Quotation deleted successfully!");
//     } catch (err) {
//       console.error('Error deleting quotation:', err);
//       // Show error message
//       toast.error("Failed to delete the quotation. Please try again.");
//     }
//   };
  

//   // Open the modal with quotation details
//   const openQuotationModal = (quotation) => {
//     setSelectedQuotation(quotation);
//     setIsModalOpen(true);
//   };

//   // Close the modal
//   const closeModal = () => {
//     setSelectedQuotation(null);
//     setIsModalOpen(false);
//   };

//   // Handle the "Sale" button click inside the modal
//   const handleSale = () => {
//     console.log('Processing sale for quotation:', selectedQuotation);
//     closeModal();
//   };

//   // Pagination logic
//   const indexOfLastQuotation = currentPage * quotationsPerPage;
//   const indexOfFirstQuotation = indexOfLastQuotation - quotationsPerPage;

//   const filteredQuotations = quotations
//     .filter(
//       (quotation) =>
//         quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         quotation.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
//     )
//     .slice(indexOfFirstQuotation, indexOfLastQuotation);

//   const totalPages = Math.ceil(
//     quotations.filter(
//       (quotation) =>
//         quotation.quotationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         quotation.customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
//     ).length / quotationsPerPage
//   );

//   const nextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const previousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <>
//       <Header className="UniversalHeader" />
//       <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//         <div className="heading-no-1">
//           <h1 className="quotations-page-title">Quotations</h1>
//         </div>

//         <div className="quotation-search-container">
//           <input
//             type="text"
//             placeholder="Search by quotation number or customer name"
//             className="quotation-search-bar"
//             value={searchTerm}
//             onChange={handleSearchTermChange}
//           />
//           <div className="quotation-search-icon">
//             <span className="material-icons">search</span>
//           </div>
//         </div>

//         <table className="quotation-table">
//           <thead>
//             <tr>
//               <th>Quotation Number</th>
//               <th>Customer Name</th>
//               <th>Date</th>
//               <th>Subtotal</th>
//               <th>Total</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredQuotations.length > 0 ? (
//               filteredQuotations.map((quotation) => (
//                 <tr key={quotation.quotationId} >
//                   <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationNumber}</td>
//                   <td onClick={() => openQuotationModal(quotation)}>{quotation.customer.customerName}</td>
//                   <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationDate}</td>
//                   <td onClick={() => openQuotationModal(quotation)}>Rs {quotation.subtotal}</td>
//                   <td onClick={() => openQuotationModal(quotation)}>Rs {quotation.totalAmount}</td>
//                   <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationStatus}</td>
//                   <td>
//                     <button className="delete-btn" onClick={handleDelete(quotation.quotationId)}>
//                       <FaTimes className="delete-icon" />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="6">No quotations found</td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Pagination Controls */}
//         <div className="pagination-controls">
//           <button className="pagination-btn" onClick={previousPage} disabled={currentPage === 1}>
//             Previous
//           </button>
//           <span className="pagination-info">Page {currentPage} of {totalPages}</span>
//           <button className="pagination-btn" onClick={nextPage} disabled={currentPage === totalPages}>
//             Next
//           </button>
//         </div>
//       </div>
//       console.log(selectedQuotation)
//       {isModalOpen && selectedQuotation && (
//         <QoutationModal onClose={closeModal}>
//           <div className="quotation-details-container">
//             <div className='display-flex-2'>
//               <h1>Quotation Details</h1>
//               <h4>validityPeriod : {selectedQuotation.validityPeriod}</h4>
//             </div>
//             <div className="customer-info">
//               <fieldset>
//                 <legend>Customer Information</legend>
                
//                 <div className='display-flex-1'>
//                 <label>
//                   Customer Name:
//                   <input type="text" placeholder="Customer Name" value={selectedQuotation.customer.customerName} readOnly />
//                 </label>

//                 <label>
//                   Email Address:
//                   <input type="email" placeholder="Email Address" value={selectedQuotation.customer.emailAddress} readOnly />
//                 </label>

//                 <label>
//                   Phone Number:
//                   <input type="text" placeholder="Phone Number" value={selectedQuotation.customer.phoneNumber} readOnly />
//                 </label>
                
//                 </div>

//                 <div className='display-flex-1'>
//                 <label>
//                   Shipping Address:
//                   <input type="text" placeholder="Shipping Address" value={selectedQuotation.customer.shippingAddress} readOnly />
//                 </label>

//                 <label>
//                   Agent Name:
//                   <input type="text" placeholder="Phone Number" value={selectedQuotation.associate.associateName} readOnly />
//                 </label>

//                 <label>
//                   FollowUpDate:
//                   <input type="text" placeholder="FollowUpDate" value={selectedQuotation.followUpDate} readOnly />
//                 </label>
//                 </div>
//               </fieldset>
//             </div>
//             {/* Quotation Items Table */}
//             <table className="cart-table">
//               <thead>
//                 <tr>
//                   <th>No</th>
//                   <th>SKU</th>
//                   <th>Product Name</th>
//                   <th>Image</th>
//                   <th>Category</th>
//                   <th>Rate (INR)</th>
//                   <th>Quantity</th>
//                   <th>Tax</th>
//                   <th>Discounts</th>
//                   <th>Total</th>
//                   <th>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {selectedQuotation.quotationItemDetails.map((item, index) => (
//                   <tr key={index}>
//                     <td>{index + 1}</td>
//                     <td>{item.product.sku}</td>
//                     <td>{item.product.name}</td>
//                     <td><img src={item.product.images[0].imageUrl} alt={item.product.name} width="50" /></td>
//                     <td>{item.product.category.categoryName}</td>
//                     <td>Rs {item.rate}</td>
//                     <td>{item.qty}</td>
//                     <td>Rs {item.rate * item.qty * 0.18}</td>
//                     <td>{item.discount || 0}</td>
//                     <td>Rs {item.rate * item.qty + (item.rate * item.qty * 0.18)}</td>
//                     <td>
//                     <button className="delete-btn">
//                       <FaTimes className="delete-icon" />
//                     </button>
//                   </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Sale button */}
//             <Link to='/invoice'>
//               <button className="sale-btn" onClick={handleSale}>Sale</button>
//             </Link>
//           </div>
//         </QoutationModal>
//       )}
//     </>
//   );
// }

// export default Quotation;


import React, { useState, useEffect } from 'react';
import './Quotation.css'; // CSS specific for Quotations
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import QoutationModal from '../../components/QoutationModal/QoutationModal'; // Import a Modal component for quotation details
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useCart } from '../../Context/card.context'; // Import the useCart hook

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

    console.log('Processing sale for quotation:', selectedQuotation);
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
      <Header className="UniversalHeader" />
      <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="heading-no-1">
          <h1 className="quotations-page-title">Quotations</h1>
        </div>

        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search by quotation number or customer name"
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
              <th>Quotation Number</th>
              <th>Customer Name</th>
              <th>Date</th>
              <th>Subtotal</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotations.length > 0 ? (
              filteredQuotations.map((quotation) => (
                <tr key={quotation.quotationId} >
                  <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationNumber}</td>
                  <td onClick={() => openQuotationModal(quotation)}>{quotation.customer.customerName}</td>
                  <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationDate}</td>
                  <td onClick={() => openQuotationModal(quotation)}>Rs {quotation.subtotal}</td>
                  <td onClick={() => openQuotationModal(quotation)}>Rs {quotation.totalAmount}</td>
                  <td onClick={() => openQuotationModal(quotation)}>{quotation.quotationStatus}</td>
                  <td>
                    <button className="delete-btn" onClick={handleDelete(quotation.quotationId)}>
                      <FaTimes className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No quotations found</td>
              </tr>
            )}
          </tbody>
        </table>

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

      {isModalOpen && selectedQuotation && (
        <QoutationModal onClose={closeModal}>
          <div className="quotation-details-container">
            <div className='display-flex-2'>
              <h1>Quotation Details</h1>
              <h4>validityPeriod : {selectedQuotation.validityPeriod}</h4>
            </div>
            <div className="customer-info">
              <fieldset>
                <legend>Customer Information</legend>
                
                <div className='display-flex-1'>
                <label>
                  Customer Name:
                  <input type="text" placeholder="Customer Name" value={selectedQuotation.customer.customerName} readOnly />
                </label>

                <label>
                  Email Address:
                  <input type="email" placeholder="Email Address" value={selectedQuotation.customer.emailAddress} readOnly />
                </label>

                <label>
                  Phone Number:
                  <input type="text" placeholder="Phone Number" value={selectedQuotation.customer.phoneNumber} readOnly />
                </label>
                
                </div>

                <div className='display-flex-1'>
                <label>
                  Shipping Address:
                  <input type="text" placeholder="Shipping Address" value={selectedQuotation.customer.shippingAddress} readOnly />
                </label>

                <label>
                  Agent Name:
                  <input type="text" placeholder="Phone Number" value={selectedQuotation.associate.associateName} readOnly />
                </label>

                <label>
                  FollowUpDate:
                  <input type="text" placeholder="FollowUpDate" value={selectedQuotation.followUpDate} readOnly />
                </label>
                </div>
              </fieldset>
            </div>
            {/* Quotation Items Table */}
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
                {selectedQuotation.quotationItemDetails.map((item, index) => (
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
              <button className="sale-btn" onClick={handleSale}>Sale</button>
            </Link>
          </div>
        </QoutationModal>
      )}
    </>
  );
}

export default Quotation;
