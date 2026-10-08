import { Play } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../context/SiteSettingsContext'

function MediaItem({ item }) {
  if (item.type === 'video') {
    return (
      <video
        src={item.src}
        poster={item.poster}
        controls
        preload="metadata"
        className="w-full h-full object-contain bg-black/5 dark:bg-white/5"
        aria-label={item.title || 'Jint Consult video'}
      />
    )
  }

  return (
    <img
      src={item.src}
      alt={item.title || 'Jint Consult gallery'}
      className="w-full h-full object-contain bg-black/5 dark:bg-white/5"
      loading="lazy"
    />
  )
}

export default function AboutPage() {
  const { siteContent } = useSiteSettings()
  const about = siteContent.about

  return (
    <div className="bg-white dark:bg-black">
      <section className="px-6 pt-20 pb-16 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto">
          <span className="text-jint-red font-semibold text-sm uppercase tracking-wider">Our company</span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mt-4 mb-5">{about.title}</h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl">{about.subtitle}</p>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">{about.historyTitle}</h2>
          <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">{about.history}</p>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Latest news</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(about.news || []).map((item, index) => (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-3xl overflow-hidden"
              >
                {item.image ? <img src={item.image} alt={item.title} className="w-full h-56 object-cover" loading="lazy" /> : null}
                <div className="p-6">
                  <p className="text-sm text-jint-red font-semibold mb-2">{item.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.body}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 bg-gray-50 dark:bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-10">Clients we support</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(about.clients || []).map((client, index) => (
              <div key={`${client.name}-${index}`} className="glass rounded-2xl p-6">
                {client.logo ? <img src={client.logo} alt={`${client.name} logo`} className="h-14 w-full object-contain object-left mb-5" loading="lazy" /> : null}
                <h3 className="font-bold text-gray-900 dark:text-white">{client.name}</h3>
                {client.description ? <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{client.description}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Gallery</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-3">Casual and professional photos and videos of Jint Consult, our people, and our work.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(about.gallery || []).map((item, index) => (
              <figure key={`${item.src}-${index}`} className="glass rounded-3xl overflow-hidden">
                <div className="relative aspect-[4/3] bg-black/5 dark:bg-white/5">
                  <MediaItem item={item} />
                  {item.type === 'video' ? <Play className="absolute left-4 top-4 w-5 h-5 text-white" /> : null}
                </div>
                {item.title ? <figcaption className="p-4 font-semibold text-gray-900 dark:text-white">{item.title}</figcaption> : null}
              </figure>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
