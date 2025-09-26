"use server";

import { PlaylistService } from "../services/playlistService";
import { container } from "../../DI container/container";
import { Playlist } from "@/lib/Types/playlistTypes";

export class PlaylistActions {
  private playlistService = container.playlistService;
  async createPlaylist(data: Partial<Playlist>): Promise<Playlist> {
    return this.playlistService.createPlaylist(data);
  }
  async updatePlaylist(id: string, data: Partial<Playlist>): Promise<Playlist> {
    return this.playlistService.updatePlaylist(id, data);
  }
  async deletePlaylist(id: string): Promise<Playlist> {
    return this.playlistService.deletePlaylist(id);
  }
  async deleteManyPlaylists(id: string): Promise<void> {
    return this.playlistService.deleteManyPlaylists(id);
  }
  async getPlaylistById(id: string): Promise<Playlist | null> {
    return this.playlistService.getPlaylistById(id);
  }
  async getAllPlaylists(): Promise<Playlist[]> {
    return this.playlistService.getAllPlaylists();
  }
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return this.playlistService.getUserPlaylists(userId);
  }
  async addSongToPlaylist(playlistId: string, songId: string) {
    return this.playlistService.addSongToPlaylist(playlistId, songId);
  }
  async removeSongFromPlaylist(playlistId: string, songId: string) {
    return this.playlistService.removeSongFromPlaylist(playlistId, songId);
  }
}
