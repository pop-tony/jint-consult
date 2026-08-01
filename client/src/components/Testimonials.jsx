import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function Testimonials() {
  const { siteContent } = useSiteSettings()
  const testimonials = siteContent.testimonials.items
  const title = siteContent.testimonials.title
  const [index, setIndex] = useState(0)

  return (
    <section id="testimonials" className="py-24 px-6 bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white text-center mb-16">
          {title}
        </h2>
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div key={index} initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }} className="glass rounded-3xl p-10 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {[...Array(testimonials[index].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-jint-red text-jint-red" />
                ))}
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-6">"{testimonials[index].text}"</p>
              <div className="text-gray-900 dark:text-white font-bold">{testimonials[index].name}</div>
            </motion.div>
          </AnimatePresence>

          <button onClick={() => setIndex(i => i === 0? testimonials.length - 1 : i - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 glass p-3 rounded-xl text-gray-900 dark:text-white cursor-pointer hover:scale-110 transition-transform">
            <ChevronLeft />
          </button>
          <button onClick={() => setIndex(i => i === testimonials.length - 1? 0 : i + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 glass p-3 rounded-xl text-gray-900 dark:text-white cursor-pointer hover:scale-110 transition-transform">
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  )
}
