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
          setSiteContent(mergeDeep(defaultSiteContent, savedContent))
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
