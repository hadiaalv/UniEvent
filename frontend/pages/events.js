import { useEffect, useState } from "react";
import api from "../lib/api";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import FilterBar from "../components/FilterBar";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({});
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  useEffect(() => {
    api.get("/events/filter", { params: filters, headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` } })
      .then(res => setEvents(res.data));
  }, [filters]);

  useEffect(() => {
    const now = new Date();
    setUpcoming(events.filter(e => new Date(e.date) >= now));
    setPast(events.filter(e => new Date(e.date) < now));
  }, [events]);

  const handleInterested = id => api.post(`/events/${id}/interested`, {}, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }});
  const handleGoing = id => api.post(`/events/${id}/going`, {}, { headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }});

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-3xl mx-auto py-4">
        <FilterBar filters={filters} setFilters={setFilters} />
        <h2 className="text-2xl font-bold text-primary mt-4">Upcoming Events</h2>
        {upcoming.map(ev => <EventCard key={ev._id} event={ev} onInterested={() => handleInterested(ev._id)} onGoing={() => handleGoing(ev._id)} />)}
        <h2 className="text-xl font-bold text-accent mt-8">Past Events</h2>
        {past.map(ev => <EventCard key={ev._id} event={ev} />)}
      </div>
    </div>
  );
}