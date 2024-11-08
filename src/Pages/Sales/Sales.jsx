import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/SideBar/SideBar';
import Header from '../../components/Header/Header';
import SaleModal from '../../components/SaleModal/SaleModal'; 
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

function Sales() {
  const [sales, setSales] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSale, setSelectedSale] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const salesPerPage = 10;
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/sales`);
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch sales', err);
      setSales([]);
    }
  };

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleDelete = (id) => async () => {
    try {
      await axios.delete(`${apiUrl}/api/sales/${id}`);
      setSales(sales.filter((sale) => sale.saleId !== id));
      toast.success('Sale deleted successfully!');
    } catch (err) {
      console.error('Error deleting sale:', err);
      toast.error('Failed to delete the sale. Please try again.');
    }
  };

  const openSaleModal = (sale) => {
    setSelectedSale(sale);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSale(null);
    setIsModalOpen(false);
  };

  const handleSale = () => {
    console.log('Processing sale for:', selectedSale);
    closeModal();
  };

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
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Sales</h1>
          </div>

          {/* Search Bar */}
          <div className="mb-6 flex items-center">
            <input
              type="text"
              placeholder="Search by sale name or PO number"
              className="border p-2 rounded-lg w-64 text-base"
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <span className="ml-2 material-icons text-gray-600">search</span>
          </div>

          {/* Sales Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-left">
                  <th className="border px-4 py-2">Sale ID</th>
                  <th className="border px-4 py-2">Sale Name</th>
                  <th className="border px-4 py-2">Quotation Number</th>
                  <th className="border px-4 py-2">Sale Date</th>
                  <th className="border px-4 py-2">Due Date</th>
                  <th className="border px-4 py-2">Purchase Order Number</th>
                  <th className="border px-4 py-2">Currency</th>
                  <th className="border px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale) => (
                    <tr key={sale.saleId} className="hover:bg-gray-100">
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.saleId}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.saleName}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.quotation.quotationNumber}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.saleDate}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.dueDate}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.purchaseOrderNumber}</td>
                      <td onClick={() => openSaleModal(sale)} className="cursor-pointer">{sale.currency}</td>
                      <td>
                        <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" onClick={handleDelete(sale.saleId)}>
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-6">
                      No sales found
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

          {/* Sale Modal */}
          {isModalOpen && selectedSale && (
            <SaleModal onClose={closeModal} selectedSale={selectedSale} />
          )}
        </div>
      </div>
    </>
  );
}

export default Sales;
