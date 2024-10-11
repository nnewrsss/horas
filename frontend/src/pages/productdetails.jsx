import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import { ACCESS_TOKEN } from '../constants';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');  // ดึงข้อมูล username จาก localStorage

    // ตรวจสอบว่า ACCESS_TOKEN มีใน localStorage หรือไม่ ถ้าไม่มีจะนำทางไปที่หน้า login
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/');  // ถ้าไม่มี token ให้กลับไปหน้า login
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/myapp/products/${productId}/`);
                console.log("Product Details:", response.data);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "ซื้อสินค้า"
    const handleBuyNow = () => {
        alert('คุณได้ทำการซื้อสินค้าเรียบร้อยแล้ว!');
        // คุณสามารถเพิ่มการทำงานเพิ่มเติมที่นี่ เช่น การนำไปยังหน้าชำระเงิน
    };

    // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "เพิ่มสินค้าเข้าตะกร้า"
    const handleAddToCart = () => {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];  // ดึงสินค้าที่อยู่ในตะกร้า (ถ้ามี)
        cartItems.push(product);  // เพิ่มสินค้าลงในตะกร้า
        localStorage.setItem('cart', JSON.stringify(cartItems));  // เก็บตะกร้าลงใน localStorage
        alert('เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว!');
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            {/* เพิ่ม Nav โดยส่ง username ที่ดึงจาก localStorage ไปด้วย */}
            <Nav username={username} />

            {product && (
                <div>
                    <h1>{product.name}</h1>  {/* แสดงชื่อสินค้า */}
                    <p>{product.description}</p>  {/* แสดงรายละเอียดสินค้า */}
                    <p>Price: ${product.price}</p>  {/* แสดงราคาสินค้า */}
                    <p>Stock: {product.stock}</p>  {/* แสดงจำนวนสต็อก */}

                    {/* แสดงรูปภาพสินค้า */}
                    {product.images && product.images.length > 0 && (
                        <img
                            src={product.images[0].image}
                            alt={product.name}
                            className='product-image'
                            style={{ width: '300px', height: 'auto' }}  // ปรับขนาดรูปถ้าจำเป็น
                        />
                    )}

                    {/* ปุ่มซื้อสินค้า */}
                    <button
                        onClick={handleBuyNow}
                        style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}
                    >
                        ซื้อสินค้า
                    </button>

                    {/* ปุ่มเพิ่มสินค้าลงในตะกร้า */}
                    <button
                        onClick={handleAddToCart}
                        style={{ margin: '10px', padding: '10px', backgroundColor: 'orange', color: 'white' }}
                    >
                        เพิ่มสินค้าเข้าตะกร้า
                    </button>
                </div>
            )}
        </div>
    );
}

export default ProductDetails;
