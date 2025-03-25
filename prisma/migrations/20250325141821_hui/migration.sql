-- AlterTable
ALTER TABLE "ContrAgent" ADD COLUMN     "inn" INTEGER;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "userId" INTEGER;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
