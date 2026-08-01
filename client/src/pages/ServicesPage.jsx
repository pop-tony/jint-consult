import ServicesGrid from '../components/ServicesGrid'

export default function ServicesPage() {
  return (
    <>
      <section className="px-6 pt-32 pb-10 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
            Choose a <span className="text-jint-red">service</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
            Open any service to read the details and book it directly from the dedicated page.
          </p>
        </div>
      </section>
      <ServicesGrid />
    </>
  )
}