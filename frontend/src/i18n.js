import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        categories: 'Categories',
        team: 'Our Team',
        experience: 'Our Team (Experience)',
        works: 'Works',
        contact: 'Contact',
        admin: 'Admin',
        designs: 'Designs',
        interior: 'Interior',
        electrical: 'Electrical',
        lighting: 'Lighting',
        interior_works: 'Interior Works',
        electrical_works: 'Electrical Works',
        lighting_solutions: 'Lighting Solutions',
        projects_gallery: 'Projects Gallery',
        electrical_lighting: 'Electrical & Lighting'
      },
      hero: {
        tagline: 'Interior, Electrical & Lighting Services Available Across All India 🇮🇳',
        subtagline: 'We deliver professional interior design, electrical solutions, and modern lighting services across India.',
        cta: 'Explore Designs'
      },
      common: {
        search: 'Search designs...',
        all: 'All',
        whatsapp_btn: 'Inquire on WhatsApp',
        call_now: 'Call Now',
        chat_whatsapp: 'Chat on WhatsApp',
        view_details: 'View Details',
        back: 'Back',
        design_id: 'Design ID',
        category: 'Category',
        description: 'Description',
        admin_panel: 'Admin Control Panel',
        login: 'Admin Login',
        logout: 'Logout',
        telugu: 'తెలుగు',
        english: 'English',
        years_exp: 'Years Experience',
        projects_completed: 'Projects Completed',
        satisfied_clients: 'Satisfied Clients',
        experience_title: 'Our Journey & Experience',
        team_title: 'Meet Our Expert Craftsmen',
        works_title: 'Our Completed Projects',
        contact_title: 'Get In Touch',
        location: 'Location & Map',
        address_label: 'Address',
        phone_label: 'Phone',
        email_label: 'Email',
        showroom_title: 'Visit Our Showroom',
        showroom_hours: 'Showroom Hours',
        showroom_days: 'Monday - Sunday: 9:00 AM - 9:00 PM',
        get_directions: 'Get Directions',
      },
      home: {
        categories_heading: 'Explore Categories',
        featured_heading: 'Featured Masterpieces',
        about_title: '25+ Years of Carpentry & Interior Excellence',
        about_p1: 'Raja Rajeshwari Interior Works is a leading home styling and design services enterprise headed by Rajamouli Chary. We deliver customizable wood fittings, modern false ceilings, wall panelings, and space-saving modular kitchen systems.',
        about_p2: 'Every design is engineered to combine ergonomics, aesthetic appeal, and durable materials, bringing modern luxury to your living rooms, bedrooms, and commercial spaces.',
        india_coverage_heading: 'Serving Customers Across India',
        india_coverage_text: 'Raja Rajeshwari Interior Works proudly offers interior design, electrical work, and lighting solutions across all states and cities in India. Whether you are in a metro city or a small town, our team ensures high-quality service, safe electrical installations, and modern lighting designs.',
        india_trust: 'We provide reliable interior, electrical, and lighting services across India with a focus on safety, quality, and customer satisfaction.',
        india_badge: '🇮🇳 Available Across India'
      },
      experience: {
        highlights_title: 'Experience Highlights',
        founder_title: 'Founder & Owner',
        founder_desc: 'Rajamouli Chary is the founder and owner of Raja Rajeshwari Interior Works. With decades of hands-on experience in interior, electrical, and lighting work, he leads the team with expertise, dedication, and a strong commitment to quality craftsmanship.',
        company_desc: 'Raja Rajeshwari Interior Works brings over 25 years of industry experience, delivering high-quality interior, electrical, and lighting solutions. With more than 500 successful projects completed, we are committed to excellence, durability, and customer satisfaction. We also provide a 2-year warranty on our services to ensure trust and reliability.'
      }
    }
  },
  te: {
    translation: {
      nav: {
        home: 'హోమ్',
        categories: 'విభాగాలు',
        team: 'మా బృందం',
        experience: 'మా బృందం (అనుభవం)',
        works: 'ప్రాజెక్టులు',
        contact: 'సంప్రదించండి',
        admin: 'అడ్మిన్ డ్యాష్‌బోర్డ్',
        designs: 'డిజైన్లు',
        interior: 'ఇంటీరియర్',
        electrical: 'ఎలక్ట్రికల్',
        lighting: 'లైటింగ్',
        interior_works: 'ఇంటీరియర్ పనులు',
        electrical_works: 'ఎలక్ట్రికల్ పనులు',
        lighting_solutions: 'లైటింగ్ సొల్యూషన్స్',
        projects_gallery: 'ప్రాజెక్ట్స్ గ్యాలరీ',
        electrical_lighting: 'ఎలక్ట్రికల్ & లైటింగ్'
      },
      hero: {
        tagline: 'ఇంటీరియర్, ఎలక్ట్రికల్ & లైటింగ్ సేవలు భారతదేశం అంతటా అందుబాటులో 🇮🇳',
        subtagline: 'మేము భారతదేశం అంతటా నిపుణమైన ఇంటీరియర్ డిజైన్, ఎలక్ట్రికల్ పరిష్కారాలు మరియు ఆధునిక లైటింగ్ సేవలు అందిస్తాము.',
        cta: 'డిజైన్లను చూడండి'
      },
      common: {
        search: 'డిజైన్ల కొరకు వెతకండి...',
        all: 'అన్నీ',
        whatsapp_btn: 'వాట్సాప్‌లో సంప్రదించండి',
        call_now: 'ఇప్పుడే కాల్ చేయండి',
        chat_whatsapp: 'వాట్సాప్‌లో చాట్ చేయండి',
        view_details: 'వివరాలు చూడండి',
        back: 'వెనుకకు',
        design_id: 'డిజైన్ ఐడి',
        category: 'విభాగం',
        description: 'వివరణ',
        admin_panel: 'అడ్మిన్ కంట్రోల్ ప్యానెల్',
        login: 'అడ్మిన్ లాగిన్',
        logout: 'లాగ్అవుట్',
        telugu: 'తెలుగు',
        english: 'English',
        years_exp: 'సంవత్సరాల అనుభవం',
        projects_completed: 'పూర్తయిన ప్రాజెక్టులు',
        satisfied_clients: 'సంతృప్తి చెందిన కస్టమర్లు',
        experience_title: 'మా ప్రయాణం & అనుభవం',
        team_title: 'మా నిపుణుల బృందం',
        works_title: 'పూర్తయిన పనుల గ్యాలరీ',
        contact_title: 'మమ్మల్ని సంప్రదించండి',
        location: 'మా చిరునామా & మ్యాప్',
        address_label: 'చిరునామా',
        phone_label: 'ఫోన్ నంబర్',
        email_label: 'ఈమెయిల్',
        showroom_title: 'మా షోరూమ్‌ను సందర్శించండి',
        showroom_hours: 'పని వేళలు',
        showroom_days: 'సోమవారం - ఆదివారం: ఉదయం 9:00 - రాత్రి 9:00',
        get_directions: 'మార్గదర్శకాలు పొందండి',
      },
      home: {
        categories_heading: 'మా విభాగాలు',
        featured_heading: 'అద్భుతమైన డిజైన్లు',
        about_title: '25 సంవత్సరాలకు పైగా మీ కలల ఇళ్లను సాకారం చేస్తున్నాము',
        about_p1: 'రాజమౌళి చారి గారి నాయకత్వంలో, రాజ రాజేశ్వరి ఇంటీరియర్ వర్క్స్ హోమ్ స్టైలింగ్ మరియు ఇంటీరియర్ డెకరేషన్ రంగంలో అగ్రగామిగా ఉంది. మేము అనుకూలీకరించదగిన చెక్క ఫిట్టింగ్‌లు, ఆధునిక ఫాల్స్ సీలింగ్‌లు, వాల్ ప్యానెలింగ్‌లు మరియు స్పేస్-సేవింగ్ మాడ్యులర్ కిచెన్‌లను అందిస్తాము.',
        about_p2: 'ప్రతి డిజైన్ కూడా సౌకర్యం, చక్కని రూపం మరియు మన్నికైన మెటీరియల్స్ కలయికతో రూపొందించబడింది, ఇది మీ హాల్, బెడ్‌రూమ్ మరియు వ్యాపార స్థలాలకు ఆధునిక విలాసాన్ని తెస్తుంది.',
        india_coverage_heading: 'భారతదేశం అంతటా కస్టమర్లకు సేవలు',
        india_coverage_text: 'రాజ రాజేశ్వరి ఇంటీరియర్ వర్క్స్ భారతదేశంలోని అన్ని రాష్ట్రాలు మరియు నగరాల్లో ఇంటీరియర్ డిజైన్, ఎలక్ట్రికల్ పని మరియు లైటింగ్ పరిష్కారాలను అందిస్తుంది.',
        india_trust: 'భద్రత, నాణ్యత మరియు కస్టమర్ సంతృప్తిపై దృష్టి సారించి భారతదేశం అంతటా నమ్మకమైన ఇంటీరియర్, ఎలక్ట్రికల్ మరియు లైటింగ్ సేవలు అందిస్తాము.',
        india_badge: '🇮🇳 భారతదేశం అంతటా అందుబాటులో'
      },
      experience: {
        highlights_title: 'అనుభవ ముఖ్యాంశాలు',
        founder_title: 'వ్యవస్థాపకులు & యజమాని',
        founder_desc: 'రాజమౌళి చారి గారు రాజ రాజేశ్వరి ఇంటీరియర్ వర్క్స్ వ్యవస్థాపకులు మరియు యజమాని. ఇంటీరియర్, ఎలక్ట్రికల్ మరియు లైటింగ్ రంగాలలో దశాబ్దాల అనుభవంతో, వారు తమ బృందాన్ని ఎంతో నిబద్ధత మరియు నైపుణ్యంతో ముందుకు నడిపిస్తున్నారు.',
        company_desc: 'రాజ రాజేశ్వరి ఇంటీరియర్ వర్క్స్ 25 సంవత్సరాలకు పైగా పరిశ్రమ అనుభవంతో నిండి ఉంది, భారతదేశం అంతటా అత్యుత్తమ నాణ్యత గల ఇంటీరియర్, ఎలక్ట్రికల్ మరియు లైటింగ్ పరిష్కారాలను అందిస్తుంది. 500 కంటే ఎక్కువ విజయవంతమైన ప్రాజెక్ట్‌లను పూర్తి చేసిన అనుభవంతో, మేము కస్టమర్ సంతృప్తి మరియు మన్నికకు కట్టుబడి ఉన్నాము. కస్టమర్లకు మరింత భరోసా కల్పించడానికి మేము మా సేవలపై 2 సంవత్సరాల వారంటీని కూడా అందిస్తున్నాము.'
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
