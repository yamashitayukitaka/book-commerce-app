-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_purchaseId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "public"."Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
