import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';  
import '../styles/menstyle.css';

function Men() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0); 
    const [maleCategories, setMaleCategories] = useState([]); 
    const [maleBottomCategories, setMaleBottomCategories] = useState([]); 
    const [maleBagsCategories, setMaleBagsCategories] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 
    const username = localStorage.getItem('username'); 
    const highlightImages = [
        "/src/images/men/product4.png",
        "/src/images/men/product1.png",
        "/src/images/men/product2.png",
        "/src/images/men/product3.png"
    ]; 

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    // ฟังก์ชันสำหรับดึงข้อมูลจากหลาย API path
    const fetchMenCategories = async () => {
        try {
            const [maleSubcategories, maleBottomSubcategories, maleBagsSubcategories] = await Promise.all([
                axios.get('http://127.0.0.1:8000/myapp/femalesubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/femalebottomsubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/femalebagssubcategories/')
            ]);

            // ตั้งค่าข้อมูลของแต่ละหมวดหมู่
            setMaleCategories(maleSubcategories.data);
            setMaleBottomCategories(maleBottomSubcategories.data);
            setMaleBagsCategories(maleBagsSubcategories.data);
            setLoading(false); 
        } catch (err) {
            console.log(err); 
            setError('Error fetching categories.');
            setLoading(false); 
        }
    };

    useEffect(() => {
        fetchMenCategories(); 
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
        }, 3000); 

        return () => clearInterval(interval); 
    }, [highlightImages.length]);

    return (
        <div>
            <Nav username={username} />
            
            <div className='hero-section'>
                <div className='heroshadow'></div>
                <img src="/src/images/women/shopmain.jpg" alt="Shop Main" className='hero-img' />
            </div>

            <div className='main-section'>
                <h2>CATEGORIES</h2>
                {loading ? (
                    <p>Loading...</p> 
                ) : error ? (
                    <p>{error}</p> 
                ) : (
                    <>
                       {/* หมวดหมู่ Male */}
{/* หมวดหมู่ Male */}
<h3>Male</h3>
<div className="subcategory-buttons">
    {maleCategories.map((category) => (
        category.subcategories.map((subcategory) => (
            <button
                key={subcategory.id}  
                className="subcategory-button"
                onClick={() => alert(`Selected: ${subcategory.name}`)} 
            >
                {/* แสดงรูปภาพของ subcategory ถ้ามี */}
                {subcategory.images && subcategory.images.length > 0 && (
                    <img 
                        src={`http://127.0.0.1:8000${subcategory.images[0].image}`} 
                        alt={subcategory.name} 
                        className="subcategory-image"
                    />
                )}
                {subcategory.name} {/* แสดงชื่อของ subcategory */}
            </button>
        ))
    ))}
</div>



                    </>
                )}

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


