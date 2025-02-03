import express from 'express'

import { protect, adminProtect } from '../middleware/auth.middleware.js'

import {
	createNewGroup,
	deleteGroup,
	getGroup,
	getGroups,
	updateGroup
} from './group.controller.js'

const router = express.Router()

router.route('/').post(adminProtect, createNewGroup).get(getGroups)
// router.route('/').post(createNewGroup).get(getGroups)

router
	.route('/:id')
	.get(getGroup)
	.put(adminProtect, updateGroup)
	.delete(adminProtect, deleteGroup)
// router
// 	.route('/:id')
// 	.get(getGroup)
// 	.put(updateGroup)
// 	.delete(deleteGroup)

export default router
