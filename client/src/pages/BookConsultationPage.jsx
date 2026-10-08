import { useEffect, useState } from 'react'
import { consultationService } from '../data/services'
import ServiceBookingForm from '../components/ServiceBookingForm'
import { api } from '../lib/api'

export default function BookConsultationPage() {
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentError, setPaymentError] = useState(false)

  useEffect(() => {
    const reference = new URLSearchParams(window.location.search).get('reference')
      || new URLSearchParams(window.location.search).get('trxref')
    if (!reference) return

    const pendingBooking = sessionStorage.getItem('jint-pending-booking')
    if (!pendingBooking) {
      console.error('Payment callback received without pending booking details:', reference)
      setPaymentError(true)
      setPaymentMessage('We received a payment response but could not match it to a booking. Please contact us.')
      return
    }

    const verify = async () => {
      try {
        setPaymentMessage('Confirming your payment...')
        const response = await api.post('/order/verify-payment', {
          reference,
          formData: JSON.parse(pendingBooking),
        })
        sessionStorage.removeItem('jint-pending-booking')
        window.history.replaceState({}, '', '/book-consultation')
        setPaymentError(false)
        setPaymentMessage(response.data?.message || 'Payment verified and booking received.')
      } catch (error) {
        console.error('Payment verification failed:', error)
        setPaymentError(true)
        setPaymentMessage(error?.response?.data?.message || 'We could not confirm your payment. Please contact us before trying again.')
      }
    }

    verify()
  }, [])

  return (
    <section className="px-4 md:px-6 py-20 bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
        {paymentMessage ? (
          <div className={`lg:col-span-2 rounded-2xl px-5 py-4 text-sm font-medium ${paymentError ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {paymentMessage}
          </div>
        ) : null}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="relative h-[300px] md:h-[520px]">
            <img
              src={consultationService.image}
              alt={consultationService.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <span className="inline-block glass-red px-4 py-2 rounded-full text-jint-red font-semibold text-sm mb-4">
                {consultationService.priceLabel}
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Book Consultation</h1>
              <p className="text-white/85 max-w-xl text-base md:text-lg">
                Schedule an introductory consultation so we can match you with the right service path.
              </p>
            </div>
          </div>
        </div>

        <ServiceBookingForm
          service={consultationService}
          title="Book Consultation"
          description="Use this booking form to reserve your consultation slot and tell us what you need help with."
        />
      </div>
    </section>
  )
}