// // Login.jsx
// import { useState } from "react";
// import api from "../api";
// import { useNavigate } from 'react-router-dom';
// import { ACCESS_TOKEN } from '../constants';
// function Login() {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();
//     api.post("/myapp/token/", {
//       username: username,
//       password: password,
//     })
//     .then((res) => {
//       if (res.status === 200) {
//         const accessToken = res.data.access;
//         const refreshToken = res.data.refresh;
//         localStorage.setItem(ACCESS_TOKEN, accessToken);
//         localStorage.setItem("refresh", refreshToken);
//         localStorage.setItem("username", username); // เก็บชื่อผู้ใช้
//         alert("เข้าสู่ระบบสำเร็จ!");
//         navigate('/homes'); // เปลี่ยนเส้นทางไปยังหน้า Home
//       } else {
//         alert("ไม่สามารถเข้าสู่ระบบได้!");
//       }
//     })
//     .catch((err) => {
//       alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
//       console.error(err);
//     });
//   };

//   return (
//     <div className="login-container">
//       <h2>เข้าสู่ระบบร้านขายเสื้อผ้า</h2>
//       <form onSubmit={handleLogin}>
//         <label htmlFor="username">ชื่อผู้ใช้:</label>
//         <br />
//         <input
//           type="text"
//           id="username"
//           name="username"
//           required
//           onChange={(e) => setUsername(e.target.value)}
//           value={username}
//         />
//         <br />
//         <label htmlFor="password">รหัสผ่าน:</label>
//         <br />
//         <input
//           type="password"
//           id="password"
//           name="password"
//           required
//           onChange={(e) => setPassword(e.target.value)}
//           value={password}
//         />
//         <br />
//         <input type="submit" value="เข้าสู่ระบบ" />
//       </form>
//     </div>
//   );
// }

// export default Login;































import { useState } from "react";
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // เพิ่ม state สำหรับเก็บข้อความข้อผิดพลาด
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    setError(""); // รีเซ็ตข้อความข้อผิดพลาดก่อน

    // ขอรับโทเค็นจาก API
    api.post("/myapp/token/", {
      username: username,
      password: password,
    })
    .then((res) => {
      if (res.status === 200) {
        const accessToken = res.data.access;
        const refreshToken = res.data.refresh;

        // เก็บโทเค็นใน localStorage
        localStorage.setItem(ACCESS_TOKEN, accessToken);
        localStorage.setItem("refresh", refreshToken);
        localStorage.setItem("username", username); // เก็บชื่อผู้ใช้

        // ดึงข้อมูล role ของผู้ใช้หลังจากล็อกอินสำเร็จ
        api.get(`/myapp/userprofile/${username}/`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })
        .then((profileRes) => {
          const role = profileRes.data.role;  // รับ role จาก response
          console.log("User Role:", role); // Log ข้อมูล role
        
          // Redirect ไปที่หน้าตาม role ของผู้ใช้
          if (role === 'admin') {
            navigate('/adminhome');  // ถ้า role เป็น admin จะไปที่หน้า adminhome
          } else {
            navigate('/homes');  // ถ้า role เป็น user จะไปที่หน้า homes
          }
        })
        .catch((err) => {
          console.error("Error fetching user profile", err);
          setError("เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้"); // แสดงข้อความข้อผิดพลาด
        });
      } else {
        setError("ไม่สามารถเข้าสู่ระบบได้!"); // กรณีโทเค็นไม่ถูกต้อง
      }
    })
    .catch((err) => {
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง"); // กรณีล็อกอินไม่สำเร็จ
      console.error(err);
    });
  };

  return (
    <div className="login-container">
      <h2>เข้าสู่ระบบร้านขายเสื้อผ้า</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">ชื่อผู้ใช้:</label>
        <br />
        <input
          type="text"
          id="username"
          name="username"
          required
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <br />
        <label htmlFor="password">รหัสผ่าน:</label>
        <br />
        <input
          type="password"
          id="password"
          name="password"
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <br />
        <input type="submit" value="เข้าสู่ระบบ" />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* แสดงข้อความข้อผิดพลาด */}
    </div>
  );
}

export default Login;
