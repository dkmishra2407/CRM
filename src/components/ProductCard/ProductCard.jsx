import React, { useState } from 'react';
import './ProductCard.css';
import { useCart } from '../../Context/card.context';

const ProductCard = ({ sku, name, image, rate, category, availableQty, onClick }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  console.log(rate)
  const product = { sku, name, image, rate, category: category.categoryName, quantity, availableQty };

  const addToCart = (e) => {
    e.stopPropagation();
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    const updatedQuantity = quantity + 1;
    setQuantity(updatedQuantity);
    dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: updatedQuantity } });
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: updatedQuantity } });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: product });
    }
  };

  return (
    <div className="product-card" onClick={onClick}>
      <p className="product-sku">SKU - {sku}</p>
      <img src={image} alt={name} className="product-image" />
      <h3 className="product-name">{name}</h3>
      <div className="product-rate">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rate ? 'star filled' : 'star'}></span>
        ))}
      </div>
      <p className="product-price">${(rate * quantity).toFixed(2)}</p>
      <div className="quantity-control">
        <button className="decrement" onClick={decrementQuantity}>-</button>
        <span className="quantity">{quantity}</span>
        <button className="increment" onClick={incrementQuantity}>+</button>
      </div>
      <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;