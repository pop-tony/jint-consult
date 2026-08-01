import express from 'express'
import { getPublicSiteSettings } from '../controllers/adminController.js'

const publicRouter = express.Router()

publicRouter.get('/site-settings', getPublicSiteSettings)

export default publicRouter
