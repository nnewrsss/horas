import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Nav.css';

function Nav({ username }) {
  const [isHovered, setIsHovered] = useState(false);
  const [content, setContent] = useState(''); // state สำหรับเก็บข้อมูล sliding block
  const [userMenuOpen, setUserMenuOpen] = useState(false); // State สำหรับเมนูผู้ใช้
  const navigate = useNavigate();

  const handleMouseEnter = (menu) => {
    setIsHovered(true);
    if (menu === 'male') {
      setContent(
        `<div class="sliding-content">
           <div class="column">
             <h1>CLOTHES</h1>
             <ul>
               <li>Shirt</li>
               <li>Polo</li>
               <li>Cardigan & Sweater</li>
               <li>Jacket</li>
               <li>Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1>BAGS</h1>
             <ul>
               <li>Cross body bag</li>
               <li>Bag Packing</li>
               <li>Business Bag</li>
               <li>Leather Bag</li>
               <li>Small Bag</li>
             </ul>
           </div>
         </div>`
      );
    } else if (menu === 'female') {
      setContent(
        `<div class="sliding-content">
           <div class="column">
             <h1>CLOTHES</h1>
             <ul>
               <li>Dress</li>
               <li>Blouse</li>
               <li>Skirt</li>
               <li>Jacket</li>
               <li>Pants</li>
             </ul>
           </div>
           <div class="column">
             <h1>ACCESSORIES</h1>
             <ul>
               <li>Handbags</li>
               <li>Jewelry</li>
               <li>Scarves</li>
               <li>Sunglasses</li>
               <li>Watches</li>
             </ul>
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

  const handleBackdropMouseEnter = () => {
    setIsHovered(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/Login');
  };

  return (
    <>
      <nav className={`nav ${isHovered ? 'hovered' : ''}`}>
        <div className='hr'>
          <Link to="/">
            <img src="src/images/logo-white_hr.png" alt="Logo" className="hr-lo" />
          </Link>
        </div>
        <div
          className='left'
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/male" onMouseEnter={() => handleMouseEnter('male')}>MALE</Link>
          <Link to="/female" onMouseEnter={() => handleMouseEnter('female')}>FEMALE</Link>
          <Link to="/kids">KID</Link>
        </div>
        <div className='right'>
          <Link to="/">Home</Link>
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
                  <span className="username">{username}</span>
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          dangerouslySetInnerHTML={{ __html: content }} // แสดงข้อมูลที่เปลี่ยนได้ใน sliding block
        ></div>
        <div
          className="backdrop"
          onMouseEnter={handleBackdropMouseEnter}
        ></div>
      </div>
    </>
  );
}

export default Nav;