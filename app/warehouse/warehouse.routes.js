import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewWarehouse,
	deleteWarehouse,
	getWarehouse,
	getWarehouses,
	updateWarehouse
} from './warehouse.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewWarehouse).get(protect, getWarehouses)

router
	.route('/:id')
	.get(protect, getWarehouse)
	.put(protect, updateWarehouse)
	.delete(protect, deleteWarehouse)

export default router
