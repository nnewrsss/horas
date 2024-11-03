import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use for page navigation
import '../styles/femalestyle.css';
import Black from '../components/blackinfo.jsx';

function Female() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [femaleCategories, setFemaleCategories] = useState([]);
    const [femaleBottomCategories, setFemaleBottomCategories] = useState([]);
    const [femaleBagsCategories, setFemaleBagsCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username') || 'Free User';
    const navigate = useNavigate();

    const highlightImages = [
        "/src/images/female/product4.png",
        "/src/images/female/product1.png",
        "/src/images/female/product2.png",
        "/src/images/female/product3.png"
    ];

    // Fetch categories data from API
    const fetchFemaleCategories = async () => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN);
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [femaleSubcategories, femaleBottomSubcategories, femaleBagsSubcategories] = await Promise.all([
                axios.get('http://127.0.0.1:8000/myapp/femalesubcategories/', { headers }),
                axios.get('http://127.0.0.1:8000/myapp/femalebottomsubcategories/', { headers }),
                axios.get('http://127.0.0.1:8000/myapp/femalebagssubcategories/', { headers })
            ]);

            setFemaleCategories(femaleSubcategories.data);
            setFemaleBottomCategories(femaleBottomSubcategories.data);
            setFemaleBagsCategories(femaleBagsSubcategories.data);
            setLoading(false);
        } catch (err) {
            console.log(err);
            setError('Error fetching categories.');
            setLoading(false);
        }
    };

    // Fetch categories on component mount
    useEffect(() => {
        fetchFemaleCategories();
    }, []);

    // Image slider effect for the highlight section
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
        }, 3000);

        return () => clearInterval(interval);
    }, [highlightImages.length]);

    // Handle navigation to specific category page
    const handleCategoryClick = (subcategoryType) => {
        navigate(`/categorydetails/${subcategoryType}`);
    };

    return (
        <div>
            <Nav username={username} />

            {/* Hero Section */}
            <div className='female_hero_section'>
                <div className='men-title'>FEMALE</div>
                <div className='video-heroshadow'></div>
                <div className="video-background">
                    <video autoPlay loop muted>
                        <source src="src/videos/female.mp4" type="video/mp4" />
                    </video>
                </div>
            </div>

            {/* Category Section */}
            <div className='main-section'>
                <h2 className='cate-head'>Category</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <div className="product-grid">
                        <div className="product-item" onClick={() => handleCategoryClick('femaletopsubcategories')}>
                            <img src="/src/images/female/top.png" alt="Top" />
                            <div className="text-overlay">Top</div>
                        </div>

                        <div className="product-item" onClick={() => handleCategoryClick('femalebottomsubcategories')}>
                            <img src="/src/images/female/buttom.png" alt="Bottom" />
                            <div className="text-overlay">Bottom</div>
                        </div>

                        <div className="product-item" onClick={() => handleCategoryClick('femalebagssubcategories')}>
                            <img src="/src/images/female/bag.png" alt="Bag" />
                            <div className="text-overlay">Bag</div>
                        </div>
                    </div>
                )}
            </div>
            <Black/>
        </div>
    );
}

export default Female;
