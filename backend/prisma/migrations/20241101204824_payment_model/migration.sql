-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentMethod" TEXT NOT NULL DEFAULT 'MPESA',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING';
