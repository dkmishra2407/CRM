import React, { useState, useEffect } from 'react';
import './Site.css'; // CSS specific for Sites
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddSiteForm from '../../components/Addsite/Addsite'; 
import Header from '../../components/Header/Header';
// You need to create an AddSiteForm similar to AddCustomer

function Sites() {
  const [sites, setSites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 10; // Number of sites per page
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/sites`);
      setSites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch sites', err);
      setSites([]);
    }
  };

  const updateSite = async (id, updatedData) => {
    try {
      await axios.put(`${apiUrl}/api/sites/${id}`, updatedData);
      setSites((prevSites) =>
        prevSites.map((site) =>
          site.siteId === id ? { ...site, ...updatedData } : site
        )
      );
      handleCloseModal(); // Close the modal after updating
    } catch (err) {
      console.error('Failed to update site', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this site?')) {
      try {
        await axios.delete(`${apiUrl}/api/sites/${id}`);
        setSites((prevSites) => prevSites.filter((site) => site.siteId !== id));
      } catch (err) {
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Failed to delete site', err.response.status, err.response.data);
          if (err.response.status === 500) {
            alert('Failed to delete site. Please try again later. If the issue persists, please contact support.');
          } else {
            alert('Failed to delete site. Please try again later.');
          }
        } else if (err.request) {
          // The request was made but no response was received
          // `err.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.error('Failed to delete site', err.request);
          alert('Failed to delete site. Please try again later.');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Failed to delete site', err.message);
          alert('Failed to delete site. Please try again later.');
        }
      }
    }
  

  };

  const handleEdit = (id) => {
    setSelectedSiteId(id);
    setIsModalOpen(true);
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSiteId(null);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Pagination logic
  const indexOfLastSite = currentPage * sitesPerPage;
  const indexOfFirstSite = indexOfLastSite - sitesPerPage;

  const filteredSites = sites
    .filter(
      (site) =>
        (site.siteName && site.siteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (site.siteContact && site.siteContact.includes(searchTerm)) ||
        (site.siteCode && site.siteCode.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .slice(indexOfFirstSite, indexOfLastSite);

  const totalPages = Math.ceil(
    sites.filter(
      (site) =>
        (site.siteName && site.siteName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (site.siteContact && site.siteContact.includes(searchTerm)) ||
        (site.siteCode && site.siteCode.toLowerCase().includes(searchTerm.toLowerCase()))
    ).length / sitesPerPage
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
        <h1 className="sites-page-title">Sites</h1>
        <div className="site-add-btn" onClick={() => setIsModalOpen(true)}>
          Add Site
        </div>
      </div>
      <div className="site-search-container">
        <input
          type="text"
          placeholder="Search by name, contact, or code"
          className="site-search-bar"
          value={searchTerm}
          onChange={handleSearchTermChange}
        />
        <div className="site-search-icon">
          <span className="material-icons">search</span>
        </div>
      </div>
      <table className="site-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Address</th>
            <th>Contact</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSites.length > 0 ? (
            filteredSites.map((site) => (
              <tr key={site.siteId}>
                <td>{site.siteId}</td>
                <td>{site.siteName || 'N/A'}</td>
                <td>{site.siteAddress || 'N/A'}</td>
                <td>{site.siteContact || 'N/A'}</td>
                <td>{site.siteCode || 'N/A'}</td>
                <td>
                  <button className="action-btn view-btn" onClick={() => handleEdit(site.siteId)}>Edit</button>
                  <button className="action-btn delete-btn" onClick={() => handleDelete(site.siteId)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No sites found</td>
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
        <AddSiteForm
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          siteId={selectedSiteId}
          onUpdate={updateSite} // Pass the update function as a prop
        />
      )}
    </div>
    </>
  );
}

export default Sites;
