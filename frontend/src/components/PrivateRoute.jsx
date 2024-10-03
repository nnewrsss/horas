// PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('access'); // ตรวจสอบว่าโทเค็นล็อกอินอยู่ใน localStorage หรือไม่

  return token ? children : <Navigate to="/login" />; // ถ้าไม่มีโทเค็น จะนำทางไปที่หน้า login
};

export default PrivateRoute;
