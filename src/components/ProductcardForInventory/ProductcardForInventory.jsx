// import React, { useState } from 'react';
// import './ProductcardForInventory.css';
// import { useCart } from '../../Context/card.context';
// import ProductDetailsModal from '../ProductDetail/ProductDetal';
// import axios from 'axios';
// import AspectRatio from '@mui/joy/AspectRatio';
// import Card from '@mui/joy/Card';
// import CardContent from '@mui/joy/CardContent';
// import CardOverflow from '@mui/joy/CardOverflow';
// import Divider from '@mui/joy/Divider';
// import Typography from '@mui/joy/Typography';

// const ProductcardForInventory = ({ id,sku, name, image, rate, category, availableQty }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [showModal, setShowModal] = useState(false);
//   const { dispatch } = useCart();
//   const product = { id,sku, name, image, rate, category: category.categoryName, quantity, availableQty };
//   console.log(id)
//   const handleCardClick = () => {
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setShowModal(false);
//   };
//   const apiUrl = process.env.REACT_APP_API_URL;
//   const handleDelete = () =>{
//     axios.delete(`${apiUrl}/`)
//   }

//   return (
//     <div className='Inventory-wala-card' onClick={handleCardClick}>
//       {/* <div className="product-card" onClick={handleCardClick}>
//         <p className="product-sku">SKU - {sku}</p>
//         <img src={image} alt={name} className="product-image" />
//         <h3 className="product-name">{name}</h3>
//         <div className="product-rate">
//           {Array.from({ length: 5 }, (_, index) => (
//             <span key={index} className={index < rate ? 'star filled' : 'star'}></span>
//           ))}
//         </div>
//         <p className="product-price">RS{(rate * quantity).toFixed(2)}</p>
//         <p>{availableQty} Is in the stock</p>
//       </div> */}

//     <Card variant="outlined" sx={{ width: 370,height:300}}>
//       <CardOverflow>
//         <AspectRatio ratio="1.5">
//           <img
//             src={image}
//             loading="lazy"
//             alt={name}
//             className='product-inventory-image'
//           />
//         </AspectRatio>
//       </CardOverflow>
//       <CardContent>
//         <Typography level="title-md">{name}</Typography>
//         <Typography level="body-sm">SKU - {sku}</Typography>
//       </CardContent>
//       <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
//         <Divider inset="context" />
//         <CardContent orientation="horizontal">
//           <Typography
//             level="body-xs"
//             textColor="text.secondary"
//             sx={{ fontWeight: 'md' }}
//           >
//             RS{(rate * quantity).toFixed(2)}
//           </Typography>
//           <Divider orientation="vertical" />
//           <Typography
//             level="body-xs"
//             textColor="text.secondary"
//             sx={{ fontWeight: 'md' }}
//           >
//            {availableQty} Is in the stock
//           </Typography>
//         </CardContent>
//       </CardOverflow>
//     </Card>

//       {showModal && (
//         <ProductDetailsModal
//            id={id}
//           sku={sku}
//           name={name}
//           image={image}
//           rate={rate}
//           category={category}
//           availableQty={availableQty}
//           quantity={quantity}
//           onClose={handleCloseModal}
//         />
//       )}
//     </div>
//   );
// };

// export default ProductcardForInventory;
import React, { useState } from 'react';
import './ProductcardForInventory.css';
import { useCart } from '../../Context/card.context';
import ProductDetailsModal from '../ProductDetail/ProductDetal';
import axios from 'axios';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

const ProductcardForInventory = ({ id, sku, name, image, rate, category, availableQty }) => {
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { dispatch } = useCart();

  const product = { id, sku, name, image, rate, category: category.categoryName, quantity, availableQty };

  const handleCardClick = () => {
    console.log("Clicked for open")
    setShowModal(true);
  };

  const handleCloseModal = () => {
    console.log("Clicked")
    setShowModal(false);  // Ensure the modal is closed
  };

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleDelete = () => {
    axios.delete(`${apiUrl}/${id}`);  // Assuming this would delete the product
  };

  return (
    <div className='Inventory-wala-card' >
      <Card variant="outlined" sx={{ width: 200, height: 200 }} onClick={handleCardClick}>
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
          <CardContent orientation="horizontal" variant="soft" sx={{ bgcolor: 'background.level1' }}>
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: 'md' }}
            >
              RS{(rate * quantity).toFixed(2)}
            </Typography>
            <Divider orientation="vertical" />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: 'md' }}
            >
              Qty : {availableQty} 
            </Typography>
          </CardContent>
        </CardContent>
        {/* <CardOverflow variant="soft" sx={{ bgcolor: 'background.level1' }}>
          {/* <Divider inset="context" /> 
          <CardContent orientation="horizontal">
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: 'md' }}
            >
              RS{(rate * quantity).toFixed(2)}
            </Typography>
            <Divider orientation="vertical" />
            <Typography
              level="body-xs"
              textColor="text.secondary"
              sx={{ fontWeight: 'md' }}
            >
              {availableQty} Is in the stock
            </Typography>
          </CardContent>
        </CardOverflow> */}
      </Card>

      {showModal && (
        <ProductDetailsModal
          id={id}
          sku={sku}
          name={name}
          image={image}
          rate={rate}
          category={category}
          availableQty={availableQty}
          quantity={quantity}
          onClose={handleCloseModal}  // Pass the close function here
        />
      )}
    </div>
  );
};

export default ProductcardForInventory;
