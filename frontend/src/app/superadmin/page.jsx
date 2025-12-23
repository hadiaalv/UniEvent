"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import Notification from "../../components/Notification";

export default function SuperAdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    fetchPendingEvents();
    fetchAllEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/admin/pending");
      setPendingEvents(res.data);
    } catch (err) {
      setNotification({ message: "Error fetching pending events", type: "error" });
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/events");
      setAllEvents(res.data);
    } catch (err) {
      console.error("Error fetching all events:", err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/approve/${id}`);
      setPendingEvents(pendingEvents.filter((ev) => ev._id !== id));
      setNotification({ message: "Event approved successfully!", type: "success" });
      fetchAllEvents();
    } catch (err) {
      setNotification({ message: "Error approving event", type: "error" });
    }
  };

  const handleReject = async (id) => {
    if (!confirm("Are you sure you want to reject this event?")) return;
    
    try {
      await api.delete(`/events/${id}`);
      setPendingEvents(pendingEvents.filter((ev) => ev._id !== id));
      setNotification({ message: "Event rejected", type: "info" });
    } catch (err) {
      setNotification({ message: "Error rejecting event", type: "error" });
    }
  };

  const handleDeleteAny = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await api.delete(`/events/${id}`);
      setAllEvents(allEvents.filter((ev) => ev._id !== id));
      setNotification({ message: "Event deleted", type: "success" });
    } catch (err) {
      setNotification({ message: "Error deleting event", type: "error" });
    }
  };

  const approvedEvents = allEvents.filter((e) => e.status === "APPROVED");
  const stats = {
    pending: pendingEvents.length,
    approved: approvedEvents.length,
    total: allEvents.length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-4xl font-bold mb-8">⭐ Super Admin Panel</h1>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-yellow-600">{stats.pending}</h3>
          <p className="text-gray-700">Pending Review</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-green-600">{stats.approved}</h3>
          <p className="text-gray-700">Approved Events</p>
        </div>
        <div className="bg-blue-100 p-6 rounded-lg">
          <h3 className="text-3xl font-bold text-blue-600">{stats.total}</h3>
          <p className="text-gray-700">Total Events</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "pending"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Pending ({stats.pending})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All Events ({stats.total})
        </button>
      </div>

      {/* Pending Events */}
      {activeTab === "pending" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">⏳ Events Awaiting Approval</h2>
          {pendingEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No pending events to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <div
                  key={event._id}
                  className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-blue-600 mb-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-700 mb-4">{event.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">📅 Date:</span>{" "}
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-semibold">📂 Category:</span>{" "}
                          {event.category}
                        </div>
                        <div>
                          <span className="font-semibold">👥 Organizer:</span>{" "}
                          {event.organizer}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-6">
                      <button
                        onClick={() => handleApprove(event._id)}
                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded font-semibold transition-colors"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(event._id)}
                        className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition-colors"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* All Events */}
      {activeTab === "all" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">📋 All Events</h2>
          {allEvents.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-500">No events found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {allEvents.map((event) => (
                <div
                  key={event._id}
                  className="p-6 bg-white shadow rounded-lg hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{event.title}</h3>
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            event.status === "APPROVED"
                              ? "bg-green-100 text-green-800"
                              : event.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{event.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                        <div>📂 {event.category}</div>
                        <div className="col-span-2">👥 {event.organizer}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAny(event._id)}
                      className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}