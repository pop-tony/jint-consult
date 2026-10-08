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

function mergeServices(defaultServices, savedServices) {
  const savedItems = Array.isArray(savedServices) ? savedServices : []
  const defaultItServices = defaultServices.find(service => service.slug === 'it-services')
  const sectorSlugs = new Set(defaultItServices?.sectors?.map(sector => sector.slug) || [])
  const migratedItems = savedItems.filter(service => !sectorSlugs.has(service.slug))
  const savedBySlug = new Map(migratedItems.map(service => [service.slug, service]))

  const mergedDefaults = defaultServices.map(defaultService => {
    const savedService = savedBySlug.get(defaultService.slug)
    if (!savedService) return defaultService

    const mergedService = { ...defaultService, ...savedService }
    if (Array.isArray(defaultService.sectors)) {
      const savedSectors = Array.isArray(savedService.sectors) ? savedService.sectors : []
      const savedSectorsBySlug = new Map(savedSectors.map(sector => [sector.slug, sector]))
      mergedService.sectors = defaultService.sectors.map(defaultSector => ({
        ...defaultSector,
        ...(savedSectorsBySlug.get(defaultSector.slug) || {}),
      }))
    }

    return mergedService
  })

  const defaultSlugs = new Set(defaultServices.map(service => service.slug))
  const customServices = migratedItems.filter(service => !defaultSlugs.has(service.slug))
  return [...mergedDefaults, ...customServices]
}

function mergeSiteContent(content) {
  const mergedContent = mergeDeep(defaultSiteContent, content)

  return {
    ...mergedContent,
    services: mergeServices(defaultSiteContent.services, content?.services),
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
          setSiteContent(mergeSiteContent(savedContent))
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
