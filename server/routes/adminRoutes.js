import express from 'express'
import userAuth from '../middleware/userAuth.js'
import adminAuth from '../middleware/adminAuth.js'
import {
  getAdminBookings,
  getAdminEnquiries,
  getAdminSiteSettings,
  getAdminSummary,
  updateAdminSiteSettings,
  updateBookingStatus,
  updateEnquiryStatus,
} from '../controllers/adminController.js'

const adminRouter = express.Router()

adminRouter.use(userAuth)
adminRouter.use(adminAuth)

adminRouter.get('/summary', getAdminSummary)
adminRouter.get('/bookings', getAdminBookings)
adminRouter.get('/enquiries', getAdminEnquiries)
adminRouter.get('/site-settings', getAdminSiteSettings)
adminRouter.put('/site-settings', updateAdminSiteSettings)
adminRouter.patch('/bookings/:bookingId/status', updateBookingStatus)
adminRouter.patch('/enquiries/:enquiryId/status', updateEnquiryStatus)

export default adminRouter
