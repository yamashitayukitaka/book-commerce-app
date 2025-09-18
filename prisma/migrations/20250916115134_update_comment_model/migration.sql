/*
  Warnings:

  - You are about to drop the column `purchaseId` on the `Comment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_purchaseId_fkey";

-- AlterTable
ALTER TABLE "public"."Comment" DROP COLUMN "purchaseId";
