// Homes.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { ACCESS_TOKEN } from '../constants';
import { useNavigate } from 'react-router-dom'; 

function Setting() {
    const [products, setProducts] = useState([]);
    const username = localStorage.getItem('username'); 
    const [userData, setUserData] = useState(null); // เก็บข้อมูลผู้ใช้
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/login'); // ถ้าไม่มี token ให้ redirect ไปที่หน้าล็อกอิน
        } else {
            api.get('/myapp/user-info/') // เรียกข้อมูลผู้ใช้จาก API (ปรับ endpoint ให้เหมาะสม)
                .then(res => {
                    setUserData(res.data); // เก็บข้อมูลผู้ใช้
                })
                .catch(err => {
                    console.error('Error fetching user info:', err);
                });
        }
    }, [navigate]);

    return (
        <div>
            <h1>User Information</h1>
            <h1>Username: {username}</h1> {/* ใช้ {username} อย่างถูกต้อง */}
        </div>
    );
}

export default Setting;
