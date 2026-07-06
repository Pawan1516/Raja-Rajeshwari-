import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sun, ShieldCheck, Settings, Award, ArrowRight, MessageSquare, Phone, CheckCircle2, Moon, Sparkles, AlertTriangle } from 'lucide-react';
import { WA_GENERAL_LINK, TEL_LINK } from '../constants';

export default function ElectricalLighting() {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('electrical');

  const electricalServices = [
    {
      title: 'House Wiring & Fitting',
      img: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=800&q=80',
      desc: 'Complete residential conduit piping, fire-resistant multi-strand copper wiring, and luxury switchboard installations.',
      features: ['FRLS (Flame Retardant Low Smoke) Cables', 'Structured Concealed Piping', 'Perfect Phase Load Balancing', 'Premium modular switches configuration'],
      safety: 'IS-certified copper cables and double-pole MCB distribution panels.',
      process: 'Conduit marking → Chipping & piping → Cable pulling → Fitting & testing.'
    },
    {
      title: 'Commercial Wiring Solutions',
      img: 'https://images.unsplash.com/photo-1558224494-ef8b21754f26?auto=format&fit=crop&w=800&q=80',
      desc: 'Heavy-duty wiring conduits, 3-phase load configurations, busbar chamber setups, and server rack powering solutions.',
      features: ['Armored underground cable layout', 'Server UPS dedicated lines', 'Industrial grade distribution boxes', 'Proper cable tray management'],
      safety: 'ELCB/RCCB leakage protection and specialized high-voltage circuit breakers.',
      process: 'Load assessment → Trunking/Tray routing → Armor cable lay → Termination & testing.'
    },
    {
      title: 'Electrical Panels & Distribution Boards',
      img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      desc: 'Custom fabrication of power control center (PCC) panels, motor control center (MCC) panels, and sub-distribution boards.',
      features: ['Compact wall-mount or floor-standing designs', 'Busbar heat shrinking sleeves', 'Clear digital voltmeter/ammeter meters', 'Safe lockable enclosures'],
      safety: 'IP55 water & dust-proof panel chassis housing with dual earthing wires.',
      process: 'Fabrication design → Internal component assembly → Wire routing → Live load testing.'
    },
    {
      title: 'Smart Home Automation',
      img: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
      desc: 'Integration of smart touch panels, Wi-Fi relays, smart curtain motors, and mobile app-controlled appliances.',
      features: ['Sleek capacitive touch switches', 'No rewiring required installation options', 'Alexa & Google Home voice integration', 'Custom mood scene configuration'],
      safety: 'Low voltage control signals (12V/24V) to prevent electric shock hazard.',
      process: 'Device survey → Automation module fitment → App setup → Voice command syncing.'
    },
    {
      title: 'Power Backup & Inverter Systems',
      img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
      desc: 'Double-battery inverter setups, online/offline UPS integrations, and automatic change-over switch configurations.',
      features: ['Pure sine-wave silent inverters', 'Tubular heavy-duty batteries selection', 'Proper cabinet ventilation shelving', 'Auto-bypass safety switches'],
      safety: 'Acid-spill proof tray frames, safety vent caps, and short-circuit breakers.',
      process: 'Load computation → Battery bank planning → Inverter mounting → Mains routing.'
    },
    {
      title: 'Electrical Diagnostics & Maintenance',
      img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      desc: 'Thermal camera scanner testing, earth resistance value checking, short-circuit tracking, and switch repairs.',
      features: ['Megger insulation resistance tests', 'Copper earth plate moisture checks', 'Loose contact retightening checks', 'Emergency fault finding visits'],
      safety: 'Rubber insulated safety gear, lock-out tag-out protocols, and non-contact voltage test pens.',
      process: 'Visual checks → Earth loop testing → Load check → Diagnostic report → Repair.'
    }
  ];

  const lightingServices = [
    {
      category: 'Indoor Lighting Solutions',
      img: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80',
      desc: 'Downlights, architectural LED profiles, recessed spotlights, and luxury chandeliers that create welcoming environments.',
      items: ['CRI 90+ Spotlights (True color rendering)', 'Anti-glare downlights', 'Premium crystal and metal chandeliers', 'Architectural magnetic tracks'],
      energy: 'Saves up to 85% electricity compared to traditional halogen indoor bulbs.',
      examples: 'Living room perimeter cove lights, master bedroom bedside hanging lamps.'
    },
    {
      category: 'Outdoor & Landscape Lighting',
      img: 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?auto=format&fit=crop&w=800&q=80',
      desc: 'IP65-rated garden bollards, tree uplighters, weather-proof security wall lights, and gate lamps.',
      items: ['Stainless steel pathway spike lights', 'Warm white tree uplighters', 'Radar motion sensor security lights', 'Heavy-duty driveway walkover lights'],
      energy: 'Dusk-to-dawn sensors automatically turn off lights, preventing daylight wastage.',
      examples: 'Villas landscape garden paths, commercial parking lot spotlights.'
    },
    {
      category: 'Decorative Accent Lighting',
      img: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80',
      desc: 'Pendant lighting, linear cove profiles, wall-mounted art sconces, and floating cabinet backlight strips.',
      items: ['Flexible COB LED strips (No dot lines)', 'Handcrafted wooden pendant structures', 'Adjustable dual-focus wall sconces', 'Kitchen under-cabinet profile channels'],
      energy: 'Dimmable LED driver modules draw only the required power based on brightness.',
      examples: 'Kitchen island dining counter hanging lights, TV back panel cove strips.'
    },
    {
      category: 'Commercial & Office Lighting',
      img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80',
      desc: 'Uniform lux level office panel lights, linear modular trunkings, and accent display spots for showrooms.',
      items: ['2x2 LED Grid panel lights (Uniform diffusers)', 'Flicker-free eye protection drivers', 'Retail shop track spots', 'High-bay warehouse dome lights'],
      energy: 'Smart light harvesting systems dim fixtures when natural sunlight is sufficient.',
      examples: 'Corporate conference rooms, retail showroom window displays.'
    },
    {
      category: 'Smart & RGB Mood Lighting',
      img: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
      desc: 'App-controlled RGB LED channels, addressable pixel lights, and custom sound-active color controllers.',
      items: ['Smart Wi-Fi RGBW strip integrations', 'Voice-controlled brightness adjustments', 'Custom preset party/theater scenarios', 'Smartphone application color dial selectors'],
      energy: 'Scheduled automatic shut-off timers ensure lights are never left on overnight.',
      examples: 'Home theater backlights, bar counter dynamic mood settings.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      
      {/* ─── HEADER BANNER ─── */}
      <section className="bg-slate-900 text-white py-16 mb-12 border-b-4 border-wood relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(46,125,50,0.15)_0%,transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-forest-light uppercase text-xs font-semibold tracking-widest block mb-2 font-sans">
            Safety & Efficiency
          </span>
          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold tracking-tight">
            {i18n.language === 'te' ? 'ఎలక్ట్రికల్ & లైటింగ్ సేవలు' : 'Electrical & Lighting Services'}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-sans">
            {i18n.language === 'te' 
              ? 'సురక్షితమైన వైరింగ్, స్మార్ట్ హోమ్ ఆటోమేషన్ మరియు ప్రీమియం ఎల్‌ఈడీ లైటింగ్ సొల్యూషన్స్.'
              : 'Certified power distribution, fire-safe house wiring, smart home automation, and energy-efficient luxury lighting.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── SWITCHER BUTTONS ─── */}
        <div className="flex justify-center mb-12">
          <div className="glass-premium p-1.5 rounded-full flex shadow-sm border border-slate-200/50">
            <button
              onClick={() => setActiveSection('electrical')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-smooth ${
                activeSection === 'electrical'
                  ? 'bg-forest text-white shadow-md shadow-forest/15 scale-[1.01]'
                  : 'text-slate-655 hover:text-forest'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>{i18n.language === 'te' ? 'ఎలక్ట్రికల్ సేవలు' : 'Electrical Services'}</span>
            </button>
            <button
              onClick={() => setActiveSection('lighting')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold transition-smooth ${
                activeSection === 'lighting'
                  ? 'bg-wood text-white shadow-md shadow-wood/15 scale-[1.01]'
                  : 'text-slate-655 hover:text-wood'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{i18n.language === 'te' ? 'లైటింగ్ సొల్యూషన్స్' : 'Lighting Services'}</span>
            </button>
          </div>
        </div>

        {/* ─── CONTENT BLOCKS ─── */}
        <AnimatePresence mode="wait">
          {activeSection === 'electrical' ? (
            <motion.div
              key="electrical"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {electricalServices.map((serv, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-premium flex flex-col justify-between">
                    <div>
                      {/* Service Image with Safety Shield Badge */}
                      <div className="h-52 overflow-hidden relative">
                        <img src={serv.img} alt={serv.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm text-forest-light px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                          <ShieldCheck className="w-4 h-4" />
                          <span>IS Certified</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-6 space-y-4">
                        <h3 className="font-outfit font-extrabold text-slate-800 text-lg">
                          {serv.title}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {serv.desc}
                        </p>

                        {/* Bullet Lists */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Included Features</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {serv.features.map((f, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Safety Box */}
                        <div className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 flex items-start gap-2.5">
                          <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-extrabold text-red-700 block uppercase tracking-wider">Safety Standard</span>
                            <p className="text-[11px] text-red-600 mt-0.5">{serv.safety}</p>
                          </div>
                        </div>

                        {/* Process Flow */}
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-500 block uppercase tracking-wider">Installation Process</span>
                          <p className="text-[11px] text-slate-600 mt-1 italic">{serv.process}</p>
                        </div>
                      </div>
                    </div>

                    {/* Request Quote Button */}
                    <div className="p-6 pt-0">
                      <a
                        href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                          `Hello Raja Rajeshwari, I am inquiring about the ${serv.title} electrical service.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white py-3 rounded-xl text-xs font-bold transition-smooth"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Request Quote</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lighting"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {lightingServices.map((serv, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-premium flex flex-col justify-between">
                    <div>
                      {/* Image header */}
                      <div className="h-52 overflow-hidden relative">
                        <img src={serv.img} alt={serv.category} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4 bg-wood/90 backdrop-blur-sm text-white px-3 py-1 rounded-xl flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Premium Finish</span>
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className="p-6 space-y-4">
                        <h3 className="font-outfit font-extrabold text-slate-800 text-lg">
                          {serv.category}
                        </h3>
                        <p className="text-slate-500 text-xs leading-relaxed">
                          {serv.desc}
                        </p>

                        {/* Bullet Lists */}
                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Product Showcase</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {serv.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-wood shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Energy Benefits */}
                        <div className="bg-forest/5 border border-forest/10 rounded-xl p-3.5 flex items-start gap-2.5">
                          <Sun className="w-4.5 h-4.5 text-forest shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-extrabold text-forest block uppercase tracking-wider">Energy-Saving Benefit</span>
                            <p className="text-[11px] text-slate-600 mt-0.5">{serv.energy}</p>
                          </div>
                        </div>

                        {/* Installation examples */}
                        <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                          <span className="text-[10px] font-extrabold text-slate-500 block uppercase tracking-wider">Installation Examples</span>
                          <p className="text-[11px] text-slate-650 mt-1 italic">{serv.examples}</p>
                        </div>
                      </div>
                    </div>

                    {/* Request Quote Button */}
                    <div className="p-6 pt-0">
                      <a
                        href={`${WA_GENERAL_LINK}&text=${encodeURIComponent(
                          `Hello, I would like to query about ${serv.category} lighting services.`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 bg-wood hover:bg-wood-dark text-white py-3 rounded-xl text-xs font-bold transition-smooth shadow-premium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Request Quote</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
