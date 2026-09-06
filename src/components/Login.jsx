import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from './users';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      alert('Login successful!');
      setIsLoggedIn(true);
      navigate('/');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0D23] rounded-xl">
      <form onSubmit={handleSubmit} className="p-8 rounded-xl shadow-lg flex flex-col gap-6 w-full max-w-sm" style={{ backgroundColor: '#030014' }}>
        <h2 className="text-2xl font-bold text-center text-white mb-4">Login</h2>
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
          className="mt-2 px-6 py-2 rounded-lg font-semibold text-black shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-xl"
          style={{ background: 'linear-gradient(90deg, #D6C7FF 0%, #AB8BFF 100%)' }}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login; 