import asyncHandler from "express-async-handler";

import { prisma } from "../prisma.js";

// @desc    Get stores
// @route   GET /api/stores
// @access  Private
export const getStores = asyncHandler(async (req, res) => {
  const stores = await prisma.store.findMany({
    orderBy: {
      // createdAt: 'desc'
    },
  });
  res.json(stores);
});

// @desc    Get store
// @route   GET /api/stores/:id
// @access  Private
export const getStore = asyncHandler(async (req, res) => {
  const store = await prisma.store.findUnique({
    where: { id: +req.params.id },
  });

  if (!store) {
    res.status(404);
    throw new Error("Store not found!");
  }

  res.json({ ...store });
});

// @desc    Create new store
// @route 	POST /api/stores
// @access  Private
export const createNewStore = asyncHandler(async (req, res) => {
  const {} = req.body;

  const store = await prisma.store.create({
    data: {},
  });

  res.json(store);
});

// @desc    Update store
// @route 	PUT /api/stores/:id
// @access  Private
export const updateStore = asyncHandler(async (req, res) => {
  const {} = req.body;

  try {
    const store = await prisma.store.update({
      where: {
        id: +req.params.id,
      },
      data: {},
    });

    res.json(store);
  } catch (error) {
    res.status(404);
    throw new Error("Store not found!");
  }
});

// @desc    Delete store
// @route 	DELETE /api/stores/:id
// @access  Private
export const deleteStore = asyncHandler(async (req, res) => {
  try {
    const store = await prisma.store.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json({ message: "Store deleted!" });
  } catch (error) {
    res.status(404);
    throw new Error("Store not found!");
  }
});
