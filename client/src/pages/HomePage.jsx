import { motion } from 'framer-motion'
import Hero3D from '../components/Hero3D'
import ServicesGrid from '../components/ServicesGrid'
import StatsLiquid from '../components/StatsLiquid'
import ProcessSection from '../components/ProcessSection'
import TeamSection from '../components/TeamSection'
import Testimonials from '../components/Testimonials'
import ContactSection from '../components/ContactSection'

const highlights = [
  {
    title: 'Office and consultation space',
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069',
  },
  {
    title: 'Business planning sessions',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
  },
  {
    title: 'Client support and document review',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070',
  },
]

export default function HomePage() {
  return (
    <>
      <Hero3D />

      <section className="py-16 px-4 md:px-6 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                className="glass rounded-3xl overflow-hidden"
              >
                <div className="relative h-56 md:h-72">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <p className="text-white font-semibold text-lg md:text-xl">{item.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StatsLiquid />
      <ProcessSection />
      <TeamSection />
      <Testimonials />
      <ContactSection />
    </>
  )
}