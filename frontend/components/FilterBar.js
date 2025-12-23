export default function FilterBar({ filters, setFilters }) {
  return (
    <div className="flex space-x-3 mb-4">
      <input placeholder="Category" className="bg-white px-2 py-1 rounded" value={filters.category || ""} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))} />
      <input type="date" className="bg-white px-2 py-1 rounded" value={filters.date || ""} onChange={e => setFilters(f => ({ ...f, date: e.target.value }))} />
      <input placeholder="Organizer" className="bg-white px-2 py-1 rounded" value={filters.organizer || ""} onChange={e => setFilters(f => ({ ...f, organizer: e.target.value }))} />
    </div>
  );
}