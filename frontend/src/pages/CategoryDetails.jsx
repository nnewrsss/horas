// CategoryDetails.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav.jsx'; // เพิ่มการนำเข้า Nav
import { ACCESS_TOKEN } from '../constants.js'; // เพิ่มการนำเข้าค่า token
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate สำหรับการเปลี่ยนหน้า

function CategoryDetails() {
    const { subcategoryType } = useParams(); // รับประเภทของหมวดหมู่ย่อยจาก URL
    const [products, setProducts] = useState([]); // เก็บข้อมูลสินค้าที่ดึงจาก API
    const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // ข้อผิดพลาดถ้ามี
    const username = localStorage.getItem('username'); // ดึงข้อมูล username จาก localStorage
    const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนหน้า

    // ตรวจสอบ token และเปลี่ยนหน้าไปยังหน้า login ถ้าไม่มี token
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/'; // ถ้าไม่มี token ให้เปลี่ยนเส้นทางไปหน้า login
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/myapp/${subcategoryType}/`);
                setProducts(response.data); // ตั้งค่าข้อมูลสินค้าที่ดึงมา
                setLoading(false); // หยุดสถานะการโหลด
            } catch (err) {
                setError('Error fetching products.'); // แสดงข้อความข้อผิดพลาด
                setLoading(false); // หยุดสถานะการโหลด
            }
        };

        fetchProducts(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ component mount
    }, [subcategoryType]); // ทำงานใหม่ทุกครั้งเมื่อ subcategoryType เปลี่ยน

    if (loading) {
        return <p>Loading...</p>; // แสดงข้อความ Loading ขณะที่ข้อมูลกำลังถูกโหลด
    }

    if (error) {
        return <p>{error}</p>; // แสดงข้อความข้อผิดพลาดถ้ามี
    }

    return (
        <div>
            {/* แสดง Nav พร้อมกับ username */}
            <Nav username={username} /> 

            <div className='product-details-container'>
                <h1>Products in {subcategoryType}</h1>
                <div className='products-grid'>
                    {products.map(product => (
                        <div key={product.id} className='product-card'>
                            {product.images && product.images.length > 0 && (
                                <img
                                    src={`http://127.0.0.1:8000${product.images[0].image}`} 
                                    alt={product.name}
                                    className='product-image'
                                />
                            )}
                            <div className='product-info'>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <button onClick={() => alert(`Adding ${product.name} to cart!`)} className='add-to-cart-button'>
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryDetails;
