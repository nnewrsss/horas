// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Nav from '../components/Nav';
// import '../styles/Cart.css'; // นำเข้าไฟล์ CSS

// function Cart() {
//     const [cartItems, setCartItems] = useState([]);
//     const navigate = useNavigate();
//     const username = localStorage.getItem('username'); // ดึงข้อมูล username จาก localStorage

//     // ดึงข้อมูลจาก localStorage มาตั้งเป็น cartItems
//     useEffect(() => {
//         const items = JSON.parse(localStorage.getItem('cart')) || [];
//         setCartItems(items);
//     }, []);

//     // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
//     const handleRemoveItem = (index) => {
//         const updatedCartItems = [...cartItems];
//         updatedCartItems.splice(index, 1); // ลบสินค้าจากรายการ
//         setCartItems(updatedCartItems);
//         localStorage.setItem('cart', JSON.stringify(updatedCartItems)); // อัปเดตข้อมูลใน localStorage
//     };

//     // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "สั่งซื้อสินค้า"
//     const handleCheckout = () => {
//         alert('ดำเนินการสั่งซื้อสินค้าทั้งหมดในตะกร้า');
//         // คุณสามารถเพิ่มการทำงานเพิ่มเติม เช่น การไปยังหน้าชำระเงินได้ที่นี่
//     };

//     return (
//         <div className="cart-container">
//             <Nav username={username} />
//             <h1 className="cart-title">ตะกร้าสินค้า</h1>

//             {cartItems.length === 0 ? (
//                 <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
//             ) : (
//                 <div className="cart-items-container">
//                     {cartItems.map((item, index) => (
//                         <div key={index} className="cart-item">
//                             <img src={item.images[0].image} alt={item.name} className="cart-item-image" />
//                             <div className="cart-item-details">
//                                 <h2 className="cart-item-name">{item.name}</h2>
//                                 <p>{item.description}</p>
//                                 <p>ไซส์: {item.size ? item.size.name : 'ไม่ได้เลือกไซส์'}</p>
//                                 <p>ราคา: ${item.price}</p>
//                                 <p>จำนวน: {item.quantity}</p> {/* แสดงจำนวนสินค้าที่เลือก */}
//                             </div>
//                             <div className="cart-item-actions">
//                                 <button onClick={() => handleRemoveItem(index)} className="remove-btn">
//                                     ลบสินค้า
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                     <button onClick={handleCheckout} className="checkout-btn">
//                         สั่งซื้อสินค้า
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Cart;






// import React, { useEffect, useState } from 'react';
// import { ACCESS_TOKEN } from '../constants';  // ตรวจสอบเส้นทางให้ถูกต้อง
// import { useNavigate } from 'react-router-dom';
// import Nav from '../components/Nav';
// import '../styles/Cart.css'; // นำเข้าไฟล์ CSS

// function Cart() {
//     const [cartItems, setCartItems] = useState([]);
//     const navigate = useNavigate();
//     const username = localStorage.getItem('username'); // ดึงข้อมูล username จาก localStorage

//     // ดึงข้อมูลจาก localStorage มาตั้งเป็น cartItems
//     // useEffect(() => {
//     //     const items = JSON.parse(localStorage.getItem('cart')) || [];
//     //     setCartItems(items);
//     // }, []);


//     useEffect(() => {
//         const fetchCart = async () => {
//             try {
//                 const token = localStorage.getItem(ACCESS_TOKEN);
//                 const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                     }
//                 });
//                 setCart(response.data);
//             } catch (err) {
//                 console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
//             }
//         };
    
//         fetchCart();
//     }, []);
    

//     // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
//     const handleRemoveItem = (index) => {
//         const updatedCartItems = [...cartItems];
//         updatedCartItems.splice(index, 1); // ลบสินค้าจากรายการ
//         setCartItems(updatedCartItems);
//         localStorage.setItem('cart', JSON.stringify(updatedCartItems)); // อัปเดตข้อมูลใน localStorage
//     };

//     // คำนวณราคารวมของสินค้าทั้งหมด
//     const calculateTotal = () => {
//         return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
//     };

//     // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "สั่งซื้อสินค้า"
//     const handleCheckout = () => {
//         const total = calculateTotal(); // คำนวณราคารวม
//         navigate('/payment', { state: { cartItems, total } }); // ส่งข้อมูลไปยังหน้า Payment
//     };

//     return (
//         <div className="cart-container">
//             <Nav username={username} />
//             <h1 className="cart-title">ตะกร้าสินค้า</h1>

//             {cartItems.length === 0 ? (
//                 <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
//             ) : (
//                 <div className="cart-items-container">
//                     {cartItems.map((item, index) => (
//                         <div key={index} className="cart-item">
//                             <img src={item.images[0].image} alt={item.name} className="cart-item-image" />
//                             <div className="cart-item-details">
//                                 <h2 className="cart-item-name">{item.name}</h2>
//                                 <p>{item.description}</p>
//                                 <p>ไซส์: {item.size ? item.size.name : 'ไม่ได้เลือกไซส์'}</p>
//                                 <p>ราคา: ${item.price}</p>
//                                 <p>จำนวน: {item.quantity}</p>
//                             </div>
//                             <div className="cart-item-actions">
//                                 <button onClick={() => handleRemoveItem(index)} className="remove-btn">
//                                     ลบสินค้า
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                     <div className="cart-total">
//                         <h2>ราคารวม: ${calculateTotal()}</h2>
//                     </div>
//                     <button onClick={handleCheckout} className="checkout-btn">
//                         สั่งซื้อสินค้า
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Cart;


import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../styles/Cart.css';
import axios from 'axios';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]); // เก็บรายการสินค้าที่ถูกเลือก
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem(ACCESS_TOKEN);
                const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log('ข้อมูลตะกร้า:', response.data);
                setCartItems(response.data.items);
            } catch (err) {
                console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
            }
        };

        fetchCart();
    }, []);

    const handleSelectItem = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter((i) => i !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    const handleRemoveItem = async (cartItemId) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            await axios.post('http://127.0.0.1:8000/myapp/cart/remove/', {
                cart_item_id: cartItemId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setCartItems(response.data.items);
        } catch (err) {
            console.error("เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า:", err);
            alert('เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า');
        }
    };

    const calculateTotal = () => {
        return selectedItems.reduce((total, item) => total + parseFloat(item.product.price) * item.quantity, 0).toFixed(2);
    };

    const handleCheckout = () => {
        const total = calculateTotal();
        navigate('/payment', { state: { cartItems: selectedItems, total } });
    };

    return (
        <div className="cart-container">
            <Nav username={username} />
            <h1 className="cart-title">ตะกร้าสินค้า</h1>

            {cartItems.length === 0 ? (
                <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
            ) : (
                <div className="cart-items-container">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <input
                                type="checkbox"
                                checked={selectedItems.includes(item)}
                                onChange={() => handleSelectItem(item)}
                            />
                            {item.product.images.length > 0 && (
                                <img
                                    src={`http://127.0.0.1:8000${item.product.images[0].image}`}
                                    alt={item.product.name}
                                    className="cart-item-image"
                                />
                            )}
                            <div className="cart-item-details">
                                <h2 className="cart-item-name">{item.product.name}</h2>
                                <p>{item.product.description}</p>
                                <p>ไซส์: {item.sizes ? item.sizes.name : 'ไม่ได้เลือกไซส์'}</p>
                                <p>ราคา: ${item.product.price}</p>
                                <p>จำนวน: {item.quantity}</p>
                            </div>
                            <div className="cart-item-actions">
                                <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                                    ลบสินค้า
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="cart-total">
                        <h2>ราคารวม: ${calculateTotal()}</h2>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="checkout-btn"
                        disabled={selectedItems.length === 0} // ปิดการใช้งานปุ่มถ้าไม่มีสินค้าเลือก
                    >
                        สั่งซื้อสินค้า
                    </button>
                </div>
            )}
        </div>
    );
}

export default Cart;
