import mongoose from 'mongoose'

const siteSettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true })

const siteSettingsModel = mongoose.models.sitesettings || mongoose.model('sitesettings', siteSettingsSchema)

export default siteSettingsModel
