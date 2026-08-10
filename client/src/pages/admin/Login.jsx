import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Key, ShieldAlert } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="max-w-md mx-auto py-10 md:py-16 px-4">
      <div className="text-center mb-8">
        <div className="p-3 bg-brand-100 text-brand-700 rounded-full w-fit mx-auto mb-4 border border-brand-200">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Login</h1>
        <p className="text-slate-500 mt-1.5">Sign in to manage Zanskar Mess operations</p>
      </div>

      <form className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl flex items-center gap-2 text-sm">
            <ShieldAlert className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              placeholder="admin@hostel.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Key className="h-4 w-4" />
            </div>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
