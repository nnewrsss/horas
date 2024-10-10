import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from '../components/Nav.jsx';
import { ACCESS_TOKEN } from '../constants.js';

function CategoryDetails() {
    const { subcategoryType } = useParams(); // Get category type from URL
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');
    const navigate = useNavigate(); // Navigate to the category product page

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            window.location.href = '/'; // Redirect to login if no token
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `http://127.0.0.1:8000/myapp/${subcategoryType}/`;
                console.log("Request URL:", url); // Log the request URL
                const response = await axios.get(url);
                console.log("Response Data:", response.data); // Log the response data
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.log("Error:", err); // Log the error if there is one
                setError('Error fetching products.');
                setLoading(false);
            }
        };
    
        fetchProducts();
    }, [subcategoryType]);
    
    

    const handleProductClick = (productId) => {
        console.log("Product ID:", productId);  // แสดง productId ในคอนโซล
        navigate(`/categoryproduct/${productId}`);  // ส่ง id ของ product ไปที่ route
    };
    
    
    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <Nav username={username} />
            <div className='product-details-container'>
                <h1>Products in {subcategoryType}</h1>
                <div className='products-grid'>
                    {products.map(product => (
                        <div key={product.id} className='product-card'>
                            {product.images && product.images.length > 0 && (
                                <img
                                    src={`http://127.0.0.1:8000${product.images[0].image}`}
                                    alt={product.name}
                                    className='product-image'
                                />
                            )}
                            <div className='product-info'>
                                <h2>{product.name}</h2>
                                <p>{product.description}</p>
                                <p>Price: ${product.price}</p>
                                <button
    onClick={() => {
        console.log("Product ID:", product.id);  // แสดง productId ในคอนโซลเมื่อกดปุ่ม
        handleProductClick(product.id);
    }}
    className='view-product-button'
>
    View Products
</button>


                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategoryDetails;


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// function CategoryDetails() {
//     const { subcategoryType } = useParams();  // Get subcategory type from URL params
//     const [subcategories, setSubcategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const navigate = useNavigate();  // ใช้ navigate สำหรับการเปลี่ยนหน้า

//     useEffect(() => {
//         const fetchSubcategories = async () => {
//             try {
//                 // เรียก API เพื่อดึง subcategories ตาม subcategoryType
//                 const response = await axios.get(`http://127.0.0.1:8000/myapp/${subcategoryType}/`);
//                 console.log("Request URL:", url);
//                 setSubcategories(response.data);  // ตั้งค่าข้อมูล subcategories ที่ดึงมา
//                 setLoading(false);
//             } catch (err) {
//                 setError('Error fetching subcategories.');
//                 setLoading(false);
//             }
//         };

//         fetchSubcategories();
//     }, [subcategoryType]);

//     // ฟังก์ชันที่จะเรียกเมื่อคลิกเลือก subcategory
//     const handleSubcategoryClick = (childCategoryId) => {
//         // เมื่อกด subcategory จะเปลี่ยนไปที่หน้าแสดงสินค้าตาม child_category_id
//         navigate(`/myapp/products/childcategory/${childCategoryId}/`);
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div>
//             <h1>Subcategories in {subcategoryType}</h1>
//             <ul>
//                 {subcategories.map(subcategory => (
//                     <li key={subcategory.id}>
//                         <button onClick={() => handleSubcategoryClick(subcategory.id)}>
//                             {subcategory.name}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

// export default CategoryDetails;
