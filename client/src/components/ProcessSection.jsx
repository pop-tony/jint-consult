import { motion } from 'framer-motion'
import { Send, Cog, CheckCircle, MessageCircle } from 'lucide-react'
import { useSiteSettings } from '../context/SiteSettingsContext'

export default function ProcessSection() {
  const { siteContent } = useSiteSettings()
  const process = siteContent.process
  const steps = process.steps.map((step, index) => ({ ...step, icon: [Send, Cog, CheckCircle][index] }))
  const whatsappNumber = process.whatsappNumber
  const whatsappMessage = encodeURIComponent(process.whatsappMessage)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

  return (
    <section id="process" className="py-16 md:py-24 px-4 md:px-6 bg-white dark:bg-black">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white text-center mb-4 md:mb-6">
          {process.title}
        </h2>
        <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-10 md:mb-16 max-w-2xl mx-auto">
          {process.subtitle}
        </p>

        {/* 1 col mobile, 3 on md */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-8 mb-10 md:mb-12">
          {steps.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.15 }}
              className="text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-2xl md:rounded-3xl glass-red flex items-center justify-center mb-4 md:mb-6">
                <step.icon className="w-8 h-8 md:w-10 md:h-10 text-jint-red" />
              </div>
              <div className="text-jint-red font-bold mb-1 md:mb-2 text-sm md:text-base">Step {i + 1}</div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{step.title}</h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          className="text-center">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 md:gap-3 bg-[#25D366] hover:bg-[#20BA5A] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold transition-all hover:scale-105 cursor-pointer shadow-lg shadow-[#25D366]/25 text-sm md:text-base">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
            Chat with us on WhatsApp
          </a>
          <p className="text-gray-500 dark:text-gray-500 text-xs md:text-sm mt-3 md:mt-4">
            Fastest response time • Available 9am - 6pm GMT
          </p>
        </motion.div>
      </div>
    </section>
  )
}
