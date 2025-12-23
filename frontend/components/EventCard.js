export default function EventCard({ event, onInterested, onGoing }) {
  return (
    <div className="bg-white rounded-lg shadow m-4 p-6 border hover:border-accent transition-all duration-300 cursor-pointer animate-fade-in">
      <h2 className="text-xl text-primary font-bold">{event.title}</h2>
      <div className="flex justify-between text-sm text-accent">
        <span>{new Date(event.date).toLocaleDateString()}</span>
        <span>Organized by {event.organizer}</span>
        <span>{event.category}</span>
      </div>
      <p className="my-3">{event.description}</p>
      <div className="flex space-x-2">
        <button onClick={onInterested} className="bg-primary px-3 py-1 rounded text-white hover:bg-accent transition">Interested</button>
        <button onClick={onGoing} className="bg-accent px-3 py-1 rounded text-white hover:bg-primary transition">Going</button>
      </div>
    </div>
  );
}