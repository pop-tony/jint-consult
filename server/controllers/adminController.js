import consultModel from '../models/consultationModel.js'
import orderAModel from '../models/orderAModel.js'
import siteSettingsModel from '../models/siteSettingsModel.js'
import cloudinary from '../lib/cloudinary.js'
import { defaultSiteContent } from '../../client/src/data/siteDefaults.js'

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

function shouldUploadImageField(path) {
  const field = path[path.length - 1]
  return typeof field === 'string' && /image$|backgroundImage$|src$|poster$/i.test(field)
}

async function normalizeContentImages(value, path = []) {
  if (Array.isArray(value)) {
    const normalizedItems = []

    for (let index = 0; index < value.length; index += 1) {
      normalizedItems.push(await normalizeContentImages(value[index], [...path, index]))
    }

    return normalizedItems
  }

  if (value && typeof value === 'object') {
    const normalizedEntries = await Promise.all(
      Object.entries(value).map(async ([key, entryValue]) => [key, await normalizeContentImages(entryValue, [...path, key])])
    )

    return Object.fromEntries(normalizedEntries)
  }

  if (typeof value === 'string' && /^data:(image|video)\//.test(value) && shouldUploadImageField(path)) {
    const resourceType = value.startsWith('data:video/') ? 'video' : 'image'
    const uploadResult = await cloudinary.uploader.upload(value, { resource_type: resourceType })
    return uploadResult.secure_url
  }

  return value
}

async function getOrCreateSiteSettings() {
  let settings = await siteSettingsModel.findOne({ key: 'main' })

  if (!settings) {
    settings = await siteSettingsModel.create({ key: 'main', content: defaultSiteContent })
    return settings
  }

  if (!settings.content || Object.keys(settings.content).length === 0) {
    settings.content = defaultSiteContent
    await settings.save()
    return settings
  }

  return settings
}

export const getAdminSummary = async (req, res) => {
  try {
    const [bookingCount, enquiryCount, latestBookings, latestEnquiries] = await Promise.all([
      orderAModel.countDocuments(),
      consultModel.countDocuments(),
      orderAModel.find().sort({ createdAt: -1 }).limit(5),
      consultModel.find().sort({ createdAt: -1 }).limit(5),
    ])

    return res.json({
      success: true,
      summary: {
        bookingCount,
        enquiryCount,
        latestBookings,
        latestEnquiries,
      },
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await orderAModel.find().sort({ createdAt: -1 })
    return res.json({ success: true, bookings })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAdminEnquiries = async (req, res) => {
  try {
    const enquiries = await consultModel.find().sort({ createdAt: -1 })
    return res.json({ success: true, enquiries })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params
    const { status } = req.body

    const updatedBooking = await orderAModel.findByIdAndUpdate(bookingId, { status }, { new: true })

    if (!updatedBooking) {
      return res.status(404).json({ success: false, message: 'Booking not found' })
    }

    return res.json({ success: true, booking: updatedBooking })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateEnquiryStatus = async (req, res) => {
  try {
    const { enquiryId } = req.params
    const { status } = req.body

    const updatedEnquiry = await consultModel.findByIdAndUpdate(enquiryId, { status }, { new: true })

    if (!updatedEnquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' })
    }

    return res.json({ success: true, enquiry: updatedEnquiry })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getPublicSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSiteSettings()
    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeSiteContent(settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAdminSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSiteSettings()
    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeSiteContent(settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateAdminSiteSettings = async (req, res) => {
  try {
    const { content } = req.body
    const mergedContent = mergeSiteContent(content || {})
    const normalizedContent = await normalizeContentImages(mergedContent)
    const settings = await siteSettingsModel.findOneAndUpdate(
      { key: 'main' },
      { content: normalizedContent },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeSiteContent(settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
