/*
  Warnings:

  - Added the required column `photo` to the `Author` table without a default value. This is not possible if the table is not empty.
  - Added the required column `length` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photo` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" ADD COLUMN     "photo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "length" INTEGER NOT NULL,
ADD COLUMN     "photo" TEXT NOT NULL;
