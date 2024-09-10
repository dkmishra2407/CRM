import React, { useState } from 'react';
import './ProductcardForInventory.css';
import { useCart } from '../../Context/card.context';
import ProductDetailsModal from '../ProductDetail/ProductDetal';
import abc from './ABC.avif';

const ProductcardForInventory = ({ sku, name, image, rate, category, availableQty }) => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { dispatch } = useCart();
  const product = { sku, name, image, rate, category: category.categoryName, quantity, availableQty };

  const handleCardClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <div className="product-card" onClick={handleCardClick}>
        <p className="product-sku">SKU - {sku}</p>
        <img src={image} alt={name} className="product-image" />
        <h3 className="product-name">{name}</h3>
        <div className="product-rate">
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < rate ? 'star filled' : 'star'}></span>
          ))}
        </div>
        <p className="product-price">RS{(rate * quantity).toFixed(2)}</p>
        <p>{availableQty} Is in the stock</p>
      </div>

      {showModal && (
        <ProductDetailsModal
          sku={sku}
          name={name}
          image={image}
          rate={rate}
          category={category}
          availableQty={availableQty}
          quantity={quantity}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProductcardForInventory;
