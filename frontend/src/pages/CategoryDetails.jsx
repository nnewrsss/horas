// // import React, { useEffect, useState } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';
// // import Nav from '../components/Nav.jsx';
// // import { ACCESS_TOKEN } from '../constants.js';

// // function CategoryDetails() {
// //     const { subcategoryType } = useParams(); // Get subcategoryType from URL
// //     const [products, setProducts] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const username = localStorage.getItem('username');
// //     const navigate = useNavigate(); // Navigate to the category product page

// //     useEffect(() => {
// //         const token = localStorage.getItem(ACCESS_TOKEN);
// //         if (!token) {
// //             window.location.href = '/'; // Redirect to login if no token
// //         }
// //     }, []);

// //     useEffect(() => {
// //         const fetchProducts = async () => {
// //             try {
// //                 const url = `http://127.0.0.1:8000/myapp/${subcategoryType}/`;
// //                 console.log("Subcategory Type from URL:", subcategoryType); // Log subcategoryType
// //                 console.log("Request URL:", url); // Log the request URL
// //                 const response = await axios.get(url);
// //                 console.log("Response Data:", response.data); // Log the response data
                
// //                 setProducts(response.data);
// //                 setLoading(false);
// //             } catch (err) {
// //                 console.log("Error:", err); // Log the error if there is one
// //                 setError('Error fetching products.');
// //                 setLoading(false);
// //             }
// //         };
    
// //         fetchProducts();
// //     }, [subcategoryType]); // Will run when subcategoryType changes

// //     const handleProductClick = (productId) => {
// //         console.log("Product ID:", productId);  // Show productId in console
// //         navigate(`/categoryproduct/${productId}`);  // Navigate to product page with productId
// //     };
    
// //     if (loading) {
// //         return <p>Loading...</p>;
// //     }

// //     if (error) {
// //         return <p>{error}</p>;
// //     }

// //     return (
// //         <div>
// //             <Nav username={username} />
// //             <div className='product-details-container'>
// //                 <h1>Products in {subcategoryType}</h1>
// //                 <div className='products-grid'>
// //                     {products.map(product => (
// //                         <div key={product.id} className='product-card'>
// //                             {product.images && product.images.length > 0 && (
// //                                 <img
// //                                     src={`http://127.0.0.1:8000${product.images[0].image}`}
// //                                     alt={product.name}
// //                                     className='product-image'
// //                                 />
// //                             )}
// //                             <div className='product-info'>
// //                                 <h2>{product.name}</h2>
// //                                 <p>{product.description}</p>
// //                                 <p>Price: ${product.price}</p>
// //                                 <button
// //                                     onClick={() => {
// //                                         console.log("Product ID:", product.id);  // Show productId in console
// //                                         handleProductClick(product.id);
// //                                     }}
// //                                     className='view-product-button'
// //                                 >
// //                                     View Products
// //                                 </button>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default CategoryDetails;

// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import Nav from '../components/Nav.jsx';
// import { ACCESS_TOKEN } from '../constants.js';

// function CategoryDetails() {
//     const { subcategoryType } = useParams();
//     const [category, setCategory] = useState([]);
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const username = localStorage.getItem('username');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             navigate('/');
//         }
//     }, [navigate]);

//     useEffect(() => {
//         const fetchData = async () => {
//             const token = localStorage.getItem(ACCESS_TOKEN);
//             if (!token) {
//                 setError('ไม่มีสิทธิ์เข้าถึงข้อมูล');
//                 setLoading(false);
//                 return;
//             }

//             try {
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 };

//                 const categoryUrl = `http://127.0.0.1:8000/myapp/${subcategoryType}/`;
//                 const productsUrl = `http://127.0.0.1:8000/myapp/categoryproducts/${subcategoryType}/`;

//                 console.log(`Fetching category data from: ${categoryUrl}`);
//                 console.log(`Fetching products data from: ${productsUrl}`);

//                 const [categoryResponse, productsResponse] = await Promise.all([
//                     axios.get(categoryUrl, config),
//                     axios.get(productsUrl, config),
//                 ]);

//                 console.log('Category Response:', categoryResponse.data);
//                 console.log('Products Response:', productsResponse.data);

//                 setCategory(categoryResponse.data);
//                 setProducts(productsResponse.data);
//                 setLoading(false);
//             } catch (err) {
//                 console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
//                 setError('ไม่สามารถดึงข้อมูลได้');
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [subcategoryType]);

//     const handleCategoryClick = (categoryId) => {
//         navigate(`/categoryproduct/${categoryId}`);
//     };

//     const handleProductClick = (productId) => {
//         navigate(`/product/${productId}`);  // นำไปยังหน้ารายละเอียดสินค้า
//     };
    

//     if (loading) {
//         return <p>กำลังโหลดข้อมูล...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div>
//             <Nav username={username} />
//             <div className='category-details-container'>
//                 <h2>หมวดหมู่</h2>
//                 <div className='categories-grid'>
//                 {category.length > 0 ? (
//     category.map((cat) => (
//         <div key={cat.id} className='category-card'>
//             {cat.images && cat.images.length > 0 ? (
//                 <img
//                     src={`http://127.0.0.1:8000${cat.images[0].image}`} // เข้าถึงภาพแรกใน Array
//                     alt={cat.name}
//                     className='category-image'
//                 />
//             ) : (
//                 <img
//                     src='/path/to/default-category-image.jpg' // รูปภาพเริ่มต้นหากไม่มีรูป
//                     alt='Default Category'
//                     className='category-image'
//                 />
//             )}
//             <h3>{cat.name}</h3>
//             <p>ID: {cat.id}</p>
//             <p>Parent Category: {cat.parent_name}</p>
//             <button
//                 onClick={() => handleCategoryClick(cat.id)}
//                 className='view-category-button'
//             >
//                 ดูรายละเอียดหมวดหมู่
//             </button>
//         </div>
//     ))
// ) : (
//     <p>ไม่มีหมวดหมู่ที่จะแสดง</p>
// )}

//                 </div>
//             </div>

//             <div className='product-details-container'>
//                 <h2>สินค้าภายในหมวดหมู่</h2>
//                 <div className='products-grid'>
//                     {products.length > 0 ? (
//                         products.map((product) => (
//                             <div key={product.id} className='product-card'>
//                                 {product.images && product.images.length > 0 ? (
//                                     <img
//                                         src={`http://127.0.0.1:8000${product.images[0].image}`}
//                                         alt={product.name}
//                                         className='product-image'
//                                     />
//                                 ) : (
//                                     <img
//                                         src='/path/to/default-product-image.jpg'
//                                         alt='Default Product'
//                                         className='product-image'
//                                     />
//                                 )}
//                                 <div className='product-info'>
//                                     <h3>{product.name}</h3>
//                                     <p>{product.description}</p>
//                                     <p>ราคา: {product.price} บาท</p>
//                                     <button
//                                         onClick={() => handleProductClick(product.id)}
//                                         className='view-product-button'
//                                     >
//                                         ดูรายละเอียดสินค้า
//                                     </button>
//                                 </div>
//                             </div>
//                         ))
//                     ) : (
//                         <p>ไม่มีสินค้าที่จะแสดง</p>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default CategoryDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav.jsx';
import '../styles/cat.css';
import { ACCESS_TOKEN } from '../constants.js';

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
                {/* เพิ่มเนื้อหาตามต้องการ */}
            </div>

            <div className='category-details-container'>
                {/* จัดกึ่งกลาง subheader */}
                <h2 className='subheader' style={{ fontFamily: 'LeJeuneDeck-Regular,Times New Roman,Times,serif' }}>Top Category</h2>
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
                                <h3>{cat.name}</h3>
                                {/* ลบปุ่มดูรายละเอียดออก */}
                            </div>
                        ))
                    ) : (
                        <p>ไม่มีหมวดหมู่ที่จะแสดง</p>
                    )}
                </div>
            </div>

            <div className='product-details-container'>
                <h2 className='subheader' style={{ fontFamily: 'LeJeuneDeck-Regular,Times New Roman,Times,serif' }}>Top</h2>
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
                                    <p>{product.price} BATH</p>
                                    {/* ลบปุ่มดูรายละเอียดสินค้าออก */}
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

export default CategoryDetails;