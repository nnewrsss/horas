import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
// import Nav from '../components/Nav.jsx';
import Nav from '../components/Nav.jsx';
import api from '../api.js';
import '../styles/femalestyle.css'


function Female() {
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
            <div className='female_hero_section'>
                <img src='src/images/female/heroo.png' className='female-hero-image'></img>
            </div>
            
            {/* Category Section */}
            <div className='main-section'>
                <h2 className='cate-head'>Category</h2>
                <div className="product-grid">
                    {/* Product item */}
                    <div className="product-item">
                        <img src="/src/images/female/top.png" alt="Product 1" />
                        <div className="text-overlay">Top</div>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/female/buttom.png" alt="Product 2" />
                        <div className="text-overlay">Buttom</div>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/female/bag.png" alt="Product 3" />
                        <div className="text-overlay">Bag</div>
                    </div>
                </div>
            </div>

            {/* Highlight */}
            <div className='highlight'>
                <div className='highlight-image-section'>
                    {/* <div className='heroshadow'></div> */}
                    <img src="/src/images/female/highlight.png" className="highlight-image" />
                </div>
            </div>

            
        </div>
    );
}

export default Female;