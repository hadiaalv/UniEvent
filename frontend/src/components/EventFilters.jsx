"use client";

export default function EventFilters({ filters, onChange, categories = [] }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h3 className="text-lg font-bold mb-4">🔍 Filter Events</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleChange("category", e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Date</label>
          <select
            value={filters.dateFilter}
            onChange={(e) => handleChange("dateFilter", e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Dates</option>
            <option value="upcoming">Upcoming Only</option>
            <option value="past">Past Events</option>
          </select>
        </div>

        {/* Organizer Filter */}
        <div>
          <label className="block text-sm font-semibold mb-2">Organizer</label>
          <input
            type="text"
            placeholder="Search organizer..."
            value={filters.organizer}
            onChange={(e) => handleChange("organizer", e.target.value)}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => onChange({ category: "", dateFilter: "all", organizer: "" })}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        Clear All Filters
      </button>
    </div>
  );
}