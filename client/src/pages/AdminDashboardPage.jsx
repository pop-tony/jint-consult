import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useSiteSettings } from '../context/SiteSettingsContext'

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'bookings', label: 'Bookings' },
  { id: 'enquiries', label: 'Enquiries' },
  { id: 'settings', label: 'Site Settings' },
]

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
  const [settingsJson, setSettingsJson] = useState('')
  const [message, setMessage] = useState('')
  const [loadingSave, setLoadingSave] = useState(false)

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
        setSettingsJson(JSON.stringify(content, null, 2))
      } catch {
        setIsAdmin(false)
      } finally {
        setChecking(false)
      }
    }

    load()
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
      const parsed = JSON.parse(settingsJson)
      const response = await api.put('/admin/site-settings', { content: parsed })
      const savedContent = response.data?.settings?.content || parsed
      setSiteContent(savedContent)
      setMessage('Site settings saved successfully.')
    } catch (error) {
      setMessage(error instanceof SyntaxError ? 'Invalid JSON. Fix the content and try again.' : 'Unable to save settings.')
    } finally {
      setLoadingSave(false)
    }
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
            <p className="text-gray-600 dark:text-gray-400 mt-3 max-w-2xl">Edit the live site content from one place. The settings editor accepts the full site JSON, so you can change text, images, services, highlights, and contact details.</p>
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

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Site content editor</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Edit the full site JSON below. This controls hero copy, highlights, services, contact details, and more.</p>
              <textarea
                value={settingsJson}
                onChange={(event) => setSettingsJson(event.target.value)}
                rows={24}
                className="w-full glass rounded-2xl px-4 py-4 font-mono text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-jint-red"
              />
              <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-500">Saving this JSON will update the live site content.</p>
                <button onClick={saveSettings} disabled={loadingSave} className="btn-jint">
                  {loadingSave ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
              {message && <p className="mt-3 text-sm font-medium text-jint-red">{message}</p>}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
