import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new write-off
// @route   POST /api/writeoffs
// @access  Private
export const createWriteOff = asyncHandler(async (req, res) => {
  const { itemId, quantity, reason } = req.body;

  const writeOff = await prisma.writeOff.create({
    data: {
      itemId: parseInt(itemId),
      quantity: parseInt(quantity),
      reason,
    },
  });

  // Update item count
  await prisma.item.update({
    where: { id: parseInt(itemId) },
    data: {
      itemCount: {
        decrement: parseInt(quantity),
      },
    },
  });

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
