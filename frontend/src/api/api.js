import axios from "axios";

const api = axios.create({
  //baseURL: "https://uni-vibe-backend-eight.vercel.app/api", // backend deployed URL
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // only if backend uses cookies
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;
