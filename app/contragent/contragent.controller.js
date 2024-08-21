import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


// @desc    Get contragents
// @route   GET /api/contragents
// @access  Private
export const getContragents = asyncHandler(async (req, res) => {
	const contragents = await prisma.contragent.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})
	res.json(contragents)
})


// @desc    Get contragent
// @route   GET /api/contragents/:id
// @access  Private
export const getContragent = asyncHandler(async (req, res) => {
	const contragent = await prisma.contragent.findUnique({
		where: { id: +req.params.id }
	})

	if (!contragent) {
		res.status(404)
		throw new Error('Contragent not found!')
	}

	res.json({ ...contragent })
})


// @desc    Create new contragent
// @route 	POST /api/contragents
// @access  Private
export const createNewContragent = asyncHandler(async (req, res) => {
	const { name, number, email, adress } = req.body

	const contragent = await prisma.contragent.create({
		data: {
			name, number, email, adress
		}
	})

	res.json(contragent)
})


// @desc    Update contragent
// @route 	PUT /api/contragents/:id
// @access  Private
export const updateContragent = asyncHandler(async (req, res) => {
	const { name, number, email, adress } = req.body

	try {
		const contragent = await prisma.contragent.update({
			where: {
				id: +req.params.id
			},
			data: {
				name, number, email, adress
			}
		})

		res.json(contragent)
	} catch (error) {
		res.status(404)
		throw new Error('Contragent not found!')
	}
})


// @desc    Delete contragent
// @route 	DELETE /api/contragents/:id
// @access  Private
export const deleteContragent = asyncHandler(async (req, res) => {
	try {
		const contragent = await prisma.contragent.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Contragent deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('Contragent not found!')
	}
})
