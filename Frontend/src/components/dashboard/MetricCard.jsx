// File path: src/components/dashboard/MetricCard.jsx
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export default function MetricCard({ title, value, icon: Icon, change = null, changeType = 'neutral', bgColor = 'bg-white', textColor = 'text-gray-900', iconColor = 'text-green-600' }) {
  
  const changeClasses = changeType === 'positive' 
    ? 'text-green-500 bg-green-100' 
    : changeType === 'negative' 
    ? 'text-red-500 bg-red-100' 
    : 'text-gray-500 bg-gray-100';

  return (
    <div className={`p-6 rounded-xl shadow-lg border border-gray-200 ${bgColor}`}>
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full ${iconColor.replace('text-', 'bg-').replace('-500', '-100').replace('-600', '-100')} ${iconColor}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      
      {change !== null && (
        <div className="mt-4 flex items-center">
          <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${changeClasses}`}>
            {changeType === 'positive' && <ArrowUp className="w-3 h-3 mr-1" />}
            {changeType === 'negative' && <ArrowDown className="w-3 h-3 mr-1" />}
            {change}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            {changeType !== 'neutral' ? 'vs last period' : 'Checked in today'}
          </span>
        </div>
      )}
    </div>
  );
}