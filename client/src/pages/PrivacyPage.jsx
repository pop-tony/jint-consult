import { Link } from 'react-router-dom'

const sections = [
  {
    title: 'Information we collect',
    body: 'When you contact or book with us, we may collect your name, email address, phone number, appointment details, service request, and any message or documents you choose to provide. We may also receive basic technical information needed to keep the website secure and functioning.',
  },
  {
    title: 'How we use information',
    body: 'We use information to respond to enquiries, arrange consultations, provide requested services, communicate about bookings, improve our website and services, maintain records, and meet legal or security obligations.',
  },
  {
    title: 'Sharing information',
    body: 'We do not sell personal information. We may share information with trusted providers that help us operate the website, manage communications, process bookings, host media, or deliver an agreed service. We may also disclose information where required by law or to protect rights and safety.',
  },
  {
    title: 'Data retention',
    body: 'We keep personal information only for as long as reasonably needed for the purpose it was collected, ongoing client administration, dispute handling, legal requirements, or legitimate business records.',
  },
  {
    title: 'Security',
    body: 'We use reasonable administrative and technical measures to protect information. No internet transmission or storage system can be guaranteed completely secure, so please avoid sending sensitive information through an unsecured channel unless it is necessary for your request.',
  },
  {
    title: 'Cookies and third-party services',
    body: 'The website may use browser storage or similar technologies for preferences such as theme settings. Embedded maps, social links, analytics, hosting, and media services may process information under their own policies when you interact with them.',
  },
  {
    title: 'Your choices',
    body: 'You may contact us to ask what personal information we hold about you, request correction of inaccurate information, or ask about deletion where we are not required to retain it. We may need to verify your identity before acting on a request.',
  },
  {
    title: 'Children',
    body: 'Our services and website are intended for businesses and adults. We do not knowingly collect personal information from children through the website.',
  },
  {
    title: 'Updates to this policy',
    body: 'We may update this policy when our practices, services, or legal obligations change. The revised policy will be posted here with a new effective date.',
  },
]

export default function PrivacyPage() {
  return (
    <section className="px-6 py-20 bg-white dark:bg-black">
      <div className="max-w-4xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-jint-red">Legal</p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-5">Privacy Policy</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-12">Effective date: 8 October 2026</p>

        <div className="space-y-10">
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">This policy explains how Jint Consult handles personal information submitted through our website, enquiries, bookings, and client communications.</p>
          {sections.map(section => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{section.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-14 glass rounded-3xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Contact us</h2>
          <p className="text-gray-600 dark:text-gray-400">For privacy questions or requests, please <Link to="/contact" className="text-jint-red font-semibold hover:underline">contact Jint Consult</Link> or email info@jintconsult.com.</p>
        </div>
      </div>
    </section>
  )
}
