// src/pages/Category.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Navbar from '../components/Navbar';
import '../styles/AboutUs.css';
 

function AboutUs() {
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
    <html>
        <head>

        </head>
        <body>
            

        </body>
    </html>
  );
}

export default AboutUs;
