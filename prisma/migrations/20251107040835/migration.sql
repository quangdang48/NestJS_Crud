/*
  Warnings:

  - You are about to drop the column `sessionData` on the `AuthSession` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AuthSession" DROP COLUMN "sessionData";
