/*
  Warnings:

  - You are about to drop the column `item_count` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemId]` on the table `Shop` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[itemId]` on the table `Warehouse` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "item_count";

-- AlterTable
ALTER TABLE "Shop" ALTER COLUMN "count" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Warehouse" ALTER COLUMN "count" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Shop_itemId_key" ON "Shop"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Warehouse_itemId_key" ON "Warehouse"("itemId");
