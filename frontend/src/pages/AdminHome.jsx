
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ACCESS_TOKEN } from '../constants';  // เรียกใช้ ACCESS_TOKEN จาก constants.js
import '../styles/adminhome.css';

const AdminHome = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [username, setUsername] = useState(''); // เก็บชื่อผู้ใช้

    useEffect(() => {
        // ดึงข้อมูลจาก localStorage
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem(ACCESS_TOKEN); // ใช้ตัวแปร ACCESS_TOKEN

        if (storedUsername) {
            setUsername(storedUsername);
        }

        // แสดงข้อมูลใน console เพื่อ debug
        console.log(`ผู้ใช้ที่กำลังเข้าสู่ระบบ: ${storedUsername || 'ไม่มีผู้ใช้'}`);
        console.log(`Token: ${token || 'ไม่มี token'}`);

        // ตั้งเวลาอัพเดตทุก 1 วินาที
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // ล้าง timer เมื่อ component ถูกทำลาย
    }, []);

    return (
        <div>
            <div className='admin-section'>
                <div className='menubar'>
                    <div className='menu-logo'>
                        <img src="/images/navbar/logo-black_hr.png" alt="Logo" className="menu-black-logo-img" />
                    </div>
                    <div className='menu-links'>
                        <Link to="/admin/product-detail">
                            <img src="/images/navbar/detail.png" alt="Product Detail" className="menu-link-icon" />
                        </Link>
                        <Link to="/admin/product-list">
                            <img src="/images/navbar/list.png" alt="Product List" className="menu-link-icon" />
                        </Link>
                    </div>
                </div>
                <div className='admin-dashboard-section'>
                    <div className='dashboard-grid'>
                        <div className='grid-item big-title'>
                            <div style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
                                <h3 style={{ fontWeight: '200' }}>Visit website for today</h3>
                                <span style={{ fontSize: '5rem', fontWeight: '700' }}>399</span>
                            </div>
                            <div style={{ alignSelf: 'flex-start', textAlign: 'left' }}>
                                <div className='hello-title'>WELCOME</div>
                                <div className='admin-username'>{username || 'Admin'}</div> {/* แสดงชื่อผู้ใช้ */}
                            </div>
                        </div>
                        <div className='grid-item top-sale'>
                            <div className='visit-count'>
                                <h3>Visit website for today</h3>
                                <span className='count-num'>399</span>
                            </div>
                        </div>
                        <div className='today-sale'>
                            <h3 style={{ fontWeight: '200' }}>Today Sales</h3>
                            <span style={{ fontSize: '3rem', fontWeight: '700' }}>32,000 ฿</span>
                        </div>
                        <Link to="/admin/orders">
                            <div className='grid-item top-sale'>CHECK ORDER</div>
                        </Link>
                        <Link to="/admin/top-sale">
    <div className='grid-item top-sale'>Top Sale</div>
</Link>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
