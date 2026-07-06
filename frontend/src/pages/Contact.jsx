import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { inquiryService } from '../services/api';
import { TEL_LINK, WA_GENERAL_LINK, PHONE_DISPLAY } from '../constants';

export default function Contact() {
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Living Room Design',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const servicesList = [
    'Living Room Design',
    'Modular Kitchen',
    'Bedroom Interior',
    'TV Unit Design',
    'False Ceiling Works',
    'Wall Paneling & Cladding',
    'Flooring (Wooden/Marble)',
    'Custom Furniture Works',
    'Electrical Wiring',
    'Smart Home Automation',
    'Lighting (Indoor/Outdoor)',
    'Painting & Decorative Finish',
    'Other Service'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        throw new Error(i18n.language === 'te' ? 'దయచేసి అన్ని ఫీల్డులను పూర్తి చేయండి.' : 'Please fill out all required fields.');
      }

      await inquiryService.create(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: 'Living Room Design',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err.message || (i18n.language === 'te' ? 'సందేశం పంపడం విఫలమైంది.' : 'Failed to send message. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20">
      
      {/* ─── BANNER HEADER ─── */}
      <section className="bg-slate-900 text-white py-16 mb-12 border-b-4 border-wood relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,90,43,0.1)_0%,transparent_60%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <span className="text-wood-light uppercase text-xs font-semibold tracking-widest block mb-2 font-sans">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-outfit font-extrabold tracking-tight">
            {t('common.contact_title')}
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-4 leading-relaxed font-sans">
            {i18n.language === 'te'
              ? 'మా బృందాన్ని సంప్రదించి మీ కలల ఇళ్లకు ఉచిత కొటేషన్ పొందండి.'
              : 'Have a project query or need a customized quote? Message our expert designers and engineers directly.'}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ─── CONTACT INFORMATION (5 Cols) ─── */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Showroom Details Box */}
            <div className="glass-premium rounded-3xl border border-amber-500/10 p-8 space-y-6 shadow-glow-gold">
              <h3 className="font-outfit font-extrabold text-xl text-slate-900 border-b border-slate-200/60 pb-3">
                Raja Rajeshwari Interior Works
              </h3>
              
              <ul className="space-y-6 text-sm">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-wood/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-wood" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.address_label')}</span>
                    <span className="text-slate-500 leading-relaxed">
                      S.V Moon lake apartments, Narendra Nagar Colony,<br />
                      Ameenpur, Miyapur, Hyderabad, Telangana 502032
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-forest" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.phone_label')}</span>
                    <a href={TEL_LINK} className="text-slate-500 hover:text-forest transition-smooth font-medium">
                      {PHONE_DISPLAY}
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.email_label')}</span>
                    <a href="mailto:rajamoulichary20@gmail.com" className="text-slate-500 hover:text-blue-600 transition-smooth">
                      rajamoulichary20@gmail.com
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 block mb-0.5">{t('common.showroom_hours')}</span>
                    <span className="text-slate-500">{t('common.showroom_days')}</span>
                  </div>
                </li>
              </ul>

              {/* Chat on WhatsApp action */}
              <div className="pt-4 border-t border-slate-550/40">
                <a
                  href={WA_GENERAL_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsappdark text-white py-3 rounded-xl text-xs font-bold transition-smooth shadow-sm"
                >
                  <MessageSquare className="w-4.5 h-4.5" />
                  <span>{t('common.chat_whatsapp')}</span>
                </a>
              </div>
            </div>

            {/* Embedded Mini Map */}
            <div className="w-full h-72 rounded-3xl overflow-hidden border border-slate-100 shadow-premium relative bg-slate-50">
              <iframe
                title="Raja Rajeshwari Interior Works Showroom Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.29740523275!2d78.3377727!3d17.5051664!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91f1f0aef7ff%3A0x2a9cb9b09db4681!2sAmeenpur%2C%20Hyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

          {/* ─── CONTACT SUBMISSION FORM (7 Cols) ─── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-premium space-y-6">
              
              <h3 className="font-outfit font-extrabold text-xl text-slate-900 border-b border-slate-100 pb-3">
                {i18n.language === 'te' ? 'విచారణ ఫారమ్' : 'Submit An Inquiry'}
              </h3>

              {success && (
                <div className="bg-forest/10 border border-forest/20 text-forest text-xs font-semibold p-4 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{i18n.language === 'te' ? 'మీ విచారణ విజయవంతంగా సమర్పించబడింది! మేము త్వరలోనే సంప్రదిస్తాము.' : 'Your message has been sent successfully! We will connect with you shortly.'}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-xs font-semibold p-4 rounded-xl flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-700 block">
                    {i18n.language === 'te' ? 'పూర్తి పేరు *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g. Rajamouli Chary"
                    className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth"
                  />
                </div>

                {/* Email & Phone grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-700 block">
                      {i18n.language === 'te' ? 'ఈమెయిల్ *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-700 block">
                      {i18n.language === 'te' ? 'ఫోన్ నంబర్ *' : 'Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth"
                    />
                  </div>
                </div>

                {/* Service Dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="service" className="text-xs font-bold text-slate-700 block">
                    {i18n.language === 'te' ? 'కావాల్సిన సేవ *' : 'Service Required *'}
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth cursor-pointer"
                  >
                    {servicesList.map((srv, i) => (
                      <option key={i} value={srv}>
                        {srv}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-700 block">
                    {i18n.language === 'te' ? 'మీ సందేశం / వివరాలు *' : 'Your Message *'}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us about your room size, requirements, and design expectations..."
                    className="w-full bg-slate-50 text-slate-800 text-sm px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:bg-white focus:border-wood transition-smooth resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-wood hover:bg-wood-dark disabled:opacity-75 text-white px-6 py-3.5 rounded-xl font-bold text-xs transition-smooth shadow-premium"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Submitting...' : 'Send Message'}</span>
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
