import asyncHandler from "express-async-handler";

import { prisma } from "../prisma.js";

// @desc    Get items
// @route   GET /api/items
// @access  Private
export const getItems = asyncHandler(async (req, res) => {
  const items = await prisma.item.findMany({
    orderBy: {
      name: "desc",
      // createdAt: "desc",
    },
    include: {
      group: {
        select: {
          name: true,
        },
      },
    },
  });
  res.json(items);
});

// @desc    Get item
// @route   GET /api/items/:id
// @access  Private
export const getItem = asyncHandler(async (req, res) => {
  const item = await prisma.item.findUnique({
    where: { id: +req.params.id },
    include: {
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  res.json({ ...item });
});

// @desc    Create new item
// @route 	POST /api/items
// @access  Private
export const createNewItem = asyncHandler(async (req, res) => {
  const {
    name,
    images,
    description,
    groupId,
    price,
    priceForSale,
    code,
    barcode,
    nds,
    frame,
    system,
    size,
    ratchet,
    weight,
    speed,
    fork,
    carriage,
    flywheels,
    breaks,
    frontDerailleur,
    backDerailleur,
    bushings,
    rubber,
    itemCount,
  } = req.body;

  console.log("Received data:", req.body);

  const item = await prisma.item.create({
    data: {
      name,
      images,
      description,
      groupId: parseInt(groupId),
      price: parseInt(price),
      priceForSale: parseInt(priceForSale),
      code: parseInt(code),
      barcode,
      nds: parseInt(nds),
      frame,
      system,
      size,
      ratchet,
      weight,
      speed,
      fork,
      carriage,
      flywheels,
      breaks,
      frontDerailleur,
      backDerailleur,
      bushings,
      rubber,
      itemCount: parseInt(itemCount),
    },
  });

  res.json(item);
});

// @desc    Update item
// @route 	PUT /api/items/:id
// @access  Private
export const updateItem = asyncHandler(async (req, res) => {
  const {
    name,
    images,
    description,
    groupId,
    price,
    priceForSale,
    code,
    barcode,
    nds,
    frame,
    system,
    size,
    ratchet,
    weight,
    speed,
    fork,
    carriage,
    flywheels,
    breaks,
    frontDerailleur,
    backDerailleur,
    bushings,
    rubber,
    itemCount,
  } = req.body;

  try {
    const item = await prisma.item.update({
      where: {
        id: +req.params.id,
      },
      data: {
        name,
        images,
        description,
        groupId: parseInt(groupId),
        price: parseInt(price),
        priceForSale: parseInt(priceForSale),
        code: parseInt(code),
        barcode,
        nds: parseInt(nds),
        frame,
        system,
        size,
        ratchet,
        weight,
        speed,
        fork,
        carriage,
        flywheels,
        breaks,
        frontDerailleur,
        backDerailleur,
        bushings,
        rubber,
        itemCount: parseInt(itemCount),
      },
    });

    res.json(item);
  } catch (error) {
    res.status(404);
    throw new Error("Item not found!");
  }
});

// @desc    Delete item
// @route 	DELETE /api/items/:id
// @access  Private
export const deleteItem = asyncHandler(async (req, res) => {
  try {
    const item = await prisma.item.delete({
      where: {
        id: +req.params.id,
      },
    });

    res.json({ message: "Item deleted!" });
  } catch (error) {
    res.status(404);
    throw new Error("Item not found!");
  }
});
