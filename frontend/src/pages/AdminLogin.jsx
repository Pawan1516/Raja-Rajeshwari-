import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, User, AlertCircle, Loader, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';

export default function AdminLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionExpiredMsg, setSessionExpiredMsg] = useState('');

  // Handle session expired redirect messages
  useEffect(() => {
    if (location.state?.message) {
      setSessionExpiredMsg(location.state.message);
      // Clear route state history so manual reload hides the message
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // If already authenticated and not showing an expiry warning, redirect to dashboard
  useEffect(() => {
    if (authService.isAuthenticated() && !location.state?.message) {
      navigate('/admin/dashboard');
    }
  }, [navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');
    setSessionExpiredMsg(''); // Clear session messages on submission
    
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
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-16 bg-slate-950 overflow-hidden">
      {/* Background ambient lighting blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-forest/10 rounded-full blur-[100px] animate-pulse-slow pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-wood/10 rounded-full blur-[90px] animate-float-slow pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 bg-dots opacity-[0.08] pointer-events-none" />

      {/* Main Login Card Wrapper */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-md w-full glass-card-dark rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <img 
            src="/logo.png" 
            alt="Raja Rajeshwari Logo" 
            className="w-16 h-16 rounded-full object-cover border border-amber-500/20 shadow-md mx-auto mb-3"
          />
          <h2 className="text-2xl font-outfit font-extrabold text-white">
            {t('common.login')}
          </h2>
          <p className="text-slate-400 text-xs">
            {t('common.admin_panel')}
          </p>
        </div>

        {sessionExpiredMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-amber-900/30 border border-amber-500/30 text-amber-300 p-4 rounded-xl text-xs font-semibold mb-6"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{sessionExpiredMsg}</span>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-red-900/30 border border-red-500/30 text-red-300 p-4 rounded-xl text-xs font-semibold mb-6"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div className="space-y-2">
            <label htmlFor="username" className="text-xs font-bold text-slate-300 block">
              Username
            </label>
            <div className="relative group">
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full bg-slate-900/60 text-white text-sm px-4 py-3 pl-10 rounded-xl border border-white/10 focus:outline-none focus:bg-slate-900 focus:border-forest/50 focus:ring-4 focus:ring-forest/10 transition-smooth"
                required
              />
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-forest transition-smooth" />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-bold text-slate-300 block">
              Password
            </label>
            <div className="relative group">
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-slate-900/60 text-white text-sm px-4 py-3 pl-10 rounded-xl border border-white/10 focus:outline-none focus:bg-slate-900 focus:border-forest/50 focus:ring-4 focus:ring-forest/10 transition-smooth"
                required
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400 group-focus-within:text-forest transition-smooth" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest hover:bg-forest-dark text-white py-3.5 rounded-xl text-sm font-bold transition-smooth flex items-center justify-center gap-2 mt-8 shadow-lg shadow-forest/20 disabled:opacity-70 hover:scale-[1.02] active:scale-95"
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
      </motion.div>
    </div>
  );
}
