/*
  Warnings:

  - The primary key for the `Card` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Board` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `assigneeId` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDateTime` to the `Card` table without a default value. This is not possible if the table is not empty.
  - Added the required column `team_id` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Open', 'Done', 'In_Progress');

-- AlterTable
ALTER TABLE "Card" DROP CONSTRAINT "Card_pkey",
ADD COLUMN     "assigneeId" INTEGER NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dueDateTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Open',
ADD COLUMN     "teamId" INTEGER,
ADD COLUMN     "team_id" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Card_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Card_id_seq";

-- DropTable
DROP TABLE "Board";

-- CreateTable
CREATE TABLE "UserTeam" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "team_id" INTEGER NOT NULL,

    CONSTRAINT "UserTeam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTeam" ADD CONSTRAINT "UserTeam_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
