import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import gsap from 'gsap';
import Nav from '../components/Nav';
import { ACCESS_TOKEN } from '../constants';
import '../styles/productdetail.css';

function ProductDetails() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sizes, setSizes] = useState([]);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const productRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/myapp/products/${productId}/`);
                setProduct(response.data);
                setLoading(false);
                gsap.from(productRef.current, { opacity: 0, y: 50, duration: 1 });
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('Error fetching product details');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        const fetchSizes = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/myapp/sizes/');
                setSizes(response.data);
            } catch (error) {
                console.error("Error fetching sizes:", error);
            }
        };

        fetchSizes();
    }, []);

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const incrementQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleBuyNow = () => {
        if (product.stock <= 0) {
            alert('สินค้าหมด');
            return;
        }
        if (!selectedSize) {
            alert('กรุณาเลือกไซส์ก่อนทำการซื้อ');
            return;
        }
        const purchasedItem = {
            ...product,
            size: selectedSize,
            quantity,
        };
        navigate('/payment', { state: { item: purchasedItem } });
    };

    const handleAddToCart = () => {
        if (product.stock <= 0) {
            alert('สินค้าหมด');
            return;
        }

        if (!selectedSize) {
            alert('กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า');
            return;
        }

        const token = localStorage.getItem(ACCESS_TOKEN);
        axios.post('http://127.0.0.1:8000/myapp/cart/add/', {
            product_id: product.id,
            quantity: quantity,
            size_id: selectedSize.id
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log('เพิ่มสินค้าลงตะกร้าสำเร็จ:', response.data);
                alert("เพิ่มสินค้าลงตะกร้าสำเร็จแล้ว");
            })
            .catch(error => {
                console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error.response.data);
                alert('เกิดข้อผิดพลาด: ' + (error.response.data.error || 'ไม่ทราบข้อผิดพลาด'));
            });
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
            <div ref={productRef} className='product-container'>
                <div className='product-image-container'>
                    {product.images && product.images.length > 0 && (
                        <div className='product-images'>
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={`${product.name} ${index + 1}`}
                                    className='product-image'
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                <div className='product-detail-container'>
                    <div className='product-name'>{product.name.toUpperCase()}</div>
                    <div className='product-type'><p className='product-type-p'>{product.description.toUpperCase()}</p></div>
                    <div className='product-price'>{product.price} BAHT</div>

                    <h2 className='product-size'>SIZE</h2>
                    <div className='product-button-section'>
                        {sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => handleSizeSelect(size)}
                                className={`product-button ${selectedSize?.id === size.id ? 'selected' : ''}`}
                            >
                                {size.name}
                            </button>
                        ))}
                    </div>

                    <h2 className='product-quantity'>QUANTITY</h2>
                    <div className='quantity-controls'>
                        <button onClick={decrementQuantity} className='quantity-button'>−</button>
                        <span className='product-quanitiys'>{quantity}</span>
                        <button onClick={incrementQuantity} className='quantity-button'>+</button>
                    </div>

                    <button
                        onClick={handleBuyNow}
                        className='buy-button'
                    >
                        BUY NOW
                    </button>

                    <button
                        onClick={handleAddToCart}
                        className='add-to-cart-button'
                    >
                        ADD TO CART
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
