import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, LogIn } from 'lucide-react'
import { api } from '../lib/api'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setStatus('')

    try {
      const response = await api.post('/auth/login', data)

      if (!response.data?.success) {
        setStatus(response.data?.message || 'Login failed')
        return
      }

      const userResponse = await api.get('/user/data')

      if (!userResponse.data?.userData?.isAdmin) {
        setStatus('This account is not an admin account.')
        return
      }

      navigate('/admin', { replace: true })
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to sign in')
    }
  }

  return (
    <section className="min-h-screen px-4 py-24 bg-gray-50 dark:bg-black flex items-center justify-center">
      <div className="w-full max-w-md glass rounded-3xl p-8 md:p-10">
        <div className="inline-flex items-center gap-2 glass-red px-4 py-2 rounded-full text-jint-red font-semibold mb-6">
          <ShieldCheck className="w-4 h-4" />
          Admin Access
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Owner Dashboard Login</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Sign in with an admin account to manage bookings, enquiries, and site content.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <input
              {...register('email')}
              placeholder="Email address"
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
            />
            {errors.email && <p className="text-jint-red text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('password')}
              type="password"
              placeholder="Password"
              className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red"
            />
            {errors.password && <p className="text-jint-red text-sm mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-jint-red hover:bg-jint-red-dark text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-70"
          >
            {isSubmitting ? 'Signing in...' : 'Open Dashboard'}
            <LogIn className="w-4 h-4" />
          </button>

          {status && <p className="text-sm font-medium text-red-500">{status}</p>}
        </form>
      </div>
    </section>
  )
}
