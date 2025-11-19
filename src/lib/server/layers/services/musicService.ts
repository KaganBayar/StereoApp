import { UserRepository } from "../repositories/userRepository";
import { AlbumRepository } from "../repositories/albumRepository";
import { SongRepository } from "../repositories/songRepository";
import { AuthService } from "./authService";
import { Album, AlbumFormData } from "@/lib/shared/Types/albumTypes";
import { Song, SongFormData } from "@/lib/shared/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/shared/Types/artistTypes";
import { ArtistRepository } from "../repositories/artistRepository";
import { UserPayload } from "@/lib/shared/Types/userTypes";

export class MusicService {
  private userRepository: UserRepository;
  private authService: AuthService;
  private albumRepository: AlbumRepository;
  private songRepository: SongRepository;
  private artistRepository: ArtistRepository;

  constructor(
    userRepository: UserRepository,
    authService: AuthService,
    albumRepository: AlbumRepository,
    songRepository: SongRepository,
    artistRepository: ArtistRepository
  ) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.albumRepository = albumRepository;
    this.songRepository = songRepository;
    this.artistRepository = artistRepository;
  }
  // album related methods
  async createAlbum(data: Partial<Album>): Promise<Album> {
    return await this.albumRepository.create(data);
  }
  async updateAlbum(album_id: string, data: Partial<Album>): Promise<Album> {
    return await this.albumRepository.update(album_id, data);
  }
  async deleteAlbum(album_id: string): Promise<Album> {
    return await this.albumRepository.delete(album_id);
  }
  async deleteManyAlbums(album_ids: string[]): Promise<void> {
    return await this.albumRepository.deleteMany(album_ids);
  }
  async findAlbumById(album_id: string): Promise<Album | null> {
    return await this.albumRepository.findById(album_id);
  }
  async findById(album_id: string): Promise<Album | null> {
    return await this.albumRepository.findById(album_id);
  }
  async getAllAlbums(): Promise<Album[]> {
    return await this.albumRepository.findMany();
  }
  // song related methods
  async createSong(data: Partial<Song>): Promise<Song> {
    return await this.songRepository.create(data);
  }

  async updateSong(song_id: string, data: Partial<Song>): Promise<Song> {
    return await this.songRepository.update(song_id, data);
  }

  async deleteSong(song_id: string): Promise<Song> {
    return await this.songRepository.delete(song_id);
  }

  async deleteManySongs(song_ids: string[]): Promise<void> {
    return await this.songRepository.deleteMany(song_ids);
  }

  async findSongById(song_id: string): Promise<Song | null> {
    return await this.songRepository.findById(song_id);
  }
  async findSongByArtistId(artist_id: string): Promise<Song[] | null> {
    return await this.songRepository.findByArtistId(artist_id);
  }

  async getAllSongs(): Promise<Song[]> {
    return await this.songRepository.findMany();
  }

  async findSongsByArtistId(artist_id: string): Promise<Song[] | null> {
    return await this.songRepository.findByArtistId(artist_id);
  }

  //Artist Part
  async createArtist(data: Partial<Artist>): Promise<Artist> {
    return await this.artistRepository.create(data);
  }

  async updateArtist(
    artist_id: string,
    data: Partial<Artist>
  ): Promise<Artist> {
    return await this.artistRepository.update(artist_id, data);
  }

  async deleteArtist(artist_id: string): Promise<Artist> {
    return await this.artistRepository.delete(artist_id);
  }

  async deleteManyArtists(artist_ids: string[]): Promise<void> {
    return await this.artistRepository.deleteMany(artist_ids);
  }

  async findArtistById(artist_id: string): Promise<Artist | null> {
    return await this.artistRepository.findById(artist_id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistRepository.findMany();
  }
}
