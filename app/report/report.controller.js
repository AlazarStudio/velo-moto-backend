import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;



  // Get sales
  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      item: true,
      user: true,
      // item: false
    },
  });

  const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
  const totalAmount = sales.reduce(
    (acc, sale) => acc + sale.quantity * sale.price,
    0
  );

  // Determine the most sold color
  const colorSales = sales.reduce((acc, sale) => {
    const color = sale.item.color;
    if (!acc[color]) {
      acc[color] = 0;
    }
    acc[color] += sale.quantity;
    return acc;
  }, {});

  const mostSoldColor = Object.keys(colorSales).reduce(
    (a, b) => (colorSales[a] > colorSales[b] ? a : b),
    ""
  );

  // Get write-offs
  const writeOffs = await prisma.writeOff.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      item: true,
      // user: true,
      // item: false
    },
  });

  const totalWriteOffQuantity = writeOffs.reduce(
    (acc, writeOff) => acc + writeOff.quantity,
    0
  );
  const totalWriteOffCost = writeOffs.reduce(
    (acc, writeOff) => acc + writeOff.quantity * writeOff.price,
    0
  );

  // Get receipts
  const receipts = await prisma.receipt.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      item: true,
      // user: true,
      // item: false
    },
  });

  const totalReceiptQuantity = receipts.reduce(
    (acc, receipt) => acc + receipt.quantity,
    0
  );
  const totalReceiptCost = receipts.reduce(
    (acc, receipt) =>
      acc + receipt.quantity * (receipt.price || receipt.item.price),
    0
  );

  res.json({
    totalQuantity,
    totalAmount,
    mostSoldColor,
    totalWriteOffQuantity,
    totalWriteOffCost,
    totalReceiptQuantity,
    totalReceiptCost,
    sales,
    writeOffs,
    receipts,
  });
});
