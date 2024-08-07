import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new receipt
// @route   POST /api/receipts
// @access  Private
export const createReceipt = asyncHandler(async (req, res) => {
  const { itemId, quantity, price } = req.body;

  const receipt = await prisma.receipt.create({
    data: {
      itemId: parseInt(itemId),
      quantity: parseInt(quantity),
      price: parseInt(price),
    },
  });

  // Update item count
  await prisma.item.update({
    where: { id: parseInt(itemId) },
    data: {
      itemCount: {
        increment: parseInt(quantity),
      },
    },
  });

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
