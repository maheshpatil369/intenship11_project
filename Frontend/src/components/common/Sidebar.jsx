// File path: src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Users, Bell, BarChart, HardHat, TrendingUp, Briefcase, FileText } from 'lucide-react';

const navItems = [
  { name: 'Workers', icon: Users, path: 'workers' },
  { name: 'Alerts', icon: Bell, path: 'alerts' },
  { name: 'Reports', icon: FileText, path: 'reports' },
  { name: 'Analysis', icon: BarChart, path: 'analysis' },
  { name: 'Flag Reasons', icon: TrendingUp, path: 'flag-reasons' },
  { name: 'Departments', icon: Briefcase, path: 'departments' },
  { name: 'Incidents', icon: HardHat, path: 'incidents' },
];

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(`/dashboard/${path}`);

  return (
    <div className="w-64 flex flex-col border-r border-gray-200 bg-white h-full shadow-lg">
      
      {/* Logo/Title Area */}
      <div className="flex items-center justify-start p-6 border-b border-gray-100">
        <Shield className="w-7 h-7 text-green-600 mr-2" />
        <span className="text-xl font-bold text-gray-800">TATA POWER</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={`/dashboard/${item.path}`}
            className={({ isActive: isNavActive }) => 
              `flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium ${
                isNavActive || isActive(item.path)
                  ? 'bg-green-100 text-green-700 font-semibold' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer/User Info (Bottom Left, 0:15 in video) */}
      <div className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-1">Navigation Settings</div>
        <div className="text-sm font-semibold text-gray-700">P. Devikar</div>
        <div className="text-xs text-gray-500">Supervisor</div>
      </div>
    </div>
  );
}