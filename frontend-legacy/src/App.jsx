import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

// Import i18n initialization
import './i18n';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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

      {/* Mobile Bottom Navigation (Hidden on Admin Routes) */}
      {!isAdminRoute && <MobileBottomNav />}

      {/* Footer with business credentials */}
      <Footer />
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
