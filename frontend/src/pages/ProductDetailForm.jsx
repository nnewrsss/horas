
import React, { useState, useEffect } from 'react';
import '../styles/ProductDetailForm.css';
import axios from 'axios';
import api from "../api";

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
  });

  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);

  // State สำหรับเก็บ input รูปภาพหลายๆ input
  const [imageInputs, setImageInputs] = useState([0]); // เริ่มด้วย input หนึ่งอัน
  const [images, setImages] = useState([]); // เก็บไฟล์รูปภาพทั้งหมดที่เลือก
  const [previewImages, setPreviewImages] = useState([]); // เก็บ URL สำหรับพรีวิวรูปภาพ

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
        withCredentials: true  // ใช้ถ้าคุณใช้ cookies หรือ session authentication
      })
      .then(response => {
        setSubCategories(response.data);
        setProduct({ ...product, subCategory: '', childCategory: '' });
        setChildCategories([]);
      })
      .catch(error => console.error('Error fetching subcategories:', error));
    }
  }, [product.parentCategory]);

  useEffect(() => {
    if (product.subCategory) {
      axios.get(`http://127.0.0.1:8000/myapp/childcategories?subcategory=${product.subCategory}`)
        .then(response => {
          setChildCategories(response.data);
        })
        .catch(error => console.error('Error fetching child categories:', error));
    }
  }, [product.subCategory]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงของ input
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];

    if (file) {
      // เก็บไฟล์รูปภาพลงใน state images
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);

      // สร้าง URL สำหรับพรีวิวรูปภาพและเก็บไว้ใน state previewImages
      const newPreviewImages = [...previewImages];
      newPreviewImages[index] = URL.createObjectURL(file);
      setPreviewImages(newPreviewImages);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  // ฟังก์ชันสำหรับเพิ่ม input รูปภาพใหม่
  const addImageInput = () => {
    setImageInputs([...imageInputs, imageInputs.length]);
  };

  // ฟังก์ชันสำหรับลบ input รูปภาพ
  const removeImageInput = (index) => {
    setImageInputs(imageInputs.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index)); // ลบไฟล์ที่เลือกไปแล้วใน input เดิมด้วย
    setPreviewImages(previewImages.filter((_, i) => i !== index)); // ลบ URL พรีวิวออกด้วย
  };

  // ฟังก์ชันสำหรับส่งฟอร์ม
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    // เพิ่มรูปภาพทั้งหมดลงใน formData ภายใต้คีย์ 'images_upload'
    images.forEach((image) => {
      formData.append('images_upload', image);
    });

    // เพิ่มฟิลด์ข้อมูลอื่น ๆ
    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('parent_category', product.parentCategory);
    formData.append('sub_category', product.subCategory);
    formData.append('child_category', product.childCategory);
    formData.append('materials', product.materials);
    formData.append('price', product.price);
    formData.append('stock', product.stock);

    try {
      const response = await api.post('/myapp/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Product created successfully:', response.data);
      // รีเซ็ตฟอร์มหรือทำสิ่งอื่นหลังจากสร้างสินค้าเสร็จ
      setProduct({
        name: '',
        description: '',
        parentCategory: '',
        subCategory: '',
        childCategory: '',
        materials: '',
        price: '',
        stock: '',
      });
      setImageInputs([0]);
      setImages([]);
      setPreviewImages([]);
    } catch (error) {
      console.error('Failed to create product:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <form className="product-detail-form" onSubmit={handleSubmit}>
      <div className="form-header">

        {/* ส่วนรูปภาพ */}
        <div className="image-section">
          <label>รูปภาพสินค้า:</label>
          {imageInputs.map((input, index) => (
            <div key={index} className="image-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, index)}
              />
              <button type="button" onClick={() => removeImageInput(index)}>ลบรูปภาพนี้</button>
              
              {/* แสดงพรีวิวรูปภาพ */}
              {previewImages[index] && (
                <img
                  src={previewImages[index]}
                  alt={`Preview ${index}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              )}
            </div>
          ))}
          <button type="button" onClick={addImageInput}>เพิ่มรูปภาพ</button>
        </div>

        {/* ส่วนฟิลด์ข้อมูลต่าง ๆ */}
        <div className="form-fields">
          <div className="form-group">
            <label htmlFor="product-name">ชื่อสินค้า:</label>
            <input
              type="text"
              name="name"
              id="product-name"
              value={product.name}
              onChange={handleProductChange}
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
              onChange={handleProductChange}
              placeholder="กรอกรายละเอียดสินค้า"
              rows="5"
              required
            ></textarea>
          </div>

          {/* Dropdown หมวดหมู่หลัก */}
          <div className="form-group">
            <label htmlFor="product-parent-category">หมวดหมู่สินค้า:</label>
            <select
              name="parentCategory"
              id="product-parent-category"
              value={product.parentCategory}
              onChange={handleProductChange}
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

          {/* Dropdown หมวดหมู่ย่อย */}
          <div className="form-group">
            <label htmlFor="product-sub-category">หมวดหมู่ย่อย:</label>
            <select
              name="subCategory"
              id="product-sub-category"
              value={product.subCategory}
              onChange={handleProductChange}
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

          {/* Dropdown หมวดหมู่ย่อยสุด */}
          <div className="form-group">
            <label htmlFor="product-child-category">หมวดหมู่ย่อยสุด:</label>
            <select
              name="childCategory"
              id="product-child-category"
              value={product.childCategory}
              onChange={handleProductChange}
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
              onChange={handleProductChange}
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
              onChange={handleProductChange}
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
              onChange={handleProductChange}
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
