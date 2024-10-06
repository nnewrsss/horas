


// import React, { useEffect, useState } from 'react';
// import { ACCESS_TOKEN } from '../constants.js';
// import Nav from '../components/Nav.jsx';
// import axios from 'axios';  // นำเข้า Axios เพื่อใช้ในการดึงข้อมูลจาก backend
// import '../styles/menstyle.css';

// function Men() {
//     const [currentImageIndex, setCurrentImageIndex] = useState(0); // สร้าง state เพื่อเก็บ index ของภาพที่แสดง
//     const [products, setProducts] = useState([]); // สร้าง state สำหรับเก็บข้อมูลสินค้า
//     const [loading, setLoading] = useState(true); // สร้าง state สำหรับแสดงสถานะการโหลดข้อมูล
//     const [error, setError] = useState(null); // สร้าง state สำหรับเก็บข้อความผิดพลาด
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

//     // ฟังก์ชันสำหรับดึงข้อมูลสินค้าจาก backend
//     const fetchMenProducts = async () => {
//         try {
//             const response = await axios.get('http://127.0.0.1:8000/myapp/malesubcategories/'); // ปรับ URL ตามการตั้งค่า backend
//             setProducts(response.data); // บันทึกข้อมูลสินค้าที่ได้จาก backend
//             setLoading(false); // ปิดสถานะโหลดเมื่อดึงข้อมูลเสร็จสิ้น
//         } catch (err) {
//             setError('Error fetching products.');
//             setLoading(false); // ปิดสถานะโหลดเมื่อเกิดข้อผิดพลาด
//         }
//     };

//     useEffect(() => {
//         fetchMenProducts(); // เรียกใช้ฟังก์ชันเพื่อดึงข้อมูลสินค้าหลังจาก mount component
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
//             <Nav username={username} />
            
//             {/* Hero Section */}
//             <div className='hero-section'>
//                 <div className='heroshadow'></div>
//                 <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-img' />
//             </div>

//             {/* Category Section */}
//             <div className='main-section'>
//             <h2>categories</h2>
//             {loading ? (
//     <p>Loading...</p>  // แสดงสถานะโหลด
// ) : error ? (
//     <p>{error}</p>  // แสดงข้อความผิดพลาด
// ) : (
//     <div className="subcategory-buttons">
//         {/* แสดงรายการ subcategories ที่ดึงมาจาก backend ในรูปแบบปุ่ม */}
//         {products.map((product) => (
//             <button
//                 key={product.sub_category_id}
//                 className="subcategory-button"
//                 onClick={() => alert(`Selected: ${product.sub_category_name}`)} // สามารถเปลี่ยนการทำงานตรงนี้ได้ตามต้องการ
//             >
//                 {product.sub_category_name}
//             </button>
//         ))}
//     </div>
// )}



//                 {/* Highlight Section */}
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
                axios.get('http://127.0.0.1:8000/myapp/malesubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/malebottomsubcategories/'),
                axios.get('http://127.0.0.1:8000/myapp/malebagssubcategories/')
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
                <img src="/src/images/men/shopmain.png" alt="Shop Main" className='hero-img' />
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

{/* เว้นบรรทัด */}
<br />

{/* หมวดหมู่ Male Bottom */}
<h3>Male Bottom</h3>
<div className="subcategory-buttons">
    {maleBottomCategories.map((category) => (
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

{/* เว้นบรรทัด */}
<br />

{/* หมวดหมู่ Male Bags */}
<h3>Male Bags</h3>
<div className="subcategory-buttons">
    {maleBagsCategories.map((category) => (
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
