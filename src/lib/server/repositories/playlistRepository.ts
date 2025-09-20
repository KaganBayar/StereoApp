"use server";
import { Playlist, PlaylistFormData } from "@/lib/Types/playlistTypes";
import prisma from "@/lib/server/db";
import { BaseRepository } from "./baseRepository";

type PlaylistModel = {
  type: Playlist;
  formData: PlaylistFormData;
};

export class PlaylistRepository extends BaseRepository<PlaylistModel> {
  protected model = prisma.playlist;
  protected baseOptions = {
    include: {
      playlistSongs: { include: { song: true } },
    },
  };
}
