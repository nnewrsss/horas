import React, { useState, useEffect } from 'react';
import '../styles/ProductDetailForm.css';
import axios from 'axios';
import api from "../api"

const ProductDetailForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    parentCategory: '',
    subCategory: '',
    childCategory: '',
    materials: '',
    price: '',
    stock: '',
    images: [],
    sizes: [],
  });

  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  // ดึงหมวดหมู่พ่อ (Parent Categories)
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/myapp/parentcategories/')
      .then(response => {
        setParentCategories(response.data);
      })
      .catch(error => console.error('Error fetching parent categories:', error));
  }, []);

  useEffect(() => {
    if (product.parentCategory) {
      axios.get(`http://127.0.0.1:8000/myapp/subcategories?parent=${product.parentCategory}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true  // ใช้หากคุณใช้ cookies หรือ session authentication
      })
      .then(response => {
        setSubCategories(response.data);
        setProduct({ ...product, subCategory: '', childCategory: '' });
        setChildCategories([]);
      })
      .catch(error => console.error('Error fetching subcategories:', error));
    }
  }, [product.parentCategory]);
  
  
  // ดึง Child Categories เมื่อเลือก Subcategory
  useEffect(() => {
    if (product.subCategory) {
      axios.get(`http://127.0.0.1:8000/myapp/childcategories?subcategory=${product.subCategory}`)
        .then(response => {
          setChildCategories(response.data);
        })
        .catch(error => console.error('Error fetching child categories:', error));
    }
  }, [product.subCategory]);

  // จัดการการเปลี่ยนแปลงของฟอร์ม
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    console.log(`Changed ${name}:`, value);  
    if (name === 'images') {
      setProduct({ ...product, images: [...files] });
    } else {
      setProduct({ ...product, [name]: value });
    }
  };



  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    // เพิ่มภาพสินค้า
    product.images.forEach((image) => {
        formData.append('images_upload', image);
    });

    // เพิ่มฟิลด์อื่น ๆ
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('parent_category', product.parentCategory);  
    formData.append('sub_category', product.subCategory);  
    formData.append('child_category', product.childCategory);  
    formData.append('materials', product.materials);
    formData.append('price', product.price);
    formData.append('stock', product.stock);

    // ไม่ส่งฟิลด์ sizes
    // formData.append('sizes', product.sizes);

    try {
    const response = await api.post('/myapp/products/', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log('Product created successfully:', response.data);
} catch (error) {
    // พิมพ์ข้อผิดพลาดที่ได้รับจาก backend
    console.error('Failed to create product:', error.response ? error.response.data : error.message);
}

};



  
  return (
    <form className="product-detail-form" onSubmit={handleSubmit}>
      <div className="form-header">
        {/* ส่วนรูปภาพ */}
        <div className="image-section">
          <label htmlFor="product-images">รูปภาพสินค้า:</label>
          <input
            type="file"
            name="images"
            id="product-images"
            onChange={handleChange}
            accept="image/*"
            multiple
          />
          {product.images.length > 0 && (
            <div className="image-previews">
              {Array.from(product.images).map((image, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(image)}
                  alt={`Product ${index}`}
                  className="product-image-preview"
                />
              ))}
            </div>
          )}
        </div>

        {/* ส่วนฟิลด์ต่าง ๆ */}
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="product-name">ชื่อสินค้า:</label>
            <input
              type="text"
              name="name"
              id="product-name"
              value={product.name}
              onChange={handleChange}
              placeholder="กรอกชื่อสินค้า"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-description">รายละเอียดสินค้า:</label>
            <textarea
              name="description"
              id="product-description"
              value={product.description}
              onChange={handleChange}
              placeholder="กรอกรายละเอียดสินค้า"
              rows="5"
              required
            ></textarea>
          </div>

          {/* Dropdown พ่อ (Parent Category) */}
          <div className="form-group">
            <label htmlFor="product-parent-category">หมวดหมู่สินค้า:</label>
            <select
              name="parentCategory"
              id="product-parent-category"
              value={product.parentCategory}
              onChange={handleChange}
              required
            >
              <option value="">เลือกหมวดหมู่หลัก</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown แม่ (Subcategory) */}
          <div className="form-group">
            <label htmlFor="product-sub-category">หมวดหมู่ย่อย:</label>
            <select
              name="subCategory"
              id="product-sub-category"
              value={product.subCategory}
              onChange={handleChange}
              required
            >
              <option value="">เลือกหมวดหมู่ย่อย</option>
              {subCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dropdown ลูก (Child Category) */}
          <div className="form-group">
            <label htmlFor="product-child-category">หมวดหมู่ย่อยสุด:</label>
            <select
              name="childCategory"
              id="product-child-category"
              value={product.childCategory}
              onChange={handleChange}
              required
            >
              <option value="">เลือกหมวดหมู่ย่อยสุด</option>
              {childCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="product-materials">วัสดุที่ใช้:</label>
            <input
              type="text"
              name="materials"
              id="product-materials"
              value={product.materials}
              onChange={handleChange}
              placeholder="กรอกวัสดุที่ใช้ทำสินค้า"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-price">ราคา:</label>
            <input
              type="number"
              name="price"
              id="product-price"
              value={product.price}
              onChange={handleChange}
              placeholder="กรอกราคา"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="product-stock">สต็อก:</label>
            <input
              type="number"
              name="stock"
              id="product-stock"
              value={product.stock}
              onChange={handleChange}
              placeholder="กรอกจำนวนสต็อก"
              required
              min="0"
            />
          </div>

          <button type="submit" className="submit-button">
            บันทึกสินค้า
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductDetailForm;
