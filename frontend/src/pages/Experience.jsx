import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, Award, CheckCircle, HardHat, User, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { teamService } from '../services/api';
import { API_BASE_URL } from '../constants';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function Experience() {
  const { t, i18n } = useTranslation();
  const [founder, setFounder] = useState(null);

  useEffect(() => {
    const fetchFounder = async () => {
      try {
        const team = await teamService.getAll();
        const found = team.find(m => m.name.toLowerCase().includes('rajamouli') || m.role.toLowerCase().includes('founder'));
        if (found) {
          setFounder(found);
        }
      } catch (err) {
        console.error('Error fetching founder data:', err);
      }
    };
    fetchFounder();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/owner.jpg';
    if (imagePath.startsWith('/uploads')) {
      return `${API_BASE_URL}${imagePath}`;
    }
    return imagePath;
  };

  const stats = [
    { 
      icon: <Award className="w-8 h-8 text-amber-500 animate-pulse" />, 
      stat: '25+', 
      label: i18n.language === 'te' ? 'సంవత్సరాల అనుభవం' : 'Years Experience',
      desc_en: 'Decades of woodworking, electrical installations & design mastery.',
      desc_te: 'దశాబ్దాల వృత్తిపరమైన చెక్క పనులు, ఎలక్ట్రికల్ ఇన్‌స్టాలేషన్లు మరియు డిజైన్ నైపుణ్యం.'
    },
    { 
      icon: <CheckCircle className="w-8 h-8 text-forest" />, 
      stat: '500+', 
      label: i18n.language === 'te' ? 'పూర్తయిన ప్రాజెక్టులు' : 'Projects Completed',
      desc_en: 'Premium residential spaces and commercial sites successfully delivered.',
      desc_te: 'ప్రీమియం నివాస గృహాలు మరియు వాణిజ్య స్థలాలు విజయవంతంగా పూర్తి చేయబడ్డాయి.'
    },
    { 
      icon: <ShieldCheck className="w-8 h-8 text-blue-600" />, 
      stat: '2 Years', 
      label: i18n.language === 'te' ? 'సేవలపై వారంటీ' : 'Warranty on Services',
      desc_en: 'Comprehensive support and warranty on all custom fabrication and repairs.',
      desc_te: 'అన్ని రకాల ఇంటీరియర్ ఫిట్టింగ్‌లు మరియు ఎలక్ట్రికల్ పనులపై పూర్తి వారంటీ రక్షణ.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-16 space-y-20">
      
      {/* ─── HERO HEADER ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-forest text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
            Our Legacy
          </span>
          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold text-slate-900 tracking-tight leading-tight">
            {t('common.experience_title')}
          </h1>
          <div className="w-16 h-1 bg-wood mx-auto mt-4 mb-5"></div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {t('experience.company_desc')}
          </p>
        </div>
      </section>

      {/* ─── STATS COUNTER GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={staggerContainer}
        >
          {stats.map((item, index) => (
            <motion.div 
              key={index} 
              variants={fadeUp}
              custom={index}
              className="bg-white p-8 rounded-3xl border border-slate-100 shadow-premium flex flex-col justify-between items-center text-center space-y-4 hover:-translate-y-2 transition-smooth"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner">
                {item.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-4xl font-outfit font-extrabold text-slate-955">{item.stat}</h3>
                <h4 className="text-slate-800 text-sm font-bold uppercase tracking-wider">{item.label}</h4>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed max-w-[240px]">
                {i18n.language === 'te' ? item.desc_te : item.desc_en}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── DEDICATED FOUNDER & OWNER DETAILS SECTION ─── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-premium p-8 sm:p-12 text-center space-y-8 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-forest/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-wood/5 rounded-full blur-3xl pointer-events-none" />

          {/* Title */}
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-forest uppercase tracking-widest block">
              Leadership Profile
            </span>
            <h2 className="text-3xl font-outfit font-extrabold text-slate-900">
              {founder ? (i18n.language === 'te' ? founder.role_te : founder.role) : t('experience.founder_title')}
            </h2>
            <div className="w-12 h-1 bg-wood mx-auto"></div>
          </div>

          {/* Center Owner Photo at the top of content */}
          <div className="relative w-44 h-44 mx-auto group">
            <div className="w-full h-full rounded-full border-4 border-wood bg-slate-100 flex items-center justify-center shadow-xl overflow-hidden">
              <img 
                src={founder ? getImageUrl(founder.image) : '/owner.jpg'} 
                alt={founder ? founder.name : "Rajamouli Chary"} 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-smooth duration-500"
              />
            </div>
            <div className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-forest border-2 border-white flex items-center justify-center text-amber-300 shadow-md">
              <Sparkles className="w-4.5 h-4.5 animate-pulse" />
            </div>
          </div>

          {/* Profile Name & Rating */}
          <div className="space-y-2">
            <h3 className="font-outfit font-extrabold text-2xl text-slate-900">
              {founder ? founder.name : 'Rajamouli Chary'}
            </h3>
            <div className="flex items-center justify-center gap-1 text-amber-500 text-xs">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <span className="text-slate-400 font-semibold ml-1.5">5.0 rated specialist</span>
            </div>
          </div>

          {/* Narrative Text */}
          <div className="max-w-2xl mx-auto space-y-4 text-slate-650 text-sm sm:text-base leading-relaxed text-left sm:text-center">
            <p className="font-medium text-slate-850 bg-slate-50 border-l-4 border-forest p-4 rounded-r-2xl italic shadow-sm">
              "{t('experience.founder_desc')}"
            </p>
            <p className="text-slate-600">
              At Raja Rajeshwari Interior Works, Rajamouli Chary instills a strict policy of zero compromises on raw materials. From sourcing marine-grade plywood boards to managing safe internal distribution wiring, he directly oversees all major residential and commercial layouts to ensure execution matches custom blueprints perfectly.
            </p>
          </div>

          {/* Badges / Core Values */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Expert Supervision</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-wood/10 flex items-center justify-center text-wood">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Decades of Skill</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
