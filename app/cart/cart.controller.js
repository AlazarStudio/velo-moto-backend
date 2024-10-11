import asyncHandler from "express-async-handler";

import { prisma } from "../prisma.js";

export const addItemToCart = asyncHandler(async (req, res) => {
  const { userId, itemId, quantity, buyertype, contrAgentId } = req.body;
  // const userId = req.user.id;

  // Проверка валидности buyertype
  if (!["contractor", "customer"].includes(buyertype)) {
    res.status(400);
    throw new Error(
      "Некорректный тип покупателя. Укажите 'contractor' или 'customer'."
    );
  }

  // Требование contrAgentId, если покупатель — контрагент
  // if (buyertype === "contractor" && !contrAgentId) {
  //   res.status(400);
  //   throw new Error("Необходимо указать ID контрагента для типа покупателя 'contractor'.");
  // }

  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    res.status(404);
    throw new Error("Товар не найден");
  }

  const cartItem = await prisma.cart.upsert({
    where: { userId_itemId_buyertype: { userId, itemId, buyertype } },
    update: { quantity: { increment: quantity } },
    create: {
      userId,
      itemId,
      quantity,
      buyertype,
      contrAgentId: buyertype === "contractor" ? contrAgentId || null : null,
    },
  });

  res.json(cartItem);
});

export const getCartItemsCustomer = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("req", req);

  const cartItems = await prisma.cart.findMany({
    where: { userId, buyertype: "customer" },
    include: {
      Item: true,
    },
  });

  res.json(cartItems);
});

export const getCartItemsContractor = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  console.log("req", req);

  const cartItems = await prisma.cart.findMany({
    where: { userId, buyertype: "contractor" },
    include: {
      Item: true,
    },
  });

  res.json(cartItems);
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId, buyertype } = req.body;
  const userId = req.user.id;

  await prisma.cart.deleteMany({
    where: {
      userId,
      itemId,
      buyertype,
    },
  });

  res.json({ message: "Товар удален из корзины" });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity, buyertype } = req.body;
  const userId = req.user.id;

  const cartItem = await prisma.cart.update({
    where: { userId_itemId_buyertype: { userId, itemId, buyertype } },
    data: { quantity },
  });

  res.json(cartItem);
});

export const confirmSale = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { buyertype, saleFrom, contrAgentId, price } = req.body;

  // Проверка валидности buyertype
  if (!["contractor", "customer"].includes(buyertype)) {
    res.status(400);
    throw new Error(
      "Некорректный тип покупателя. Укажите 'contractor' или 'customer'."
    );
  }

  // Требование contrAgentId, если покупатель — контрагент
  if (buyertype === "contractor" && !contrAgentId) {
    res.status(400);
    throw new Error(
      "Необходимо указать ID контрагента для типа покупателя 'contractor'."
    );
  }

  const cartItems = await prisma.cart.findMany({
    where: { userId, buyertype },
    include: {
      Item: true,
    },
  });

  if (!cartItems.length) {
    res.status(400);
    throw new Error("Корзина пуста");
  }

  // Процесс продажи для каждого товара
  for (const cartItem of cartItems) {
    await prisma.sale.create({
      data: {
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
        price: price ? price : cartItem.Item.priceForSale,
        source: saleFrom,
        buyertype: buyertype,
        contrAgentId: buyertype === "contractor" ? contrAgentId : null,
      },
    });

    // Обновление количества товара в зависимости от источника продажи
    if (saleFrom === "store") {
      const storeItem = await prisma.store.findUnique({
        where: { itemId: parseInt(cartItem.itemId) },
      });

      if (!storeItem || storeItem.count < parseInt(cartItem.quantity)) {
        res.status(400);
        throw new Error("Not enough items in store!");
      }

      await prisma.store.update({
        where: { itemId: parseInt(cartItem.itemId) },
        data: {
          count: {
            decrement: parseInt(cartItem.quantity),
          },
        },
      });
    } else if (saleFrom === "warehouse") {
      const warehouseItem = await prisma.warehouse.findUnique({
        where: { itemId: parseInt(cartItem.itemId) },
      });

      if (!warehouseItem || warehouseItem.count < parseInt(cartItem.quantity)) {
        res.status(400);
        throw new Error("Not enough items in warehouse!");
      }

      await prisma.warehouse.update({
        where: { itemId: parseInt(cartItem.itemId) },
        data: {
          count: {
            decrement: parseInt(cartItem.quantity),
          },
        },
      });
    } else {
      res.status(400);
      throw new Error(
        "Invalid source. It must be either 'store' or 'warehouse'."
      );
    }

    // Удаляем товар из корзины после продажи
    await prisma.cart.delete({ where: { id: cartItem.id } });
  }

  res.json({
    message: `Продажа успешно подтверждена для ${
      buyertype === "contractor" ? "контрагента" : "покупателя"
    }`,
  });
});
