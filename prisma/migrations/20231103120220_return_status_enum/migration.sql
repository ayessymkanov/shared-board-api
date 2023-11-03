/*
  Warnings:

  - The `status` column on the `Card` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Open', 'Done', 'In_Progress');

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Open';
