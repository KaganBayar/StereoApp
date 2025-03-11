/*
  Warnings:

  - You are about to drop the column `userId` on the `Playlist` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Song` table. All the data in the column will be lost.
  - You are about to drop the column `playlistId` on the `Song` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Playlist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `author_id` to the `Song` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playlist_id` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Playlist" DROP CONSTRAINT "Playlist_userId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_playlistId_fkey";

-- AlterTable
ALTER TABLE "Playlist" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Song" DROP COLUMN "authorId",
DROP COLUMN "playlistId",
ADD COLUMN     "author_id" TEXT NOT NULL,
ADD COLUMN     "playlist_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Song" ADD CONSTRAINT "Song_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
