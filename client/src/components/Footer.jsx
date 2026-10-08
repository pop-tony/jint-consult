import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { useSiteSettings } from '../context/SiteSettingsContext'
import { useTheme } from '../context/ThemeProvider'
import assets from '../assets/assets.js'

export default function Footer() {
  const { siteContent } = useSiteSettings()
  const { theme } = useTheme()
  const footer = siteContent.footer
  const phoneNumbers = siteContent.contact?.phoneNumbers?.length
    ? siteContent.contact.phoneNumbers
    : [siteContent.contact?.phone || footer.phone].filter(Boolean)
  const socials = [FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, MessageCircle]

  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-flex mb-4 cursor-pointer">
              <img
                src={theme === 'dark' ? assets.jintDarkLogo : assets.jintLightLogo}
                alt={`${siteContent.brand.name} logo`}
                className="h-20 w-auto"
              />
            </a>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your trusted partner for tax, accounting, business consulting, audit, and compliance services in Ghana.
            </p>
            <div className="flex gap-3">
              {footer.socialLinks.map((social, i) => {
                const Icon = socials[i]
                return (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                     aria-label={social.label}
                     className="glass p-3 rounded-xl text-gray-700 dark:text-white/70 hover:text-jint-red hover:scale-110 transition-all cursor-pointer">
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Process', 'Team', 'Testimonials', 'Contact'].map(link => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`}
                     className="text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact Us</h4>
            <div className="space-y-4">
              {phoneNumbers.map((phoneNumber, index) => (
                <a
                  key={`${phoneNumber}-${index}`}
                  href={`tel:${String(phoneNumber).replace(/[^+\d]/g, '')}`}
                  className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors cursor-pointer"
                >
                  <Phone className="w-5 h-5 text-jint-red" />
                  {phoneNumber}
                </a>
              ))}
              <a href="mailto:info@jintconsult.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-jint-red" />
                info@jintconsult.com
              </a>
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-jint-red mt-1 flex-shrink-0" />
                <span className="whitespace-pre-line">{footer.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 dark:text-gray-500 text-sm">
          <div>{footer.copyright}</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-jint-red transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-jint-red transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}