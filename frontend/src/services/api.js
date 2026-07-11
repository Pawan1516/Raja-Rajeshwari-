import axios from 'axios';

import { API_URL } from '../constants';

const API_BASE_URL = API_URL;

// Mock Data for Offline Demo Mode
const mockCategories = [
  // ─── 1. Interior Works ───────────────────────────────────────────────────────
  // Living Room — luxury sofa, TV wall, LED
  { _id: "cat_living_room", name_en: "Living Room Interiors", name_te: "లివింగ్ రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg", workType: 'interior' },
  // Modular Kitchen — white cabinets island
  { _id: "cat_modular_kitchen", name_en: "Modular Kitchen Interiors", name_te: "మోడ్యులర్ కిచెన్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2016/11/18/17/20/kitchen-1837150_1280.jpg", workType: 'interior' },
  // Bedroom — king bed wooden wall panel
  { _id: "cat_bedroom", name_en: "Bedroom Interiors", name_te: "బెడ్‌రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/03/28/12/10/chairs-2181979_1280.jpg", workType: 'interior' },
  // Dining Room — pendant lights wooden flooring
  { _id: "cat_dining_room", name_en: "Dining Room Interiors", name_te: "డైనింగ్ రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2016/11/19/13/06/bed-1839564_1280.jpg", workType: 'interior' },
  // False Ceiling — cove LED strip gypsum
  { _id: "cat_false_ceiling", name_en: "False Ceiling Designs", name_te: "ఫాల్స్ సీలింగ్ డిజైన్లు", image: "https://cdn.pixabay.com/photo/2018/01/21/08/00/interior-3096218_1280.jpg", workType: 'interior' },
  // TV Unit — floating panel LED shelves
  { _id: "cat_tv_unit", name_en: "TV Unit Designs", name_te: "టీవీ యూనిట్ డిజైన్లు", image: "https://cdn.pixabay.com/photo/2020/10/18/09/16/interior-5664413_1280.jpg", workType: 'interior' },
  // Wardrobe — sliding mirror modular
  { _id: "cat_wardrobe", name_en: "Wardrobe Designs", name_te: "వార్డ్‌రోబ్ డిజైన్లు", image: "https://cdn.pixabay.com/photo/2021/01/09/09/30/bedroom-5900878_1280.jpg", workType: 'interior' },
  // Office Interiors — workstations modern
  { _id: "cat_office_interior", name_en: "Office Interiors", name_te: "ఆఫీస్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/07/31/11/21/people-2557396_1280.jpg", workType: 'interior' },
  // Commercial — showroom display shelves
  { _id: "cat_commercial_interior", name_en: "Commercial Interiors", name_te: "కమర్షియల్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/08/07/09/03/coffee-2600765_1280.jpg", workType: 'interior' },
  // Restaurant & Café — cozy modern café
  { _id: "cat_restaurant_cafe", name_en: "Restaurant & Café Interiors", name_te: "రెస్టారెంట్ & కేఫ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2016/11/29/09/16/architecture-1868667_1280.jpg", workType: 'interior' },
  // Pooja Room — wooden marble mandir
  { _id: "cat_pooja_room", name_en: "Pooja Room Interiors", name_te: "పూజా రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2020/04/09/09/07/hinduism-5020896_1280.jpg", workType: 'interior' },
  // Bathroom — marble vanity mirror luxury
  { _id: "cat_bathroom", name_en: "Bathroom Interiors", name_te: "బాత్‌రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2020/10/22/15/42/bathroom-5675254_1280.jpg", workType: 'interior' },

  // ─── 2. Electrical Works ─────────────────────────────────────────────────────
  // Residential Wiring — electrician switchboard
  { _id: "cat_wiring", name_en: "Residential Electrical Wiring", name_te: "నివాస విద్యుత్ వైరింగ్", image: "https://cdn.pixabay.com/photo/2016/11/29/01/36/home-1866375_1280.jpg", workType: 'electrical' },
  // Commercial Electrical — panel wiring office
  { _id: "cat_commercial_electrical", name_en: "Commercial Electrical Installation", name_te: "వాణిజ్య విద్యుత్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2020/02/07/10/01/electricity-4826344_1280.jpg", workType: 'electrical' },
  // Industrial — control panel equipment
  { _id: "cat_industrial_electrical", name_en: "Industrial Electrical Works", name_te: "పారిశ్రామిక విద్యుత్ పనులు", image: "https://cdn.pixabay.com/photo/2015/09/18/12/30/electric-946073_1280.jpg", workType: 'electrical' },
  // Panel Board — circuit breakers distribution
  { _id: "cat_panel_board", name_en: "Electrical Panel Board Installation", name_te: "ఎలక్ట్రికల్ ప్యానెల్ బోర్డు సంస్థాపన", image: "https://cdn.pixabay.com/photo/2016/02/19/10/58/electric-1209691_1280.jpg", workType: 'electrical' },
  // Generator — outdoor commercial installation
  { _id: "cat_generator", name_en: "Generator Installation", name_te: "జనరేటర్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2021/01/05/10/25/generator-5890747_1280.jpg", workType: 'electrical' },
  // Inverter — home battery system
  { _id: "cat_inverter", name_en: "Inverter Installation", name_te: "ఇన్వర్టర్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2019/02/19/19/45/power-4007191_1280.jpg", workType: 'electrical' },
  // Smart Home — touch switch panel
  { _id: "cat_automation", name_en: "Smart Home Automation", name_te: "స్మార్ట్ హోమ్ ఆటోమేషన్", image: "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg", workType: 'electrical' },
  // CCTV — camera installation building
  { _id: "cat_cctv", name_en: "CCTV Installation", name_te: "సీసీటీవీ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2018/01/26/09/56/camera-3108450_1280.jpg", workType: 'electrical' },
  // Fire Alarm — commercial detection panel
  { _id: "cat_fire_alarm", name_en: "Fire Alarm Systems", name_te: "ఫైర్ అలారం వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2017/06/06/22/37/siren-2377370_1280.jpg", workType: 'electrical' },
  // Network Cabling — server room structured
  { _id: "cat_network_cabling", name_en: "Network Cabling", name_te: "నెట్‌వర్క్ కేబ్లింగ్", image: "https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1854076_1280.jpg", workType: 'electrical' },
  // Solar — rooftop panel installation
  { _id: "cat_solar_electrical", name_en: "Solar Electrical Systems", name_te: "సౌర విద్యుత్ వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2016/04/15/16/00/solar-energy-1330716_1280.jpg", workType: 'electrical' },
  // Maintenance — electrician testing equipment
  { _id: "cat_electrical_maintenance", name_en: "Electrical Maintenance Services", name_te: "విద్యుత్ నిర్వహణ సేవలు", image: "https://cdn.pixabay.com/photo/2016/11/29/01/36/home-1866375_1280.jpg", workType: 'electrical' },

  // ─── 3. Lighting Solutions ───────────────────────────────────────────────────
  // Decorative — luxury interior decorative light
  { _id: "cat_decorative_lighting", name_en: "Decorative Lighting", name_te: "అలంకార లైటింగ్", image: "https://cdn.pixabay.com/photo/2021/01/05/06/40/lighting-5888726_1280.jpg", workType: 'lighting' },
  // LED Ceiling — strip false ceiling
  { _id: "cat_led_ceiling", name_en: "LED Ceiling Lighting", name_te: "ఎల్‌ఈడీ సీలింగ్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2017/08/01/11/48/woman-2563491_1280.jpg", workType: 'lighting' },
  // Chandeliers — crystal luxury interior
  { _id: "cat_chandeliers", name_en: "Chandeliers", name_te: "ఝూమర్లు (చాండెలియర్స్)", image: "https://cdn.pixabay.com/photo/2019/01/30/08/45/chandelier-3963792_1280.jpg", workType: 'lighting' },
  // Pendant — modern above dining table
  { _id: "cat_pendant_lighting", name_en: "Pendant Lighting", name_te: "పెండెంట్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/08/05/09/27/background-1571938_1280.jpg", workType: 'lighting' },
  // Wall Lighting — mounted decorative interior
  { _id: "cat_wall_lighting", name_en: "Wall Lighting", name_te: "గోడ లైటింగ్", image: "https://cdn.pixabay.com/photo/2021/10/11/17/44/interior-6701461_1280.jpg", workType: 'lighting' },
  // Cove Lighting — LED strip hidden ceiling
  { _id: "cat_cove_lighting", name_en: "Cove Lighting", name_te: "కోవ్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg", workType: 'lighting' },
  // Landscape — garden pathway night
  { _id: "cat_landscape_lighting", name_en: "Landscape Lighting", name_te: "ల్యాండ్‌స్కేప్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg", workType: 'lighting' },
  // Façade — building exterior night lighting
  { _id: "cat_facade_lighting", name_en: "Façade Lighting", name_te: "ఫాసాడ్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/11/23/15/48/architecture-1853095_1280.jpg", workType: 'lighting' },
  // Office Lighting — ceiling professional
  { _id: "cat_office_lighting", name_en: "Office Lighting", name_te: "ఆఫీస్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2015/07/17/22/42/office-849806_1280.jpg", workType: 'lighting' },
  // Retail Lighting — store display accent
  { _id: "cat_retail_lighting", name_en: "Retail Lighting", name_te: "రిటైల్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg", workType: 'lighting' },
  // Street Lighting — urban LED road night
  { _id: "cat_street_lighting", name_en: "Street Lighting", name_te: "వీధి దీపాలు", image: "https://cdn.pixabay.com/photo/2016/11/23/16/57/street-lights-1854120_1280.jpg", workType: 'lighting' },
  // Smart Lighting — app controlled home
  { _id: "cat_smart_lighting_systems", name_en: "Smart Lighting Systems", name_te: "స్మార్ట్ లైటింగ్ వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg", workType: 'lighting' }
];

const mockDesigns = [
  {
    _id: 'design_living_room_royal',
    designId: 'RLIW-1001',
    title_en: 'Royal Wooden Living Room',
    title_te: 'రాజసం ఉట్టిపడే చెక్క లివింగ్ రూమ్',
    category: {
      _id: "cat_living_room",
      name_en: 'Living Room Interiors',
      name_te: 'లివింగ్ రూమ్ ఇంటీరియర్స్',
      workType: 'interior'
    },
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
    ],
    description_en: 'Premium royal design featuring rich teakwood finishes, customized wall panels, ambient spotlighting, and plush seating setups. Perfect for spacious villas and premium apartments.',
    description_te: 'ధర కట్టలేని టేకు కలప ముగింపులు, అనుకూలీకరించిన గోడ ప్యానెల్లు, యాంబియంట్ స్పాట్‌లైట్ మరియు మెత్తటి సోఫా సెటప్‌లతో కూడిన ప్రీమియం రాయల్ డిజైన్. విశాలమైన విల్లాలు మరియు ప్రీమియం అపార్ట్‌మెంట్‌లకు సరిపోతుంది.'
  },
  {
    _id: 'design_kitchen_contemporary',
    designId: 'RLIW-1002',
    title_en: 'Contemporary Charcoal L-Shaped Kitchen',
    title_te: 'సమకాలీన చార్‌కోల్ L-ఆకారపు వంటగది',
    category: {
      _id: "cat_modular_kitchen",
      name_en: 'Modular Kitchen Interiors',
      name_te: 'మోడ్యులర్ కిచెన్ ఇంటీరియర్స్',
      workType: 'interior'
    },
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
    ],
    description_en: 'Modern L-Shaped modular kitchen with custom charcoal-matte soft-close cabinets, pull-out wire baskets, a tall pantry unit, and seamless quartz countertops.',
    description_te: 'అనుకూలీకరించిన చార్‌కోల్-మ్యాట్ సాఫ్ట్-క్లోజ్ క్యాబినెట్‌లు, పుల్-అవుట్ వైర్ బాస్కెట్‌లు, పొడవైన ప్యాంట్రీ యూనిట్ మరియు అతుకులు లేని క్వార్ట్జ్ కౌంటర్‌టాప్‌లతో కూడిన ఆధునిక L-ఆకారపు మాడ్యులర్ వంటగది.'
  },
  {
    _id: 'design_tv_unit_floating',
    designId: 'RLIW-1003',
    title_en: 'Minimalist Floating TV Console',
    title_te: 'మినిమలిస్ట్ ఫ్లోటింగ్ టీవీ కన్సోల్',
    category: {
      _id: "cat_tv_unit",
      name_en: 'TV Unit Designs',
      name_te: 'టీవీ యూనిట్ డిజైన్లు',
      workType: 'interior'
    },
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
    ],
    description_en: 'Floating wood-veneer TV cabinet featuring concealed cable routing slots, integrated warm-white LED backlighting, and display shelves for home decor.',
    description_te: 'దాచిన కేబుల్ రూటింగ్ స్లాట్లు, ఇంటిగ్రేటెడ్ వార్మ్-వైట్ LED బ్యాక్‌లైటింగ్ మరియు డెకర్ ప్రదర్శనల కొరకు అందమైన షెల్ఫ్‌లతో కూడిన తేలియాడే చెక్క-వెనీర్ టీవీ క్యాబినెట్.'
  },
  {
    _id: 'design_bedroom_luxury',
    designId: 'RLIW-1004',
    title_en: 'Luxury Master Bedroom Suite',
    title_te: 'లగ్జరీ మాస్టర్ బెడ్‌రూమ్ సూట్',
    category: {
      _id: "cat_bedroom",
      name_en: 'Bedroom Interiors',
      name_te: 'బెడ్‌రూమ్ ఇంటీరియర్స్',
      workType: 'interior'
    },
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80'
    ],
    description_en: 'Premium master bedroom interior design containing custom floor-to-ceiling cushioned headboard panel, sliding mirror wardrobes, and a matching modern dressing table.',
    description_te: 'అనుకూలీకరించిన నేల నుండి పైకప్పు వరకు కుషన్డ్ హెడ్‌బోర్డ్ ప్యానెల్, స్లైడింగ్ అద్దాల వార్డ్‌రోబ్‌లు మరియు దానికి సరిపోయే ఆధునిక డ్రెస్సింగ్ టేబుల్‌తో కూడిన ప్రీమియం మాస్టర్ బెడ్‌రూమ్ ఇంటీరియర్ డిజైన్.'
  },
  {
    _id: 'design_automation_smart',
    designId: 'RLIW-1005',
    title_en: 'Premium Smart Home Automation',
    title_te: 'ప్రీమియం స్మార్ట్ హోమ్ ఆటోమేషన్',
    category: {
      _id: "cat_automation",
      name_en: 'Smart Home Automation',
      name_te: 'స్మార్ట్ హోమ్ ఆటోమేషన్',
      workType: 'electrical'
    },
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
    description_en: 'State-of-the-art smart home integration featuring centralized touch panels, mobile app controls, scene settings, and automated lighting controls for a modern luxury villa.',
    description_te: 'ఆధునిక లగ్జరీ విల్లా కోసం కేంద్రీకృత టచ్ ప్యానెల్లు, మొబైల్ యాప్ నియంత్రణలు, సీన్ సెట్టింగ్‌లు మరియు ఆటోమేటెడ్ లైటింగ్ నియంత్రణలతో కూడిన అత్యాధునిక స్మార్ట్ హోమ్ ఇంటిగ్రేషన్.'
  },
  {
    _id: 'design_wiring_3phase',
    designId: 'RLIW-1006',
    title_en: 'Complete Residential 3-Phase Wiring',
    title_te: 'నివాస త్రీ-ఫేజ్ వైరింగ్ పనులు',
    category: {
      _id: "cat_wiring",
      name_en: 'Residential Electrical Wiring',
      name_te: 'నివాస విద్యుత్ వైరింగ్',
      workType: 'electrical'
    },
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'],
    description_en: 'Heavy-duty residential wiring featuring secure conduits, fire-resistant copper wiring, neat distribution board dressing, and proper earth protection systems.',
    description_te: 'సురక్షితమైన పైపులు, ఫైర్-రెసిస్టెంట్ కాపర్ వైరింగ్, చక్కని డిస్ట్రిబ్యూషన్ బోర్డ్ డ్రెస్సింగ్ మరియు సరైన ఎర్తింగ్ ప్రొటెక్షన్ సిస్టమ్స్‌తో కూడిన హెవీ-డ్యూటీ నివాస త్రీ-ఫేజ్ వైరింగ్.'
  },
  {
    _id: 'design_chandelier_crystal',
    designId: 'RLIW-1007',
    title_en: 'Luxury Grand Chandelier Installation',
    title_te: 'లగ్జరీ గ్రాండ్ జూమర్ లైటింగ్',
    category: {
      _id: "cat_chandeliers",
      name_en: 'Chandeliers',
      name_te: 'ఝూమర్లు (చాండెలియర్స్)',
      workType: 'lighting'
    },
    images: ['https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=800&q=80'],
    description_en: 'Double-height ceiling crystal chandelier installation with warm dimmable LED lights and secure structural heavy ceiling hooks for a premium living room lobby.',
    description_te: 'ప్రీమియం లివింగ్ రూమ్ లాబీ కోసం వెచ్చని డిమ్మబుల్ LED లైట్లు మరియు సురక్షితమైన నిర్మాణ భారీ సీలింగ్ హుక్స్‌తో డబుల్-హైట్ సీలింగ్ క్రిస్టల్ జూమర్ ఇన్‌స్థాలేషన్.'
  },
  {
    _id: 'design_led_cove',
    designId: 'RLIW-1008',
    title_en: 'Modern Recessed Cove & LED Panel Layout',
    title_te: 'ఆధునిక కోవ్ లైటింగ్ & ఎల్‌ఈడీ ప్యానెల్ లేఅవుట్',
    category: {
      _id: "cat_led_ceiling",
      name_en: 'LED Ceiling Lighting',
      name_te: 'ఎల్‌ఈడీ సీలింగ్ లైటింగ్',
      workType: 'lighting'
    },
    images: ['https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'],
    description_en: 'Ambient false ceiling cove lighting integrated with energy-efficient slim LED panels and adjustable spotlights to create a luxury warm glow in the living hall.',
    description_te: 'లివింగ్ హాల్‌లో విలాసవంతమైన వెచ్చని కాంతిని సృష్టించడానికి ఇంధన-సమర్థవంతమైన స్లిమ్ LED ప్యానెల్లు మరియు సర్దుబాటు చేయగల స్పాట్‌లైట్‌లతో కూడిన ఫాల్స్ సీలింగ్ కోవ్ లైటింగ్.'
  }
];

const mockTeam = [
  {
    _id: 'team_rajamouli_chary',
    name: 'Rajamouli Chary',
    role: 'Founder & Head Carpentry Craftsman',
    role_te: 'స్థాపకుడు & ప్రధాన వడ్రంగి హస్తకళాకారుడు',
    exp: '25+ Years',
    image: '/uploads/owner.jpg'
  }
];
const mockInquiries = [];

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to automatically append JWT Token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('rliw_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor — handle 401 Unauthorized (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired — clear auth state and redirect to login
      const isAdminRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');
      if (isAdminRoute && window.location.pathname !== '/admin/login') {
        localStorage.removeItem('rliw_admin_token');
        localStorage.removeItem('rliw_admin_user');
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor to intercept network failures and serve mock data in demo mode
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If backend is offline, return mock data for GET requests
    if (!error.response && (error.code === 'ERR_NETWORK' || error.message.includes('Network Error'))) {
      console.warn('Backend server offline. Falling back to local frontend demo data.');
      
      const config = error.config;
      const url = config.url;
      const method = config.method;

      if (method === 'get') {
        if (url.includes('/categories')) {
          return { data: mockCategories };
        }
        
        if (url.includes('/team')) {
          return { data: mockTeam };
        }
        
        // Single design details (by designId or mongo ObjectId)
        if (url.includes('/designs/')) {
          const parts = url.split('/designs/');
          const id = parts[1];
          const design = mockDesigns.find(d => d.designId === id || d._id === id);
          if (design) {
            return { data: design };
          }
        }
        
        // List designs
        if (url.includes('/designs')) {
          let filtered = [...mockDesigns];
          
          // Apply category filter if query params exist in URL config
          if (config.params && config.params.category) {
            filtered = filtered.filter(d => d.category._id === config.params.category);
          }
          
          // Apply search filter
          if (config.params && config.params.search) {
            const query = config.params.search.toLowerCase();
            filtered = filtered.filter(d => 
              d.title_en.toLowerCase().includes(query) || 
              d.title_te.includes(query) ||
              d.designId.toLowerCase().includes(query)
            );
          }
          
          return { data: filtered };
        }
      } else if (method === 'post' && url.includes('/admin/login')) {
        // Allow mock admin login with credentials
        const data = JSON.parse(config.data);
        if (data.username === 'Rajamoulichary' && data.password === 'Rajamoulichary@779') {
          return {
            data: {
              token: 'mock_jwt_token_for_offline_demo',
              admin: { id: 'mock_admin_id', username: 'Rajamoulichary', image: '/uploads/admin-avatar.png' }
            }
          };
        }
      } else if (method === 'post' && url.includes('/admin/refresh')) {
        return {
          data: {
            token: 'mock_jwt_token_for_offline_demo',
            admin: { id: 'mock_admin_id', username: 'Rajamoulichary', image: '/uploads/admin-avatar.png' }
          }
        };
      } else if (method === 'post' && url.includes('/visitors/log')) {
        const data = JSON.parse(config.data);
        let visitors = JSON.parse(sessionStorage.getItem('mock_visitors') || '[]');
        const now = new Date();
        let found = visitors.find(v => v.ip === '127.0.0.1' && (now - new Date(v.lastVisitedAt) < 24 * 60 * 60 * 1000));
        
        if (found) {
          found.pageViews += 1;
          found.pagesVisited.push({ path: data.path, timestamp: now.toISOString() });
          found.lastVisitedAt = now.toISOString();
        } else {
          visitors.push({
            _id: 'visitor_' + Math.random().toString(36).substr(2, 9),
            ip: '127.0.0.1',
            userAgent: navigator.userAgent,
            pagesVisited: [{ path: data.path, timestamp: now.toISOString() }],
            pageViews: 1,
            referrer: data.referrer || 'Direct Link',
            lastVisitedAt: now.toISOString(),
            createdAt: now.toISOString()
          });
        }
        sessionStorage.setItem('mock_visitors', JSON.stringify(visitors));
        return { data: { success: true } };
      } else if (method === 'get' && url.includes('/visitors')) {
        let visitors = JSON.parse(sessionStorage.getItem('mock_visitors') || '[]');
        if (visitors.length === 0) {
          visitors = [
            {
              _id: 'vis_1',
              ip: '192.168.1.45',
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              pagesVisited: [
                { path: '/', timestamp: new Date(Date.now() - 3600000).toISOString() },
                { path: '/categories', timestamp: new Date(Date.now() - 3000000).toISOString() },
                { path: '/designs', timestamp: new Date(Date.now() - 2400000).toISOString() }
              ],
              pageViews: 3,
              referrer: 'https://google.com',
              lastVisitedAt: new Date(Date.now() - 2400000).toISOString(),
              createdAt: new Date(Date.now() - 3600000).toISOString()
            },
            {
              _id: 'vis_2',
              ip: '182.72.101.12',
              userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
              pagesVisited: [
                { path: '/', timestamp: new Date(Date.now() - 10000000).toISOString() },
                { path: '/contact', timestamp: new Date(Date.now() - 9500000).toISOString() }
              ],
              pageViews: 2,
              referrer: 'https://instagram.com',
              lastVisitedAt: new Date(Date.now() - 9500000).toISOString(),
              createdAt: new Date(Date.now() - 10000000).toISOString()
            }
          ];
          sessionStorage.setItem('mock_visitors', JSON.stringify(visitors));
        }

        let totalPageViews = 0;
        const pageCounts = {};
        visitors.forEach(v => {
          totalPageViews += v.pageViews;
          v.pagesVisited.forEach(p => {
            pageCounts[p.path] = (pageCounts[p.path] || 0) + 1;
          });
        });

        const popularPages = Object.entries(pageCounts)
          .map(([path, count]) => ({ path, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);

        const stats = {
          totalPageViews,
          uniqueVisitors: visitors.length,
          averageViewsPerSession: visitors.length > 0 ? parseFloat((totalPageViews / visitors.length).toFixed(1)) : 0,
          popularPages
        };

        return { data: { visitors, stats } };
      } else if (method === 'post' && url.includes('/designs/bulk')) {
        const categoryOverride = config.data.get('categoryOverride');
        const subcategoryOverride = config.data.get('subcategoryOverride') || '';
        const titleOverride = config.data.get('titleOverride') || '';
        
        const files = config.data.getAll('images');
        const createdDesigns = [];
        
        files.forEach((file, idx) => {
          const index = mockDesigns.length + 1;
          const detectedCategory = mockCategories.find(c => c._id === categoryOverride) || mockCategories[idx % mockCategories.length];
          const subcat = subcategoryOverride || (detectedCategory.name_en.replace(' Interiors', '').replace(' Designs', '').replace(' Lighting', '') + ' Unit');
          const title = titleOverride 
            ? `${titleOverride} - ${subcat}` 
            : `Modern ${subcat} Setup`;
            
          const mockNewDesign = {
            _id: `design_${Date.now()}_${idx}`,
            designId: `RLIW-${1000 + index}`,
            title_en: title,
            title_te: `ఆధునిక ${subcat} సెటప్`,
            category: detectedCategory,
            subcategory: subcat,
            images: [
              "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
            ],
            features: detectedCategory.workType === 'electrical' 
              ? ["Safe Wiring", "Load Protection", "Energy Efficient"]
              : detectedCategory.workType === 'lighting'
              ? ["LED Lights", "Ambient Lighting", "Smart Control"]
              : ["False Ceiling", "Wooden Paneling", "Modular Storage"],
            description_en: `${subcat} premium layout setup.`,
            description_te: `${subcat} ప్రీమియం లేఅవుట్ సెటప్.`,
            workType: detectedCategory.workType || 'interior',
            createdAt: new Date().toISOString()
          };
          mockDesigns.push(mockNewDesign);
          createdDesigns.push(mockNewDesign);
        });
        return { data: createdDesigns };
      } else if (method === 'post' && url.includes('/designs')) {
        // Simulate creating designs in offline mode
        const mockNewDesign = {
          _id: `design_${Date.now()}`,
          designId: `RLIW-${1000 + mockDesigns.length + 1}`,
          title_en: config.data.get('title_en'),
          title_te: config.data.get('title_te'),
          category: mockCategories.find(c => c._id === config.data.get('category')) || mockCategories[0],
          images: [
            "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
          ],
          description_en: config.data.get('description_en') || '',
          description_te: config.data.get('description_te') || '',
          createdAt: new Date().toISOString()
        };
        mockDesigns.push(mockNewDesign);
        return { data: mockNewDesign };
      } else if (method === 'post' && url.includes('/categories')) {
        // Simulate creating categories in offline mode
        const mockNewCategory = {
          _id: `cat_${Date.now()}`,
          name_en: config.data.get('name_en'),
          name_te: config.data.get('name_te'),
          image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
        };
        mockCategories.push(mockNewCategory);
        return { data: mockNewCategory };
      } else if (method === 'post' && url.includes('/team')) {
        // Simulate creating team member in offline mode
        const mockNewMember = {
          _id: `team_${Date.now()}`,
          name: config.data.get('name'),
          role: config.data.get('role'),
          role_te: config.data.get('role_te') || '',
          exp: config.data.get('exp'),
          image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80"
        };
        mockTeam.push(mockNewMember);
        return { data: mockNewMember };
      } else if (method === 'delete' && url.includes('/team/')) {
        const parts = url.split('/team/');
        const id = parts[1];
        const index = mockTeam.findIndex(m => m._id === id);
        if (index !== -1) {
          mockTeam.splice(index, 1);
        }
        return { data: { message: 'Team member removed successfully' } };
      } else if (method === 'delete' && url.includes('/designs/')) {
        const parts = url.split('/designs/');
        const id = parts[1];
        const index = mockDesigns.findIndex(d => d._id === id || d.designId === id);
        if (index !== -1) {
          mockDesigns.splice(index, 1);
        }
        return { data: { message: 'Design removed successfully' } };
      } else if (method === 'delete' && url.includes('/categories/')) {
        const parts = url.split('/categories/');
        const id = parts[1];
        const index = mockCategories.findIndex(c => c._id === id);
        if (index !== -1) {
          mockCategories.splice(index, 1);
        }
        return { data: { message: 'Category removed successfully' } };
      } else if (method === 'put' && url.includes('/categories/')) {
        const parts = url.split('/categories/');
        const id = parts[1];
        const index = mockCategories.findIndex(c => c._id === id);
        if (index !== -1) {
          const name_en = config.data.get('name_en');
          const name_te = config.data.get('name_te');
          const imageFile = config.data.get('image');
          if (name_en) mockCategories[index].name_en = name_en;
          if (name_te) mockCategories[index].name_te = name_te;
          if (imageFile) {
            mockCategories[index].image = "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80";
          }
          return { data: mockCategories[index] };
        }
        return { status: 404, data: { message: 'Category not found' } };
      } else if (method === 'put' && url.includes('/team/')) {
        const parts = url.split('/team/');
        const id = parts[1];
        const index = mockTeam.findIndex(t => t._id === id);
        if (index !== -1) {
          const name = config.data.get('name');
          const role = config.data.get('role');
          const role_te = config.data.get('role_te');
          const exp = config.data.get('exp');
          const imageFile = config.data.get('image');
          if (name) mockTeam[index].name = name;
          if (role) mockTeam[index].role = role;
          if (role_te) mockTeam[index].role_te = role_te;
          if (exp) mockTeam[index].exp = exp;
          if (imageFile) {
            mockTeam[index].image = "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80";
          }
          return { data: mockTeam[index] };
        }
        return { status: 404, data: { message: 'Team member not found' } };
      } else if (method === 'post' && url.includes('/inquiries')) {
        const payload = JSON.parse(config.data);
        const newInquiry = {
          _id: `inq_${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          service: payload.service,
          message: payload.message,
          replied: false,
          createdAt: new Date().toISOString()
        };
        mockInquiries.push(newInquiry);
        return { data: newInquiry };
      } else if (method === 'get' && url.includes('/inquiries')) {
        return { data: mockInquiries };
      } else if (method === 'put' && url.includes('/inquiries/')) {
        const parts = url.split('/inquiries/');
        const id = parts[1];
        const index = mockInquiries.findIndex(i => i._id === id);
        if (index !== -1) {
          mockInquiries[index].replied = true;
          return { data: mockInquiries[index] };
        }
        return { status: 404, data: { message: 'Inquiry not found' } };
      } else if (method === 'delete' && url.includes('/inquiries/')) {
        const parts = url.split('/inquiries/');
        const id = parts[1];
        const index = mockInquiries.findIndex(i => i._id === id);
        if (index !== -1) {
          mockInquiries.splice(index, 1);
        }
        return { data: { message: 'Inquiry removed successfully' } };
      }
    }
    return Promise.reject(error);
  }
);


export const authService = {
  login: async (username, password) => {
    const response = await api.post('/admin/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('rliw_admin_token', response.data.token);
      localStorage.setItem('rliw_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },
  refreshToken: async () => {
    const response = await api.post('/admin/refresh');
    if (response.data.token) {
      localStorage.setItem('rliw_admin_token', response.data.token);
      localStorage.setItem('rliw_admin_user', JSON.stringify(response.data.admin));
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('rliw_admin_token');
    localStorage.removeItem('rliw_admin_user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('rliw_admin_token');
  }
};

export const categoryService = {
  getAll: async () => {
    try {
      const response = await api.get('/categories');
      return Array.isArray(response.data) ? response.data : [];
    } catch (e) {
      console.error('Error fetching categories:', e);
      return [];
    }
  },
  create: async (formData) => {
    const response = await api.post('/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const designService = {
  getAll: async (filters = {}) => {
    try {
      const response = await api.get('/designs', { params: filters });
      return Array.isArray(response.data) ? response.data : [];
    } catch (e) {
      console.error('Error fetching designs:', e);
      return [];
    }
  },
  getById: async (id) => {
    try {
      const response = await api.get(`/designs/${id}`);
      return response.data;
    } catch (e) {
      if (e.response?.status === 404) return null;
      console.error('Error fetching design:', e);
      return null;
    }
  },
  create: async (formData) => {
    const response = await api.post('/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  bulkCreate: async (formData, onUploadProgress) => {
    const response = await api.post('/designs/bulk', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/designs/${id}`);
    return response.data;
  },
};

export const teamService = {
  getAll: async () => {
    try {
      const response = await api.get('/team');
      return Array.isArray(response.data) ? response.data : [];
    } catch (e) {
      console.error('Error fetching team:', e);
      return [];
    }
  },
  create: async (formData) => {
    const response = await api.post('/team', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/team/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

export const inquiryService = {
  getAll: async () => {
    try {
      const response = await api.get('/inquiries');
      return Array.isArray(response.data) ? response.data : [];
    } catch (e) {
      console.error('Error fetching inquiries:', e);
      return [];
    }
  },
  create: async (payload) => {
    const response = await api.post('/inquiries', payload);
    return response.data;
  },
  markReplied: async (id) => {
    const response = await api.put(`/inquiries/${id}`);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inquiries/${id}`);
    return response.data;
  },
};

export const visitorService = {
  logVisit: async (path, referrer) => {
    const response = await api.post('/visitors/log', { path, referrer });
    return response.data;
  },
  getVisitors: async () => {
    const response = await api.get('/visitors');
    return response.data;
  }
};

export default api;
