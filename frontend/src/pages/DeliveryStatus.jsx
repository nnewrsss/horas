import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import '../styles/delivery.css';

function DeliveryStatus() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/myapp/orders/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงข้อมูลคำสั่งซื้อ');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleOrderClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Nav username={username} />
      <div className="delivery-status-container">
        <h1 className="delivery-status-title">Order Status</h1>
        {orders.length === 0 ? (
          <p className="no-orders">ไม่มีคำสั่งซื้อที่แสดง</p>
        ) : (
          <div className="order-list">
            {orders.map((order) => (
              <button
                key={order.id}
                className="order-item"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="order-title-section">
                  <p className="order-title">Order {order.id}</p>
                  <p className="delivery-number">Delivery Number: {order.delivery_number || 'N/A'}</p>
                </div>
                <p className="order-price">Price: {order.total_price} BAHT</p>
                <p className="order-date">Date: {new Date(order.created_at).toLocaleDateString()}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DeliveryStatus;
