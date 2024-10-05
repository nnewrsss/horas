import React from 'react';
import { Link } from 'react-router-dom';
import ProductDetailForm from './ProductDetailForm';
import ProductList from './ProductList';

const AdminHome = () => {
    return (
        <div>
            <h1>หน้าแรกผู้ดูแลระบบ</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/admin/product-detail">ฟอร์มรายละเอียดสินค้า</Link>
                    </li>
                    <li>
                        <Link to="/admin/product-list">รายการสินค้า</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default AdminHome;
