import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Nav from '../components/Nav';
import '../styles/AboutUs.css';

function AboutUs() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const username = localStorage.getItem('username'); // ดึง username จาก localStorage

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
    <html>
      <link href="https://fonts.googleapis.com/css2?family=Baskervville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"></link>
      <head></head>
      <body>
        <Nav username={username} /> {/* ส่งค่า username ไปยัง Nav */}
        <div className="container">
          <div className="left-container">
            <div className="image">
              <img src="src/images/1-aboutus.png" alt="" />
            </div>
          </div>
          <div className="right-container">
            <img src="src/images/logo-aboutus.png" className="aboutus" alt="" />
            <div className="content-section">
              <div className="column">
                <p>Horas is a classic and timeless clothing brand designed for those who seek elegance and versatility...</p>
              </div>
              <div className="column">
                <p>The name "Horas" is derived from Greek, representing the concept of time...</p>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

export default AboutUs;
