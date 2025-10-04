"use server";

import { PlaylistService } from "../services/playlistService";
import { container } from "../../DI_container/container";
import { Playlist } from "@/lib/Types/playlistTypes";
import { authMiddleware } from "@/lib/middleware/authMiddleware";
import { auth } from "../../../../../config/firebase";

export class PlaylistActions {
  private playlistService = container.playlistService;
  private userService = container.userService;
  async createPlaylist(data: Partial<Playlist>): Promise<Playlist> {
    const user = await authMiddleware.requireValidUser();
    if (!user) throw new Error("User not authenticated");

    if (await this.userService.isUserAdmin(user.id)) {
      return this.playlistService.createPlaylist(data);
    }

    if (data.user_id !== user.id) {
      throw new Error("You can only create playlists for yourself");
    }
    return this.playlistService.createPlaylist(data);
  }
  async updatePlaylist(id: string, data: Partial<Playlist>): Promise<Playlist> {
    const user = await authMiddleware.requireValidUser();

    if (!user) throw new Error("User not authenticated");
    const playlist = await this.playlistService.getPlaylistById(id);

    if (!playlist) throw new Error("Playlist not found");

    if (await this.userService.isUserAdmin(user.id)) {
      return this.playlistService.updatePlaylist(id, data);
    }

    if (playlist.user_id !== user.id) {
      throw new Error("You can only update your own playlists");
    }

    return this.playlistService.updatePlaylist(id, data);
  }
  async deletePlaylist(id: string): Promise<Playlist> {
    const user = await authMiddleware.requireValidUser();

    if (!user) throw new Error("User not authenticated");
    const playlist = await this.playlistService.getPlaylistById(id);

    if (!playlist) throw new Error("Playlist not found");

    if (await this.userService.isUserAdmin(user.id)) {
      return this.playlistService.deletePlaylist(id);
    }

    if (playlist.user_id !== user.id) {
      throw new Error("You can only delete your own playlists");
    }

    return this.playlistService.deletePlaylist(id);
  }

  async deleteManyPlaylists(ids: string[]): Promise<void> {
    //for now it is admin only
    const user = await authMiddleware.requireAdminUser();
    return this.playlistService.deleteManyPlaylists(ids);
  }
  async getPlaylistById(id: string): Promise<Playlist | null> {
    return this.playlistService.getPlaylistById(id);
  }
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return this.playlistService.getUserPlaylists(userId);
  }
  async addSongToPlaylist(playlistId: string, songId: string) {
    const user = await authMiddleware.requireValidUser();

    if (!user) throw new Error("User not authenticated");
    const playlist = await this.playlistService.getPlaylistById(playlistId);

    if (!playlist) throw new Error("Playlist not found");

    if (await this.userService.isUserAdmin(user.id)) {
      return this.playlistService.addSongToPlaylist(playlistId, songId);
    }

    if (playlist.user_id !== user.id) {
      throw new Error("You can only add songs to your own playlists");
    }

    return this.playlistService.addSongToPlaylist(playlistId, songId);
  }
  async removeSongFromPlaylist(playlistId: string, songId: string) {
    const user = await authMiddleware.requireValidUser();

    if (!user) throw new Error("User not authenticated");
    const playlist = await this.playlistService.getPlaylistById(playlistId);

    if (!playlist) throw new Error("Playlist not found");

    if (await this.userService.isUserAdmin(user.id)) {
      return this.playlistService.removeSongFromPlaylist(playlistId, songId);
    }

    if (playlist.user_id !== user.id) {
      throw new Error("You can only remove songs from your own playlists");
    }

    return this.playlistService.removeSongFromPlaylist(playlistId, songId);
  }
}

export const playlistActions = new PlaylistActions();
