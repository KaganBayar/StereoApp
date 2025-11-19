import { BaseRepository } from "./baseRepository";
import { Song, SongFormData } from "@/lib/shared/Types/songTypes";
import prisma from "@/lib/server/db";

export class SongRepository extends BaseRepository<Song> {
  protected model = prisma.song;
  protected baseOptions = {
    include: { album: true, artist: true },
  };

  async findByArtistId(artist_id: string): Promise<Song[] | null> {
    return this.model.findMany({
      where: { artist_id },
      ...this.baseOptions,
    });
  }
}
