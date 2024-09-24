// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import '../styles/Navbar.css';

function Navbar({ username }) {
  <link href="https://fonts.googleapis.com/css2?family=Baskervville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"></link>
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
      
      <div className="navbar-right">
        <Link to="/home" className="navbar-link">Home</Link>
        <Link to="/support" className="navbar-link">Support</Link>
        <Link to="/contact" className="navbar-link">Contact</Link>
      </div>
    </nav>
  );
}

export default Navbar;
