// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import api from '../api';
// import '../styles/ProductEdit.css';

// const ProductEdit = () => {
//     const { productId } = useParams();  // Extract productId from URL
//     const [product, setProduct] = useState(null);
//     const [parentCategories, setParentCategories] = useState([]);
//     const [subCategories, setSubCategories] = useState([]);
//     const [childCategories, setChildCategories] = useState([]);
//     const [newImage, setNewImage] = useState(null);  // State for new image
//     const [imageId, setImageId] = useState(null);  // State to track product image ID

//     useEffect(() => {
//         // Fetch the product details from the backend using the product ID
//         api.get(`/myapp/products/${productId}/`)
//             .then(response => {
//                 setProduct(response.data);
//                 // ตรวจสอบข้อมูลรูปภาพ
//                 if (response.data.images && response.data.images.length > 0) {
//                     setImageId(response.data.images[0].id);  // เก็บ image_id ไว้
//                 }
//             })
//             .catch(error => {
//                 console.error('Error fetching product:', error);
//             });

//         // Fetch parent categories
//         api.get('/myapp/parentcategories/')
//             .then(response => {
//                 setParentCategories(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching parent categories:', error);
//             });
//     }, [productId]);

//     // Fetch subcategories when parent category changes
//     useEffect(() => {
//         if (product && product.parent_category) {
//             api.get(`/myapp/subcategories/?parent=${product.parent_category}`)
//                 .then(response => {
//                     setSubCategories(response.data);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching subcategories:", error);
//                 });
//         }
//     }, [product?.parent_category]);

//     // Fetch child categories when subcategory changes
//     useEffect(() => {
//         if (product && product.sub_category) {
//             api.get(`/myapp/childcategories?subcategory=${product.sub_category}`)
//                 .then(response => {
//                     setChildCategories(response.data);
//                 })
//                 .catch(error => console.error('Error fetching child categories:', error));
//         }
//     }, [product?.sub_category]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setProduct({ ...product, [name]: value });
//     };

//     const handleImageChange = (e) => {
//         setNewImage(e.target.files[0]);  // Get the selected image file
//     };

//     // Function to get the full URL for the image
//     const getFullImageUrl = (imageUrl) => {
//         if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
//             return imageUrl;
//         } else {
//             return `http://127.0.0.1:8000${imageUrl}`;
//         }
//     };

//     // Function to upload the image and update product images
//     const handleImageUpload = async () => {
//         if (newImage) {
//             const formData = new FormData();
//             formData.append('image', newImage);  // Add new image to form data
    
//             try {
//                 if (imageId) {
//                     const response = await api.put(`/myapp/productimages/${imageId}/`, formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     });
//                     console.log('Image updated successfully:', response.data);
//                 } else {
//                     // Create new image entry if no imageId exists
//                     const response = await api.post('/myapp/productimages/', formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data',
//                         },
//                     });
//                     setImageId(response.data.id);  // Save the new image ID
//                     console.log('Image uploaded successfully:', response.data);
//                 }
//             } catch (error) {
//                 console.error('Error uploading or updating image:', error);
//                 throw new Error('Image upload failed');
//             }
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         try {
//             // First handle image upload if a new image is selected
//             await handleImageUpload();
    
//             // ส่งข้อมูลอื่น ๆ ที่ไม่ใช่รูปภาพ (เช่น ชื่อ, ราคา) ในรูปแบบ JSON
//             const productData = {
//                 name: product.name,
//                 description: product.description,
//                 price: product.price,
//                 stock: product.stock,
//                 parent_category: product.parent_category,
//                 sub_category: product.sub_category,
//                 child_category: product.child_category,
//             };

//             // Update product details via API
//             await api.put(`/myapp/products/${productId}/`, productData);  // ส่ง productData เป็น JSON
//             alert('Product updated successfully');
//             window.location.href = '/admin/product-list';  // Redirect to product list after saving
//         } catch (error) {
//             console.error('Error updating product:', error);
//             alert('Failed to update product');
//         }
//     };

//     if (!product) {
//         return <div>Loading...</div>;
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <h1>Edit Product</h1>
//             {/* Current Product Image */}
//             <label>
//                 Current Image:
//                 {product.images && product.images.length > 0 ? (
//                     <img src={getFullImageUrl(product.images[0].image)} alt="Current Product" width="150" />
//                 ) : (
//                     <p>No image available</p>
//                 )}
//             </label>

//             {/* Product Name */}
//             <label>
//                 Name:
//                 <input 
//                     type="text" 
//                     name="name" 
//                     value={product.name} 
//                     onChange={handleChange} 
//                 />
//             </label>

//             {/* Description */}
//             <label>
//                 Description:
//                 <textarea 
//                     name="description" 
//                     value={product.description} 
//                     onChange={handleChange} 
//                 />
//             </label>

//             {/* Price */}
//             <label>
//                 Price:
//                 <input 
//                     type="number" 
//                     name="price" 
//                     value={product.price} 
//                     onChange={handleChange} 
//                 />
//             </label>

//             {/* Stock */}
//             <label>
//                 Stock:
//                 <input 
//                     type="number" 
//                     name="stock" 
//                     value={product.stock} 
//                     onChange={handleChange} 
//                 />
//             </label>

//             {/* Parent Category */}
//             <label>
//                 Parent Category:
//                 <select name="parent_category" value={product.parent_category} onChange={handleChange}>
//                     <option value="">Select Parent Category</option>
//                     {parentCategories.map((category) => (
//                         <option key={category.id} value={category.id}>{category.name}</option>
//                     ))}
//                 </select>
//             </label>

//             {/* Sub Category */}
//             <label>
//                 Sub Category:
//                 <select name="sub_category" value={product.sub_category} onChange={handleChange} disabled={!product.parent_category}>
//                     <option value="">Select Sub Category</option>
//                     {subCategories.map((category) => (
//                         <option key={category.id} value={category.id}>{category.name}</option>
//                     ))}
//                 </select>
//             </label>
//     {/* Child Category */}
//     <label>
//         Child Category:
//         <select name="child_category" value={product.child_category} onChange={handleChange} disabled={!product.sub_category}>
//             <option value="">Select Child Category</option>
//             {childCategories.map((category) => (
//                 <option key={category.id} value={category.id}>{category.name}</option>
//             ))}
//         </select>
//     </label>

//     {/* Image Upload */}
//     <label>
//         Change Image:
//         <input type="file" onChange={handleImageChange} accept="image/*" />
//     </label>

//     {/* Submit Button */}
//     <button type="submit">Save</button>
//     </form>
//     );
// };

// export default ProductEdit;













// ProductEdit.jsx
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
    const [newImages, setNewImages] = useState([]);  // State for new images to upload
    const [existingImages, setExistingImages] = useState([]);  // State for existing images

    useEffect(() => {
        // Fetch the product details from the backend using the product ID
        api.get(`/myapp/products/${productId}/`)
            .then(response => {
                setProduct(response.data);
                setExistingImages(response.data.images);  // Set existing images
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

    // Handle new image selection
    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages([...newImages, ...files]);
    };

    // Handle existing image deletion
    const handleDeleteExistingImage = (imageId) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            api.delete(`/myapp/productimages/${imageId}/`)
                .then(() => {
                    // Remove the deleted image from existingImages state
                    setExistingImages(existingImages.filter(img => img.id !== imageId));
                    alert('Image deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting image:', error);
                    alert('Failed to delete the image');
                });
        }
    };

    // Handle existing image replacement
    const handleReplaceImage = (imageId, newImageFile) => {
        const formData = new FormData();
        formData.append('image', newImageFile);

        api.put(`/myapp/productimages/${imageId}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                // Update the image in existingImages state
                setExistingImages(existingImages.map(img => img.id === imageId ? response.data : img));
                alert('Image updated successfully');
            })
            .catch(error => {
                console.error('Error updating image:', error);
                alert('Failed to update the image');
            });
    };

    // Handle new image removal before uploading
    const handleRemoveNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    // Function to get the full URL for the image
    const getFullImageUrl = (imageUrl) => {
        if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
            return imageUrl;
        } else {
            return `http://127.0.0.1:8000${imageUrl}`;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Upload new images if any
            if (newImages.length > 0) {
                const uploadPromises = newImages.map(image => {
                    const formData = new FormData();
                    formData.append('product', product.id);
                    formData.append('image', image);
                    return api.post('/myapp/productimages/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                });

                await Promise.all(uploadPromises);
                alert('New images uploaded successfully');
                setNewImages([]);  // Clear new images after upload

                // Refetch the product to get updated images
                const response = await api.get(`/myapp/products/${productId}/`);
                setProduct(response.data);
                setExistingImages(response.data.images);
            }

            // Prepare product data excluding images
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
        <form onSubmit={handleSubmit} className="product-edit-form">
            <h1>Edit Product</h1>

            {/* Current Product Images */}
            <div className="existing-images">
                <h2>Existing Images</h2>
                {existingImages.length > 0 ? (
                    existingImages.map(image => (
                        <div key={image.id} className="existing-image">
                            <img src={getFullImageUrl(image.image)} alt="Current Product" width="150" />
                            <div className="image-actions">
                                {/* Delete Button */}
                                <button type="button" onClick={() => handleDeleteExistingImage(image.id)} style={{ backgroundColor: 'red', color: 'white', marginRight: '10px' }}>
                                    Delete
                                </button>
                                {/* Replace Button */}
                                <label style={{ backgroundColor: 'orange', color: 'white', padding: '5px 10px', cursor: 'pointer' }}>
                                    Replace
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleReplaceImage(image.id, e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No images available</p>
                )}
            </div>

            {/* Product Details */}
            <div className="product-details">
                {/* Product Name */}
                <label>
                    Name:
                    <input 
                        type="text" 
                        name="name" 
                        value={product.name} 
                        onChange={handleChange} 
                        required
                    />
                </label>

                {/* Description */}
                <label>
                    Description:
                    <textarea 
                        name="description" 
                        value={product.description} 
                        onChange={handleChange} 
                        required
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
                        required
                        min="0"
                        step="0.01"
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
                        required
                        min="0"
                    />
                </label>

                {/* Parent Category */}
                <label>
                    Parent Category:
                    <select name="parent_category" value={product.parent_category} onChange={handleChange} required>
                        <option value="">Select Parent Category</option>
                        {parentCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>

                {/* Sub Category */}
                <label>
                    Sub Category:
                    <select name="sub_category" value={product.sub_category} onChange={handleChange} disabled={!product.parent_category} required>
                        <option value="">Select Sub Category</option>
                        {subCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>

                {/* Child Category */}
                <label>
                    Child Category:
                    <select name="child_category" value={product.child_category} onChange={handleChange} disabled={!product.sub_category} required>
                        <option value="">Select Child Category</option>
                        {childCategories.map((category) => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </label>
            </div>

            {/* Add New Images */}
            <div className="new-images">
                <h2>Add New Images</h2>
                <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleNewImageChange} 
                />
                {newImages.length > 0 && (
                    <div className="new-image-preview">
                        {newImages.map((image, index) => (
                            <div key={index} className="new-image-item">
                                <img src={URL.createObjectURL(image)} alt={`New Image ${index}`} width="150" />
                                <button type="button" onClick={() => handleRemoveNewImage(index)} style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}>
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button type="submit" className="save-button">Save</button>
        </form>
    );

};

export default ProductEdit;
