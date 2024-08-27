import { createContext, useContext, useReducer } from "react";

// Initial state for the cart
const initialValue = {
  ShoppingCart: [],   // Array to hold the products in the cart
  totalQuantity: 0,   // Total quantity of all products in the cart
};

// Reducer function to manage cart state
const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        ...state,
        ShoppingCart: [...state.ShoppingCart, action.payload],
        totalQuantity: state.totalQuantity + action.payload.quantity,
      };
    case "REMOVE_FROM_CART":
      const updatedCart = state.ShoppingCart.filter(
        item => item.sku !== action.payload.sku
      );
      const itemToRemove = state.ShoppingCart.find(
        item => item.sku === action.payload.sku
      );
      return {
        ...state,
        ShoppingCart: updatedCart,
        totalQuantity: state.totalQuantity - (itemToRemove ? itemToRemove.quantity : 0),
      };
    case "UPDATE_QUANTITY":
      const updatedCartItems = state.ShoppingCart.map(item =>
        item.sku === action.payload.sku
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      const totalQuantity = updatedCartItems.reduce((acc, item) => acc + item.quantity, 0);
      return {
        ...state,
        ShoppingCart: updatedCartItems,
        totalQuantity,
      };
    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Create provider component
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialValue);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };
