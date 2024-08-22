import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


// @desc    Get warehouses
// @route   GET /api/warehouses
// @access  Private
export const getWarehouses = asyncHandler(async (req, res) => {
	const warehouses = await prisma.warehouse.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})
	res.json(warehouses)
})


// @desc    Get warehouse
// @route   GET /api/warehouses/:id
// @access  Private
export const getWarehouse = asyncHandler(async (req, res) => {
	const warehouse = await prisma.warehouse.findUnique({
		where: { id: +req.params.id }
	})

	if (!warehouse) {
		res.status(404)
		throw new Error('Warehouse not found!')
	}

	res.json({ ...warehouse })
})


// @desc    Create new warehouse
// @route 	POST /api/warehouses
// @access  Private
export const createNewWarehouse = asyncHandler(async (req, res) => {
	const {  } = req.body

	const warehouse = await prisma.warehouse.create({
		data: {
			
		}
	})

	res.json(warehouse)
})


// @desc    Update warehouse
// @route 	PUT /api/warehouses/:id
// @access  Private
export const updateWarehouse = asyncHandler(async (req, res) => {
	const {  } = req.body

	try {
		const warehouse = await prisma.warehouse.update({
			where: {
				id: +req.params.id
			},
			data: {
				
			}
		})

		res.json(warehouse)
	} catch (error) {
		res.status(404)
		throw new Error('Warehouse not found!')
	}
})


// @desc    Delete warehouse
// @route 	DELETE /api/warehouses/:id
// @access  Private
export const deleteWarehouse = asyncHandler(async (req, res) => {
	try {
		const warehouse = await prisma.warehouse.delete({
			where: {
				id: +req.params.id
			}
		})

		res.json({ message: 'Warehouse deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('Warehouse not found!')
	}
})
