"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function UserDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
      alert("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Approved Events</h1>
      
      {events.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600">No approved events available at the moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event._id} className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-bold text-blue-600 mb-2">{event.title}</h2>
              <p className="text-gray-700 mb-3">{event.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                <span><strong>Category:</strong> {event.category}</span>
                <span><strong>Organizer:</strong> {event.organizer}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}