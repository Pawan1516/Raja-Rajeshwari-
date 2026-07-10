import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Phone, Sun, Eye, Sparkles, Award } from 'lucide-react';
import { categoryService } from '../services/api';
import { WA_GENERAL_LINK, TEL_LINK } from '../constants';

const categoryDetails = {
  "Decorative Lighting": {
    desc_en: "Statement lighting fixtures that act as art pieces to elevate interior elegance.",
    desc_te: "ఇంటీరియర్ వైభవాన్ని పెంచడానికి కళాఖండాలుగా పనిచేసే అలంకార లైటింగ్ అమరికలు."
  },
  "LED Ceiling Lighting": {
    desc_en: "Energy-efficient recessed slim panels, spot lights, and modern ceiling fixtures.",
    desc_te: "ఇంధన-సమర్థవంతమైన స్లిమ్ ప్యానెల్లు, స్పాట్ లైట్లు మరియు ఆధునిక సీలింగ్ లైట్లు."
  },
  "Chandeliers": {
    desc_en: "Luxury crystal and glass chandeliers for grand entryways and premium living rooms.",
    desc_te: "గ్రాండ్ ప్రవేశ మార్గాలు మరియు ప్రీమియం లివింగ్ రూమ్‌ల కోసం విలాసవంతమైన క్రిస్టల్ జూమర్లు."
  },
  "Pendant Lighting": {
    desc_en: "Stylish hanging pendant lights for dining tables, kitchen islands, and double-height ceilings.",
    desc_te: "డైనింగ్ టేబుళ్లు, కిచెన్ ఐలాండ్‌ల కోసం స్టైలిష్ హాంగింగ్ పెండెంట్ లైట్లు."
  },
  "Wall Lighting": {
    desc_en: "Elegant wall sconces and decorative lamps to highlight specific wall textures and areas.",
    desc_te: "నిర్దిష్ట గోడ ఆకృతులను మరియు ప్రాంతాలను హైలైట్ చేయడానికి అందమైన వాల్ ల్యాంప్స్."
  },
  "Cove Lighting": {
    desc_en: "Soft indirect light using warm LED strip installations in false ceiling structures.",
    desc_te: "ఫాల్స్ సీలింగ్ నిర్మాణాలలో వెచ్చని ఎల్‌ఈడీ స్ట్రిప్స్‌ని ఉపయోగించి మృదువైన కాంతి సెటప్."
  },
  "Landscape Lighting": {
    desc_en: "Outdoor uplighting, pathway lamps, and garden accents designed for nighttime beauty.",
    desc_te: "రాత్రి వేళ అందం కోసం రూపొందించిన అవుట్‌డోర్ గార్డెన్ లైటింగ్ మరియు నడక మార్గం లైట్లు."
  },
  "Façade Lighting": {
    desc_en: "Premium architectural wall washers and spotlighting to highlight building exteriors.",
    desc_te: "భవనం వెలుపలి భాగాలను హైలైట్ చేయడానికి ప్రీమియం ఆర్కిటెక్చరల్ లైటింగ్ మరియు స్పాట్‌లైట్లు."
  },
  "Office Lighting": {
    desc_en: "Glare-free linear LED lights and customized workspace illumination for productivity.",
    desc_te: "ఉత్పాదకత కోసం గ్లేర్-ఫ్రీ లీనియర్ ఎల్‌ఈడీ లైట్లు మరియు అనుకూలీకరించిన వర్క్‌స్పేస్ వెలుతురు."
  },
  "Retail Lighting": {
    desc_en: "Premium track lights and spotlights to enhance product display visibility.",
    desc_te: "ఉత్పత్తి ప్రదర్శన దృశ్యమానతను పెంచడానికి ప్రీమియం ట్రాక్ లైట్లు మరియు స్పాట్‌లైట్లు."
  },
  "Street Lighting": {
    desc_en: "High-capacity LED street lights and pole-mounted public area lighting setups.",
    desc_te: "అధిక సామర్థ్యం గల ఎల్‌ఈడీ వీధి దీపాలు మరియు పోల్-మౌంటెడ్ పబ్లిక్ ఏరియా లైటింగ్ సెటప్‌లు."
  },
  "Smart Lighting Systems": {
    desc_en: "App-controlled dimming, RGB color tuning, and automated scene-based lighting modes.",
    desc_te: "యాప్-నియంత్రిత డిమ్మింగ్, ఆర్‌జీబీ కలర్ ట్యూనింగ్ మరియు ఆటోమేటెడ్ సీన్ ఆధారిత లైటింగ్ మోడ్‌లు."
  }
};

export default function LightingSolutions() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const allCats = await categoryService.getAll();
        const filtered = allCats.filter(cat => cat.workType === 'lighting');
        setCategories(filtered);
      } catch (error) {
        console.error("Failed to load lighting categories", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* ─── HERO HEADER BANNER ─── */}
      <section className="relative overflow-hidden py-24 border-b border-white/10 bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(217,119,6,0.12)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.08)_0%,transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-amber-500 uppercase text-xs font-bold tracking-widest block mb-4"
          >
            {i18n.language === 'te' ? 'భారతదేశం అంతటా ప్రీమియం సేవలు' : 'PREMIUM SERVICES ACROSS INDIA'}
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-outfit font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]"
          >
            {i18n.language === 'te' 
              ? 'సృజనాత్మక ఇంటీరియర్స్, విశ్వసనీయ ఎలక్ట్రికల్ పనులు మరియు వినూత్న లైటింగ్ సొల్యూషన్స్.'
              : 'Transforming Spaces with Creative Interiors, Reliable Electrical Systems, and Innovative Lighting Solutions.'}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-sm sm:text-base max-w-3xl mx-auto mt-6 leading-relaxed"
          >
            {i18n.language === 'te'
              ? 'ఆధునిక డిజైన్, భద్రత, కార్యాచరణ మరియు శక్తి సామర్థ్యంతో నివాస మరియు వాణిజ్య అనుకూల పరిష్కారాలను అందించడం మా ధ్యేయం.'
              : 'Deliver premium residential and commercial solutions with modern design, safety, functionality, and energy efficiency.'}
          </motion.p>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* SECTION INTRO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-4xl font-outfit font-extrabold text-white">
              {i18n.language === 'te' ? 'లైటింగ్ సొల్యూషన్స్ కెటలాగ్' : 'Lighting Solutions Catalog'}
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full mt-3"></div>
            <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed">
              {i18n.language === 'te'
                ? 'పర్యావరణ అనుకూల ఎల్‌ఈడీ లైటింగ్, విలాసవంతమైన జూమర్లు మరియు స్మార్ట్ లైటింగ్ వ్యవస్థలు.'
                : 'Premium lighting installations designed to define mood and elevate architectural forms. We offer state-of-the-art solutions from crystal chandeliers to app-controlled smart setups.'}
            </p>
          </div>
          
          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                `Hello Raja Rajeshwari Interiors, I want to inquire about your Lighting Solutions.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-full text-xs font-bold transition-all duration-300 shadow-md shadow-emerald-950/20 hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={TEL_LINK}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 border border-slate-700"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{t('common.call_now')}</span>
            </a>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          /* ─── 12 CATEGORIES GRID ─── */
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {categories.map((cat, index) => {
              const details = categoryDetails[cat.name_en] || {
                desc_en: "Luxurious architectural and decorative lighting services tailored to your needs.",
                desc_te: "మీ అవసరాలకు తగినట్లుగా విలాసవంతమైన ఆర్కిటెక్చరల్ మరియు డెకరేటివ్ లైటింగ్ సేవలు."
              };
              const desc = i18n.language === 'te' ? details.desc_te : details.desc_en;
              const title = i18n.language === 'te' ? cat.name_te : cat.name_en;

              return (
                <motion.div
                  key={cat._id || index}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="glass-premium rounded-3xl overflow-hidden border border-white/10 shadow-premium flex flex-col group transition-all duration-300"
                >
                  {/* Image Container with zoom effect */}
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 bg-amber-500/90 backdrop-blur-md text-slate-950 px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-sans">
                      {i18n.language === 'te' ? 'లైటింగ్' : 'LIGHTING'}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="font-outfit font-bold text-white text-lg group-hover:text-amber-500 transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <Link
                        to={`/designs?category=${cat._id}`}
                        className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20"
                      >
                        <span>{i18n.language === 'te' ? 'ప్రాజెక్టులు' : 'View Projects'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                          `Hello Raja Rajeshwari, I am interested in Lighting Solutions: ${cat.name_en}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1 py-2"
                      >
                        <span>{i18n.language === 'te' ? 'కోట్ అడగండి' : 'Request Quote'}</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* ─── LIGHTING SCHEMES & STANDARDS ─── */}
        <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/10 mt-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="font-outfit font-extrabold text-lg sm:text-2xl text-white mb-6 text-center sm:text-left">
            {i18n.language === 'te' ? 'మా లైటింగ్ నాణ్యతా ప్రమాణాలు' : 'Our Lighting Design Principles'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Sun className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">CRI 90+ High Fidelity</h4>
                <p className="text-slate-400 text-xs leading-relaxed">We select LED light fixtures with high color rendering indices for natural colors.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Eye className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Anti-Glare Diffusers</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Anti-glare reflectors and diffusers to prevent eye strain and create soft shadows.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Sparkles className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Layered Lighting Layout</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Strategic layout separating ambient, task, and accent lighting for perfect balance.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Award className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Smart Automation Ready</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Dimmable drivers and smart integrations compatible with Alexa, Google Home, and Mobile Apps.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
