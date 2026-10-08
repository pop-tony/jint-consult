import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeProvider'
import assets from '../assets/assets.js'

const links = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Process', to: '/process' },
  { label: 'Team', to: '/team' },
  { label: 'Contact', to: '/contact' },
]

export default function GlassNav() {

  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const goTo = (path) => {
    setOpen(false)
    navigate(path)
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="glass rounded-2xl px-6 flex items-center justify-between">
        <button type="button" onClick={() => goTo('/')} className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">
          {assets.jintLightLogo && assets.jintDarkLogo && (
            <img
              src={theme === 'dark' ? assets.jintDarkLogo : assets.jintLightLogo}
              alt="Jint Consult logo"
              className="h-20 w-auto"
            />
          )}
        </button>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <button key={link.to} type="button" onClick={() => goTo(link.to)} className="transition-colors cursor-pointer">
              {link.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(theme === 'dark'? 'light' : 'dark')}
            className="glass p-2 rounded-xl text-gray-900 dark:text-white cursor-pointer hover:scale-110 transition-transform">
            {theme === 'dark'? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-900 dark:text-white cursor-pointer">
            {open? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl mt-2 p-6 md:hidden">
          {links.map(link => (
            <button
              key={link.to}
              type="button"
              onClick={() => goTo(link.to)}
              className="block w-full text-left py-3 transition-colors text-gray-900 dark:text-white hover:text-jint-red"
            >
              {link.label}
            </button>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
