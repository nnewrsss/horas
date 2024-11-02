import { useState } from "react";
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';
import '../styles/Login.css'; // เพิ่มไฟล์ CSS สำหรับจัดการสไตล์

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    setError(""); 

    api.post("/myapp/token/", {
      username: username,
      password: password,
    })
    .then((res) => {
      if (res.status === 200) {
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;

        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("username", username); 

        api.get(`/myapp/userprofile/${username}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then((profileRes) => {
          const role = profileRes.data.role;
          console.log("User Role:", role);
        
          if (role === 'admin') {
            navigate('/adminhome'); 
          } else {
            navigate('/homes');
          }
        })
        .catch((err) => {
          console.error("Error fetching user profile", err);
          setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้");
        });
      } else {
        setError("ไม่สามารถเข้าสู่ระบบได้!");
      }
    })
    .catch((err) => {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      console.error(err);
    });
  };

  return (
    <div className="login-container">
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="src/videos/video.mp4" type="video/mp4"/>
        </video>
      </div>
      <div className="login-content1"></div>
      <div className="login-content2">
        <img src="src/images/logo-white_horas.png" alt="" className="logo_login"/>
        <form onSubmit={handleLogin} className="form">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="username"
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
            className="password"
          />

          <div className="options">
            <button type="button" className="register-btn" onClick={() => navigate('/register')}>Register</button>
            <button type="button" className="forgot-password-btn" onClick={() => navigate('/forgot-password')}>Forgot Password</button>
          </div>
          <input type="submit" value="Login" className="submit" />
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default Login;