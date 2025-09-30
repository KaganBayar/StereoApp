import { UserPayload } from "@/lib/Types/userTypes";
import { PlaylistRepository } from "../repositories/playlistRepository";
import { AuthService } from "./authService";
import { Playlist, PlaylistFormData } from "@/lib/Types/playlistTypes";

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

  async createPlaylist(
    requestingUserToken: UserPayload,
    data: Partial<Playlist>
  ): Promise<Playlist> {
    const user = await this.authService.requireValidUser(requestingUserToken);
    //admin check
    if (user.roles.includes("admin")) {
      return await this.playlistRepository.create(data);
    }
    if (data.user_id === user.id) {
      return await this.playlistRepository.create(data);
    }
    throw new Error("User not authorized to create playlist for another user");
  }

  async updatePlaylist(
    requestingUserToken: UserPayload,
    id: string,
    data: Partial<Playlist>
  ): Promise<Playlist> {
    const user = await this.authService.requireValidUser(requestingUserToken);
    //admin check
    if (user.roles.includes("admin")) {
      return await this.playlistRepository.update(id, data);
    }

    const playlist = await this.playlistRepository.findById(id);

    if (!playlist) {
      throw new Error("Playlist not found");
    }

    if (playlist.user_id === user.id) {
      return await this.playlistRepository.update(id, data);
    }
    throw new Error("User not authorized to update playlist for another user");
  }

  async deletePlaylist(
    requestingUserToken: UserPayload,
    id: string
  ): Promise<Playlist> {
    const user = await this.authService.requireValidUser(requestingUserToken);
    if (user.roles.includes("admin")) {
      return await this.playlistRepository.delete(id);
    }
    const playlist = await this.playlistRepository.findById(id);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.user_id === user.id) {
      return await this.playlistRepository.delete(id);
    }
    throw new Error("User not authorized to delete playlist for another user");
  }

  async deleteManyPlaylists(
    requestingUserToken: UserPayload,
    ids: string[]
  ): Promise<void> {
    await this.authService.requireAdminUser(requestingUserToken);
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

  async addSongToPlaylist(
    requestingUserToken: UserPayload,
    playlistId: string,
    songId: string
  ) {
    const user = await this.authService.requireValidUser(requestingUserToken);
    if (user.roles.includes("admin")) {
      return await this.playlistRepository.addSongToPlaylist(
        playlistId,
        songId
      );
    }
    const playlist = await this.playlistRepository.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.user_id !== user.id) {
      throw new Error("User not authorized to modify this playlist");
    }
    return await this.playlistRepository.addSongToPlaylist(playlistId, songId);
  }

  async removeSongFromPlaylist(
    requestingUserToken: UserPayload,
    playlistId: string,
    songId: string
  ) {
    const user = await this.authService.requireValidUser(requestingUserToken);
    if (user.roles.includes("admin")) {
      return await this.playlistRepository.removeSongFromPlaylist(
        playlistId,
        songId
      );
    }
    const playlist = await this.playlistRepository.findById(playlistId);
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    if (playlist.user_id !== user.id) {
      throw new Error("User not authorized to modify this playlist");
    }
    return await this.playlistRepository.removeSongFromPlaylist(
      playlistId,
      songId
    );
  }
}
