import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { teamService } from '../services/api';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
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

export default function OurTeam() {
  const { t, i18n } = useTranslation();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const data = await teamService.getAll();
        setTeamMembers(data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';
    if (imagePath.startsWith('/uploads')) {
      return `http://localhost:5000${imagePath}`;
    }
    return imagePath;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-outfit font-extrabold text-slate-900">
          {t('common.team_title')}
        </h1>
        <div className="w-16 h-1 bg-wood mx-auto mt-3 mb-4"></div>
        <p className="text-slate-500 text-sm sm:text-base">
          Our specialized team combines artistic conceptualization with heavy woodwork carpentry to build premium residential interiors.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-wood border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-20 text-slate-500 italic">
          No team members profiles found.
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member._id || index}
              variants={fadeUp}
              custom={index}
              className="bg-white rounded-2xl overflow-hidden shadow-premium shadow-premium-hover border border-slate-100 group flex flex-col"
            >
              <div className="aspect-[4/5] bg-slate-50 overflow-hidden relative shrink-0">
                <img
                  src={getImageUrl(member.image)}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-955/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-1 text-white text-xs font-bold bg-wood/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg w-max shadow-sm">
                  <Award className="w-3.5 h-3.5" />
                  <span>{member.exp} Exp</span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-outfit font-bold text-lg text-slate-900">
                    {member.name}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    {i18n.language === 'te' ? member.role_te : member.role}
                  </p>
                </div>
                
                <div className="flex items-center gap-1 pt-4 text-amber-500 text-xs shrink-0">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-slate-400 font-semibold ml-1">5.0 Star Specialist</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
