// import React, { useEffect, useState } from 'react';
// import { ACCESS_TOKEN } from '../constants.js';
// import Nav from '../components/Nav.jsx';
// import axios from 'axios';  
// import '../styles/menstyle.css';
// import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate สำหรับการเปลี่ยนหน้า

// function Men() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0); 
//     const [maleCategories, setMaleCategories] = useState([]); 
//     const [maleBottomCategories, setMaleBottomCategories] = useState([]); 
//     const [maleBagsCategories, setMaleBagsCategories] = useState([]); 
//     const [loading, setLoading] = useState(true); 
//     const [error, setError] = useState(null); 
//     const username = localStorage.getItem('username'); 
//     const navigate = useNavigate(); // ใช้ useNavigate สำหรับการเปลี่ยนหน้า
//     const highlightImages = [
//         "/src/images/men/product4.png",
//         "/src/images/men/product1.png",
//         "/src/images/men/product2.png",
//         "/src/images/men/product3.png"
//     ]; 

//     useEffect(() => {
//         const token = localStorage.getItem(ACCESS_TOKEN);
//         if (!token) {
//             window.location.href = '/';
//         }
//     }, []);

//     const fetchMenCategories = async () => {
//         try {
//             const [maleSubcategories, maleBottomSubcategories, maleBagsSubcategories] = await Promise.all([
//                 axios.get('http://127.0.0.1:8000/myapp/malesubcategories/'),
//                 axios.get('http://127.0.0.1:8000/myapp/malebottomsubcategories/'),
//                 axios.get('http://127.0.0.1:8000/myapp/malebagssubcategories/')
//             ]);

//             setMaleCategories(maleSubcategories.data);
//             setMaleBottomCategories(maleBottomSubcategories.data);
//             setMaleBagsCategories(maleBagsSubcategories.data);
//             setLoading(false); 
//         } catch (err) {
//             console.log(err); 
//             setError('Error fetching categories.');
//             setLoading(false); 
//         }
//     };

//     useEffect(() => {
//         fetchMenCategories(); 
//     }, []);

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setCurrentImageIndex(prevIndex => (prevIndex + 1) % highlightImages.length);
//         }, 3000); 

//         return () => clearInterval(interval); 
//     }, [highlightImages.length]);

//     // ฟังก์ชันเปลี่ยนหน้าและส่งข้อมูล category ID
//    // Men.jsx

// const handleCategoryClick = (subcategoryType) => {
//     navigate(`/categorydetails/${subcategoryType}`);
// };

    

//     return (
//         <div>
//             <Nav username={username} />
            
//             <div className='hero-section'>
//                 <div className='heroshadow'></div>
//                 <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-img' />
//             </div>

//             <div className='main-section'>
//                 <h2>CATEGORIES</h2>
//                 {loading ? (
//                     <p>Loading...</p> 
//                 ) : error ? (
//                     <p>{error}</p> 
//                 ) : (
//                     <>
//                        {/* หมวดหมู่ Male */}
//                        <h3>Male</h3>

// <div className="subcategory-buttons">
//     <button
//         className="subcategory-button"
//         onClick={() => handleCategoryClick('maletopsubcategories')}
//     >
//         Male Tops
//         <img src="src\images\men\product1.png" alt="Shop Main"/>
//     </button>
//     <button
//         className="subcategory-button"
//         onClick={() => handleCategoryClick('malebottomsubcategories')}
//     >
//         Male Bottoms
//         <img src="src\images\men\product2.png" alt="Shop Main"/>
//     </button>
//     <button
//         className="subcategory-button"
//         onClick={() => handleCategoryClick('malebagssubcategories')}
//     >
//         Male Bags
//         <img src="src\images\men\product3.png" alt="Shop Main" />
//     </button>
// </div>



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

// export default Men;



import React, { useEffect, useState } from 'react';
import { ACCESS_TOKEN } from '../constants.js';
import Nav from '../components/Nav.jsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/menstyle.css';

function Men() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [maleCategories, setMaleCategories] = useState([]);
    const [maleBottomCategories, setMaleBottomCategories] = useState([]);
    const [maleBagsCategories, setMaleBagsCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate();

    const highlightImages = [
        "/src/images/men/product4.png",
        "/src/images/men/product1.png",
        "/src/images/men/product2.png",
        "/src/images/men/product3.png"
    ]; 

    // Check if the user is logged in
    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/';
        }
    }, []);

    // Fetch categories data from API
    const fetchMenCategories = async () => {
        try {
            const [maleSubcategories, maleBottomSubcategories, maleBagsSubcategories] = await Promise.all([
                axios.get('http://127.0.0.1:8000/myapp/malesubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/malebottomsubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/malebagssubcategories/')
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

    // Fetch categories on component mount
    useEffect(() => {
        fetchMenCategories();
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
            <div className='hero-section'>
                <div className='heroshadow'></div>
                <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-imgs' />
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

         
        </div>
    );
}

export default Men;
