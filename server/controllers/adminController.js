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

function shouldUploadImageField(path) {
  const field = path[path.length - 1]
  return typeof field === 'string' && /image$|backgroundImage$/i.test(field)
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

  if (typeof value === 'string' && value.startsWith('data:image/') && shouldUploadImageField(path)) {
    const uploadResult = await cloudinary.uploader.upload(value, { resource_type: 'image' })
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
    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeDeep(defaultSiteContent, settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAdminSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSiteSettings()
    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeDeep(defaultSiteContent, settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateAdminSiteSettings = async (req, res) => {
  try {
    const { content } = req.body
    const mergedContent = mergeDeep(defaultSiteContent, content || {})
    const normalizedContent = await normalizeContentImages(mergedContent)
    const settings = await siteSettingsModel.findOneAndUpdate(
      { key: 'main' },
      { content: normalizedContent },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.json({ success: true, settings: { ...settings.toObject(), content: mergeDeep(defaultSiteContent, settings.content || {}) } })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
