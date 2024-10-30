import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Nav from '../components/Nav'; // Import Nav component

function DeliveryStatusOrderDetails() {
  const { orderId } = useParams(); // Get the order ID from the URL
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

        console.log('Order Details Response:', response.data); // Log the response data
        setOrder(response.data);
      } catch (err) {
        setError('เกิดข้อผิดพลาดในการดึงรายละเอียดคำสั่งซื้อ');
        console.error('Error fetching order details:', err); // Log the error
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, navigate]);

  if (loading) {
    return <p>กำลังโหลดข้อมูล...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <Nav username={username} />
      <div className="order-details-container">
        <h1>รายละเอียดคำสั่งซื้อ #{order.id}</h1>
        <p>สถานะ: {order.status}</p>
        <p>ราคารวม: {order.total_price} บาท</p>
        <p>วันที่สั่งซื้อ: {new Date(order.created_at).toLocaleDateString()}</p>
        <h2>รายการสินค้า:</h2>
        <ul>
          {order.order_items.map((item) => (
            <li key={item.id}>
              <div>
                <img 
                  src={item.product.images[0]?.image} 
                  alt={item.product.name} 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', marginRight: '10px' }}
                />
                <span>{item.product.name} (จำนวน: {item.quantity}) - ฿{item.price}</span>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/delivery-status')}>กลับไปที่สถานะการจัดส่ง</button>
      </div>
    </div>
  );
}

export default DeliveryStatusOrderDetails;
