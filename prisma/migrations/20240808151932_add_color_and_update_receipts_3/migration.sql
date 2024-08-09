-- AlterTable
ALTER TABLE "Sale" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WriteOff" ADD COLUMN     "price" INTEGER;
