// import axios from "axios"
// import { ACCESS_TOKEN } from "./constants"

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL
// })

// // api.interceptors.request.use(
// //     (config) => {
// //         const token = localStorage.getItem(ACCESS_TOKEN);
// //         if(token){
// //             config.headers.Authorization = `Bearer ${token}` 
// //         }
// //         return config
// //     },
// //     (error) => {
// //         return Promise.reject(error)
// //     }
// // )





// // ... ส่วนของการ import และ request interceptor ...

// // Response interceptor
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             const refreshToken = localStorage.getItem("refresh");
//             if (refreshToken) {
//                 try {
//                     const res = await axios.post("/myapp/token/refresh/", {
//                         refresh: refreshToken,
//                     });
//                     localStorage.setItem("access", res.data.access);
//                     api.defaults.headers.common["Authorization"] = `Bearer ${res.data.access}`;
//                     return api(originalRequest);
//                 } catch (err) {
//                     console.error(err);
//                     // ถ้ารีเฟรชไม่สำเร็จ ให้พาผู้ใช้ไปยังหน้าล็อกอิน
//                     window.location.href = "/login";
//                 }
//             } else {
//                 window.location.href = "/login";
//             }
//         }
//         return Promise.reject(error);
//     }
// );


// export default api











// api.js
import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
