import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useSiteSettings } from '../context/SiteSettingsContext'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'content', label: 'Content Library' },
]

const contentTabs = [
  { id: 'brand', label: 'Brand' },
  { id: 'hero', label: 'Hero' },
  { id: 'highlights', label: 'Highlights' },
  { id: 'stats', label: 'Stats' },
  { id: 'services', label: 'Services' },
  { id: 'process', label: 'Process' },
  { id: 'about', label: 'About' },
  { id: 'team', label: 'Team' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
  { id: 'footer', label: 'Footer' },
  { id: 'booking', label: 'Booking' },
]

const contentSectionMeta = {
  brand: {
    title: 'Brand identity',
    description: 'Controls the site brand name used in the navigation and footer.',
  },
  hero: {
    title: 'Hero section',
    description: 'Controls the homepage headline, subcopy, and calls to action.',
  },
  highlights: {
    title: 'Homepage highlights',
    description: 'Controls the image cards shown on the homepage.',
  },
  stats: {
    title: 'Homepage stats',
    description: 'Controls the stat counters displayed on the homepage.',
  },
  services: {
    title: 'Services library',
    description: 'Controls the service cards and service detail data used across the app.',
  },
  process: {
    title: 'Process section',
    description: 'Controls the step-by-step process block and WhatsApp callout.',
  },
  about: {
    title: 'About page',
    description: 'Controls the company history, news, gallery media, and client list.',
  },
  team: {
    title: 'Team section',
    description: 'Controls the team members shown on the team page and homepage.',
  },
  testimonials: {
    title: 'Testimonials section',
    description: 'Controls the review cards displayed on the testimonials section.',
  },
  contact: {
    title: 'Contact section',
    description: 'Controls the contact form labels and business contact details.',
  },
  footer: {
    title: 'Footer content',
    description: 'Controls the footer links, contact details, and copyright text.',
  },
  booking: {
    title: 'Booking configuration',
    description: 'Controls the consultation booking product shown in the booking flow.',
  },
}

function updateNestedObject(source, key, value) {
  return {
    ...source,
    [key]: value,
  }
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function SettingsField({ label, value, onChange, placeholder, type = 'text', multiline = false, rows = 4 }) {
  return (
    <label className="space-y-2 block">
      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      {multiline ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          className="w-full glass rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red"
        />
      ) : (
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          className="w-full glass rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red"
        />
      )}
    </label>
  )
}

function ImageField({ label, value, onChange, helper }) {
  return (
    <label className="space-y-2 block">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
        <span className="text-xs text-gray-500">{helper}</span>
      </div>
      <div className="space-y-3">
        {value ? (
          <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/10">
            <img src={value} alt={label} className="h-44 w-full object-cover" />
          </div>
        ) : null}
        <input
          value={value}
          onChange={onChange}
          placeholder="Paste an image link or use upload"
          className="w-full glass rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red"
        />
        <input
          type="file"
          accept="image/*"
          onChange={async (event) => {
            const file = event.target.files?.[0]
            if (!file) return

            const dataUrl = await readFileAsDataUrl(file)
            onChange({ target: { value: dataUrl } })
          }}
          className="block w-full text-sm text-gray-600 dark:text-gray-400"
        />
      </div>
    </label>
  )
}

function MediaField({ label, value, onChange, type = 'image' }) {
  return (
    <label className="space-y-2 block">
      <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</span>
      {value ? (
        <div className="overflow-hidden rounded-2xl border border-white/20 bg-black/10">
          {type === 'video' ? <video src={value} controls className="h-44 w-full object-cover" /> : <img src={value} alt={label} className="h-44 w-full object-cover" />}
        </div>
      ) : null}
      <input
        value={value || ''}
        onChange={onChange}
        placeholder={`Paste a ${type} link or upload a file`}
        className="w-full glass rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red"
      />
      <input
        type="file"
        accept={`${type}/*`}
        onChange={async (event) => {
          const file = event.target.files?.[0]
          if (!file) return

          const dataUrl = await readFileAsDataUrl(file)
          onChange({ target: { value: dataUrl } })
        }}
        className="block w-full text-sm text-gray-600 dark:text-gray-400"
      />
    </label>
  )
}

function ContentCard({ title, description, action, children }) {
  return (
    <div className="glass rounded-3xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{description}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function ArrayToolbar({ title, helper, onAdd, addLabel }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</div>
        <div className="text-xs text-gray-500">{helper}</div>
      </div>
      <button type="button" onClick={onAdd} className="glass px-4 py-2 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-jint-red">
        {addLabel}
      </button>
    </div>
  )
}

function StatusPill({ value }) {
  return (
    <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-jint-red/10 text-jint-red">
      {value}
    </span>
  )
}

export default function AdminDashboardPage() {
  const { siteContent, setSiteContent } = useSiteSettings()
  const [checking, setChecking] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [summary, setSummary] = useState(null)
  const [bookings, setBookings] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const [activeContentTab, setActiveContentTab] = useState('brand')
  const [settingsDraft, setSettingsDraft] = useState(siteContent)
  const [message, setMessage] = useState('')
  const [loadingSave, setLoadingSave] = useState(false)

  const updateSection = (section, updater) => {
    setSettingsDraft(previous => ({
      ...previous,
      [section]: updater(previous?.[section] || {}),
    }))
  }

  const updateNestedValue = (section, key, value) => {
    updateSection(section, previous => updateNestedObject(previous || {}, key, value))
  }

  const updateArrayItem = (section, index, key, value) => {
    updateSection(section, previous => {
      const items = Array.isArray(previous) ? [...previous] : []
      items[index] = { ...(items[index] || {}), [key]: value }
      return items
    })
  }

  const updateArrayValue = (section, index, value) => {
    updateSection(section, previous => {
      const items = Array.isArray(previous) ? [...previous] : []
      items[index] = value
      return items
    })
  }

  const addArrayItem = (section, item) => {
    updateSection(section, previous => {
      const items = Array.isArray(previous) ? [...previous] : []
      items.push(item)
      return items
    })
  }

  const removeArrayItem = (section, index) => {
    updateSection(section, previous => {
      const items = Array.isArray(previous) ? [...previous] : []
      items.splice(index, 1)
      return items
    })
  }

  const updateNestedArrayItem = (section, nestedKey, index, key, value) => {
    setSettingsDraft(previous => {
      const parent = { ...(previous?.[section] || {}) }
      const items = Array.isArray(parent[nestedKey]) ? [...parent[nestedKey]] : []
      items[index] = { ...(items[index] || {}), [key]: value }
      parent[nestedKey] = items
      return { ...previous, [section]: parent }
    })
  }

  const updateNestedArrayValue = (section, nestedKey, index, value) => {
    setSettingsDraft(previous => {
      const parent = { ...(previous?.[section] || {}) }
      const items = Array.isArray(parent[nestedKey]) ? [...parent[nestedKey]] : []
      items[index] = value
      parent[nestedKey] = items
      return { ...previous, [section]: parent }
    })
  }

  const addNestedArrayItem = (section, nestedKey, item) => {
    setSettingsDraft(previous => {
      const parent = { ...(previous?.[section] || {}) }
      const items = Array.isArray(parent[nestedKey]) ? [...parent[nestedKey]] : []
      items.push(item)
      parent[nestedKey] = items
      return { ...previous, [section]: parent }
    })
  }

  const removeNestedArrayItem = (section, nestedKey, index) => {
    setSettingsDraft(previous => {
      const parent = { ...(previous?.[section] || {}) }
      const items = Array.isArray(parent[nestedKey]) ? [...parent[nestedKey]] : []
      items.splice(index, 1)
      parent[nestedKey] = items
      return { ...previous, [section]: parent }
    })
  }

  useEffect(() => {
    const load = async () => {
      try {
        const userResponse = await api.get('/user/data')
        if (!userResponse.data?.userData?.isAdmin) {
          setIsAdmin(false)
          setChecking(false)
          return
        }

        setIsAdmin(true)
        const [summaryResponse, bookingsResponse, enquiriesResponse, settingsResponse] = await Promise.all([
          api.get('/admin/summary'),
          api.get('/admin/bookings'),
          api.get('/admin/enquiries'),
          api.get('/admin/site-settings'),
        ])

        setSummary(summaryResponse.data?.summary || null)
        setBookings(bookingsResponse.data?.bookings || [])
        setEnquiries(enquiriesResponse.data?.enquiries || [])
        const content = settingsResponse.data?.settings?.content || settingsResponse.data?.settings || siteContent
        setSettingsDraft(content)
      } catch {
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    load()
  }, [])

  useEffect(() => {
    setSettingsDraft(siteContent)
  }, [siteContent])

  const stats = useMemo(() => ([
    { label: 'Bookings', value: summary?.bookingCount ?? bookings.length },
    { label: 'Enquiries', value: summary?.enquiryCount ?? enquiries.length },
    { label: 'Site Sections', value: Object.keys(siteContent || {}).length },
  ]), [summary, bookings.length, enquiries.length, siteContent])

  const updateBookingStatus = async (bookingId, status) => {
    await api.patch(`/admin/bookings/${bookingId}/status`, { status })
    const response = await api.get('/admin/bookings')
    setBookings(response.data?.bookings || [])
  }

  const updateEnquiryStatus = async (enquiryId, status) => {
    await api.patch(`/admin/enquiries/${enquiryId}/status`, { status })
    const response = await api.get('/admin/enquiries')
    setEnquiries(response.data?.enquiries || [])
  }

  const saveSettings = async () => {
    setMessage('')
    setLoadingSave(true)

    try {
      const payload = settingsDraft
      const response = await api.put('/admin/site-settings', { content: payload })
      const savedContent = response.data?.settings?.content || payload
      setSiteContent(savedContent)
      setMessage('Site settings saved successfully.')
    } catch (error) {
      setMessage(error instanceof SyntaxError ? 'Invalid JSON in one of the section editors. Fix the content and try again.' : 'Unable to save settings.')
    } finally {
      setLoadingSave(false)
    }
  }

  const renderContentSection = () => {
    if (activeContentTab === 'brand') {
      return (
        <ContentCard title="Brand identity" description={contentSectionMeta.brand.description}>
          <div className="max-w-xl">
            <SettingsField
              label="Brand name"
              value={settingsDraft?.brand?.name || ''}
              onChange={(event) => updateNestedValue('brand', 'name', event.target.value)}
              placeholder="Jint Consult"
            />
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'hero') {
      return (
        <ContentCard title="Hero section" description={contentSectionMeta.hero.description}>
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Eyebrow" value={settingsDraft?.hero?.eyebrow || ''} onChange={(event) => updateNestedValue('hero', 'eyebrow', event.target.value)} />
            <ImageField label="Background image" value={settingsDraft?.hero?.backgroundImage || ''} onChange={(event) => updateNestedValue('hero', 'backgroundImage', event.target.value)} helper="Use a link or upload a photo" />
            <SettingsField label="Title" value={settingsDraft?.hero?.title || ''} onChange={(event) => updateNestedValue('hero', 'title', event.target.value)} multiline rows={4} />
            <SettingsField label="Subtitle" value={settingsDraft?.hero?.subtitle || ''} onChange={(event) => updateNestedValue('hero', 'subtitle', event.target.value)} multiline rows={4} />
            <SettingsField label="Primary CTA label" value={settingsDraft?.hero?.primaryCtaLabel || ''} onChange={(event) => updateNestedValue('hero', 'primaryCtaLabel', event.target.value)} />
            <SettingsField label="Primary CTA link" value={settingsDraft?.hero?.primaryCtaLink || ''} onChange={(event) => updateNestedValue('hero', 'primaryCtaLink', event.target.value)} />
            <SettingsField label="Secondary CTA label" value={settingsDraft?.hero?.secondaryCtaLabel || ''} onChange={(event) => updateNestedValue('hero', 'secondaryCtaLabel', event.target.value)} />
            <SettingsField label="Secondary CTA link" value={settingsDraft?.hero?.secondaryCtaLink || ''} onChange={(event) => updateNestedValue('hero', 'secondaryCtaLink', event.target.value)} />
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'highlights') {
      return (
        <ContentCard
          title="Homepage highlights"
          description={contentSectionMeta.highlights.description}
          action={<ArrayToolbar title="Highlights" helper="These cards appear on the homepage." onAdd={() => addArrayItem('highlights', { title: 'New highlight', image: '' })} addLabel="Add highlight" />}
        >
          <div className="space-y-4">
            {(settingsDraft?.highlights || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Highlight {index + 1}</h3>
                  <button type="button" onClick={() => removeArrayItem('highlights', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Title" value={item.title || ''} onChange={(event) => updateArrayItem('highlights', index, 'title', event.target.value)} />
                  <ImageField label="Image" value={item.image || ''} onChange={(event) => updateArrayItem('highlights', index, 'image', event.target.value)} helper="Paste a link or upload an image" />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'stats') {
      return (
        <ContentCard
          title="Homepage stats"
          description={contentSectionMeta.stats.description}
          action={<ArrayToolbar title="Stats" helper="Update the counters shown on the hero and homepage." onAdd={() => addArrayItem('stats', { value: 0, label: 'New stat', suffix: '' })} addLabel="Add stat" />}
        >
          <div className="space-y-4">
            {(settingsDraft?.stats || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Stat {index + 1}</h3>
                  <button type="button" onClick={() => removeArrayItem('stats', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <SettingsField label="Value" value={item.value ?? ''} onChange={(event) => updateArrayItem('stats', index, 'value', event.target.value)} />
                  <SettingsField label="Label" value={item.label || ''} onChange={(event) => updateArrayItem('stats', index, 'label', event.target.value)} />
                  <SettingsField label="Suffix" value={item.suffix || ''} onChange={(event) => updateArrayItem('stats', index, 'suffix', event.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'services') {
      return (
        <ContentCard
          title="Services library"
          description={contentSectionMeta.services.description}
          action={<ArrayToolbar title="Services" helper="These cards drive the services pages." onAdd={() => addArrayItem('services', { slug: 'new-service', title: 'New Service', shortTitle: 'New Service', price: 0, priceLabel: 'GHS 0', desc: '', image: '', overview: '', features: [] })} addLabel="Add service" />}
        >
          <div className="space-y-4">
            {(settingsDraft?.services || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Service {index + 1}</h3>
                  <button type="button" onClick={() => removeArrayItem('services', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Slug" value={item.slug || ''} onChange={(event) => updateArrayItem('services', index, 'slug', event.target.value)} />
                  <ImageField label="Image" value={item.image || ''} onChange={(event) => updateArrayItem('services', index, 'image', event.target.value)} helper="Paste a link or upload a photo" />
                  <SettingsField label="Title" value={item.title || ''} onChange={(event) => updateArrayItem('services', index, 'title', event.target.value)} />
                  <SettingsField label="Short title" value={item.shortTitle || ''} onChange={(event) => updateArrayItem('services', index, 'shortTitle', event.target.value)} />
                  <SettingsField label="Price" value={item.price ?? ''} onChange={(event) => updateArrayItem('services', index, 'price', event.target.value)} />
                  <SettingsField label="Price label" value={item.priceLabel || ''} onChange={(event) => updateArrayItem('services', index, 'priceLabel', event.target.value)} />
                  <SettingsField label="Description" value={item.desc || ''} onChange={(event) => updateArrayItem('services', index, 'desc', event.target.value)} multiline rows={3} />
                  <SettingsField label="Overview" value={item.overview || ''} onChange={(event) => updateArrayItem('services', index, 'overview', event.target.value)} multiline rows={3} />
                  <SettingsField label="Features" value={(item.features || []).join(', ')} onChange={(event) => updateArrayItem('services', index, 'features', event.target.value.split(',').map(feature => feature.trim()).filter(Boolean))} multiline rows={3} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'process') {
      return (
        <ContentCard
          title="Process section"
          description={contentSectionMeta.process.description}
          action={<ArrayToolbar title="Process steps" helper="These steps explain how the service works." onAdd={() => addNestedArrayItem('process', 'steps', { title: 'New step', desc: '' })} addLabel="Add step" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Title" value={settingsDraft?.process?.title || ''} onChange={(event) => updateNestedValue('process', 'title', event.target.value)} />
            <SettingsField label="Subtitle" value={settingsDraft?.process?.subtitle || ''} onChange={(event) => updateNestedValue('process', 'subtitle', event.target.value)} multiline rows={3} />
            <SettingsField label="WhatsApp number" value={settingsDraft?.process?.whatsappNumber || ''} onChange={(event) => updateNestedValue('process', 'whatsappNumber', event.target.value)} />
            <SettingsField label="WhatsApp message" value={settingsDraft?.process?.whatsappMessage || ''} onChange={(event) => updateNestedValue('process', 'whatsappMessage', event.target.value)} multiline rows={3} />
          </div>
          <div className="space-y-4">
            {(settingsDraft?.process?.steps || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Step {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('process', 'steps', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Step title" value={item.title || ''} onChange={(event) => updateNestedArrayItem('process', 'steps', index, 'title', event.target.value)} />
                  <SettingsField label="Description" value={item.desc || ''} onChange={(event) => updateNestedArrayItem('process', 'steps', index, 'desc', event.target.value)} multiline rows={3} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'about') {
      return (
        <ContentCard
          title="About page"
          description={contentSectionMeta.about.description}
          action={<ArrayToolbar title="News items" helper="Publish company updates and announcements." onAdd={() => addNestedArrayItem('about', 'news', { title: 'New update', date: '', body: '', image: '' })} addLabel="Add news" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Page title" value={settingsDraft?.about?.title || ''} onChange={(event) => updateNestedValue('about', 'title', event.target.value)} />
            <SettingsField label="Subtitle" value={settingsDraft?.about?.subtitle || ''} onChange={(event) => updateNestedValue('about', 'subtitle', event.target.value)} multiline rows={3} />
            <SettingsField label="History heading" value={settingsDraft?.about?.historyTitle || ''} onChange={(event) => updateNestedValue('about', 'historyTitle', event.target.value)} />
            <SettingsField label="Company history" value={settingsDraft?.about?.history || ''} onChange={(event) => updateNestedValue('about', 'history', event.target.value)} multiline rows={6} />
          </div>

          <div className="space-y-4">
            {(settingsDraft?.about?.news || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">News item {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('about', 'news', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Title" value={item.title || ''} onChange={(event) => updateNestedArrayItem('about', 'news', index, 'title', event.target.value)} />
                  <SettingsField label="Date" value={item.date || ''} onChange={(event) => updateNestedArrayItem('about', 'news', index, 'date', event.target.value)} />
                  <SettingsField label="Story" value={item.body || ''} onChange={(event) => updateNestedArrayItem('about', 'news', index, 'body', event.target.value)} multiline rows={4} />
                  <ImageField label="News image" value={item.image || ''} onChange={(event) => updateNestedArrayItem('about', 'news', index, 'image', event.target.value)} helper="Paste a link or upload an image" />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <ArrayToolbar title="Gallery" helper="Upload images or videos for visitors to browse." onAdd={() => addNestedArrayItem('about', 'gallery', { type: 'image', src: '', title: '', poster: '' })} addLabel="Add media" />
            {(settingsDraft?.about?.gallery || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Gallery item {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('about', 'gallery', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Title" value={item.title || ''} onChange={(event) => updateNestedArrayItem('about', 'gallery', index, 'title', event.target.value)} />
                  <label className="space-y-2 block">
                    <span className="block text-sm font-semibold text-gray-700 dark:text-gray-300">Media type</span>
                    <select value={item.type || 'image'} onChange={(event) => updateNestedArrayItem('about', 'gallery', index, 'type', event.target.value)} className="w-full glass rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red">
                      <option value="image" className="bg-white dark:bg-zinc-900">Image</option>
                      <option value="video" className="bg-white dark:bg-zinc-900">Video</option>
                    </select>
                  </label>
                  <MediaField label={item.type === 'video' ? 'Video' : 'Image'} value={item.src || ''} onChange={(event) => updateNestedArrayItem('about', 'gallery', index, 'src', event.target.value)} type={item.type === 'video' ? 'video' : 'image'} />
                  {item.type === 'video' ? <ImageField label="Video poster" value={item.poster || ''} onChange={(event) => updateNestedArrayItem('about', 'gallery', index, 'poster', event.target.value)} helper="Optional preview image" /> : null}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <ArrayToolbar title="Clients" helper="List the clients and organisations shown on the About page." onAdd={() => addNestedArrayItem('about', 'clients', { name: 'New client', logo: '', description: '' })} addLabel="Add client" />
            {(settingsDraft?.about?.clients || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Client {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('about', 'clients', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Client name" value={item.name || ''} onChange={(event) => updateNestedArrayItem('about', 'clients', index, 'name', event.target.value)} />
                  <ImageField label="Client logo" value={item.logo || ''} onChange={(event) => updateNestedArrayItem('about', 'clients', index, 'logo', event.target.value)} helper="Paste a link or upload a logo" />
                  <SettingsField label="Description" value={item.description || ''} onChange={(event) => updateNestedArrayItem('about', 'clients', index, 'description', event.target.value)} multiline rows={3} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'team') {
      return (
        <ContentCard
          title="Team section"
          description={contentSectionMeta.team.description}
          action={<ArrayToolbar title="Team members" helper="Add or remove the people shown on the team page." onAdd={() => addNestedArrayItem('team', 'members', { name: 'New member', role: 'Role', image: '', bio: '', linkedin: '#', email: '' })} addLabel="Add member" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Title" value={settingsDraft?.team?.title || ''} onChange={(event) => updateNestedValue('team', 'title', event.target.value)} />
            <SettingsField label="Subtitle" value={settingsDraft?.team?.subtitle || ''} onChange={(event) => updateNestedValue('team', 'subtitle', event.target.value)} multiline rows={3} />
          </div>
          <div className="space-y-4">
            {(settingsDraft?.team?.members || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Member {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('team', 'members', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Name" value={item.name || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'name', event.target.value)} />
                  <SettingsField label="Role" value={item.role || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'role', event.target.value)} />
                  <ImageField label="Photo" value={item.image || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'image', event.target.value)} helper="Paste a link or upload a photo" />
                  <SettingsField label="Bio" value={item.bio || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'bio', event.target.value)} multiline rows={3} />
                  <SettingsField label="LinkedIn" value={item.linkedin || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'linkedin', event.target.value)} />
                  <SettingsField label="Email" value={item.email || ''} onChange={(event) => updateNestedArrayItem('team', 'members', index, 'email', event.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'testimonials') {
      return (
        <ContentCard
          title="Testimonials section"
          description={contentSectionMeta.testimonials.description}
          action={<ArrayToolbar title="Testimonials" helper="Update the reviews shown on the site." onAdd={() => addNestedArrayItem('testimonials', 'items', { name: 'New client', text: 'Great service.', rating: 5 })} addLabel="Add review" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Title" value={settingsDraft?.testimonials?.title || ''} onChange={(event) => updateNestedValue('testimonials', 'title', event.target.value)} />
          </div>
          <div className="space-y-4">
            {(settingsDraft?.testimonials?.items || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Review {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('testimonials', 'items', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Name" value={item.name || ''} onChange={(event) => updateNestedArrayItem('testimonials', 'items', index, 'name', event.target.value)} />
                  <SettingsField label="Rating" value={item.rating ?? 5} onChange={(event) => updateNestedArrayItem('testimonials', 'items', index, 'rating', event.target.value)} />
                  <SettingsField label="Review" value={item.text || ''} onChange={(event) => updateNestedArrayItem('testimonials', 'items', index, 'text', event.target.value)} multiline rows={3} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'contact') {
      return (
        <ContentCard
          title="Contact section"
          description={contentSectionMeta.contact.description}
          action={<ArrayToolbar title="Contact subjects" helper="These options appear in the enquiry form." onAdd={() => addNestedArrayItem('contact', 'subjects', 'New subject')} addLabel="Add subject" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Title" value={settingsDraft?.contact?.title || ''} onChange={(event) => updateNestedValue('contact', 'title', event.target.value)} />
            <SettingsField label="Subtitle" value={settingsDraft?.contact?.subtitle || ''} onChange={(event) => updateNestedValue('contact', 'subtitle', event.target.value)} multiline rows={3} />
            <SettingsField label="Phone" value={settingsDraft?.contact?.phone || ''} onChange={(event) => updateNestedValue('contact', 'phone', event.target.value)} />
            <SettingsField label="Email" value={settingsDraft?.contact?.email || ''} onChange={(event) => updateNestedValue('contact', 'email', event.target.value)} />
            <SettingsField label="Address" value={settingsDraft?.contact?.address || ''} onChange={(event) => updateNestedValue('contact', 'address', event.target.value)} multiline rows={4} />
            <SettingsField label="Map query" value={settingsDraft?.contact?.mapQuery || ''} onChange={(event) => updateNestedValue('contact', 'mapQuery', event.target.value)} multiline rows={4} />
          </div>
          <div className="space-y-4">
            <ArrayToolbar
              title="Contact numbers"
              helper="These numbers appear in the footer."
              onAdd={() => addNestedArrayItem('contact', 'phoneNumbers', '')}
              addLabel="Add number"
            />
            {(settingsDraft?.contact?.phoneNumbers || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 flex items-end gap-3">
                <div className="flex-1">
                  <SettingsField
                    label={`Phone number ${index + 1}`}
                    value={item || ''}
                    onChange={(event) => updateNestedArrayValue('contact', 'phoneNumbers', index, event.target.value)}
                    type="tel"
                  />
                </div>
                <button type="button" onClick={() => removeNestedArrayItem('contact', 'phoneNumbers', index)} className="text-sm text-jint-red pb-3">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {(settingsDraft?.contact?.subjects || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Subject {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('contact', 'subjects', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <SettingsField label="Subject label" value={item || ''} onChange={(event) => updateNestedArrayValue('contact', 'subjects', index, event.target.value)} />
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    if (activeContentTab === 'footer') {
      return (
        <ContentCard
          title="Footer content"
          description={contentSectionMeta.footer.description}
          action={<ArrayToolbar title="Social links" helper="These links appear in the footer." onAdd={() => addNestedArrayItem('footer', 'socialLinks', { label: 'New link', href: '#' })} addLabel="Add link" />}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <SettingsField label="Address" value={settingsDraft?.footer?.address || ''} onChange={(event) => updateNestedValue('footer', 'address', event.target.value)} multiline rows={4} />
            <SettingsField label="Copyright" value={settingsDraft?.footer?.copyright || ''} onChange={(event) => updateNestedValue('footer', 'copyright', event.target.value)} multiline rows={4} />
            <SettingsField label="Phone" value={settingsDraft?.footer?.phone || ''} onChange={(event) => updateNestedValue('footer', 'phone', event.target.value)} />
            <SettingsField label="Email" value={settingsDraft?.footer?.email || ''} onChange={(event) => updateNestedValue('footer', 'email', event.target.value)} />
          </div>
          <div className="space-y-4">
            {(settingsDraft?.footer?.socialLinks || []).map((item, index) => (
              <div key={index} className="glass rounded-2xl p-4 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Link {index + 1}</h3>
                  <button type="button" onClick={() => removeNestedArrayItem('footer', 'socialLinks', index)} className="text-sm text-jint-red">Remove</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SettingsField label="Label" value={item.label || ''} onChange={(event) => updateNestedArrayItem('footer', 'socialLinks', index, 'label', event.target.value)} />
                  <SettingsField label="URL" value={item.href || ''} onChange={(event) => updateNestedArrayItem('footer', 'socialLinks', index, 'href', event.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )
    }

    return (
      <ContentCard title="Booking configuration" description={contentSectionMeta.booking.description}>
        <div className="grid md:grid-cols-2 gap-4">
          <SettingsField label="Title" value={settingsDraft?.booking?.consultation?.title || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'title', event.target.value))} />
          <SettingsField label="Short title" value={settingsDraft?.booking?.consultation?.shortTitle || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'shortTitle', event.target.value))} />
          <SettingsField label="Description" value={settingsDraft?.booking?.consultation?.desc || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'desc', event.target.value))} multiline rows={4} />
          <ImageField label="Image" value={settingsDraft?.booking?.consultation?.image || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'image', event.target.value))} helper="Paste a link or upload a photo" />
          <SettingsField label="Price" value={settingsDraft?.booking?.consultation?.price ?? ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'price', event.target.value))} />
          <SettingsField label="Price label" value={settingsDraft?.booking?.consultation?.priceLabel || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'priceLabel', event.target.value))} />
          <SettingsField label="Overview" value={settingsDraft?.booking?.consultation?.overview || ''} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'overview', event.target.value))} multiline rows={3} />
          <SettingsField label="Features" value={(settingsDraft?.booking?.consultation?.features || []).join(', ')} onChange={(event) => updateNestedValue('booking', 'consultation', updateNestedObject(settingsDraft?.booking?.consultation || {}, 'features', event.target.value.split(',').map(feature => feature.trim()).filter(Boolean)))} multiline rows={3} />
        </div>
      </ContentCard>
    )
  }

  if (checking) {
    return (
      <section className="min-h-screen px-6 py-24 bg-gray-50 dark:bg-black flex items-center justify-center">
        <div className="glass rounded-3xl px-8 py-6 text-gray-900 dark:text-white">Checking admin access...</div>
      </section>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <section className="min-h-screen px-4 md:px-6 py-24 bg-gray-50 dark:bg-black">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="glass rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-jint-red font-semibold mb-2">Owner Dashboard</p>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">Manage bookings, enquiries, and site content</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">Edit the live site content from one place. The content library is split into sections so you can update any component without digging through one large JSON blob.</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {stats.map(item => (
              <div key={item.label} className="glass rounded-2xl px-4 py-3 text-center min-w-24">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
                <div className="text-xs uppercase tracking-wide text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full font-semibold transition-colors ${activeTab === tab.id ? 'bg-jint-red text-white' : 'glass text-gray-700 dark:text-gray-300 hover:text-jint-red'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass rounded-3xl p-6">
              <p className="text-gray-500 text-sm">Bookings</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
            </div>
            <div className="glass rounded-3xl p-6">
              <p className="text-gray-500 text-sm">Enquiries</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{enquiries.length}</div>
            </div>
            <div className="glass rounded-3xl p-6">
              <p className="text-gray-500 text-sm">Site sections</p>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{Object.keys(siteContent || {}).length}</div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="glass rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{booking.clientName}</h3>
                    <StatusPill value={booking.status} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{booking.serviceName} · {booking.date} · {booking.time}</p>
                  <p className="text-gray-500 text-sm mt-1">{booking.email} · {booking.phone}</p>
                  {booking.notes && <p className="text-gray-600 dark:text-gray-400 mt-3">{booking.notes}</p>}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateBookingStatus(booking._id, 'pending')} className="glass px-4 py-2 rounded-xl">Pending</button>
                  <button onClick={() => updateBookingStatus(booking._id, 'confirmed')} className="glass px-4 py-2 rounded-xl">Confirmed</button>
                  <button onClick={() => updateBookingStatus(booking._id, 'completed')} className="glass px-4 py-2 rounded-xl">Completed</button>
                </div>
              </div>
            ))}
            {!bookings.length && <div className="glass rounded-3xl p-8 text-gray-600 dark:text-gray-400">No bookings yet.</div>}
          </div>
        )}

        {activeTab === 'enquiries' && (
          <div className="space-y-4">
            {enquiries.map(enquiry => (
              <div key={enquiry._id} className="glass rounded-3xl p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{enquiry.name}</h3>
                    <StatusPill value={enquiry.status} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{enquiry.subject}</p>
                  <p className="text-gray-500 text-sm mt-1">{enquiry.email} · {enquiry.phone}</p>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">{enquiry.message}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => updateEnquiryStatus(enquiry._id, 'reviewing')} className="glass px-4 py-2 rounded-xl">Reviewing</button>
                  <button onClick={() => updateEnquiryStatus(enquiry._id, 'contacted')} className="glass px-4 py-2 rounded-xl">Contacted</button>
                  <button onClick={() => updateEnquiryStatus(enquiry._id, 'closed')} className="glass px-4 py-2 rounded-xl">Closed</button>
                </div>
              </div>
            ))}
            {!enquiries.length && <div className="glass rounded-3xl p-8 text-gray-600 dark:text-gray-400">No enquiries yet.</div>}
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              {contentTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveContentTab(tab.id)}
                  className={`px-4 py-2 rounded-full font-semibold transition-colors ${activeContentTab === tab.id ? 'bg-jint-red text-white' : 'glass text-gray-700 dark:text-gray-300 hover:text-jint-red'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content library</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl">Each tab controls one live section of the site. Scalar fields are editable directly, and repeatable collections use JSON editors so you can replace or expand the component data quickly.</p>
              </div>
              <button onClick={saveSettings} disabled={loadingSave} className="btn-jint">
                {loadingSave ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>

            {renderContentSection()}

            {message && <p className="text-sm font-medium text-jint-red px-1">{message}</p>}
          </div>
        )}
      </div>
    </section>
  )
}
