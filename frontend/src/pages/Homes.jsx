// import React, { useEffect, useState } from 'react';
// import api from '../api';
// import { ACCESS_TOKEN } from '../constants';
// import Nav from '../components/Nav.jsx';
// import '../styles/Homes.css';

// function Homes() {
//     const [products, setProducts] = useState([]);
//     const username = localStorage.getItem('username'); // Assuming you stored the username

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             window.location.href = '/';
//         } else {
//             api.get('/myapp/products/')
//                 .then(res => {
//                     setProducts(res.data);
//                 })
//                 .catch(err => {
//                     console.error('Error fetching products:', err);
//                 });
//         }
//     }, []);

//     return (
//         <html>
//             <head>
//                 <title>Horas™ Website</title>
//             </head>
//             <body>
//                     <Nav/>
//                     <div class="welcome-overlay" id="welcomeOverlay">
//                         <div class="welcome-text">Welcome to our website</div> 
//                         {/* <div class="welcome-detail">Horas 2024 Company</div> */}
//                     </div>

//                     <div className='hero-section'>
//                         <img src='src/images/logo-white_horas.png' alt='' className='white-logo' />
//                         <div className='heroshadow'></div>
//                         <img src="/src/images/hero-section.png" alt="" className='hero-img' />
//                     </div>

//                     <div className='main-section'>
//                         <div class="gallery-container">
//                             <img src="" alt="" />

//                         </div>
//                     </div>
//             </body>
//         </html>

//     );
// }

// export default Homes;











































// Homes.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Nav from '../components/Nav.jsx';
import '../styles/Homes.css';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate

function Homes() {
    const [products, setProducts] = useState([]);
    const username = localStorage.getItem('username'); // ดึงชื่อผู้ใช้จาก localStorage
    const navigate = useNavigate();

    // ตรวจสอบค่า username
    console.log('Logged in user:', username); // <-- ใส่ console.log เพื่อตรวจสอบค่า username

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/login'); // Redirect ไปที่หน้าล็อกอินถ้าไม่ได้ล็อกอิน
        } else {
            api.get('/myapp/products/')
                .then(res => {
                    setProducts(res.data);
                })
                .catch(err => {
                    console.error('Error fetching products:', err);
                });
        }
    }, [navigate]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const overlay = document.getElementById('welcomeOverlay');
            if (overlay) {
                overlay.style.transition = 'opacity 1s';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.style.display = 'none';
                }, 1000); // ซ่อน overlay หลังจาก fade out
            }
        }, 2500); // 2.5 วินาที

        return () => clearTimeout(timer);
    }, []);

    return (
        <div>
            <Nav username={username} /> {/* ส่งค่าชื่อผู้ใช้ไปยังคอมโพเนนต์ Nav */}
            <div className="welcome-overlay" id="welcomeOverlay">
                <div className="welcome-text">Welcome to our website</div> 
            </div>

            <div className='hero-section'>
                <img src='src/images/logo-white_horas.png' alt='Logo' className='white-logo' />
                <div className='heroshadow'></div>
                <img src="/src/images/hero-section.png" alt="Hero" className='hero-img' />
            </div>

            <div className='main-section'>
                <div className="gallery-container">
                    {/* แสดงผลิตภัณฑ์ */}
                </div>
            </div>
        </div>
    );
}

export default Homes;
