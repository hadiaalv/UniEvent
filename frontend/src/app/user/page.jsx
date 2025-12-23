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
      const res = await api.get("/events");
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🎉 University Events</h1>
        <p className="text-gray-600">Discover and join exciting campus events</p>
      </div>

      <EventFilters filters={filters} onChange={setFilters} categories={categories} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-blue-600">{upcomingEvents.length}</h3>
          <p className="text-gray-700">Upcoming Events</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-green-600">
            {Object.values(userInterests).filter((v) => v === "going").length}
          </h3>
          <p className="text-gray-700">Events You're Going To</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-purple-600">
            {Object.values(userInterests).filter((v) => v === "interested").length}
          </h3>
          <p className="text-gray-700">Interested Events</p>
        </div>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">📅 Upcoming Events</h2>
          <div className="space-y-4">
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
          <h2 className="text-2xl font-bold mb-4">📚 Past Events</h2>
          <div className="space-y-4">
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found matching your filters.</p>
        </div>
      )}
    </div>
  );
}