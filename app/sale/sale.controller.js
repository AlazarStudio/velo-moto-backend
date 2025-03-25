import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
export const createSale = asyncHandler(async (req, res) => {
  const { itemId, quantity, price, source, buyerType, contrAgentId } = req.body; // Добавлено поле source, buyerType и contrAgentId
  const userId = req.user.id;

  const item = await prisma.item.findUnique({
    where: { id: parseInt(itemId) },
  });

  if (!item) {
    res.status(404);
    throw new Error("Item not found!");
  }

  const itemPrice = price ? parseInt(price) : item.priceForSale;

  let saleData = {
    itemId: parseInt(itemId),
    quantity: parseInt(quantity),
    price: itemPrice,
    // user: { connect: { id: userId } },
    userId
  };

  // Проверка на покупателя
  if (buyerType === "contrAgent") {
    if (!contrAgentId) {
      res.status(400);
      throw new Error("ContrAgent ID is required for sales to contrAgents.");
    }

    const contrAgent = await prisma.contrAgent.findUnique({
      where: { id: parseInt(contrAgentId) },
    });

    if (!contrAgent) {
      res.status(404);
      throw new Error("ContrAgent not found!");
    }

    saleData.contrAgentId = parseInt(contrAgentId);
  }

  const sale = await prisma.sale.create({
    data: saleData,
  });

  // Обновление количества товара в зависимости от источника продажи
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

  res.json(sale);
});

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
export const getSales = asyncHandler(async (req, res) => {
  const sales = await prisma.sale.findMany({
    include: {
      item: true,
      contrAgent: true, // Включаем данные контрагента, если они есть
      user: true, // Включаем данные пользователя, если он есть
    },
  });
  res.json(sales);
});
