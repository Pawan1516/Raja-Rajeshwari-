import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Paintbrush, Zap, Lightbulb, Phone } from 'lucide-react';

export default function MobileBottomNav() {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems = [
    {
      name: t('nav.home'),
      path: '/',
      icon: <Home className="w-5 h-5" />
    },
    {
      name: t('nav.interior') || 'Interior',
      path: '/interior-works',
      icon: <Paintbrush className="w-5 h-5" />
    },
    {
      name: t('nav.electrical') || 'Electrical',
      path: '/electrical-works',
      icon: <Zap className="w-5 h-5" />
    },
    {
      name: t('nav.lighting') || 'Lighting',
      path: '/lighting-solutions',
      icon: <Lightbulb className="w-5 h-5" />
    },
    {
      name: t('nav.contact') || 'Contact',
      path: '/contact',
      icon: <Phone className="w-5 h-5" />
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-2 flex items-center justify-around">
      {navItems.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-0.5 transition-smooth flex-1 ${
              isActive 
                ? 'text-forest font-bold scale-105' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'bg-forest/10 text-forest' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[9px] font-semibold tracking-wide">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}

