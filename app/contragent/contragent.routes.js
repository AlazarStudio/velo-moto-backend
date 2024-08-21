import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewContragent,
	deleteContragent,
	getContragent,
	getContragents,
	updateContragent
} from './contragent.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewContragent).get(protect, getContragents)

router
	.route('/:id')
	.get(protect, getContragent)
	.put(protect, updateContragent)
	.delete(protect, deleteContragent)

export default router
