import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
export const createSale = asyncHandler(async (req, res) => {
  const { itemId, quantity, price } = req.body;

  const item = await prisma.item.findUnique({
    where: { id: parseInt(itemId) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  const itemPrice = price ? parseInt(price) : item.priceForSale;

  const sale = await prisma.sale.create({
    data: {
      itemId: parseInt(itemId),
      quantity: parseInt(quantity),
      price: itemPrice,
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

  res.json(sale);
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = asyncHandler(async (req, res) => {
  const sales = await prisma.sale.findMany({
    include: {
      item: true,
    },
  });
  res.json(sales);
});
