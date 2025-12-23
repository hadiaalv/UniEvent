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
      fetchMyEvents(); // Refresh events
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
    <div className="max-w-6xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <h1 className="text-4xl font-bold mb-8">👨‍💼 Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-yellow-600">{pendingEvents.length}</h3>
          <p className="text-gray-700">Pending Approval</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-green-600">{approvedEvents.length}</h3>
          <p className="text-gray-700">Approved Events</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <h3 className="text-2xl font-bold text-red-600">{rejectedEvents.length}</h3>
          <p className="text-gray-700">Rejected Events</p>
        </div>
      </div>

      {/* Create/Edit Event Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingEvent ? "✏️ Edit Event" : "➕ Create New Event"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Annual Tech Summit"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="Detailed description of the event..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Event Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Organizer *</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500"
                placeholder="Tech Society"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded font-semibold transition-colors"
            >
              {editingEvent ? "Update Event" : "Create Event"}
            </button>
            {editingEvent && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 p-3 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* My Events */}
      <div className="space-y-6">
        {/* Pending Events */}
        {pendingEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">⏳ Pending Approval</h2>
            <div className="space-y-4">
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
            <h2 className="text-2xl font-bold mb-4">✅ Approved Events</h2>
            <div className="space-y-4">
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
            <h2 className="text-2xl font-bold mb-4">❌ Rejected Events</h2>
            <div className="space-y-4">
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
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 text-lg">You haven't created any events yet.</p>
          </div>
        )}
      </div>

      {/* Image Upload Modal */}
      {showImageModal && selectedEvent && (
        <ImageUploadModal
          event={selectedEvent}
          onClose={() => setShowImageModal(false)}
          onSave={handleAddImages}
        />
      )}
    </div>
  );
}

function EventItem({ event, onEdit, onDelete, onAddPhotos, canEdit }) {
  return (
    <div className="p-6 bg-white shadow rounded-lg">
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
        <div className="flex gap-2 ml-4 flex-col">
          {/* Add Photos button for past events */}
          {onAddPhotos && new Date(event.date) < new Date() && (
            <button
              onClick={() => onAddPhotos(event)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded font-semibold"
            >
              📸 Add Photos ({event.images?.length || 0})
            </button>
          )}
          {canEdit && onEdit && (
            <button
              onClick={() => onEdit(event)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event._id)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}