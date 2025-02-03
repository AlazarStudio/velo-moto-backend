import express from 'express'

import { protect, adminProtect } from '../middleware/auth.middleware.js'

import {
	createNewContragent,
	deleteContragent,
	getContragent,
	getContragents,
	updateContragent
} from './contragent.controller.js'

const router = express.Router()

router.route('/').post(adminProtect, createNewContragent).get(protect, getContragents)
// router.route('/').post(createNewContragent).get(getContragents)

router.route('/:id').get(protect, getContragent).put(adminProtect, updateContragent).delete(adminProtect, deleteContragent)
// router.route('/:id').get(getContragent).put(updateContragent).delete(deleteContragent)

export default router
