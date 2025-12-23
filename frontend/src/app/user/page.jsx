"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import EventCard from "../../components/EventCard";
import EventFilters from "../../components/EventFilters";
import Notification from "../../components/Notification";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [userInterests, setUserInterests] = useState({});
  const [filters, setFilters] = useState({
    category: "",
    dateFilter: "all",
    organizer: "",
  });

  useEffect(() => {
    fetchEvents();
    loadUserInterests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filters]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/public");
      setEvents(res.data);
    } catch (err) {
      setNotification({ message: "Failed to fetch events", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const loadUserInterests = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userInterests");
      if (saved) setUserInterests(JSON.parse(saved));
    }
  };

  const saveUserInterest = (eventId, type) => {
    const updated = { ...userInterests, [eventId]: type };
    setUserInterests(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("userInterests", JSON.stringify(updated));
    }
  };

  const handleInterested = (eventId) => {
    const currentInterest = userInterests[eventId];
    const newInterest = currentInterest === "interested" ? null : "interested";
    saveUserInterest(eventId, newInterest);
    setNotification({
      message: newInterest ? "Marked as interested!" : "Interest removed",
      type: "info",
    });
  };

  const handleGoing = (eventId) => {
    const currentInterest = userInterests[eventId];
    const newInterest = currentInterest === "going" ? null : "going";
    saveUserInterest(eventId, newInterest);
    setNotification({
      message: newInterest ? "You're going to this event!" : "Going status removed",
      type: "success",
    });
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Category filter
    if (filters.category) {
      filtered = filtered.filter((e) => e.category === filters.category);
    }

    // Date filter
    const now = new Date();
    if (filters.dateFilter === "upcoming") {
      filtered = filtered.filter((e) => new Date(e.date) >= now);
    } else if (filters.dateFilter === "past") {
      filtered = filtered.filter((e) => new Date(e.date) < now);
    }

    // Organizer filter
    if (filters.organizer) {
      filtered = filtered.filter((e) =>
        e.organizer.toLowerCase().includes(filters.organizer.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  const categories = [...new Set(events.map((e) => e.category))];
  const upcomingEvents = filteredEvents.filter((e) => new Date(e.date) >= new Date());
  const pastEvents = filteredEvents.filter((e) => new Date(e.date) < new Date());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-48 h-48 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            </div>
            <div className="relative">
              <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
                🎉 University Events
              </h1>
              <p className="text-lg md:text-xl text-indigo-100">
                Discover and join exciting campus events
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {upcomingEvents.length}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Upcoming Events</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                📅
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {Object.values(userInterests).filter((v) => v === "going").length}
                </h3>
                <p className="text-gray-600 font-medium mt-1">You're Going To</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ✓
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {Object.values(userInterests).filter((v) => v === "interested").length}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Interested Events</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ⭐
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFilters filters={filters} onChange={setFilters} categories={categories} />
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                📅
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Upcoming Events
              </h2>
            </div>
            <div className="space-y-4 md:space-y-6">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onInterested={handleInterested}
                  onGoing={handleGoing}
                  userInterest={userInterests[event._id]}
                />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-xl flex items-center justify-center text-xl shadow-md">
                📚
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Past Events
              </h2>
            </div>
            <div className="space-y-4 md:space-y-6">
              {pastEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  showActions={false}
                  userInterest={userInterests[event._id]}
                />
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-md">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg md:text-xl font-medium">
              No events found matching your filters.
            </p>
            <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
          </div>
        )}
      </div>

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
      `}</style>
    </div>
  );
}