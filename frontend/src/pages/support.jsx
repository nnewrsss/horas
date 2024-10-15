// src/pages/Support.jsx
import React from 'react';
import Navbar from '../components/Navbar';

function Support() {
  const username = localStorage.getItem('username');

  return (
    <div>
      <Navbar username={username} />
      <h1>บริการลูกค้า</h1>
      <p>ข้อมูลการสนับสนุนลูกค้า...</p>
    </div>
  );
}

export default Support;
