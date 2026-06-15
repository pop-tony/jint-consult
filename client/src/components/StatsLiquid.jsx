import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stats = [
  { value: 200, label: 'Docs Processed', suffix: '+' },
  { value: 98, label: 'Success Rate', suffix: '%' },
  { value: 24, label: 'Hour Support', suffix: '/7' },
  { value: 7, label: 'Years Experience', suffix: '+' },
]

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const end = value
    const duration = 2000
    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.ceil(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, value])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function StatsLiquid() {
  return (
    <section className="py-24 px-6 bg-white dark:bg-black relative overflow-hidden">
      {/* Floating orbs for complexity */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-jint-red/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-8 text-center hover:scale-105 transition-transform cursor-default">
              <div className="text-5xl font-bold text-jint-red mb-2">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
