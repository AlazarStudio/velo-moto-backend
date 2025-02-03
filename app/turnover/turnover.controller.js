import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Get turnover report
// @route   GET /api/reports/turnover
// @access  Private
export const getTurnoverReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  // Парсим даты
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Получаем список всех товаров
  const items = await prisma.item.findMany();

  // Инициализируем массив для хранения данных отчета
  const reportData = [];

  for (const item of items) {
    const itemId = item.id;

    // Начальный остаток: количество поступлений и вычетов до начала периода
    const initialReceipts = await prisma.receipt.aggregate({
      where: {
        itemId,
        createdAt: {
          lt: start,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const initialSales = await prisma.sale.aggregate({
      where: {
        itemId,
        createdAt: {
          lt: start,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const initialWriteOffs = await prisma.writeOff.aggregate({
      where: {
        itemId,
        createdAt: {
          lt: start,
        },
      },
      _sum: {
        quantity: true,
      },
    });

    const initialQuantity =
      (initialReceipts._sum.quantity || 0) -
      (initialSales._sum.quantity || 0) -
      (initialWriteOffs._sum.quantity || 0);

    // Поступления за период
    const periodReceipts = await prisma.receipt.findMany({
      where: {
        itemId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalReceiptsQuantity = periodReceipts.reduce(
      (acc, receipt) => acc + receipt.quantity,
      0
    );

    const totalReceiptsAmount = periodReceipts.reduce(
      (acc, receipt) => acc + receipt.quantity * (receipt.price || item.price),
      0
    );

    // Продажи за период
    const periodSales = await prisma.sale.findMany({
      where: {
        itemId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalSalesQuantity = periodSales.reduce(
      (acc, sale) => acc + sale.quantity,
      0
    );

    const totalSalesAmount = periodSales.reduce(
      (acc, sale) => acc + sale.quantity * sale.price,
      0
    );

    // Списания за период
    const periodWriteOffs = await prisma.writeOff.findMany({
      where: {
        itemId,
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const totalWriteOffsQuantity = periodWriteOffs.reduce(
      (acc, writeOff) => acc + writeOff.quantity,
      0
    );

    const totalWriteOffsAmount = periodWriteOffs.reduce(
      (acc, writeOff) =>
        acc + writeOff.quantity * (writeOff.price || item.price),
      0
    );

    // Конечный остаток
    const finalQuantity =
      initialQuantity +
      totalReceiptsQuantity -
      totalSalesQuantity -
      totalWriteOffsQuantity;

    // Добавляем данные по текущему товару в отчет
    reportData.push({
      itemId: item.id,
      itemName: item.name,
      initialQuantity,
      receipts: {
        quantity: totalReceiptsQuantity,
        amount: totalReceiptsAmount,
      },
      sales: {
        quantity: totalSalesQuantity,
        amount: totalSalesAmount,
      },
      writeOffs: {
        quantity: totalWriteOffsQuantity,
        amount: totalWriteOffsAmount,
      },
      finalQuantity,
    });
  }

  res.json({
    period: {
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    },
    report: reportData,
  });
});
