import { Playlist } from "@/lib/shared/Types/playlistTypes";
import { BaseRepository } from "./baseRepository";
import prisma from "@/lib/server/db";

export class PlaylistRepository extends BaseRepository<Playlist> {
  protected model = prisma.playlist;
  protected baseOptions = {
    include: {
      playlistSongs: { include: { song: true } },
    },
  };

  public async findUserPlaylists(userId: string): Promise<Playlist[]> {
    const playlists = await prisma.playlist.findMany({
      where: { user_id: userId },
      ...this.baseOptions,
    });
    return playlists;
  }
  public async addSongToPlaylist(playlistId: string, songId: string) {
    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlist_id: playlistId,
        song_id: songId,
      },
    });
    return playlistSong;
  }

  public async removeSongFromPlaylist(playlistId: string, songId: string) {
    const deletedPlaylistSong = await prisma.playlistSong.deleteMany({
      where: {
        playlist_id: playlistId,
        song_id: songId,
      },
    });
    return deletedPlaylistSong;
  }
}
