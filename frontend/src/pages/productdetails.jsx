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
//     const navigate = useNavigate();
//     const username = localStorage.getItem('username');  // ดึงข้อมูล username จาก localStorage

//     // ตรวจสอบว่า ACCESS_TOKEN มีใน localStorage หรือไม่ ถ้าไม่มีจะนำทางไปที่หน้า login
//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             navigate('/');  // ถ้าไม่มี token ให้กลับไปหน้า login
//         }
//     }, [navigate]);

//     // Fetch product details
//     useEffect(() => {
//         const fetchProductDetails = async () => {
//             try {
//                 const response = await axios.get(`http://127.0.0.1:8000/myapp/products/${productId}/`);
//                 console.log("Product Details:", response.data);
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

//     // Fetch sizes from the API
//     useEffect(() => {
//         const fetchSizes = async () => {
//             try {
//                 const response = await axios.get('http://127.0.0.1:8000/myapp/sizes/');
//                 console.log("Sizes:", response.data);
//                 setSizes(response.data);
//             } catch (error) {
//                 console.error("Error fetching sizes:", error);
//             }
//         };

//         fetchSizes();
//     }, []);

//     // Function to handle size selection
//     const handleSizeSelect = (size) => {
//         setSelectedSize(size);
//         alert(`Selected size: ${size.name}`);
//     };

//     // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "ซื้อสินค้า"
//     const handleBuyNow = () => {
//         alert(`คุณได้ทำการซื้อสินค้าไซส์: ${selectedSize ? selectedSize.name : 'ไม่มีการเลือกไซส์'} เรียบร้อยแล้ว!`);
//         // คุณสามารถเพิ่มการทำงานเพิ่มเติมที่นี่ เช่น การนำไปยังหน้าชำระเงิน
//     };

//     // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม "เพิ่มสินค้าเข้าตะกร้า"
//     const handleAddToCart = () => {
//         if (!selectedSize) {
//             alert('กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า');
//             return;
//         }
//         const cartItems = JSON.parse(localStorage.getItem('cart')) || [];  // ดึงสินค้าที่อยู่ในตะกร้า (ถ้ามี)
//         const itemWithSize = { ...product, size: selectedSize };  // เพิ่มไซส์ที่เลือกไปยังสินค้าที่จะเพิ่มในตะกร้า
//         cartItems.push(itemWithSize);  // เพิ่มสินค้าลงในตะกร้า
//         localStorage.setItem('cart', JSON.stringify(cartItems));  // เก็บตะกร้าลงใน localStorage
//         alert('เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว!');
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div>
//             {/* เพิ่ม Nav โดยส่ง username ที่ดึงจาก localStorage ไปด้วย */}
//             <Nav username={username} />

//             {product && (
//                 <div>
//                     <h1>{product.name}</h1>  {/* แสดงชื่อสินค้า */}
//                     <p>{product.description}</p>  {/* แสดงรายละเอียดสินค้า */}
//                     <p>Price: ${product.price}</p>  {/* แสดงราคาสินค้า */}
//                     <p>Stock: {product.stock}</p>  {/* แสดงจำนวนสต็อก */}

//                     {/* แสดงรูปภาพสินค้า */}
//                     {product.images && product.images.length > 0 && (
//                         <div>
//                             {product.images.map((image, index) => (
//                                 <img
//                                     key={index}
//                                     src={image.image}
//                                     alt={`${product.name} ${index + 1}`}  // Use a unique alt text for each image
//                                     className='product-image'
//                                     style={{ width: '300px', height: 'auto', marginRight: '10px' }}  // Add some margin for spacing between images
//                                 />
//                             ))}
//                         </div>
//                     )}

//                     {/* Size Selection */}
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

//                     {selectedSize && (
//                         <p>You selected: {selectedSize.name}</p>
//                     )}

//                     {/* ปุ่มซื้อสินค้า */}
//                     <button
//                         onClick={handleBuyNow}
//                         style={{ margin: '10px', padding: '10px', backgroundColor: 'green', color: 'white' }}
//                     >
//                         ซื้อสินค้า
//                     </button>

//                     {/* ปุ่มเพิ่มสินค้าลงในตะกร้า */}
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

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav';
import { ACCESS_TOKEN } from '../constants';

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
        alert(`Selected size: ${size.name}`);
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
        alert(`คุณได้ทำการซื้อสินค้า ${quantity} ชิ้น ไซส์: ${selectedSize ? selectedSize.name : 'ไม่ได้เลือก'} เรียบร้อยแล้ว!`);
    };

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('กรุณาเลือกไซส์ก่อนเพิ่มสินค้าลงตะกร้า');
            return;
        }
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const itemWithSizeAndQuantity = { ...product, size: selectedSize, quantity };
        cartItems.push(itemWithSizeAndQuantity);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        alert('เพิ่มสินค้าเข้าตะกร้าเรียบร้อยแล้ว!');
        navigate('/cart');
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

            {product && (
                <div>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <p>Price: ${product.price}</p>
                    <p>Stock: {product.stock}</p>

                    {product.images && product.images.length > 0 && (
                        <div>
                            {product.images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.image}
                                    alt={`${product.name} ${index + 1}`}
                                    className='product-image'
                                    style={{ width: '300px', height: 'auto', marginRight: '10px' }}
                                />
                            ))}
                        </div>
                    )}

                    <h2>Select a Size</h2>
                    <div>
                        {sizes.map((size) => (
                            <button
                                key={size.id}
                                onClick={() => handleSizeSelect(size)}
                                style={{
                                    padding: '10px',
                                    margin: '5px',
                                    backgroundColor: selectedSize?.id === size.id ? 'green' : 'lightgray',
                                    color: 'white'
                                }}
                            >
                                {size.name}
                            </button>
                        ))}
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
    );
}

export default ProductDetails;