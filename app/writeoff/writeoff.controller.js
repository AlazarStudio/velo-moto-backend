import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new write-off
// @route   POST /api/writeoffs
// @access  Private
export const createWriteOff = asyncHandler(async (req, res) => {
  const { itemId, quantity, reason, price, source } = req.body; // Добавлено поле source

  const item = await prisma.item.findUnique({
    where: { id: parseInt(itemId) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  const itemPrice = price ? parseInt(price) : item.price;

  const writeOff = await prisma.writeOff.create({
    data: {
      itemId: parseInt(itemId),
      quantity: parseInt(quantity),
      reason,
      price: itemPrice,
    },
  });

  // Update item count based on source
  if (source === "store") {
    const storeItem = await prisma.store.findUnique({
      where: { itemId: parseInt(itemId) },
    });

    if (!storeItem || storeItem.count < parseInt(quantity)) {
      res.status(400);
      throw new Error("Not enough items in store!");
    }

    await prisma.store.update({
      where: { itemId: parseInt(itemId) },
      data: {
        count: {
          decrement: parseInt(quantity),
        },
      },
    });
  } else if (source === "warehouse") {
    const warehouseItem = await prisma.warehouse.findUnique({
      where: { itemId: parseInt(itemId) },
    });

    if (!warehouseItem || warehouseItem.count < parseInt(quantity)) {
      res.status(400);
      throw new Error("Not enough items in warehouse!");
    }

    await prisma.warehouse.update({
      where: { itemId: parseInt(itemId) },
      data: {
        count: {
          decrement: parseInt(quantity),
        },
      },
    });
  } else {
    res.status(400);
    throw new Error(
      "Invalid source. It must be either 'store' or 'warehouse'."
    );
  }

  res.json(writeOff);
});

// @desc    Get all write-offs
// @route   GET /api/writeoffs
// @access  Private
export const getWriteOffs = asyncHandler(async (req, res) => {
  const writeOffs = await prisma.writeOff.findMany({
    include: {
      item: true,
    },
  });
  res.json(writeOffs);
});
