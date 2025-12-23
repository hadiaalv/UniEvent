"use client";
import { useState } from "react";

export default function EventCard({ event, onInterested, onGoing, userInterest, showActions = true }) {
  const [interest, setInterest] = useState(userInterest);

  const handleInterested = () => {
    setInterest(interest === "interested" ? null : "interested");
    if (onInterested) onInterested(event._id);
  };

  const handleGoing = () => {
    setInterest(interest === "going" ? null : "going");
    if (onGoing) onGoing(event._id);
  };

  const isPast = new Date(event.date) < new Date();

  return (
    <div className={`p-6 bg-white shadow rounded-lg hover:shadow-xl transition-shadow ${isPast ? 'opacity-60' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-blue-600">{event.title}</h2>
        {event.status && (
          <span className={`px-3 py-1 text-xs rounded-full ${
            event.status === "APPROVED" ? "bg-green-100 text-green-800" :
            event.status === "PENDING" ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          }`}>
            {event.status}
          </span>
        )}
      </div>

      <p className="text-gray-700 mb-4">{event.description}</p>

      <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
        <div>
          <span className="font-semibold">📅 Date:</span>{" "}
          {new Date(event.date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        <div>
          <span className="font-semibold">📂 Category:</span> {event.category}
        </div>
        <div className="col-span-2">
          <span className="font-semibold">👥 Organizer:</span> {event.organizer}
        </div>
      </div>

      {showActions && !isPast && (
        <div className="flex gap-3 mt-4 pt-4 border-t">
          <button
            onClick={handleInterested}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              interest === "interested"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ⭐ {interest === "interested" ? "Interested" : "Mark Interested"}
          </button>
          <button
            onClick={handleGoing}
            className={`flex-1 px-4 py-2 rounded transition-colors ${
              interest === "going"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            ✅ {interest === "going" ? "Going" : "I'm Going"}
          </button>
        </div>
      )}

      {isPast && (
        <div className="mt-4 pt-4 border-t text-gray-500 text-sm">
          📌 This event has passed
        </div>
      )}
    </div>
  );
}