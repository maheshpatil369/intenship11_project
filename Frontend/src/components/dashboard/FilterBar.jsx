// File path: src/components/dashboard/FilterBar.jsx
import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="flex space-x-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200">
      <Filter className="w-5 h-5 text-gray-500 mt-2" />
      {filters.map((filter) => (
        <select
          key={filter.name}
          name={filter.name}
          onChange={(e) => onFilterChange(filter.name, e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-green-500 focus:border-green-500 transition"
        >
          <option value="All">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition">Apply Filters</button>
    </div>
  );
}