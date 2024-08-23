import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	transferItem
} from './transfer.controller.js'

const router = express.Router()

router.route('/').post(protect, transferItem)

export default router
