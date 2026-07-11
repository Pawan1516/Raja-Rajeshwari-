const axios = require('axios');
const fs = require('fs');

// Stylized words for auto-generation
const STYLES = ["Luxury", "Modern", "Premium", "Elegant", "Contemporary", "Minimalist", "Smart"];
const SUFFIXES = ["Design", "Setup", "Interior"];

// Helper to translate text using public Google Translate API
const translateToTelugu = async (text) => {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=te&dt=t&q=${encodeURIComponent(text)}`;
    const response = await axios.get(url);
    if (response.data && response.data[0] && response.data[0][0] && response.data[0][0][0]) {
      return response.data[0][0][0];
    }
  } catch (err) {
    console.error('⚠️  Google Translate API failed:', err.message);
  }
  
  // Basic static translation mapping fallback
  const fallbackTranslations = {
    "Living Room": "లివింగ్ రూమ్",
    "Bedroom": "బెడ్‌రూమ్",
    "Kitchen": "మాడ్యులర్ వంటగది",
    "TV Unit": "టీవీ యూనిట్",
    "Wardrobe": "వార్డ్‌రోబ్",
    "False Ceiling": "ఫాల్స్ సీలింగ్",
    "Office": "ఆఫీస్",
    "Commercial": "కమర్షియల్",
    "Pooja Room": "పూజా రూమ్",
    "Bathroom": "బాత్‌రూమ్",
    "House Wiring": "ఇంటి వైరింగ్",
    "Electrical Panels": "ఎలక్ట్రికల్ ప్యానెల్ బోర్డు",
    "Power Backup": "పవర్ బ్యాకప్",
    "Smart Electrical": "స్మార్ట్ ఎలక్ట్రికల్",
    "LED Lighting": "ఎల్‌ఈడీ సీలింగ్ లైటింగ్",
    "Chandeliers": "ఝూమర్లు",
    "Cove Lighting": "కోవ్ లైటింగ్",
    "Smart Lighting": "స్మార్ట్ లైటింగ్",
    "Luxury": "లగ్జరీ",
    "Modern": "ఆధునిక",
    "Premium": "ప్రీమియం",
    "Elegant": "ఎలిగెంట్",
    "Contemporary": "సమకాలీన",
    "Minimalist": "మినిమలిస్ట్",
    "Smart": "స్మార్ట్",
    "Design": "డిజైన్",
    "Setup": "సెటప్",
    "Interior": "ఇంటీరియర్"
  };

  let translated = text;
  Object.keys(fallbackTranslations).forEach(key => {
    translated = translated.replace(new RegExp(key, 'gi'), fallbackTranslations[key]);
  });
  return translated;
};

// Local Rule-Based Keyword Matcher
const ruleBasedAnalyze = (filename) => {
  const name = filename.toLowerCase();

  let category = "Living Room Interiors";
  let subcategory = "Living Room Interior";
  let workType = "interior";
  let features = ["False Ceiling", "Wooden Paneling", "Modular Storage"];

  if (name.includes('kitchen') || name.includes('cook') || name.includes('island') || name.includes('pantry')) {
    category = "Modular Kitchen Interiors";
    subcategory = "L-Shaped Modular Kitchen";
    workType = "interior";
    features = ["Modular Storage", "Quartz Countertop", "Soft-close Drawers"];
  } else if (name.includes('wardrobe') || name.includes('cupboard') || name.includes('closet')) {
    category = "Wardrobe Designs";
    subcategory = "Sliding Wardrobe";
    workType = "interior";
    features = ["Modular Storage", "Internal Drawer Organizers", "Soft-close Doors"];
  } else if (name.includes('bedroom') || name.includes('bed') || name.includes('sleep')) {
    category = "Bedroom Interiors";
    subcategory = "Master Bedroom";
    workType = "interior";
    features = ["False Ceiling", "Wooden Paneling", "Modular Storage"];
  } else if (name.includes('tv') || name.includes('television') || name.includes('media') || name.includes('console')) {
    category = "TV Unit Designs";
    subcategory = "Floating TV Unit";
    workType = "interior";
    features = ["Modular Storage", "Integrated LED Backlighting", "Concealed Wiring"];
  } else if (name.includes('ceiling') || name.includes('roof') || name.includes('gypsum')) {
    category = "False Ceiling Designs";
    subcategory = "False Ceiling Design";
    workType = "interior";
    features = ["False Ceiling", "LED Lights", "Ambient Lighting"];
  } else if (name.includes('office') || name.includes('desk') || name.includes('workstation')) {
    category = "Office Interiors";
    subcategory = "Office Interior";
    workType = "interior";
    features = ["Modular Storage", "Wooden Paneling", "Ergonomic Layout"];
  } else if (name.includes('commercial') || name.includes('shop') || name.includes('store') || name.includes('showroom')) {
    category = "Commercial Interiors";
    subcategory = "Commercial Showroom Display";
    workType = "interior";
    features = ["Display Shelves", "Premium Lighting", "Modern Layout"];
  } else if (name.includes('restaurant') || name.includes('cafe') || name.includes('hotel') || name.includes('food')) {
    category = "Restaurant & Café Interiors";
    subcategory = "Cozy Modern Café";
    workType = "interior";
    features = ["Custom Seating", "Pendant Lighting", "Aesthetic Wall Art"];
  } else if (name.includes('pooja') || name.includes('mandir') || name.includes('temple')) {
    category = "Pooja Room Interiors";
    subcategory = "Wooden Mandir";
    workType = "interior";
    features = ["Teakwood Finish", "Marble Accents", "Traditional Carving"];
  } else if (name.includes('bathroom') || name.includes('washroom') || name.includes('shower') || name.includes('toilet') || name.includes('vanity')) {
    category = "Bathroom Interiors";
    subcategory = "Bathroom Interior";
    workType = "interior";
    features = ["Premium Vanity", "Glass Partitions", "Modern Fixtures"];
  }
  // Electrical
  else if (name.includes('smart') && (name.includes('electric') || name.includes('switch') || name.includes('home'))) {
    category = "Smart Home Automation";
    subcategory = "Smart Electrical";
    workType = "electrical";
    features = ["Safe Wiring", "Load Protection", "Smart Control"];
  } else if (name.includes('wire') || name.includes('wiring') || name.includes('house') || name.includes('cable') || name.includes('cabling')) {
    category = "Residential Electrical Wiring";
    subcategory = "House Wiring";
    workType = "electrical";
    features = ["Safe Wiring", "Load Protection", "Energy Efficient"];
  } else if (name.includes('panel') || name.includes('breaker') || name.includes('distribution') || name.includes('db')) {
    category = "Electrical Panel Board Installation";
    subcategory = "Electrical Panels";
    workType = "electrical";
    features = ["Safe Wiring", "Load Protection", "Circuit Breakers"];
  } else if (name.includes('backup') || name.includes('inverter') || name.includes('generator') || name.includes('power') || name.includes('battery')) {
    category = "Inverter Installation";
    subcategory = "Power Backup";
    workType = "electrical";
    features = ["Safe Wiring", "Load Protection", "Automatic Switchover"];
  } else if (name.includes('cctv') || name.includes('camera') || name.includes('security')) {
    category = "CCTV Installation";
    subcategory = "Security CCTV Layout";
    workType = "electrical";
    features = ["HD Surveillance", "Remote Monitoring", "Backup Recording"];
  } else if (name.includes('solar') || name.includes('sun') || name.includes('rooftop')) {
    category = "Solar Electrical Systems";
    subcategory = "Rooftop Solar Wiring";
    workType = "electrical";
    features = ["Solar Panels", "Net Metering Setup", "Eco Friendly"];
  }
  // Lighting
  else if (name.includes('cove')) {
    category = "Cove Lighting";
    subcategory = "Cove Lighting";
    workType = "lighting";
    features = ["LED Lights", "Ambient Lighting", "Warm Glow"];
  } else if (name.includes('chandelier') || name.includes('jhumur') || name.includes('jhumar')) {
    category = "Chandeliers";
    subcategory = "Chandeliers";
    workType = "lighting";
    features = ["LED Lights", "Ambient Lighting", "Luxury Finish"];
  } else if (name.includes('led') || name.includes('ceiling') && name.includes('light')) {
    category = "LED Ceiling Lighting";
    subcategory = "LED Lighting";
    workType = "lighting";
    features = ["LED Lights", "Ambient Lighting", "Smart Control"];
  } else if (name.includes('smart') && name.includes('light')) {
    category = "Smart Lighting Systems";
    subcategory = "Smart Lighting";
    workType = "lighting";
    features = ["LED Lights", "Ambient Lighting", "Smart Control"];
  } else if (name.includes('landscape') || name.includes('garden') || name.includes('pathway')) {
    category = "Landscape Lighting";
    subcategory = "Landscape Lighting";
    workType = "lighting";
    features = ["Weatherproof Fixtures", "Warm Uplighting", "Pathway Safety"];
  } else if (name.includes('facade') || name.includes('architectural')) {
    category = "Façade Lighting";
    subcategory = "Façade Lighting";
    workType = "lighting";
    features = ["Premium Spotlights", "Color Wash Layout", "Smart Timers"];
  } else if (name.includes('decor')) {
    category = "Decorative Lighting";
    subcategory = "Decorative Lighting";
    workType = "lighting";
    features = ["Warm Ambient Light", "Aesthetic Fixtures", "Custom Mounting"];
  }

  // Generate Title
  const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)];
  const randomSuffix = workType === 'interior' ? SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)] : 'Setup';
  const title_en = `${randomStyle} ${subcategory} ${randomSuffix}`;

  return {
    category,
    subcategory,
    title_en,
    features,
    workType
  };
};

// Main Analysis Entry Point
const analyzeImage = async (filePath, originalName) => {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (GEMINI_API_KEY) {
    try {
      console.log('🔮 Using Gemini Vision AI for analysis of:', originalName);
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      let imageBuffer;
      if (Buffer.isBuffer(filePath)) {
        imageBuffer = filePath;
      } else if (typeof filePath === 'string' && (filePath.startsWith('http://') || filePath.startsWith('https://'))) {
        const response = await axios.get(filePath, { responseType: 'arraybuffer' });
        imageBuffer = Buffer.from(response.data);
      } else {
        imageBuffer = fs.readFileSync(filePath);
      }
      const imagePart = {
        inlineData: {
          data: imageBuffer.toString('base64'),
          mimeType: 'image/jpeg'
        }
      };

      const categoriesList = [
        "Living Room Interiors",
        "Modular Kitchen Interiors",
        "Bedroom Interiors",
        "Dining Room Interiors",
        "False Ceiling Designs",
        "TV Unit Designs",
        "Wardrobe Designs",
        "Office Interiors",
        "Commercial Interiors",
        "Restaurant & Café Interiors",
        "Pooja Room Interiors",
        "Bathroom Interiors",
        "Residential Electrical Wiring",
        "Commercial Electrical Installation",
        "Industrial Electrical Works",
        "Electrical Panel Board Installation",
        "Generator Installation",
        "Inverter Installation",
        "Smart Home Automation",
        "CCTV Installation",
        "Fire Alarm Systems",
        "Network Cabling",
        "Solar Electrical Systems",
        "Electrical Maintenance Services",
        "Decorative Lighting",
        "LED Ceiling Lighting",
        "Chandeliers",
        "Pendant Lighting",
        "Wall Lighting",
        "Cove Lighting",
        "Landscape Lighting",
        "Façade Lighting",
        "Office Lighting",
        "Retail Lighting",
        "Street Lighting",
        "Smart Lighting Systems"
      ];

      const promptText = `Analyze this interior/electrical/lighting work image. Identify the best matching category from this list:
[${categoriesList.join(', ')}].

If none fit, select the closest one.
Also detect a specific subcategory (e.g. Master Bedroom, L-Shaped Modular Kitchen, 3-Phase Wiring, False Ceiling LED Lighting).
Generate a premium, professional title matching this format: [Style] + [Subcategory] + [Design/Setup/Interior], where Style is one of: Luxury, Modern, Premium, Elegant, Contemporary, Minimalist, Smart. The title must be 5 to 10 words, have no repetition, and be grammatically correct.
Generate a matching Telugu title translation.
Generate a list of 3 key features of this design.
Respond with a valid JSON object ONLY (do not include markdown wrapping like \`\`\`json, just the raw JSON object string):
{
  "category": "category name from the list",
  "subcategory": "detected subcategory",
  "title_en": "generated English title",
  "title_te": "generated Telugu title",
  "features": ["feature 1", "feature 2", "feature 3"],
  "workType": "one of: 'interior', 'electrical', 'lighting'"
}`;

      const result = await model.generateContent([promptText, imagePart]);
      const textResponse = result.response.text().trim();
      
      // Attempt to clean JSON block if AI outputs markdown formatting
      let cleanJsonStr = textResponse;
      if (cleanJsonStr.startsWith('```')) {
        cleanJsonStr = cleanJsonStr.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      }

      console.log('AI Response:', cleanJsonStr);
      const parsed = JSON.parse(cleanJsonStr);

      if (parsed.category && parsed.title_en) {
        return {
          category: parsed.category,
          subcategory: parsed.subcategory || parsed.category,
          title_en: parsed.title_en,
          title_te: parsed.title_te || await translateToTelugu(parsed.title_en),
          features: parsed.features || [],
          workType: parsed.workType || 'interior'
        };
      }
    } catch (err) {
      console.error('❌ Gemini Vision AI Analysis failed. Falling back to local rules:', err.message);
    }
  }

  // Local rule-based processing fallback
  console.log('📂 Running keyword-based local processing for:', originalName);
  const result = ruleBasedAnalyze(originalName);
  result.title_te = await translateToTelugu(result.title_en);
  return result;
};

module.exports = {
  analyzeImage,
  translateToTelugu
};
