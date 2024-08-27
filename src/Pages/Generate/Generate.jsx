import React, { useState, useEffect } from 'react';
import './Generate.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useCart } from '../../Context/card.context';
import { Link } from 'react-router-dom';
import AddProductForm from '../../components/AddProductForm/AddProductForm';
import Sidebar from '../../components/SideBar/SideBar';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import { ThreeDots } from 'react-loader-spinner';
import Categories from '../../components/Catagories/Catagories';

function Generate() {
  const { state: { totalQuantity }, dispatch } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialProducts, setInitialProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:7171/api/products?page=${page}&limit=15`);
      const data = response.data;

      if (data.length === 0) {
        setHasMore(false); // Stop loading if no more data
      } else {
        const products = data.map(product => ({
          name: product.name,
          sku: product.sku,
          key: product.productId,  // Ensure this is unique
          image: product.images.length > 0 ? product.images[0].imageUrl : 'https://images.unsplash.com/photo-1541471943749-e5976783f6c3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dGlsZXN8ZW58MHx8MHx8fDA%3D',
          availableQty: product.productQuantity?.availableQty || 0,
        }));

        // Use a Set to avoid duplicates
        setInitialProducts(prevProducts => {
          const productSet = new Set(prevProducts.map(p => p.key));
          const newProducts = products.filter(p => !productSet.has(p.key));
          return [...prevProducts, ...newProducts];
        });
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
      setHasMore(false); // Stop loading in case of error
    }
    setLoading(false);
  };

  const fetchMoreData = () => {
    if (!loading) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const incrementQuantity = (product) => {
    const updatedQuantity = product.availableQty + 1;
    dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, availableQty: updatedQuantity } });
  };

  const decrementQuantity = (product) => {
    if (product.availableQty > 1) {
      const updatedQuantity = product.availableQty - 1;
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, availableQty: updatedQuantity } });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: product });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProducts = initialProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <Sidebar />
      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar-container">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Customers / Invoice No / Quotation No"
              className="search-bar"
            />
            <div className="search-icon">
              <span className="material-icons gradient-text">search</span>
            </div>
          </div>

          <div className="actions">
            <button className="add-product-btn" onClick={handleOpenModal}>Add Product</button>
            <div className="cart-icon">
              <Link to="/mycart"><span className="material-icons gradient-text">shopping_cart</span></Link>
              <span className="cart-count">{totalQuantity}</span>
            </div>
          </div>
        </div>

        <div className="categories">
          <Categories />
        </div>

        <InfiniteScroll
          dataLength={filteredProducts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<div className="loader"><ThreeDots color="#00BFFF" height={80} width={80} /></div>}
          endMessage={<p style={{ textAlign: 'center' }}>No more products to display.</p>}
          className="product-container"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.key}
              sku={product.sku}
              name={product.name}
              image={product.image}
              quantity={product.availableQty}
              onIncrement={() => incrementQuantity(product)}
              onDecrement={() => decrementQuantity(product)}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </InfiniteScroll>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AddProductForm />
            <span className="material-symbols-outlined close-icon" onClick={handleCloseModal}>close</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Generate;
