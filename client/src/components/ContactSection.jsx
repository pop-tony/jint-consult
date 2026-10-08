import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { MapPin, Navigation, Send } from 'lucide-react'
import { api } from '../lib/api'
import { useSiteSettings } from '../context/SiteSettingsContext'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  subject: z.string().min(1, 'Select a subject'),
  message: z.string().min(10, 'Message too short')
})

export default function ContactSection() {
  const [status, setStatus] = useState({ type: '', message: '' })
  const { siteContent } = useSiteSettings()
  const contact = siteContent.contact
  const mapAddress = String(contact.mapQuery || '')
    .replace(/\bJnt Consult\b/gi, '')
    .replace(/\bJint Consult\b/gi, '')
    .replace(/^,\s*|,\s*$/g, '')
    .trim()
  const officeQuery = `Jint Consult, ${mapAddress}`
  const mapQuery = encodeURIComponent(officeQuery)
  const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' })

    try {
      await api.post('/order/consult', {
        formData: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          subject: data.subject,
        },
      })

      setStatus({ type: 'success', message: 'Inquiry sent successfully. We will contact you shortly.' })
      reset()
    } catch (error) {
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'Failed to send inquiry. Please try again.',
      })
    }
  }

  return (
    <section id='contact' className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.05fr] gap-8 items-start">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="p-8 md:p-10 border-b border-white/10 dark:border-white/10">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Find Us On The <span className="text-jint-red">Map</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {contact.subtitle}
            </p>
            <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <MapPin className="w-5 h-5 text-jint-red mt-1 flex-shrink-0" />
              <span className="whitespace-pre-line">{contact.address}</span>
            </div>
          </div>

          <div className="relative h-[420px]">
            <iframe
              title="Jint Consult location"
              src={mapSrc}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="p-6 md:p-8 flex flex-col sm:flex-row gap-3">
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-jint-red hover:bg-jint-red-dark text-white px-5 py-3 rounded-xl font-semibold transition-all hover:scale-105"
            >
              <Navigation className="w-4 h-4" />
              Open in Google Maps
            </a>
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 glass px-5 py-3 rounded-xl font-semibold text-gray-900 dark:text-white transition-all hover:scale-105"
            >
              Get directions
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-8 md:p-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {contact.title}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <input {...register('name')} placeholder="Full Name" 
                  className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" />
                {errors.name && <p className="text-jint-red text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register('email')} placeholder="Email Address" 
                  className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" />
                {errors.email && <p className="text-jint-red text-sm mt-1">{errors.email.message}</p>}
              </div>
            </div>
            
            <input {...register('phone')} placeholder="Phone Number" 
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" />
            {errors.phone && <p className="text-jint-red text-sm mt-1">{errors.phone.message}</p>}

            <select {...register('subject')}
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-jint-red cursor-pointer">
            <option value="" className="bg-white dark:bg-zinc-900">Select Subject</option>
            {contact.subjects.map(subject => (
              <option key={subject} value={subject} className="bg-white dark:bg-zinc-900">{subject}</option>
            ))}
          </select>

          {errors.subject && <p className="text-jint-red text-sm -mt-4">{errors.subject.message}</p>}
            
            <textarea {...register('message')} rows={5} placeholder="Tell us about your request..." 
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" />
            {errors.message && <p className="text-jint-red text-sm mt-1">{errors.message.message}</p>}


          <button type="submit"
            disabled={isSubmitting}
            className="w-full bg-jint-red hover:bg-jint-red-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer disabled:opacity-70 disabled:hover:scale-100">
            {isSubmitting ? 'Sending...' : 'Send Inquiry'} <Send className="w-4 h-4" />
          </button>
          {status.message && (
            <p className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
              {status.message}
            </p>
          )}
          </form>
        </motion.div>
      </div>
    </section>
  )
}