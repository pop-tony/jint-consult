import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  service: z.string().min(1, 'Select a service'),
  message: z.string().min(10, 'Message too short')
})

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data) => {
    console.log(data) // Replace with your API call
    alert('Inquiry sent! We’ll contact you in 24hrs.')
    reset()
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
          
          <select {...register('service')}
          className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-jint-red cursor-pointer">
          <option value="" className="bg-white dark:bg-zinc-900">Select Service</option>
          <option value="birth-cert" className="bg-white dark:bg-zinc-900">Birth Certificate</option>
          <option value="passport" className="bg-white dark:bg-zinc-900">Passport</option>
          <option value="gh-card" className="bg-white dark:bg-zinc-900">Ghana Card</option>
          <option value="incorporation" className="bg-white dark:bg-zinc-900">Certificate of Incorporation</option>
          <option value="tax" className="bg-white dark:bg-zinc-900">Tax Filing</option>
          <option value="car-sales" className="bg-white dark:bg-zinc-900">Car Sales</option>
          <option value="other" className="bg-white dark:bg-zinc-900">Other</option>
        </select>

        {errors.service && <p className="text-jint-red text-sm -mt-4">{errors.service.message}</p>}
          
          <textarea {...register('message')} rows={5} placeholder="Tell us about your request..." 
            className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" />
          {errors.message && <p className="text-jint-red text-sm mt-1">{errors.message.message}</p>}


        <button type="submit"
          className="w-full bg-jint-red hover:bg-jint-red-dark text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer">
          Send Inquiry <Send className="w-4 h-4" />
        </button>
        </form>
      </motion.div>
    </section>
  )
}
