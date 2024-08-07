import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { createSale, getSales } from './sale.controller.js'

const router = express.Router()

// router.route('/').post(protect, createSale).get(protect, getSales)
router.route('/').post(createSale).get(getSales)

export default router
