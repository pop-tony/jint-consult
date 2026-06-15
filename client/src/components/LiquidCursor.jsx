import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function LiquidCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const move = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-6 h-6 rounded-full bg-jint-red/30 blur-md pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        animate={{ x: mousePos.x - 12, y: mousePos.y - 12 }}
        transition={{ type: 'spring', damping: 30, stiffness: 200 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-jint-red pointer-events-none z-[9999] hidden lg:block"
        animate={{ x: mousePos.x - 2, y: mousePos.y - 2 }}
        transition={{ type: 'spring', damping: 50, stiffness: 500 }}
      />
    </>
  )
}