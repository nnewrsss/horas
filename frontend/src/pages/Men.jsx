import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
// import Nav from '../components/Nav.jsx';
import Nav from '../components/Nav.jsx';
import api from '../api.js';
import '../styles/menstyle.css'


function Men() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // สร้าง state เพื่อเก็บ index ของภาพที่แสดง
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
            
            <div className='hero-section_men'>
                <div className='heroshadow'></div>
                <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-imgs' />
            </div>

            {/* Category Section */}
            <div className='main-section'>
                <h2 className='cate-head'>Category</h2>
                <div className="product-grid">
                    {/* Product item */}
                    <div className="product-item">
                        <img src="/src/images/men/top.png" alt="Product 1" />
                        <div className="text-overlay">Top</div>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/men/buttoms.png" alt="Product 2" />
                        <div className="text-overlay">Buttom</div>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/men/bags.png" alt="Product 3" />
                        <div className="text-overlay">Bag</div>
                    </div>
                </div>
            </div>

                {/* Highlight Section */}
                {/*<div className='highlight-section'>
                    <h2>Highlight</h2>
                    
                    <div className="highlight-item">
                        {/* ใช้ index เพื่อแสดงรูปภาพ */}
                        {/* <img src={highlightImages[currentImageIndex]} alt="Highlight" /> */}
                        
                    {/* </div> */}
                    {/* <div className="dots-container">
                        {highlightImages.map((_, index) => (
                            <span
                                key={index}
                                className={`dot ${currentImageIndex === index ? 'active' : ''}`}
                            ></span>
                        ))}
                    </div>
                </div> */}
  
        </div>
    );
}

export default Men;