import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav.jsx';
import axios from 'axios';   // Axios สำหรับดึงข้อมูลจาก backend
import '../styles/female.css';

const Female = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username'); 

  // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก backend
  const fetchFemaleProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/myapp/products/female/'); // ปรับ URL ตามการตั้งค่า backend
      console.log(response.data); // ตรวจสอบข้อมูล
      const fetchedProducts = Array.isArray(response.data) ? response.data : response.data.results;
      setProducts(fetchedProducts); 
      setLoading(false);
    } catch (err) {
      setError('Error fetching products.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFemaleProducts();
  }, []);

  return (
    <div>
       <Nav username={username} />
      <div className="female-products-container">
        <h1>Female Products</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                {product.images.length > 0 && (
                  <img 
                    src={`http://127.0.0.1:8000${product.images[0].image}`}  // ต่อ URL ของ backend เข้ากับเส้นทางภาพ
                    alt={product.name} 
                    className="product-image"  // เพิ่ม class สำหรับจัดการ CSS
                  />
                )}
                <h2 className="product-name">{product.name}</h2>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: {product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Female;
