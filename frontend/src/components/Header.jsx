"use client";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          🎓 UniEvent
        </Link>

        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                {user.role}
              </span>
              {user.role === "USER" && (
                <Link href="/user" className="hover:text-blue-200">
                  Events
                </Link>
              )}
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-blue-200">
                  Dashboard
                </Link>
              )}
              {user.role === "SUPER_ADMIN" && (
                <Link href="/superadmin" className="hover:text-blue-200">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}