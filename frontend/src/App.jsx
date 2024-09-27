import react from "react"
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Homes from "./pages/Homes"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Support from "./pages/support"
import AboutUs from "./pages/AboutUs"
import AdminHome from './pages/AdminHome'
import ProductDetailForm from './pages/ProductDetailForm';
import ProductList from './pages/ProductList';
import ProductEdit from "./pages/productEdit"


function Logout() {
  localStorage.clear()
  return <Navigate to="/login"/>
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}
function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route
      path ="/"
      element = {
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/adminhome" element={<AdminHome/>} />
      <Route path="/homes" element={<Homes />} />
      <Route path="/logout" element={<Logout/>} />
      <Route path="/register" element={<RegisterAndLogout/>} />
      <Route path="/support" element={<Support/>} />
      <Route path="*" element={<NotFound/>}></Route>
      <Route path="/Aboutus" element={<AboutUs/>}></Route>
      <Route path="/admin/product-detail" element={<ProductDetailForm />} />
      <Route path="/admin/product-list" element={<ProductList />} />
      <Route path="/admin/product-edit/:productId" element={<ProductEdit />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
