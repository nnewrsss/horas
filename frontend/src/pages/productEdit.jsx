import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import '../styles/ProductEdit.css';

const ProductEdit = () => {
    const { productId } = useParams();  // Extract productId from URL
    const [product, setProduct] = useState(null);
    const [parentCategories, setParentCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [newImage, setNewImage] = useState(null);  // State for new image
    const [imageId, setImageId] = useState(null);  // State to track product image ID

    useEffect(() => {
        // Fetch the product details from the backend using the product ID
        api.get(`/myapp/products/${productId}/`)
            .then(response => {
                setProduct(response.data);
                // ตรวจสอบข้อมูลรูปภาพ
                if (response.data.images && response.data.images.length > 0) {
                    setImageId(response.data.images[0].id);  // เก็บ image_id ไว้
                }
            })
            .catch(error => {
                console.error('Error fetching product:', error);
            });

        // Fetch parent categories
        api.get('/myapp/parentcategories/')
            .then(response => {
                setParentCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching parent categories:', error);
            });
    }, [productId]);

    // Fetch subcategories when parent category changes
    useEffect(() => {
        if (product && product.parent_category) {
            api.get(`/myapp/subcategories/?parent=${product.parent_category}`)
                .then(response => {
                    setSubCategories(response.data);
                })
                .catch(error => {
                    console.error("Error fetching subcategories:", error);
                });
        }
    }, [product?.parent_category]);

    // Fetch child categories when subcategory changes
    useEffect(() => {
        if (product && product.sub_category) {
            api.get(`/myapp/childcategories?subcategory=${product.sub_category}`)
                .then(response => {
                    setChildCategories(response.data);
                })
                .catch(error => console.error('Error fetching child categories:', error));
        }
    }, [product?.sub_category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleImageChange = (e) => {
        setNewImage(e.target.files[0]);  // Get the selected image file
    };

    // Function to get the full URL for the image
    const getFullImageUrl = (imageUrl) => {
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        } else {
            return `http://127.0.0.1:8000${imageUrl}`;
        }
    };

    // Function to upload the image and update product images
    const handleImageUpload = async () => {
        if (newImage) {
            const formData = new FormData();
            formData.append('image', newImage);  // Add new image to form data
    
            try {
                if (imageId) {
                    const response = await api.put(`/myapp/productimages/${imageId}/`, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    console.log('Image updated successfully:', response.data);
                } else {
                    // Create new image entry if no imageId exists
                    const response = await api.post('/myapp/productimages/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    setImageId(response.data.id);  // Save the new image ID
                    console.log('Image uploaded successfully:', response.data);
                }
            } catch (error) {
                console.error('Error uploading or updating image:', error);
                throw new Error('Image upload failed');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            // First handle image upload if a new image is selected
            await handleImageUpload();
    
            // ส่งข้อมูลอื่น ๆ ที่ไม่ใช่รูปภาพ (เช่น ชื่อ, ราคา) ในรูปแบบ JSON
            const productData = {
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
                parent_category: product.parent_category,
                sub_category: product.sub_category,
                child_category: product.child_category,
            };

            // Update product details via API
            await api.put(`/myapp/products/${productId}/`, productData);  // ส่ง productData เป็น JSON
            alert('Product updated successfully');
            window.location.href = '/admin/product-list';  // Redirect to product list after saving
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Failed to update product');
        }
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Edit Product</h1>
            {/* Current Product Image */}
            <label>
                Current Image:
                {product.images && product.images.length > 0 ? (
                    <img src={getFullImageUrl(product.images[0].image)} alt="Current Product" width="150" />
                ) : (
                    <p>No image available</p>
                )}
            </label>

            {/* Product Name */}
            <label>
                Name:
                <input 
                    type="text" 
                    name="name" 
                    value={product.name} 
                    onChange={handleChange} 
                />
            </label>

            {/* Description */}
            <label>
                Description:
                <textarea 
                    name="description" 
                    value={product.description} 
                    onChange={handleChange} 
                />
            </label>

            {/* Price */}
            <label>
                Price:
                <input 
                    type="number" 
                    name="price" 
                    value={product.price} 
                    onChange={handleChange} 
                />
            </label>

            {/* Stock */}
            <label>
                Stock:
                <input 
                    type="number" 
                    name="stock" 
                    value={product.stock} 
                    onChange={handleChange} 
                />
            </label>

            {/* Parent Category */}
            <label>
                Parent Category:
                <select name="parent_category" value={product.parent_category} onChange={handleChange}>
                    <option value="">Select Parent Category</option>
                    {parentCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </label>

            {/* Sub Category */}
            <label>
                Sub Category:
                <select name="sub_category" value={product.sub_category} onChange={handleChange} disabled={!product.parent_category}>
                    <option value="">Select Sub Category</option>
                    {subCategories.map((category) => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                </select>
            </label>
    {/* Child Category */}
    <label>
        Child Category:
        <select name="child_category" value={product.child_category} onChange={handleChange} disabled={!product.sub_category}>
            <option value="">Select Child Category</option>
            {childCategories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
            ))}
        </select>
    </label>

    {/* Image Upload */}
    <label>
        Change Image:
        <input type="file" onChange={handleImageChange} accept="image/*" />
    </label>

    {/* Submit Button */}
    <button type="submit">Save</button>
    </form>
    );
};

export default ProductEdit;
