import { consultationService } from '../data/services'
import ServiceBookingForm from '../components/ServiceBookingForm'

export default function BookConsultationPage() {
  return (
    <section className="px-4 md:px-6 py-20 bg-gray-50 dark:bg-zinc-950 min-h-screen">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1fr] gap-8 items-start">
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