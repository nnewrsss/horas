// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar({ username }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('username');
    navigate('/Login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">
          HR
        </Link>
      </div>
      <div className="navbar-center">
        {/* Mega Dropdown Menu */}
        <div className="dropdown">
          <Link to="#" className="navbar-link">Men</Link>
          <div className="dropdown-content">
            <div className="dropdown-column">
              <h3>Clothes</h3>
              <ul>
                <li><Link to="/category/men/clothes/shirts">Shirts</Link></li>
                <li><Link to="/category/men/clothes/jackets">Jackets</Link></li>
                <li><Link to="/category/men/clothes/pants">Pants</Link></li>
              </ul>
            </div>
            <div className="dropdown-column">
              <h3>Bags</h3>
              <ul>
                <li><Link to="/category/men/bags/leather">Leather Bags</Link></li>
                <li><Link to="/category/men/bags/business">Business Bags</Link></li>
              </ul>
            </div>
            <div className="dropdown-image">
              <img src="/images/men-fashion.jpg" alt="Men Fashion" />
            </div>
          </div>
        </div>
        <div className="dropdown">
          <Link to="#" className="navbar-link">Female</Link>
          <div className="dropdown-content">
            <div className="dropdown-column">
              <h3>Clothes</h3>
              <ul>
                <li><Link to="/category/female/clothes/dresses">Dresses</Link></li>
                <li><Link to="/category/female/clothes/tops">Tops</Link></li>
                <li><Link to="/category/female/clothes/skirts">Skirts</Link></li>
              </ul>
            </div>
            <div className="dropdown-column">
              <h3>Bags</h3>
              <ul>
                <li><Link to="/category/female/bags/handbags">Handbags</Link></li>
                <li><Link to="/category/female/bags/clutches">Clutches</Link></li>
              </ul>
            </div>
            <div className="dropdown-image">
              <img src="/images/female-fashion.jpg" alt="Female Fashion" />
            </div>
          </div>
        </div>
        <div className="dropdown">
          <Link to="#" className="navbar-link">Kid</Link>
          <div className="dropdown-content">
            <div className="dropdown-column">
              <h3>Clothes</h3>
              <ul>
                <li><Link to="/category/kid/clothes/shirts">Shirts</Link></li>
                <li><Link to="/category/kid/clothes/pants">Pants</Link></li>
              </ul>
            </div>
            <div className="dropdown-column">
              <h3>Bags</h3>
              <ul>
                <li><Link to="/category/kid/bags/backpacks">Backpacks</Link></li>
              </ul>
            </div>
            <div className="dropdown-image">
              <img src="/images/kid-fashion.jpg" alt="Kid Fashion" />
            </div>
          </div>
        </div>
      </div>
      <div className="navbar-right">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/support" className="navbar-link">Support</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
        <Link to="/cart" className="navbar-icon">
          <FaShoppingCart />
        </Link>
        <div className="navbar-user">
          <FaUser />
          <span>Welcome, {username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
