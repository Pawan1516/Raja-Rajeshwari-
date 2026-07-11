import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Loader } from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import IndiaCoverage from './components/IndiaCoverage';
import MobileBottomNav from './components/MobileBottomNav';

// Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import DesignListing from './pages/DesignListing';
import DesignDetail from './pages/DesignDetail';
import OurTeam from './pages/OurTeam';
import Experience from './pages/Experience';
import Works from './pages/Works';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InteriorWorks from './pages/InteriorWorks';
import ElectricalWorks from './pages/ElectricalWorks';
import LightingSolutions from './pages/LightingSolutions';
import Contact from './pages/Contact';

import { visitorService, authService } from './services/api';
// Import i18n initialization
import './i18n';

// Simple JWT decoder
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDetailsRoute = location.pathname.startsWith('/designs/');
  const shouldHideBottomNav = isAdminRoute || isDetailsRoute;

  // Session monitor states
  const [showWarning, setShowWarning] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(300); // countdown in seconds
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [sessionRefreshedKey, setSessionRefreshedKey] = React.useState(0);

  React.useEffect(() => {
    // Log visitor view on public route changes
    if (!isAdminRoute) {
      visitorService.logVisit(location.pathname, document.referrer || '')
        .catch(err => console.error('Analytics error logging visit:', err));
    }
  }, [location.pathname, isAdminRoute]);

  // Session validity verification
  React.useEffect(() => {
    if (!authService.isAuthenticated()) {
      setShowWarning(false);
      return;
    }

    const token = localStorage.getItem('rliw_admin_token');
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) {
      authService.logout();
      setShowWarning(false);
      return;
    }

    const expiresAt = decoded.exp * 1000;

    const checkSession = () => {
      const now = Date.now();
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        authService.logout();
        setShowWarning(false);
        navigate('/admin/login', { 
          state: { 
            message: 'Session expired. Please login again.' 
          } 
        });
        window.location.reload();
      } else if (remaining <= 5 * 60 * 1000) { // Warning shown when 5 minutes left
        setTimeLeft(Math.ceil(remaining / 1000));
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    };

    checkSession(); // Run immediately

    // Run checker every 1 second
    const interval = setInterval(checkSession, 1000);
    return () => clearInterval(interval);
  }, [location.pathname, sessionRefreshedKey, navigate]);

  const handleStayLoggedIn = async () => {
    setIsRefreshing(true);
    try {
      await authService.refreshToken();
      setShowWarning(false);
      setSessionRefreshedKey(prev => prev + 1);
    } catch (err) {
      console.error('Failed to extend session:', err);
      authService.logout();
      setShowWarning(false);
      navigate('/admin/login', { 
        state: { 
          message: 'Session expired. Please login again.' 
        } 
      });
      window.location.reload();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogoutNow = () => {
    authService.logout();
    setShowWarning(false);
    navigate('/admin/login');
    window.location.reload();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-grow pb-24 lg:pb-16 overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/designs" element={<DesignListing />} />
              <Route path="/designs/:id" element={<DesignDetail />} />
              <Route path="/team" element={<OurTeam />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/works" element={<Works />} />
              <Route path="/interior-works" element={<InteriorWorks />} />
              <Route path="/electrical-works" element={<ElectricalWorks />} />
              <Route path="/lighting-solutions" element={<LightingSolutions />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Admin Management Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              {/* Catch-all Fallback */}
              <Route path="*" element={
                <div className="text-center py-20 space-y-4">
                  <h2 className="text-2xl font-bold text-slate-800">Page Not Found</h2>
                  <p className="text-slate-500 text-sm">The URL path does not exist in our showroom catalog.</p>
                  <a href="/" className="bg-wood text-white px-6 py-2.5 rounded-full font-bold inline-block text-xs">
                    Return Home
                  </a>
                </div>
              } />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* India Service Coverage Section (Hidden on Admin Routes) */}
      {!isAdminRoute && <IndiaCoverage />}

      {/* Mobile Bottom Navigation (Hidden on Admin and Details Routes) */}
      {!shouldHideBottomNav && <MobileBottomNav />}

      {/* Footer with business credentials */}
      <Footer />

      {/* Auto-logout Warning Modal Overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6"
            >
              <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 animate-pulse">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-outfit font-extrabold text-white">
                  Session Expiring Soon
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Your secure administrator session will automatically expire in:
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="inline-flex items-center justify-center gap-2 bg-slate-950 border border-white/5 px-5 py-3 rounded-2xl font-mono text-xl font-bold text-amber-400">
                <Clock className="w-5 h-5 text-amber-500 animate-spin" />
                <span>
                  {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleLogoutNow}
                  className="w-full order-2 sm:order-1 border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-slate-400 hover:text-red-400 py-3 rounded-xl text-xs font-bold transition-smooth"
                >
                  Logout
                </button>
                <button
                  onClick={handleStayLoggedIn}
                  disabled={isRefreshing}
                  className="w-full order-1 sm:order-2 bg-forest hover:bg-forest-dark text-white py-3 rounded-xl text-xs font-bold transition-smooth flex items-center justify-center gap-2 shadow-lg shadow-forest/20 disabled:opacity-75"
                >
                  {isRefreshing ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Extending...</span>
                    </>
                  ) : (
                    <span>Stay Logged In</span>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <AppLayout />
    </Router>
  );
}
