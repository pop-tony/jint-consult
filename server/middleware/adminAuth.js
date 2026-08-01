import userModel from '../models/userModel.js'

const adminAuth = async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.json({ success: false, message: 'Not Authorized. Try Again' })
    }

    const user = await userModel.findById(userId)

    if (!user || !user.isAdmin) {
      return res.json({ success: false, message: 'Admin access required' })
    }

    next()
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}

export default adminAuth
