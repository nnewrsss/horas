import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';  // Import instance
import { ACCESS_TOKEN } from '../constants';
import '../styles/adminhome.css';

const AdminHome = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [username, setUsername] = useState('');
    const [totalSales, setTotalSales] = useState(0);

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        const token = localStorage.getItem(ACCESS_TOKEN);

        if (storedUsername) {
            setUsername(storedUsername);
        }

        const fetchTotalSales = async () => {
            try {
                const response = await api.get('/myapp/admin/total-sales-amount/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTotalSales(response.data.total_sales);
            } catch (error) {
                console.error('Error fetching total sales:', error);
            }
        };

        fetchTotalSales();

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
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
                                <div className='admin-username'>{username || 'Admin'}</div>
                            </div>
                        </div>
                        <div className='grid-item top-sale'>
                            <div className='visit-count'>
                                <h3>Visit website for today</h3>
                                <span className='count-num'>399</span>
                            </div>
                        </div>
                        <div className='today-sale'>
                            <Link to="/admin/total-sales">
                                <h3 style={{ fontWeight: '200' }}>Today Sales</h3>
                                <span style={{ fontSize: '3rem', fontWeight: '700' }}>{totalSales || 0} ฿</span>
                            </Link>
                        </div>
                        <div className='grid-item top-sale'>
                        <Link to="/admin/orders">
                           CHECK ORDER
                        </Link>
                        </div>
                        <div className='grid-item top-sale'>
                        <Link to="/admin/top-sale">
                            Top Sale
                        </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
