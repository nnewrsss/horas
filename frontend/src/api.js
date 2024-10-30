

// รอ 3 วินาทีแล้วค่อยซ่อน welcome overlay
window.addEventListener('load', function () {
  setTimeout(function () {
      const overlay = document.getElementById('welcomeOverlay');
      overlay.style.transition = 'opacity 1s';
      overlay.style.opacity = '0';
      setTimeout(() => overlay.style.display = 'none', 1000); // ซ่อน overlay หลังจากที่ fade out เสร็จ
  }, 2500); // 3000ms = 3 วินาที
});





import axios from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"; // ดึงโทเคนจาก constants

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ใช้ environment variables สำหรับ API URL
});

// Interceptor สำหรับการแนบโทเคนในคำขอ
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN); // ดึง access token จาก LocalStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ใส่ access token ใน Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor สำหรับการจัดการเมื่อ access token หมดอายุ
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ตรวจสอบว่าโทเคนหมดอายุหรือไม่
    if (error.response.status === 401 && error.response.data.code === "token_not_valid" && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        try {
          // ส่งคำขอเพื่อขอโทเคนใหม่
          const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          // เก็บ access token ใหม่ใน LocalStorage
          localStorage.setItem(ACCESS_TOKEN, response.data.access);

          // ตั้งค่า access token ใหม่ใน header ของคำขอ
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;

          // ส่งคำขอใหม่อีกครั้ง
          return api(originalRequest);
        } catch (refreshError) {
          // หาก refresh token หมดอายุหรือไม่ถูกต้อง ให้ทำการ redirect ไปหน้า login
          console.error("Refresh token expired or invalid");
          window.location.href = "/login"; // ไปที่หน้า login
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
