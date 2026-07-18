import React, { useState } from 'react';
import { signupUser } from '../api/authService';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    
    try {
      const data = await signupUser(formData);
      setMessage(data.message || 'Account created successfully!');
      setFormData({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-zinc-950 text-white px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-amber-500">Create Account</h2>
        
        {message && <p className="text-green-500 bg-green-500/10 border border-green-500/20 p-3 rounded-lg mb-4 text-sm text-center">{message}</p>}
        {error && <p className="text-red-500 bg-red-500/10 border border-red-500/20 p-3 rounded-lg mb-4 text-sm text-center">{error}</p>}
        
        <div className="mb-4">
          <label className="block mb-2 text-sm text-zinc-400">Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-amber-500 transition text-white" placeholder="John Doe" required />
        </div>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm text-zinc-400">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-amber-500 transition text-white" placeholder="name@example.com" required />
        </div>
        
        <div className="mb-6">
          <label className="block mb-2 text-sm text-zinc-400">Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:border-amber-500 transition text-white" placeholder="••••••••" required />
        </div>
        
        <button type="submit" disabled={loading} className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 p-3 rounded-lg font-semibold transition shadow-lg shadow-amber-600/20">
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default Signup;