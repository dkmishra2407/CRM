import React, { useState } from 'react';
import '../ProductcardForInventory/ProductcardForInventory.css';
import { useCart } from '../../Context/card.context';
import { toast } from 'react-toastify';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';
import ProductWebstore from '../ProductWebstore/ProductWebstore';

const ProductCard = ({ id, sku, name, image, rate, category, availableQty }) => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false); // Track modal visibility
  const { dispatch } = useCart();

  const product = {
    id,
    sku,
    name,
    image,
    rate,
    category,
    quantity,
    availableQty,
  };

  const addToCart = (e) => {
    e.stopPropagation();
    toast.success("Product added to cart");
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    if (quantity < availableQty) {
      const updatedQuantity = quantity + 1;
      setQuantity(updatedQuantity);
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: updatedQuantity } });
    } else {
      toast.error("Cannot exceed available quantity");
    }
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    if (quantity > 1) {
      const updatedQuantity = quantity - 1;
      setQuantity(updatedQuantity);
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: updatedQuantity } });
    } else {
      dispatch({ type: "REMOVE_FROM_CART", payload: product });
      toast.info("Product removed from cart");
    }
  };

  const handleQuantityChange = (e) => {
    const inputQuantity = Number(e.target.value);
    if (inputQuantity > 0 && inputQuantity <= availableQty) {
      setQuantity(inputQuantity);
      dispatch({ type: "UPDATE_QUANTITY", payload: { ...product, quantity: inputQuantity } });
    } else if (inputQuantity > availableQty) {
      toast.error("Quantity exceeds available stock");
    } else {
      toast.error("Quantity should be at least 1");
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className='Inventory-wala-card'>
      <Card variant="outlined" sx={{ width: 200, height: 320 }} className="centre" onClick={handleOpenModal}>
        <CardOverflow>
          <AspectRatio ratio="1.5">
            <img
              src={image}
              loading="lazy"
              alt={name}
              className='product-inventory-image'
            />
          </AspectRatio>
        </CardOverflow>
        <CardContent>
          <Typography level="title-md">{name}</Typography>
          <Typography level="body-xs" textColor="text.primary" sx={{ fontWeight: 'md' }}>
            RS {(rate * quantity).toFixed(2)}
          </Typography>
          <Divider orientation="vertical" />
          <div className="quantity-control">
            <button className="decrement" onClick={decrementQuantity}>-</button>
            <input 
              type="number" 
              value={quantity} 
              onChange={handleQuantityChange} 
              min="1" 
              max={availableQty} 
            />
            <button className="increment" onClick={incrementQuantity}>+</button>
          </div>
          <button className="add-to-cart" onClick={addToCart}>Add to Cart</button>
        </CardContent>
      </Card>

      {showModal && (
        <ProductWebstore
          id={id}
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

export default ProductCard;

