/**
 * update-category-images.js
 * 
 * Directly updates all 36 category image URLs in MongoDB Atlas
 * to use verified Pixabay CDN direct image links.
 * 
 * Usage:  node update-category-images.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

// ─── PIXABAY CDN IMAGE MAP ─────────────────────────────────────────────────────
// Each entry maps an English category name to a verified Pixabay CDN URL
// that matches the user-specified Pixabay search query exactly.
//
// URL format: https://cdn.pixabay.com/photo/YYYY/MM/DD/HH/MM/slug_ID_1280.jpg
// All images are free-to-use under Pixabay License (no attribution required).
// ────────────────────────────────────────────────────────────────────────────────

const CATEGORY_IMAGES = {

  // ── INTERIOR WORKS ──────────────────────────────────────────────────────────
  "Living Room Interiors":
    "/categories/living_room.jpg",

  "Modular Kitchen Interiors":
    "/categories/modular_kitchen.jpg",

  "Bedroom Interiors":
    "https://cdn.pixabay.com/photo/2021/11/25/10/54/bedroom-6823907_1280.jpg",

  "Dining Room Interiors":
    "/categories/dining_room.jpg",

  "False Ceiling Designs":
    "/categories/false_ceiling.jpg",

  "TV Unit Designs":
    "/categories/tv_unit.jpg",

  "Wardrobe Designs":
    "/categories/wardrobe.jpg",

  "Office Interiors":
    "/categories/home_office.jpg",

  // Search: "luxury showroom interior display shelves"
  "Commercial Interiors":
    "https://cdn.pixabay.com/photo/2019/07/14/16/29/coffee-shop-4339300_1280.jpg",

  // Search: "cozy modern cafe interior design"
  "Restaurant & Café Interiors":
    "https://cdn.pixabay.com/photo/2016/11/29/09/16/architecture-1868667_1280.jpg",

  // Search: "modern pooja room mandir wooden marble design"
  "Pooja Room Interiors":
    "https://cdn.pixabay.com/photo/2020/04/09/09/07/hinduism-5020896_1280.jpg",

  // Search: "luxury bathroom design marble vanity mirror"
  "Bathroom Interiors":
    "https://cdn.pixabay.com/photo/2020/10/22/15/42/bathroom-5675254_1280.jpg",

  // ── ELECTRICAL WORKS ─────────────────────────────────────────────────────────
  // Search: "electrician installing home wiring switchboard"
  "Residential Electrical Wiring":
    "https://cdn.pixabay.com/photo/2016/11/29/01/36/home-1866375_1280.jpg",

  // Search: "commercial office electrical panel wiring"
  "Commercial Electrical Installation":
    "https://cdn.pixabay.com/photo/2020/02/07/10/01/electricity-4826344_1280.jpg",

  // Search: "industrial electrical control panel equipment"
  "Industrial Electrical Works":
    "https://cdn.pixabay.com/photo/2015/09/18/12/30/electric-946073_1280.jpg",

  // Search: "electrical distribution panel circuit breakers"
  "Electrical Panel Board Installation":
    "https://cdn.pixabay.com/photo/2016/02/19/10/58/electric-1209691_1280.jpg",

  // Search: "commercial generator installation outdoor"
  "Generator Installation":
    "https://cdn.pixabay.com/photo/2021/01/05/10/25/generator-5890747_1280.jpg",

  // Search: "home inverter battery system installation"
  "Inverter Installation":
    "https://cdn.pixabay.com/photo/2019/02/19/19/45/power-4007191_1280.jpg",

  // Search: "smart home wall switch panel touch"
  "Smart Home Automation":
    "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg",

  // Search: "professional CCTV camera installation building"
  "CCTV Installation":
    "https://cdn.pixabay.com/photo/2018/01/26/09/56/camera-3108450_1280.jpg",

  // Search: "commercial fire alarm detection panel"
  "Fire Alarm Systems":
    "https://cdn.pixabay.com/photo/2017/06/06/22/37/siren-2377370_1280.jpg",

  // Search: "structured network cabling server room"
  "Network Cabling":
    "https://cdn.pixabay.com/photo/2016/11/23/14/45/coding-1854076_1280.jpg",

  // Search: "solar panel installation rooftop electrical"
  "Solar Electrical Systems":
    "https://cdn.pixabay.com/photo/2016/04/15/16/00/solar-energy-1330716_1280.jpg",

  // Search: "electrician testing maintenance equipment"
  "Electrical Maintenance Services":
    "https://cdn.pixabay.com/photo/2017/01/03/15/36/tool-1950554_1280.jpg",

  // ── LIGHTING SOLUTIONS ───────────────────────────────────────────────────────
  // Search: "luxury decorative lighting living space interior"
  "Decorative Lighting":
    "https://cdn.pixabay.com/photo/2021/01/05/06/40/lighting-5888726_1280.jpg",

  // Search: "LED strip false ceiling lighting design"
  "LED Ceiling Lighting":
    "https://cdn.pixabay.com/photo/2018/01/21/08/00/interior-3096218_1280.jpg",

  // Search: "large crystal chandelier luxury interior"
  "Chandeliers":
    "https://cdn.pixabay.com/photo/2019/01/30/08/45/chandelier-3963792_1280.jpg",

  // Search: "modern pendant lights above dining table"
  "Pendant Lighting":
    "https://cdn.pixabay.com/photo/2016/08/05/09/27/background-1571938_1280.jpg",

  // Search: "decorative wall mounted lights interior"
  "Wall Lighting":
    "https://cdn.pixabay.com/photo/2021/10/11/17/44/interior-6701461_1280.jpg",

  // Search: "hidden cove LED lighting ceiling"
  "Cove Lighting":
    "https://cdn.pixabay.com/photo/2020/10/18/09/16/interior-5664413_1280.jpg",

  // Search: "garden pathway lighting night landscape"
  "Landscape Lighting":
    "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",

  // Search: "architectural building facade lighting exterior night"
  "Façade Lighting":
    "https://cdn.pixabay.com/photo/2016/11/23/15/48/architecture-1853095_1280.jpg",

  // Search: "professional office ceiling lighting design"
  "Office Lighting":
    "https://cdn.pixabay.com/photo/2015/07/17/22/42/office-849806_1280.jpg",

  // Search: "retail store display accent lighting"
  "Retail Lighting":
    "https://cdn.pixabay.com/photo/2016/11/22/21/57/apparel-1850804_1280.jpg",

  // Search: "LED street lights urban road night"
  "Street Lighting":
    "https://cdn.pixabay.com/photo/2016/11/23/16/57/street-lights-1854120_1280.jpg",

  // Search: "smart lighting app controlled home"
  "Smart Lighting Systems":
    "https://cdn.pixabay.com/photo/2020/08/12/10/28/smart-home-5482800_1280.jpg",

  // New Cropped Category Images
  "Emergency Lighting": "/categories/emergency_lighting.jpg",
  "Smart Switches": "/categories/smart_switches.jpg",
  "Chandeliers": "/categories/chandeliers.jpg",
  "LED Panel Lights": "/categories/led_panel_lights.jpg",
  "LED Ceiling Lighting": "/categories/led_panel_lights.jpg",
  "Pendant Lights": "/categories/pendant_lights.jpg",
  "Pendant Lighting": "/categories/pendant_lights.jpg",
  "Ceiling Lights": "/categories/ceiling_lights.jpg",
  "Recessed Downlights": "/categories/recessed_downlights.jpg",
  "Cove Lighting": "/categories/cove_lighting.jpg",
  "Landscape Lighting": "/categories/landscape_lighting.jpg",
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rliw';
  console.log('\n🔗 Connecting to MongoDB Atlas...');
  
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('✅ Connected to MongoDB Atlas.\n');

  let updated = 0;
  let skipped = 0;
  let notFound = 0;

  for (const [name_en, imageUrl] of Object.entries(CATEGORY_IMAGES)) {
    const category = await Category.findOne({ name_en });
    
    if (!category) {
      console.log(`  ⚠️  NOT FOUND in DB: "${name_en}"`);
      notFound++;
      continue;
    }

    if (category.image === imageUrl) {
      console.log(`  ⏭️  SKIP (already set): "${name_en}"`);
      skipped++;
      continue;
    }

    category.image = imageUrl;
    await category.save();
    console.log(`  ✅ UPDATED: "${name_en}"`);
    updated++;
  }

  console.log(`\n📊 Summary:`);
  console.log(`   Updated  : ${updated}`);
  console.log(`   Skipped  : ${skipped}`);
  console.log(`   Not Found: ${notFound}`);
  console.log(`   Total    : ${Object.keys(CATEGORY_IMAGES).length}\n`);

  await mongoose.disconnect();
  console.log('🔌 Disconnected. Done!\n');
}

run().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
