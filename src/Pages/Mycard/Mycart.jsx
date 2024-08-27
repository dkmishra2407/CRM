import React from "react";
import { useCart } from "../../Context/card.context";
import "./Mycart.css";

const MyCart = () => {
  const { state, dispatch } = useCart();
  const { ShoppingCart, totalQuantity } = state;

  const handleIncrement = (item) => {
    const updatedQuantity = item.quantity + 1;
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { ...item, quantity: updatedQuantity },
    });
  };

  const handleDecrement = (item) => {
    const updatedQuantity = item.quantity - 1;
    if (updatedQuantity > 0) {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { ...item, quantity: updatedQuantity },
      });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: item });
    }
  };

  const handleRemove = (item) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: item });
  };

  return (
    <div className="my-cart">
      <h2>My Cart</h2>
      {ShoppingCart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-items">
          {ShoppingCart.map((item) => (
            <div key={item.sku} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <p className="cart-item-name">{item.name}</p>
                <div className="quantity-control">
                  <button
                    className="decrement"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    className="increment"
                    onClick={() => handleIncrement(item)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="remove-item"
                  onClick={() => handleRemove(item)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <p>Total Items: {totalQuantity}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCart;
