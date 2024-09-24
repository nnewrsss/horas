import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants';
import '../styles/shop.css';

function Shop() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // สร้าง state เพื่อเก็บ index ของภาพที่แสดง
    const highlightImages = [
        "/src/images/shoppage/product4.png",
        "/src/images/shoppage/product1.png",
        "/src/images/shoppage/product2.png",
        "/src/images/shoppage/product3.png"
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
            {/* Hero Section */}
            <div className='hero-section'>
                <div className='heroshadow'></div>
                <img src="/src/images/shoppage/shopmain.png" alt="Shop Main" className='hero-img' />
            </div>

            {/* Category Section */}
            <div className='main-section'>
                <h2>Category</h2>
                <div className="product-grid">
                    {/* Product item */}
                    <div className="product-item">
                        <img src="/src/images/shoppage/product1.png" alt="Product 1" />
                        <h3>Cashmere Crewneck Sweater</h3>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/shoppage/product2.png" alt="Product 2" />
                        <h3>Cashmere Crewneck Sweater</h3>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/shoppage/product3.png" alt="Product 3" />
                        <h3>Cashmere Crewneck Sweater</h3>
                    </div>

                    <div className="product-item">
                        <img src="/src/images/shoppage/product4.png" alt="Product 4" />
                        <h3>Cashmere Crewneck Sweater</h3>
                    </div>
                </div>
                {/* Highlight Section */}
                <div className='highlight-section'>
                    <h2>Highlight</h2>
                    
                    <div className="highlight-item">
                        {/* ใช้ index เพื่อแสดงรูปภาพ */}
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

export default Shop;