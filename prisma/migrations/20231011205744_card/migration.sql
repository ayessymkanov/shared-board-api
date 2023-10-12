/*
  Warnings:

  - You are about to drop the column `team_id` on the `Card` table. All the data in the column will be lost.
  - Made the column `teamId` on table `Card` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_team_id_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "team_id",
ALTER COLUMN "teamId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
