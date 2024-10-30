
// // Payment.jsx// Payment.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Nav from '../components/Nav'; // ตรวจสอบให้แน่ใจว่า path ถูกต้อง
// import qrImage from '../images/qr.jpg';
// import '../styles/Payment.css'; // นำเข้าไฟล์ CSS ถ้ามี
// import { ACCESS_TOKEN } from '../constants';

// function Payment() {
//     const location = useLocation();
//     const navigate = useNavigate();
//     const [slip, setSlip] = useState(null);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [error, setError] = useState(null);
//     const username = localStorage.getItem('username'); // ดึงข้อมูล username จาก localStorage

//     // ตรวจสอบและตั้งค่าข้อมูลสินค้าที่จะซื้อ
//     const [cartItems, setCartItems] = useState([]);
//     const [total, setTotal] = useState(0);

//     useEffect(() => {
//         if (location.state && location.state.cartItems && location.state.total) {
//             setCartItems(location.state.cartItems);
//             setTotal(location.state.total);
//         } else {
//             // หากไม่มีข้อมูลที่ถูกส่งมา ให้ดึงข้อมูลตะกร้าจาก API
//             const fetchCart = async () => {
//                 try {
//                     const token = localStorage.getItem('access_token') || localStorage.getItem(ACCESS_TOKEN);
//                     const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         }
//                     });
//                     setCartItems(response.data.items);
//                     setTotal(response.data.items.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0).toFixed(2));
//                 } catch (err) {
//                     console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
//                     navigate('/cart');
//                 }
//             };
//             fetchCart();
//         }
//     }, [location.state, navigate]);

//     const handleSlipChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             setSlip(e.target.files[0]);
//         }
//     };

//     const handleConfirmPurchase = async () => {
//         if (!slip) {
//             alert('กรุณาอัปโหลดสลิปการชำระเงินก่อนทำการยืนยัน');
//             return;
//         }

//         setIsSubmitting(true);
//         setError(null);

//         const formData = new FormData();
//         formData.append('slip', slip);
//         formData.append('payment_method', 'Bank Transfer'); // คุณสามารถให้ผู้ใช้เลือกวิธีการชำระเงินได้

//         try {
//             const token = localStorage.getItem('access_token') || localStorage.getItem(ACCESS_TOKEN);
//             const response = await axios.post('http://127.0.0.1:8000/myapp/confirm-purchase/', formData, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
                    
//                 }
//             });

//             alert('การซื้อสินค้าเสร็จสมบูรณ์!');
//             navigate('/homes'); // เปลี่ยนเส้นทางไปยังหน้าที่ต้องการ
//         } catch (err) {
//             console.error("เกิดข้อผิดพลาดในการยืนยันการซื้อ:", err);
//             setError('เกิดข้อผิดพลาดในการยืนยันการซื้อ กรุณาลองใหม่อีกครั้ง');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <div>
//             <Nav username={username} /> {/* เพิ่ม Navbar */}
//             <div className="payment-container">
//                 <h1>การชำระเงิน</h1>

//                 <div className="order-items">
//                     <h2>รายการสินค้าที่ซื้อ</h2>
//                     {cartItems.length === 0 ? (
//                         <p>ไม่มีสินค้าที่จะซื้อ</p>
//                     ) : (
//                         <div>
//                             {cartItems.map((item) => (
//                                 <div key={item.id} className="cart-item">
//                                     {item.product.images.length > 0 && (
//                                         <img src={`http://127.0.0.1:8000${item.product.images[0].image}`} alt={item.product.name} className="cart-item-image" />
//                                     )}
//                                     <div className="cart-item-details">
//                                         <h2 className="cart-item-name">{item.product.name}</h2>
//                                         <p>{item.product.description}</p>
//                                         <p>ไซส์: {item.sizes ? item.sizes.name : 'ไม่ได้เลือกไซส์'}</p>
//                                         <p>ราคา: ${item.product.price}</p>
//                                         <p>จำนวน: {item.quantity}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div className="cart-total">
//                                 <h2>ราคารวม: ${total}</h2>
//                             </div>
//                         </div>
//                     )}
//                 </div>

//                 <div className="qr-code-section">
//                     <h2>สแกน QR Code เพื่อชำระเงิน</h2>
//                     <img src={qrImage} alt="QR Code" className="qr-code-image" />
//                 </div>

//                 <div className="upload-slip-section">
//                     <h2>อัปโหลดสลิปการชำระเงิน</h2>
//                     <input
//                         type="file"
//                         accept="image/*,application/pdf"
//                         onChange={handleSlipChange}
//                     />
//                     {slip && (
//                         <div className="slip-preview">
//                             <p>สลิปที่อัปโหลด: {slip.name}</p>
//                             {slip.type.startsWith('image/') && (
//                                 <img
//                                     src={URL.createObjectURL(slip)}
//                                     alt="Slip Preview"
//                                     className="slip-preview-image"
//                                 />
//                             )}
//                         </div>
//                     )}
//                 </div>

//                 {error && <p className="error-message">{error}</p>}

//                 <button
//                     onClick={handleConfirmPurchase}
//                     className="confirm-purchase-btn"
//                     disabled={!slip || isSubmitting}
//                 >
//                     {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันการซื้อ'}
//                 </button>
//             </div>
//         </div>
//     );
// }

// export default Payment;



// payment.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import qrImage from '../images/qr.jpg';
import '../styles/Payment.css';
import { ACCESS_TOKEN } from '../constants';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [slip, setSlip] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    // ตรวจสอบและตั้งค่าข้อมูลสินค้าที่จะซื้อ
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (location.state && location.state.cartItems && location.state.total) {
            setCartItems(location.state.cartItems);
            setTotal(location.state.total);
        } else if (location.state && location.state.item) {
            const singleItem = location.state.item;
            setCartItems([singleItem]);
            setTotal((parseFloat(singleItem.price) * singleItem.quantity).toFixed(2));
        } else {
            // หากไม่มีข้อมูลที่ถูกส่งมา ให้ดึงข้อมูลตะกร้าจาก API
            const fetchCart = async () => {
                try {
                    const token = localStorage.getItem(ACCESS_TOKEN);
                    const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        }
                    });
                    setCartItems(response.data.items);
                    setTotal(response.data.items.reduce((acc, item) => acc + parseFloat(item.product.price) * item.quantity, 0).toFixed(2));
                } catch (err) {
                    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
                    navigate('/cart');
                }
            };
            fetchCart();
        }
    }, [location.state, navigate]);

    const handleSlipChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSlip(e.target.files[0]);
        }
    };

    const handleConfirmPurchase = async () => {
        if (!slip) {
            alert('กรุณาอัปโหลดสลิปการชำระเงินก่อนทำการยืนยัน');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append('slip', slip);
        formData.append('payment_method', 'Bank Transfer');

        // เพิ่มข้อมูลสินค้าที่จะซื้อ
        formData.append('items', JSON.stringify(cartItems.map(item => {
            if (item.product) {
                // กรณีมาจากตะกร้า
                return {
                    product_id: item.product.id,
                    quantity: item.quantity,
                    size_id: item.sizes ? item.sizes.id : null
                };
            } else {
                // กรณีซื้อสินค้าชิ้นเดียว
                return {
                    product_id: item.id,
                    quantity: item.quantity,
                    size_id: item.size ? item.size.id : null
                };
            }
        })));

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const response = await axios.post('http://127.0.0.1:8000/myapp/confirm-purchase/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            alert('การซื้อสินค้าเสร็จสมบูรณ์!');
            navigate('/homes');
        } catch (err) {
            console.error("เกิดข้อผิดพลาดในการยืนยันการซื้อ:", err);
            setError('เกิดข้อผิดพลาดในการยืนยันการซื้อ กรุณาลองใหม่อีกครั้ง');
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = item.product || item;
            return total + parseFloat(product.price) * item.quantity;
        }, 0).toFixed(2);
    };

    return (
        <div>
            <Nav username={username} />
            <div className="payment-container">
                <h1>การชำระเงิน</h1>

                <div className="order-items">
                    <h2>รายการสินค้าที่ซื้อ</h2>
                    {cartItems.length === 0 ? (
                        <p>ไม่มีสินค้าที่จะซื้อ</p>
                    ) : (
                        <div>
                            {cartItems.map((item) => {
                                const product = item.product || item;
                                const size = item.sizes || item.size;
                                return (
                                    <div key={product.id} className="cart-item">
                                        {product.images && product.images.length > 0 && (
                                            <img src={product.images[0].image} alt={product.name} className="cart-item-image" />
                                        )}
                                        <div className="cart-item-details">
                                            <h2 className="cart-item-name">{product.name}</h2>
                                            <p>{product.description}</p>
                                            <p>ไซส์: {size ? size.name : 'ไม่ได้เลือกไซส์'}</p>
                                            <p>ราคา: ${product.price}</p>
                                            <p>จำนวน: {item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="cart-total">
                                <h2>ราคารวม: ${calculateTotal()}</h2>
                            </div>
                        </div>
                    )}
                </div>

                <div className="qr-code-section">
                    <h2>สแกน QR Code เพื่อชำระเงิน</h2>
                    <img src={qrImage} alt="QR Code" className="qr-code-image" />
                </div>

                <div className="upload-slip-section">
                    <h2>อัปโหลดสลิปการชำระเงิน</h2>
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleSlipChange}
                    />
                    {slip && (
                        <div className="slip-preview">
                            <p>สลิปที่อัปโหลด: {slip.name}</p>
                            {slip.type.startsWith('image/') && (
                                <img
                                    src={URL.createObjectURL(slip)}
                                    alt="Slip Preview"
                                    className="slip-preview-image"
                                />
                            )}
                        </div>
                    )}
                </div>

                {error && <p className="error-message">{error}</p>}

                <button
                    onClick={handleConfirmPurchase}
                    className="confirm-purchase-btn"
                    disabled={!slip || isSubmitting}
                >
                    {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันการซื้อ'}
                </button>
            </div>
        </div>
    );
}

export default Payment;
