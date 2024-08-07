import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { createReceipt, getReceipts } from './receipt.controller.js'

const router = express.Router()

// router.route('/').post(protect, createReceipt).get(protect, getReceipts)
router.route('/').post(createReceipt).get(getReceipts)

export default router
