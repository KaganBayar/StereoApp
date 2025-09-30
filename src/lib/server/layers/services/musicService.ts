import { UserRepository } from "../repositories/userRepository";
import { AlbumRepository } from "../repositories/albumRepository";
import { SongRepository } from "../repositories/songRepository";
import { AuthService } from "./authService";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { ArtistRepository } from "../repositories/artistRepository";
import { UserPayload } from "@/lib/Types/userTypes";

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
  async createAlbum(
    requestingUserToken: UserPayload,
    data: Partial<Album>
  ): Promise<Album> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.albumRepository.create(data);
  }
  async updateAlbum(
    requestingUserToken: UserPayload,
    album_id: string,
    data: Partial<Album>
  ): Promise<Album> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.albumRepository.update(album_id, data);
  }
  async deleteAlbum(
    requestingUserToken: UserPayload,
    album_id: string
  ): Promise<Album> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.albumRepository.delete(album_id);
  }
  async deleteManyAlbums(
    requestingUserToken: UserPayload,
    album_ids: string[]
  ): Promise<void> {
    await this.authService.requireAdminUser(requestingUserToken);
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
  async createSong(
    requestingUserToken: UserPayload,
    data: Partial<Song>
  ): Promise<Song> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.songRepository.create(data);
  }

  async updateSong(
    requestingUserToken: UserPayload,
    song_id: string,
    data: Partial<Song>
  ): Promise<Song> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.songRepository.update(song_id, data);
  }

  async deleteSong(
    requestingUserToken: UserPayload,
    song_id: string
  ): Promise<Song> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.songRepository.delete(song_id);
  }

  async deleteManySongs(
    requestingUserToken: UserPayload,
    song_ids: string[]
  ): Promise<void> {
    await this.authService.requireAdminUser(requestingUserToken);
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
  async createArtist(
    requestingUserToken: UserPayload,
    data: Partial<Artist>
  ): Promise<Artist> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.artistRepository.create(data);
  }

  async updateArtist(
    requestingUserToken: UserPayload,
    artist_id: string,
    data: Partial<Artist>
  ): Promise<Artist> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.artistRepository.update(artist_id, data);
  }

  async deleteArtist(
    requestingUserToken: UserPayload,
    artist_id: string
  ): Promise<Artist> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.artistRepository.delete(artist_id);
  }

  async deleteManyArtists(
    requestingUserToken: UserPayload,
    artist_ids: string[]
  ): Promise<void> {
    await this.authService.requireAdminUser(requestingUserToken);
    return await this.artistRepository.deleteMany(artist_ids);
  }

  async findArtistById(artist_id: string): Promise<Artist | null> {
    return await this.artistRepository.findById(artist_id);
  }

  async getAllArtists(): Promise<Artist[]> {
    return await this.artistRepository.findMany();
  }
}
