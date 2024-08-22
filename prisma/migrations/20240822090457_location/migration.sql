-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "amortization" TEXT,
ADD COLUMN     "frame_grouve" TEXT,
ADD COLUMN     "type" TEXT,
ADD COLUMN     "wheel_size" TEXT;

-- CreateTable
CREATE TABLE "ContrAgent" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "adress" TEXT NOT NULL,

    CONSTRAINT "ContrAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warehouse" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Warehouse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Warehouse" ADD CONSTRAINT "Warehouse_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
