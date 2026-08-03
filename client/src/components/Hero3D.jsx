import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Hero3D() {
  const { siteContent } = useSiteSettings()
  const navigate = useNavigate()
  const hero = siteContent.hero
  const stats = siteContent.stats

  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden">
      {/* Clear Background Image - Full Cover */}
      <div className="absolute inset-0 z-0">
        <img 
          src={hero.backgroundImage} 
          alt="Jint Consult office"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability - adjust opacity as needed */}
        <div className="absolute inset-0 bg-black/50 dark:bg-black/60" />
        
        {/* Red gradient overlay for brand */}
        <div className="absolute inset-0 bg-gradient-to-br from-jint-red/20 via-transparent to-black/40" />
      </div>

      {/* Content floating on top */}
      <div className="relative z-10 container mx-auto min-h-screen flex items-center px-6 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Text Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="glass rounded-3xl p-8 md:p-12 backdrop-blur-2xl"
          >
            <div className="inline-block glass-red px-4 py-2 rounded-full mb-6">
              <span className="text-jint-red font-semibold text-sm">{hero.eyebrow}</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              {hero.title}
            </h1>
            
            <p className="text-lg text-white/90 mb-8 leading-relaxed">
              {hero.subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => navigate(hero.primaryCtaLink)}
                className="bg-jint-red hover:bg-jint-red-dark text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer shadow-2xl shadow-jint-red/40"
              >
                {hero.primaryCtaLabel}
              </button>
              <a href={hero.secondaryCtaLink} 
                 className="bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer">
                {hero.secondaryCtaLabel}
              </a>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white">8+</div>
                <div className="text-white/70 text-sm">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-white/70 text-sm">Clients Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-white/70 text-sm">Satisfaction</div>
              </div>
            </div>
          </motion.div>

          {/* Right: Floating Glass Stats Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block space-y-6"
          >
            {stats.slice(0, 3).map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ scale: 1.05, x: 10 }}
                className="glass rounded-2xl p-6 backdrop-blur-2xl cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{stat.value}{stat.suffix || ''}</div>
                    <div className="text-white/70 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="glass rounded-full p-3 animate-bounce cursor-pointer">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </motion.div>
    </section>
  )
}
