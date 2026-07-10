import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { categoryService } from '../services/api';
import { ChevronLeft } from 'lucide-react';

export default function Categories() {
  const { t, i18n } = useTranslation();
  const [allSubcategories, setAllSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null); // null | 'interior' | 'electrical' | 'lighting'

  useEffect(() => {
    categoryService.getAll()
      .then((data) => {
        setAllSubcategories(data);
      })
      .catch((err) => console.error('Error fetching categories:', err))
      .finally(() => setLoading(false));
  }, []);

  const mainServices = [
    {
      id: 'interior',
      name_en: 'Interior Works',
      name_te: 'ఇంటీరియర్ పనులు',
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      description_en: 'Explore premium residential modular kitchens, luxurious living rooms, modular wardrobes, POP ceilings, custom furniture, and corporate workspace designs.',
      description_te: 'ప్రీమియం నివాస మోడ్యులర్ కిచెన్‌లు, విలాసవంతమైన లివింగ్ రూమ్‌లు, వార్డ్‌రోబ్‌లు, పిఓపి సీలింగ్‌లు, అనుకూలీకరించిన ఫర్నిచర్ మరియు కార్యాలయ డిజైన్లను చూడండి.',
    },
    {
      id: 'electrical',
      name_en: 'Electrical Works',
      name_te: 'ఎలక్ట్రికల్ పనులు',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
      description_en: 'View safe residential house wiring, industrial power backup installations, automatic changeover panels, and smart home automation relays.',
      description_te: 'సురక్షితమైన ఇళ్ల వైరింగ్, పారిశ్రామిక పవర్ బ్యాకప్ సిస్టమ్స్, ఆటోమేటిక్ చేంజ్ఓవర్ ప్యానెల్లు మరియు స్మార్ట్ హోమ్ ఆటోమేషన్ రిలేలను చూడండి.',
    },
    {
      id: 'lighting',
      name_en: 'Lighting Solutions',
      name_te: 'లైటింగ్ సొల్యూషన్స్',
      image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
      description_en: 'Discover luxury decorative crystal chandeliers, retail showroom spotlight track grids, energy-efficient LED panels, and artistic outdoor garden lighting.',
      description_te: 'లగ్జరీ అలంకార క్రిస్టల్ ఝూమర్లు, షోరూమ్ స్పాట్‌లైట్లు, శక్తి-సమర్థవంతమైన ఎల్‌ఈడీ ప్యానెల్‌లు మరియు తోట లైటింగ్ డిజైన్లను కనుగొనండి.',
    }
  ];

  const getLocalizedName = (cat) => i18n.language === 'te' ? cat.name_te : cat.name_en;
  const getLocalizedDesc = (cat) => i18n.language === 'te' ? cat.description_te : cat.description_en;

  // Filter subcategories by the selected main service
  const filteredSubcategories = allSubcategories.filter(
    (sub) => sub.workType === selectedService
  );

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-forest text-xs font-extrabold uppercase tracking-widest block mb-2 font-sans">
            {selectedService ? 'Service Division' : 'Our Specializations'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold text-slate-900 tracking-tight">
            {selectedService 
              ? getLocalizedName(mainServices.find(s => s.id === selectedService))
              : (i18n.language === 'te' ? 'సేవా విభాగాలు' : 'Our Service Categories')
            }
          </h1>
          <div className="w-16 h-1 bg-wood mx-auto mt-4 mb-4"></div>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {selectedService
              ? (i18n.language === 'te' 
                  ? 'ఈ విభాగంలోని అన్ని డిజైన్ కేటగిరీలను క్రింద బ్రౌజ్ చేయండి.' 
                  : `Browse all design categories under ${getLocalizedName(mainServices.find(s => s.id === selectedService))}.`)
              : (i18n.language === 'te'
                  ? 'మేము అందించే మూడు ప్రధాన సేవా విభాగాలు మరియు నైపుణ్యాలను క్రింద బ్రౌజ్ చేయండి.'
                  : 'Browse through our three specialized service divisions delivering premium quality and craftsmanship across India.')}
          </p>
        </div>

        {/* Back Button (Only visible when a service is selected) */}
        {selectedService && (
          <div className="mb-8">
            <button
              onClick={() => setSelectedService(null)}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-50 transition-smooth shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 text-forest" />
              <span>{i18n.language === 'te' ? 'అన్ని విభాగాలు' : 'Back to Service Divisions'}</span>
            </button>
          </div>
        )}

        {/* Conditional View Rendering */}
        {!selectedService ? (
          /* Main Services View (3 Cards) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mainServices.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedService(cat.id)}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-premium shadow-premium-hover flex flex-col h-full text-left transition-smooth md:hover:-translate-y-2 w-full"
              >
                {/* Card Banner Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-50 w-full shrink-0">
                  <img
                    src={cat.image}
                    alt={getLocalizedName(cat)}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <span className="text-[10px] bg-forest/90 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                      {cat.id === 'interior' ? '🏠 Design' : cat.id === 'electrical' ? '⚡ Power' : '💡 Light'}
                    </span>
                  </div>
                </div>

                {/* Card Content details */}
                <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between gap-5 w-full">
                  <div className="space-y-3">
                    <h3 className="text-slate-900 font-outfit font-extrabold text-xl sm:text-2xl group-hover:text-forest transition-smooth">
                      {getLocalizedName(cat)}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {getLocalizedDesc(cat)}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-forest group-hover:text-forest-dark">
                    <span>{i18n.language === 'te' ? 'కేటగిరీలు చూడండి' : 'View Categories'}</span>
                    <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Subcategories View (Specific to Clicked Service) */
          <div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-slate-100 shadow-sm"></div>
                ))}
              </div>
            ) : filteredSubcategories.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm">
                <p className="text-slate-500 italic">No subcategories found in this service area yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSubcategories.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/designs?category=${sub._id}`}
                    className="group h-80 rounded-3xl overflow-hidden relative shadow-premium shadow-premium-hover block transition-smooth md:hover:-translate-y-1.5"
                  >
                    <img
                      src={sub.image || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80'}
                      alt={getLocalizedName(sub)}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>
                    
                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                      <span className="text-[10px] bg-wood text-white px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                        Collection
                      </span>
                      <h3 className="text-white font-outfit font-extrabold text-xl sm:text-2xl leading-tight">
                        {getLocalizedName(sub)}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
