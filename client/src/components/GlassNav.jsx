import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
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
  const [open, setOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl"
    >
      <div className="glass rounded-2xl px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">
          {assets.jintLogo && (
            <img src={assets.jintLogo} alt="JintConsult Logo" className="h-20 w-auto" />
          )}
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `transition-colors cursor-pointer ${isActive ? 'text-jint-red font-semibold' : 'text-gray-700 dark:text-white/70 hover:text-jint-red'}`}
            >
              {link.label}
            </NavLink>
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
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => `block py-3 transition-colors ${isActive ? 'text-jint-red font-semibold' : 'text-gray-900 dark:text-white hover:text-jint-red'}`}
            >
              {link.label}
            </NavLink>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
