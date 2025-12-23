"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl transition-transform group-hover:scale-110">🎓</span>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              UniEvent
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {/* Role Badge */}
                <span className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full shadow-md">
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </span>
                
                {/* Dashboard Button */}
                {user.role === "USER" && (
                  <Link 
                    href="/user" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "SUPER_ADMIN" && (
                  <Link 
                    href="/superadmin" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Login Link */}
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-full font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col gap-3">
                {/* Role Badge */}
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full text-center shadow-md">
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : user.role.charAt(0) + user.role.slice(1).toLowerCase()}
                </div>
                
                {/* Dashboard Buttons */}
                {user.role === "USER" && (
                  <Link 
                    href="/user" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all text-center"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "ADMIN" && (
                  <Link 
                    href="/admin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all text-center"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "SUPER_ADMIN" && (
                  <Link 
                    href="/superadmin" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all text-center"
                  >
                    Admin Panel
                  </Link>
                )}
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-5 py-3 rounded-full font-semibold shadow-md transition-all text-center"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Login Link */}
                <Link 
                  href="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-indigo-600 font-medium transition-colors px-4 py-2 hover:bg-gray-50 rounded-lg"
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-full font-semibold shadow-md transition-all text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}