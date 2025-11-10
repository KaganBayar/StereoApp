"use server";
import { container } from "../../DI_container/container";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { authMiddleware } from "@/lib/middleware/authMiddleware";

const musicService = container.musicService;

// Album Actions
export async function createAlbum(data: AlbumFormData): Promise<Album> {
  await authMiddleware.requireAdminUser();

  return musicService.createAlbum(data);
}

export async function updateAlbum(
  id: string,
  data: AlbumFormData
): Promise<Album> {
  await authMiddleware.requireAdminUser();

  return musicService.updateAlbum(id, data);
}

export async function deleteAlbum(id: string): Promise<Album> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteAlbum(id);
}

export async function deleteManyAlbums(ids: string[]): Promise<void> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteManyAlbums(ids);
}

export async function getAlbumById(id: string): Promise<Album | null> {
  return musicService.findAlbumById(id);
}

export async function getAllAlbums(): Promise<Album[]> {
  return musicService.getAllAlbums();
}

// Song Actions
export async function createSong(data: SongFormData): Promise<Song> {
  await authMiddleware.requireAdminUser();

  return musicService.createSong(data);
}

export async function updateSong(
  id: string,
  data: SongFormData
): Promise<Song> {
  await authMiddleware.requireAdminUser();

  return musicService.updateSong(id, data);
}

export async function deleteSong(id: string): Promise<Song> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteSong(id);
}

export async function deleteManySongs(ids: string[]): Promise<void> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteManySongs(ids);
}

export async function getSongById(id: string): Promise<Song | null> {
  return musicService.findSongById(id);
}

export async function getAllSongs(): Promise<Song[]> {
  return musicService.getAllSongs();
}

export async function getSongsByArtistId(
  artistId: string
): Promise<Song[] | null> {
  return musicService.findSongsByArtistId(artistId);
}

// Artist Actions
export async function createArtist(data: ArtistFormData): Promise<Artist> {
  await authMiddleware.requireAdminUser();

  return musicService.createArtist(data);
}

export async function updateArtist(
  id: string,
  data: ArtistFormData
): Promise<Artist> {
  await authMiddleware.requireAdminUser();

  return musicService.updateArtist(id, data);
}

export async function deleteArtist(id: string): Promise<Artist> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteArtist(id);
}

export async function deleteManyArtists(ids: string[]): Promise<void> {
  await authMiddleware.requireAdminUser();

  return musicService.deleteManyArtists(ids);
}

export async function getArtistById(id: string): Promise<Artist | null> {
  return musicService.findArtistById(id);
}

export async function getAllArtists(): Promise<Artist[]> {
  return musicService.getAllArtists();
}
