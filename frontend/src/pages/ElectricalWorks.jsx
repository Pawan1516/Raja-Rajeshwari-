import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageSquare, Phone, Shield, Zap, Wrench, CheckCircle } from 'lucide-react';
import { categoryService } from '../services/api';
import { WA_GENERAL_LINK, TEL_LINK } from '../constants';

const categoryDetails = {
  "Residential Electrical Wiring": {
    desc_en: "End-to-end safe wiring systems for modern residences with premium conduits and distribution boards.",
    desc_te: "ప్రీమియం పైపులు మరియు డిస్ట్రిబ్యూషన్ బోర్డులతో కూడిన నివాసాల కోసం సురక్షితమైన వైరింగ్ వ్యవస్థలు."
  },
  "Commercial Electrical Installation": {
    desc_en: "Heavy-duty electrical setup for offices, showrooms, and commercial centers.",
    desc_te: "ఆఫీసులు, షోరూమ్‌లు మరియు వాణిజ్య కేంద్రాల కోసం హెవీ-డ్యూటీ ఎలక్ట్రికల్ ఇన్‌స్టాలేషన్."
  },
  "Industrial Electrical Works": {
    desc_en: "High-capacity electrical cabling, wiring, and panel integrations for factories and warehouses.",
    desc_te: "ఫ్యాక్టరీలు మరియు గిడ్డంగుల కొరకు అధిక-సామర్థ్యం గల ఎలక్ట్రికల్ కేబ్లింగ్, వైరింగ్ మరియు ప్యానెల్ పనులు."
  },
  "Electrical Panel Board Installation": {
    desc_en: "Safe installation and dressing of main distribution panel boards and sub-panels.",
    desc_te: "మెయిన్ డిస్ట్రిబ్యూషన్ ప్యానెల్ బోర్డులు మరియు సబ్-ప్యానెల్‌ల సురక్షితమైన సంస్థాపన మరియు డ్రెస్సింగ్."
  },
  "Generator Installation": {
    desc_en: "Installation of silent backup generator sets and automatic changeover switches.",
    desc_te: "సైలెంట్ బ్యాకప్ జనరేటర్ సెట్‌లు మరియు ఆటోమేటిక్ చేంజ్ఓవర్ స్విచ్‌ల సంస్థాపన."
  },
  "Inverter Installation": {
    desc_en: "Home UPS and inverter system setup with reliable battery configurations for continuous power.",
    desc_te: "నిరంతర విద్యుత్ కోసం నమ్మకమైన బ్యాటరీ కాన్ఫిగరేషన్‌లతో కూడిన హోమ్ యూపీఎస్ మరియు ఇన్వర్టర్ సెటప్."
  },
  "Smart Home Automation": {
    desc_en: "Wi-Fi and voice-controlled smart switches, motion sensors, and security alerts.",
    desc_te: "వైఫై మరియు వాయిస్-నియంత్రిత స్మార్ట్ స్విచ్‌లు, మోషన్ సెన్సార్లు మరియు సెక్యూరిటీ అలర్ట్‌లు."
  },
  "CCTV Installation": {
    desc_en: "High-definition security cameras and DVR/NVR setup for robust building surveillance.",
    desc_te: "భవన రక్షణ మరియు నిఘా కోసం హై-డెఫినిషన్ సెక్యూరిటీ కెమెరాలు మరియు డీవీఆర్/ఎన్‌వీఆర్ సెటప్."
  },
  "Fire Alarm Systems": {
    desc_en: "Safety-first fire alarm and smoke detector wiring with centralized control panels.",
    desc_te: "కేంద్రీకృత నియంత్రణ ప్యానెల్‌లతో కూడిన ఫైర్ అలారం మరియు స్మోక్ డిటెక్టర్ వైరింగ్."
  },
  "Network Cabling": {
    desc_en: "High-speed CAT6 data cabling, Wi-Fi access points, and server rack installations.",
    desc_te: "అతివేగవంతమైన CAT6 డేటా కేబ్లింగ్, వైఫై యాక్సెస్ పాయింట్లు మరియు సర్వర్ రాక్ సంస్థాపనలు."
  },
  "Solar Electrical Systems": {
    desc_en: "Eco-friendly rooftop solar panels and grid-tie inverter installations for energy savings.",
    desc_te: "విద్యుత్ ఆదా కోసం పర్యావరణ అనుకూల రూఫ్‌టాప్ సోలార్ ప్యానెల్స్ మరియు ఇన్వర్టర్ సంస్థాపనలు."
  },
  "Electrical Maintenance Services": {
    desc_en: "Professional troubleshooting, load testing, safety checks, and annual maintenance contracts.",
    desc_te: "వృత్తిపరమైన ట్రబుల్షూటింగ్, లోడ్ టెస్టింగ్, సేఫ్టీ చెక్స్ మరియు వార్షిక నిర్వహణ సేవలు."
  }
};

export default function ElectricalWorks() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      try {
        const allCats = await categoryService.getAll();
        const filtered = allCats.filter(cat => cat.workType === 'electrical');
        setCategories(filtered);
      } catch (error) {
        console.error("Failed to load electrical categories", error);
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-forest selection:text-white">
      
      {/* ─── HERO HEADER BANNER ─── */}
      <section className="relative overflow-hidden py-24 border-b border-slate-800 bg-slate-950">
        {/* Background Image showing clearly with dark overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/backgrounds/electrical_bg.jpg" 
            alt="Electrical Works Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/30" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-wood uppercase text-xs font-bold tracking-widest block mb-4"
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
            className="text-slate-200 text-sm sm:text-base max-w-3xl mx-auto mt-6 leading-relaxed"
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
            <h2 className="text-2xl sm:text-4xl font-outfit font-extrabold text-forest-dark">
              {i18n.language === 'te' ? 'ఎలక్ట్రికల్ పనుల కెటలాగ్' : 'Electrical Works Catalog'}
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-forest to-forest-light rounded-full mt-3"></div>
            <p className="text-slate-500 text-xs sm:text-sm mt-4 leading-relaxed">
              {i18n.language === 'te'
                ? 'సేఫ్టీ సర్టిఫైడ్ ఎలక్ట్రికల్ ఇన్‌స్టాలేషన్‌లు, వైరింగ్ సేవలు మరియు స్మార్ట్ హోమ్ ఆటోమేషన్ పనులు.'
                : 'Safety-certified residential, commercial, and industrial electrical solutions. From complete rewiring to solar energy system integration, our qualified consultants ensure premium quality.'}
            </p>
          </div>
          
          {/* QUICK ACTIONS */}
          <div className="flex flex-wrap gap-3">
            <a
              href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                `Hello Raja Rajeshwari Interiors, I want to inquire about your Electrical Works.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-forest hover:bg-forest-dark text-white py-2.5 px-5 rounded-full text-xs font-bold transition-all duration-300 shadow-md hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp Chat</span>
            </a>
            <a
              href={TEL_LINK}
              className="flex items-center gap-2 bg-white hover:bg-green-50 text-forest-dark py-2.5 px-5 rounded-full text-xs font-bold transition-all duration-300 hover:scale-105 border border-forest/30 shadow-sm"
            >
              <Phone className="w-4 h-4 text-forest" />
              <span>{t('common.call_now')}</span>
            </a>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-12 h-12 border-4 border-forest/20 border-t-forest rounded-full animate-spin"></div>
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
                desc_en: "Expert certified electrical cabling, maintenance, and setup services.",
                desc_te: "నిపుణులైన సర్టిఫైడ్ ఎలక్ట్రికల్ కేబ్లింగ్, నిర్వహణ మరియు సెటప్ సేవలు."
              };
              const desc = i18n.language === 'te' ? details.desc_te : details.desc_en;
              const title = i18n.language === 'te' ? cat.name_te : cat.name_en;

              return (
                <motion.div
                  key={cat._id || index}
                  variants={itemVariants}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-3xl overflow-hidden border border-green-100 shadow-md hover:shadow-xl flex flex-col group transition-all duration-300"
                >
                  {/* Image Container with zoom effect */}
                  <div className="h-60 overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/70 via-forest-dark/10 to-transparent"></div>
                    <span className="absolute bottom-4 left-4 bg-forest/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest font-sans">
                      {i18n.language === 'te' ? 'ఎలక్ట్రికల్' : 'ELECTRICAL'}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-2.5">
                      <h3 className="font-outfit font-bold text-slate-800 text-lg group-hover:text-forest transition-colors duration-300">
                        {title}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 border-t border-green-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                      <Link
                        to={`/designs?category=${cat._id}`}
                        className="flex items-center justify-center gap-1.5 bg-forest hover:bg-forest-dark text-white py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-forest/20"
                      >
                        <span>{i18n.language === 'te' ? 'ప్రాజెక్టులు' : 'View Projects'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <a
                        href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                          `Hello Raja Rajeshwari, I am interested in Electrical Works: ${cat.name_en}.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-forest hover:text-forest-dark font-semibold text-xs flex items-center justify-center gap-1 py-2"
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

        {/* ─── SAFETY & STANDARDS ─── */}
        <div className="bg-green-50 rounded-3xl p-8 border border-green-200 mt-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-forest/5 rounded-full blur-3xl pointer-events-none"></div>
          <h3 className="font-outfit font-extrabold text-lg sm:text-2xl text-forest-dark mb-6 text-center sm:text-left">
            {i18n.language === 'te' ? 'మా భద్రతా ప్రమాణాలు' : 'Our Electrical Safety & Standards'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-start gap-4">
              <Shield className="w-8 h-8 text-forest shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">IS-Certified Wiring</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Exclusive use of fire-retardant (FR) copper wires from Finolex, Polycab or Havells.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-start gap-4">
              <Zap className="w-8 h-8 text-forest shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Advanced Switchgear</h4>
                <p className="text-slate-500 text-xs leading-relaxed">RCCB and MCB installation with precise load calculations to prevent shock and short circuits.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-start gap-4">
              <Wrench className="w-8 h-8 text-forest shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Systematic Testing</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Strict insulation testing, earth-leakage check, and load testing before handover.</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm flex items-start gap-4">
              <CheckCircle className="w-8 h-8 text-forest shrink-0 mt-1" />
              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-1">Heavy Conduits</h4>
                <p className="text-slate-500 text-xs leading-relaxed">Deep-concealed PVC channels to protect cables from moisture and mechanical strain.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
