import axios from "axios";

// Set base URL depending on environment
const baseURL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://uni-vibe-backend-eight.vercel.app/api";

const api = axios.create({
  baseURL,
});

// Add Authorization header if token exists
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
