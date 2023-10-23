-- AlterTable
CREATE SEQUENCE user_personalboardid_seq;
ALTER TABLE "User" ALTER COLUMN "personalBoardId" SET DEFAULT nextval('user_personalboardid_seq');
ALTER SEQUENCE user_personalboardid_seq OWNED BY "User"."personalBoardId";
