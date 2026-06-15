// GlassStatCards.jsx
const stats = [
    { label: "Revenue", value: "$84.2k", change: "+12%" },
    { label: "Users", value: "23.4k", change: "+8%" },
    { label: "Conversion", value: "3.2%", change: "+1.4%" },
  ]
  
  export default function GlassStatCards() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl 
                       border border-white/20 hover:border-white/40 transition-all duration-300"
          >
            <p className="text-white/60 text-sm mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              <span className="text-emerald-400 text-sm font-medium">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }
  