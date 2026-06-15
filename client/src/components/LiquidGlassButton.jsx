// LiquidGlassButton.jsx
import { motion } from 'framer-motion'

export default function LiquidGlassButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 
                 text-white font-medium overflow-hidden group shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
    >
      <span className="relative z-10">{children}</span>
      {/* Liquid blob that follows hover */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-cyan-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100"
        initial={{ scale: 0, x: '-50%', y: '-50%' }}
        whileHover={{ scale: 2 }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: '50%', filter: 'blur(20px)' }}
      />
    </motion.button>
  )
}
