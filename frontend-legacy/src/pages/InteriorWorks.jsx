import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Phone, Shield, ThumbsUp, Wrench, Clock } from 'lucide-react';
import { categoryService } from '../services/api';
import { WA_GENERAL_LINK, TEL_LINK } from '../constants';

const categoryDetails = {
  "Living Room Interiors": {
    desc_en: "Premium living room designs with elegant furniture, wall paneling, and false ceiling works.",
    desc_te: "అందమైన ఫర్నిచర్, గోడ ప్యానలింగ్ మరియు ఫాల్స్ సీలింగ్ పనులతో కూడిన ప్రీమియం లివింగ్ రూమ్ డిజైన్లు."
  },
  "Modular Kitchen Interiors": {
    desc_en: "Functional modular kitchens with high-end fixtures, space-saving cabinets, and premium countertops.",
    desc_te: "అత్యాధునిక అమరికలు, స్థలాన్ని ఆదా చేసే క్యాబినెట్లు మరియు కౌంటర్‌టాప్‌లతో కూడిన మాడ్యులర్ కిచెన్‌లు."
  },
  "Bedroom Interiors": {
    desc_en: "Elegant and cozy bedroom designs with custom wardrobes, headboards, and soft lighting.",
    desc_te: "అనుకూలీకరించిన వార్డ్‌రోబ్‌లు, హెడ్‌బోర్డ్‌లు మరియు ఆహ్లాదకరమైన లైటింగ్‌తో కూడిన బెడ్‌రూమ్ డిజైన్లు."
  },
  "Dining Room Interiors": {
    desc_en: "Elegant dining spaces featuring premium dining tables, custom seating, and ambient lighting.",
    desc_te: "ప్రీమియం డైనింగ్ టేబుల్‌లు, అనుకూల సీటింగ్ మరియు యాంబియంట్ లైటింగ్‌తో కూడిన అందమైన డైనింగ్ స్థలాలు."
  },
  "False Ceiling Designs": {
    desc_en: "Creative false ceiling layouts with integrated LED lighting and premium finishes.",
    desc_te: "ఇంటిగ్రేటెడ్ ఎల్‌ఈడీ లైటింగ్ మరియు ప్రీమియం ఫినిషింగ్‌లతో కూడిన సృజనాత్మక ఫాల్స్ సీలింగ్ లేఅవుట్లు."
  },
  "TV Unit Designs": {
    desc_en: "Modern floating and wall-mounted TV consoles with hidden cable paths and storage.",
    desc_te: "దాచిన కేబుల్ మార్గాలు మరియు స్టోరేజ్‌తో కూడిన ఆధునిక ఫ్లోటింగ్ మరియు వాల్-మౌంటెడ్ టీవీ కన్సోల్‌లు."
  },
  "Wardrobe Designs": {
    desc_en: "Custom sliding and openable wardrobe units engineered for space and premium aesthetics.",
    desc_te: "స్థలం మరియు ప్రీమియం సౌందర్యం కోసం రూపొందించబడిన అనుకూల స్లైడింగ్ మరియు ఓపెన్ వార్డ్‌రోబ్‌లు."
  },
  "Office Interiors": {
    desc_en: "Productive corporate workspaces and office cabins with ergonomic furniture and partitions.",
    desc_te: "సౌకర్యవంతమైన ఫర్నిచర్ మరియు విభజనలతో కూడిన ఉత్పాదక కార్పొరేట్ వర్క్‌స్పేస్‌లు మరియు ఆఫీస్ క్యాబిన్‌లు."
  },
  "Commercial Interiors": {
    desc_en: "Sophisticated retail spaces and showrooms designed to engage customers and highlight products.",
    desc_te: "కస్టమర్లను ఆకట్టుకోవడానికి మరియు ఉత్పత్తులను ప్రదర్శించడానికి రూపొందించిన అధునాతన రిటైల్ మరియు షోరూమ్ స్థలాలు."
  },
  "Restaurant & Café Interiors": {
    desc_en: "Atmospheric restaurant and cafe designs focusing on comfort, layout, and lighting.",
    desc_te: "సౌకర్యం, లేఅవుట్ మరియు లైటింగ్‌పై దృష్టి సారించే ఆహ్లాదకరమైన రెస్టారెంట్ మరియు కేఫ్ డిజైన్లు."
  },
  "Pooja Room Interiors": {
    desc_en: "Peaceful pooja rooms combining traditional wooden carvings and elegant marble work.",
    desc_te: "సాంప్రదాయ చెక్క శిల్పాలు మరియు సొగసైన మార్బుల్ వర్క్‌లను మిళితం చేసే ప్రశాంతమైన పూజా గదులు."
  },
  "Bathroom Interiors": {
    desc_en: "Sleek vanity cabinets, modern tile work, and luxury sanitary fitting layouts.",
    desc_te: "సొగసైన వానిటీ క్యాబినెట్‌లు, ఆధునిక టైల్ వర్క్ మరియు లగ్జరీ శానిటరీ ఫిట్టింగ్ లేఅవుట్లు."
  }
};

export default function InteriorWorks() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const allCats = await categoryService.getAll();
        const filtered = allCats.filter(cat => cat.workType === 'interior');
        setCategories(filtered);
      } catch (error) {
        console.error("Failed to load interior categories", error);
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
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80, delay: 0.05 } }
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
              {i18n.language === 'te' ? 'ఇంటీరియర్ వర్క్స్ కెటలాగ్' : 'Interior Works Catalog'}
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full mt-3"></div>
            <p className="text-slate-400 text-xs sm:text-sm mt-4 leading-relaxed">
              {i18n.language === 'te'
                ? 'వ్యక్తిగతీకరించిన ఇంటీరియర్ డిజైన్లు మరియు కస్టమ్ వుడ్ వర్క్స్‌లో లగ్జరీ పరిష్కారాలు.'
                : 'Bespoke residential and commercial interior solutions handcrafted to perfection. From luxury living areas to modular kitchens, we bring your vision to life.'}
            </p>
          </div>
          
          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                `Hello Raja Rajeshwari Interiors, I want to inquire about your Interior Works.`
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
                desc_en: "High-quality professional interior designing services tailored to your space.",
                desc_te: "మీ స్థలానికి అనుగుణంగా రూపొందించిన అధిక నాణ్యత గల ప్రొఫెషనల్ ఇంటీరియర్ డిజైనింగ్ సేవలు."
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
                      {i18n.language === 'te' ? 'ఇంటీరియర్' : 'INTERIOR'}
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
                          `Hello Raja Rajeshwari Interiors, I am interested in Interior Works: ${cat.name_en}.`
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

        {/* ─── CRAFTSMANSHIP STANDARDS ─── */}
        <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/10 mt-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="font-outfit font-extrabold text-lg sm:text-2xl text-white mb-6 text-center sm:text-left">
            {i18n.language === 'te' ? 'మా నాణ్యతా ప్రమాణాలు' : 'Our Interior Craftsmanship Standards'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Shield className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">BWP Waterproof Plywood</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Termite-proof, heavy-duty base material with a lifetime warranty support.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <ThumbsUp className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Premium Hardware</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Soft-close telescopic channels, hydraulic hinges from Hafele and Hettich.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Wrench className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Expert Carpentry</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Supervised by Rajamouli Chary, ensuring perfect alignments and flawless joints.</p>
              </div>
            </div>
            <div className="bg-slate-950/60 rounded-2xl p-5 border border-white/5 flex items-start gap-4">
              <Clock className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">On-Time Handover</h4>
                <p className="text-slate-400 text-xs leading-relaxed">Efficient project tracking to ensure delivery within the committed timeline.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
