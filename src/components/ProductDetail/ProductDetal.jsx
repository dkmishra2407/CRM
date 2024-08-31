import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetailsModal = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // Fetch the product data based on the productId
    axios.get(`http://localhost:7171/api/products/${productId}`)
      .then(response => setProduct(response.data))
      .catch(error => console.error('Error fetching product data:', error));
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Product Details</h3>
          <FaTimes className="close-icon" onClick={onClose} /> {/* Close icon */}
        </div>
        <div className="modal-body">
        <div className="product-section">
              <h4>Images</h4>
              <div className="product-images">
                {product.images.map(image => (
                  <img key={image.id} src={image.imageUrl} alt="Product" className="product-image" />
                ))}
              </div>
          <div className="product-info">
            <h4>SKU: {product.sku}</h4>
            <h2>{product.name}</h2>
            <h3><strong>Rate:</strong>{product.rate}</h3>
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
    </div>
  );
};

export default ProductDetailsModal;
