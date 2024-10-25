// import React, { useEffect, useState } from 'react';
// import { ACCESS_TOKEN } from '../constants.js';
// import Nav from '../components/Nav.jsx';
// import axios from 'axios';  
// import '../styles/menstyle.css';
// import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate สำหรับการเปลี่ยนหน้า

// function Female() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0); 
//     const [femaleCategories, setFemaleCategories] = useState([]); 
//     const [maleBottomCategories, setFeMaleBottomCategories] = useState([]); 
//     const [maleBagsCategories, setFeMaleBagsCategories] = useState([]); 
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState(null); 
//     const username = localStorage.getItem('username'); 
//     const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนหน้า
//     const highlightImages = [
//         "/src/images/female/product4.png",
//         "/src/images/female/product1.png",
//         "/src/images/female/product2.png",
//         "/src/images/female/product3.png"
//     ]; 

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             window.location.href = '/';
//         }
//     }, []);

//     const fetchFemaleCategories = async () => {
//         try {
//             const [femaleSubcategories, femaleBottomSubcategories, femaleBagsSubcategories] = await Promise.all([
//                 axios.get('http://127.0.0.1:8000/myapp/femalesubcategories/'),
//                 axios.get('http://127.0.0.1:8000/myapp/femalebottomsubcategories/'),
//                 axios.get('http://127.0.0.1:8000/myapp/femalebagssubcategories/')
//             ]);

//             setFemaleCategories(femaleSubcategories.data);
//             setFeMaleBottomCategories(femaleBottomSubcategories.data);
//             setFeMaleBagsCategories(femaleBagsSubcategories.data);
//             setLoading(false); 
//         } catch (err) {
//             console.log(err); 
//             setError('Error fetching categories.');
//             setLoading(false); 
//         }
//     };

//     useEffect(() => {
//         fetchFemaleCategories(); 
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
//         }, 3000); 

//         return () => clearInterval(interval); 
//     }, [highlightImages.length]);

//     // ฟังก์ชันเปลี่ยนหน้าและส่งข้อมูล category ID
//     const handleCategoryClick = (subcategoryType) => {
//         console.log(subcategoryType); // เพิ่มการแสดงค่า subcategoryType เพื่อตรวจสอบ
//         navigate(`/categorydetails/${subcategoryType}`);
//     };



//     return (
//         <div>
//             <Nav username={username} />

//             <div className='hero-section'>
//                 <div className='heroshadow'></div>
//                 <img src="/src/images/women/shopmain.jpg" alt="Shop Main" className='hero-img' />
//             </div>

//             <div className='main-section'>
//                 <h2>CATEGORIES</h2>
//                 {loading ? (
//                     <p>Loading...</p> 
//                 ) : error ? (
//                     <p>{error}</p> 
//                 ) : (
//                     <>
//                        {/* หมวดหมู่ Female */}
//                        <h3>Female</h3>

//                        <div className="subcategory-buttons">
//                            <button
//                                className="subcategory-button"
//                                onClick={() => handleCategoryClick('femaletopsubcategories')}
//                            >
//                                Female Tops
//                                <img src="src/images/female/product1.png" alt="Shop main"/>
//                            </button>
//                            <button
//                                className="subcategory-button"
//                                onClick={() => handleCategoryClick('femalebottomsubcategories')}
//                            >
//                                Female Bottoms
//                                <img src="src/images/female/product2.png" alt="Shop main"/>
//                            </button>
//                            <button
//                                className="subcategory-button"
//                                onClick={() => handleCategoryClick('femalebagssubcategories')}
//                            >
//                                Female Bags
//                                <img src="src/images/female/product3.png" alt="Shop main" />
//                            </button>
//                        </div>

//                     </>
//                 )}

//                 <div className='highlight-section'>
//                     <h2>Highlight</h2>
//                     <div className="highlight-item">
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

// export default Female;































































import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Use for page navigation
import '../styles/femalestyle.css';

function Female() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [femaleCategories, setFemaleCategories] = useState([]);
    const [femaleBottomCategories, setFemaleBottomCategories] = useState([]);
    const [femaleBagsCategories, setFemaleBagsCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const highlightImages = [
        "/src/images/female/product4.png",
        "/src/images/female/product1.png",
        "/src/images/female/product2.png",
        "/src/images/female/product3.png"
    ];

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    // Fetch categories data from API
    const fetchFemaleCategories = async () => {
        try {
            const [femaleSubcategories, femaleBottomSubcategories, femaleBagsSubcategories] = await Promise.all([
                axios.get('http://127.0.0.1:8000/myapp/femalesubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/femalebottomsubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/femalebagssubcategories/')
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
        console.log(subcategoryType); // Debugging to check the subcategory type
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

            {/* Highlight */}
            {/* <div className='highlight'>
                <div className='highlight-image-section'>
                    <div className='heroshadow'></div>
                    <div className='title-new'>New Arrivals</div>
                    <div className='gallery-new'>
                        <div className='new-gallery-set'>
    
                        </div>
                        <div className='new-gallery-set'>
    
                        </div>
                        <div className='new-gallery-set'>
    
                        </div>
                    </div>
                    <img src="/src/images/female/highlight.png" className="highlight-image" />
                </div>
            </div> */}
        </div>
    );
}

export default Female;
