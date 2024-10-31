// import React, { useState, useEffect } from 'react'; // เพิ่ม useEffect
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaUser } from 'react-icons/fa';
// import '../styles/Nav.css';
// import axios from 'axios';
// import { ACCESS_TOKEN } from '../constants'; // ตรวจสอบให้แน่ใจว่าไฟล์ constants มี ACCESS_TOKENช


// function Nav({ username }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [content, setContent] = useState('');
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [isCartOpen, setIsCartOpen] = useState(false);
//   const [isSummaryOpen, setIsSummaryOpen] = useState(false);
//   const navigate = useNavigate();
//   const [cartItems, setCartItems] = useState([]);

//   // ดึงข้อมูลจาก localStorage มาตั้งเป็น cartItems
//   useEffect(() => {

//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           }
//         });
//         console.log('ข้อมูลตะกร้า:', response.data);
//         setCartItems(response.data.items); // กำหนดรายการสินค้าลงใน state
//       } catch (err) {
//         console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
//       }
//     };

//     fetchCart();


//   }, [isCartOpen]); // เพิ่ม isCartOpen เป็น dependencies

//   // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
//   const handleRemoveItem = async (cartItemId) => {
//     try {
//       const token = localStorage.getItem(ACCESS_TOKEN);
//       await axios.post('http://127.0.0.1:8000/myapp/cart/remove/', {
//         cart_item_id: cartItemId
//       }, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         }
//       });
//       const response = await axios.get('http://127.0.0.1:8000/myapp/cart/', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         }
//       });
//       setCartItems(response.data.items);
//     } catch (err) {
//       console.error("เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า:", err);
//       alert('เกิดข้อผิดพลาดในการลบสินค้าออกจากตะกร้า');
//     }
//   };

//   // คำนวณยอดรวมสินค้าและราคาทั้งหมด
//   const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
//   const totalPrice = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);

//   const handleMouseEnter = (menu) => {
//     setIsHovered(true);
//     if (menu === 'men') {
//       setContent(
//         `<div class="sliding-content">
//            <div class="column">
//              <h1><span>CLOTHES</span></h1>
//              <ul>
//                <li>Shirt</li>
//                <li>Polo</li>
//                <li>Cardigan & Sweater</li>
//                <li>Jacket</li>
//                <li>Pants</li>
//              </ul>
//            </div>
//            <div class="column">
//              <h1><span>BAGS</span></h1>
//              <ul>
//                <li>Cross body bag</li>
//                <li>Bag Packing</li>
//                <li>Business Bag</li>
//                <li>Leather Bag</li>
//                <li>Small Bag</li>
//              </ul>
//            </div>
//            <div class="column images-column">
//              <div class="images-wrapper">
//                <img src="/images/navbar/male-1.jpg" alt="Image 1">
//                <img src="/images/navbar/male-2.jpg" alt="Image 2">
//              </div>
//            </div>
//          </div>`
//       );
//     } else if (menu === 'female') {
//       setContent(
//         `<div class="sliding-content">
//            <div class="column">
//              <h1><span>CLOTHES</span></h1>
//              <ul>
//                <li>Dress</li>
//                <li>Blouse</li>
//                <li>Skirt</li>
//                <li>Jacket</li>
//                <li>Pants</li>
//              </ul>
//            </div>
//            <div class="column">
//              <h1><span>BAGS</span></h1>
//              <ul>
//                <li>Tote Bag</li>
//                <li>Crossbody Bag</li>
//                <li>Clutch</li>
//                <li>Shoulder Bag</li>
//                <li>Backpack</li>
//              </ul>
//            </div>
//            <div class="column images-column">
//              <div class="images-wrapper">
//                <img src="/images/navbar/female-1.jpg" alt="Image 3">
//                <img src="/images/navbar/female-2.jpg" alt="Image 4">
//              </div>
//            </div>
//          </div>`
//       );
//     }
//   };

//   const handleMouseLeave = (event) => {
//     if (!event.currentTarget.contains(event.relatedTarget)) {
//       setIsHovered(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refresh');
//     localStorage.removeItem('username');
//     navigate('/login');
//   };

//   const handleCartClick = () => {
//     if (!isSummaryOpen && !isCartOpen) {
//       // เปิด Summary ก่อน
//       setIsSummaryOpen(true);
//       // เปิด Cart หลังจาก 300 มิลลิวินาที
//       setTimeout(() => {
//         setIsCartOpen(true);
//       }, 200);
//     } else {
//       // ปิด Cart ก่อน
//       setIsCartOpen(false);
//       // ปิด Summary หลังจาก 300 มิลลิวินาที
//       setTimeout(() => {
//         setIsSummaryOpen(false);
//       }, 200);
//     }
//   };

//   const calculateTotal = () => {
//     return cartItems.reduce((total, item) => total + parseFloat(item.product.price) * (item.quantity || 0), 0).toFixed(2);
//   };


//   const handleCheckout = () => {
//     const total = calculateTotal();
//     navigate('/payment', { state: { cartItems, total } });
//   };



//   return (
//     <>
//       <nav className={`nav ${isHovered ? 'hovered' : ''}`}>
//         <div className='hr'>
//           <Link to="/homes">
//             <img src="/images/navbar/logo-white_hr.png" alt="Logo" className="hr-lo" />
//           </Link>
//         </div>
//         <div
//           className='left'
//           onMouseLeave={handleMouseLeave}
//         >
//           <Link to="/men" onMouseEnter={() => handleMouseEnter('men')}>MALE</Link>
//           <Link to="/female" onMouseEnter={() => handleMouseEnter('female')}>FEMALE</Link>
//         </div>
//         <div className='right'>
//           <Link to="/homes">Home</Link>
//           <Link to="/aboutus">About Us</Link>
//           <Link to="/contact">Contact</Link>
//           <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
//             <FaShoppingCart size={20} />
//           </div>
//           {username ? (
//             <div
//               className="user-menu-container"
//               onMouseEnter={() => setUserMenuOpen(true)}
//               onMouseLeave={() => setUserMenuOpen(false)}
//             >
//               <div className="user-info-box">
//                 <FaUser size={20} />
//                 <div className="user-text">
//                   <span className="hello-text">Hello</span>
//                   <span className="usernames">{username}</span>
//                 </div>
//               </div>
//               {userMenuOpen && (
//                 <div className="user-menu-dropdown">
//                   <Link to="/settings">Settings</Link>
//                   <Link to="/delivery-status">Delivery Status</Link>
//                   <button onClick={handleLogout}>Logout</button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login">
//               <FaUser size={20} />
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* Sliding Block และ Backdrop */}
//       <div
//         className={`sliding-container ${isHovered ? 'active' : ''}`}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div
//           className="sliding-block"
//           onMouseEnter={() => setIsHovered(true)}
//           dangerouslySetInnerHTML={{ __html: content }}
//         ></div>
//         <div
//           className="backdrop"
//           onMouseEnter={() => setIsHovered(false)}
//         ></div>
//       </div>

//       {/* Black Blur Backdrop for Cart Sidebar */}
//       <div
//         className={`cart-backdrop ${(isSummaryOpen || isCartOpen) ? 'fade-in' : 'fade-out'}`}
//         onClick={handleCartClick}
//       ></div>

//       {/* Container for Summary and Cart */}
//       <div className={`cart-container ${isSummaryOpen ? 'open' : ''}`}>
//         {/* Cart Sidebar */}
//         <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
//           <h2>Shopping Cart</h2>
//           {cartItems.length === 0 ? (
//             <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
//           ) : (
//             <div className={`cart-container ${isSummaryOpen ? 'open' : ''}`}>
//               {/* ตรวจสอบว่า isSummaryOpen เป็นจริงหรือไม่ ถ้าเป็นจริงจะเพิ่มคลาส 'open' ให้กับ cart-container */}

//               <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
//                 {/* ตรวจสอบว่า isCartOpen เป็นจริงหรือไม่ ถ้าเป็นจริงจะเพิ่มคลาส 'open' ให้กับ cart-sidebar */}

//                 <h2>Shopping Cart</h2>

//                 {cartItems.length === 0 ? (
//                   <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
//                   /* แสดงข้อความ "ตะกร้าสินค้าของคุณว่างเปล่า" ถ้า cartItems ไม่มีสินค้าในตะกร้า */
//                 ) : (
//                   <div className="cart-items-container">
//                     {/* ถ้ามีสินค้าใน cartItems จะแสดงรายการสินค้าในตะกร้า */}

//                     {cartItems.map((item) => (
//                       <div key={item.id} className="cart-item">
//                         {item.product.images && item.product.images.length > 0 ? (
//                           <img
//                             src={`${item.product.images[0].image}`} // แก้ไข URL ให้เหมือนกับ CategoryDetails
//                             alt={item.product.name}
//                             className="cart-item-image"
//                           />
//                         ) : (
//                           <img
//                             src="/path/to/default-product-image.jpg"
//                             alt="Default Product"
//                             className="cart-item-image"
//                           />
//                         )}

//                         <div className="cart-item-details">
//                           <h2 className="cart-item-name">{item.product.name}</h2>
//                           {/* แสดงชื่อสินค้า */}

//                           <p>{item.product.description}</p>
//                           {/* แสดงรายละเอียดสินค้า */}

//                           <p>ไซส์: {item.sizes ? item.sizes.name : 'ไม่ได้เลือกไซส์'}</p>
//                           {/* แสดงไซส์ของสินค้า ถ้าไม่มีการเลือกไซส์จะแสดงข้อความ 'ไม่ได้เลือกไซส์' */}

//                           <p>ราคา: ${item.product.price}</p>
//                           {/* แสดงราคาของสินค้า */}

//                           <p>จำนวน: {item.quantity}</p>
//                           {/* แสดงจำนวนสินค้าที่เลือก */}

//                           <div className="cart-item-actions">
//                             <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
//                               x
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Summary Sidebar */}
//         <div className={`summary-sidebar ${isSummaryOpen ? 'open' : ''}`}>
//           <h2>Summary</h2>
//           <p>Total Items: {totalItems}</p>
//           <p>Total Price: ${calculateTotal()}</p>
//           <button
//             onClick={handleCheckout}
//             className="checkout-btn"
//             disabled={cartItems.length === 0} // ปิดการใช้งานปุ่มถ้าไม่มีสินค้าในตะกร้า
//           >
//             สั่งซื้อสินค้า
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default Nav;


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaShoppingCart, FaUser } from 'react-icons/fa';
// import '../styles/Nav.css';

// function Nav({ username }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [content, setContent] = useState(''); // state สำหรับเก็บข้อมูล sliding block
//   const [userMenuOpen, setUserMenuOpen] = useState(false); // State สำหรับเมนูผู้ใช้
//   const navigate = useNavigate();

//   const handleMouseEnter = (menu) => {
//     setIsHovered(true);
//     if (menu === 'men') {
//       setContent(
//         `<div class="sliding-content">
//            <div class="column">
//              <h1><span>CLOTHES</span></h1>
//              <ul>
//                <li>Shirt</li>
//                <li>Polo</li>
//                <li>Cardigan & Sweater</li>
//                <li>Jacket</li>
//                <li>Pants</li>
//              </ul>
//            </div>
//            <div class="column">
//              <h1><span>BAGS</span></h1>
//              <ul>
//                <li>Cross body bag</li>
//                <li>Bag Packing</li>
//                <li>Business Bag</li>
//                <li>Leather Bag</li>
//                <li>Small Bag</li>
//              </ul>
//            </div>
//            <div class="column images-column">
//              <div class="images-wrapper">
//                <img src="src/images/navbar/female-1.jpg" alt="Image 1">
//                <img src="src/images/navbar/female-1.jpg"" alt="Image 2">
//              </div>
//            </div>
//          </div>`
//       );
//     } else if (menu === 'female') {
//       setContent(
//         `<div class="sliding-content">
//            <div class="column">
//              <h1><span>CLOTHES</span></h1>
//              <ul>
//                <li>Dress</li>
//                <li>Blouse</li>
//                <li>Skirt</li>
//                <li>Jacket</li>
//                <li>Pants</li>
//              </ul>
//            </div>
//            <div class="column">
//              <h1><span>BAGS</span></h1>
//              <ul>
//                <li>Tote Bag</li>
//                <li>Crossbody Bag</li>
//                <li>Clutch</li>
//                <li>Shoulder Bag</li>
//                <li>Backpack</li>
//              </ul>
//            </div>
//            <div class="column images-column">
//              <div class="images-wrapper">
//                <img src="path/to/your/image3.jpg" alt="Image 3">
//                <img src="path/to/your/image4.jpg" alt="Image 4">
//              </div>
//            </div>
//          </div>`
//       );
//     }
//   };

//   const handleMouseLeave = (event) => {
//     if (!event.currentTarget.contains(event.relatedTarget)) {
//       setIsHovered(false);
//     }
//   };

//   const handleBackdropMouseEnter = () => {
//     setIsHovered(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('access');
//     localStorage.removeItem('refresh');
//     localStorage.removeItem('username');
//     navigate('/Login');
//   };

//   return (
//     <>
//       <nav className={`nav ${isHovered ? 'hovered' : ''}`}>
//         <div className='hr'>
//           <Link to="/">
//             <img src="src/images/navbar/logo-white_hr.png" alt="Logo" className="hr-lo" />
//           </Link>
//         </div>
//         <div
//           className='left'
//           onMouseLeave={handleMouseLeave}
//         >
//           <Link to="/men" onMouseEnter={() => handleMouseEnter('men')}>MEN</Link>
//           <Link to="/female" onMouseEnter={() => handleMouseEnter('female')}>FEMALE</Link>
//         </div>
//         <div className='right'>
//           <Link to="/">Home</Link>
//           <Link to="/aboutus">About Us</Link>
//           <Link to="/contact">Contact</Link>
//           <Link to="/cart">
//             <FaShoppingCart size={20} />
//           </Link>
//           {username ? (
//             <div
//               className="user-menu-container"
//               onMouseEnter={() => setUserMenuOpen(true)}
//               onMouseLeave={() => setUserMenuOpen(false)}
//             >
//               <div className="user-info-box">
//                 <FaUser size={20} />
//                 <div className="user-text">
//                   <span className="hello-text">Hello</span>
//                   <span className="username">{username}</span>
//                 </div>
//               </div>
//               {userMenuOpen && (
//                 <div className="user-menu-dropdown">
//                   <Link to="/settings">Settings</Link>
//                   <Link to="/delivery-status">Delivery Status</Link>
//                   <button onClick={handleLogout}>Logout</button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <Link to="/login">
//               <FaUser size={20} />
//             </Link>
//           )}
//         </div>
//       </nav>

//       {/* Sliding Block และ Backdrop */}
//       <div
//         className={`sliding-container ${isHovered ? 'active' : ''}`}
//         onMouseLeave={handleMouseLeave}
//       >
//         <div
//           className="sliding-block"
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           dangerouslySetInnerHTML={{ __html: content }} // แสดงข้อมูลที่เปลี่ยนได้ใน sliding block
//         ></div>
//         <div
//           className="backdrop"
//           onMouseEnter={handleBackdropMouseEnter}
//         ></div>
//       </div>
//     </>
//   );
// }

// export default Nav;







































import React, { useState, useEffect } from 'react'; // เพิ่ม useEffect
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Nav.css';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants'; // ตรวจสอบให้แน่ใจว่าไฟล์ constants มี ACCESS_TOKENช


function Nav({ username }) {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // ดึงข้อมูลจาก localStorage มาตั้งเป็น cartItems
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
        setCartItems(response.data.items); // กำหนดรายการสินค้าลงใน state
      } catch (err) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลตะกร้า:", err);
      }
    };

    fetchCart();


  }, [isCartOpen]); // เพิ่ม isCartOpen เป็น dependencies

  // ฟังก์ชันสำหรับลบสินค้าออกจากตะกร้า
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

  // คำนวณยอดรวมสินค้าและราคาทั้งหมด
  const totalItems = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 0)), 0);

  
  const handleMouseEnter = (menu) => {
    setIsHovered(true);
    if (menu === 'men') {
      setContent(
        `<div class="sliding-content">
           <div class="column">
             <h1><span>CLOTHES</span></h1>
             <ul>
                <li onclick="window.location.href='/categoryproduct/19'">Shirt</li>
              <li onclick="window.location.href='/categoryproduct/20'">Polo</li>
              <li onclick="window.location.href='/categoryproduct/21'">Cardigan & Sweater</li>
              <li onclick="window.location.href='/categoryproduct/22'">Jacket</li>
               <li onclick="window.location.href='/categorydetails/malebottomsubcategories'">Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1><span>BAGS</span></h1>
             <ul>
               <li onclick="window.location.href='/categoryproduct/51'">Cross body bag</li>
               <li onclick="window.location.href='/categoryproduct/49'">Bag Packing</li>
               <li>Business Bag</li>
               <li>Leather Bag</li>
               <li>Small Bag</li>
             </ul>
           </div>
           <div class="column images-column">
             <div class="images-wrapper">
               <img src="/images/navbar/male-1.jpg" alt="Image 1">
               <img src="/images/navbar/male-2.jpg" alt="Image 2">
             </div>
           </div>
         </div>`
      );
    } else if (menu === 'female') {
      setContent(
        `<div class="sliding-content">
           <div class="column">
             <h1><span>CLOTHES</span></h1>
             <ul>
               <li>Dress</li>
               <li>Blouse</li>
               <li onclick="window.location.href='/categoryproduct/42'">Skirt</li>
               <li onclick="window.location.href='/categoryproduct/32'">Jacket</li>
               <li>Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1><span>BAGS</span></h1>
             <ul>
               <li>Tote Bag</li>
               <li onclick="window.location.href='/categoryproduct/56'">Crossbody Bag</li>
               <li>Clutch</li>
               <li onclick="window.location.href='/categoryproduct/55'">Shoulder Bag</li>
               <li onclick="window.location.href='/categoryproduct/57'">Backpack</li>
             </ul>
           </div>
           <div class="column images-column">
             <div class="images-wrapper">
               <img src="/images/navbar/female-1.jpg" alt="Image 3">
               <img src="/images/navbar/female-2.jpg" alt="Image 4">
             </div>
           </div>
         </div>`
      );
    }
  };

  const handleMouseLeave = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsHovered(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!isSummaryOpen && !isCartOpen) {
      // เปิด Summary ก่อน
      setIsSummaryOpen(true);
      // เปิด Cart หลังจาก 300 มิลลิวินาที
      setTimeout(() => {
        setIsCartOpen(true);
      }, 200);
    } else {
      // ปิด Cart ก่อน
      setIsCartOpen(false);
      // ปิด Summary หลังจาก 300 มิลลิวินาที
      setTimeout(() => {
        setIsSummaryOpen(false);
      }, 200);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + parseFloat(item.product.price) * (item.quantity || 0), 0).toFixed(2);
  };


  const handleCheckout = () => {
    const total = calculateTotal();
    navigate('/payment', { state: { cartItems, total } });
  };



  return (
    <>
      <nav className={`nav ${isHovered ? 'hovered' : ''}`}>
        <div className='hr'>
          <Link to="/homes">
            <img src="/images/navbar/logo-white_hr.png" alt="Logo" className="hr-lo" />
          </Link>
        </div>
        <div
          className='left'
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/men" onMouseEnter={() => handleMouseEnter('men')}>MALE</Link>
          <Link to="/female" onMouseEnter={() => handleMouseEnter('female')}>FEMALE</Link>
        </div>
        <div className='right'>
          <Link to="/homes">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/contact">Contact</Link>
          <div onClick={handleCartClick} style={{ cursor: 'pointer' }}>
            <FaShoppingCart size={20} />
          </div>
          {username ? (
            <div
              className="user-menu-container"
              onMouseEnter={() => setUserMenuOpen(true)}
              onMouseLeave={() => setUserMenuOpen(false)}
            >
              <div className="user-info-box">
                <FaUser size={20} />
                <div className="user-text">
                  <span className="hello-text">Hello</span>
                  <span className="usernames">{username}</span>
                </div>
              </div>
              {userMenuOpen && (
                <div className="user-menu-dropdown">
                  <Link to="/settings">Settings</Link>
                  <Link to="/delivery-status">Delivery Status</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">
              <FaUser size={20} />
            </Link>
          )}
        </div>
      </nav>

      {/* Sliding Block และ Backdrop */}
      <div
        className={`sliding-container ${isHovered ? 'active' : ''}`}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className="sliding-block"
          onMouseEnter={() => setIsHovered(true)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div
          className="backdrop"
          onMouseEnter={() => setIsHovered(false)}
        ></div>
      </div>

      {/* Black Blur Backdrop for Cart Sidebar */}
      <div
        className={`cart-backdrop ${(isSummaryOpen || isCartOpen) ? 'fade-in' : 'fade-out'}`}
        onClick={handleCartClick}
      ></div>

      {/* Container for Summary and Cart */}
      <div className={`cart-container ${isSummaryOpen ? 'open' : ''}`}>
        {/* Cart Sidebar */}
        <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
          <h2>Shopping Cart</h2>
          {cartItems.length === 0 ? (
            <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
          ) : (
            <div className={`cart-container ${isSummaryOpen ? 'open' : ''}`}>
              {/* ตรวจสอบว่า isSummaryOpen เป็นจริงหรือไม่ ถ้าเป็นจริงจะเพิ่มคลาส 'open' ให้กับ cart-container */}

              <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
                {/* ตรวจสอบว่า isCartOpen เป็นจริงหรือไม่ ถ้าเป็นจริงจะเพิ่มคลาส 'open' ให้กับ cart-sidebar */}

                <h2>Shopping Cart</h2>

                {cartItems.length === 0 ? (
                  <p className="cart-empty">ตะกร้าสินค้าของคุณว่างเปล่า</p>
                  /* แสดงข้อความ "ตะกร้าสินค้าของคุณว่างเปล่า" ถ้า cartItems ไม่มีสินค้าในตะกร้า */
                ) : (
                  <div className="cart-items-container">
                    {/* ถ้ามีสินค้าใน cartItems จะแสดงรายการสินค้าในตะกร้า */}

                    {cartItems.map((item) => (
                      <div key={item.id} className="cart-item">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img
                            src={`${item.product.images[0].image}`} // แก้ไข URL ให้เหมือนกับ CategoryDetails
                            alt={item.product.name}
                            className="cart-item-image"
                          />
                        ) : (
                          <img
                            src="/path/to/default-product-image.jpg"
                            alt="Default Product"
                            className="cart-item-image"
                          />
                        )}

                        <div className="cart-item-details">
                          <h2 className="cart-item-name">{item.product.name}</h2>
                          {/* แสดงชื่อสินค้า */}

                          <p>{item.product.description}</p>
                          {/* แสดงรายละเอียดสินค้า */}

                          <p>ไซส์: {item.sizes ? item.sizes.name : 'ไม่ได้เลือกไซส์'}</p>
                          {/* แสดงไซส์ของสินค้า ถ้าไม่มีการเลือกไซส์จะแสดงข้อความ 'ไม่ได้เลือกไซส์' */}

                          <p>ราคา: ${item.product.price}</p>
                          {/* แสดงราคาของสินค้า */}

                          <p>จำนวน: {item.quantity}</p>
                          {/* แสดงจำนวนสินค้าที่เลือก */}

                          <div className="cart-item-actions">
                            <button onClick={() => handleRemoveItem(item.id)} className="remove-btn">
                              x
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className={`summary-sidebar ${isSummaryOpen ? 'open' : ''}`}>
          <h2>Summary</h2>
          <p>Total Items: {totalItems}</p>
          <p>Total Price: ${calculateTotal()}</p>
          <button
            onClick={handleCheckout}
            className="checkout-btn"
            disabled={cartItems.length === 0} // ปิดการใช้งานปุ่มถ้าไม่มีสินค้าในตะกร้า
          >
            สั่งซื้อสินค้า
          </button>
        </div>
      </div>
    </>
  );
}

export default Nav;