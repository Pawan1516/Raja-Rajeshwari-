import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageSquare, Phone, AlertCircle, Sparkles } from 'lucide-react';
import { designService, categoryService } from '../services/api';
import { TEL_LINK, buildWALink } from '../constants';
import ThreeDViewerModal from '../components/ThreeDViewerModal';

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function DesignListing() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [is3DOpen, setIs3DOpen] = useState(false);
  const [selected3DImage, setSelected3DImage] = useState('');
  const [selected3DTitle, setSelected3DTitle] = useState('');

  const handleOpen3D = (design) => {
    setSelected3DImage(design.images[0]);
    setSelected3DTitle(i18n.language === 'te' ? design.title_te : design.title_en);
    setIs3DOpen(true);
  };

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedWorkType, setSelectedWorkType] = useState(searchParams.get('workType') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedWorkType(searchParams.get('workType') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    categoryService.getAll().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const filters = {};
    if (selectedCategory) filters.category = selectedCategory;
    if (selectedWorkType) filters.workType = selectedWorkType;
    if (searchQuery) filters.search = searchQuery;
    designService.getAll(filters)
      .then(setDesigns)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedWorkType, searchQuery]);

  const handleClearAllFilters = () => {
    setSearchParams({});
  };

  const handleCategoryChange = (catId) => {
    const params = new URLSearchParams(searchParams);
    catId ? params.set('category', catId) : params.delete('category');
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    searchQuery.trim() ? params.set('search', searchQuery.trim()) : params.delete('search');
    setSearchParams(params);
  };

  const getLocalizedName = (item) => i18n.language === 'te' ? item.name_te : item.name_en;
  const getLocalizedTitle = (item) => i18n.language === 'te' ? item.title_te : item.title_en;

  const getWhatsAppLink = (design) => {
    return buildWALink({
      designId: design.designId,
      categoryName: design.category ? getLocalizedName(design.category) : '',
      title: getLocalizedTitle(design),
      imageUrl: design.images?.[0] ?? ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-outfit font-extrabold text-slate-900">{t('hero.cta')}</h1>
          <p className="text-slate-500 text-sm mt-1">Browse our complete interior portfolio showroom</p>
        </div>
        <form onSubmit={handleSearchSubmit} className="flex relative w-full md:max-w-xs shrink-0">
          <input
            type="text"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 text-slate-800 text-sm px-4 py-2.5 pl-10 rounded-full border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-premium border border-slate-100">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-wood" />
                <h2 className="font-outfit font-bold text-base text-slate-900">Categories</h2>
              </div>
              {(selectedCategory || selectedWorkType || searchQuery) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold hover:underline transition-smooth"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="space-y-2">
              {selectedCategory ? (
                <>
                  {categories
                    .filter((cat) => cat._id === selectedCategory)
                    .map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between bg-wood/10 text-wood font-bold px-3 py-2.5 rounded-xl text-sm"
                      >
                        <span>{getLocalizedName(cat)}</span>
                      </div>
                    ))}
                  
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-forest transition-smooth mt-2 py-2 border border-slate-100 hover:border-slate-200 rounded-xl"
                  >
                    ← Show All Categories
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleCategoryChange('')}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-smooth bg-wood/10 text-wood font-semibold"
                  >
                    {t('common.all')}
                  </button>
                  {categories
                    .filter((cat) => !selectedWorkType || cat.workType === selectedWorkType)
                    .map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => handleCategoryChange(cat._id)}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-smooth text-slate-600 hover:bg-slate-50"
                      >
                        {getLocalizedName(cat)}
                      </button>
                    ))}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Designs Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-100 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm space-y-3">
              <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-slate-800 font-bold text-lg">No Designs Found</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">No designs matched your filters. Try clearing them.</p>
              <button
                onClick={() => { setSelectedCategory(''); setSearchQuery(''); setSearchParams({}); }}
                className="mt-2 bg-wood text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-wood-dark transition-smooth"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                initial="hidden"
                animate="visible"
              >
                {designs.map((design, i) => (
                  <motion.div
                    key={design._id}
                    custom={i}
                    variants={cardVariant}
                    className="bg-white rounded-2xl overflow-hidden shadow-premium border border-slate-100 flex flex-col h-full group"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden shrink-0">
                      <img
                        src={design.images[0]}
                        alt={getLocalizedTitle(design)}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] tracking-wider font-extrabold uppercase px-2.5 py-1 rounded-md">
                        {design.designId}
                      </span>
                      <div className="absolute bottom-3 left-3 right-3 z-10 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleOpen3D(design);
                          }}
                          className="w-full bg-slate-900/85 hover:bg-slate-900 text-white text-[10px] tracking-wider font-extrabold uppercase py-2 rounded-xl backdrop-blur-md transition-smooth shadow-md flex items-center justify-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                          <span>View in 3D Vision</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-wood-light uppercase tracking-wider block">
                          {design.category ? getLocalizedName(design.category) : ''}
                        </span>
                        <h3 className="font-outfit font-bold text-slate-900 text-sm leading-snug group-hover:text-forest transition-smooth line-clamp-1">
                          {getLocalizedTitle(design)}
                        </h3>
                      </div>

                      {/* Dual CTA Buttons */}
                      <div className="pt-4 mt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                        <a
                          href={getWhatsAppLink(design)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-whatsapp hover:bg-whatsappdark text-white py-2 rounded-xl text-[11px] font-bold transition-smooth"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={TEL_LINK}
                          className="flex items-center justify-center gap-1.5 bg-forest hover:bg-forest-dark text-white py-2 rounded-xl text-[11px] font-bold transition-smooth shadow-call-glow"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{t('common.call_now')}</span>
                        </a>
                      </div>

                      <Link
                        to={`/designs/${design.designId}`}
                        className="mt-2.5 text-[11px] font-bold text-slate-500 hover:text-forest transition-smooth text-center block"
                      >
                        {t('common.view_details')} →
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      <ThreeDViewerModal
        isOpen={is3DOpen}
        imageUrl={selected3DImage}
        title={selected3DTitle}
        onClose={() => setIs3DOpen(false)}
      />
    </div>
  );
}
