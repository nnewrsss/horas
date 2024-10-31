import React, { useEffect, useState } from 'react';  // Import useState และ useEffect จาก React
import { useParams, useNavigate } from 'react-router-dom';  // Import useParams และ useNavigate จาก react-router-dom
import axios from 'axios';
import Nav from '../components/Nav';  // Import Nav (สมมติว่าอยู่ใน components/Nav.jsx)
import { ACCESS_TOKEN } from '../constants.js';  // Import ACCESS_TOKEN ถ้ามี

function CategoryProduct() {
    const { productId } = useParams();  // รับ productId จาก URL
    const navigate = useNavigate();  // ใช้สำหรับการนำทาง
    const username = localStorage.getItem('username');  // ดึงข้อมูล username จาก localStorage

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ตรวจสอบว่ามี access token หรือไม่ ถ้าไม่มีให้ redirect ไปหน้า login
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';  // ถ้าไม่มี token ให้ redirect ไปหน้า login
        }
    }, []);

    useEffect(() => {
        const fetchProductsByChildCategory = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/myapp/products/childcategory/${productId}/`);
                console.log("Response Data:", response.data);  // ตรวจสอบข้อมูลที่ได้รับ
                setProducts(response.data);  // ตั้งค่า products ด้วยข้อมูลที่ได้จาก API
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);  // แสดง error เพิ่มเติมในคอนโซล
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProductsByChildCategory();
    }, [productId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // ฟังก์ชันที่จะใช้สำหรับนำทางไปยังหน้ารายละเอียดสินค้า
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);  // คุณสามารถเปลี่ยน URL นี้ตามความต้องการ
    };

    return (
        <div>
            {/* เพิ่ม Nav และส่ง username ไปยัง Nav */}
            <Nav username={username} />

            <h1>Products in Child Category {productId}</h1> {/* แสดง productId */}
            <div className="product-list">
                {products.map(product => (
                    <button 
                        key={product.id} 
                        className="product-item"
                        onClick={() => handleProductClick(product.id)}  // ฟังก์ชันเมื่อกดปุ่ม
                    >
                        {product.images && product.images.length > 0 && (
                            <img
                                src={`http://127.0.0.1:8000${product.images[0].image}`}
                                alt={product.name}
                                className='product-image'
                            />
                        )}
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: {product.price}</p>
                        <p>Stock: {product.stock}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategoryProduct;