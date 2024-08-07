import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


// @desc    Get groups
// @route   GET /api/groups
// @access  Private
export const getGroups = asyncHandler(async (req, res) => {
	const groups = await prisma.group.findMany({
		orderBy: {
			// createdAt: 'desc'
			name: 'desc'
		}
	})
	res.json(groups)
})


// @desc    Get group
// @route   GET /api/groups/:id
// @access  Private
export const getGroup = asyncHandler(async (req, res) => {
	const group = await prisma.group.findUnique({
		where: { id: +req.params.id }
	})

	if (!group) {
		res.status(404)
		throw new Error('Group not found!')
	}

	res.json({ ...group })
})


// @desc    Create new group
// @route 	POST /api/groups
// @access  Private
export const createNewGroup = asyncHandler(async (req, res) => {
	const { name } = req.body

	const group = await prisma.group.create({
		data: {
			name
		}
	})

	res.json(group)
})


// @desc    Update group
// @route 	PUT /api/groups/:id
// @access  Private
export const updateGroup = asyncHandler(async (req, res) => {
	const { name } = req.body

	try {
		const group = await prisma.group.update({
			where: {
				id: +req.params.id
			},
			data: {
				name
			}
		})

		res.json(group)
	} catch (error) {
		res.status(404)
		throw new Error('Group not found!')
	}
})


// @desc    Delete group
// @route 	DELETE /api/groups/:id
// @access  Private
export const deleteGroup = asyncHandler(async (req, res) => {
	try {
		const group = await prisma.group.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Group deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('Group not found!')
	}
})
