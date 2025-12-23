"use client";
import { useState } from "react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Notification from "../../components/Notification";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const { login } = useAuth();

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", { email, password });
    login(res.data.token, res.data.role);
    const message = res.data.message || "Login successful!";
    const type = res.data.role === "USER" && res.data.user?.actualRole === "ADMIN" 
      ? "info" 
      : "success";
    setNotification({ message, type });
  } catch (err) {
    setNotification({ 
      message: err.response?.data?.message || err.response?.data?.msg || "Login failed", 
      type: "error" 
    });
  }
};

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-lg rounded-lg">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Login to UniEvent
      </h2>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition-colors"
        >
          Login
        </button>
      </form>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <a href="/register" className="text-blue-600 hover:text-blue-800 font-semibold">
          Register here
        </a>
      </p>
    </div>
  );
}