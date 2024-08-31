// import React, { useState, useEffect } from 'react';
// import './Customer.css';
// import axios from 'axios';
// import Sidebar from '../../components/SideBar/SideBar';
// import AddCustomerForm from '../../components/AddCustomer/AddCustomer';

// function Customer() {
//   const [customers, setCustomers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedCustomerId, setSelectedCustomerId] = useState(null);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await axios.get('http://localhost:7171/api/customers');
//       setCustomers(Array.isArray(response.data) ? response.data : []);
//     } catch (err) {
//       console.error('Failed to fetch customers', err);
//       setCustomers([]); 
//     }
//   };

//   const updatecustomer = async(id) =>{
//     try{
//       const response = axios.put(`http://localhost:7171/api/customers/${id}`,);
//     }
//     catch(err){
//       console.log(err);
//     }
//   }
//   const searchFetchCustomers = async (searchTerm) => {
//     if (!searchTerm.trim()) {
//       fetchCustomers();
//       return;
//     }

//     try {
//       const response = await axios.get(`http://localhost:7171/api/customers/${searchTerm}`);
//       setCustomers(Array.isArray(response.data) ? response.data : [response.data]);
//     } catch (err) {
//       console.error('Failed to fetch customers', err);
//       setCustomers([]); 
//     }    
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this customer?")) {
//       try {
//         await axios.delete(`http://localhost:7171/api/customers/${id}`);
//         setCustomers(prevCustomers => prevCustomers.filter(customer => customer.customerId !== id));
//       } catch (err) {
//         console.error('Failed to delete customer', err);
//       }
//     }
//   };

//   const handleView = (id) => {
//     setSelectedCustomerId(id);
//     setIsModalOpen(true);
//   };

//   const handleSearchKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       searchFetchCustomers(searchTerm);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedCustomerId(null);
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   return (
//     <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
//       <div className="search-bar-container">
//         <input
//           type="text"
//           placeholder="Search customer"
//           className="search-bar"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           onKeyPress={handleSearchKeyPress}
//         />
//         <div className="search-icon" onClick={() => searchFetchCustomers(searchTerm)}>
//           <span className="material-icons">search</span>
//         </div>
//         <div className="add-customer-btn" onClick={() => setIsModalOpen(true)}>
//           Add Customer
//         </div>
//       </div>

//       <table className="customer-table">
//         <thead>
//           <tr>
//             <th>Id</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Email</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {customers.length > 0 ? (
//             customers.map((customer) => (
//               <tr key={customer.customerId}>
//                 <td>{customer.customerId}</td>
//                 <td>{customer.customerName || 'N/A'}</td>
//                 <td>{customer.phoneNumber}</td>
//                 <td>{customer.emailAddress}</td>
//                 <td>
//                   <button className="action-btn view-btn" onClick={() => handleView(customer.customerId)}>Edit</button>
//                   <button className="action-btn delete-btn" onClick={() => handleDelete(customer.customerId)}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5">No Customer found</td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {isModalOpen && (
//         <AddCustomerForm
//           isOpen={isModalOpen}
//           onClose={handleCloseModal}
//           customerId={selectedCustomerId}
//         />
//       )}
//     </div>
//   );
// }

// export default Customer;


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

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:7171/api/customers');
      setCustomers(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch customers', err);
      setCustomers([]); 
    }
  };

  const updateCustomer = async (id, updatedData) => {
    try {
      const response = await axios.put(`http://localhost:7171/api/customers/${id}`, updatedData);
      setCustomers(prevCustomers => 
        prevCustomers.map(customer => 
          customer.customerId === id ? { ...customer, ...updatedData } : customer
        )
      );
      handleCloseModal(); // Close the modal after updating
    } catch (err) {
      console.error('Failed to update customer', err);
    }
  };

  const searchFetchCustomers = async (searchTerm) => {
    if (!searchTerm.trim()) {
      fetchCustomers();
      return;
    }

    try {
      const response = await axios.get(`http://localhost:7171/api/customers/${searchTerm}`);
      setCustomers(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (err) {
      console.error('Failed to fetch customers', err);
      setCustomers([]); 
    }    
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`http://localhost:7171/api/customers/${id}`);
        setCustomers(prevCustomers => prevCustomers.filter(customer => customer.customerId !== id));
      } catch (err) {
        console.error('Failed to delete customer', err);
      }
    }
  };

  const handleView = (id) => {
    setSelectedCustomerId(id);
    setIsModalOpen(true);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFetchCustomers(searchTerm);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomerId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`generate-container ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <h1 className="customers-page-title">CUSTOMERS</h1>
      <div className="customer-search-container">
        <input
          type="text"
          placeholder="Search customer"
          className="customer-search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleSearchKeyPress}
        />
        <div className="customer-search-icon" onClick={() => searchFetchCustomers(searchTerm)}>
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
          {customers.length > 0 ? (
            customers.map((customer) => (
              <tr key={customer.customerId}>
                <td>{customer.customerId}</td>
                <td>{customer.customerName || 'N/A'}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.emailAddress}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleView(customer.customerId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(customer.customerId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No Customer found</td>
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