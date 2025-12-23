"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";
import Notification from "../../components/Notification";

export default function SuperAdminDashboard() {
  const [pendingEvents, setPendingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const fetchPendingEvents = async () => {
    try {
      const res = await api.get("/events/pending");
      setPendingEvents(res.data);
    } catch (err) {
      setNotification({ message: "Error fetching pending events", type: "error" });
    }
  };

  const fetchAllEvents = async () => {
    try {
      const res = await api.get("/events/all");
      setAllEvents(res.data);
    } catch (err) {
      console.error("Error fetching all events:", err);
    }
  };
  
  const fetchPendingAdmins = async () => {
    try {
      const res = await api.get("/admin/pending-admins");
      setPendingAdmins(res.data);
    } catch (err) {
      setNotification({
      message: "Error fetching pending admins",
      type: "error",
    });
  }
};

const handleApprove = async (id) => {
  try {
    await api.put(`/events/${id}/approve`);
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
      await api.put(`/events/${id}/reject`);
      setPendingEvents(pendingEvents.filter((ev) => ev._id !== id));
      setNotification({ message: "Event rejected", type: "info" });
      fetchAllEvents();
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

  const handleApproveAdmin = async (id) => {
    try {
      await api.put(`/admin/approve-admin/${id}`);
      setPendingAdmins(pendingAdmins.filter((a) => a._id !== id));
      setNotification({
        message: "Admin approved successfully",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: "Error approving admin",
        type: "error",
      });
    }
  };
  const toggleRole = async (id) => {
    try {
      await api.put(`/admin/toggle-role/${id}`);
      fetchUsers();
      setNotification({
        message: "User role updated",
        type: "success",
      });
    } catch (err) {
      setNotification({
        message: "Failed to update role",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchPendingEvents();
    fetchAllEvents();
    fetchPendingAdmins();
  }, []);
  
  const approvedEvents = allEvents.filter((e) => e.status === "APPROVED");
  const stats = {
    pending: pendingEvents.length,
    approved: approvedEvents.length,
    total: allEvents.length,
  };

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
                ⭐ Super Admin Panel
              </h1>
              <p className="text-lg md:text-xl text-indigo-100">
                Manage events, users, and permissions across the platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {stats.pending}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Pending Review</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ⏳
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  {stats.approved}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Approved Events</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ✓
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  {stats.total}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Total Events</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                📋
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
              activeTab === "pending"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:shadow-lg"
            }`}
          >
            <span className="hidden sm:inline">Pending </span>({stats.pending})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
              activeTab === "all"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:shadow-lg"
            }`}
          >
            <span className="hidden sm:inline">All Events </span>({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("admins")}
            className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
              activeTab === "admins"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:shadow-lg"
            }`}
          >
            <span className="hidden sm:inline">Admins </span>({pendingAdmins.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("permissions");
              fetchUsers();
            }}
            className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
              activeTab === "permissions"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:shadow-lg"
            }`}
          >
            Permissions
          </button>
        </div>

        {/* Pending Events */}
        {activeTab === "pending" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                ⏳
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Events Awaiting Approval
              </h2>
            </div>
            {pendingEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-gray-500 text-lg">No pending events to review</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {pendingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full">
                            {event.category}
                          </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">📅</span>
                            <span className="font-medium">
                              {new Date(event.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">📂</span>
                            <span className="font-medium">{event.category}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-lg">👥</span>
                            <span className="font-medium">{event.organizer}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex lg:flex-col gap-3 w-full lg:w-auto">
                        <button
                          onClick={() => handleApprove(event._id)}
                          className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(event._id)}
                          className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                📋
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                All Events
              </h2>
            </div>
            {allEvents.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-gray-500 text-lg">No events found</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {allEvents.map((event) => (
                  <div
                    key={event._id}
                    className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-lg md:text-xl font-bold text-gray-900">
                            {event.title}
                          </h3>
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              event.status === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : event.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 text-sm md:text-base">
                          {event.description}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📂</span>
                            <span>{event.category}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:col-span-2">
                            <span>👥</span>
                            <span>{event.organizer}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteAny(event._id)}
                        className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
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

        {/* Pending Admins */}
        {activeTab === "admins" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                👨‍💼
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Pending Admin Approvals
              </h2>
            </div>

            {pendingAdmins.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl shadow-md text-center">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-gray-500 text-lg">No pending admins</p>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                {pendingAdmins.map((admin) => (
                  <div
                    key={admin._id}
                    className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div>
                      <p className="text-lg md:text-xl font-bold text-gray-900">
                        {admin.name}
                      </p>
                      <p className="text-gray-600">{admin.email}</p>
                    </div>

                    <button
                      onClick={() => handleApproveAdmin(admin._id)}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
                    >
                      ✓ Approve Admin
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* User Permissions */}
        {activeTab === "permissions" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                🔐
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                User Permissions
              </h2>
            </div>

            <div className="space-y-4 md:space-y-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div>
                    <p className="text-lg md:text-xl font-bold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-gray-600 mb-1">{user.email}</p>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
                      Role: {user.role}
                    </span>
                  </div>

                  {user.role !== "SUPER_ADMIN" && (
                    <button
                      onClick={() => toggleRole(user._id)}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white transition-all transform hover:scale-105 shadow-md ${
                        user.role === "ADMIN"
                          ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      }`}
                    >
                      {user.role === "ADMIN"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </button>
                  )}
                </div>
              ))}
            </div>
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