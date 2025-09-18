"use server";
import { BaseRepository } from "./baseRepositories";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import prisma from "@/lib/server/db";

type SongModel = {
  type: Song;
  formData: SongFormData;
};

export class SongRepositories extends BaseRepository<SongModel> {
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
