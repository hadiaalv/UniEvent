"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../lib/api";

export default function HomePage() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchEvents();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    }
  };

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/public");
      const now = new Date();
      
      const upcoming = res.data
        .filter(e => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6);
      
      const past = res.data
        .filter(e => new Date(e.date) < now && e.images && e.images.length > 0)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
              All University Events.<br />
              <span className="bg-gradient-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                One Platform.
              </span>
            </h2>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-indigo-100">
              Discover, create, and manage campus events with seamless role-based access 
              and approval workflows for the entire university community.
            </p>

            {!isLoggedIn && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/login"
                  className="bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  Get Started →
                </Link>
                <a
                  href="#upcoming"
                  className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Explore Events
                </a>
              </div>
            )}

            {isLoggedIn && (
              <div className="flex justify-center">
                <a
                  href="#upcoming"
                  className="border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-indigo-600 transition-all"
                >
                  Explore Events
                </a>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming" className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📅 Upcoming Events
            </h3>
            <p className="text-gray-600 text-lg">
              Don't miss out on these exciting campus events
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white">
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium backdrop-blur-sm">
                        {event.category}
                      </span>
                      <span className="text-2xl">
                        {event.category === "Workshop" ? "🛠️" :
                         event.category === "Sports" ? "⚽" :
                         event.category === "Cultural" ? "🎭" :
                         event.category === "Career" ? "💼" :
                         event.category === "Seminar" ? "📚" :
                         event.category === "Academic" ? "🎓" : "📌"}
                      </span>
                    </div>
                    <h4 className="text-2xl font-bold mb-2">{event.title}</h4>
                    <div className="flex items-center gap-2 text-indigo-100">
                      <span className="text-sm">📅</span>
                      <span className="text-sm font-medium">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">👥</span>
                      <span className="font-medium">{event.organizer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl">
              <p className="text-gray-500 text-lg">No upcoming events at the moment. Check back soon! 🎉</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Highlights */}
      {pastEvents.length > 0 && (
        <section id="highlights" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                📸 Event Highlights
              </h3>
              <p className="text-gray-600 text-lg">
                Relive the best moments from our recent events
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <div
                  key={event._id}
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowGallery(true);
                  }}
                  className="group relative bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden cursor-pointer"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=Event+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block px-3 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
                        {event.category}
                      </span>
                      <h4 className="text-xl font-bold mb-1">{event.title}</h4>
                      <p className="text-sm text-gray-200">
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </p>
                    </div>
                    {event.images.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        +{event.images.length - 1} photos
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {event.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">👥</span>
                      <span>{event.organizer}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose UniVibe?
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A complete event management solution designed specifically for university communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Feature
              icon="👩‍🎓"
              title="Students"
              text="Browse approved events, filter by category, mark your favorites, and never miss important campus activities."
              gradient="from-blue-500 to-cyan-500"
            />
            <Feature
              icon="🧑‍💼"
              title="Admins"
              text="Create and manage events with ease. Submit events for approval and track their status in real-time."
              gradient="from-purple-500 to-pink-500"
            />
            <Feature
              icon="🛡️"
              title="Super Admin"
              text="Review, approve, or reject events to maintain quality. Manage user permissions and oversee all platform activities."
              gradient="from-orange-500 to-red-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isLoggedIn && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Get Started?
            </h3>
            <p className="text-indigo-100 text-lg mb-8">
              Join thousands of students and faculty members managing events on UniEvent
            </p>
            <Link
              href="/login"
              className="inline-block bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Start Now - It's Free →
            </Link>
          </div>
        </section>
      )}

      {/* Image Gallery Modal */}
      {showGallery && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowGallery(false);
                setSelectedEvent(null);
              }}
              className="fixed top-4 right-4 bg-white hover:bg-gray-200 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold shadow-lg z-10 transition-all"
            >
              ×
            </button>

            {/* Event Info */}
            <div className="bg-white rounded-t-2xl p-6 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                  {selectedEvent.category}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedEvent.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  })}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h2>
              <p className="text-gray-600 mb-3">{selectedEvent.description}</p>
              <div className="flex items-center text-gray-500">
                <span className="mr-2">👥</span>
                <span className="font-medium">Organized by {selectedEvent.organizer}</span>
              </div>
            </div>

            {/* Image Gallery Grid */}
            <div className="grid md:grid-cols-2 gap-4 pb-4">
              {selectedEvent.images.map((image, index) => (
                <div
                  key={index}
                  className="relative bg-white rounded-2xl overflow-hidden shadow-lg"
                >
                  <img
                    src={image}
                    alt={`${selectedEvent.title} - Photo ${index + 1}`}
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/800x600?text=Image+Not+Available";
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <p className="text-white text-sm font-medium">
                      Photo {index + 1} of {selectedEvent.images.length}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 bg-gray-900 text-gray-300">
        © {new Date().getFullYear()} UniEvent • Built for Universities
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </main>
  );
}

function Feature({ icon, title, text, gradient }) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-2">
      <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg`}>
        {icon}
      </div>
      <h4 className="text-2xl font-bold mb-3 text-gray-900">{title}</h4>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  );
}