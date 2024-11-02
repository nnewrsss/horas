import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Navbar from '../components/Navbar';
import '../styles/Home.css';

function Home() {
  const [products, setProducts] = useState([]);
  const username = localStorage.getItem('username'); // Assuming you stored the username

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      window.location.href = '/';
    } else {
      api.get('/myapp/products/')
        .then(res => {
          setProducts(res.data);
        })
        .catch(err => {
          console.error('Error fetching products:', err);
        });
    }
  }, []);

  return (
    <div className='section'>
      <Navbar username={username} className="bar" />
      <div className='hero-section'>
        <div className='hero-text-section'><h1 className='hero-text'>HORAS</h1></div>
        <div className='heroshadow '></div>
          <img src="/src/images/hero-section.png" alt="Hero Section" className='heroimage' />
      </div>
      <div className="home-container">
        <h1>HORAS</h1>
        <h1>bangkok2024</h1>
        <div className="product-list">
          {products.length > 0 ? (
            products.map(product => (
              <div key={product.id} className="product-item">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                {/* Display other product details */}
              </div>
            ))
          ) : (
            <p>ไม่มีสินค้าที่จะแสดง</p>
          )}
        </div>
      </div>
      
    </div>
  );
}

export default Home;
