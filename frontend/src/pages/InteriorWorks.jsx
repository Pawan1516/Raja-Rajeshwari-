import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Briefcase, Box, Layers, Palette, Grid, Scissors, Hammer, ArrowRight, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { WA_GENERAL_LINK, TEL_LINK } from '../constants';

export default function InteriorWorks() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('residential');

  const tabs = [
    { id: 'residential', name: i18n.language === 'te' ? 'నివాస ఇంటీరియర్' : 'Residential Interior', icon: <Home className="w-4 h-4" /> },
    { id: 'commercial', name: i18n.language === 'te' ? 'వ్యాపార ఇంటీరియర్' : 'Commercial Interior', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'modular', name: i18n.language === 'te' ? 'మాడ్యులర్ పనులు' : 'Modular Works', icon: <Box className="w-4 h-4" /> },
    { id: 'ceiling', name: i18n.language === 'te' ? 'సీలింగ్ పనులు' : 'Ceiling Works', icon: <Layers className="w-4 h-4" /> },
    { id: 'wall', name: i18n.language === 'te' ? 'గోడల అలంకరణ' : 'Wall Works', icon: <Grid className="w-4 h-4" /> },
    { id: 'flooring', name: i18n.language === 'te' ? 'ఫ్లోరింగ్' : 'Flooring', icon: <Scissors className="w-4 h-4" /> },
    { id: 'furniture', name: i18n.language === 'te' ? 'ఫర్నిచర్ పనులు' : 'Furniture Works', icon: <Hammer className="w-4 h-4" /> },
    { id: 'painting', name: i18n.language === 'te' ? 'పెయింటింగ్ & ఫినిషింగ్' : 'Painting & Finishing', icon: <Palette className="w-4 h-4" /> },
  ];

  const servicesData = {
    residential: {
      title: i18n.language === 'te' ? 'నివాస ఇంటీరియర్ పనులు' : 'Residential Interior Works',
      description: i18n.language === 'te' 
        ? 'మీ అభిరుచులకు అనుగుణంగా అందమైన, సౌకర్యవంతమైన ఇళ్లను రూపొందించడం మా ప్రత్యేకత.' 
        : 'Designing elegant, comfortable, and personalized living spaces that reflect your unique style and family lifestyle.',
      items: [
        { name: 'Living Room Interior', img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80', desc: 'Premium entertainment units, customizable wall paneling, and comfortable seating layouts.' },
        { name: 'Bedroom Interior', img: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80', desc: 'Cozy wardrobes, elegant headboard designs, false ceilings, and ambient lighting settings.' },
        { name: 'Kitchen Interior', img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80', desc: 'Space-saving modular cabinets, chimneys, durable pull-out baskets, and robust countertops.' },
        { name: 'Dining Room Interior', img: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80', desc: 'Custom dining tables, partition designs, and gorgeous pendant lighting schemes.' },
        { name: 'Bathroom Interior', img: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80', desc: 'Sleek vanity cabinets, modern tile works, and high-end sanitary fittings layout.' },
        { name: 'Children\'s Room', img: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&w=800&q=80', desc: 'Vibrant colors, space-saving bunk beds, study tables, and playful wall decals.' }
      ],
      features: ['Personalized Design Consultations', 'Ergonomic Space Utilization', 'Premium Durable Laminates', 'Eco-friendly Materials']
    },
    commercial: {
      title: i18n.language === 'te' ? 'వ్యాపార ఇంటీరియర్ పనులు' : 'Commercial Interior Works',
      description: i18n.language === 'te' 
        ? 'ఉత్పాదకతను పెంచే మరియు కస్టమర్లను ఆకట్టుకునే ఆధునిక ఆఫీస్ మరియు షోరూమ్ డిజైన్లు.' 
        : 'Creating high-performance workspace environments that inspire collaboration, enhance productivity, and impress clients.',
      items: [
        { name: 'Office Interior', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', desc: 'Ergonomic workstations, partition systems, executive cabins, and sleek reception desks.' },
        { name: 'Retail Shop Interior', img: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80', desc: 'Aesthetic product display racks, premium glass showcases, and optimal walking space layouts.' },
        { name: 'Restaurant & Café', img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', desc: 'Cozy and dynamic seating configurations, ambient lighting layouts, and custom bars.' },
        { name: 'Hotel Interior', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', desc: 'Luxury lobby counters, ambient guest rooms, wall paneling, and false ceiling works.' },
        { name: 'Hospital & Clinic', img: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80', desc: 'Hygienic layouts, comfortable waiting lounges, storage systems, and durable flooring.' },
        { name: 'Showroom Interior', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80', desc: 'Elegant theme-based layouts, focus lighting systems, and comfortable customer lounges.' }
      ],
      features: ['Brand Identity Integration', 'Optimal Foot-Traffic Planning', 'Accoustic Control Options', 'Heavy-Duty Commercial Materials']
    },
    modular: {
      title: i18n.language === 'te' ? 'మాడ్యులర్ ఫిట్టింగ్స్ & కిచెన్లు' : 'Modular Fittings & Kitchens',
      description: i18n.language === 'te' 
        ? 'అధునిక మాడ్యులర్ కిచెన్లు మరియు స్పేస్-సేవింగ్ వార్డ్‌రోబ్స్.' 
        : 'Smart, customizable, and factory-finished storage modules designed for contemporary space optimization.',
      items: [
        { name: 'Modular Kitchen', img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80', desc: 'L-Shaped, U-Shaped, Parallel, or Island layouts with soft-close drawers and chimneys.' },
        { name: 'Modular Wardrobes', img: 'https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&w=800&q=80', desc: 'Sliding wardrobes, openable closets, customizable drawers, and built-in dressing mirrors.' },
        { name: 'TV Units', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80', desc: 'Floating media consoles, back-lit panel boards, storage drawers, and wire management.' },
        { name: 'Storage Cabinets', img: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80', desc: 'Bookshelves, shoe racks, crockery displays, and custom space-saving utility cabinets.' }
      ],
      features: ['Soft-Close Hydraulic Hinge systems', 'Waterproof BWP Plywood', 'Scratch-Resistant Acrylic/Laminate', '10-Year Material Warranty']
    },
    ceiling: {
      title: i18n.language === 'te' ? 'ఫాల్స్ సీలింగ్ డిజైన్లు' : 'False Ceiling & Ceiling Works',
      description: i18n.language === 'te' 
        ? 'ఆకర్షణీయమైన లైటింగ్ మరియు హీట్ ఇన్సులేషన్‌తో కూడిన ఫాల్స్ సీలింగ్స్.' 
        : 'Architectural false ceilings providing visual depth, sound insulation, and perfect cove lighting placement.',
      items: [
        { name: 'Gypsum Ceiling', img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', desc: 'Perfect seamless plaster finishes, modern curves, and step patterns.' },
        { name: 'POP Ceiling', img: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', desc: 'Plaster of Paris custom cornices, classical moldings, and artistic geometric shapes.' },
        { name: 'PVC Ceiling', img: 'https://images.unsplash.com/photo-1527030280862-64139fbe04ca?auto=format&fit=crop&w=800&q=80', desc: 'Moisture-resistant panels, wood texture finishes, quick and dust-free installations.' },
        { name: 'Wooden Ceiling', img: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&w=800&q=80', desc: 'Premium teak wood styling, luxury veneers, and warm accent rafter styling.' }
      ],
      features: ['Rust-proof GI Metal Framework', 'LED/Cove Lighting Ready', 'Thermal & Acoustic Insulation', 'Seamless Joint Finishes']
    },
    wall: {
      title: i18n.language === 'te' ? 'వాల్ క్లాడింగ్ & ప్యానెలింగ్' : 'Wall Cladding & Wall Works',
      description: i18n.language === 'te' 
        ? 'మీ గోడలకు కొత్త లుక్ తెచ్చే వాల్ పేపర్స్ మరియు చెక్క ప్యానెల్స్.' 
        : 'Elevating plain walls into architectural focal points with textured cladding, veneers, and custom paneling.',
      items: [
        { name: 'Wallpaper Installation', img: 'https://images.unsplash.com/photo-1534349762230-e0cadf78f5da?auto=format&fit=crop&w=800&q=80', desc: 'Imported 3D textured wallpaper rolls, waterproof prints, and customized photo murals.' },
        { name: 'Wall Paneling', img: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80', desc: 'WPC fluted panels, MDF decorative boards, charcoal louvers, and cushion paddings.' },
        { name: 'Stone Cladding', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', desc: 'Natural slate tiles, stone veneers, brick tiles, and high-end marble panel backdrops.' }
      ],
      features: ['Termite & Moisture Resistant Panels', 'Quick Dust-Free Mountings', 'Easy-to-clean Anti-scratch Surfaces', 'Hidden Cable Wire Tracks']
    },
    flooring: {
      title: i18n.language === 'te' ? 'ప్రీమియం ఫ్లోరింగ్ పనులు' : 'Premium Flooring Works',
      description: i18n.language === 'te' 
        ? 'మన్నికైన చెక్క, మార్బుల్ మరియు గ్రానైట్ ఫ్లోరింగ్స్.' 
        : 'Elegant, wear-resistant, and high-density flooring layouts that ground your interiors with character.',
      items: [
        { name: 'Wooden Flooring', img: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80', desc: 'Laminated hardwood floors, click-lock systems, and scratch-resistant finishes.' },
        { name: 'Marble & Granite', img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', desc: 'Premium Italian marble polishing, mirror-gloss granite tiles, and natural borders.' },
        { name: 'Vinyl & Tile Flooring', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', desc: 'Waterproof SPC vinyl planks, anti-skid ceramic tiles, and vitrified floor layouts.' }
      ],
      features: ['Under-layment Sound Absorber', 'Seamless Interlock Layouts', 'Stain & Scratch Protection Coatings', 'Water-resistant Adhesives']
    },
    furniture: {
      title: i18n.language === 'te' ? 'కస్టమ్ ఫర్నిచర్ తయారీ' : 'Custom & Specialized Furniture',
      description: i18n.language === 'te' 
        ? 'ఖచ్చితమైన కొలతలతో హ్యాండ్ మేడ్ చెక్క ఫర్నిచర్.' 
        : 'Tailored luxury furniture handcrafted by expert carpenters to blend seamlessly with your interior dimensions.',
      items: [
        { name: 'Custom Sofa & Seating', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', desc: 'L-shaped lounger sofas, premium velvet/leather upholstery, and high-density foam padding.' },
        { name: 'Bespoke Dining Sets', img: 'https://images.unsplash.com/photo-1530018607912-eff2df134f4e?auto=format&fit=crop&w=800&q=80', desc: 'Teak wood dining frames, marble tables, and ergonomically shaped dining chairs.' },
        { name: 'Home Office Furniture', img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80', desc: 'Custom study desks, floating book racks, file drawer cabinets, and office tables.' }
      ],
      features: ['Solid Teak Wood & BWP Frame base', 'Premium High-Density Foam (40+ Density)', 'Stain-Resistant Fabric Selections', 'Customized Dimension Sizing']
    },
    painting: {
      title: i18n.language === 'te' ? 'పెయింటింగ్ & వాల్ ఫినిషింగ్స్' : 'Painting & Decorative Finishing',
      description: i18n.language === 'te' 
        ? 'రాయల్ టచ్ ఇచ్చే లగ్జరీ పెయింట్స్ మరియు టెక్స్చర్స్.' 
        : 'Adding color depth, texture, and protective seals using premium emulsions, wood polishes, and custom texture wall finishes.',
      items: [
        { name: 'Interior & Emulsion Painting', img: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80', desc: 'Flawless wall putty preparation, primer coatings, and washable royal emulsions.' },
        { name: 'Texture & Royal Play', img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80', desc: 'Artistic metallic patterns, rustic stone textures, and custom stencil designs.' },
        { name: 'Wood Polish & PU Finish', img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=800&q=80', desc: 'Melamine spray coatings, clear PU waterproofing gloss, and natural teak oil rubbing.' }
      ],
      features: ['Eco-friendly Low VOC Paints', 'Advanced Putty Sanding Machines', 'Waterproof Base Coat Primers', 'Durable UV-resistant Polishes']
    }
  };

  const activeData = servicesData[activeTab];

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      
      {/* ─── HEADER BANNER ─── */}
      <section className="bg-slate-900 text-white py-16 mb-12 border-b-4 border-wood relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,90,43,0.15)_0%,transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-wood-light uppercase text-xs font-semibold tracking-widest block mb-2 font-sans">
            Craftsmanship Excellence
          </span>
          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold tracking-tight">
            {i18n.language === 'te' ? 'ఇంటీరియర్ డిజైనింగ్ పనులు' : 'Interior Designing & Works'}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-sans">
            {i18n.language === 'te' 
              ? 'మాడ్యులర్ కిచెన్లు, వార్డ్‌రోబ్స్, ఫాల్స్ సీలింగ్స్ మరియు కస్టమ్ వుడ్ వర్క్స్‌లో లగ్జరీ సొల్యూషన్స్.'
              : 'End-to-end bespoke home styling, modular systems, wooden fittings, false ceilings, and premium wall treatments.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── GLASSMORPHIC TABS BAR ─── */}
        <div className="flex overflow-x-auto gap-2 p-2 mb-10 hide-scrollbar snap-x scroll-smooth glass-premium rounded-3xl border border-slate-200/50 shadow-sm max-w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-smooth shrink-0 snap-start ${
                activeTab === tab.id
                  ? 'bg-wood text-white shadow-md shadow-wood/15 scale-[1.01]'
                  : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* ─── TAB CONTENT DISPLAY ─── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-12"
          >
            {/* Service Banner Info */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-premium grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-outfit font-extrabold text-slate-900">
                  {activeData.title}
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {activeData.description}
                </p>
              </div>

              {/* Action Buttons Box */}
              <div className="bg-slate-950 p-6 rounded-2xl text-white space-y-4 shadow-lg text-center lg:text-left">
                <p className="text-xs text-wood-light uppercase tracking-wider font-semibold">
                  {i18n.language === 'te' ? 'ఉచిత కొటేషన్ పొందండి' : 'Need Custom Sizing?'}
                </p>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5">
                  <a
                    href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                      `Hello, I would like to get a quote/details for ${activeData.title}.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsappdark text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-smooth shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Inquiry</span>
                  </a>
                  <a
                    href={TEL_LINK}
                    className="flex items-center justify-center gap-2 bg-forest hover:bg-forest-dark text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-smooth shadow-call-glow"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{t('common.call_now')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Subcategories Grid */}
            <div className="space-y-6">
              <h3 className="font-outfit font-bold text-lg text-slate-800 border-l-4 border-wood pl-3">
                {i18n.language === 'te' ? 'లభ్యమయ్యే డిజైన్లు & విభాగాలు' : 'Available Service Areas'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activeData.items.map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-premium hover:shadow-premium-hover transition-smooth flex flex-col group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      <span className="absolute bottom-3 left-4 bg-wood/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-sans">
                        {item.name}
                      </span>
                    </div>
                    
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <div>
                        <h4 className="font-outfit font-bold text-slate-800 text-base">
                          {item.name}
                        </h4>
                        <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-xs">
                        <a
                          href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                            `Hello Raja Rajeshwari Interiors, I am interested in your ${item.name} service.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-wood font-bold hover:text-wood-dark flex items-center gap-1.5 transition-smooth group/link"
                        >
                          <span>Request Quote</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-smooth" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quality Standard Badging */}
            <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200/60">
              <h3 className="font-outfit font-bold text-lg text-slate-800 mb-4 text-center sm:text-left">
                {i18n.language === 'te' ? 'మా నాణ్యతా ప్రమాణాలు' : 'Our Craftsmanship Standards'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeData.features.map((feat, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-slate-200/40">
                    <CheckCircle2 className="w-5 h-5 text-forest shrink-0" />
                    <span className="text-xs font-semibold text-slate-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>

    </div>
  );
}
