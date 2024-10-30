import React, { useState, useEffect } from 'react';
import api from '../api'; // Axios instance
import { useNavigate } from 'react-router-dom';
import '../styles/Admincheckorder.css';

const Admincheckorder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [filterStatus, setFilterStatus] = useState(''); // เก็บสถานะที่ต้องการกรอง
    const [searchTerm, setSearchTerm] = useState(''); // เก็บข้อความค้นหา
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

        const fetchOrders = async () => {
            try {
                const url = 'http://127.0.0.1:8000/myapp/adminorders/';
                const response = await api.get(url);
                setOrders(response.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                    navigate('/login');
                } else {
                    setError('เกิดข้อผิดพลาดในการดึงข้อมูลออเดอร์');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const toggleOrderItems = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const showSlip = (slipUrl) => setSelectedSlip(slipUrl);

    const closeSlip = () => setSelectedSlip(null);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const url = `http://127.0.0.1:8000/myapp/adminorders/${orderId}/update-status/`;
            await api.patch(url, { status: newStatus });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert('สถานะถูกอัปเดตเรียบร้อย');
        } catch (err) {
            console.error('Error updating status:', err);
            alert('ไม่สามารถอัปเดตสถานะได้');
        }
    };

    // ฟังก์ชันกรองออเดอร์ตามสถานะและคำค้นหา
    const filteredOrders = orders.filter(
        (order) =>
            (filterStatus === '' || order.status === filterStatus) &&
            ((order.user && order.user.toLowerCase().includes(searchTerm.toLowerCase())) ||
                order.id.toString().includes(searchTerm))
    );

    if (loading) return <p>กำลังโหลด...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h2>ยินดีต้อนรับ, {username || 'ผู้ดูแลระบบ'}</h2>
            </div>

            {/* ปุ่มสำหรับกรองสถานะ */}
            <div className="filter-buttons">
                {['All', 'Pending', 'Confirmed', 'Paid', 'Shipped', 'Delivered', 'Canceled'].map(
                    (status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status === 'All' ? '' : status)}
                            className={filterStatus === status ? 'active' : ''}
                        >
                            {status}
                        </button>
                    )
                )}
            </div>

            {/* ช่องค้นหา */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="ค้นหา Order ID หรือชื่อผู้ใช้"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <h2>รายการออเดอร์ทั้งหมด</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User</th>
                        <th>Status</th>
                        <th>Total Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr>
                                <td>{order.id}</td>
                                <td>{order.user}</td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) =>
                                            handleStatusChange(order.id, e.target.value)
                                        }
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Canceled">Canceled</option>
                                    </select>
                                </td>
                                <td>{order.total_price} ฿</td>
                                <td>
                                    <button onClick={() => toggleOrderItems(order.id)}>
                                        {expandedOrderId === order.id ? 'ซ่อนรายการ' : 'ดูรายการ'}
                                    </button>
                                    {order.payment && order.payment.payment_slip && (
                                        <button onClick={() => showSlip(order.payment.payment_slip)}>
                                            เช็คสลิป
                                        </button>
                                    )}
                                </td>
                            </tr>
                            {expandedOrderId === order.id && (
                                <tr>
                                    <td colSpan="5">
                                        <h3>รายละเอียดสินค้าในออเดอร์</h3>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>รูปภาพ</th>
                                                    <th>Product</th>
                                                    <th>Quantity</th>
                                                    <th>Size</th>
                                                    <th>Price</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {order.order_items.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>
                                                            {item.product.images.length > 0 ? (
                                                                <img
                                                                    src={item.product.images[0].image}
                                                                    alt={item.product.name}
                                                                    style={{
                                                                        width: '100px',
                                                                        height: '100px',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <p>ไม่มีรูปภาพ</p>
                                                            )}
                                                        </td>
                                                        <td>{item.product.name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>{item.sizes ? item.sizes.name : 'N/A'}</td>
                                                        <td>{item.price} ฿</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            {selectedSlip && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeSlip}>
                            &times;
                        </span>
                        <img src={selectedSlip} alt="สลิปการชำระเงิน" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admincheckorder;
