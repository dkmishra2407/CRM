import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import ProductCard from '../../components/ProductCard/ProductCard';
import Sidebar from '../../components/SideBar/SideBar';
import ProductDetailsModal from '../../components/ProductDetail/ProductDetal';
import Header from '../../components/Header/Header';
import { useCart } from '../../Context/card.context';
import './Generate.css'; // Ensure this matches the styling for Inventory

function Generate() {
  const { state: { totalQuantity }, dispatch } = useCart();
  const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [initialProducts, setInitialProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories`);
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/products?page=${page}&limit=15`);
      const data = response.data;

      if (data.length === 0) {
        setHasMore(false);
      } else {
        const products = data.map(product => ({
          productId: product.productId,
          name: product.name,
          sku: product.sku,
          key: product.productId,
          image: product.images.length > 0 ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1541471943749-e5976783f6c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGlsZXN8ZW58MHx8MHx8fDA%3D',
          availableQty: product.productQuantity?.availableQty || 0,
          rate: product.rate,
          category: product.category.categoryName,
          categoryId: product.category.categoryId,
        }));

        setInitialProducts(prevProducts => {
          const productSet = new Set(prevProducts.map(p => p.productId));
          const newProducts = products.filter(p => !productSet.has(p.productId));
          return [...prevProducts, ...newProducts];
        });
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setHasMore(false);
    }
    setLoading(false);
  };

  const fetchMoreData = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleOpenProductDetailsModal = (productId) => {
    setSelectedProductId(productId);
    setIsProductDetailsModalOpen(true);
  };

  const handleCloseProductDetailsModal = () => {
    setIsProductDetailsModalOpen(false);
    setSelectedProductId(null);
  };

  const handleOpenAddProductModal = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCloseAddProductModal = () => {
    setIsAddProductModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.categoryId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Header />
      <div className={`flex ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-4 w-full">
          <div className="top-bar flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Web Store</h1>
            <div className="relative inline-block">
              <Link to="/mycart"><span className="material-icons gradient-text text-2xl mr-5">shopping_cart</span></Link>
              <Link to='/mycart'><span className="cart-count absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span></Link>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex space-x-4 mb-4">
            <div className="flex-grow">
              <label className="block text-lg font-medium">Search Products:</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search Products"
                  className="p-2 border rounded w-full"
                />
                <span className="material-icons absolute top-2 right-2 text-gray-500">search</span>
              </div>
            </div>

            <div className="flex-grow">
              <label htmlFor="category-select" className="block text-lg font-medium">Filter by Category:</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border rounded p-2 w-full"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <InfiniteScroll
            dataLength={filteredProducts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            endMessage={<p className="text-center mt-4">No more products to display.</p>}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-4"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.productId}
                id={product.productId}
                sku={product.sku}
                name={product.name}
                image={product.image}
                rate={product.rate}
                category={product.category}
                availableQty={product.availableQty}
                onClick={() => handleOpenProductDetailsModal(product.productId)}
              />
            ))}
          </InfiniteScroll>
        </div>

        {/* Product Details Modal */}
        {isProductDetailsModalOpen && selectedProductId && (
          <ProductDetailsModal productId={selectedProductId} onClose={handleCloseProductDetailsModal} />
        )}

        {/* Add Product Modal */}
        {isAddProductModalOpen && (
          <AddProductForm onClose={handleCloseAddProductModal} />
        )}
      </div>
    </>
  );
}

export default Generate;
