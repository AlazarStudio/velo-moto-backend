import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new receipt
// @route   POST /api/receipts
// @access  Private
export const createReceipt = asyncHandler(async (req, res) => {
  const { itemId, quantity, price, source } = req.body; // Добавлено поле source

  const item = await prisma.item.findUnique({
    where: { id: parseInt(itemId) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  const itemPrice = price ? parseInt(price) : item.price;

  const receipt = await prisma.receipt.create({
    data: {
      itemId: parseInt(itemId),
      quantity: parseInt(quantity),
      price: itemPrice,
    },
  });

  // Update item count based on source
  if (source === 'store') {
    await prisma.store.update({
      where: { itemId: parseInt(itemId) },
      data: {
        count: {
          increment: parseInt(quantity),
        },
      },
    });
  } else if (source === 'warehouse') {
    await prisma.warehouse.update({
      where: { itemId: parseInt(itemId) },
      data: {
        count: {
          increment: parseInt(quantity),
        },
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid source. It must be either 'store' or 'warehouse'.");
  }

  res.json(receipt);
});

// @desc    Get all receipts
// @route   GET /api/receipts
// @access  Private
export const getReceipts = asyncHandler(async (req, res) => {
  const receipts = await prisma.receipt.findMany({
    include: {
      item: true,
    },
  });
  res.json(receipts);
});
