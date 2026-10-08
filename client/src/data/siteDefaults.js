import { consultationService, serviceSubjects, services } from './services.js'

export const defaultSiteContent = {
  brand: {
    name: 'Jint Consult',
  },
  hero: {
    eyebrow: 'Trusted in Ghana Since 2018',
    title: 'Professional Tax & Accounting Solutions',
    subtitle: 'Jint Consult delivers comprehensive tax, accounting, business consulting, certification, and audit services. Strategic financial guidance for individuals and businesses.',
    primaryCtaLabel: 'Book Consultation',
    primaryCtaLink: '/book-consultation',
    secondaryCtaLabel: 'Our Services',
    secondaryCtaLink: '#services',
    backgroundImage: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069',
  },
  highlights: [
    {
      title: 'Office and consultation space',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069',
    },
    {
      title: 'Business planning sessions',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
    },
    {
      title: 'Client support and document review',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2070',
    },
  ],
  stats: [
    { value: 500, label: 'Clients Served', suffix: '+' },
    { value: 99, label: 'Satisfaction Rate', suffix: '%' },
    { value: 8, label: 'Years Experience', suffix: '+' },
    { value: 2400, label: 'Returns Filed', suffix: '+' },
  ],
  services,
  process: {
    title: 'How It Works',
    subtitle: 'From consultation to implementation. Simplified professional services.',
    whatsappNumber: '233XXXXXXXXX',
    whatsappMessage: 'Hello Jint Consult, I need help with...',
    steps: [
      { title: 'Consultation', desc: 'Schedule a meeting to discuss your financial goals and needs' },
      { title: 'Analysis & Planning', desc: 'Our experts review your situation and develop tailored solutions' },
      { title: 'Implementation & Support', desc: 'We execute the plan and provide ongoing guidance' },
    ],
  },
  about: {
    title: 'About Jint Consult',
    subtitle: 'Practical professional services for people and businesses building a stronger future.',
    historyTitle: 'Our history',
    history: 'Jint Consult has grown through a simple commitment: give every client clear guidance, dependable execution, and support they can trust. From tax and accounting to business, technology, and creative services, we help clients move forward with confidence.',
    news: [
      {
        title: 'Jint Consult expands its IT Services offering',
        date: '2026',
        body: 'Our new web, technology consulting, and graphic design services help businesses build and communicate online.',
        image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2070',
      },
    ],
    gallery: [
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069',
        title: 'Our consultation space',
      },
      {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070',
        title: 'Business planning session',
      },
    ],
    clients: [
      { name: 'Client organisation', description: 'Professional support and practical guidance.' },
    ],
  },
  team: {
    title: 'Meet The Team',
    subtitle: 'Real people handling your documents with care, speed, and legal expertise',
    members: [
      {
        name: 'James Nketiah',
        role: 'Founder & Lead Consultant',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974',
        bio: '15+ years in government documentation',
        linkedin: '#',
        email: 'james@jintconsult.com',
      },
      {
        name: 'Grace Mensah',
        role: 'Operations Manager',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974',
        bio: 'Ensures every application is processed',
        linkedin: '#',
        email: 'grace@jintconsult.com',
      },
      {
        name: 'Kwesi Boateng',
        role: 'Car Sales Lead',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974',
        bio: 'Verified vehicles with clean docs',
        linkedin: '#',
        email: 'kwesi@jintconsult.com',
      },
      {
        name: 'Ama Osei',
        role: 'Client Relations',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976',
        bio: 'Your first point of contact',
        linkedin: '#',
        email: 'ama@jintconsult.com',
      },
    ],
  },
  testimonials: {
    title: 'Client Love',
    items: [
      { name: 'Kwame A.', text: 'Got my passport in 2 weeks. Jint Consult is legit!', rating: 5 },
      { name: 'Akosua M.', text: 'They handled my company registration without stress. Highly recommend.', rating: 5 },
      { name: 'Joseph T.', text: 'Best car sales service. All documents were clean.', rating: 5 },
    ],
  },
  contact: {
    title: 'Submit an Inquiry',
    subtitle: 'Visit us at our office or send a message using the form.',
    phone: '+233 534958619',
    phoneNumbers: ['+233 534958619'],
    email: 'info@jintconsult.com',
    address: '14 Abuja Street Ritz Junction, Madina Accra\nGreater Accra, Ghana',
    mapQuery: '14 Abuja Street Ritz Junction, Madina Accra, Greater Accra, Ghana',
    subjects: serviceSubjects,
  },
  footer: {
    socialLinks: [
      { label: 'Facebook', href: 'https://facebook.com/jintconsult' },
      { label: 'Instagram', href: 'https://instagram.com/jintconsult' },
      { label: 'Twitter', href: 'https://twitter.com/jintconsult' },
      { label: 'LinkedIn', href: 'https://linkedin.com/company/jintconsult' },
      { label: 'WhatsApp', href: 'https://wa.me/233534958619' },
    ],
    address: '14 Abuja Street Ritz Junction, Madina Accra\nGreater Accra, Ghana',
    phone: '+233 534958619',
    email: 'info@jintconsult.com',
    copyright: '© 2026 Jint Consult. All rights reserved.',
  },
  booking: {
    consultation: consultationService,
  },
}
