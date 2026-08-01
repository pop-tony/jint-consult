import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { api } from '../lib/api'
import { serviceSubjects } from '../data/services'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone number is required'),
  subject: z.string().min(1, 'Select a subject'),
  message: z.string().min(10, 'Message too short')
})

export default function ContactSection() {
  const [status, setStatus] = useState({ type: '', message: '' })
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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12"
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Submit an <span className="text-jint-red">Inquiry</span>
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
          {serviceSubjects.map(subject => (
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
    </section>
  )
}