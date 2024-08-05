import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewItem,
	deleteItem,
	getItem,
	getItems,
	updateItem
} from './item.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewItem).get(protect, getItems)

router
	.route('/:id')
	.get(protect, getItem)
	.put(protect, updateItem)
	.delete(protect, deleteItem)

export default router
