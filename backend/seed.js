require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Design = require('./models/Design');

const categoriesData = [
  // ─── 1. Interior Works ───────────────────────────────────────────────────────
  { name_en: "Living Room Interiors", name_te: "లివింగ్ రూమ్ ఇంటీరియర్స్", image: "/categories/living_room.jpg", workType: 'interior' },
  { name_en: "Modular Kitchen Interiors", name_te: "మోడ్యులర్ కిచెన్ ఇంటీరియర్స్", image: "/categories/modular_kitchen.jpg", workType: 'interior' },
  { name_en: "Bedroom Interiors", name_te: "బెడ్‌రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/03/28/12/10/chairs-2181979_1280.jpg", workType: 'interior' },
  { name_en: "Dining Room Interiors", name_te: "డైనింగ్ రూమ్ ఇంటీరియర్స్", image: "/categories/dining_room.jpg", workType: 'interior' },
  { name_en: "False Ceiling Designs", name_te: "ఫాల్స్ సీలింగ్ డిజైన్లు", image: "/categories/false_ceiling.jpg", workType: 'interior' },
  { name_en: "TV Unit Designs", name_te: "టీవీ యూనిట్ డిజైన్లు", image: "/categories/tv_unit.jpg", workType: 'interior' },
  { name_en: "Wardrobe Designs", name_te: "వార్డ్‌రోబ్ డిజైన్లు", image: "/categories/wardrobe.jpg", workType: 'interior' },
  { name_en: "Office Interiors", name_te: "ఆఫీస్ ఇంటీరియర్స్", image: "/categories/home_office.jpg", workType: 'interior' },
  { name_en: "Commercial Interiors", name_te: "కమర్షియల్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2017/08/07/09/03/coffee-2600765_1280.jpg", workType: 'interior' },
  { name_en: "Restaurant & Café Interiors", name_te: "రెస్టారెంట్ & కేఫ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2016/11/29/09/16/architecture-1868667_1280.jpg", workType: 'interior' },
  { name_en: "Pooja Room Interiors", name_te: "పూజా రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2020/04/09/09/07/hinduism-5020896_1280.jpg", workType: 'interior' },
  { name_en: "Bathroom Interiors", name_te: "బాత్‌రూమ్ ఇంటీరియర్స్", image: "https://cdn.pixabay.com/photo/2020/10/22/15/42/bathroom-5675254_1280.jpg", workType: 'interior' },

  // ─── 2. Electrical Works ─────────────────────────────────────────────────────
  { name_en: "Residential Electrical Wiring", name_te: "నివాస విద్యుత్ వైరింగ్", image: "https://cdn.pixabay.com/photo/2016/11/29/01/36/home-1866375_1280.jpg", workType: 'electrical' },
  { name_en: "Commercial Electrical Installation", name_te: "వాణిజ్య విద్యుత్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2020/02/07/10/01/electricity-4826344_1280.jpg", workType: 'electrical' },
  { name_en: "Industrial Electrical Works", name_te: "పారిశ్రామిక విద్యుత్ పనులు", image: "https://cdn.pixabay.com/photo/2015/09/18/12/30/electric-946073_1280.jpg", workType: 'electrical' },
  { name_en: "Electrical Panel Board Installation", name_te: "ఎలక్ట్రికల్ ప్యానెల్ బోర్డు సంస్థాపన", image: "https://cdn.pixabay.com/photo/2016/02/19/10/58/electric-1209691_1280.jpg", workType: 'electrical' },
  { name_en: "Generator Installation", name_te: "జనరేటర్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2021/01/05/10/25/generator-5890747_1280.jpg", workType: 'electrical' },
  { name_en: "Inverter Installation", name_te: "ఇన్వర్టర్ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2019/02/19/19/45/power-4007191_1280.jpg", workType: 'electrical' },
  { name_en: "Smart Home Automation", name_te: "స్మార్ట్ హోమ్ ఆటోమేషన్", image: "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg", workType: 'electrical' },
  { name_en: "CCTV Installation", name_te: "సీసీటీవీ సంస్థాపన", image: "https://cdn.pixabay.com/photo/2018/01/26/09/56/camera-3108450_1280.jpg", workType: 'electrical' },
  { name_en: "Fire Alarm Systems", name_te: "ఫైర్ అలారం వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2017/06/06/22/37/siren-2377370_1280.jpg", workType: 'electrical' },
  { name_en: "Network Cabling", name_te: "నెట్‌వర్క్ కేబ్లింగ్", image: "https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1854076_1280.jpg", workType: 'electrical' },
  { name_en: "Solar Electrical Systems", name_te: "సౌర విద్యుత్ వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2016/04/15/16/00/solar-energy-1330716_1280.jpg", workType: 'electrical' },
  { name_en: "Electrical Maintenance Services", name_te: "విద్యుత్ నిర్వహణ సేవలు", image: "https://cdn.pixabay.com/photo/2016/11/29/01/36/home-1866375_1280.jpg", workType: 'electrical' },

  // ─── 3. Lighting Solutions ───────────────────────────────────────────────────
  { name_en: "Decorative Lighting", name_te: "అలంకార లైటింగ్", image: "https://cdn.pixabay.com/photo/2021/01/05/06/40/lighting-5888726_1280.jpg", workType: 'lighting' },
  { name_en: "LED Ceiling Lighting", name_te: "ఎల్‌ఈడీ సీలింగ్ లైటింగ్", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Chandeliers", name_te: "ఝూమర్లు (చాండెలియర్స్)", image: "https://cdn.pixabay.com/photo/2019/01/30/08/45/chandelier-3963792_1280.jpg", workType: 'lighting' },
  { name_en: "Pendant Lighting", name_te: "పెండెంట్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/08/05/09/27/background-1571938_1280.jpg", workType: 'lighting' },
  { name_en: "Wall Lighting", name_te: "గోడ లైటింగ్", image: "https://cdn.pixabay.com/photo/2021/10/11/17/44/interior-6701461_1280.jpg", workType: 'lighting' },
  { name_en: "Cove Lighting", name_te: "కోవ్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_1280.jpg", workType: 'lighting' },
  { name_en: "Landscape Lighting", name_te: "ల్యాండ్‌స్కేప్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg", workType: 'lighting' },
  { name_en: "Façade Lighting", name_te: "ఫాసాడ్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/11/23/15/48/architecture-1853095_1280.jpg", workType: 'lighting' },
  { name_en: "Office Lighting", name_te: "ఆఫీస్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2015/07/17/22/42/office-849806_1280.jpg", workType: 'lighting' },
  { name_en: "Retail Lighting", name_te: "రిటైల్ లైటింగ్", image: "https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg", workType: 'lighting' },
  { name_en: "Street Lighting", name_te: "వీధి దీపాలు", image: "https://cdn.pixabay.com/photo/2016/11/23/16/57/street-lights-1854120_1280.jpg", workType: 'lighting' },
  { name_en: "Smart Lighting Systems", name_te: "స్మార్ట్ లైటింగ్ వ్యవస్థలు", image: "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg", workType: 'lighting' }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rliw', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await Admin.deleteMany();
    await Category.deleteMany();
    await Design.deleteMany();
    console.log('Cleared existing data (Admins, Categories, Designs).');

    // Create Admin
    const adminUser = new Admin({
      username: 'Rajamoulichary',
      password: 'Rajamoulichary@779'
    });
    await adminUser.save();
    console.log('Created Admin account successfully. (User: Rajamoulichary, Pass: Rajamoulichary@779)');

    // Create Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`Inserted ${categories.length} Design Categories.`);

    // Find category IDs to assign to sample designs
    const livingRoomId = categories.find(c => c.name_en === 'Living Room Interiors')._id;
    const kitchenId = categories.find(c => c.name_en === 'Modular Kitchen Interiors')._id;
    const tvUnitId = categories.find(c => c.name_en === 'TV Unit Designs')._id;
    const bedroomId = categories.find(c => c.name_en === 'Bedroom Interiors')._id;

    // Create Sample Designs
    const sampleDesigns = [
      {
        title_en: 'Royal Wooden Living Room',
        title_te: 'రాజసం ఉట్టిపడే చెక్క లివింగ్ రూమ్',
        category: livingRoomId,
        images: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Premium royal design featuring rich teakwood finishes, customized wall panels, ambient spotlighting, and plush seating setups. Perfect for spacious villas and premium apartments.',
        description_te: 'ధర కట్టలేని టేకు కలప ముగింపులు, అనుకూలీకరించిన గోడ ప్యానెల్లు, యాంబియంట్ స్పాట్‌లైట్ మరియు మెత్తటి సోఫా సెటప్‌లతో కూడిన ప్రీమియం రాయల్ డిజైన్. విశాలమైన విల్లాలు మరియు ప్రీమియం అపార్ట్‌మెంట్‌లకు సరిపోతుంది.'
      },
      {
        title_en: 'Contemporary Charcoal L-Shaped Kitchen',
        title_te: 'సమకాలీన చార్‌కోల్ L-ఆకారపు వంటగది',
        category: kitchenId,
        images: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Modern L-Shaped modular kitchen with custom charcoal-matte soft-close cabinets, pull-out wire baskets, a tall pantry unit, and seamless quartz countertops.',
        description_te: 'అనుకూలీకరించిన చార్‌కోల్-మ్యాట్ సాఫ్ట్-క్లోజ్ క్యాబినెట్‌లు, పుల్-అవుట్ వైర్ బాస్కెట్‌లు, పొడవైన ప్యాంట్రీ యూనిట్ మరియు అతుకులు లేని క్వార్ట్జ్ కౌంటర్‌టాప్‌లతో కూడిన ఆధునిక L-ఆకారపు మాడ్యులర్ వంటగది.'
      },
      {
        title_en: 'Minimalist Floating TV Console',
        title_te: 'మినిమలిస్ట్ ఫ్లోటింగ్ టీవీ కన్సోల్',
        category: tvUnitId,
        images: [
          'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Floating wood-veneer TV cabinet featuring concealed cable routing slots, integrated warm-white LED backlighting, and display shelves for home decor.',
        description_te: 'దాచిన కేబుల్ రూటింగ్ స్లాట్లు, ఇంటిగ్రేటెడ్ వార్మ్-వైట్ LED బ్యాక్‌లైటింగ్ మరియు డెకర్ ప్రదర్శనల కొరకు అందమైన షెల్ఫ్‌లతో కూడిన తేలియాడే చెక్క-వెనీర్ టీవీ క్యాబినెట్.'
      },
      {
        title_en: 'Luxury Master Bedroom Suite',
        title_te: 'లగ్జరీ మాస్టర్ బెడ్‌రూమ్ సూట్',
        category: bedroomId,
        images: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Premium master bedroom interior design containing custom floor-to-ceiling cushioned headboard panel, sliding mirror wardrobes, and a matching modern dressing table.',
        description_te: 'అనుకూలీకరించిన నేల నుండి పైకప్పు వరకు కుషన్డ్ హెడ్‌బోర్డ్ ప్యానెల్, స్లైడింగ్ అద్దాల వార్డ్‌రోబ్‌లు మరియు దానికి సరిపోయే ఆధునిక డ్రెస్సింగ్ టేబుల్‌తో కూడిన ప్రీమియం మాస్టర్ బెడ్‌రూమ్ ఇంటీరియర్ డిజైన్.'
      }
    ];

    // Seed Designs sequentially to ensure pre-save triggers compute sequential IDs properly
    for (const d of sampleDesigns) {
      const newDesign = new Design(d);
      await newDesign.save();
      console.log(`Saved sample design: ${newDesign.title_en} (${newDesign.designId})`);
    }

    console.log('Database Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDB();
