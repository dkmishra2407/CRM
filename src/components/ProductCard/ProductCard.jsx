import React, { useState } from 'react';
import './ProductCard.css';
import { useCart } from '../../Context/card.context';
import { toast } from 'react-toastify';
import abc from './ABC.avif'; // Import the default image

const ProductCard = ({ id, sku, name, image, rate, category, availableQty, onClick }) => {
  const [quantity, setQuantity] = useState(1);
  const { dispatch } = useCart();
  // Product details to be dispatched with cart actions, including the id
  const product = {
    id,        // Include the product id
    sku,
    name,
    image,
    rate,
    category,
    quantity,
    availableQty,
  };

  // Handle adding the product to the cart
  const addToCart = (e) => {
    e.stopPropagation(); 
    toast.success("Added Product");
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const incrementQuantity = (e) => {
    e.stopPropagation(); 
    const updatedQuantity = quantity + 1;
    setQuantity(updatedQuantity);
    dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: updatedQuantity } });
  };

  // Handle decrementing the product quantity
  const decrementQuantity = (e) => {
    e.stopPropagation(); // Prevent triggering the onClick event of the card
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
      <p className="product-price">RS{(rate * quantity).toFixed(2)}</p>
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
