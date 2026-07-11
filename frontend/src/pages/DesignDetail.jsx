import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, ArrowLeft, Calendar, Tag, Sparkles } from 'lucide-react';
import { designService } from '../services/api';
import { TEL_LINK, buildWALink, API_BASE_URL } from '../constants';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

export default function DesignDetail() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);


  useEffect(() => {
    designService.getById(id)
      .then(setDesign)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const getLocalizedName = (item) => {
    if (!item) return '';
    return i18n.language === 'te' ? item.name_te : item.name_en;
  };

  const getLocalizedTitle = (item) => {
    if (!item) return '';
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

  const getWhatsAppLink = () => {
    if (!design) return '#';
    return buildWALink({
      designId: design.designId,
      categoryName: design.category ? getLocalizedName(design.category) : '',
      title: getLocalizedTitle(design),
      imageUrl: getImageUrl(design.images?.[activeImageIndex] ?? design.images?.[0])
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="animate-pulse flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2 aspect-[4/3] bg-slate-100 rounded-3xl" />
          <div className="lg:w-1/2 space-y-5 py-4">
            <div className="h-8 bg-slate-100 w-2/3 rounded-lg" />
            <div className="h-4 bg-slate-100 w-1/4 rounded-lg" />
            <div className="space-y-3 pt-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-slate-100 w-full rounded-lg" />)}
            </div>
            <div className="grid grid-cols-2 gap-3 pt-6">
              <div className="h-12 bg-slate-100 rounded-full" />
              <div className="h-12 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!design) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Design Not Found</h2>
        <p className="text-slate-500">This design does not exist or has been removed.</p>
        <button
          onClick={() => navigate('/designs')}
          className="bg-wood text-white px-6 py-2.5 rounded-full font-bold inline-flex items-center gap-2 hover:bg-wood-dark"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Designs</span>
        </button>
      </div>
    );
  }

  const localizedTitle = getLocalizedTitle(design);
  const localizedDesc = i18n.language === 'te' ? design.description_te : design.description_en;

  return (
    <>
      {/* Main Content — add bottom padding on mobile to clear sticky bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28 sm:pb-12">
        {/* Back button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-8 font-bold text-slate-600 hover:text-forest flex items-center gap-1.5 transition-smooth"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('common.back')}</span>
        </motion.button>

        <div className="flex flex-col lg:flex-row gap-14">

          {/* Left: Image Gallery */}
          <motion.div
            className="lg:w-1/2 space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-premium border border-slate-100 bg-slate-50 relative">
              <img
                src={getImageUrl(design.images[activeImageIndex] || design.images[0])}
                alt={localizedTitle}
                className="w-full h-full object-cover transition-all duration-400"
              />
              <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs tracking-wider font-extrabold uppercase px-3 py-1.5 rounded-lg">
                {design.designId}
              </span>
            </div>

            {/* Thumbnails */}
            {design.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1 hide-scrollbar">
                {design.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 sm:w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 shrink-0 transition-smooth ${activeImageIndex === idx ? 'border-wood shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={getImageUrl(img)} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right: Info */}
          <motion.div
            className="lg:w-1/2 space-y-6"
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUp} custom={0} className="space-y-2">
              <span className="text-xs font-bold text-wood-light uppercase tracking-widest block">
                {design.category ? getLocalizedName(design.category) : ''}
              </span>
              <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
                {localizedTitle}
              </h1>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="w-16 h-1 bg-wood" />

            {/* Specs */}
            <motion.div
              variants={fadeUp} custom={2}
              className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-wood" />
                <div className="text-xs">
                  <span className="text-slate-400 block">{t('common.design_id')}</span>
                  <span className="font-extrabold text-slate-900">{design.designId}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-wood" />
                <div className="text-xs">
                  <span className="text-slate-400 block">Uploaded</span>
                  <span className="font-extrabold text-slate-900">
                    {new Date(design.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {localizedDesc && (
              <motion.div variants={fadeUp} custom={3} className="space-y-2">
                <h3 className="font-outfit font-bold text-slate-800 text-base">{t('common.description')}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{localizedDesc}</p>
              </motion.div>
            )}

            {/* Desktop Action Buttons */}
            <motion.div variants={fadeUp} custom={4} className="hidden sm:flex gap-4 pt-4">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 bg-whatsapp hover:bg-whatsappdark text-white px-8 py-3.5 rounded-full font-bold transition-smooth shadow-lg shadow-whatsapp/20 hover:scale-[1.02] flex-1"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('common.chat_whatsapp')}</span>
              </a>
              <a
                href={TEL_LINK}
                className="flex items-center justify-center gap-2.5 bg-forest hover:bg-forest-dark text-white px-8 py-3.5 rounded-full font-bold transition-smooth shadow-call-glow shadow-call-glow-hover flex-1"
              >
                <Phone className="w-5 h-5" />
                <span>{t('common.call_now')}</span>
              </a>
            </motion.div>

            <motion.p variants={fadeUp} custom={5} className="hidden sm:block text-xs text-slate-400 italic">
              {i18n.language === 'te'
                ? `* వాట్సాప్ క్లిక్ చేస్తే ఈ డిజైన్ కోడ్ (${design.designId}) మరియు వివరాలు నేరుగా మా డిజైన్ ఇంజనీర్ కు పంపబడతాయి.`
                : `* Clicking WhatsApp automatically sends the active design image, design code (${design.designId}), and details to our design engineer.`}
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ─── MOBILE STICKY BOTTOM ACTION BAR ─── */}
      <motion.div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-2xl px-4 py-3"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsappdark text-white py-3.5 rounded-2xl font-bold text-sm transition-smooth shadow-lg shadow-whatsapp/20"
          >
            <MessageSquare className="w-4.5 h-4.5" />
            <span>WhatsApp</span>
          </a>
           <a
            href={TEL_LINK}
            className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white py-3.5 rounded-2xl font-bold text-sm transition-smooth shadow-call-glow"
          >
            <Phone className="w-4.5 h-4.5" />
            <span>{t('common.call_now')}</span>
          </a>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-1.5 leading-relaxed">
          {i18n.language === 'te'
            ? `* నొక్కితే డిజైన్ కోడ్ ${design ? design.designId : ''} తో చాట్ ఓపెన్ అవుతుంది`
            : `* Tapping auto-attaches Design Code: ${design ? design.designId : ''}`}
        </p>
      </motion.div>
    </>
  );
}
