// import react from "react"
// import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
// import Login from "./pages/Login"
// import Register from "./pages/Register"
// import Home from "./pages/Home"
// import Homes from "./pages/Homes"
// import NotFound from "./pages/NotFound"
// import ProtectedRoute from "./components/ProtectedRoute"
// import Support from "./pages/support"
// import AboutUs from "./pages/AboutUs"
// import AdminHome from './pages/AdminHome'
// import ProductDetailForm from './pages/ProductDetailForm';
// import ProductList from './pages/ProductList';
// import ProductEdit from "./pages/productEdit"
// import PrivateRoute from './components/PrivateRoute'; // นำเข้า PrivateRoute


// function Logout() {
//   localStorage.clear()
//   return <Navigate to="/homes"/>
// }

// function RegisterAndLogout() {
//   localStorage.clear()
//   return <Register/>
// }
// function App() {

//   return (
//     <BrowserRouter>
//     <Routes>
//       <Route
//       path ="/"
//       element = {
//         <ProtectedRoute>
//           <Homes/>
//         </ProtectedRoute>
//       }
//       />
//       <Route path="/login" element={<Login/>}/>
//       <Route path="/home" element={<Home />} />
//       <Route path="/adminhome" element={<AdminHome/>} />
//       <Route path="/homes" element={<Homes />} />
//       <Route path="/logout" element={<Logout/>} />
//       <Route path="/register" element={<RegisterAndLogout/>} />
//       <Route path="/support" element={<Support/>} />
//       <Route path="*" element={<NotFound/>}></Route>
//       <Route path="/Aboutus" element={<AboutUs/>}></Route>
//       <Route path="/admin/product-detail" element={<ProductDetailForm />} />
//       <Route path="/admin/product-list" element={<ProductList />} />
//       <Route path="/admin/product-edit/:productId" element={<ProductEdit />} />
//     </Routes>
//     </BrowserRouter>
//   )
// }

// export default App

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homes from "./pages/Homes";
import NotFound from "./pages/NotFound";
import Support from "./pages/Support";
import AboutUs from "./pages/AboutUs";
import AdminHome from './pages/AdminHome';
import ProductDetailForm from './pages/ProductDetailForm';
import ProductList from './pages/ProductList';
import ProductEdit from "./pages/ProductEdit";
import PrivateRoute from './components/PrivateRoute'; // นำเข้า PrivateRoute
import Female from './pages/female'
import Men from './pages/Men'
import CategoryDetails from './pages/CategoryDetails';

function Logout() {
  localStorage.clear(); // เคลียร์ข้อมูลใน localStorage เมื่อผู้ใช้ล็อกเอาท์
  return <Navigate to="/login" />; // เปลี่ยนเส้นทางไปที่หน้า login
}

function RegisterAndLogout() {
  localStorage.clear(); // เคลียร์ข้อมูลใน localStorage เมื่อผู้ใช้ไปที่หน้าลงทะเบียน
  return <Navigate to="/register" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* เส้นทาง "/" เปลี่ยนเส้นทางไปยัง "/homes" */}
        {/* <Route path="/" element={<Navigate to="/homes" />} /> */}
        
        {/* เส้นทาง "/homes" จะถูกป้องกันโดย PrivateRoute */}
        <Route path="/homes" element={
          <PrivateRoute>
            <Homes />
          </PrivateRoute>
        } />

        <Route path="/login" element={<Login />} />
        <Route path="/adminhome" element={
          <PrivateRoute>
            <AdminHome />
          </PrivateRoute>
        } />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/support" element={<Support />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/admin/product-detail" element={<ProductDetailForm />} />
        <Route path="/admin/product-list" element={<ProductList />} />
        <Route path="/admin/product-edit/:productId" element={<ProductEdit />} />
        <Route path="*" element={<NotFound />} /> {/* เส้นทางอื่นๆ จะนำไปที่หน้า NotFound */}
        <Route path="/female" element={<Female/>} />
        <Route path="/men" element={<Men/>} />
        <Route path="/categorydetails/:subcategoryType" element={<CategoryDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
