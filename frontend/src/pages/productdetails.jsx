// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Nav from '../components/Nav';
// import { ACCESS_TOKEN } from '../constants';

// function ProductDetails() {
//     const { productId } = useParams();
//     const [product, setProduct] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [sizes, setSizes] = useState([]);
//     const [selectedSize, setSelectedSize] = useState(null);
//     const [quantity, setQuantity] = useState(1); // เก็บจำนวนสินค้าที่เลือก
//     const navigate = useNavigate();
//     const username = localStorage.getItem('username');

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             navigate('/');
//         }
//     }, [navigate]);

//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/myapp/products/${productId}/`);
//                 setProduct(response.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error("Error fetching product details:", err);
//                 setError('Error fetching product details');
//                 setLoading(false);
//             }
//         };

//         fetchProductDetails();
//     }, [productId]);

//     useEffect(() => {
//         const fetchSizes = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/myapp/sizes/');
//                 setSizes(response.data);
//             } catch (error) {
//                 console.error("Error fetching sizes:", error);
//             }
//         };

//         fetchSizes();
//     }, []);

//     const handleSizeSelect = (size) => {
//         setSelectedSize(size);
//     };

//     const incrementQuantity = () => {
//         if (quantity < product.stock) {
//             setQuantity(quantity + 1);
//         }
//     };

//     const decrementQuantity = () => {
//         if (quantity > 1) {
//             setQuantity(quantity - 1);
//         }
//     };

//     const handleBuyNow = () => {
//         if (product.stock <= 0) {
//             alert('สินค้าหมด');
//             return;
//         }

//         if (!selectedSize) {
//             alert('กรุณาเลือกไซส์ก่อนทำการซื้อ');
//             return;
//         }

//         const purchasedItem = { ...product, size: selectedSize, quantity };
//         console.log('Sending purchased item:', purchasedItem);
//         navigate('/payment', { state: { item: purchasedItem } });
//     };

//     // const handleAddToCart = () => {
//     //     if (product.stock <= 0) {
//     //         alert('สินค้าหมด');
//     //         return;
//     //     }

//     //     if (!selectedSize) {
//     //         alert('กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า');
//     //         return;
//     //     }

//     //     const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
//     //     const itemWithSizeAndQuantity = { ...product, size: selectedSize, quantity };
//     //     cartItems.push(itemWithSizeAndQuantity);
//     //     localStorage.setItem('cart', JSON.stringify(cartItems));
//     //     navigate('/cart');
//     // };


//     const handleAddToCart = () => {
//         if (product.stock <= 0) {
//             alert('สินค้าหมด');
//             return;
//         }
    
//         if (!selectedSize) {
//             alert('กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า');
//             return;
//         }
    
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         axios.post('http://127.0.0.1:8000/myapp/cart/add/', {
//             product_id: product.id,
//             quantity: quantity,
//             size_id: selectedSize.id
//         }, {
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             }
//         })
//         .then(response => {
//             console.log('เพิ่มสินค้าลงตะกร้าสำเร็จ:', response.data);
//             navigate('/cart');
//         })
//         .catch(error => {
//             console.error('เกิดข้อผิดพลาดในการเพิ่มสินค้า:', error.response.data);
//             alert('เกิดข้อผิดพลาด: ' + (error.response.data.error || 'ไม่ทราบข้อผิดพลาด'));
//         });
//     };
    

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div>
//             <Nav username={username} />

//             {product && (
//                 <div>
//                     <h1>{product.name}</h1>
//                     <p>{product.description}</p>
//                     <p>Price: ${product.price}</p>
//                     <p>จำนวนที่เหลืออยู่ใน Stock: {product.stock}</p>

//                     {product.images && product.images.length > 0 && (
//                         <div>
//                             {product.images.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={image.image}
//                                     alt={`${product.name} ${index + 1}`}
//                                     className='product-image'
//                                     style={{ width: '300px', height: 'auto', marginRight: '10px' }}
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     <h2>Select a Size</h2>
//                     <div>
//                         {sizes.map((size) => (
//                             <button
//                                 key={size.id}
//                                 onClick={() => handleSizeSelect(size)}
//                                 style={{
//                                     padding: '10px',
//                                     margin: '5px',
//                                     backgroundColor: selectedSize?.id === size.id ? 'green' : 'lightgray',
//                                     color: 'white'
//                                 }}
//                             >
//                                 {size.name}
//                             </button>
//                         ))}
//                     </div>

//                     <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
//                         <button onClick={decrementQuantity} style={{ padding: '10px' }}>−</button>
//                         <span style={{ margin: '0 10px' }}>{quantity}</span>
//                         <button onClick={incrementQuantity} style={{ padding: '10px' }}>+</button>
//                     </div>

//                     <button
//                         onClick={handleBuyNow}
//                         style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}
//                     >
//                         ซื้อสินค้า
//                     </button>

//                     <button
//                         onClick={handleAddToCart}
//                         style={{ margin: '10px', padding: '10px', backgroundColor: 'orange', color: 'white' }}
//                     >
//                         เพิ่มสินค้าเข้าตะกร้า
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default ProductDetails;



// productdetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    const [quantity, setQuantity] = useState(1); // เก็บจำนวนสินค้าที่เลือก
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

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
        //alert(`คุณได้ทำการซื้อสินค้า ${quantity} ชิ้น ไซส์: ${selectedSize ? selectedSize.name : 'ไม่ได้เลือก'} เรียบร้อยแล้ว!`);
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
                fetchCartItems(); // ดึงข้อมูลตะกร้าใหม่

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
            <div className='product-container'>
                <div className='product-image-container'>
                    {product.images && product.images.length > 0 && (
                        <div className='product-images' >
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={`${product.name} ${index + 1}`}
                                    className='product-image'
                                    style={{ width: '100%', height: '100vh' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className='product-detail-container'>
                    <div className='product-name'>{product.name}</div>
                    <p>{product.description}</p>
                    <p>{product.price} BAHT</p>
                    {/* <p>Stock: {product.stock}</p> */}

                    {product && (
                        <div>
                            <div>
                                <h2 >Size</h2>
                                <div style={{ display: 'flex', overflowX: 'auto', gap: '3px' }}>
                                    {sizes.map((size) => (
                                        <button
                                            key={size.id}
                                            onClick={() => handleSizeSelect(size)}
                                            style={{
                                                padding: '10px',
                                                backgroundColor: selectedSize?.id === size.id ? 'black' : 'lightgray',
                                                color: 'white',
                                                cursor: 'pointer',
                                                whiteSpace: 'nowrap',
                                                width: '40px',
                                                height: '40px',
                                            }}
                                        >
                                            {size.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                                <button onClick={decrementQuantity} style={{ padding: '10px' }}>−</button>
                                <span style={{ margin: '0 10px' }}>{quantity}</span>
                                <button onClick={incrementQuantity} style={{ padding: '10px' }}>+</button>
                            </div>

                            <button
                                onClick={handleBuyNow}
                                style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}
                            >
                                ซื้อสินค้า
                            </button>

                            <button
                                onClick={handleAddToCart}
                                style={{ margin: '10px', padding: '10px', backgroundColor: 'orange', color: 'white' }}
                            >
                                เพิ่มสินค้าเข้าตะกร้า
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;