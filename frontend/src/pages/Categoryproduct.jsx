import React, { useEffect, useState } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import axios from 'axios';
import Nav from '../components/Nav';  
import { ACCESS_TOKEN } from '../constants.js';  

function CategoryProduct() {
    const { productId } = useParams();  // รับ productId จาก URL
    const navigate = useNavigate();  
    const username = localStorage.getItem('username');  

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProductsByChildCategory = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/myapp/products/childcategory/${productId}/`);
                console.log("Response Data:", response.data);  
                setProducts(response.data);  
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);  
                setError('Error fetching products');
                setLoading(false);
            }
        };

        fetchProductsByChildCategory();
    }, [productId]);

    // ฟังก์ชันที่จะใช้สำหรับนำทางไปยังหน้ารายละเอียดสินค้า
    const handleProductClick = (id) => {
        navigate(`/product/${id}`);  
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Nav username={username} />
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
                                    <p>{product.price} BATH</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีสินค้าที่จะแสดง</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryProduct;
