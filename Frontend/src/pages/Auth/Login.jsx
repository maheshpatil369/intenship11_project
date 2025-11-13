// File path: src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { loginUser } from '../../services/authService.js';
import { useNavigate, Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('supervisor@tatapower.com');
  const [password, setPassword] = useState('Super@123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await loginUser(email, password);
      
      // Check if user is authorized for the dashboard (Supervisor/Admin)
      if (userData.role === 'supervisor' || userData.role === 'admin') {
        login(userData.access_token, { id: userData.user_id, name: userData.name, role: userData.role });
        navigate('/dashboard/workers', { replace: true });
      } else {
        // Handle unauthorized roles (e.g., if a worker logs in)
        setError("Your role is not authorized for this dashboard.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-indigo-700 p-4">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Dashboard Preview */}
        <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-indigo-900 text-white space-y-4">
          <div className="flex items-center text-3xl font-bold mb-4">
            <Shield className="w-8 h-8 text-green-400 mr-2" />
            TATA POWER
          </div>
          <h1 className="text-xl font-semibold">Safety Dashboard</h1>
          <p className="text-sm text-indigo-200">
            Monitor worker health and safety check-ins with real-time analytics and alerts.
          </p>
        </div>

        {/* Right Side: Login Form (0:00 in video) */}
        <div className="w-full md:w-1/2 p-10 bg-white space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center">Sign in to access your safety dashboard</p>

          <div className="flex justify-center border-b border-gray-200 mb-6">
            <button className="px-6 py-2 text-indigo-600 font-semibold border-b-2 border-indigo-600">Login</button>
            <Link to="/auth/signup" className="px-6 py-2 text-gray-500 hover:text-indigo-600">Sign Up</Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input 
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              className={`w-full p-3 text-white font-semibold rounded-xl transition ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
            
            <Link to="#" className="text-xs text-indigo-600 hover:text-indigo-800 block text-center mt-3">Forgot Password?</Link>
          </form>
        </div>
      </div>
    </div>
  );
}