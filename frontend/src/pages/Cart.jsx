import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../styles/Cart.css'; // นำเข้าไฟล์ CSS

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const username = localStorage.getItem('username'); // ดึงข้อมูล username จาก localStorage

    // ดึงข้อมูลจาก localStorage มาตั้งเป็น cartItems
    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(items);
    }, []);

    // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
    const handleRemoveItem = (index) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems.splice(index, 1); // ลบสินค้าจากรายการ
        setCartItems(updatedCartItems);
        localStorage.setItem('cart', JSON.stringify(updatedCartItems)); // อัปเดตข้อมูลใน localStorage
    };

    // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "สั่งซื้อสินค้า"
    const handleCheckout = () => {
        alert('ดำเนินการสั่งซื้อสินค้าทั้งหมดในตะกร้า');
        // คุณสามารถเพิ่มการทำงานเพิ่มเติม เช่น การไปยังหน้าชำระเงินได้ที่นี่
    };

    return (
        <div className="cart-container">
            <Nav username={username} />
            <h1 className="cart-title">ตะกร้าสินค้า</h1>

            {cartItems.length === 0 ? (
                <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
            ) : (
                <div className="cart-items-container">
                    {cartItems.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={item.images[0].image} alt={item.name} className="cart-item-image" />
                            <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.name}</h2>
                                <p>{item.description}</p>
                                <p>ไซส์: {item.size ? item.size.name : 'ไม่ได้เลือกไซส์'}</p>
                                <p>ราคา: ${item.price}</p>
                                <p>จำนวน: {item.quantity}</p> {/* แสดงจำนวนสินค้าที่เลือก */}
                            </div>
                            <div className="cart-item-actions">
                                <button onClick={() => handleRemoveItem(index)} className="remove-btn">
                                    ลบสินค้า
                                </button>
                            </div>
                        </div>
                    ))}
                    <button onClick={handleCheckout} className="checkout-btn">
                        สั่งซื้อสินค้า
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
