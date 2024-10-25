// // App.jsx

// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import Homes from './pages/Homes';
// import NotFound from './pages/NotFound';
// import Support from './pages/Support';
// import AboutUs from './pages/AboutUs';
// import AdminHome from './pages/AdminHome';
// import ProductDetailForm from './pages/ProductDetailForm';
// import ProductList from './pages/ProductList';
// import ProductEdit from './pages/ProductEdit';
// import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
// import Female from './pages/female';
// import Men from './pages/Men';
// import CategoryDetails from './pages/CategoryDetails';
// import CategoryProduct from './pages/Categoryproduct';
// import ProductDetails from './pages/productdetails';

// function Logout() {
//   localStorage.clear(); // Clear localStorage on logout
//   return <Navigate to="/login" />; // Redirect to login
// }

// function RegisterAndLogout() {
//   localStorage.clear(); // Clear localStorage when accessing register
//   return <Navigate to="/register" />;
// }

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Protected Routes */}
//         <Route
//           path="/homes"
//           element={
//             <PrivateRoute>
//               <Homes />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/adminhome"
//           element={
//             <PrivateRoute>
//               <AdminHome />
//             </PrivateRoute>
//           }
//         />

//         {/* Public Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<RegisterAndLogout />} />
//         <Route path="/logout" element={<Logout />} />
//         <Route path="/support" element={<Support />} />
//         <Route path="/aboutus" element={<AboutUs />} />
//         <Route path="/admin/product-detail" element={<ProductDetailForm />} />
//         <Route path="/admin/product-list" element={<ProductList />} />
//         <Route path="/admin/product-edit/:productId" element={<ProductEdit />} />

//         {/* Category Routes */}
//         <Route path="/female" element={<Female />} />
//         <Route path="/men" element={<Men />} />
//         <Route path="/categorydetails/:subcategoryType" element={<CategoryDetails />} />
//         <Route path="/categoryproduct/:productId" element={<CategoryProduct />} />
//         <Route path="/product/:productId" element={<ProductDetails />} />

        
//         {/* Fallback Route */}
//         <Route path="*" element={<NotFound />} /> {/* Any other routes go to NotFound */}
        
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;










// App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Homes from './pages/Homes';
import NotFound from './pages/NotFound';
import Support from './pages/Support';
import AboutUs from './pages/AboutUs';
import AdminHome from './pages/AdminHome';
import ProductDetailForm from './pages/ProductDetailForm';
import ProductList from './pages/ProductList';
import ProductEdit from './pages/ProductEdit';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute
import Female from './pages/female';
import Men from './pages/Men';
import CategoryDetails from './pages/CategoryDetails';
import CategoryProduct from './pages/Categoryproduct';
import ProductDetails from './pages/productdetails';
import Cart from './pages/cart';

function Logout() {
  localStorage.clear(); // Clear localStorage on logout
  return <Navigate to="/login" />; // Redirect to login
}

function RegisterAndLogout() {
  localStorage.clear(); // Clear localStorage when accessing register
  return <Navigate to="/register" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/homes"
          element={
            <PrivateRoute>
              <Homes />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminhome"
          element={
            <PrivateRoute>
              <AdminHome />
            </PrivateRoute>
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/support" element={<Support />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/admin/product-detail" element={<ProductDetailForm />} />
        <Route path="/admin/product-list" element={<ProductList />} />
        <Route path="/admin/product-edit/:productId" element={<ProductEdit />} />

        {/* Category Routes */}
        <Route path="/female" element={<Female />} />
        <Route path="/men" element={<Men />} />
        <Route path="/categorydetails/:subcategoryType" element={<CategoryDetails />} />
        <Route path="/categoryproduct/:productId" element={<CategoryProduct />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        
        {/* Fallback Route */}
        <Route path="*" element={<NotFound />} /> {/* Any other routes go to NotFound */}
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;