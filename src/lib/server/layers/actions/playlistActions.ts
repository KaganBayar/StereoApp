"use server";

import { PlaylistService } from "../services/playlistService";
import { container } from "../../DI_container/container";
import { Playlist } from "@/lib/Types/playlistTypes";
import { getCurrentUser } from "../../auth";

export class PlaylistActions {
  private playlistService = container.playlistService;
  async createPlaylist(data: Partial<Playlist>): Promise<Playlist> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.createPlaylist(user, data);
  }
  async updatePlaylist(id: string, data: Partial<Playlist>): Promise<Playlist> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.updatePlaylist(user, id, data);
  }
  async deletePlaylist(id: string): Promise<Playlist> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.deletePlaylist(user, id);
  }
  async deleteManyPlaylists(ids: string[]): Promise<void> {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.deleteManyPlaylists(user, ids);
  }
  async getPlaylistById(id: string): Promise<Playlist | null> {
    return this.playlistService.getPlaylistById(id);
  }
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return this.playlistService.getUserPlaylists(userId);
  }
  async addSongToPlaylist(playlistId: string, songId: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.addSongToPlaylist(user, playlistId, songId);
  }
  async removeSongFromPlaylist(playlistId: string, songId: string) {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error("User not logged in");
    }
    return this.playlistService.removeSongFromPlaylist(
      user,
      playlistId,
      songId
    );
  }
}
