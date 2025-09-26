import { BaseRepository } from "./baseRepository";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import prisma from "@/lib/server/db";

export class AlbumRepository extends BaseRepository<Album> {
  protected model = prisma.album;
  protected baseOptions = {
    include: { artist: true, songs: true },
  };
}
