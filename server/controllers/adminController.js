import consultModel from '../models/consultationModel.js'
import orderAModel from '../models/orderAModel.js'
import siteSettingsModel from '../models/siteSettingsModel.js'

async function getOrCreateSiteSettings() {
  let settings = await siteSettingsModel.findOne({ key: 'main' })

  if (!settings) {
    settings = await siteSettingsModel.create({ key: 'main', content: {} })
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
    return res.json({ success: true, settings })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const getAdminSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSiteSettings()
    return res.json({ success: true, settings })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

export const updateAdminSiteSettings = async (req, res) => {
  try {
    const { content } = req.body
    const settings = await siteSettingsModel.findOneAndUpdate(
      { key: 'main' },
      { content },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )

    return res.json({ success: true, settings })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}
