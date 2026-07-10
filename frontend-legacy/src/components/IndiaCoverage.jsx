import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, CheckCircle } from 'lucide-react';
import { TEL_LINK, WA_GENERAL_LINK, PHONE_DISPLAY } from '../constants';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

export default function IndiaCoverage() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-forest-dark/95 to-slate-900 py-16">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(46,125,50,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-forest/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-wood/30 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* India Badge */}
            <motion.div variants={fadeUp} className="flex items-center gap-3">
              <span className="text-4xl">🇮🇳</span>
              <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full backdrop-blur-sm">
                {t('home.india_badge')}
              </span>
            </motion.div>

            <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl font-outfit font-extrabold text-white leading-tight">
              {t('home.india_coverage_heading')}
            </motion.h2>

            <motion.p variants={fadeUp} custom={2} className="text-slate-300 text-base leading-relaxed">
              {t('home.india_coverage_text')}
            </motion.p>

            {/* Trust statement */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm"
            >
              <p className="text-slate-200 text-sm leading-relaxed italic">
                &ldquo;{t('home.india_trust')}&rdquo;
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-4">
              <a
                href={WA_GENERAL_LINK}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-whatsapp hover:bg-whatsappdark text-white px-6 py-3 rounded-full font-bold text-sm transition-smooth shadow-lg md:hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Get Free Quote</span>
              </a>
              <a
                href={TEL_LINK}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold text-sm transition-smooth md:hover:scale-105 active:scale-95"
              >
                <Phone className="w-4 h-4" />
                <span>{PHONE_DISPLAY}</span>
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Service Coverage Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            {[
              {
                icon: '🏠',
                title: 'Interior Works',
                items: ['Residential', 'Commercial', 'Modular', 'Ceiling & Wall'],
                color: 'from-amber-500/20 to-amber-600/10',
                border: 'border-amber-500/30'
              },
              {
                icon: '⚡',
                title: 'Electrical Works',
                items: ['House Wiring', 'Commercial', 'Smart Home', 'Power Backup'],
                color: 'from-yellow-500/20 to-yellow-600/10',
                border: 'border-yellow-500/30'
              },
              {
                icon: '💡',
                title: 'Lighting Works',
                items: ['LED Lights', 'Chandeliers', 'Smart Lights', 'Cove Lighting'],
                color: 'from-blue-500/20 to-blue-600/10',
                border: 'border-blue-500/30'
              }
            ].map((service, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className={`bg-gradient-to-b ${service.color} border ${service.border} rounded-2xl p-5 backdrop-blur-sm flex flex-col gap-3`}
              >
                <div className="text-3xl">{service.icon}</div>
                <h3 className="text-white font-outfit font-extrabold text-sm">{service.title}</h3>
                <ul className="space-y-1">
                  {service.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300 text-xs">
                      <CheckCircle className="w-3 h-3 text-forest-light shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-3 border-t border-white/10">
                  <span className="text-xs text-slate-400 font-semibold">🇮🇳 Pan India Available</span>
                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
