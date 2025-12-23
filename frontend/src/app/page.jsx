"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto mt-20 text-center">
      <h1 className="text-5xl font-bold mb-6 text-blue-600">
        Welcome to UniEvent
      </h1>
      <p className="text-xl text-gray-700 mb-12">
        Your University Event Management System
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link 
          href="/login"
          className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-4">👤</div>
          <h2 className="text-2xl font-bold mb-2">User Login</h2>
          <p className="text-gray-600">View approved events</p>
        </Link>
        
        <Link 
          href="/login"
          className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-4">👨‍💼</div>
          <h2 className="text-2xl font-bold mb-2">Admin Login</h2>
          <p className="text-gray-600">Create and manage events</p>
        </Link>
        
        <Link 
          href="/login"
          className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
        >
          <div className="text-4xl mb-4">⭐</div>
          <h2 className="text-2xl font-bold mb-2">Super Admin</h2>
          <p className="text-gray-600">Approve pending events</p>
        </Link>
      </div>
      
      <div className="mt-12 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-bold mb-4">Test Credentials</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white p-4 rounded">
            <p className="font-bold">User:</p>
            <p className="text-sm">Email: user@test.com</p>
            <p className="text-sm">Password: password</p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="font-bold">Admin:</p>
            <p className="text-sm">Email: admin@test.com</p>
            <p className="text-sm">Password: password</p>
          </div>
          <div className="bg-white p-4 rounded">
            <p className="font-bold">Super Admin:</p>
            <p className="text-sm">Email: super@test.com</p>
            <p className="text-sm">Password: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}