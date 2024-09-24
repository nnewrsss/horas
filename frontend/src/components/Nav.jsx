import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Nav.css';

function Nav({ username }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
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
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <Link to="/men">MEN</Link>
          <Link to="/female">FEMALE</Link>
          <Link to="/kids">KID</Link>
        </div>
        <div className='right'>
          <Link to="/">Home</Link>
          <Link to="/aboutus">About Us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/cart">
            <FaShoppingCart size={20} />
          </Link>
          <Link to={username ? "/profile" : "/login"}>
            <FaUser size={20} />
          </Link>
          {username && (
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
        >
          {/* เนื้อหาภายใน sliding block */}
          <p>เนื้อหาภายใน sliding block</p>
        </div>
        <div
          className="backdrop"
          onMouseEnter={handleBackdropMouseEnter}
        ></div>
      </div>
    </>
  );
}

export default Nav;