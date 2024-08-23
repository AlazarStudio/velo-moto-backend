import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewStore,
	deleteStore,
	getStore,
	getStores,
	updateStore
} from './store.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewStore).get(protect, getStores)

router
	.route('/:id')
	.get(protect, getStore)
	.put(protect, updateStore)
	.delete(protect, deleteStore)

export default router
