import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Using this website',
    body: 'You may use this website to learn about Jint Consult, review our services, contact us, and request consultations. You agree to use the website lawfully and not to interfere with its operation, security, or availability.',
  },
  {
    title: 'Our services',
    body: 'Information on this website is provided for general guidance. A service engagement begins only after Jint Consult confirms the requested work, scope, timing, and applicable fees. We may ask for additional information before accepting or continuing an engagement.',
  },
  {
    title: 'Bookings and enquiries',
    body: 'Submitting a booking or enquiry does not guarantee acceptance or create a client relationship. We will contact you to confirm availability and next steps. You are responsible for providing accurate contact and request details.',
  },
  {
    title: 'Fees and payment',
    body: 'Any prices shown are indicative unless expressly confirmed by Jint Consult. Final fees, payment timing, and any third-party costs will be communicated before work begins or as otherwise agreed with you.',
  },
  {
    title: 'Client responsibilities',
    body: 'You must provide complete, accurate, and timely information needed for your request. Jint Consult is not responsible for delays or outcomes caused by inaccurate information, missing documents, late responses, or circumstances outside our reasonable control.',
  },
  {
    title: 'Intellectual property',
    body: 'The website design, text, branding, images, and other materials belong to Jint Consult or their respective rights holders. You may not copy, reproduce, modify, or commercially reuse them without permission.',
  },
  {
    title: 'Third-party links and services',
    body: 'The website may link to third-party services such as maps, social networks, payment providers, or communication platforms. Those services have their own terms and privacy practices, which Jint Consult does not control.',
  },
  {
    title: 'Disclaimers and liability',
    body: 'We aim to keep the website accurate and available, but we do not promise that every page will always be complete, current, or uninterrupted. To the extent allowed by law, Jint Consult is not liable for indirect losses arising from use of the website or reliance on general website information.',
  },
  {
    title: 'Updates to these terms',
    body: 'We may update these terms when our services, website, or legal obligations change. The updated version will be posted on this page with a revised effective date.',
  },
]

export default function TermsPage() {
  return (
    <section className="px-6 py-20 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-jint-red">Legal</p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-5">Terms and Conditions</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">Effective date: 8 October 2026</p>

        <div className="space-y-10">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">These terms explain how you may use the Jint Consult website and what to expect when you contact us or request our services.</p>
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 glass rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">For questions about these terms, please <Link to="/contact" className="text-jint-red font-semibold hover:underline">contact Jint Consult</Link>.</p>
        </div>
      </div>
    </section>
  )
}
