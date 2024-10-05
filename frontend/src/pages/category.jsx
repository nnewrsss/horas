// src/pages/Category.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';

function Category() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const username = localStorage.getItem('username'); // Assuming you stored the username

  useEffect(() => {
    api.get(`/myapp/products/?category=${categoryName}`)
      .then(res => {
        setProducts(res.data);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
      });
  }, [categoryName]);

  return (
    <div>
      <Navbar username={username} />
      <h1>หมวดหมู่: {categoryName}</h1>
      <div className="product-list">
        {products.length > 0 ? (
          products.map(product => (
            <div key={product.id} className="product-item">
              <h2>{product.name}</h2>
              {/* Display product details */}
            </div>
          ))
        ) : (
          <p>ไม่มีสินค้าที่จะแสดง</p>
        )}
      </div>
    </div>
  );
}

export default Category;
