"use server";
import { container } from "../../DI_container/container";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { getCurrentUser } from "../../auth";

export class MusicActions {
  private musicService = container.musicService;

  // Album Actions
  async createAlbum(data: AlbumFormData): Promise<Album> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.createAlbum(user, data);
  }

  async updateAlbum(id: string, data: AlbumFormData): Promise<Album> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.updateAlbum(user, id, data);
  }
  async deleteAlbum(id: string): Promise<Album> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteAlbum(user, id);
  }
  async deleteManyAlbums(ids: string[]): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteManyAlbums(user, ids);
  }
  async getAlbumById(id: string): Promise<Album | null> {
    return this.musicService.findAlbumById(id);
  }
  async getAllAlbums(): Promise<Album[]> {
    return this.musicService.getAllAlbums();
  }
  // Song Actions
  async createSong(data: SongFormData): Promise<Song> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.createSong(user, data);
  }
  async updateSong(id: string, data: SongFormData): Promise<Song> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.updateSong(user, id, data);
  }
  async deleteSong(id: string): Promise<Song> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteSong(user, id);
  }
  async deleteManySongs(ids: string[]): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteManySongs(user, ids);
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
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.createArtist(user, data);
  }
  async updateArtist(id: string, data: ArtistFormData): Promise<Artist> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.updateArtist(user, id, data);
  }
  async deleteArtist(id: string): Promise<Artist> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteArtist(user, id);
  }
  async deleteManyArtists(ids: string[]): Promise<void> {
    const user = await getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    return this.musicService.deleteManyArtists(user, ids);
  }
  async getArtistById(id: string): Promise<Artist | null> {
    return this.musicService.findArtistById(id);
  }
  async getAllArtists(): Promise<Artist[]> {
    return this.musicService.getAllArtists();
  }
}
