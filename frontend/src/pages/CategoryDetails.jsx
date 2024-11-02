
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav.jsx';
import '../styles/cat.css';
import productVideo from '../videos/productvideo.mp4'; // นำเข้าไฟล์วิดีโอ
import { ACCESS_TOKEN } from '../constants.js';
import Black from '../components/blackinfo.jsx';


function CategoryDetails() {
    const { subcategoryType } = useParams();
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            if (!token) {
                setError('ไม่มีสิทธิ์เข้าถึงข้อมูล');
                setLoading(false);
                return;
            }

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const categoryUrl = `http://127.0.0.1:8000/myapp/${subcategoryType}/`;
                const productsUrl = `http://127.0.0.1:8000/myapp/categoryproducts/${subcategoryType}/`;

                console.log(`Fetching category data from: ${categoryUrl}`);
                console.log(`Fetching products data from: ${productsUrl}`);

                const [categoryResponse, productsResponse] = await Promise.all([
                    axios.get(categoryUrl, config),
                    axios.get(productsUrl, config),
                ]);

                console.log('Category Response:', categoryResponse.data);
                console.log('Products Response:', productsResponse.data);

                setCategories(categoryResponse.data);
                setProducts(productsResponse.data);
                setLoading(false);
            } catch (err) {
                console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
                setError('Sorry Timeout please Login again');
                setLoading(false);
            }
        };

        fetchData();
    }, [subcategoryType]);

    const handleCategoryClick = (categoryId) => {
        navigate(`/categoryproduct/${categoryId}`);
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
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

            <div className='video-detail'>
                <div className='video-heroshadow'></div>
                <video autoPlay loop muted>
                    <source src={productVideo} type="video/mp4" />
                </video>
            </div>

            <div className='category-details-container'>
                {/* จัดกึ่งกลาง subheader */}
                <h2 className='subheader' style={{ fontFamily: 'LeJeuneDeck-Regular,Times New Roman,Times,serif' }}>Category</h2>
                <div className='categories-grid'>
                    {categories.length > 0 ? (
                        categories.map((cat) => (
                            <div
                                key={cat.id}
                                className='category-card'
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                {cat.images && cat.images.length > 0 ? (
                                    <img
                                        src={`http://127.0.0.1:8000${cat.images[0].image}`}
                                        alt={cat.name}
                                        className='category-image'
                                    />
                                ) : (
                                    <img
                                        src='/path/to/default-category-image.jpg'
                                        alt='Default Category'
                                        className='category-image'
                                    />
                                )}
                                <h3 className='catname'>{cat.name.replace(/^(male|men|female|women)\s*/i, "")}</h3>

                                {/* ลบปุ่มดูรายละเอียดออก */}
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีหมวดหมู่ที่จะแสดง</p>
                    )}
                </div>
            </div>

            <div className='product-details-container'>
                <h2 className='subheader' style={{ fontFamily: 'LeJeuneDeck-Regular,Times New Roman,Times,serif' }}>Items</h2>
                <div className='products-grid'>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className='product-card' onClick={() => handleProductClick(product.id)}>
                                <div className='product-image-containers'>
                                    {product.images && product.images.length > 0 ? (
                                        <img
                                            src={`http://127.0.0.1:8000${product.images[0].image}`}
                                            alt={product.name}
                                            className='product-images'
                                        />
                                    ) : (
                                        <img
                                            src='/path/to/default-product-image.jpg'
                                            alt='Default Product'
                                            className='product-images'
                                        />
                                    )}
                                </div>

                                <div className='product-info'>
                                    <h3 className='product-info-name'>{product.name}</h3>
                                    {/* <p>{product.description}</p> */}
                                    <p>{product.price} BAHT</p>
                                    {/* ลบปุ่มดูรายละเอียดสินค้าออก */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีสินค้าที่จะแสดง</p>
                    )}
                </div>
            </div>
            <Black />
        </div>
    );
}

export default CategoryDetails;