// cart.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import Nav from '../components/Nav.jsx';
import '../styles/cart.css';
import { useNavigate } from 'react-router-dom'; // ใช้ useNavigate

function cart() {
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
        </div>
    );
}

export default cart;
