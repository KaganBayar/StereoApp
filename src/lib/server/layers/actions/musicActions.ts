"use server";
import { container } from "../../DI_container/container";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

export class MusicActions {
  private musicService = container.musicService;

  // Album Actions
  async createAlbum(data: AlbumFormData): Promise<Album> {
    await authMiddleware.requireAdminUser();

    return this.musicService.createAlbum(data);
  }

  async updateAlbum(id: string, data: AlbumFormData): Promise<Album> {
    await authMiddleware.requireAdminUser();

    return this.musicService.updateAlbum(id, data);
  }
  async deleteAlbum(id: string): Promise<Album> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteAlbum(id);
  }
  async deleteManyAlbums(ids: string[]): Promise<void> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteManyAlbums(ids);
  }
  async getAlbumById(id: string): Promise<Album | null> {
    return this.musicService.findAlbumById(id);
  }
  async getAllAlbums(): Promise<Album[]> {
    return this.musicService.getAllAlbums();
  }
  // Song Actions
  async createSong(data: SongFormData): Promise<Song> {
    await authMiddleware.requireAdminUser();

    return this.musicService.createSong(data);
  }
  async updateSong(id: string, data: SongFormData): Promise<Song> {
    await authMiddleware.requireAdminUser();

    return this.musicService.updateSong(id, data);
  }
  async deleteSong(id: string): Promise<Song> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteSong(id);
  }
  async deleteManySongs(ids: string[]): Promise<void> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteManySongs(ids);
  }
  async getSongById(id: string): Promise<Song | null> {
    return this.musicService.findSongById(id);
  }
  async getAllSongs(): Promise<Song[]> {
    return this.musicService.getAllSongs();
  }
  async getSongsByArtistId(artistId: string): Promise<Song[] | null> {
    return this.musicService.findSongsByArtistId(artistId);
  }
  // Artist Actions
  async createArtist(data: ArtistFormData): Promise<Artist> {
    await authMiddleware.requireAdminUser();

    return this.musicService.createArtist(data);
  }
  async updateArtist(id: string, data: ArtistFormData): Promise<Artist> {
    await authMiddleware.requireAdminUser();

    return this.musicService.updateArtist(id, data);
  }
  async deleteArtist(id: string): Promise<Artist> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteArtist(id);
  }
  async deleteManyArtists(ids: string[]): Promise<void> {
    await authMiddleware.requireAdminUser();

    return this.musicService.deleteManyArtists(ids);
  }
  async getArtistById(id: string): Promise<Artist | null> {
    return this.musicService.findArtistById(id);
  }
  async getAllArtists(): Promise<Artist[]> {
    return this.musicService.getAllArtists();
  }
}

export const musicActions = new MusicActions();
