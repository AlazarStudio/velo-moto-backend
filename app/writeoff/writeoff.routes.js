import express from 'express'
import { protect } from '../middleware/auth.middleware.js'
import { createWriteOff, getWriteOffs } from './writeoff.controller.js'

const router = express.Router()

// router.route('/').post(protect, createWriteOff).get(protect, getWriteOffs)
router.route('/').post(createWriteOff).get(getWriteOffs)

export default router
