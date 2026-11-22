import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Wrench } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false); // Toggle between Login/Register
  const [role, setRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegister) {
        // Register Account
        await axios.post(https://service-centre-ck7p.onrender.com/api/auth/register', { username, password, role });
        alert('Account Created! Please login now.');
        setIsRegister(false); // Switch back to login
      } else {
        // Login
        const res = await axios.post('https://service-centre-ck7p.onrender.com/api/auth/login', { username, password });
        
        // Save token and role to browser memory
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('role', res.data.role);
        
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 w-full max-w-md">
        
        <div className="flex justify-center mb-6 text-brand-amber">
          <Wrench size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          {isRegister ? 'Create Account' : 'ServicePro Login'}
        </h2>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Dropdown (Only shows during Registration) */}
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Account Type</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
              >
                <option value="admin">Admin / Staff</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Username</label>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
              placeholder="Enter username" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-amber"
              placeholder="Enter password" 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-brand-navy hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg transition-all mt-4"
          >
            {isRegister ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-brand-amber hover:underline font-medium"
          >
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        </div>

      </div>
    </div>
  );
}
