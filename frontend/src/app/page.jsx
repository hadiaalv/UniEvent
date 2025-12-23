"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white flex flex-col">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-2xl font-bold">🎓 UniEvent</h1>
        <Link
          href="/login"
          className="bg-white text-indigo-600 px-5 py-2 rounded-lg font-semibold hover:bg-gray-100"
        >
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          All University Events. <br /> One Platform.
        </h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 text-indigo-100">
          UniEvent centralizes campus events with role-based access and approval
          workflow for students, admins, and super admins.
        </p>

        <div className="flex gap-4">
          <Link
            href="/login"
            className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100"
          >
            Get Started
          </Link>

          <a
            href="#features"
            className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-white text-gray-800 py-16 px-8"
      >
        <h3 className="text-3xl font-bold text-center mb-12">
          Why UniEvent?
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Feature
            title="👩‍🎓 Students"
            text="View approved events, filter by category, and never miss out."
          />
          <Feature
            title="🧑‍💼 Admins"
            text="Create events and send them for super admin approval."
          />
          <Feature
            title="🛡 Super Admin"
            text="Approve or reject events to maintain quality and trust."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-900 text-gray-300">
        © {new Date().getFullYear()} UniEvent • Built for Universities
      </footer>
    </main>
  );
}

function Feature({ title, text }) {
  return (
    <div className="bg-gray-100 rounded-xl p-6 shadow hover:shadow-lg transition">
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p>{text}</p>
    </div>
  );
}
