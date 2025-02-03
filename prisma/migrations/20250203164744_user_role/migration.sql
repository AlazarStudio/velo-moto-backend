-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VENDOR', 'USER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role";
