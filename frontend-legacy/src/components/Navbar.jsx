import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, X, Search, Globe, LogOut, LayoutDashboard, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../services/api';
import { TEL_LINK, PHONE_DISPLAY } from '../constants';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAdmin = authService.isAuthenticated();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      // Check if user entered a model number like "101", "RLIW-101", "rliw101", "RLIW 101"
      const modelMatch = query.match(/^(?:RLIW[- ]?)?(\d+)$/i);
      if (modelMatch) {
        const modelNum = modelMatch[1];
        navigate(`/designs/RLIW-${modelNum}`);
      } else {
        navigate(`/designs?search=${encodeURIComponent(query)}`);
      }
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'te' : 'en';
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    window.location.reload(); // Refresh to clean headers and context state
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.interior_works'), path: '/interior-works' },
    { name: t('nav.electrical_works'), path: '/electrical-works' },
    { name: t('nav.lighting_solutions'), path: '/lighting-solutions' },
    { name: t('nav.projects_gallery'), path: '/designs' },
    { name: t('nav.experience'), path: '/experience' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <nav className="sticky top-4 z-50 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-premium">
      <div className="glass-nav rounded-[28px] border border-white/20 shadow-premium px-6 sm:px-8 py-1">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="/logo.png" 
                alt="Raja Rajeshwari Logo" 
                className="w-10 h-10 rounded-full object-cover border border-amber-500/20 shadow-sm transition-smooth group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-outfit font-extrabold text-base sm:text-lg tracking-tight text-forest-dark leading-none transition-smooth group-hover:text-forest">
                  RAJA RAJESHWARI
                </span>
                <span className="font-sans font-semibold text-[8px] text-wood tracking-widest mt-0.5 transition-smooth group-hover:text-wood-dark">
                  INTERIOR WORKS
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative max-w-xs w-full mx-4">
            <input
              type="text"
              id="search-desktop"
              name="search"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-slate-800 text-xs px-4 py-2 pl-9 rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-wood/30 focus:shadow-md transition-smooth"
            />
            <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-400" />
          </form>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link, index) => {
              const isActive = location.pathname === link.path;
              return link.path.startsWith('/#') ? (
                <a
                  key={index}
                  href={link.path.substring(1)}
                  className="font-sans font-medium text-slate-600 hover:text-forest transition-smooth text-xs relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-forest after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={index}
                  to={link.path}
                  className={`font-sans text-xs transition-smooth relative pb-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:transition-all after:duration-300 ${
                    isActive 
                      ? 'text-forest font-bold after:w-full after:bg-forest' 
                      : 'text-slate-600 hover:text-forest after:w-0 hover:after:w-full after:bg-forest'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Utility Buttons: Language Switcher & Admin Controls */}
          <div className="hidden sm:flex items-center space-x-4">


            {/* Language Switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-smooth"
              title="Change Language / భాష మార్చండి"
            >
              <Globe className="w-3 h-3 text-forest" />
              <span>{i18n.language === 'en' ? t('common.telugu') : t('common.english')}</span>
            </button>

            {/* Admin Links */}
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1 bg-wood text-white px-3 py-1.5 rounded-full text-xs font-semibold hover:bg-wood-dark transition-smooth"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{t('nav.admin')}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full text-slate-500 hover:text-red-500 hover:bg-slate-50 transition-smooth"
                  title={t('common.logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-xs font-semibold text-slate-500 hover:text-forest transition-smooth"
              >
                {t('common.login')}
              </Link>
            )}
          </div>

          {/* Mobile Hamburguer Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            {/* Mobile Call Icon Button */}
            {location.pathname !== '/' && (
              <a
                href={TEL_LINK}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-forest text-white text-xs font-bold hover:bg-forest-dark"
                title="Call Now"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Language Toggle for mobile view */}
            <button
              onClick={toggleLanguage}
              className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              <Globe className="w-3.5 h-3.5 text-forest" />
              <span>{i18n.language === 'en' ? 'TE' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-forest hover:bg-slate-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden mt-2 glass-card rounded-2xl overflow-hidden border border-white/20 shadow-premium"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 shadow-inner">
              {/* Search bar in Mobile View */}
              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input
                  type="text"
                  id="search-mobile"
                  name="search"
                  placeholder={t('common.search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 text-slate-800 text-sm px-4 py-2 pl-10 rounded-full border border-transparent focus:outline-none focus:bg-white focus:border-wood"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </form>

              {/* Mobile Links */}
              <div className="flex flex-col space-y-2 mt-4">
                {navLinks.map((link, index) => (
                  link.path.startsWith('/#') ? (
                    <a
                      key={index}
                      href={link.path.substring(1)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-sans font-medium text-slate-600 hover:text-forest py-2 border-b border-slate-50 text-base"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <Link
                      key={index}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`font-sans font-medium py-2 border-b border-slate-50 text-base ${
                        location.pathname === link.path ? 'text-forest font-bold' : 'text-slate-600 hover:text-forest'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                ))}

                {/* Admin and Language Items for Small Screens */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      toggleLanguage();
                      setMobileMenuOpen(false);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    <Globe className="w-3.5 h-3.5 text-forest" />
                    <span>{i18n.language === 'en' ? t('common.telugu') : t('common.english')}</span>
                  </button>

                  {isAdmin ? (
                    <>
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-1 bg-wood text-white px-3 py-2 rounded-full text-xs font-semibold"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>{t('nav.admin')}</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-1 border border-red-200 text-red-500 px-3 py-2 rounded-full text-xs font-semibold hover:bg-red-50"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('common.logout')}</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/admin/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-slate-100 text-slate-700 w-full text-center py-2 rounded-lg text-sm font-semibold"
                    >
                      {t('common.login')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
