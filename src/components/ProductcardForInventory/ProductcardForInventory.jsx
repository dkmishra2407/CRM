import React, { useState } from 'react';
import './ProductcardForInventory.css';
import { useCart } from '../../Context/card.context';
import abc from './ABC.avif'
const ProductcardForInventory = ({ sku, name, image, rate, category, availableQty, onClick }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  console.log(rate)
  const product = { sku, name, image, rate, category: category.categoryName, quantity, availableQty };

  return (
    <div className="product-card" onClick={onClick}>
      <p className="product-sku">SKU - {sku}</p>
      <img src={abc} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <div className="product-rate">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rate ? 'star filled' : 'star'}></span>
        ))}
      </div>
      <p className="product-price">${(rate * quantity).toFixed(2)}</p>
      <p>{availableQty} Is in the stock</p>
    </div>
  );
};

export default ProductcardForInventory;