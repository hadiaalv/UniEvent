"use client";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function SuperAdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get("/admin/pending").then((res) => setEvents(res.data));
  }, []);

  const approve = async (id) => {
    await api.put(`/admin/approve/${id}`);
    setEvents(events.filter((ev) => ev._id !== id));
    alert("Event Approved");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Super Admin - Pending Events</h1>
      <div className="space-y-4">
        {events.map((ev) => (
          <div key={ev._id} className="p-4 bg-white shadow rounded flex justify-between">
            <div>
              <h2 className="font-bold">{ev.title}</h2>
              <p>{ev.description}</p>
              <p>Date: {new Date(ev.date).toLocaleDateString()}</p>
            </div>
            <button
              onClick={() => approve(ev._id)}
              className="bg-blue-600 text-white p-2 rounded"
            >
              Approve
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
