import express from 'express'

import { protect, adminProtect } from '../middleware/auth.middleware.js'

import {
	createNewItem,
	deleteItem,
	getItem,
	getItems,
	updateItem
} from './item.controller.js'

const router = express.Router()

router.route('/').post(adminProtect, createNewItem).get(getItems)
// router.route('/').post(createNewItem).get(getItems)

router.route('/:id').get(getItem).put(adminProtect, updateItem).delete(adminProtect, deleteItem)
// router.route('/:id').get(getItem).put(updateItem).delete(deleteItem)

export default router
