import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { defaultSiteContent } from '../data/siteDefaults'

const SiteSettingsContext = createContext(null)

function mergeDeep(base, override) {
  if (Array.isArray(base)) {
    return Array.isArray(override) ? override : base
  }

  if (base && typeof base === 'object') {
    const result = { ...base }
    const source = override && typeof override === 'object' ? override : {}

    Object.keys(source).forEach(key => {
      result[key] = mergeDeep(base[key], source[key])
    })

    return result
  }

  return override ?? base
}

function mergeNewServices(content) {
  const savedServices = Array.isArray(content?.services) ? content.services : []
  const defaultItServices = defaultSiteContent.services.find(service => service.slug === 'it-services')
  const sectorSlugs = new Set(defaultItServices?.sectors?.map(sector => sector.slug) || [])
  const migratedServices = savedServices.filter(service => !sectorSlugs.has(service.slug))
  const savedSlugs = new Set(migratedServices.map(service => service.slug))
  const newServices = defaultSiteContent.services.filter(service => (
    service.category === 'IT Services' && !savedSlugs.has(service.slug)
  ))

  return {
    ...content,
    services: [...migratedServices, ...newServices],
  }
}

export function SiteSettingsProvider({ children }) {
  const [siteContent, setSiteContent] = useState(defaultSiteContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    const loadSettings = async () => {
      try {
        const response = await api.get('/public/site-settings')
        const savedContent = response.data?.settings?.content || response.data?.settings || {}

        if (mounted) {
          setSiteContent(mergeDeep(defaultSiteContent, mergeNewServices(savedContent)))
        }
      } catch {
        if (mounted) {
          setSiteContent(defaultSiteContent)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      mounted = false
    }
  }, [])

  const value = useMemo(() => ({
    siteContent,
    setSiteContent,
    loading,
  }), [siteContent, loading])

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext)

  if (!context) {
    return {
      siteContent: defaultSiteContent,
      setSiteContent: () => {},
      loading: false,
    }
  }

  return context
}
