/*
  Warnings:

  - Added the required column `price` to the `Produce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unit` to the `Produce` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProduceStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Produce" ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "ProduceStatus" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "unit" TEXT NOT NULL;
