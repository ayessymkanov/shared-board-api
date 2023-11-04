-- CreateTable
CREATE TABLE "PendingMember" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "signedUp" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PendingMember_pkey" PRIMARY KEY ("id")
);
