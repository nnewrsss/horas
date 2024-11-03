import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/menstyle.css';
import Black from '../components/blackinfo.jsx';

function Men() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [highlightImages, setHighlightImages] = useState([]);
    const [maleCategories, setMaleCategories] = useState([]);
    const [maleBottomCategories, setMaleBottomCategories] = useState([]);
    const [maleBagsCategories, setMaleBagsCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    // ดึงข้อมูลหมวดหมู่จาก API โดยเช็คว่ามี token หรือไม่
    const fetchMenCategories = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [maleSubcategories, maleBottomSubcategories, maleBagsSubcategories] = await Promise.all([
                axios.get('http://127.0.0.1:8000/myapp/malesubcategories/', { headers }),
                axios.get('http://127.0.0.1:8000/myapp/malebottomsubcategories/', { headers }),
                axios.get('http://127.0.0.1:8000/myapp/malebagssubcategories/', { headers })
            ]);

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

    // ดึงข้อมูลหมวดหมู่เมื่อ component ถูก mount
    useEffect(() => {
        fetchMenCategories();
    }, []);

    // นำเข้าภาพทั้งหมดจากโฟลเดอร์ slide-images
    useEffect(() => {
        const images = [];
        const importAll = import.meta.glob('../images/men/slide-images/*.{png,jpg,jpeg,svg}', { eager: true });
        for (const path in importAll) {
            images.push(importAll[path].default);
        }
        setHighlightImages(images);
    }, []);

    // เอฟเฟกต์สไลด์ภาพ
    useEffect(() => {
        if (highlightImages.length > 0) {
            const interval = setInterval(() => {
                setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
            }, 12000);

            return () => clearInterval(interval);
        }
    }, [highlightImages]);

    // จัดการการนำทางไปยังหน้าหมวดหมู่เฉพาะ
    const handleCategoryClick = (subcategoryType) => {
        navigate(`/categorydetails/${subcategoryType}`);
    };

    return (
        <div>
            <Nav username={username} />

            <div className='hero-section_men'>
                <div className='men-title'>MALE</div>
                <div className='video-heroshadow'></div>
                <div className="video-background">
                    <video autoPlay loop muted>
                        <source src="src/videos/men.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* ส่วนหมวดหมู่ */}
            <div className='main-section'>
                <h2 className='cate-head'>Category</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="product-grid">
                        <div className="product-item" onClick={() => handleCategoryClick('maletopsubcategories')}>
                            <img src="/src/images/men/top.png" alt="Top" />
                            <div className="text-overlay">Top</div>
                        </div>

                        <div className="product-item" onClick={() => handleCategoryClick('malebottomsubcategories')}>
                            <img src="/src/images/men/buttoms.png" alt="Bottom" />
                            <div className="text-overlay">Bottom</div>
                        </div>

                        <div className="product-item" onClick={() => handleCategoryClick('malebagssubcategories')}>
                            <img src="/src/images/men/bags.png" alt="Bag" />
                            <div className="text-overlay">Bag</div>
                        </div>
                    </div>
                )}
            </div>

            {/* ส่วนสไลด์ภาพ */}
            <div className='Slide-image'>
                <div
                    className='slideshow-container'
                    style={{
                        transform: `translateX(-${currentImageIndex * (250 / highlightImages.length)}%)`,
                        transition: 'transform 1s ease-in-out',
                        width: `${highlightImages.length * 70}%`,
                    }}
                >
                    {highlightImages.map((image, index) => (
                        <div className='slide' key={index}>
                            <img src={image} alt={`Slide ${index}`} />
                        </div>
                    ))}
                </div>
            </div>
            <Black/>
        </div>
    );
}

export default Men;
