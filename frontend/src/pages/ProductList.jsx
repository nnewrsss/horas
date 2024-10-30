import React, { useEffect, useState } from 'react';
import api from '../api';  // Import the custom axios instance
import '../styles/ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);  // All products fetched from the API
    const [searchTerm, setSearchTerm] = useState('');  // State to hold the search query
    const [filteredProducts, setFilteredProducts] = useState([]);  // Filtered products based on the search query
    const [sortField, setSortField] = useState('name');  // Default sort field is 'name'
    const [sortDirection, setSortDirection] = useState('asc');  // Default sort direction is 'asc'

    // States for dropdown categories
    const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);

    const [selectedParentCategory, setSelectedParentCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [selectedChildCategory, setSelectedChildCategory] = useState('');

    useEffect(() => {
        // Fetch the products from the backend API
        api.get('/myapp/productsviews/')
            .then(response => {
                console.log(response.data);  // ตรวจสอบว่า category_id มีหรือไม่
                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                    setFilteredProducts(response.data);  // Initialize filtered products with all products
                } else {
                    console.error('API response is not an array');
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });

        // Fetch parent categories for the dropdown
        api.get('/myapp/parentcategories/')
            .then(response => {
                setParentCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching parent categories:', error);
            });
    }, []);

    // Fetch subcategories when a parent category is selected
    useEffect(() => {
        if (selectedParentCategory) {
            api.get(`/myapp/subcategories/?parent=${selectedParentCategory}`)
                .then(response => {
                    setSubCategories(response.data);
                })
                .catch(error => {
                    console.error("Error fetching subcategories:", error);
                });
        }
    }, [selectedParentCategory]);
    
    

    // Fetch child categories when a subcategory is selected
    useEffect(() => {
        if (selectedSubCategory) {
            api.get(`/myapp/childcategories?subcategory=${selectedSubCategory}`)
                .then(response => {
                    setChildCategories(response.data);
                })
                .catch(error => console.error('Error fetching child categories:', error));
        }
    }, [selectedSubCategory]);

    // Update the filtered products whenever the search term or category changes
    useEffect(() => {
        const results = products.filter(product => {
            // ตรวจสอบว่า product.category_id เทียบกับ selectedParentCategory ที่เป็นตัวเลข
            const parentCategoryMatch = selectedParentCategory === '' || product.parent_category_id === parseInt(selectedParentCategory);
            const subCategoryMatch = selectedSubCategory === '' || product.sub_category_id === parseInt(selectedSubCategory);
            const childCategoryMatch = selectedChildCategory === '' || product.child_category_id === parseInt(selectedChildCategory);
            
            const searchMatches = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
            // ทำการเช็คทั้งหมดว่าตรงกับที่เลือกใน parent, sub, child
            return parentCategoryMatch && subCategoryMatch && childCategoryMatch && searchMatches;
        });
        setFilteredProducts(results);
    }, [searchTerm, products, selectedParentCategory, selectedSubCategory, selectedChildCategory]);
    
    // Sort products when the sort field or direction changes
    useEffect(() => {
        const sortedProducts = [...filteredProducts].sort((a, b) => {
            if (sortDirection === 'asc') {
                return a[sortField] > b[sortField] ? 1 : -1;
            } else {
                return a[sortField] < b[sortField] ? 1 : -1;
            }
        });
        setFilteredProducts(sortedProducts);
    }, [sortField, sortDirection]);

    // Function to get the full URL for the image
    const getFullImageUrl = (imageUrl) => {
        return `http://127.0.0.1:8000${imageUrl}`;  // Prepend the base URL to the relative image path
    };
    const handleEdit = (productId) => {
        window.location.href = `/admin/product-edit/${productId}`;  // เปลี่ยนเส้นทางไปยังหน้าแก้ไข
    };
    

    // Function to handle product deletion
    const handleDelete = (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            api.delete(`/myapp/products/${productId}/`)  // Make a DELETE request
                .then(() => {
                    // After successful deletion, remove the product from the state
                    setProducts(products.filter(product => product.id !== productId));
                    setFilteredProducts(filteredProducts.filter(product => product.id !== productId));
                    alert('Product deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Failed to delete the product');
                });
        }
    };

    // ฟังก์ชันสำหรับ reset ตัวกรอง
    const handleReset = () => {
        setSearchTerm('');  // Reset search term
        setSelectedParentCategory('');  // Reset parent category
        setSelectedSubCategory('');  // Reset sub category
        setSelectedChildCategory('');  // Reset child category
        setFilteredProducts(products);  // Reset filtered products to all products
    };

    return (
        <div>
            <h1>Product List</h1>

            {/* Search Input */}
            <input 
                type="text" 
                placeholder="Search products by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}  // Update search term on input change
                style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
            />

            {/* Dropdowns for Parent, Sub, and Child Categories */}
            <div style={{ marginBottom: '20px' }}>
                <label>Parent Category: </label>
                <select 
                    value={selectedParentCategory} 
                    onChange={(e) => setSelectedParentCategory(e.target.value)}
                >
                    <option value="">All</option>
                    {parentCategories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Sub Category: </label>
                <select 
                    value={selectedSubCategory} 
                    onChange={(e) => setSelectedSubCategory(e.target.value)} 
                    disabled={!selectedParentCategory}
                >
                    <option value="">All</option>
                    {subCategories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Child Category: </label>
                <select 
                    value={selectedChildCategory} 
                    onChange={(e) => setSelectedChildCategory(e.target.value)} 
                    disabled={!selectedSubCategory}
                >
                    <option value="">All</option>
                    {childCategories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* ปุ่ม Reset */}
            <button onClick={handleReset} style={{ marginBottom: '20px', padding: '10px' }}>
                Reset Filters
            </button>

            {/* Sort Options */}
            <div style={{ marginBottom: '20px' }}>
                <label>Sort by: </label>
                <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="stock">Stock</option>
                    <option value="created_at">Added On</option>
                </select>

                <button onClick={() => setSortDirection('asc')} disabled={sortDirection === 'asc'}>
                    Ascending
                </button>
                <button onClick={() => setSortDirection('desc')} disabled={sortDirection === 'desc'}>
                    Descending
                </button>
            </div>

            {filteredProducts && filteredProducts.length > 0 ? (
               <table>
               <thead>
                   <tr>
                       <th>Image</th>
                       <th>Name</th>
                       <th>หมวดหมู่</th>
                       <th>ส่วน</th>
                       <th>ประเภท</th>
                       <th>Price</th>
                       <th>Stock</th>
                       <th>Added On</th>
                       <th>Actions</th>
                   </tr>
               </thead>
               <tbody>
                   {filteredProducts.map((product) => (
                       <tr key={product.id}>
                           <td>
                               {product.images.length > 0 && (
                                   <img src={getFullImageUrl(product.images[0].image)} alt={product.name} width="100" />
                               )}
                           </td>
                           <td>{product.name}</td>
                           <td>{product.parent_category_name}</td>
                           <td>{product.sub_category_name}</td>
                           <td>{product.child_category_name}</td>
                           <td>{product.price}</td>
                           <td>{product.stock}</td>
                           <td>{product.created_at}</td>
                           <td>
    <button onClick={() => handleEdit(product.id)} style={{ backgroundColor: 'orange', color: 'white', marginRight: '10px' }}>
        Edit
    </button>
    <button onClick={() => handleDelete(product.id)} style={{ backgroundColor: 'red', color: 'white' }}>
        Delete
    </button>
</td>

                       </tr>
                   ))}
               </tbody>
           </table>
           
            ) : (
                <p>No products available</p>
            )}
        </div>
    );
};

export default ProductList;
