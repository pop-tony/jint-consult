import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeProvider'
import assets from '../assets/assets.js'

const links = ['Home', 'Services', 'Process', 'Contact']

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">
          {assets.jintLogo && (
            <img src={assets.jintLogo} alt="JintConsult Logo" className="h-20 w-auto" />
          )}
        </h1>

        <div className="hidden md:flex items-center gap-8">
          {links.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`}
               className="text-gray-700 dark:text-white/70 hover:text-jint-red transition-colors cursor-pointer">
              {link}
            </a>
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
            <a key={link} href={`#${link.toLowerCase()}`}
               className="block text-gray-900 dark:text-white py-3 cursor-pointer hover:text-jint-red">
              {link}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  )
}
