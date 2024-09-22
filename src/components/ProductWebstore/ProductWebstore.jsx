// import React, { useState, useEffect } from 'react';
// import './ProductDetail.css';
// import axios from 'axios';

// const ProductDetailsModal = ({ id, onClose, image }) => {
//   const [productDetails, setProductDetail] = useState(null);
//   const apiUrl = process.env.REACT_APP_API_URL;

//   const fetchProductDetails = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/products/${id}`);
//       setProductDetail(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   useEffect(() => {
//     fetchProductDetails();
//   }, [id]);

//   if (!productDetails) {
//     return <div>Loading...</div>;
//   }

//   const { sku, name, rate, productQuantity, images } = productDetails;
//   const availableQty = productQuantity ? productQuantity.availableQty : 0;

//   return (
//     <div className="product-details-modal show">
//       <div className="modal-content">
//         <nav aria-label="Breadcrumb">
//           <ol className="breadcrumb-list">
//             <li className="breadcrumb-item">
//               <div className="flex items-center">
//                 <svg className="breadcrumb-icon" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
//                   <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
//                 </svg>
//               </div>
//             </li>
//             <li className="breadcrumb-item">
//               <div className="flex items-center">
//                 <svg className="breadcrumb-icon" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
//                   <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
//                 </svg>
//               </div>
//             </li>
//             <li className="breadcrumb-item">
//               <a href="#" className="breadcrumb-link">{name}</a>
//             </li>
//           </ol>
//         </nav>

//         {/* Product Section */}
//         <section className="product">
//           <div className="product__photo">
//             <div className="photo-container">
//               <div className="photo-main">
//                 <img src={image} alt={name} className="gallery-image" />
//               </div>
//               <div className="photo-album">
//                 <ul>
//                   {images.map((img, index) => (
//                     <li key={index}>
//                       <img src={img.imageUrl} alt={name} />
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Product Information */}
//           <div className="product__info">
//             <div className="title">
//               <h1>{name}</h1>
//               <span>COD: {sku}</span>
//             </div>
//             <div className="price">
//               RS <span>{rate.toFixed(2)}</span>
//             </div>

//             <div className="description">
//               <h3>Details</h3>
//               <ul>
//                 <li>Category: {productDetails.category.categoryName}</li>
//                 <li>Quantity: {availableQty}</li>
//                 <li>Description: {productDetails.category.categoryDescription}</li>
//                 <li>Available at Site: {productDetails.site.siteName}</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         <button onClick={onClose} className="close-button">
//           Close
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsModal;

// import React, { useState, useEffect } from 'react';
// import './ProductDetail.css';
// import axios from 'axios';
// import { FaTimes } from 'react-icons/fa'; // Importing the close icon

// const ProductDetailsModal = ({ id, onClose, image }) => {
//   const [productDetails, setProductDetail] = useState(null);
//   const apiUrl = process.env.REACT_APP_API_URL;
//   console.log(id)
//   const fetchProductDetails = async () => {
//     try {
//       const response = await axios.get(`${apiUrl}/api/products/${id}`);
//       setProductDetail(response.data);
//     } catch (err) {
//       console.log(err);
//     }
//   };

  
//   useEffect(() => {
//     fetchProductDetails();
//   }, [id]);

  

//   const { sku, name, rate, productQuantity, images } = productDetails;
//   const availableQty = productQuantity ? productQuantity.availableQty : 0;
//   return (
//     <div className="product-details-modal show">
//        <div className="modal-content small-modal">
//         {/*<nav aria-label="Breadcrumb">
//           <ol className="breadcrumb-list">
//             <li className="breadcrumb-item">
//               <div className="flex items-center">
//                 <svg className="breadcrumb-icon" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
//                   <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
//                 </svg>
//               </div>
//             </li>
//             <li className="breadcrumb-item">
//               <div className="flex items-center">
//                 <svg className="breadcrumb-icon" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true">
//                   <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
//                 </svg>
//               </div>
//             </li>
//             <li className="breadcrumb-item">
//               <a href="#" className="breadcrumb-link">{name}</a>
//             </li>
//           </ol>
//         </nav> */}

//         {/* Product Section */}
//         <section className="product">
//           <div className="product__photo">
//             <div className="photo-container">
//               <div className="photo-main">
//                 <img src={image} alt={name} className="gallery-image" />
//               </div>
//               <div className="photo-album">
//                 <ul>
//                   {images.map((img, index) => (
//                     <li key={index}>
//                       <img src={img.imageUrl} alt={name} />
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>

//           {/* Product Information */}
//           <div className="product__info">
//             <div className="title">
//               <h1>{name}</h1>
//               <span>COD: {sku}</span>
//             </div>
//             <div className="price">
//               RS <span>{rate.toFixed(2)}</span>
//             </div>

//             <div className="description">
//               <h3>Details</h3>
//               <ul>
//                 <li>Category: {productDetails.category.categoryName}</li>
//                 <li>Quantity: {availableQty}</li>
//                 <li>Description: {productDetails.category.categoryDescription}</li>
//                 <li>Available at Site: {productDetails.site.siteName}</li>
//               </ul>
//             </div>
            
//           </div>
//         </section>
//         <button onClick={handleAddMore}>Add More</button>
//         {/* Close Icon */}
//         <FaTimes onClick={onClose} className="close-icon" /> {/* Replace button with close icon */}
//       </div>
//     </div>
//   );
// };

// export default ProductDetailsModal;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTimes } from 'react-icons/fa';

const ProductWebstore = ({ id, onClose, image }) => {
  const [productDetails, setProductDetail] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/products/${id}`);
      setProductDetail(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddMore = async () => {
    const updatedQuantity = prompt("Enter the updated quantity");

    if (!updatedQuantity || isNaN(updatedQuantity)) {
      alert("Please enter a valid number.");
      return;
    }

    try {
      const response = await axios.patch(`${apiUrl}/api/products/${id}/quantity?quantity=${updatedQuantity}`);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  const { sku, name, rate, productQuantity, images, category, site } = productDetails;
  const availableQty = productQuantity ? productQuantity.availableQty : 0;

  return (
    <div className="product-details-modal show">
      <div className="modal-content small-modal">
        <section className="product">
          <div className="product__photo">
            <div className="photo-container">
              <div className="photo-main">
                <img src={image} alt={name} className="gallery-image" />
              </div>
              <div className="photo-album">
                <ul>
                  {images.map((img, index) => (
                    <li key={index}>
                      <img src={img.imageUrl} alt={name} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="product__info">
            <div className="title">
              <h1>{name}</h1>
              <span>COD: {sku}</span>
            </div>
            <div className="price">
              RS <span>{rate.toFixed(2)}</span>
            </div>

            <div className="description">
              <h3>Details</h3>
              <ul>
                <li><strong>Category:</strong> {category.categoryName}</li>
                <li><strong>Quantity:</strong> {availableQty}</li>
                <li><strong>Description:</strong> {category.categoryDescription}</li>
                <li><strong>Available at Site:</strong> {site.siteName}</li>
              </ul>
            </div>
          </div>
        </section>

        <button onClick={handleAddMore}>Add to Cart</button>
        <FaTimes onClick={onClose} className="close-icon" />
      </div>
    </div>
  );
};

export default ProductWebstore;

