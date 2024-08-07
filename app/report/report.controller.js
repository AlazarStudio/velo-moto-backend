import asyncHandler from "express-async-handler";
import { prisma } from "../prisma.js";

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private
export const getSalesReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const sales = await prisma.sale.findMany({
    where: {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    },
    include: {
      item: true,
    },
  });

  const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
  const totalAmount = sales.reduce(
    (acc, sale) => acc + sale.quantity * sale.price,
    0
  );

  res.json({
    totalQuantity,
    totalAmount,
    sales,
  });
});
