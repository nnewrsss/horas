// AdminTotalSales.jsx
import React, { useEffect, useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AdminTotalSales = () => {
    const [userSales, setUserSales] = useState([]);
    const [totalSales, setTotalSales] = useState(0);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null); // สถานะเปิด-ปิดรายการของแต่ละผู้ใช้
    const navigate = useNavigate();

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');

        if (storedUsername) {
            setUsername(storedUsername);
        } else {
            alert('กรุณาเข้าสู่ระบบก่อน');
            navigate('/login');
            return;
        }

        const fetchTotalSales = async () => {
            try {
                const response = await api.get('/myapp/totalsales/');
                setUserSales(response.data.user_sales);
                setTotalSales(response.data.total_sales);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                    navigate('/login');
                } else {
                    setError('เกิดข้อผิดพลาดในการดึงข้อมูลยอดขาย');
                }
            }
        };

        fetchTotalSales();
    }, [navigate]);

    const toggleUserOrders = (username) => {
        // หากผู้ใช้คลิกชื่อเดิม ให้ซ่อนรายการออก หากเป็นชื่ออื่นให้เปิดแสดง
        setExpandedUser(expandedUser === username ? null : username);
    };

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>ยอดซื้อของผู้ใช้แต่ละคน</h2>
            <ul>
                {userSales.map((user, index) => (
                    <li key={index}>
                        <strong onClick={() => toggleUserOrders(user.username)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {user.username}
                        </strong>
                        - ยอดซื้อรวม: {user.total_spent} ฿
                        
                        {/* แสดงรายการคำสั่งซื้อเมื่อคลิกชื่อผู้ใช้ */}
                        {expandedUser === user.username && (
                            <ul>
                                {user.orders.map((order) => (
                                    <li key={order.order_id}>
                                        Order ID: {order.order_id} - ยอดรวม: {order.order_total} ฿
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
            <h3>ยอดขายรวมทั้งหมด: {totalSales} ฿</h3>
        </div>
    );
};

export default AdminTotalSales;
