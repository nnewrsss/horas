import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import qrImage from '../images/qr.png';
import '../styles/Payment.css';
import { ACCESS_TOKEN } from '../constants';
import api from '../api';

function Payment() {
    const location = useLocation();
    const navigate = useNavigate();
    const [slip, setSlip] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    // State for user information
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        email: ''
    });

    // State for cart items and total
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        // Fetch user information
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                const response = await api.get('/myapp/user-info/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log("User Data Fetched:", response.data); 
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user info:", error);
            }
        };
        fetchUserInfo();

        // Set cart data from location or API
        if (location.state && location.state.cartItems && location.state.total) {
            setCartItems(location.state.cartItems);
            setTotal(location.state.total);
        } else if (location.state && location.state.item) {
            const singleItem = location.state.item;
            setCartItems([singleItem]);
            setTotal((parseFloat(singleItem.price) * singleItem.quantity).toFixed(2));
        } else {
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
                    console.error("Error fetching cart:", err);
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

        formData.append('items', JSON.stringify(cartItems.map(item => {
            if (item.product) {
                return {
                    product_id: item.product.id,
                    quantity: item.quantity,
                    size_id: item.sizes ? item.sizes.id : null
                };
            } else {
                return {
                    product_id: item.id,
                    quantity: item.quantity,
                    size_id: item.size ? item.size.id : null
                };
            }
        })));

        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            await axios.post('http://127.0.0.1:8000/myapp/confirm-purchase/', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            alert('การซื้อสินค้าเสร็จสมบูรณ์!');
            navigate('/homes');
        } catch (err) {
            console.error("Error confirming purchase:", err);
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
            {/* <div className='nav-safe-area'></div> */}
            <div className='payment-section'>
                <div className='payment-items'>
                    {cartItems.length === 0 ? (
                        <p>No item in cart now</p>
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
                                            {/* <p>{product.description}</p> */}
                                            <p>Size: {size ? size.name : 'ไม่ได้เลือกไซส์'}</p>
                                            <p>Price: ${product.price}</p>
                                            <p>Total: {item.quantity}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className='payment-summarys'>
                    <h3 className='bill'>BILLING INFORMATION</h3>
                    <div className="billing-info">
                        <p>Email: {userData.email}</p>
                        <p>Address: {userData.address}</p>
                        <p>Firstname: {userData.first_name}</p>
                        <p>Lastname: {userData.last_name}</p>
                    </div>
                    <h3 className='bill'>PAYMENT</h3>
                    <div className="qr-code-section">
                        <img src={qrImage} alt="QR Code" className="qr-code-image" />
                        <div className='qr-detail'>
                            <div className='qr-promptPay'>PromptPay</div>
                            <div className='qr-name'>Name : ภาณุวิชญ์ เรืองกิจภิญโญกุล</div>
                            <div className='qr-input'>Input bill here <input
                                type="file"
                                accept="image/*,application/pdf"
                                onChange={handleSlipChange}
                            />
                                {slip && (
                                    <div className="slip-preview">
                                        <p>สลิปที่อัปโหลด: {slip.name}</p>
                                    </div>
                                )}</div>
                        </div>
                    </div>
                    {/* <h2>Upload slip image here..</h2> */}

                    <div className="cart-total">
                        <h2 className='cart-total-title'>Total {calculateTotal()} BAHT</h2>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button
                        onClick={handleConfirmPurchase}
                        className="confirm-purchase-btn"
                        disabled={!slip || isSubmitting}
                    >
                        {isSubmitting ? 'กำลังยืนยัน...' : 'Confirm'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payment;