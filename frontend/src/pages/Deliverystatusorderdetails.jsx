import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav'; // Import Nav component
import '../styles/DeliveryStatusOrderDetails.css'; // Import the CSS file for styling

function DeliveryStatusOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://127.0.0.1:8000/myapp/orders/${orderId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Order Details Response:', response.data);
        setOrder(response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงรายละเอียดคำสั่งซื้อ');
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <p className="loading-text">กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (

    <div className="order-details-container">
      <Nav username={username} />
      <div className="order-details">
        <h1 className="order-title">รายละเอียดคำสั่งซื้อ #{order.id}</h1>
        <div className="order-info">
          <p><strong>สถานะ:</strong> {order.status}</p>
          <p><strong>ราคารวม:</strong> {order.total_price} บาท</p>
          <p><strong>วันที่สั่งซื้อ:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
        </div>

        <h2 className="items-title">รายการสินค้า:</h2>
        <ul className="items-list">
          {order.order_items.map((item) => (
            <li key={item.id} className="item">
              <img 
                src={item.product.images[0]?.image} 
                alt={item.product.name} 
                className="item-image"
              />
              <div className="item-details">
                <span className="item-name">{item.product.name}</span>
                <span className="item-quantity">จำนวน: {item.quantity}</span>
                <span className="item-price">฿{item.price}</span>
              </div>
            </li>
          ))}
        </ul>
        <button className="back-button" onClick={() => navigate('/delivery-status')}>
          กลับไปที่สถานะการจัดส่ง
        </button>
      </div>
    </div>
  );
}

export default DeliveryStatusOrderDetails;
