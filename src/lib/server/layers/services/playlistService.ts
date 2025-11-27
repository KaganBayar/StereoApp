import { PlaylistRepository } from "../repositories/playlistRepository";
import { AuthService } from "./authService";
import { Playlist } from "@/lib/shared/Types/playlistTypes";

export class PlaylistService {
  private playlistRepository: PlaylistRepository;
  private authService: AuthService;

  constructor(
    playlistRepository: PlaylistRepository,
    authService: AuthService
  ) {
    this.playlistRepository = playlistRepository;
    this.authService = authService;
  }

  async createPlaylist(data: Partial<Playlist>): Promise<Playlist> {
    return await this.playlistRepository.create(data);
  }

  async updatePlaylist(id: string, data: Partial<Playlist>): Promise<Playlist> {
    return await this.playlistRepository.update(id, data);
  }

  async deletePlaylist(id: string): Promise<Playlist> {
    return await this.playlistRepository.delete(id);
  }

  async deleteManyPlaylists(ids: string[]): Promise<void> {
    return await this.playlistRepository.deleteMany(ids);
  }

  async getPlaylistById(id: string): Promise<Playlist | null> {
    return await this.playlistRepository.findById(id);
  }

  async getAllPlaylists(): Promise<Playlist[]> {
    return await this.playlistRepository.findMany();
  }

  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return await this.playlistRepository.findUserPlaylists(userId);
  }

  async addSongToPlaylist(playlistId: string, songId: string) {
    return await this.playlistRepository.addSongToPlaylist(playlistId, songId);
  }

  async removeSongFromPlaylist(playlistId: string, songId: string) {
    return await this.playlistRepository.removeSongFromPlaylist(
      playlistId,
      songId
    );
  }
}
