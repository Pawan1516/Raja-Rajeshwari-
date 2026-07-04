require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Category = require('./models/Category');
const Design = require('./models/Design');

const categoriesData = [
  {
    name_en: 'Living Room Design',
    name_te: 'లివింగ్ రూమ్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Modular Kitchen',
    name_te: 'మోడ్యులర్ కిచెన్',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Bedroom Interior',
    name_te: 'బెడ్‌రూమ్ ఇంటీరియర్',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Dining Room Design',
    name_te: 'డైనింగ్ రూమ్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'TV Unit Design',
    name_te: 'టీవీ యూనిట్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Kids Room Interior',
    name_te: 'కిడ్స్ రూమ్ ఇంటీరియర్',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Wardrobe Design',
    name_te: 'వార్డ్‌రోబ్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'False Ceiling Design',
    name_te: 'ఫాల్స్ సీలింగ్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Lighting Design',
    name_te: 'లైటింగ్ డిజైన్',
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name_en: 'Wall Decor & Paneling',
    name_te: 'వాల్ డెకర్ & ప్యానెలింగ్',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  }
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
    const livingRoomId = categories.find(c => c.name_en === 'Living Room Design')._id;
    const kitchenId = categories.find(c => c.name_en === 'Modular Kitchen')._id;
    const tvUnitId = categories.find(c => c.name_en === 'TV Unit Design')._id;
    const bedroomId = categories.find(c => c.name_en === 'Bedroom Interior')._id;

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
