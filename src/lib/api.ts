import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""; // Use relative path

const api = axios.create({
  baseURL: API_BASE_URL, // Relative path for Next.js
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (adds token from cookies)
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Fetch token from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
