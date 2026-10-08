import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldCheck, LogIn, Mail, KeyRound, UserPlus } from 'lucide-react'
import { api } from '../lib/api'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const resetSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit OTP'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
})

const signupSchema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  number: z.string().min(7, 'Enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  adminKey: z.string().min(1, 'Enter the admin setup key'),
})

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')
  const [showReset, setShowReset] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [showSignup, setShowSignup] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data) => {
    setStatus('')

    try {
      const response = await api.post('/auth/admin-login', data)

      if (!response.data?.success) {
        setStatus(response.data?.message || 'Login failed')
        return
      }

      navigate('/admin', { replace: true })
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to sign in')
    }
  }

  const requestResetOtp = async (event) => {
    event.preventDefault()
    const email = event.currentTarget.email.value
    const emailResult = z.string().email('Enter a valid email').safeParse(email)

    if (!emailResult.success) {
      setStatus(emailResult.error.issues[0].message)
      return
    }

    setStatus('')
    try {
      const response = await api.post('/auth/send-reset-otp', { email })

      if (!response.data?.success) {
        setStatus(response.data?.message || 'Unable to send OTP')
        return
      }

      setResetEmail(email)
      setOtpSent(true)
      setStatus('OTP sent. Check the admin email inbox.')
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to send OTP')
    }
  }

  const resetPassword = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const result = resetSchema.safeParse(Object.fromEntries(formData.entries()))

    if (!result.success) {
      setStatus(result.error.issues[0].message)
      return
    }

    setStatus('')
    try {
      const response = await api.put('/auth/reset-password', {
        email: resetEmail,
        ...result.data,
      })

      if (!response.data?.success) {
        setStatus(response.data?.message || 'Unable to reset password')
        return
      }

      setShowReset(false)
      setOtpSent(false)
      setStatus('Password updated. You can now sign in.')
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to reset password')
    }
  }

  const adminSignup = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const values = Object.fromEntries(formData.entries())
    const result = signupSchema.safeParse(values)

    if (!result.success) {
      setStatus(result.error.issues[0].message)
      return
    }

    setStatus('')
    try {
      const response = await api.post('/auth/admin-signup', result.data)

      if (!response.data?.success) {
        setStatus(response.data?.message || 'Unable to create admin account')
        return
      }

      navigate('/admin', { replace: true })
    } catch (error) {
      setStatus(error?.response?.data?.message || 'Unable to create admin account')
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

        <button
          type="button"
          onClick={() => { setShowReset(value => !value); setShowSignup(false); setStatus('') }}
          className="mt-6 text-sm font-semibold text-jint-red hover:underline"
        >
          {showReset ? 'Back to sign in' : 'Forgot admin password?'}
        </button>

        {showReset && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reset admin password</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">We will send a 6-digit OTP to your admin email.</p>
            {!otpSent ? (
              <form onSubmit={requestResetOtp} className="space-y-4">
                <input name="email" type="email" placeholder="Admin email address" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 glass-red text-jint-red py-3 rounded-xl font-semibold">
                  Send OTP <Mail className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={resetPassword} className="space-y-4">
                <input name="otp" inputMode="numeric" pattern="[0-9]{6}" maxLength="6" placeholder="6-digit OTP" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
                <input name="newPassword" type="password" placeholder="New password" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-jint-red hover:bg-jint-red-dark text-white py-3 rounded-xl font-semibold">
                  Update password <KeyRound className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => setOtpSent(false)} className="w-full text-sm text-gray-500 hover:text-jint-red">Use a different email</button>
              </form>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={() => { setShowSignup(value => !value); setShowReset(false); setStatus('') }}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-jint-red"
        >
          {showSignup ? 'Back to sign in' : 'Create admin account'}
          <UserPlus className="w-4 h-4" />
        </button>

        {showSignup && (
          <div className="mt-6 border-t border-gray-200 dark:border-gray-800 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create admin account</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">Use the private admin setup key to create a dashboard account.</p>
            <form onSubmit={adminSignup} className="space-y-4">
              <input name="name" placeholder="Full name" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
              <input name="email" type="email" placeholder="Email address" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
              <input name="number" type="tel" placeholder="Phone number" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
              <input name="password" type="password" placeholder="Password" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
              <input name="adminKey" type="password" placeholder="Admin setup key" className="w-full glass rounded-xl px-4 py-3 text-gray-900 dark:text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-jint-red" required />
              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 bg-jint-red hover:bg-jint-red-dark text-white py-3 rounded-xl font-semibold">
                Create account <UserPlus className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  )
}
