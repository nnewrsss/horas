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


function Logout() {
  localStorage.clear()
  return <Navigate to="/homes"/>
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
          <Homes/>
        </ProtectedRoute>
      }
      />
      <Route path="/login" element={<Login/>}/>
      <Route path="/home" element={<Home />} />
      <Route path="/homes" element={<Homes />} />
      <Route path="/logout" element={<Logout/>} />
      <Route path="/register" element={<RegisterAndLogout/>} />
      <Route path="/support" element={<Support/>} />
      <Route path="*" element={<NotFound/>}></Route>
      <Route path="/Aboutus" element={<AboutUs/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
