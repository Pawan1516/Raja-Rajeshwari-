import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MessageSquare, Phone, Award, Users, CheckCircle, ShieldCheck, ChevronRight, ChevronLeft, Sparkles, MapPin, Mail, Clock, ExternalLink, X } from 'lucide-react';
import { categoryService, designService } from '../services/api';
import { TEL_LINK, WA_GENERAL_LINK, buildWALink, PHONE_DISPLAY, TEL_LINK_2, PHONE_DISPLAY_2, API_BASE_URL } from '../constants';

// Lazy load 3D component to avoid blocking initial render
const InteriorShowcase3D = lazy(() => import('../components/InteriorShowcase3D'));

// Framer Motion animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [featuredDesigns, setFeaturedDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);

  // State for interactive 3D Vision modal
  const [selected3DImage, setSelected3DImage] = useState('');
  const [selected3DTitle, setSelected3DTitle] = useState('');
  const [selected3DDepthMap, setSelected3DDepthMap] = useState('');
  const [is3DOpen, setIs3DOpen] = useState(false);

  const faqs = [
    {
      q_en: "Do you provide custom dimensions for wardrobes and kitchens?",
      q_te: "వార్డ్‌రోబ్‌లు మరియు కిచెన్‌లను కస్టమ్ సైజులలో తయారు చేస్తారా?",
      a_en: "Yes. Every modular kitchen layout, TV unit configuration, and wardrobe is custom fabricated inside our workshop to match your exact room dimensions and layout parameters.",
      a_te: "అవును. ప్రతి మోడ్యులర్ కిచెన్, టీవీ యూనిట్ మరియు వార్డ్‌రోబ్ మీ గది కొలతలకు సరిగ్గా సరిపోయేలా మా వర్క్‌షాప్‌లోనే తయారు చేయబడుతుంది."
    },
    {
      q_en: "What warranty coverage do you offer on services?",
      q_te: "మీరు అందించే సేవలపై వారంటీ ఎంత ఉంటుంది?",
      a_en: "We offer a comprehensive 2-year warranty on all carpentry works, custom fabrication joints, and electrical fitting safety installations.",
      a_te: "ముఖ్యంగా అన్ని రకాల చెక్క పనులు, కస్టమ్ ఫిట్టింగ్‌లు మరియు ఎలక్ట్రికల్ ఫిట్టింగ్ భద్రతా ఇన్‌స్టాలేషన్‌లపై 2 సంవత్సరాల పూర్తి వారంటీని అందిస్తాము."
    },
    {
      q_en: "Do you serve areas outside Hyderabad?",
      q_te: "హైదరాబాద్ వెలుపల ఇతర ప్రాంతాలలో సేవలు అందిస్తారా?",
      a_en: "Yes. Raja Rajeshwari Interior Works provides comprehensive interior, electrical, and lighting services across all states and major cities in India.",
      a_te: "అవును. రాజా రాజేశ్వరి ఇంటీరియర్ వర్క్స్ భారతదేశంలోని అన్ని రాష్ట్రాలు మరియు ప్రధాన నగరాల్లో ఇంటీరియర్, ఎలక్ట్రికల్ మరియు లైటింగ్ సేవలను అందిస్తుంది."
    },
    {
      q_en: "How does the 3D Vision showcase work?",
      q_te: "3D విజన్ షోకేస్ ఎలా పనిచేస్తుంది?",
      a_en: "The interactive 3D Vision showcase loads a lightweight virtual 3D room, letting you rotate the perspective via drag-and-swipe to inspect layout depth and lighting placement.",
      a_te: "ఇంటరాక్టివ్ 3D విజన్ షోకేస్ ఒక తేలికపాటి వర్చువల్ 3D గదిని లోడ్ చేస్తుంది, దీని ద్వారా మీరు డ్రాగ్-అండ్-స్వైప్ ద్వారా డిజైన్ లోతు మరియు లైటింగ్ అమరికను పరిశీలించవచ్చు."
    }
  ];

  const mainCategories = [
    {
      id: 'interior',
      name_en: 'Interior Works',
      name_te: 'ఇంటీరియర్ పనులు',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
      link: '/interior-works'
    },
    {
      id: 'electrical',
      name_en: 'Electrical Works',
      name_te: 'ఎలక్ట్రికల్ పనులు',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      link: '/electrical-works'
    },
    {
      id: 'lighting',
      name_en: 'Lighting Solutions',
      name_te: 'లైటింగ్ సొల్యూషన్స్',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
      link: '/lighting-solutions'
    }
  ];

  const slides = [
    {
      image: '/slide1.png',
      title_en: 'Crafting Premium Luxury Interiors',
      title_te: 'అత్యుత్తమ లగ్జరీ ఇంటీరియర్స్',
      sub_en: 'Custom woodwork, false ceilings, and premium modular kitchens designed for elegant living.',
      sub_te: 'అందమైన జీవనం కోసం అనుకూలీకరించిన చెక్క పనులు, ఫాల్స్ సీలింగ్స్ మరియు మోడ్యులర్ వంటశాలలు.'
    },
    {
      image: '/slide2.png',
      title_en: 'Advanced Electrical & Safety Wiring',
      title_te: 'అధునాతన ఎలక్ట్రికల్ & వైరింగ్ వ్యవస్థ',
      sub_en: 'Fire-resistant conduits, proper phase load-balancing, and safety compliance for complete peace of mind.',
      sub_te: 'అగ్ని నిరోధక వైరింగ్, సరైన లోడ్ సర్దుబాటు మరియు భద్రతా ప్రమాణాలతో కూడిన వైరింగ్.'
    },
    {
      image: '/slide3.png',
      title_en: 'Architectural Accent & Smart Lighting',
      title_te: 'అద్భుతమైన స్మార్ట్ లైటింగ్ అమరికలు',
      sub_en: 'Atmospheric cove layouts, app-controlled automation, and landscape garden illuminations.',
      sub_te: 'వాతావరణానికి తగిన కోవ్ డిజైన్లు, మొబైల్ యాప్ ద్వారా నియంత్రించే లైట్లు మరియు గార్డెన్ వెలుతురు.'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, designs] = await Promise.all([
          categoryService.getAll(),
          designService.getAll()
        ]);
        setCategories(cats);
        setFeaturedDesigns(designs.slice(0, 4));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getLocalizedName = (item) =>
    i18n.language === 'te' ? item.name_te : item.name_en;

  const getLocalizedTitle = (item) =>
    i18n.language === 'te' ? item.title_te : item.title_en;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80';
    let url = imagePath;
    if (imagePath.startsWith('/uploads')) {
      url = `${API_BASE_URL}${imagePath}`;
    }
    return `${url}?t=${Date.now()}`;
  };

  const getWhatsAppLink = (design) => {
    return buildWALink({
      designId: design.designId,
      categoryName: design.category ? getLocalizedName(design.category) : '',
      title: getLocalizedTitle(design),
      imageUrl: getImageUrl(design.images?.[0])
    });
  };

  return (
    <div className="space-y-20">

      {/* ─── HERO SECTION: Premium Full-Screen Background Image Slideshow ─── */}
      <section className="relative bg-slate-950 overflow-hidden min-h-[90vh] flex items-center">
        {/* Background image slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentSlide}
              src={slides[currentSlide].image}
              alt="Background Interior Design"
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1.01 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: 'easeInOut' },
                scale: { duration: 4.8, ease: 'easeOut' }
              }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>
          {/* Glassmorphic overlay darken mask */}
          <div className="absolute inset-0 bg-slate-950/78 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(46,125,50,0.22)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(197,168,128,0.15)_0%,transparent_65%)]" />
          <div className="absolute inset-0 bg-dots opacity-[0.14] pointer-events-none" />
        </div>

        {/* Ambient floating blobs with custom slow float/pulse animations */}
        <div className="absolute top-1/4 left-[8%] w-[550px] h-[550px] bg-forest/5 rounded-full blur-[130px] animate-pulse-slow pointer-events-none mix-blend-screen z-0" />
        <div className="absolute bottom-1/4 right-[8%] w-[450px] h-[450px] bg-wood/5 rounded-full blur-[110px] animate-float-slow pointer-events-none mix-blend-screen z-0" />

        {/* Hero Centered Content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center text-center w-full z-10">
          {/* Hero Text */}
          <motion.div
            className="space-y-8 text-white flex flex-col items-center w-full"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.span
              variants={fadeUp}
              custom={0}
              className="inline-flex items-center gap-2 bg-slate-900/60 border border-white/10 text-white text-[11px] tracking-widest font-extrabold uppercase px-5 py-2.5 rounded-full shadow-lg backdrop-blur-md"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>All India Service Coverage</span>
            </motion.span>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -35 }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 flex flex-col items-center w-full"
              >
                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-outfit font-extrabold tracking-tight leading-[1.1] max-w-4xl drop-shadow-lg text-white">
                  {i18n.language === 'te' ? slides[currentSlide].title_te : slides[currentSlide].title_en}
                </h1>

                <p className="text-base sm:text-xl text-slate-300 max-w-3xl font-light drop-shadow-sm leading-relaxed px-4">
                  {i18n.language === 'te' ? slides[currentSlide].sub_te : slides[currentSlide].sub_en}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dual CTA Buttons with Premium Hover Scale & Shiny effects */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap justify-center gap-5 pt-3"
            >
              {/* WhatsApp Hero CTA */}
              <a
                href={WA_GENERAL_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 bg-whatsapp hover:bg-whatsappdark text-white px-8 py-4 rounded-full font-bold text-sm transition-smooth shadow-lg shadow-whatsapp/20 md:hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('common.chat_whatsapp')}</span>
              </a>

              {/* Call Now Hero CTA */}
              <a
                href={TEL_LINK}
                className="flex items-center gap-2.5 bg-forest hover:bg-forest-dark text-white px-8 py-4 rounded-full font-bold text-sm transition-smooth shadow-call-glow shadow-call-glow-hover md:hover:scale-105 active:scale-95"
              >
                <Phone className="w-5 h-5" />
                <span>{t('common.call_now')}</span>
              </a>

              {/* Explore Designs Ghost CTA */}
              <Link
                to="/designs"
                className="flex items-center gap-2 bg-transparent border-2 border-white/20 hover:border-wood text-white hover:text-wood-light px-8 py-4 rounded-full font-bold text-sm transition-smooth hover:bg-white/5 md:hover:scale-105 active:scale-95 gold-border-shine"
              >
                <span>{t('hero.cta')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap justify-center gap-6 pt-4 text-slate-300 text-xs font-semibold"
            >
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><CheckCircle className="w-4 h-4 text-whatsapp" />500+ Completed Projects</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><ShieldCheck className="w-4 h-4 text-wood" />2-Year Service Warranty</span>
              <span className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5"><MapPin className="w-4 h-4 text-amber-400" />Pan India Coverage</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Slideshow Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/20 hover:bg-slate-950/60 text-white/70 hover:text-white p-2.5 rounded-full backdrop-blur-xs transition duration-300 border border-white/5"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-slate-950/20 hover:bg-slate-950/60 text-white/70 hover:text-white p-2.5 rounded-full backdrop-blur-xs transition duration-300 border border-white/5"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Floating 3D Vision Button */}
        <button
          onClick={() => {
            setSelected3DImage(slides[currentSlide].image);
            setSelected3DTitle(i18n.language === 'te' ? slides[currentSlide].title_te : slides[currentSlide].title_en);
            setSelected3DDepthMap('');
            setIs3DOpen(true);
          }}
          className="absolute bottom-6 right-6 z-35 flex items-center gap-2 bg-slate-900/80 hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-smooth shadow-lg backdrop-blur-md border border-white/10 hover:border-forest/50 md:hover:scale-105 active:scale-95"
          title="Experience this background image in 3D Vision"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>3D Vision</span>
        </button>

        {/* Slideshow Pagination Dots */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-forest w-5' : 'bg-white/30 hover:bg-white/60'
                }`}
            />
          ))}
        </div>
      </section>

      {/* ─── CATEGORIES BENTO GRID ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-85px' }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4"
        >
          <motion.div variants={fadeUp} className="space-y-2">
            <span className="text-forest text-xs font-extrabold uppercase tracking-widest block font-sans">
              Our Core Divisions
            </span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
              {t('home.categories_heading')}
            </h2>
            <div className="w-16 h-1 bg-wood mt-2" />
          </motion.div>
          <motion.div variants={fadeUp} className="shrink-0">
            <Link 
              to="/categories" 
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-full text-xs font-bold hover:bg-slate-50 transition-premium shadow-sm hover:shadow"
            >
              <span>{i18n.language === 'te' ? 'అన్ని కేటగిరీలు' : 'Explore All Categories'}</span>
              <ChevronRight className="w-4 h-4 text-forest" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          {/* Bento Card 1: Interior Works (Double width on large screens) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="md:col-span-2 group bg-slate-900 rounded-3xl overflow-hidden shadow-premium shadow-premium-hover relative flex flex-col justify-between min-h-[380px] border border-white/5"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={mainCategories[0].image}
                alt={i18n.language === 'te' ? mainCategories[0].name_te : mainCategories[0].name_en}
                className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-700 ease-out opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
            </div>
            
            <div className="relative z-10 p-8 sm:p-10 flex flex-col justify-between h-full items-start max-w-xl space-y-6">
              <span className="text-[10px] bg-forest/90 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                🏡 Design & Craft
              </span>
              
              <div className="space-y-3">
                <h3 className="text-white font-outfit font-extrabold text-2xl sm:text-3xl leading-tight">
                  {i18n.language === 'te' ? mainCategories[0].name_te : mainCategories[0].name_en}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed font-light">
                  {i18n.language === 'te' 
                    ? 'ఖచ్చితమైన గృహాలు, విల్లాలు మరియు అపార్ట్‌మెంట్ల కోసం అత్యుత్తమ టేకు కలప వడ్రంగి పనులు, లగ్జరీ ఇంటీరియర్స్ మరియు మోడ్యులర్ కిచెన్లు.'
                    : 'Crafting customized teakwood furniture, modern wardrobes, dynamic false ceilings, and luxury modular kitchen layouts engineered to fit your room dimensions.'
                  }
                </p>
              </div>

              <Link
                to={mainCategories[0].link}
                className="inline-flex items-center gap-2 bg-white text-slate-900 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-premium shadow-md"
              >
                <span>{i18n.language === 'te' ? 'పోర్ట్‌ఫోలియో చూడండి' : 'Explore Portfolio'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-forest" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 2: Electrical Works (Single Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-slate-900 rounded-3xl overflow-hidden shadow-premium shadow-premium-hover relative flex flex-col justify-between min-h-[380px] border border-white/5"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={mainCategories[1].image}
                alt={i18n.language === 'te' ? mainCategories[1].name_te : mainCategories[1].name_en}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            <div className="relative z-10 p-8 flex flex-col justify-between h-full items-start space-y-6">
              <span className="text-[10px] bg-amber-500/90 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                ⚡ Power & Safety
              </span>

              <div className="space-y-2">
                <h3 className="text-white font-outfit font-extrabold text-2xl group-hover:text-wood-light transition-premium">
                  {i18n.language === 'te' ? mainCategories[1].name_te : mainCategories[1].name_en}
                </h3>
                <p className="text-slate-355 text-xs leading-relaxed font-light line-clamp-3">
                  {i18n.language === 'te' 
                    ? 'సురక్షితమైన పైపింగ్, లోడ్ బ్యాలెన్సింగ్, ఆటోమేటిక్ చేంజ్ఓవర్ సిస్టమ్స్ మరియు పూర్తి హౌస్ త్రీ-ఫేజ్ కనెక్షన్లు.'
                    : 'Concealed conduit piping, heavy-duty distribution board wiring, automatic changeover relays, and smart automation systems for maximum safety.'
                  }
                </p>
              </div>

              <Link
                to={mainCategories[1].link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-wood-light transition-premium"
              >
                <span>{i18n.language === 'te' ? 'సేకరణలు చూడండి' : 'View Collections'}</span>
                <ChevronRight className="w-4 h-4 text-wood" />
              </Link>
            </div>
          </motion.div>

          {/* Bento Card 3: Lighting Works (Single Column) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group bg-slate-900 rounded-3xl overflow-hidden shadow-premium shadow-premium-hover relative flex flex-col justify-between min-h-[380px] border border-white/5 md:col-span-3 lg:col-span-1"
          >
            <div className="absolute inset-0 z-0">
              <img
                src={mainCategories[2].image}
                alt={i18n.language === 'te' ? mainCategories[2].name_te : mainCategories[2].name_en}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
            </div>

            <div className="relative z-10 p-8 flex flex-col justify-between h-full items-start space-y-6">
              <span className="text-[10px] bg-blue-500/90 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                💡 Ambience & Light
              </span>

              <div className="space-y-2">
                <h3 className="text-white font-outfit font-extrabold text-2xl group-hover:text-wood-light transition-premium">
                  {i18n.language === 'te' ? mainCategories[2].name_te : mainCategories[2].name_en}
                </h3>
                <p className="text-slate-355 text-xs leading-relaxed font-light line-clamp-3">
                  {i18n.language === 'te' 
                    ? 'కోవ్-లైట్ సెటప్, ఎల్ఈడీ ప్యానెల్ డిజైన్లు, ఆఫీస్ ట్రాక్ గ్రిడ్లు మరియు సుందరమైన అవుట్‌డోర్ లైటింగ్.'
                    : 'Crystal chandeliers, recessed slim LED panel grids, dimmable cove layout setups, and landscape garden facade lighting.'
                  }
                </p>
              </div>

              <Link
                to={mainCategories[2].link}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-wood-light transition-premium"
              >
                <span>{i18n.language === 'te' ? 'సేకరణలు చూడండి' : 'View Collections'}</span>
                <ChevronRight className="w-4 h-4 text-wood" />
              </Link>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── FEATURED DESIGNS GRID ─── */}
      <section className="bg-slate-100/60 py-20 bg-dots relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={fadeUp}
            className="text-center max-w-xl mx-auto mb-16"
          >
            <span className="text-forest text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
              Handpicked Collections
            </span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
              {t('home.featured_heading')}
            </h2>
            <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4" />
          </motion.div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {Array(4).fill(0).map((_, i) => (
                 <div key={i} className="bg-white/80 rounded-3xl h-96 animate-pulse shadow-sm" />
               ))}
             </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={staggerContainer}
            >
              {featuredDesigns.map((design) => (
                <motion.div
                  key={design._id}
                  variants={fadeUp}
                  className="bg-white/95 rounded-3xl overflow-hidden shadow-premium shadow-premium-hover border border-slate-100 flex flex-col h-full group transition-premium md:hover:-translate-y-2"
                >
                  {/* Card Banner Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50 shrink-0">
                    <img
                      src={getImageUrl(design.images?.[0])}
                      alt={getLocalizedTitle(design)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out"
                      loading="lazy"
                    />
                    <span className="absolute top-3 left-3 bg-slate-955/80 backdrop-blur-md text-white text-[9px] tracking-wider font-extrabold uppercase px-2.5 py-1.5 rounded-lg border border-white/5">
                      {design.designId}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex flex-col flex-grow justify-between gap-5">
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-wood uppercase tracking-wider block">
                        {design.category ? getLocalizedName(design.category) : ''}
                      </span>
                      <h3 className="font-outfit font-extrabold text-slate-800 text-base leading-snug group-hover:text-forest transition-premium line-clamp-2">
                        {getLocalizedTitle(design)}
                      </h3>
                    </div>

                    {/* Action Layer */}
                    <div className="space-y-3">
                      {/* Dual Action Buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={getWhatsAppLink(design)}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 bg-whatsapp hover:bg-whatsappdark text-white px-3 py-2.5 rounded-xl text-[11px] font-bold transition-premium shadow-sm hover:shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <a
                          href={TEL_LINK}
                          className="flex items-center justify-center gap-1.5 bg-forest hover:bg-forest-dark text-white px-3 py-2.5 rounded-xl text-[11px] font-bold transition-premium shadow-call-glow"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Now</span>
                        </a>
                      </div>

                      <Link
                        to={`/designs/${design.designId}`}
                        className="text-[11px] font-bold text-slate-400 hover:text-forest transition-premium text-center block"
                      >
                        {t('common.view_details')} →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              to="/designs"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-bold text-sm transition-smooth shadow-lg"
            >
              <span>Browse Full Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── ABOUT PREVIEW ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="About Raja Rajeshwari"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-wood/10 rounded-3xl -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-forest/10 rounded-3xl -z-10" />
          </motion.div>

          <motion.div
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            <motion.span variants={fadeUp} className="text-sm font-extrabold text-forest uppercase tracking-widest block">
              About Raja Rajeshwari
            </motion.span>
            <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
              {t('home.about_title')}
            </motion.h2>
            <motion.div variants={fadeUp} className="w-16 h-1 bg-wood" />
            <motion.div variants={fadeUp} className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              <p>{t('home.about_p1')}</p>
              <p>{t('home.about_p2')}</p>
            </motion.div>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 pt-2">
              <a
                href={TEL_LINK}
                className="flex items-center gap-2 bg-forest text-white px-6 py-2.5 rounded-full font-bold text-sm transition-smooth shadow-call-glow shadow-call-glow-hover"
              >
                <Phone className="w-4.5 h-4.5" />
                <span>{t('common.call_now')}</span>
              </a>
              <a
                href={WA_GENERAL_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-whatsapp text-white px-6 py-2.5 rounded-full font-bold text-sm transition-smooth hover:bg-whatsappdark"
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span>{t('common.chat_whatsapp')}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── EXPERIENCE HIGHLIGHTS ─── */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: <Award className="w-7 h-7 text-wood-light" />, bg: 'bg-wood/20', stat: '25+', label: t('common.years_exp') },
              { icon: <CheckCircle className="w-7 h-7 text-forest-light" />, bg: 'bg-forest/20', stat: '500+', label: t('common.projects_completed') },
              { icon: <Users className="w-7 h-7 text-whatsapp" />, bg: 'bg-whatsapp/20', stat: '100%', label: t('common.satisfied_clients') }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="space-y-4">
                <div className={`w-14 h-14 ${item.bg} rounded-full flex items-center justify-center mx-auto`}>
                  {item.icon}
                </div>
                <h3 className="text-4xl font-outfit font-extrabold">{item.stat}</h3>
                <p className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CLIENT EXPERIENCE: 4-STEP PROCESS ─── */}
      <section className="py-20 bg-slate-50/80 border-y border-slate-200 bg-dots relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-forest text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
              Our Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
              {i18n.language === 'te' ? 'మా 4-దశల సేవా ప్రక్రియ' : 'Our 4-Step Seamless Process'}
            </h2>
            <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4"></div>
            <p className="text-slate-500 text-sm">
              {i18n.language === 'te'
                ? 'కన్సల్టేషన్ నుండి ప్రాజెక్ట్ హ్యాండోవర్ వరకు మా పారదర్శకమైన పని విధానం.'
                : 'A transparent, step-by-step journey from initial consultation to premium warranty handover.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-forest group-hover:text-white transition-premium" />,
                title_en: "1. Free Consultation",
                title_te: "1. ఉచిత సంప్రదింపులు",
                desc_en: "Connect on WhatsApp or call to discuss dimensions, layout preferences, and custom service estimates.",
                desc_te: "కొలతలు, గది ఆకృతులు మరియు కావాల్సిన డిజైన్ల గురించి మాట్లాడటానికి వాట్సాప్ లేదా కాల్ ద్వారా మమ్మల్ని సంప్రదించండి."
              },
              {
                icon: <Sparkles className="w-6 h-6 text-amber-550 group-hover:text-white transition-premium" />,
                title_en: "2. 3D Blueprint Layout",
                title_te: "2. 3D బ్లూప్రింట్ లేఅవుట్",
                desc_en: "We create a dynamic 3D blueprint so you can review and customize material heights and placements.",
                desc_te: "వార్డ్‌రోబ్‌లు, కిచెన్ అమరికను సరిచూసుకోవడానికి మేము ఖచ్చితమైన 3D లేఅవుట్ డిజైన్‌ను తయారు చేస్తాము."
              },
              {
                icon: <Award className="w-6 h-6 text-wood group-hover:text-white transition-premium" />,
                title_en: "3. Woodwork & Fitting",
                title_te: "3. వుడ్ వర్క్ & వైరింగ్",
                desc_en: "Our carpenters fabricate premium fittings while electrical teams lay secure concealed conduit piping.",
                desc_te: "మా వడ్రంగులు నాణ్యమైన వుడ్ వర్క్ చేయగా, ఎలక్ట్రికల్ బృందం సురక్షితమైన వైరింగ్ మరియు కనెక్షన్లు పూర్తి చేస్తుంది."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-blue-650 group-hover:text-white transition-premium" />,
                title_en: "4. Handover & Warranty",
                title_te: "4. వారంటీతో అందజేత",
                desc_en: "Rigorous quality checks, site cleaning, and handover of your project along with a 2-year warranty protection card.",
                desc_te: "చివరి నాణ్యత తనిఖీలు పూర్తి చేసి, 2 సంవత్సరాల సేవా వారంటీ కార్డుతో మీ ఇళ్లను సగర్వంగా అందజేస్తాము."
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-3xl border border-slate-100 p-8 shadow-premium hover:shadow-premium-hover transition-premium relative group flex flex-col space-y-4 md:hover:-translate-y-1.5 overflow-hidden"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={idx}
              >
                {/* Floating Big Index Number */}
                <span className="absolute top-4 right-6 text-6xl font-outfit font-extrabold text-slate-100 group-hover:text-wood/10 select-none transition-premium pointer-events-none">
                  0{idx + 1}
                </span>

                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shadow-inner group-hover:bg-gold-gradient transition-premium z-10">
                  {step.icon}
                </div>
                <div className="space-y-2 z-10">
                  <h3 className="font-outfit font-extrabold text-slate-900 text-lg leading-snug">
                    {i18n.language === 'te' ? step.title_te : step.title_en}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
                    {i18n.language === 'te' ? step.desc_te : step.desc_en}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CLIENT EXPERIENCE: DYNAMIC FAQS ─── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-forest text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
            Client Assistance
          </span>
          <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900 leading-tight">
            {i18n.language === 'te' ? 'తరచుగా అడిగే ప్రశ్నలు' : 'Frequently Asked Questions'}
          </h2>
          <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4"></div>
          <p className="text-slate-500 text-sm">
            {i18n.language === 'te'
              ? 'మా సేవలు మరియు పనితీరు గురించి కస్టమర్లు సాధారణంగా అడిగే ప్రశ్నల సమాధానాలు.'
              : 'Quick answers to common questions about our custom services, warranties, and project timelines.'}
          </p>
        </div>

        <div className="space-y-5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden transition-premium hover:border-wood/20"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-outfit font-extrabold text-slate-800 text-sm sm:text-base leading-snug">
                  {i18n.language === 'te' ? faq.q_te : faq.q_en}
                </span>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 shrink-0 ${activeFaq === idx ? 'rotate-90 text-forest' : 'text-slate-400'}`} />
              </button>

              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-1 border-t border-slate-50 text-slate-600 text-xs sm:text-sm leading-relaxed font-light">
                      {i18n.language === 'te' ? faq.a_te : faq.a_en}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SHOWROOM LOCATION & DIRECTIONS MAP ─── */}
      <section id="showroom-location" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900">
            {t('common.location')}
          </h2>
          <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4"></div>
          <p className="text-slate-500 text-sm">
            {t('common.showroom_title')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          {/* Left Column: Address Card */}
          <motion.div
            className="bg-white rounded-3xl border border-slate-100 p-8 space-y-6 shadow-premium flex flex-col justify-between"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-6">
              <h3 className="font-outfit font-extrabold text-xl text-slate-900 border-b border-slate-100 pb-3">
                Raja Rajeshwari Interior Works
              </h3>
              
              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-wood" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.address_label')}</span>
                    <span className="text-slate-500 leading-relaxed">
                      S.V Moon lake apartments, Narendra Nagar Colony,<br />
                      Ameenpur, Miyapur, Hyderabad, Telangana 502032
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.phone_label')}</span>
                    <div className="flex flex-col gap-1">
                      <a href={TEL_LINK} className="text-slate-500 hover:text-forest transition-smooth font-medium">
                        {PHONE_DISPLAY}
                      </a>
                      <a href={TEL_LINK_2} className="text-slate-500 hover:text-forest transition-smooth font-medium">
                        {PHONE_DISPLAY_2}
                      </a>
                    </div>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.email_label')}</span>
                    <a href="mailto:rajamoulichary20@gmail.com" className="text-slate-500 hover:text-blue-600 transition-smooth">
                      rajamoulichary20@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.showroom_hours')}</span>
                    <span className="text-slate-500">{t('common.showroom_days')}</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-6">
              <a
                href="https://www.google.com/maps/search/?api=1&query=S.V.+Moon+Lake+Apartments+Ameenpur+Hyderabad"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-wood hover:bg-wood-dark text-white px-6 py-3 rounded-xl font-bold text-sm transition-smooth shadow-premium"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('common.get_directions')}</span>
              </a>
            </div>
          </motion.div>

          {/* Right Column: Google Map Container */}
          <motion.div
            className="w-full min-h-[350px] lg:h-full rounded-3xl overflow-hidden border border-slate-100 shadow-premium relative group bg-slate-50"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              title="Raja Rajeshwari Interior Works Showroom Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.29740523275!2d78.3377727!3d17.5051664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f1f0aef7ff%3A0x2a9cb9b09db4681!2sAmeenpur%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              className="absolute inset-0 w-full h-full border-0 group-hover:scale-[1.01] transition-smooth"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </section>

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
                  <span className="text-[10px] bg-forest/80 text-forest-light px-2.5 py-1 rounded-md font-bold uppercase tracking-wider block w-fit mb-1.5">
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
                    <div className="spinner-3d"></div>
                    <span className="text-xs font-semibold">Initializing 3D Environment...</span>
                  </div>
                }>
                  <InteriorShowcase3D />
                </Suspense>
              </div>

              {/* Modal Footer */}
              <div className="p-5 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shrink-0 text-xs text-slate-400">
                <p className="leading-relaxed">
                  💡 Use your mouse or touch swipe to rotate the showroom. Pinch to zoom in/out.
                </p>
                <div className="flex gap-3">
                  <a
                    href={WA_GENERAL_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-whatsapp hover:bg-whatsappdark text-white px-4 py-2 rounded-xl font-bold transition-smooth"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setIs3DOpen(false)}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-bold transition-smooth"
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
