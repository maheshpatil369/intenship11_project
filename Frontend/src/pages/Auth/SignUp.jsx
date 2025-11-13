// File path: src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService.js';
import { Shield } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', workerId: '', position: '', password: '', confirmPassword: ''
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    
    try {
      // Pass a simplified object to the mock service
      const result = await registerUser({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        role: 'worker', // Default role upon signup
        password: formData.password
      });
      setMessage(result.message);
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, name, type = 'text', required = true }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition"
      />
    </div>
  );

  return (
    <div className="flex justify-center items-center h-screen bg-indigo-700 p-4">
      <div className="flex w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Left Side: Dashboard Preview */}
        <div className="hidden md:flex flex-col justify-center p-12 w-1/2 bg-indigo-900 text-white space-y-4">
          <div className="flex items-center text-3xl font-bold mb-4">
            <Shield className="w-8 h-8 text-green-400 mr-2" />
            TATA POWER
          </div>
          <h1 className="text-xl font-semibold">Safety Registration</h1>
          <p className="text-sm text-indigo-200">
            Join the Safety System to perform your daily health checks and access worker resources.
          </p>
        </div>

        {/* Right Side: Sign Up Form (0:01-0:06 in video) */}
        <div className="w-full md:w-1/2 p-10 bg-white space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center">Create Account</h2>
          <p className="text-sm text-gray-500 text-center">Start your safety check journey</p>

          <div className="flex justify-center border-b border-gray-200 mb-6">
            <Link to="/auth/login" className="px-6 py-2 text-gray-500 hover:text-indigo-600">Login</Link>
            <button className="px-6 py-2 text-indigo-600 font-semibold border-b-2 border-indigo-600">Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
            {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">{message}</div>}

            <InputField label="Full Name" name="name" />
            <InputField label="Email" name="email" type="email" />
            <InputField label="Phone Number" name="phone" />
            <InputField label="Worker ID" name="workerId" />
            
            <InputField label="Password" name="password" type="password" />
            <InputField label="Confirm Password" name="confirmPassword" type="password" />

            <button
              type="submit"
              className={`w-full p-3 text-white font-semibold rounded-xl transition ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'}`}
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Sign Up'}
            </button>
            
            <Link to="/auth/login" className="text-xs text-gray-500 hover:text-indigo-600 block text-center mt-3">Already have an account? Login</Link>
          </form>
        </div>
      </div>
    </div>
  );
}