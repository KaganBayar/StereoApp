/*
  Warnings:

  - Made the column `albumsId` on table `Song` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_albumsId_fkey";

-- AlterTable
ALTER TABLE "Song" ALTER COLUMN "albumsId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumsId_fkey" FOREIGN KEY ("albumsId") REFERENCES "Albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
