import React from 'react';
import './ProductDetail.css';

const ProductDetailsModal = ({ sku, name, image, rate, category, availableQty, quantity, onClose }) => {
  return (
    <div className="product-details-modal show">
      <div className="modal-content">
        <h2>{name}</h2>
        <img src={image} alt={name} />
        <p><strong>SKU:</strong> {sku}</p>
        <p><strong>Category:</strong> {category}</p>
        <p><strong>Price:</strong> RS{(rate * quantity).toFixed(2)}</p>
        <p><strong>Available Quantity:</strong> {availableQty}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ProductDetailsModal;