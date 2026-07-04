import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, MapPin, MessageSquare, ChevronRight, Globe } from 'lucide-react';
import { TEL_LINK, WA_GENERAL_LINK, PHONE_DISPLAY } from '../constants';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 border-t-4 border-wood">

      {/* ── Pan India Service Banner ── */}
      <div className="bg-gradient-to-r from-forest-dark via-forest to-forest-dark py-2.5 px-4 text-center">
        <p className="text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 flex-wrap">
          <Globe className="w-3.5 h-3.5 shrink-0" />
          <span>🇮🇳 Service Available: All Over India</span>
          <span className="opacity-50">•</span>
          <span>Pan India Interior, Electrical &amp; Lighting Services</span>
        </p>
      </div>

      <div className="pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <h3 className="font-outfit font-extrabold text-xl tracking-tight text-white leading-none">
                RAJA RAJESHWARI
              </h3>
              <p className="font-sans font-semibold text-xs text-wood-light tracking-widest uppercase">
                Interior, Electrical &amp; Lighting Works
              </p>
              <p className="text-sm text-slate-400 leading-relaxed pt-1">
                {t('home.about_p1')}
              </p>
              {/* India Badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="text-lg">🇮🇳</span>
                <span className="text-xs font-bold text-white">{t('home.india_badge')}</span>
              </div>
              <div className="flex space-x-3 pt-1">
                <a
                  href={WA_GENERAL_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-whatsapp hover:bg-whatsappdark flex items-center justify-center text-white transition-smooth shadow-md"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a
                  href={TEL_LINK}
                  className="w-10 h-10 rounded-full bg-forest hover:bg-forest-dark flex items-center justify-center text-white transition-smooth shadow-call-glow"
                  title="Call Now"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Our Services */}
            <div className="space-y-4">
              <h4 className="text-white font-outfit font-semibold text-lg border-b border-slate-800 pb-2">
                Our Services
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  { name: '🏠 Interior Works', path: '/interior-works' },
                  { name: '⚡ Electrical Works', path: '/electrical-lighting' },
                  { name: '💡 Lighting Works', path: '/electrical-lighting' },
                  { name: 'Modular Kitchen', path: '/designs?category=Modular Kitchen' },
                  { name: 'False Ceiling Design', path: '/designs?category=False Ceiling Design' }
                ].map((item, index) => (
                  <li key={index}>
                    <Link to={item.path} className="hover:text-wood-light flex items-center gap-1 transition-smooth">
                      <ChevronRight className="w-3.5 h-3.5 text-wood" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div className="space-y-4">
              <h4 className="text-white font-outfit font-semibold text-lg border-b border-slate-800 pb-2">
                {t('common.contact_title')}
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-wood shrink-0 mt-0.5" />
                  <div>
                    <span className="text-slate-400">
                      Raja Rajeshwari Interior Works,<br />
                      S.V Moon Lake Apartments,<br />
                      Narendra Nagar Colony, Ameenpur,<br />
                      Miyapur, Hyderabad, Telangana 502032
                    </span>
                    <p className="text-xs text-forest-light font-semibold mt-1.5">
                      🇮🇳 Head Office — Service Across India
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-wood shrink-0 mt-0.5" />
                  <div>
                    <a href={TEL_LINK} className="hover:text-white transition-smooth text-slate-400 block">
                      {PHONE_DISPLAY}
                    </a>
                    <span className="text-xs text-slate-500">WhatsApp: {PHONE_DISPLAY}</span>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-wood shrink-0" />
                  <a href="mailto:rajamoulichary20@gmail.com" className="hover:text-white transition-smooth text-slate-400">
                    rajamoulichary20@gmail.com
                  </a>
                </li>
              </ul>

              {/* Quick-action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={TEL_LINK}
                  className="flex items-center gap-2 bg-forest hover:bg-forest-dark text-white px-4 py-2 rounded-full text-xs font-bold transition-smooth"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t('common.call_now')}</span>
                </a>
                <a
                  href={WA_GENERAL_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-whatsapp hover:bg-whatsappdark text-white px-4 py-2 rounded-full text-xs font-bold transition-smooth"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{t('common.chat_whatsapp')}</span>
                </a>
              </div>
            </div>

            {/* Column 4: Map Location */}
            <div className="space-y-4">
              <h4 className="text-white font-outfit font-semibold text-lg border-b border-slate-800 pb-2">
                {t('common.location')}
              </h4>
              <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-800 shadow-inner bg-slate-950 relative">
                <iframe
                  title="Raja Rajeshwari Interior Works Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.29740523275!2d78.3377727!3d17.5051664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f1f0aef7ff%3A0x2a9cb9b09db4681!2sAmeenpur%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0 opacity-80 hover:opacity-100 transition-smooth"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-800 pt-6 space-y-4">
            <div className="flex justify-center">
              <div className="bg-forest/15 border border-forest/25 rounded-full px-6 py-2">
                <p className="text-xs font-bold text-forest-light flex items-center gap-2 justify-center flex-wrap text-center">
                  <span>🇮🇳</span>
                  <span>Pan India Interior, Electrical &amp; Lighting Services — Serving All States &amp; Cities</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
              <p>© {new Date().getFullYear()} Raja Rajeshwari Interior Works. All rights reserved.</p>
              <p>Designed with ❤️ for premium quality craftsmanship across India.</p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
