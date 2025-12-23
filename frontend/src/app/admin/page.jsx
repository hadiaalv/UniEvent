"use client";
import { useState } from "react";
import api from "../../lib/api";

export default function AdminDashboard() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");

  const handleCreate = async () => {
    try {
      await api.post("/events", {
        title,
        description: desc,
        date,
        category: "General",
        organizer: "Admin Dept",
      });
      alert("Event Created (Pending Approval)");
      setTitle("");
      setDesc("");
      setDate("");
    } catch (err) {
      alert("Error creating event");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="max-w-md p-4 bg-white shadow rounded space-y-2">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleCreate}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}
