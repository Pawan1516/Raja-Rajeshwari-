import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MessageSquare, Phone, AlertCircle, Sparkles, X } from 'lucide-react';

const InteriorShowcase3D = lazy(() => import('../components/InteriorShowcase3D'));
import { designService, categoryService } from '../services/api';
import { TEL_LINK, buildWALink } from '../constants';

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
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 3D Vision Modal States
  const [selected3DImage, setSelected3DImage] = useState('');
  const [selected3DTitle, setSelected3DTitle] = useState('');
  const [is3DOpen, setIs3DOpen] = useState(false);


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
    const query = searchQuery.trim();
    if (query) {
      // Check if user entered a model number like "101", "RLIW-101", "rliw101", "RLIW 101"
      const modelMatch = query.match(/^(?:RLIW[- ]?)?(\d+)$/i);
      if (modelMatch) {
        const modelNum = modelMatch[1];
        navigate(`/designs/RLIW-${modelNum}`);
        return;
      }
    }
    const params = new URLSearchParams(searchParams);
    query ? params.set('search', query) : params.delete('search');
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

  const modularKitchenCat = categories.find(c => c.name_en === 'Modular Kitchen');
  const bedroomInteriorCat = categories.find(c => c.name_en === 'Bedroom Interior');
  const livingRoomCat = categories.find(c => c.name_en === 'Living Room Design');

  const mainCategoriesList = [
    {
      id: '',
      name_en: 'All Designs',
      name_te: 'అన్ని డిజైన్లు',
      image: '/slide1.png'
    },
    ...(modularKitchenCat ? [{
      id: modularKitchenCat._id,
      name_en: modularKitchenCat.name_en,
      name_te: modularKitchenCat.name_te,
      image: modularKitchenCat.image
    }] : []),
    ...(bedroomInteriorCat ? [{
      id: bedroomInteriorCat._id,
      name_en: bedroomInteriorCat.name_en,
      name_te: bedroomInteriorCat.name_te,
      image: bedroomInteriorCat.image
    }] : []),
    ...(livingRoomCat ? [{
      id: livingRoomCat._id,
      name_en: livingRoomCat.name_en,
      name_te: livingRoomCat.name_te,
      image: livingRoomCat.image
    }] : [])
  ];
  const getGroupedDesigns = () => {
    const groups = {};
    designs.forEach((design) => {
      const catId = design.category?._id || 'other';
      const catName = design.category ? getLocalizedName(design.category) : (i18n.language === 'te' ? 'ఇతర డిజైన్లు' : 'Other Designs');
      if (!groups[catId]) {
        groups[catId] = {
          name: catName,
          designs: []
        };
      }
      groups[catId].designs.push(design);
    });
    return Object.values(groups);
  };

  const renderDesignCard = (design, i) => (
    <motion.div
      key={design._id}
      custom={i}
      variants={cardVariant}
      className="bg-white rounded-2xl overflow-hidden shadow-premium shadow-premium-hover border border-slate-100 flex flex-col h-full group"
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
      </div>

      <div className="p-5 flex flex-col flex-grow justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-bold text-wood-light uppercase tracking-wider block truncate">
            {design.category ? getLocalizedName(design.category) : ''}
            {design.subcategory && ` / ${design.subcategory}`}
          </span>
          <h3 className="font-outfit font-bold text-slate-900 text-sm leading-snug group-hover:text-forest transition-smooth line-clamp-1">
            {getLocalizedTitle(design)}
          </h3>
          {design.features && design.features.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5 mb-1">
              {design.features.slice(0, 3).map((feat, idx) => (
                <span 
                  key={idx} 
                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-50 text-slate-500 border border-slate-100 font-sans"
                >
                  {feat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Four CTA Buttons Grid */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
          {/* Row 1: WhatsApp & Call Now */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={getWhatsAppLink(design)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 bg-whatsapp hover:bg-whatsappdark text-white py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-smooth"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={TEL_LINK}
              className="flex items-center justify-center gap-1.5 bg-forest hover:bg-forest-dark text-white py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-smooth shadow-call-glow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('common.call_now')}</span>
            </a>
          </div>

          {/* Row 2: View Details & View in 3D Vision */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/designs/${design.designId}`}
              className="flex items-center justify-center border border-slate-200 hover:bg-slate-50 text-slate-600 py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-smooth text-center"
            >
              <span>{t('common.view_details')}</span>
            </Link>
            <button
              onClick={() => {
                setSelected3DImage(design.images?.[0] || '');
                setSelected3DTitle(getLocalizedTitle(design));
                setIs3DOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white py-2 rounded-xl text-[10px] sm:text-[11px] font-bold transition-smooth shadow-md shadow-amber-500/10 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D Vision</span>
            </button>
          </div>
        </div>

        <p className="text-[8px] text-slate-400 text-center mt-2 font-sans leading-none">
          Code: <strong>{design.designId}</strong>
        </p>
      </div>
    </motion.div>
  );

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
            id="search-designs"
            name="search"
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 text-slate-800 text-sm px-4 py-2.5 pl-10 rounded-full border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth"
          />
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
        </form>
      </div>

      {/* Premium Horizontal Category Selector Cards */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-wood-light uppercase tracking-widest mb-4 font-sans">
          {i18n.language === 'te' ? 'త్వరిత వర్గ ఎంపిక' : 'Quick Category Selection'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mainCategoriesList.map((cat) => {
            const isActive = cat.id === ''
              ? (selectedCategory === '' && selectedWorkType === '' && searchQuery === '')
              : (selectedCategory === cat.id);
            return (
              <button
                key={cat.id || 'all'}
                onClick={() => {
                  if (cat.id === '') {
                    setSearchParams({});
                    setSearchQuery('');
                  } else {
                    handleCategoryChange(cat.id);
                  }
                }}
                className={`h-28 md:h-32 rounded-2xl overflow-hidden relative shadow-premium transition-all duration-300 group ${
                  isActive 
                    ? 'ring-2 ring-wood shadow-glow-gold scale-[1.02]' 
                    : 'hover:scale-[1.02] border border-slate-100'
                }`}
              >
                <img
                  src={cat.image}
                  alt={i18n.language === 'te' ? cat.name_te : cat.name_en}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700 ease-out"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent transition-opacity duration-300 ${
                  isActive ? 'opacity-90' : 'opacity-70 group-hover:opacity-85'
                }`} />
                <div className="absolute bottom-3 left-3 right-3 glass-premium p-2 rounded-xl border border-white/10 group-hover:border-wood/30 transition-premium">
                  <h3 className="text-white font-outfit font-extrabold text-[10px] sm:text-xs tracking-wider uppercase leading-none text-center">
                    {i18n.language === 'te' ? cat.name_te : cat.name_en}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
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
          ) : !selectedCategory ? (
            /* Grouped / List-wise / Category-wise Designs View */
            <div className="space-y-14">
              {getGroupedDesigns().map((group, groupIdx) => (
                <div key={groupIdx} className="space-y-6">
                  {/* Group Section Header */}
                  <div className="flex items-center gap-3 border-b border-slate-200/60 pb-2">
                    <div className="w-1.5 h-6 bg-wood rounded-full" />
                    <h2 className="font-outfit font-extrabold text-base sm:text-lg text-slate-800 tracking-wide uppercase">
                      {group.name}
                    </h2>
                    <span className="text-xs text-slate-400 font-bold font-sans">
                      ({group.designs.length} {i18n.language === 'te' ? 'డిజైన్లు' : 'Designs'})
                    </span>
                  </div>

                  {/* Group Grid */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={group.name}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      initial="hidden"
                      animate="visible"
                    >
                      {group.designs.map((design, i) => renderDesignCard(design, i))}
                    </motion.div>
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            /* Single Category Grid View */
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${searchQuery}`}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                initial="hidden"
                animate="visible"
              >
                {designs.map((design, i) => renderDesignCard(design, i))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ─── 3D VISION SHOWCASE MODAL ─── */}
      <AnimatePresence>
        {is3DOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 180 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div>
                  <span className="text-[10px] bg-forest/80 text-forest-light px-2.5 py-1 rounded-md font-bold uppercase tracking-wider block w-fit mb-1.5 font-sans">
                    Interactive 3D Preview
                  </span>
                  <h3 className="text-white font-outfit font-extrabold text-xl">
                    {selected3DTitle || 'Interior Showroom in 3D'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIs3DOpen(false)}
                  className="p-2 rounded-full bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-805 transition duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal 3D Canvas Body */}
              <div className="flex-grow p-4 md:p-6 min-h-[350px] md:min-h-[450px] flex items-center justify-center bg-slate-950 relative">
                <Suspense fallback={
                  <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs font-semibold font-sans">Initializing 3D Environment...</span>
                  </div>
                }>
                  <InteriorShowcase3D />
                </Suspense>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 text-xs text-slate-400">
                <p className="leading-relaxed font-sans">
                  💡 Use your mouse or touch swipe to rotate the showroom. Pinch to zoom in/out.
                </p>
                <div className="flex gap-3">
                  <a
                    href={`https://wa.me/919989704779?text=I'm interested in design: ${encodeURIComponent(selected3DTitle)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-whatsapp hover:bg-whatsappdark text-white px-4 py-2 rounded-xl font-bold transition-smooth font-sans text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIs3DOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold transition-smooth font-sans text-xs"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
