import { BaseRepository } from "./baseRepository";
import { Album } from "@/lib/shared/Types/albumTypes";
import prisma from "@/lib/server/db";

export class AlbumRepository extends BaseRepository<Album> {
  protected model = prisma.album;
  protected baseOptions = {
    include: { artist: true, songs: true },
  };
}
