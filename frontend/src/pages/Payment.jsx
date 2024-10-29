import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import qrImage from '../images/qr.jpg'; // นำเข้ารูป QR Code
import '../styles/Payment.css'; // นำเข้า CSS สำหรับการตกแต่ง
import { ACCESS_TOKEN } from '../constants'; // นำเข้า ACCESS_TOKEN

function Payment() {
    const location = useLocation();
    const { cartItems = [], item = null, total = 0 } = location.state || {};
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // ตรวจสอบว่ามี ACCESS_TOKEN ใน localStorage หรือไม่
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            alert('กรุณาเข้าสู่ระบบก่อนทำการชำระเงิน');
            navigate('/'); // Redirect ไปยังหน้า login หากไม่มี token
        }
    }, [navigate]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            alert('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
        }
    };

    const updateStock = async (productId, quantity) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/myapp/products/${productId}/`, {
                stock: quantity
            });
            console.log(`อัปเดตสต็อกของสินค้ารหัส ${productId} สำเร็จ`);
        } catch (error) {
            console.error('เกิดข้อผิดพลาดในการอัปเดตสต็อก:', error);
        }
    };

    const handleConfirmPayment = async () => {
        if (!selectedFile) {
            alert('กรุณาอัปโหลดหลักฐานการชำระเงินก่อนทำการยืนยัน');
            return;
        }

        setLoading(true);

        if (item) {
            await updateStock(item.id, item.stock - item.quantity);
        } else {
            for (const cartItem of cartItems) {
                await updateStock(cartItem.id, cartItem.stock - cartItem.quantity);
            }
        }

        setTimeout(() => {
            alert('การชำระเงินเสร็จสมบูรณ์!');
            localStorage.removeItem('cart');
            navigate('/homes');
        }, 2000);
    };

    const renderItems = () => {
        if (item) {
            return (
                <div className="payment-item">
                    <span>{item.name}</span>
                    <span>ไซส์: {item.size ? item.size.name : 'ไม่ได้เลือกไซส์'}</span>
                    <span>จำนวน: {item.quantity}</span>
                    <span>ราคา: ${item.price}</span>
                    <span>รวม: ${item.price * item.quantity}</span>
                </div>
            );
        } else if (cartItems.length > 0) {
            return cartItems.map((cartItem, index) => (
                <div key={index} className="payment-item">
                    <span>{cartItem.name}</span>
                    <span>ไซส์: {cartItem.size ? cartItem.size.name : 'ไม่ได้เลือกไซส์'}</span>
                    <span>จำนวน: {cartItem.quantity}</span>
                    <span>ราคา: ${cartItem.price}</span>
                    <span>รวม: ${cartItem.price * cartItem.quantity}</span>
                </div>
            ));
        } else {
            return <p>ไม่มีสินค้าในตะกร้า</p>;
        }
    };

    return (
        <div className="payment-container">
            <Nav username={username} />
            <h1 className="payment-title">ยืนยันการชำระเงิน</h1>

            <div className="payment-details">
                <h2>รายการสินค้า</h2>
                <div className="payment-items">{renderItems()}</div>

                <div className="qr-code-section">
                    <h3>สแกน QR Code เพื่อชำระเงิน</h3>
                    <img src={qrImage} alt="QR Code" className="qr-code-image" />
                </div>

                <div className="upload-section">
                    <h3>อัปโหลดหลักฐานการชำระเงิน</h3>
                    <input type="file" onChange={handleFileChange} accept="image/*" />
                    {preview && (
                        <div className="preview-container">
                            <h4>ตัวอย่างหลักฐานการชำระเงิน:</h4>
                            <img src={preview} alt="Payment Proof" className="preview-image" />
                        </div>
                    )}
                </div>

                <div className="payment-summary">
                    <h2>ยอดรวมทั้งหมด: ${item ? item.price * item.quantity : total}</h2>
                    <button
                        onClick={handleConfirmPayment}
                        className="payment-btn"
                        disabled={loading}
                    >
                        {loading ? 'กำลังดำเนินการ...' : 'ยืนยันการชำระเงิน'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;
