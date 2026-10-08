import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const siteUrl = (import.meta.env.VITE_SITE_URL || 'https://jintconsult.com').replace(/\/$/, '')

const pageMetadata = {
  '/': {
    title: 'Jint Consult | Tax & Accounting Solutions',
    description: 'Professional tax, accounting, audit, compliance, and business consulting services in Ghana.',
  },
  '/services': {
    title: 'Services | Jint Consult',
    description: 'Explore tax, accounting, audit, compliance, documentation, and financial advisory services from Jint Consult.',
  },
  '/about': {
    title: 'About Jint Consult',
    description: 'Learn about Jint Consult history, company news, clients, and gallery.',
  },
  '/privacy': {
    title: 'Privacy Policy | Jint Consult',
    description: 'Read the Jint Consult privacy policy and how we handle personal information.',
  },
  '/terms': {
    title: 'Terms and Conditions | Jint Consult',
    description: 'Read the Jint Consult terms and conditions for website use and services.',
  },
  '/book-consultation': {
    title: 'Book a Consultation | Jint Consult',
    description: 'Schedule a consultation with Jint Consult for practical financial and business guidance.',
  },
  '/process': {
    title: 'Our Process | Jint Consult',
    description: 'See how Jint Consult moves from consultation to tailored implementation and ongoing support.',
  },
  '/team': {
    title: 'Our Team | Jint Consult',
    description: 'Meet the Jint Consult team providing professional financial and business support in Ghana.',
  },
  '/testimonials': {
    title: 'Client Testimonials | Jint Consult',
    description: 'Read what clients say about working with Jint Consult.',
  },
  '/contact': {
    title: 'Contact Jint Consult',
    description: 'Contact Jint Consult in Accra, Ghana for tax, accounting, audit, and business consulting support.',
  },
}

function setMeta(name, content) {
  let element = document.querySelector(`meta[name="${name}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('name', name)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function setProperty(property, content) {
  let element = document.querySelector(`meta[property="${property}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute('property', property)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

export default function Seo() {
  const location = useLocation()

  useEffect(() => {
    const isAdmin = location.pathname.startsWith('/admin')
    const isServiceDetail = location.pathname.startsWith('/services/')
    const metadata = pageMetadata[location.pathname] || (isServiceDetail
      ? {
          title: 'Service Details | Jint Consult',
          description: 'Learn more about professional services from Jint Consult.',
        }
      : pageMetadata['/'])
    const canonicalUrl = `${siteUrl}${location.pathname}`

    document.title = metadata.title
    setMeta('description', metadata.description)
    setMeta('robots', isAdmin ? 'noindex, nofollow' : 'index, follow')
    setProperty('og:title', metadata.title)
    setProperty('og:description', metadata.description)
    setProperty('og:url', canonicalUrl)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl)
  }, [location.pathname])

  return null
}