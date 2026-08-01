import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { FaLinkedinIn } from 'react-icons/fa';
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function TeamSection() {
  const { siteContent } = useSiteSettings()
  const team = siteContent.team

  return (
    <section id="team" className="py-16 md:py-24 px-4 md:px-6 bg-white dark:bg-black relative overflow-hidden">
      <div className="absolute top-40 right-10 w-60 h-60 md:w-80 md:h-80 bg-jint-red/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            {team.title}
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {team.subtitle}
          </p>
        </div>

        {/* 2 cols mobile, 4 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 lg:gap-8">
          {team.members.map((member, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }} whileHover={{ y: -4 }}
              className="glass rounded-2xl md:rounded-3xl overflow-hidden group cursor-default">
              <div className="relative h-40 md:h-64 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              <div className="p-3 md:p-6">
                <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-0.5 md:mb-1 line-clamp-1">{member.name}</h3>
                <div className="text-jint-red font-semibold text-[10px] md:text-sm mb-2 md:mb-3 line-clamp-1">{member.role}</div>
                <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-3 md:mb-4 line-clamp-2 hidden md:block">{member.bio}</p>

                <div className="flex gap-2">
                  <a href={member.linkedin} className="glass p-1.5 md:p-2 rounded-lg text-gray-700 dark:text-white/70 hover:text-jint-red transition-colors cursor-pointer">
                    <FaLinkedinIn className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                  <a href={`mailto:${member.email}`} className="glass p-1.5 md:p-2 rounded-lg text-gray-700 dark:text-white/70 hover:text-jint-red transition-colors cursor-pointer">
                    <Mail className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
