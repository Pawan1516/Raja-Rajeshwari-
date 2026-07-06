const mongoose = require('mongoose');

const categoriesData = [
  // 1. Residential Interior Works
  { name_en: "Residential Interior Works", name_te: "నివాస ఇంటీరియర్ పనులు", image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Living Room Interior", name_te: "లివింగ్ రూమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Bedroom Interior", name_te: "బెడ్‌రూమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Kitchen Interior", name_te: "వంటగది ఇంటీరియర్", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Dining Room Interior", name_te: "డైనింగ్ రూమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Bathroom Interior", name_te: "బాత్‌రూమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1620626011160-9928f1b2b64a?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Children's Room", name_te: "పిల్లల గది", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Home Office", name_te: "హోమ్ ఆఫీస్", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wardrobe Design", name_te: "వార్డ్‌రోబ్ డిజైన్", image: "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "TV Unit Design", name_te: "టీవీ యూనిట్ డిజైన్", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "False Ceiling", name_te: "ఫాల్స్ సీలింగ్", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wall Paneling", name_te: "గోడ ప్యానలింగ్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular Kitchen", name_te: "మోడ్యులర్ కిచెన్", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wooden Flooring", name_te: "చెక్క ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Staircase Design", name_te: "మెట్ల డిజైన్", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Balcony Interior", name_te: "బాల్కనీ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Luxury Villa Interior", name_te: "లగ్జరీ విల్లా ఇంటీరియర్", image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Apartment Interior", name_te: "అపార్ట్మెంట్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 2. Commercial Interior Works
  { name_en: "Commercial Interior Works", name_te: "వాణిజ్య ఇంటీరియర్ పనులు", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Office Interior", name_te: "ఆఫీస్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Corporate Workspace", name_te: "కార్పొరేట్ వర్క్‌స్పేస్", image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Reception Area", name_te: "రిసెప్షన్ ఏరియా", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Conference Room", name_te: "కాన్ఫరెన్స్ రూమ్", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Retail Shop Interior", name_te: "రిటైల్ షాప్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Showroom Interior", name_te: "షోరూమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Restaurant Interior", name_te: "రెస్టారెంట్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Café Interior", name_te: "కేఫ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Hotel Interior", name_te: "హోటల్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Hospital Interior", name_te: "ఆసుపత్రి ఇంటీరియర్", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Clinic Interior", name_te: "క్లినిక్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "School Interior", name_te: "పాఠశాల ఇంటీరియర్", image: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "College Interior", name_te: "కళాశాల ఇంటీరియర్", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Bank Interior", name_te: "బ్యాంక్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Salon & Spa Interior", name_te: "సలూన్ & స్పా ఇంటీరియర్", image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Gym Interior", name_te: "జిమ్ ఇంటీరియర్", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 3. Furniture Works
  { name_en: "Furniture Works", name_te: "ఫర్నిచర్ పనులు", image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular Furniture", name_te: "మోడ్యులర్ ఫర్నిచర్", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Custom Furniture", name_te: "అనుకూలీకరించిన ఫర్నిచర్", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Office Furniture", name_te: "ఆఫీస్ ఫర్నిచర్", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Home Furniture", name_te: "ఇంటి ఫర్నిచర్", image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wardrobes", name_te: "వార్డ్‌రోబ్‌లు", image: "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "TV Units", name_te: "టీవీ యూనిట్లు", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Bookshelves", name_te: "పుస్తకాల షెల్ఫ్‌లు", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Dining Tables", name_te: "డైనింగ్ టేబుళ్లు", image: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Sofa Design", name_te: "సోఫా డిజైన్", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Coffee Tables", name_te: "టీ టేబుళ్లు", image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Storage Cabinets", name_te: "స్టోరేజ్ క్యాబినెట్లు", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wooden Partitions", name_te: "చెక్క విభజనలు", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 4. Ceiling Works
  { name_en: "Ceiling Works", name_te: "సీలింగ్ పనులు", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Gypsum Ceiling", name_te: "జిప్సం సీలింగ్", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "POP Ceiling", name_te: "పీఓపీ సీలింగ్", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wooden Ceiling", name_te: "చెక్క సీలింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "PVC Ceiling", name_te: "పీవీసీ సీలింగ్", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Grid Ceiling", name_te: "గ్రిడ్ సీలింగ్", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Decorative Ceiling", name_te: "అలంకార సీలింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Acoustic Ceiling", name_te: "ధ్వని నిరోధక సీలింగ్", image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 5. Wall Works
  { name_en: "Wall Works", name_te: "గోడ పనులు", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wallpaper Installation", name_te: "వాల్‌పేపర్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wall Cladding", name_te: "వాల్ క్లాడింగ్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Decorative Panels", name_te: "అలంకార ప్యానెల్లు", image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Stone Cladding", name_te: "రాతి క్లాడింగ్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Texture Painting", name_te: "టెక్స్చర్ పెయింటింగ్", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Feature Walls", name_te: "ప్రత్యేక గోడలు", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "3D Wall Panels", name_te: "త్రీడీ వాల్ ప్యానెల్లు", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 6. Flooring Works
  { name_en: "Flooring Works", name_te: "ఫ్లోరింగ్ పనులు", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Vinyl Flooring", name_te: "వినైల్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "SPC Flooring", name_te: "ఎస్‌పీసీ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Laminate Flooring", name_te: "లామినేట్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Marble Flooring", name_te: "మార్బుల్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Granite Flooring", name_te: "గ్రెనైట్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Tile Flooring", name_te: "టైల్స్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1516156008625-3a9d6067ffd5?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Epoxy Flooring", name_te: "ఎపోక్సీ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Carpet Flooring", name_te: "కార్పెట్ ఫ్లోరింగ్", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 7. Modular Works
  { name_en: "Modular Works", name_te: "మోడ్యులర్ పనులు", image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular Wardrobe", name_te: "మోడ్యులర్ వార్డ్‌రోబ్", image: "https://images.unsplash.com/photo-1558882224-dda166733079?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular TV Unit", name_te: "మోడ్యులర్ టీవీ యూనిట్", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular Office Furniture", name_te: "మోడ్యులర్ ఆఫీస్ ఫర్నిచర్", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Modular Storage Units", name_te: "మోడ్యులర్ స్టోరేజ్ యూనిట్లు", image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // 8. Painting & Finishing
  { name_en: "Painting & Finishing", name_te: "పెయింటింగ్ & ముగింపు", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Interior Painting", name_te: "ఇంటీరియర్ పెయింటింగ్", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Exterior Painting", name_te: "ఎక్స్‌టీరియర్ పెయింటింగ్", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Decorative Painting", name_te: "అలంకార పెయింటింగ్", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wall Putty", name_te: "వాల్ పుట్టీ", image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Polish Works", name_te: "పోలిష్ పనులు", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80", workType: 'interior' },
  { name_en: "Wood Finishing", name_te: "చెక్క ముగింపు పనులు", image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80", workType: 'interior' },

  // Electrical Categories
  { name_en: "Residential Electrical", name_te: "నివాస విద్యుత్ పనులు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Complete House Wiring", name_te: "పూర్తి హౌస్ వైరింగ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Rewiring", name_te: "రీవైరింగ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Electrical Installation", name_te: "ఎలక్ట్రికల్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Distribution Board Installation", name_te: "డిస్ట్రిబ్యూషన్ బోర్డ్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Earthing System", name_te: "ఎర్తింగ్ సిస్టమ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Circuit Breaker Installation", name_te: "సర్క్యూట్ బ్రేకర్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Power Socket Installation", name_te: "పవర్ సాకెట్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Switch Installation", name_te: "స్విచ్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Commercial Electrical", name_te: "వాణిజ్య విద్యుత్ పనులు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Office Electrical Works", name_te: "ఆఫీస్ ఎలక్ట్రికల్ పనులు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Retail Store Wiring", name_te: "రిటైల్ స్టోర్ వైరింగ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Hotel Electrical", name_te: "హోటల్ ఎలక్ట్రికల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Restaurant Electrical", name_te: "రెస్టారెంట్ ఎలక్ట్రికల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Industrial Electrical", name_te: "పారిశ్రామిక విద్యుత్ పనులు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Factory Wiring", name_te: "ఫ్యాక్టరీ వైరింగ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Electrical Panels", name_te: "ఎలక్ట్రికల్ ప్యానెల్లు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Main Distribution Panel", name_te: "మెయిన్ డిస్ట్రిబ్యూషన్ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Sub Distribution Panel", name_te: "సబ్ డిస్ట్రిబ్యూషన్ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "LT Panel", name_te: "ఎల్టీ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Control Panel", name_te: "కంట్రోల్ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "MCC Panel", name_te: "ఎమ్సీసీ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "APFC Panel", name_te: "ఏపీఎఫ్‌సీ ప్యానెల్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Power Backup", name_te: "పవర్ బ్యాకప్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "UPS Installation", name_te: "యుపిఎస్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Inverter Installation", name_te: "ఇన్వర్టర్ ఇన్‌స్టాలేషన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Battery Backup", name_te: "బ్యాటరీ బ్యాకప్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Generator Connection", name_te: "జనరేటర్ కనెక్షన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Automatic Changeover System", name_te: "ఆటోమేటిక్ చేంజ్ఓవర్ సిస్టమ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Safety Systems", name_te: "రక్షణ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Surge Protection", name_te: "సర్జ్ ప్రొటెక్షన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Lightning Protection", name_te: "మెరుపు రక్షణ వ్యవస్థ", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Fire Alarm Wiring", name_te: "ఫైర్ అలారం వైరింగ్", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Emergency Lighting", name_te: "ఎమర్జెన్సీ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Smoke Detector Wiring", name_te: "పొగ డిటెక్టర్ వైరింగ్", image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Earth Leakage Protection", name_te: "ఎర్త్ లీకేజ్ ప్రొటెక్షన్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Smart Electrical Solutions", name_te: "స్మార్ట్ విద్యుత్ పరిష్కారాలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Smart Switches", name_te: "స్మార్ట్ స్విచ్‌లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Smart Home Automation", name_te: "స్మార్ట్ హోమ్ ఆటోమేషన్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Wi-Fi Controlled Devices", name_te: "వైఫై నియంత్రిత పరికరాలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Motion Sensors", name_te: "మోషన్ సెన్సార్లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Voice Controlled Systems", name_te: "వాయిస్ నియంత్రిత వ్యవస్థలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Energy Monitoring Systems", name_te: "శక్తి పర్యవేక్షణ వ్యవస్థలు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Electrical Maintenance", name_te: "విద్యుత్ నిర్వహణ", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Fault Finding", name_te: "లోపాలను కనుగొనడం", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Electrical Repairs", name_te: "విద్యుత్ మరమ్మతులు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Preventive Maintenance", name_te: "నివారణ నిర్వహణ", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Annual Maintenance Contracts (AMC)", name_te: "వార్షిక నిర్వహణ ఒప్పందాలు", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },
  { name_en: "Load Testing", name_te: "లోడ్ టెస్టింగ్", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80", workType: 'electrical' },

  // Lighting Categories
  { name_en: "Indoor Lighting", name_te: "ఇండోర్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "LED Panel Lights", name_te: "ఎల్‌ఈడీ ప్యానెల్ లైట్లు", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Recessed Downlights", name_te: "రిసెస్డ్ డౌన్‌లైట్లు", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Ceiling Lights", name_te: "సీలింగ్ లైట్లు", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Pendant Lights", name_te: "పెండెంట్ లైట్లు", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Chandeliers", name_te: "ఝూమర్లు (చాండెలియర్స్)", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Wall Lights", name_te: "గోడ లైట్లు", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Cove Lighting", name_te: "కోవ్ లైటింగ్", image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Track Lighting", name_te: "ట్రాక్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Spot Lights", name_te: "స్పాట్ లైట్లు", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Strip Lighting", name_te: "ఎల్‌ఈడీ స్ట్రిప్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Outdoor Lighting", name_te: "అవుట్‌డోర్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Garden Lights", name_te: "తోట లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Landscape Lighting", name_te: "ల్యాండ్‌స్కేప్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Pathway Lights", name_te: "నడక మార్గం లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Gate Lighting", name_te: "గేట్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Parking Area Lighting", name_te: "పార్కింగ్ ఏరియా లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Street Lights", name_te: "వీధి దీపాలు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Security Lights", name_te: "భద్రతా లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Flood Lights", name_te: "ఫ్లడ్ లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Facade Lighting", name_te: "ఫాసాడ్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Decorative Lighting", name_te: "అలంకార లైటింగ్", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Crystal Chandeliers", name_te: "క్రిస్టల్ ఝూమర్లు", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Designer Pendant Lights", name_te: "డిజైనర్ పెండెంట్ లైట్లు", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Decorative Wall Lamps", name_te: "అలంకార గోడ దీపాలు", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Hanging Lights", name_te: "హాంగింగ్ లైట్లు", image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Luxury Lighting", name_te: "లగ్జరీ లైటింగ్", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Accent Lighting", name_te: "యాక్సెంట్ లైటింగ్", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Artistic Lighting", name_te: "కళాత్మక లైటింగ్", image: "https://images.unsplash.com/photo-1520699049698-acd2fccb8cc8?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Commercial Lighting", name_te: "వాణిజ్య లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Office Lighting", name_te: "ఆఫీస్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Retail Lighting", name_te: "రిటైల్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Warehouse Lighting", name_te: "వేర్‌హౌస్ లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Industrial High Bay Lighting", name_te: "పారిశ్రామిక హై బే లైటింగ్", image: "https://images.unsplash.com/photo-1565814636199-ae8133055c1c?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Restaurant Lighting", name_te: "రెస్టారెంట్ లైటింగ్", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Hotel Lighting", name_te: "హోటల్ లైటింగ్", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Showroom Lighting", name_te: "షోరూమ్ లైటింగ్", image: "https://images.unsplash.com/photo-1582037928769-181f2644ecb7?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Smart Lighting", name_te: "స్మార్ట్ లైటింగ్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Motion Sensor Lights", name_te: "మోషన్ సెన్సార్ లైట్లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Dimmable LED Lights", name_te: "డిమ్మబుల్ ఎల్‌ఈడీ లైట్లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "RGB Lighting", name_te: "ఆర్‌జీబీ రంగుల లైటింగ్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Wi-Fi Smart Lights", name_te: "వైఫై స్మార్ట్ లైట్లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Voice Controlled Lights", name_te: "వాయిస్ కంట్రోల్డ్ లైట్లు", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "App Controlled Lighting", name_te: "యాప్ నియంత్రిత లైటింగ్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Scene-Based Lighting", name_te: "సీన్-ఆధారిత లైటింగ్", image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Energy Efficient Lighting", name_te: "శక్తి సమర్థవంతమైన లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "LED Lighting Solutions", name_te: "ఎల్‌ఈడీ లైటింగ్ పరిష్కారాలు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Solar Lighting", name_te: "సౌర శక్తి లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Motion Activated Lights", name_te: "మోషన్ యాక్టివేటెడ్ లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Daylight Sensors", name_te: "డేలైట్ సెన్సార్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Energy Saving Fixtures", name_te: "విద్యుత్ ఆదా చేసే లైట్లు", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Specialty Lighting", name_te: "ప్రత్యేక లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Staircase Lighting", name_te: "మెట్ల మార్గం లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Mirror Lighting", name_te: "అద్దం వెనుక లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Cabinet Lighting", name_te: "క్యాబినెట్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Under Shelf Lighting", name_te: "షెల్ఫ్ కింద లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Pool Lighting", name_te: "ఈత కొలను లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Fountain Lighting", name_te: "ఫౌంటెన్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Landscape Accent Lighting", name_te: "ల్యాండ్‌స్కేప్ యాక్సెంట్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' },
  { name_en: "Emergency Exit Lighting", name_te: "ఎమర్జెన్సీ ఎగ్జిట్ లైటింగ్", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?auto=format&fit=crop&w=600&q=80", workType: 'lighting' }
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

    const adminExists = await Admin.findOne({ username: 'Rajamoulichary' });
    if (!adminExists) {
      console.log('Seeding admin user account for Rajamoulichary...');
      const adminUser = new Admin({
        username: 'Rajamoulichary',
        password: 'Rajamoulichary@779'
      });
      await adminUser.save();
      console.log('Created Admin account successfully. (User: Rajamoulichary, Pass: Rajamoulichary@779)');
    } else {
      console.log('Admin account Rajamoulichary already exists.');
    }

    // Seed deduplicated categories list
    console.log('Verifying categories...');
    let insertedCount = 0;
    const seen = new Set();
    for (const cat of categoriesData) {
      if (!seen.has(cat.name_en)) {
        seen.add(cat.name_en);
        const exists = await Category.findOne({ name_en: cat.name_en });
        if (!exists) {
          const newCat = new Category(cat);
          await newCat.save();
          insertedCount++;
        }
      }
    }
    if (insertedCount > 0) {
      console.log(`Inserted ${insertedCount} missing categories successfully.`);
    } else {
      console.log('All categories already exist.');
    }

    // Seed default Team Member (Head of Project)
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      console.log('Seeding default team member...');
      const defaultHead = new TeamMember({
        name: 'Rajamouli Chary',
        role: 'Founder & Head Carpentry Craftsman',
        role_te: 'స్థాపకుడు & ప్రధాన వడ్రంగి హస్తకళాకారుడు',
        exp: '25+ Years',
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
      });
      await defaultHead.save();
      console.log('Created default team member profile for Rajamouli Chary.');
    } else {
      console.log(`Database already has ${teamCount} team members.`);
    }

    // Seed default designs
    const Design = require('../models/Design');
    console.log('Verifying default designs...');
    const livingRoomCat = await Category.findOne({ name_en: 'Living Room Interior' });
    const kitchenCat = await Category.findOne({ name_en: 'Modular Kitchen' });
    const bedroomCat = await Category.findOne({ name_en: 'Bedroom Interior' });
    
    const wiringCat = await Category.findOne({ name_en: 'Complete House Wiring' });
    const automationCat = await Category.findOne({ name_en: 'Smart Home Automation' });
    
    const chandelierCat = await Category.findOne({ name_en: 'Chandeliers' });
    const ledPanelCat = await Category.findOne({ name_en: 'LED Panel Lights' });

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
        description_te: 'ప్రీమియం లివింగ్ రూమ్ లాబీ కోసం వెచ్చని డిమ్మబుల్ LED లైట్లు మరియు సురక్షితమైన నిర్మాణ భారీ సీలింగ్ హుక్స్‌తో డబుల్-హైట్ సీలింగ్ క్రిస్టల్ జూమర్ ఇన్‌స్టాలేషన్.',
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
