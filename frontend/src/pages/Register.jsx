// import Form from "../components/Form"

// function Register() {
//     return <Form route="/myapp/user/register/" method="register" />
// }

// export default Register


// register.jsx

import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // ตรวจสอบว่ารหัสผ่านและยืนยันรหัสผ่านตรงกัน
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านต้องตรงกัน');
      return;
    }

    api.post('/myapp/register/', {
      username,
      email,
      password,
      confirm_password: confirmPassword,
      phone_number: phoneNumber,
    })
    .then((res) => {
      if (res.status === 201) {
        setSuccess('ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ');
        // นำผู้ใช้ไปยังหน้าเข้าสู่ระบบหลังจากลงทะเบียนสำเร็จ
        setTimeout(() => navigate('/login'), 2000);
      }
    })
    .catch((err) => {
      if (err.response && err.response.data) {
        // แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
        const messages = [];
        for (const key in err.response.data) {
          if (Array.isArray(err.response.data[key])) {
            err.response.data[key].forEach(msg => messages.push(`${key}: ${msg}`));
          } else {
            messages.push(`${key}: ${err.response.data[key]}`);
          }
        }
        setError(messages.join(' '));
      } else {
        setError('เกิดข้อผิดพลาดในการลงทะเบียน');
      }
    });
  };

  return (
    <div className="register-container">
      <div className="register-content">
        <h2>Register</h2>
        <form onSubmit={handleRegister} className="register-form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="register-input"
          />
          <br />

          <label htmlFor="email">Email Address:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="register-input"
          />
          <br />

          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            required
            onChange={(e) => setPhoneNumber(e.target.value)}
            value={phoneNumber}
            className="register-input"
          />
          <br />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="register-input"
          />
          <br />

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className="register-input"
          />
          <br />

          <input type="submit" value="Register" className="register-submit" />
        </form>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
}

export default Register;
