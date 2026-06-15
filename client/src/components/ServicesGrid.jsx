import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const services = [
  {
    title: 'Birth Certificate',
    desc: 'Fast processing for new & replacement certs',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070',
    tag: 'Popular'
  },
  {
    title: 'Passport',
    desc: 'New applications & renewals handled',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074',
    tag: 'Fast'
  },
  {
    title: 'Ghana Card',
    desc: 'Registration & replacement support',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2072',
    tag: null
  },
  {
    title: 'Certificate of Incorporation',
    desc: 'Register your business legally',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    tag: 'Business'
  },
  {
    title: 'Tax Filing',
    desc: 'Personal & business tax returns',
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=2026',
    tag: 'Seasonal'
  },
  {
    title: 'Car Sales',
    desc: 'Buy & sell vehicles with proper docs',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083',
    tag: 'Hot'
  },
]

export default function ServicesGrid() {
  return (
    <section id="services" className="py-16 md:py-24 px-4 md:px-6 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            What We <span className="text-jint-red">Handle</span>
          </h2>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            All government documents and business services under one roof. No queues, no stress.
          </p>
        </div>

        {/* 2 cols on mobile, 3 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 lg:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl md:rounded-3xl overflow-hidden group cursor-pointer"
            >
              {/* Image - shorter on mobile */}
              <div className="relative h-32 md:h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {service.tag && (
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-jint-red text-white text-[10px] md:text-xs font-bold px-2 md:px-3 py-0.5 md:py-1 rounded-full">
                    {service.tag}
                  </div>
                )}

                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-7 h-7 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <ArrowUpRight className="w-3 h-3 md:w-5 md:h-5 text-white" />
                </div>
              </div>

              {/* Content - tighter padding on mobile */}
              <div className="p-3 md:p-6">
                <h3 className="text-sm md:text-xl font-bold text-gray-900 dark:text-white mb-1 md:mb-2 group-hover:text-jint-red transition-colors line-clamp-1">
                  {service.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {service.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
