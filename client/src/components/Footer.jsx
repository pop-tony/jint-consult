import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import { FaTwitter, FaInstagram, FaFacebookF, FaLinkedinIn } from 'react-icons/fa';

export default function Footer() {
  const socials = [
    { icon: FaFacebookF, href: 'https://facebook.com/jintconsult', label: 'Facebook' },
    { icon: FaInstagram, href: 'https://instagram.com/jintconsult', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/jintconsult', label: 'Twitter' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com/company/jintconsult', label: 'LinkedIn' },
    { icon: MessageCircle, href: 'https://wa.me/233XXXXXXXXX', label: 'WhatsApp' },
  ]

  return (
    <footer className="bg-gray-50 dark:bg-zinc-950 border-t border-gray-200 dark:border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 cursor-pointer">
              Jint<span className="text-jint-red">Consult</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your trusted partner for government documents, tax filing & car sales in Ghana.
            </p>
            <div className="flex gap-3">
              {socials.map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                   aria-label={social.label}
                   className="glass p-3 rounded-xl text-gray-700 dark:text-white/70 hover:text-jint-red hover:scale-110 transition-all cursor-pointer">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {['Home', 'Services', 'Process', 'Team', 'Contact'].map(link => (
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
              <a href="tel:+233XXXXXXXXX" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors cursor-pointer">
                <Phone className="w-5 h-5 text-jint-red" />
                +233 XX XXX XXXX
              </a>
              <a href="mailto:info@jintconsult.com" className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-jint-red transition-colors cursor-pointer">
                <Mail className="w-5 h-5 text-jint-red" />
                info@jintconsult.com
              </a>
              <div className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                <MapPin className="w-5 h-5 text-jint-red mt-1 flex-shrink-0" />
                <span>East Legon, Accra<br />Greater Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 dark:text-gray-500 text-sm">
          <div>© 2026 Jint Consult. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-jint-red transition-colors cursor-pointer">Privacy Policy</a>
            <a href="#" className="hover:text-jint-red transition-colors cursor-pointer">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}