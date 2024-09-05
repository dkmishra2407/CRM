import axios from "axios";
import { useEffect, useState } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Catagories.css';
import AddCatagories from '../AddCatagories/AddCatagories'; // Import your AddCatagories component

export const Categories = () => {  
  const [categoryNames, setCategoryNames] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const apiUrl = process.env.REACT_APP_API_URL;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${apiUrl}/api/categories`);
        const names = data.map(category => category.categoryName);  // Extract only the categoryName
        setCategoryNames(names);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 10,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 3,
    },
  };

  return (
    <section className="categories-container">
      <Carousel responsive={responsive} infinite={false} className="categories-carousel">
        {categoryNames && categoryNames.map((categoryName, index) => (
          <span
            key={index}
            className={`category-item ${categoryName === selectedCategory ? "category-selected" : ""}`}
            onClick={() => handleCategoryClick(categoryName)}
          >
            {categoryName}
          </span>
        ))}
      </Carousel>
      
      {/* <button onClick={handleOpenModal}>Add Categories</button> */}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AddCatagories />
            <button className="close-modal-btn" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Categories;
