// import React, { useEffect, useState } from 'react';
// import { ACCESS_TOKEN } from '../constants.js';
// // import Nav from '../components/Nav.jsx';
// import Nav from '../components/Nav.jsx';
// import api from '../api.js';
// import '../styles/menstyle.css'


// function Men() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0); // สร้าง state เพื่อเก็บ index ของภาพที่แสดง
//     const username = localStorage.getItem('username'); 
//     const highlightImages = [
//         "/src/images/men/product4.png",
//         "/src/images/men/product1.png",
//         "/src/images/men/product2.png",
//         "/src/images/men/product3.png"
//     ]; // array ของรูปภาพใน Highlight Section

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             window.location.href = '/';
//         }
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             // เปลี่ยน index ของภาพทุก 3 วินาที
//             setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
//         }, 3000); // ทุก 3000ms (3 วินาที)

//         return () => clearInterval(interval); // เคลียร์ interval เมื่อ component ถูก unmount
//     }, [highlightImages.length]);

//     return (
        
//         <div>
//             {/* Hero Section */}
        
//             <Nav username={username} />
            
            
//             <div className='hero-section'>
//                 <div className='heroshadow'></div>
//                 <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-img' />
//             </div>

//             {/* Category Section */}
//             <div className='main-section'>
//                 <h2>Category</h2>
//                 <div className="product-grid">
//                     {/* Product item */}
//                     <div className="product-item">
//                         <img src="/src/images/men/product1.png" alt="Product 1" />
//                         <h3>Cashmere Crewneck Sweater</h3>
//                     </div>

//                     <div className="product-item">
//                         <img src="/src/images/men/product2.png" alt="Product 2" />
//                         <h3>Cashmere Crewneck Sweater</h3>
//                     </div>

//                     <div className="product-item">
//                         <img src="/src/images/men/product3.png" alt="Product 3" />
//                         <h3>Cashmere Crewneck Sweater</h3>
//                     </div>

//                     <div className="product-item">
//                         <img src="/src/images/men/product4.png" alt="Product 4" />
//                         <h3>Cashmere Crewneck Sweater</h3>
//                     </div>
//                 </div>
//                 {/* Highlight Section */}
//                 <div className='highlight-section'>
//                     <h2>Highlight</h2>
                    
//                     <div className="highlight-item">
//                         {/* ใช้ index เพื่อแสดงรูปภาพ */}
//                         <img src={highlightImages[currentImageIndex]} alt="Highlight" />
                        
//                     </div>
//                     <div className="dots-container">
//                         {highlightImages.map((_, index) => (
//                             <span
//                                 key={index}
//                                 className={`dot ${currentImageIndex === index ? 'active' : ''}`}
//                             ></span>
//                         ))}
//                     </div>
                    
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Men;


import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';  // นำเข้า Axios เพื่อใช้ในการดึงข้อมูลจาก backend
import '../styles/menstyle.css';

function Men() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // สร้าง state เพื่อเก็บ index ของภาพที่แสดง
    const [products, setProducts] = useState([]); // สร้าง state สำหรับเก็บข้อมูลสินค้า
    const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลดข้อมูล
    const [error, setError] = useState(null); // สร้าง state สำหรับเก็บข้อความผิดพลาด
    const username = localStorage.getItem('username'); 
    const highlightImages = [
        "/src/images/men/product4.png",
        "/src/images/men/product1.png",
        "/src/images/men/product2.png",
        "/src/images/men/product3.png"
    ]; // array ของรูปภาพใน Highlight Section

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก backend
    const fetchMenProducts = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/myapp/products/male/'); // ปรับ URL ตามการตั้งค่า backend
            setProducts(response.data); // บันทึกข้อมูลสินค้าที่ได้จาก backend
            setLoading(false); // ปิดสถานะโหลดเมื่อดึงข้อมูลเสร็จสิ้น
        } catch (err) {
            setError('Error fetching products.');
            setLoading(false); // ปิดสถานะโหลดเมื่อเกิดข้อผิดพลาด
        }
    };

    useEffect(() => {
        fetchMenProducts(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสินค้าหลังจาก mount component
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // เปลี่ยน index ของภาพทุก 3 วินาที
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
        }, 3000); // ทุก 3000ms (3 วินาที)

        return () => clearInterval(interval); // เคลียร์ interval เมื่อ component ถูก unmount
    }, [highlightImages.length]);

    return (
        <div>
            <Nav username={username} />
            
            {/* Hero Section */}
            <div className='hero-section'>
                <div className='heroshadow'></div>
                <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-img' />
            </div>

            {/* Category Section */}
            <div className='main-section'>
                <h2>Category</h2>
                {loading ? (
                    <p>Loading...</p>  // แสดงสถานะโหลด
                ) : error ? (
                    <p>{error}</p>  // แสดงข้อความผิดพลาด
                ) : (
                    <div className="product-grid">
                        {/* แสดงรายการสินค้าที่ดึงมาจาก backend */}
                        {products.map((product) => (
                            <div key={product.id} className="product-item">
                                {product.images.length > 0 && (
                                    <img
                                        src={`http://127.0.0.1:8000${product.images[0].image}`}
                                        alt={product.name}
                                        className="product-image"
                                    />
                                )}
                                <h3>{product.name}</h3>
                                <p>{product.description}</p>
                                <p>Price: {product.price}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Highlight Section */}
                <div className='highlight-section'>
                    <h2>Highlight</h2>
                    <div className="highlight-item">
                        <img src={highlightImages[currentImageIndex]} alt="Highlight" />
                    </div>
                    <div className="dots-container">
                        {highlightImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                            ></span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Men;
