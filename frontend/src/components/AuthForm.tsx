'use client';

import { useState } from 'react';
import { getApiUrl } from '@/utils/api';

interface AuthFormProps {
  onSuccess: (data: any) => void;
  onClose: () => void;
}

export const AuthForm = ({ onSuccess, onClose }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic Sanitization
    const sanitizedUsername = username.trim();
    const sanitizedEmail = email.trim();
    const sanitizedPassword = password; // Usually passwords aren't trimmed

    // Basic Validation
    if (sanitizedUsername.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!isLogin && !/^\S+@\S+\.\S+$/.test(sanitizedEmail)) {
      setError('Invalid email address');
      return;
    }

    const endpoint = isLogin ? '/users/login/' : '/users/register/';
    const body = isLogin 
      ? { username: sanitizedUsername, password: sanitizedPassword } 
      : { username: sanitizedUsername, email: sanitizedEmail, password: sanitizedPassword };

    try {
      const res = await fetch(getApiUrl(endpoint), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include', // Support HttpOnly cookies
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
      } else {
        setError(data.detail || data.username?.[0] || data.password?.[0] || 'Something went wrong');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="bg-brand-dark p-8 rounded-xl border border-brand-gray w-full max-w-md shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 text-center uppercase">
        {isLogin ? 'Login' : 'Register'}
      </h2>
      
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-brand-gray mb-1">Username</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-800 border-brand-gray rounded p-2 focus:border-brand-green outline-none"
            required
          />
        </div>
        {!isLogin && (
          <div>
            <label className="block text-xs font-bold uppercase text-brand-gray mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-800 border-brand-gray rounded p-2 focus:border-brand-green outline-none"
              required
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold uppercase text-brand-gray mb-1">Password</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-800 border-brand-gray rounded p-2 focus:border-brand-green outline-none"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-brand-green hover:bg-green-600 font-bold py-2 rounded uppercase transition-colors"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <button 
        onClick={() => setIsLogin(!isLogin)}
        className="w-full text-xs text-brand-gray mt-4 hover:text-white"
      >
        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
      </button>

      <button 
        onClick={onClose}
        className="w-full text-xs text-brand-gray mt-2 hover:text-red-400"
      >
        Cancel
      </button>
    </div>
  );
};
