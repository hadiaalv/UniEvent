import { useState } from "react";
import api from "../lib/api";
import { saveToken } from "../lib/auth";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      saveToken(res.data.token);
      router.push("/events");
      toast.success("Logged in!");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-32 bg-primary p-8 rounded-xl space-y-4 shadow-lg animate-fade-in">
        <h2 className="text-xl font-bold mb-2 text-white">Login</h2>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="Email" className="w-full p-2 rounded bg-white" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="Password" className="w-full p-2 rounded bg-white" required />
        <button type="submit" className="w-full bg-accent text-white rounded py-2 animated hover:scale-105 transition">Login</button>
      </form>
    </div>
  );
}