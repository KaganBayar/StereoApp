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

  createPlaylist(data: Partial<Playlist>): Promise<Playlist> {
    this.authService.validateUserSession();
    return this.playlistRepository.create(data);
  }

  updatePlaylist(id: string, data: Partial<Playlist>): Promise<Playlist> {
    this.authService.validateUserSession();
    return this.playlistRepository.update(id, data);
  }

  deletePlaylist(id: string): Promise<Playlist> {
    this.authService.validateUserSession();
    return this.playlistRepository.delete(id);
  }

  deleteManyPlaylists(id: string): Promise<void> {
    this.authService.validateUserSession();
    return this.playlistRepository.deleteMany(id);
  }

  getPlaylistById(id: string): Promise<Playlist | null> {
    this.authService.validateUserSession();
    return this.playlistRepository.findById(id);
  }

  getAllPlaylists(): Promise<Playlist[]> {
    this.authService.validateUserSession();
    return this.playlistRepository.findMany();
  }

  getUserPlaylists(userId: string): Promise<Playlist[]> {
    this.authService.validateUserSession();
    return this.playlistRepository.findUserPlaylists(userId);
  }

  addSongToPlaylist(playlistId: string, songId: string) {
    this.authService.validateUserSession();
    return this.playlistRepository.addSongToPlaylist(playlistId, songId);
  }

  removeSongFromPlaylist(playlistId: string, songId: string) {
    this.authService.validateUserSession();
    return this.playlistRepository.removeSongFromPlaylist(playlistId, songId);
  }
}
