import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


export const addItemToCart = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id; // Предполагается, что есть аутентификация пользователя

  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) {
    res.status(404);
    throw new Error("Товар не найден");
  }

  const cartItem = await prisma.cart.upsert({
    where: { userId_itemId: { userId, itemId } },
    update: { quantity: { increment: quantity } },
    create: {
      userId,
      itemId,
      quantity,
    },
  });

  res.json(cartItem);
});

export const getCartItems = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cart.findMany({
    where: { userId },
    include: {
      Item: true,
    },
  });

  res.json(cartItems);
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.body;
  const userId = req.user.id;

  await prisma.cart.deleteMany({
    where: {
      userId,
      itemId,
    },
  });

  res.json({ message: "Товар удален из корзины" });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId, quantity } = req.body;
  const userId = req.user.id;

  const cartItem = await prisma.cart.update({
    where: { userId_itemId: { userId, itemId } },
    data: { quantity },
  });

  res.json(cartItem);
});

export const confirmSale = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const cartItems = await prisma.cart.findMany({
    where: { userId },
  });

  if (!cartItems.length) {
    res.status(400);
    throw new Error("Корзина пуста");
  }

  // Процесс продажи для каждого товара
  for (const cartItem of cartItems) {
    const sale = await prisma.sale.create({
      data: {
        itemId: cartItem.itemId,
        quantity: cartItem.quantity,
        price: cartItem.Item.priceForSale,
        // Можно добавить дополнительные данные
      },
    });

    // Обновление количества товара на складе или в магазине
    await prisma.store.update({
      where: { itemId: cartItem.itemId },
      data: { count: { decrement: cartItem.quantity } },
    });

    // Удаление товара из корзины после продажи
    await prisma.cart.delete({ where: { id: cartItem.id } });
  }

  res.json({ message: "Продажа успешно подтверждена" });
});
