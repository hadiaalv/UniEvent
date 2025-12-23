"use client";
import { useState, useEffect } from "react";
import api from "../../lib/api";
import Notification from "../../components/Notification";
import ImageUploadModal from "../../components/ImageUploadModal";

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "General",
    organizer: "",
  });
  const [myEvents, setMyEvents] = useState([]);
  const [notification, setNotification] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  const handleAddImages = async (images) => {
    try {
      await api.put(`/events/${selectedEvent._id}/images`, { images });
      setNotification({ message: "Images added successfully!", type: "success" });
      setShowImageModal(false);
      fetchMyEvents();
    } catch (err) {
      setNotification({ message: "Error adding images", type: "error" });
    }
  };

  const fetchMyEvents = async () => {
    try {
      const res = await api.get("/events/my");
      setMyEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };
  
  useEffect(() => {
    fetchMyEvents();
  }, []);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent._id}`, formData);
        setNotification({ message: "Event updated successfully!", type: "success" });
        setEditingEvent(null);
      } else {
        await api.post("/events", formData);
        setNotification({ 
          message: "Event created! Waiting for Super Admin approval.", 
          type: "success" 
        });
      }
      
      setFormData({
        title: "",
        description: "",
        date: "",
        category: "General",
        organizer: "",
      });
      fetchMyEvents();
    } catch (err) {
      setNotification({ 
        message: err.response?.data?.msg || "Error creating event", 
        type: "error" 
      });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split("T")[0],
      category: event.category,
      organizer: event.organizer,
    });
  };

  const handleDelete = async (eventId) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await api.delete(`/events/${eventId}`);
      setNotification({ message: "Event deleted successfully", type: "success" });
      fetchMyEvents();
    } catch (err) {
      setNotification({ message: "Error deleting event", type: "error" });
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      category: "General",
      organizer: "",
    });
  };

  const pendingEvents = myEvents.filter((e) => e.status === "PENDING");
  const approvedEvents = myEvents.filter((e) => e.status === "APPROVED");
  const rejectedEvents = myEvents.filter((e) => e.status === "REJECTED");

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
                👨‍💼 Admin Dashboard
              </h1>
              <p className="text-lg md:text-xl text-indigo-100">
                Create and manage your campus events
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
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  {pendingEvents.length}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Pending Approval</p>
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
                  {approvedEvents.length}
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
                <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                  {rejectedEvents.length}
                </h3>
                <p className="text-gray-600 font-medium mt-1">Rejected Events</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                ✗
              </div>
            </div>
          </div>
        </div>

        {/* Create/Edit Event Form */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-xl shadow-md">
              {editingEvent ? "✏️" : "➕"}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {editingEvent ? "Edit Event" : "Create New Event"}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Annual Tech Summit"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="General">General</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Sports">Sports</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Career">Career</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Detailed description of the event..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Organizer *
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  required
                  className="w-full p-3 md:p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Tech Society"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-3 md:p-4 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
              >
                {editingEvent ? "Update Event" : "Create Event"}
              </button>
              {editingEvent && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-8 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 p-3 md:p-4 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* My Events */}
        <div className="space-y-8">
          {/* Pending Events */}
          {pendingEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                  ⏳
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Pending Approval
                </h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {pendingEvents.map((event) => (
                  <EventItem
                    key={event._id}
                    event={event}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onAddPhotos={(event) => {
                      setSelectedEvent(event);
                      setShowImageModal(true);
                    }}
                    canEdit
                  />
                ))}
              </div>
            </div>
          )}

          {/* Approved Events */}
          {approvedEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                  ✓
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Approved Events
                </h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {approvedEvents.map((event) => (
                  <EventItem 
                    key={event._id} 
                    event={event} 
                    onAddPhotos={(event) => {
                      setSelectedEvent(event);
                      setShowImageModal(true);
                    }}
                    canEdit={false} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Rejected Events */}
          {rejectedEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center text-xl shadow-md">
                  ✗
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Rejected Events
                </h2>
              </div>
              <div className="space-y-4 md:space-y-6">
                {rejectedEvents.map((event) => (
                  <EventItem
                    key={event._id}
                    event={event}
                    onDelete={handleDelete}
                    canEdit={false}
                  />
                ))}
              </div>
            </div>
          )}

          {myEvents.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow-md">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg md:text-xl font-medium">
                You haven't created any events yet.
              </p>
              <p className="text-gray-400 mt-2">Start by creating your first event above!</p>
            </div>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageModal && selectedEvent && (
        <ImageUploadModal
          event={selectedEvent}
          onClose={() => setShowImageModal(false)}
          onSave={handleAddImages}
        />
      )}

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

function EventItem({ event, onEdit, onDelete, onAddPhotos, canEdit }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-2xl hover:shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-semibold rounded-full">
              {event.category}
            </span>
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
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
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
            <div className="flex items-center gap-2 text-gray-600 sm:col-span-2">
              <span className="text-lg">👥</span>
              <span className="font-medium">{event.organizer}</span>
            </div>
          </div>
        </div>
        <div className="flex lg:flex-col gap-3 w-full lg:w-auto">
          {onAddPhotos && new Date(event.date) < new Date() && (
            <button
              onClick={() => onAddPhotos(event)}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
            >
              📸 Photos ({event.images?.length || 0})
            </button>
          )}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event._id)}
              className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}