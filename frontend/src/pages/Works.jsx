import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, CheckSquare, Wrench, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { designService, categoryService } from '../services/api';
import { API_BASE_URL } from '../constants';

export default function Works() {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWorks = async () => {
      try {
        const [cats, ds] = await Promise.all([
          categoryService.getAll(),
          designService.getAll()
        ]);
        setProjects(ds);
        
        // Build list of category names based on language
        const catNames = ['All', ...cats.map(c => i18n.language === 'te' ? c.name_te : c.name_en)];
        setCategories(catNames);
      } catch (err) {
        console.error('Error loading works:', err);
      } finally {
        setLoading(false);
      }
    };
    loadWorks();
  }, [i18n.language]);

  const getLocalizedName = (item) => {
    if (!item) return '';
    return i18n.language === 'te' ? item.name_te : item.name_en;
  };

  const getLocalizedTitle = (item) => {
    return i18n.language === 'te' ? item.title_te : item.title_en;
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';
    let url = imagePath;
    if (imagePath.startsWith('/uploads')) {
      url = `${API_BASE_URL}${imagePath}`;
    }
    return `${url}?t=${Date.now()}`;
  };

  // Filter projects by matching category name
  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.category && getLocalizedName(p.category) === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900">
          {t('common.works_title')}
        </h1>
        <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4"></div>
        <p className="text-slate-500 text-sm">
          A showcase of our premium physical interior and carpentry works delivered to clients.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic">
          No works portfolio found.
        </div>
      ) : (
        <>
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setFilter(cat)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold transition-smooth ${
                  filter === cat
                    ? 'bg-wood text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <motion.div 
            layout 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  key={project._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-premium shadow-premium-hover border border-slate-100 group flex flex-col"
                >
                  <div className="aspect-[4/3] bg-slate-50 overflow-hidden shrink-0 relative">
                    <img
                      src={getImageUrl(project.images?.[0])}
                      alt={getLocalizedTitle(project)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute bottom-3 right-3 bg-forest text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm">
                      {project.category ? getLocalizedName(project.category) : ''}
                    </span>
                  </div>

                  <div className="p-5 flex-grow space-y-1">
                    <h3 className="font-outfit font-bold text-slate-900 text-base">
                      {getLocalizedTitle(project)}
                    </h3>
                    <p className="text-slate-400 text-xs font-medium">
                      Design ID: {project.designId}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </div>
  );
}
