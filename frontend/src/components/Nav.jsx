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








































// Nav.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Nav.css';

function Nav({ username }) {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    setIsHovered(true);
    if (menu === 'men') {
      setContent(
        `<div class="sliding-content">
           <div class="column">
             <h1><span>CLOTHES</span></h1>
             <ul>
               <li>Shirt</li>
               <li>Polo</li>
               <li>Cardigan & Sweater</li>
               <li>Jacket</li>
               <li>Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1><span>BAGS</span></h1>
             <ul>
               <li>Cross body bag</li>
               <li>Bag Packing</li>
               <li>Business Bag</li>
               <li>Leather Bag</li>
               <li>Small Bag</li>
             </ul>
           </div>
           <div class="column images-column">
             <div class="images-wrapper">
               <img src="src/images/navbar/female-1.jpg" alt="Image 1">
               <img src="src/images/navbar/female-1.jpg" alt="Image 2">
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
               <li>Skirt</li>
               <li>Jacket</li>
               <li>Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1><span>BAGS</span></h1>
             <ul>
               <li>Tote Bag</li>
               <li>Crossbody Bag</li>
               <li>Clutch</li>
               <li>Shoulder Bag</li>
               <li>Backpack</li>
             </ul>
           </div>
           <div class="column images-column">
             <div class="images-wrapper">
               <img src="src/images/navbar/female-1.jpg" alt="Image 3">
               <img src="src/images/navbar/female-1.jpg" alt="Image 4">
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
          onMouseLeave={handleMouseLeave} // จัดการเมื่อเมาส์ออกจากเมนูหลัก
        >
          <Link to="/men" onMouseEnter={() => handleMouseEnter('men')}>MALE</Link>
          <Link to="/female" onMouseEnter={() => handleMouseEnter('female')}>FEMALE</Link>
        </div>
        <div className='right'>
          <Link to="/homes">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">
            <FaShoppingCart size={20} />
          </Link>
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
        onMouseLeave={handleMouseLeave} // ตรวจจับการออกจาก sliding block ทั้งหมด
      >
        <div
          className="sliding-block"
          onMouseEnter={() => setIsHovered(true)} // ป้องกันการหายเมื่อ hover บน sliding-content
          dangerouslySetInnerHTML={{ __html: content }}
        ></div>
        <div
          className="backdrop"
          onMouseEnter={() => setIsHovered(false)} // ซ่อน sliding block เมื่อ hover backdrop
        ></div>
      </div>
    </>
  );
}

export default Nav;