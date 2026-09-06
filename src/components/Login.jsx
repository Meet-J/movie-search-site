import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password');
      }

      // Save token and user details
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('user_info', JSON.stringify(data.user));

      alert('Login successful!');
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0D23] rounded-xl">
      <form onSubmit={handleSubmit} className="p-8 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-sm" style={{ backgroundColor: '#030014' }}>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Login</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 rounded focus:outline-none"
          style={{ backgroundColor: '#0e0f20', color: '#A8B5DB' }}
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 rounded focus:outline-none"
          style={{ backgroundColor: '#0e0f20', color: '#A8B5DB' }}
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-2 rounded-lg font-semibold text-black shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;