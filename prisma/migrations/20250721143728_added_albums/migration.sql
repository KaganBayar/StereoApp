/*
  Warnings:

  - You are about to drop the column `photo` on the `Author` table. All the data in the column will be lost.
  - Added the required column `genre` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Author" DROP COLUMN "photo",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "genre" TEXT NOT NULL,
ADD COLUMN     "photo_url" TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Song" ADD COLUMN     "albumsId" TEXT;

-- CreateTable
CREATE TABLE "Albums" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "releaseDate" TIMESTAMP(3) NOT NULL,
    "cover_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Albums_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_albumsId_fkey" FOREIGN KEY ("albumsId") REFERENCES "Albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Albums" ADD CONSTRAINT "Albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
