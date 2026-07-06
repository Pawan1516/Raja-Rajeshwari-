export const PHONE_NUMBER   = import.meta.env.VITE_PHONE_NUMBER   ?? '+919989704779';
export const PHONE_DISPLAY  = import.meta.env.VITE_PHONE_DISPLAY  ?? '+91 99897 04779';
export const WA_NUMBER      = import.meta.env.VITE_WHATSAPP_NUMBER ?? '919989704779';

const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
export const API_BASE_URL   = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') 
  : (isLocal ? 'http://localhost:5000' : window.location.origin);
export const API_URL        = `${API_BASE_URL}/api`;

/** Builds a WhatsApp deeplink with a pre-filled message for a design */
export function buildWALink({ designId = '', categoryName = '', title = '', imageUrl = '' } = {}) {
  const message = `Hello Raja Rajeshwari Interior Works,

I am interested in the following design:

• Design ID   : ${designId}
• Category    : ${categoryName}
• Title       : ${title}
• Image       : ${imageUrl}

Kindly share the pricing and details. Thank you!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Builds a WhatsApp deeplink for Pan-India service inquiry */
export function buildWALinkIndia({ service = '', location = '' } = {}) {
  const message = `Hello Raja Rajeshwari Interior Works,

I am interested in your services:

Service: ${service || '<Interior / Electrical / Lighting>'}
Location: ${location || '<Your City>'}

Please confirm availability and pricing for my location.

Thank you!`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generic WhatsApp link (no design) — for footer, navbar etc. */
export const WA_GENERAL_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hello Raja Rajeshwari Interior Works,\n\nI would like to know more about your Interior, Electrical & Lighting services.\n\nService Available: All Over India 🇮🇳\n\nPlease get in touch. Thank you!')}`;

/** tel: href for click-to-call */
export const TEL_LINK = `tel:${PHONE_NUMBER}`;

