import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, User, AlertCircle, Loader } from 'lucide-react';
import { authService } from '../services/api';

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await authService.login(username, password);
      navigate('/admin/dashboard');
      window.location.reload(); // Hard reload to update global navbar admin states
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 'Login failed. Please check credentials and server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-premium">
        
        <div className="text-center space-y-2 mb-8">
          <div className="w-12 h-12 bg-wood/10 rounded-full flex items-center justify-center mx-auto mb-2 text-wood">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-outfit font-extrabold text-slate-900">
            {t('common.login')}
          </h2>
          <p className="text-slate-500 text-xs">
            {t('common.admin_panel')}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-55/70 border border-red-200 text-red-650 p-3.5 rounded-xl text-xs font-semibold mb-6">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Username</label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood"
                required
              />
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 block">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-2.5 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood"
                required
              />
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-dark text-white py-3 rounded-xl text-sm font-bold transition-smooth flex items-center justify-center gap-2 mt-8 shadow-lg shadow-forest/15 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
