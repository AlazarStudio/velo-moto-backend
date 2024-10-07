/*
  Warnings:

  - A unique constraint covering the columns `[userId,itemId,buyertype]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buyertype` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `buyertype` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Buyer" AS ENUM ('contractor', 'customer');

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "buyertype" "Buyer" NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "buyertype" "Buyer" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_itemId_buyertype_key" ON "Cart"("userId", "itemId", "buyertype");
