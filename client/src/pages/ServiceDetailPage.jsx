import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BadgeCheck, Sparkles } from 'lucide-react'
import { getServiceBySlug } from '../data/services'
import ServiceBookingForm from '../components/ServiceBookingForm'

export default function ServiceDetailPage() {
  const { serviceSlug } = useParams()
  const service = getServiceBySlug(serviceSlug)

  if (!service) {
    return (
      <section className="min-h-screen px-6 py-24">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Service not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The service you requested does not exist.</p>
          <Link to="/services" className="btn-jint inline-flex">
            Back to Services
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 md:px-6 py-20 bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto space-y-10 md:space-y-14">
        <Link to="/services" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to services
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl overflow-hidden"
          >
            <div className="relative h-[340px] md:h-[480px]">
              <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <span className="inline-flex items-center gap-2 glass-red px-4 py-2 rounded-full text-jint-red font-semibold text-sm mb-4">
                  <Sparkles className="w-4 h-4" />
                  {service.priceLabel}
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{service.title}</h1>
                <p className="text-white/85 max-w-2xl text-base md:text-lg">{service.desc}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-6">
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{service.overview}</p>
              <div className="space-y-3">
                {service.features.map(feature => (
                  <div key={feature} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                    <BadgeCheck className="w-5 h-5 text-jint-red mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {service.gallery.map((image, index) => (
                <div key={image} className="glass rounded-2xl overflow-hidden h-28 md:h-36">
                  <img src={image} alt={`${service.title} ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-start">
          <div className="glass rounded-3xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Why book this service</h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li>Fast, direct support from the consulting team.</li>
              <li>Clear next steps after your booking is submitted.</li>
              <li>Tailored guidance based on your service needs.</li>
            </ul>
          </div>

          <ServiceBookingForm
            service={service}
            title={`Book ${service.shortTitle}`}
            description={`Reserve a time slot for ${service.title} and tell us a bit about your request.`}
          />
        </div>
      </div>
    </section>
  )
}