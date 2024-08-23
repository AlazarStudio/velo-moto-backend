import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Transfer item between warehouse and store
// @route   POST /api/transfer
// @access  Private
export const transferItem = asyncHandler(async (req, res) => {
  const { itemId, quantity, from, to } = req.body; // from и to указывают на источник и цель (warehouse или store)

  if (!['store', 'warehouse'].includes(from) || !['store', 'warehouse'].includes(to)) {
    res.status(400);
    throw new Error("Invalid source or destination. They must be either 'store' or 'warehouse'.");
  }

  if (from === to) {
    res.status(400);
    throw new Error("Source and destination must be different.");
  }

  const item = await prisma.item.findUnique({
    where: { id: parseInt(itemId) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  // Определяем исходный источник
  let source;
  if (from === 'store') {
    source = await prisma.store.findUnique({
      where: { itemId: parseInt(itemId) },
    });
  } else if (from === 'warehouse') {
    source = await prisma.warehouse.findUnique({
      where: { itemId: parseInt(itemId) },
    });
  }

  if (!source || source.count < parseInt(quantity)) {
    res.status(400);
    throw new Error(`Not enough items in ${from}!`);
  }

  // Определяем цель перемещения
  let destination;
  if (to === 'store') {
    destination = await prisma.store.findUnique({
      where: { itemId: parseInt(itemId) },
    });
  } else if (to === 'warehouse') {
    destination = await prisma.warehouse.findUnique({
      where: { itemId: parseInt(itemId) },
    });
  }

  // Выполняем перемещение
  await prisma[from].update({
    where: { itemId: parseInt(itemId) },
    data: {
      count: {
        decrement: parseInt(quantity),
      },
    },
  });

  if (destination) {
    // Если цель уже существует, обновляем количество
    await prisma[to].update({
      where: { itemId: parseInt(itemId) },
      data: {
        count: {
          increment: parseInt(quantity),
        },
      },
    });
  } else {
    // Если цель не существует, создаем новую запись
    await prisma[to].create({
      data: {
        itemId: parseInt(itemId),
        count: parseInt(quantity),
      },
    });
  }

  res.json({ message: `Successfully transferred ${quantity} items from ${from} to ${to}.` });
});
