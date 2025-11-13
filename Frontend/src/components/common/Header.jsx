// File path: src/components/common/Header.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { LogOut, User } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <header className="flex justify-between items-center px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center text-xl font-semibold text-gray-700">
        Tata Power <span className="text-sm ml-2 font-normal text-gray-500">Safety Dashboard</span>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-full border border-gray-200">
          <User className="w-5 h-5 text-green-600" />
          <div className="text-sm font-medium text-gray-800">
            {user.name || 'Supervisor User'}
          </div>
        </div>
        
        <button
          onClick={logout}
          className="flex items-center text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-full hover:bg-red-50"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}