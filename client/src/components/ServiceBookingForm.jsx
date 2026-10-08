import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { CalendarDays, Clock3, Send } from 'lucide-react'
import { api } from '../lib/api'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
  notes: z.string().min(8, 'Please share a few details about what you need'),
})

export default function ServiceBookingForm({ service, title = 'Book this service', description }) {
  const [status, setStatus] = useState({ type: '', message: '' })
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      notes: `I would like to book ${service.title}.`,
    },
  })

  const onSubmit = async (data) => {
    setStatus({ type: '', message: '' })

    try {
      const formData = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        notes: data.notes,
        serviceName: service.title,
        serviceSlug: service.slug,
        servicePrice: service.price,
      }

      if (Number(service.price) > 0) {
        sessionStorage.setItem('jint-pending-booking', JSON.stringify(formData))
        setStatus({ type: 'pending', message: 'Redirecting you to secure payment...' })

        const response = await api.post('/order/initialize-payment', {
          formData: {
            email: data.email,
            serviceName: service.title,
            serviceSlug: service.slug,
            callbackUrl: `${window.location.origin}/book-consultation`,
          },
        })

        if (!response.data?.authorizationUrl) {
          throw new Error('Paystack did not return a payment URL')
        }

        window.location.assign(response.data.authorizationUrl)
        return
      }

      await api.post('/order/create-orderA', { formData })

      setStatus({ type: 'success', message: 'Booking submitted successfully. We will contact you shortly.' })
      reset({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        notes: `I would like to book ${service.title}.`,
      })
    } catch (error) {
      console.error('Booking submission failed:', error)
      setStatus({
        type: 'error',
        message: error?.response?.data?.message || 'We could not submit your booking. Please try again.',
      })
    }
  }

  return (
    <motion.form
      id="booking"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="glass rounded-3xl p-6 md:p-8 space-y-5"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description || `Complete the form to book ${service.title}.`}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <input
            {...register('name')}
            placeholder="Full Name"
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
          />
          {errors.name && <p className="text-jint-red text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input
            {...register('email')}
            placeholder="Email Address"
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
          />
          {errors.email && <p className="text-jint-red text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <input
            {...register('phone')}
            placeholder="Phone Number"
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
          />
          {errors.phone && <p className="text-jint-red text-sm mt-1">{errors.phone.message}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              {...register('date')}
              type="date"
              className="w-full glass rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-jint-red"
            />
          </div>
          <div className="relative">
            <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              {...register('time')}
              type="time"
              className="w-full glass rounded-xl pl-10 pr-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-jint-red"
            />
          </div>
        </div>
      </div>

      <div>
        <textarea
          {...register('notes')}
          rows={5}
          placeholder="Tell us what you need help with..."
          className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
        />
        {errors.notes && <p className="text-jint-red text-sm mt-1">{errors.notes.message}</p>}
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Booking fee: <span className="font-semibold text-gray-900 dark:text-white">{service.priceLabel}</span>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 bg-jint-red hover:bg-jint-red-dark text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSubmitting ? 'Submitting...' : Number(service.price) > 0 ? 'Continue to payment' : 'Submit request'}
          <Send className="w-4 h-4" />
        </button>
      </div>

      {status.message && (
        <p className={`text-sm font-medium ${status.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
          {status.message}
        </p>
      )}
    </motion.form>
  )
}