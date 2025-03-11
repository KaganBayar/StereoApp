/*
  Warnings:

  - Added the required column `photo` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Playlist" ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "photo" TEXT NOT NULL;
