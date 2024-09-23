import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import AddSiteForm from '../../components/Addsite/Addsite';
import Header from '../../components/Header/Header';

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
      handleCloseModal();
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
        alert('Failed to delete site. Please try again later.');
        console.error('Failed to delete site', err);
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
      <Header className="UniversalHeader" />
      <div className={`flex ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="main-content p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Sites</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Site
            </button>
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="text"
              placeholder="Search by name, contact, or code"
              className="border p-2 rounded-lg w-full"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <span className="ml-2 material-icons">search</span>
          </div>

          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Code</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <tr key={site.siteId} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">{site.siteId}</td>
                    <td className="border px-4 py-2">{site.siteName || 'N/A'}</td>
                    <td className="border px-4 py-2">{site.siteAddress || 'N/A'}</td>
                    <td className="border px-4 py-2">{site.siteContact || 'N/A'}</td>
                    <td className="border px-4 py-2">{site.siteCode || 'N/A'}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEdit(site.siteId)}
                        className="bg-yellow-400 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(site.siteId)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No sites found
                  </td>
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

          {isModalOpen && (
            <AddSiteForm
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              siteId={selectedSiteId}
              onUpdate={updateSite}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Sites;
