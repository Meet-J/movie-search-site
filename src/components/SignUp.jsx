import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      alert('Sign up successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0D23] rounded-xl">
      <form onSubmit={handleSubmit} className="bg-white bg-opacity-10 p-8 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-sm" style={{ backgroundColor: '#030014' }}>
        <h2 className="text-2xl font-bold text-center text-white mb-2">Sign Up</h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 text-xs p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Name"
          className="px-4 py-2 rounded focus:outline-none"
          style={{ backgroundColor: '#0e0f20', color: '#A8B5DB' }}
          required
          value={name}
          onChange={e => setName(e.target.value)}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          className="px-4 py-2 rounded focus:outline-none"
          style={{ backgroundColor: '#0e0f20', color: '#A8B5DB' }}
          required
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="mt-2 px-6 py-2 rounded-lg font-semibold text-black shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50"
          style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;