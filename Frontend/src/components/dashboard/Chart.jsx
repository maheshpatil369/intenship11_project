// File path: src/components/dashboard/Chart.jsx
import React from 'react';
// Conceptual imports for a charting library like Recharts
// import { LineChart, BarChart, PieChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, Line, Pie, Cell } from 'recharts';

export default function Chart({ title, type, data, width = '100%', height = 300 }) {
  // --- MOCK CHART RENDERING ---
  const chartStyle = {
    height: `${height}px`,
    width: width,
    background: '#f9f9f9',
    borderRadius: '10px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#6b7280',
    fontWeight: '600',
    fontSize: '14px',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-full">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div style={chartStyle}>
        [Placeholder for {type} Chart] - Data Length: {data.length}
      </div>
    </div>
  );
}