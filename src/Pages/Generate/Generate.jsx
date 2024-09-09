import React, { useState, useEffect } from 'react';
import './Generate.css';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useCart } from '../../Context/card.context';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/SideBar/SideBar';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ProductDetailsModal from '../../components/ProductDetail/ProductDetal';
import Header from '../../components/Header/Header';

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
  const [categories, setCategories] = useState([]); // Categories state
  const [selectedCategory, setSelectedCategory] = useState(''); // Selected category state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component loads
    fetchProducts();
  }, [page]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/categories`);
      setCategories(response.data); // Store categories
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}/api/products?page=${page}&limit=15`);
      const data = response.data;
      console.log(data)
      if (data.length === 0) {
        setHasMore(false);
      } else {
        const products = data.map(product => ({
          name: product.name,
          sku: product.sku,
          key: product.productId,
          image: product.images.length > 0 ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1541471943749-e5976783f6c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGlsZXN8ZW58MHx8MHx8fDA%3D',
          availableQty: product.productQuantity?.availableQty || 0,
          rate: product.rate,
          category: product.category.categoryName,
          categoryId: product.category.categoryId, // Store category ID for filtering
        }));
      
        setInitialProducts(prevProducts => {
          const productSet = new Set(prevProducts.map(p => p.key));
          const newProducts = products.filter(p => !productSet.has(p.key));
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
    setSelectedCategory(event.target.value); // Update selected category
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
      <Header className="UniversalHeader" />
      <div className="App">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <div className={`main-content ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="top-bar">
            <h1>Web Store</h1>
            <div className="actions">
              <div className="cart-icon">
                <Link to="/mycart">
                  <span className="material-icons gradient-text">shopping_cart</span>
                  <span className="cart-count">{totalQuantity}</span>
                </Link>
              </div>
            </div>
          </div>

          <div className='search-and-filter'>
            <div className="category-dropdown-container-inventory">
              <label htmlFor="category-select">Filter by Category: </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

        <div className="search-bar-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Products"
              className="search-bar"
            />
            <div className="search-icon">
              <span className="material-icons gradient-text">search</span>
            </div>
          </div>

        </div>
          
          {/* Category Dropdown */}
      

          <InfiniteScroll
            dataLength={filteredProducts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            endMessage={<p style={{ textAlign: 'center' }}>No more products to display.</p>}
            className="product-container"
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.key}
                sku={product.sku}
                name={product.name}
                image={product.image}
                rate={product.rate}
                category={product.category.categoryName}
                availableQty={product.availableQty}
                onClick={() => handleOpenProductDetailsModal(product.key)}
              />
            ))}
          </InfiniteScroll>
        </div>

        {isProductDetailsModalOpen && selectedProductId && (
          <div className="modal-overlay" onClick={handleCloseProductDetailsModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <ProductDetailsModal productId={selectedProductId} onClose={handleCloseProductDetailsModal} />
            </div>
          </div>
        )}

        {isAddProductModalOpen && (
          <div className="modal-overlay" onClick={handleCloseAddProductModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <AddProductForm onClose={handleCloseAddProductModal} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Generate;
