const mongoose = require('mongoose');

const categoriesData = [
  // 1. Interior Works
  { name_en: "Living Room Interiors", name_te: "లివింగ్ రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Modular Kitchen Interiors", name_te: "మోడ్యులర్ కిచెన్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Bedroom Interiors", name_te: "బెడ్‌రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Dining Room Interiors", name_te: "డైనింగ్ రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "False Ceiling Designs", name_te: "ఫాల్స్ సీలింగ్ డిజైన్లు", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "TV Unit Designs", name_te: "టీవీ యూనిట్ డిజైన్లు", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Wardrobe Designs", name_te: "వార్డ్‌రోబ్ డిజైన్లు", image: "https://images.unsplash.com/photo-1558882224-cca16673360?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Office Interiors", name_te: "ఆఫీస్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Commercial Interiors", name_te: "కమర్షియల్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Restaurant & Café Interiors", name_te: "రెస్టారెంట్ & కేఫ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Pooja Room Interiors", name_te: "పూజా రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80", workType: 'interior' },
  { name_en: "Bathroom Interiors", name_te: "బాత్‌రూమ్ ఇంటీరియర్స్", image: "https://images.unsplash.com/photo-1620626011160-9928f1b2b64a?auto=format&fit=crop&w=800&q=80", workType: 'interior' },

  // 2. Electrical Works
  { name_en: "Residential Electrical Wiring", name_te: "నివాస విద్యుత్ వైరింగ్", image: "https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Commercial Electrical Installation", name_te: "వాణిజ్య విద్యుత్ సంస్థాపన", image: "https://images.unsplash.com/photo-1558224494-ef8b21754f26?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Industrial Electrical Works", name_te: "పారిశ్రామిక విద్యుత్ పనులు", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Electrical Panel Board Installation", name_te: "ఎలక్ట్రికల్ ప్యానెల్ బోర్డు సంస్థాపన", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Generator Installation", name_te: "జనరేటర్ సంస్థాపన", image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Inverter Installation", name_te: "ఇన్వర్టర్ సంస్థాపన", image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Smart Home Automation", name_te: "స్మార్ట్ హోమ్ ఆటోమేషన్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "CCTV Installation", name_te: "సీసీటీవీ సంస్థాపన", image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Fire Alarm Systems", name_te: "ఫైర్ అలారం వ్యవస్థలు", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Network Cabling", name_te: "నెట్‌వర్క్ కేబ్లింగ్", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Solar Electrical Systems", name_te: "సౌర విద్యుత్ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },
  { name_en: "Electrical Maintenance Services", name_te: "విద్యుత్ నిర్వహణ సేవలు", image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3793?auto=format&fit=crop&w=800&q=80", workType: 'electrical' },

  // 3. Lighting Solutions
  { name_en: "Decorative Lighting", name_te: "అలంకార లైటింగ్", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "LED Ceiling Lighting", name_te: "ఎల్‌ఈడీ సీలింగ్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Chandeliers", name_te: "ఝూమర్లు (చాండెలియర్స్)", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Pendant Lighting", name_te: "పెండెంట్ లైటింగ్", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Wall Lighting", name_te: "గోడ లైటింగ్", image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Cove Lighting", name_te: "కోవ్ లైటింగ్", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Landscape Lighting", name_te: "ల్యాండ్‌స్కేప్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Façade Lighting", name_te: "ఫాసాడ్ లైటింగ్", image: "https://images.unsplash.com/photo-1563207153-f403bf289096?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Office Lighting", name_te: "ఆఫీస్ లైటింగ్", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Retail Lighting", name_te: "రిటైల్ లైటింగ్", image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Street Lighting", name_te: "వీధి దీపాలు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=800&q=80", workType: 'lighting' },
  { name_en: "Smart Lighting Systems", name_te: "స్మార్ట్ లైటింగ్ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", workType: 'lighting' }
];

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rliw', {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeed();
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Attempting fallback to Mock In-Memory MongoDB Database...');
    try {
      const mockMongoose = require('./mockMongoose');
      require.cache[require.resolve('mongoose')].exports = mockMongoose;
      const conn = await mockMongoose.connect();
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      await autoSeed();
    } catch (fallbackError) {
      console.error(`Fallback to Mock MongoDB failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

const autoSeed = async () => {
  try {
    const Admin = require('../models/Admin');
    const Category = require('../models/Category');
    const TeamMember = require('../models/TeamMember');

    const defaultUsername = process.env.DEFAULT_ADMIN_USERNAME || 'Rajamoulichary';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Rajamoulichary@779';

    const adminExists = await Admin.findOne({ username: defaultUsername });
    if (!adminExists) {
      console.log(`Seeding admin user account for ${defaultUsername}...`);
      const adminUser = new Admin({
        username: defaultUsername,
        password: defaultPassword,
        image: '/uploads/admin-avatar.png'
      });
      await adminUser.save();
      console.log(`Created Admin account successfully. (User: ${defaultUsername})`);
    } else {
      console.log(`Admin account ${defaultUsername} already exists.`);
    }

    // Seed deduplicated categories list
    console.log('Verifying categories...');
    let insertedCount = 0;
    let updatedCount = 0;
    const seen = new Set();
    for (const cat of categoriesData) {
      if (!seen.has(cat.name_en)) {
        seen.add(cat.name_en);
        const exists = await Category.findOne({ name_en: cat.name_en });
        if (!exists) {
          const newCat = new Category(cat);
          await newCat.save();
          insertedCount++;
        } else {
          // ALWAYS update properties to prevent image mismatches in local DB
          if (exists.image !== cat.image || exists.workType !== cat.workType || exists.name_te !== cat.name_te) {
            exists.image = cat.image;
            exists.workType = cat.workType;
            exists.name_te = cat.name_te;
            await exists.save();
            updatedCount++;
          }
        }
      }
    }
    console.log(`Verified categories: inserted ${insertedCount}, updated ${updatedCount}.`);

    // Seed default Team Member (Head of Project)
    const defaultHead = await TeamMember.findOne({ name: 'Rajamouli Chary' });
    if (!defaultHead) {
      console.log('Seeding default team member...');
      const newHead = new TeamMember({
        name: 'Rajamouli Chary',
        role: 'Founder & Head Carpentry Craftsman',
        role_te: 'స్థాపకుడు & ప్రధాన వడ్రంగి హస్తకళాకారుడు',
        exp: '25+ Years',
        image: '/uploads/owner.jpg'
      });
      await newHead.save();
      console.log('Created default team member profile for Rajamouli Chary.');
    } else {
      if (defaultHead.image !== '/uploads/owner.jpg') {
        defaultHead.image = '/uploads/owner.jpg';
        await defaultHead.save();
        console.log('Updated default team member profile image for Rajamouli Chary.');
      }
      console.log('Default team member Rajamouli Chary already verified.');
    }

    // Seed default designs
    const Design = require('../models/Design');
    console.log('Verifying default designs...');
    const livingRoomCat = await Category.findOne({ name_en: 'Living Room Interiors' });
    const kitchenCat = await Category.findOne({ name_en: 'Modular Kitchen Interiors' });
    const bedroomCat = await Category.findOne({ name_en: 'Bedroom Interiors' });
    
    const wiringCat = await Category.findOne({ name_en: 'Residential Electrical Wiring' });
    const automationCat = await Category.findOne({ name_en: 'Smart Home Automation' });
    
    const chandelierCat = await Category.findOne({ name_en: 'Chandeliers' });
    const ledPanelCat = await Category.findOne({ name_en: 'LED Ceiling Lighting' });

    const designsToSeed = [
      // Interior
      {
        title_en: 'Royal Wooden Living Room',
        title_te: 'రాజసం ఉట్టిపడే చెక్క లివింగ్ రూమ్',
        category: livingRoomCat ? livingRoomCat._id : null,
        images: [
          'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Premium royal design featuring rich teakwood finishes, customized wall panels, ambient spotlighting, and plush seating setups.',
        description_te: 'ధర కట్టలేని టేకు కలప ముగింపులు, అనుకూలీకరించిన గోడ ప్యానెల్లు, యాంబియంట్ స్పాట్‌లైట్ మరియు మెత్తటి సోఫా సెటప్‌లతో కూడిన ప్రీమియం రాయల్ డిజైన్.',
        workType: 'interior'
      },
      {
        title_en: 'Contemporary Charcoal L-Shaped Kitchen',
        title_te: 'సమకాలీన చార్‌కోల్ L-ఆకారపు వంటగది',
        category: kitchenCat ? kitchenCat._id : null,
        images: [
          'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Modern L-Shaped modular kitchen with custom charcoal-matte soft-close cabinets, pull-out wire baskets, a tall pantry unit, and seamless quartz countertops.',
        description_te: 'అనుకూలీకరించిన చార్‌కోల్-మ్యాట్ సాఫ్ట్-క్లోజ్ క్యాబినెట్‌లు, పుల్-అవుట్ వైర్ బాస్కెట్‌లు, పొడవైన ప్యాంట్రీ యూనిట్ మరియు అతుకులు లేని క్వార్ట్జ్ కౌంటర్‌టాప్‌లతో కూడిన ఆధునిక L-ఆకారపు మాడ్యులర్ వంటగది.',
        workType: 'interior'
      },
      {
        title_en: 'Luxury Master Bedroom Suite',
        title_te: 'లగ్జరీ మాస్టర్ బెడ్‌రూమ్ సూట్',
        category: bedroomCat ? bedroomCat._id : null,
        images: [
          'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=800&q=80'
        ],
        description_en: 'Premium master bedroom interior design containing custom floor-to-ceiling cushioned headboard panel, sliding mirror wardrobes, and a matching modern dressing table.',
        description_te: 'అనుకూలీకరించిన నేల నుండి పైకప్పు వరకు కుషన్డ్ హెడ్‌బోర్డ్ ప్యానెల్, స్లైడింగ్ అద్దాల వార్డ్‌రోబ్‌లు మరియు దానికి సరిపోయే ఆధునిక డ్రెస్సింగ్ టేబుల్‌తో కూడిన ప్రీమియం మాస్టర్ బెడ్‌రూమ్ ఇంటీరియర్ డిజైన్.',
        workType: 'interior'
      },
      
      // Electrical
      {
        title_en: 'Premium Smart Home Automation',
        title_te: 'ప్రీమియం స్మార్ట్ హోమ్ ఆటోమేషన్',
        category: automationCat ? automationCat._id : null,
        images: ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80'],
        description_en: 'State-of-the-art smart home integration featuring centralized touch panels, mobile app controls, scene settings, and automated lighting controls for a modern luxury villa.',
        description_te: 'ఆధునిక లగ్జరీ విల్లా కోసం కేంద్రీకృత టచ్ ప్యానెల్లు, మొబైల్ యాప్ నియంత్రణలు, సీన్ సెట్టింగ్‌లు మరియు ఆటోమేటెడ్ లైటింగ్ నియంత్రణలతో కూడిన అత్యాధునిక స్మార్ట్ హోమ్ ఇంటిగ్రేషన్.',
        workType: 'electrical'
      },
      {
        title_en: 'Complete Residential 3-Phase Wiring',
        title_te: 'నివాస త్రీ-ఫేజ్ వైరింగ్ పనులు',
        category: wiringCat ? wiringCat._id : null,
        images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80'],
        description_en: 'Heavy-duty residential wiring featuring secure conduits, fire-resistant copper wiring, neat distribution board dressing, and proper earth protection systems.',
        description_te: 'సురక్షితమైన పైపులు, ఫైర్-రెసిస్టెంట్ కాపర్ వైరింగ్, చక్కని డిస్ట్రిబ్యూషన్ బోర్డ్ డ్రెస్సింగ్ మరియు సరైన ఎర్తింగ్ ప్రొటెక్షన్ సిస్టమ్స్‌తో కూడిన హెవీ-డ్యూటీ నివాస త్రీ-ఫేజ్ వైరింగ్.',
        workType: 'electrical'
      },

      // Lighting
      {
        title_en: 'Luxury Grand Chandelier Installation',
        title_te: 'లగ్జరీ గ్రాండ్ జూమర్ లైటింగ్',
        category: chandelierCat ? chandelierCat._id : null,
        images: ['https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=800&q=80'],
        description_en: 'Double-height ceiling crystal chandelier installation with warm dimmable LED lights and secure structural heavy ceiling hooks for a premium living room lobby.',
        description_te: 'ప్రీమియం లివింగ్ రూమ్ లాబీ కోసం వెచ్చని డిమ్మబుల్ LED లైట్లు మరియు సురక్షితమైన నిర్మాణ భారీ సీలింగ్ హుక్స్‌తో డబుль-హైట్ సీలింగ్ క్రిస్టల్ జూమర్ ఇన్‌స్టాలేషన్.',
        workType: 'lighting'
      },
      {
        title_en: 'Modern Recessed Cove & LED Panel Layout',
        title_te: 'ఆధునిక కోవ్ లైటింగ్ & ఎల్‌ఈడీ ప్యానెల్ లేఅవుట్',
        category: ledPanelCat ? ledPanelCat._id : null,
        images: ['https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=800&q=80'],
        description_en: 'Ambient false ceiling cove lighting integrated with energy-efficient slim LED panels and adjustable spotlights to create a luxury warm glow in the living hall.',
        description_te: 'లివింగ్ హాల్‌లో విలాసవంతమైన వెచ్చని కాంతిని సృష్టించడానికి ఇంధన-సమర్థవంతమైన స్లిమ్ LED ప్యానెల్లు మరియు సర్దుబాటు చేయగల స్పాట్‌లైట్‌లతో కూడిన ఫాల్స్ సీలింగ్ కోవ్ లైటింగ్.',
        workType: 'lighting'
      }
    ];

    let seededDesignsCount = 0;
    for (const d of designsToSeed) {
      if (d.category) {
        const exists = await Design.findOne({ title_en: d.title_en });
        if (!exists) {
          const newDesign = new Design(d);
          await newDesign.save();
          console.log(`Auto-seeded design: ${newDesign.title_en} (${newDesign.designId})`);
          seededDesignsCount++;
        }
      }
    }
    if (seededDesignsCount > 0) {
      console.log(`Successfully seeded ${seededDesignsCount} new sample designs.`);
    } else {
      console.log('All default sample designs already exist.');
    }
  } catch (seedError) {
    console.error('Seeding Error during auto-seed:', seedError);
  }
};

module.exports = connectDB;
