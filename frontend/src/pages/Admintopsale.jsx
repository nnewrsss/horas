import React, { useEffect, useState } from 'react';
import api from '../api'; // Import instance
import { useNavigate } from 'react-router-dom';

const AdminTopSale = () => {
    const [topSaleProducts, setTopSaleProducts] = useState([]);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(null);
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

        const fetchTopSales = async () => {
            try {
                const response = await api.get('/myapp/topsaleproducts/');
                setTopSaleProducts(response.data);
                sessionStorage.setItem('topSaleProducts', JSON.stringify(response.data));
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    alert('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่');
                    navigate('/login');
                } else {
                    setError('เกิดข้อผิดพลาดในการดึงข้อมูลสินค้ายอดขายสูงสุด');
                }
            }
        };

        fetchTopSales();
    }, [navigate]);

    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Top Sale Products</h2>
            <ul>
                {topSaleProducts.map((product, index) => (
                    <li key={index}>{product.product__name} - จำนวนที่ขาย: {product.total_quantity}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminTopSale;
