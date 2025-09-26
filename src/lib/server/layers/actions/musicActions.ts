"use server";
import { container } from "../../DI container/container";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";

export class MusicActions {
  private musicService = container.musicService;

  // Album Actions
  async createAlbum(data: AlbumFormData): Promise<Album> {
    return this.musicService.createAlbum(data);
  }
  async updateAlbum(id: string, data: AlbumFormData): Promise<Album> {
    return this.musicService.updateAlbum(id, data);
  }
  async deleteAlbum(id: string): Promise<Album> {
    return this.musicService.deleteAlbum(id);
  }
  async deleteManyAlbums(id: string): Promise<void> {
    return this.musicService.deleteManyAlbums(id);
  }
  async getAlbumById(id: string): Promise<Album | null> {
    return this.musicService.getAlbumById(id);
  }
  async getAllAlbums(): Promise<Album[]> {
    return this.musicService.getAllAlbums();
  }
  // Song Actions
  async createSong(data: SongFormData): Promise<Song> {
    return this.musicService.createSong(data);
  }
  async updateSong(id: string, data: SongFormData): Promise<Song> {
    return this.musicService.updateSong(id, data);
  }
  async deleteSong(id: string): Promise<Song> {
    return this.musicService.deleteSong(id);
  }
  async deleteManySongs(id: string): Promise<void> {
    return this.musicService.deleteManySongs(id);
  }
  async getSongById(id: string): Promise<Song | null> {
    return this.musicService.getSongById(id);
  }
  async getAllSongs(): Promise<Song[]> {
    return this.musicService.getAllSongs();
  }
  async getSongsByArtistId(artistId: string): Promise<Song[] | null> {
    return this.musicService.getSongsByArtistId(artistId);
  }
  // Artist Actions
  async createArtist(data: ArtistFormData): Promise<Artist> {
    return this.musicService.createArtist(data);
  }
  async updateArtist(id: string, data: ArtistFormData): Promise<Artist> {
    return this.musicService.updateArtist(id, data);
  }
  async deleteArtist(id: string): Promise<Artist> {
    return this.musicService.deleteArtist(id);
  }
  async deleteManyArtists(id: string): Promise<void> {
    return this.musicService.deleteManyArtists(id);
  }
  async getArtistById(id: string): Promise<Artist | null> {
    return this.musicService.getArtistById(id);
  }
  async getAllArtists(): Promise<Artist[]> {
    return this.musicService.getAllArtists();
  }
}
