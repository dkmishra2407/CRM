import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetailsModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${apiUrl}/api/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product data:', error));
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Product Details</h3>
          <FaTimes className="close-icon" onClick={onClose} />
        </div>

        <div className="modal-body">
          <div className="product-images">
            <h4>Product Images</h4>
            {product.images && product.images.length > 0 ? (
              product.images.map((img, index) => (
                <img key={index} src={img.imageUrl} alt="Product" className="product-image" />
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>

          <div className="product-info">
            <h2>{product.name}</h2>
            <h4>SKU: {product.sku}</h4>
            <h4>Rate: ₹{product.rate}</h4>

            <div className="product-section">
              <h4>Site Information</h4>
              <p><strong>Site Name:</strong> {product.site.siteName}</p>
              <p><strong>Address:</strong> {product.site.siteAddress}</p>
              <p><strong>Contact:</strong> {product.site.siteContact}</p>
              <p><strong>Site Code:</strong> {product.site.siteCode}</p>
            </div>

            <div className="product-section">
              <h4>Category Information</h4>
              <p><strong>Category Name:</strong> {product.category.categoryName}</p>
              <p><strong>Description:</strong> {product.category.categoryDescription}</p>
            </div>

            <div className="product-section">
              <h4>Quantity</h4>
              <p><strong>Available Quantity:</strong> {product.productQuantity.availableQty}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;