import axios from 'axios';

import { API_URL } from '../constants';

const API_BASE_URL = API_URL;

// Mock Data for Offline Demo Mode
const mockCategories = [
  // 1. Interior Works
  { _id: "cat_living_room", name_en: "Living Room Interiors", name_te: "లివింగ్ రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_modular_kitchen", name_en: "Modular Kitchen Interiors", name_te: "మోడ్యులర్ కిచెన్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_bedroom", name_en: "Bedroom Interiors", name_te: "బెడ్‌రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_dining_room", name_en: "Dining Room Interiors", name_te: "డైనింగ్ రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_false_ceiling", name_en: "False Ceiling Designs", name_te: "ఫాల్స్ సీలింగ్ డిజైన్లు", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_tv_unit", name_en: "TV Unit Designs", name_te: "టీవీ యూనిట్ డిజైన్లు", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_wardrobe", name_en: "Wardrobe Designs", name_te: "వార్డ్‌రోబ్ డిజైన్లు", image: "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_office_interior", name_en: "Office Interiors", name_te: "ఆఫీస్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_commercial_interior", name_en: "Commercial Interiors", name_te: "కమర్షియల్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_restaurant_cafe", name_en: "Restaurant & Café Interiors", name_te: "రెస్టారెంట్ & కేఫ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_pooja_room", name_en: "Pooja Room Interiors", name_te: "పూజా రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { _id: "cat_bathroom", name_en: "Bathroom Interiors", name_te: "బాత్‌రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1620626011160-9928f1b2b64a?auto=format&fit=crop&w=800&q=80", workType: 'interior' },

  // 2. Electrical Works
  { _id: "cat_wiring", name_en: "Residential Electrical Wiring", name_te: "నివాస విద్యుత్ వైరింగ్", image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_commercial_electrical", name_en: "Commercial Electrical Installation", name_te: "వాణిజ్య విద్యుత్ సంస్థాపన", image: "https://images.unsplash.com/photo-1558224494-ef8b21754f26?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_industrial_electrical", name_en: "Industrial Electrical Works", name_te: "పారిశ్రామిక విద్యుత్ పనులు", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_panel_board", name_en: "Electrical Panel Board Installation", name_te: "ఎలక్ట్రికల్ ప్యానెల్ బోర్డు సంస్థాపన", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_generator", name_en: "Generator Installation", name_te: "జనరేటర్ సంస్థాపన", image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_inverter", name_en: "Inverter Installation", name_te: "ఇన్వర్టర్ సంస్థాపన", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_automation", name_en: "Smart Home Automation", name_te: "స్మార్ట్ హోమ్ ఆటోమేషన్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_cctv", name_en: "CCTV Installation", name_te: "సీసీటీవీ సంస్థాపన", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_fire_alarm", name_en: "Fire Alarm Systems", name_te: "ఫైర్ అలారం వ్యవస్థలు", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_network_cabling", name_en: "Network Cabling", name_te: "నెట్‌వర్క్ కేబ్లింగ్", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_solar_electrical", name_en: "Solar Electrical Systems", name_te: "సౌర విద్యుత్ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { _id: "cat_electrical_maintenance", name_en: "Electrical Maintenance Services", name_te: "విద్యుత్ నిర్వహణ సేవలు", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3793?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },

  // 3. Lighting Solutions
  { _id: "cat_decorative_lighting", name_en: "Decorative Lighting", name_te: "అలంకార లైటింగ్", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_led_ceiling", name_en: "LED Ceiling Lighting", name_te: "ఎల్‌ఈడీ సీలింగ్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_chandeliers", name_en: "Chandeliers", name_te: "ఝూమర్లు (చాండెలియర్స్)", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_pendant_lighting", name_en: "Pendant Lighting", name_te: "పెండెంట్ లైటింగ్", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_wall_lighting", name_en: "Wall Lighting", name_te: "గోడ లైటింగ్", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_cove_lighting", name_en: "Cove Lighting", name_te: "కోవ్ లైటింగ్", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_landscape_lighting", name_en: "Landscape Lighting", name_te: "ల్యాండ్‌స్కేప్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_facade_lighting", name_en: "Façade Lighting", name_te: "ఫాసాడ్ లైటింగ్", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_office_lighting", name_en: "Office Lighting", name_te: "ఆఫీస్ లైటింగ్", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_retail_lighting", name_en: "Retail Lighting", name_te: "రిటైల్ లైటింగ్", image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_street_lighting", name_en: "Street Lighting", name_te: "వీధి దీపాలు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { _id: "cat_smart_lighting_systems", name_en: "Smart Lighting Systems", name_te: "స్మార్ట్ లైటింగ్ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", workType: 'lighting' }
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
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=400&q=80'
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
              admin: { id: 'mock_admin_id', username: 'Rajamoulichary' }
            }
          };
        }
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

export default api;
