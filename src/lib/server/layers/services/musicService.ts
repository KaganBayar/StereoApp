import { UserRepository } from "../repositories/userRepository";
import { AlbumRepository } from "../repositories/albumRepository";
import { SongRepository } from "../repositories/songRepository";
import { AuthService } from "./authService";
import { Album, AlbumFormData } from "@/lib/Types/albumTypes";
import { Song, SongFormData } from "@/lib/Types/songTypes";
import { Artist, ArtistFormData } from "@/lib/Types/artistTypes";
import { ArtistRepository } from "../repositories/artistRepository";

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
  createAlbum(data: Partial<Album>): Promise<Album> {
    this.authService.validateUserSession();
    return this.albumRepository.create(data);
  }
  updateAlbum(id: string, data: Partial<Album>): Promise<Album> {
    this.authService.validateUserSession();
    return this.albumRepository.update(id, data);
  }
  deleteAlbum(id: string): Promise<Album> {
    this.authService.validateUserSession();
    return this.albumRepository.delete(id);
  }
  deleteManyAlbums(id: string): Promise<void> {
    this.authService.validateUserSession();
    return this.albumRepository.deleteMany(id);
  }
  getAlbumById(id: string): Promise<Album | null> {
    this.authService.validateUserSession();
    return this.albumRepository.findById(id);
  }
  findById(id: string): Promise<Album | null> {
    this.authService.validateUserSession();
    return this.albumRepository.findById(id);
  }
  getAllAlbums(): Promise<Album[]> {
    this.authService.validateUserSession();
    return this.albumRepository.findMany();
  }
  // song related methods
  createSong(data: Partial<Song>): Promise<Song> {
    this.authService.validateUserSession();
    return this.songRepository.create(data);
  }

  updateSong(id: string, data: Partial<Song>): Promise<Song> {
    this.authService.validateUserSession();
    return this.songRepository.update(id, data);
  }

  deleteSong(id: string): Promise<Song> {
    this.authService.validateUserSession();
    return this.songRepository.delete(id);
  }

  deleteManySongs(id: string): Promise<void> {
    this.authService.validateUserSession();
    return this.songRepository.deleteMany(id);
  }

  getSongById(id: string): Promise<Song | null> {
    this.authService.validateUserSession();
    return this.songRepository.findById(id);
  }

  findSongById(id: string): Promise<Song | null> {
    this.authService.validateUserSession();
    return this.songRepository.findById(id);
  }
  findSongByArtistId(artist_id: string): Promise<Song[] | null> {
    this.authService.validateUserSession();
    return this.songRepository.findByArtistId(artist_id);
  }

  getAllSongs(): Promise<Song[]> {
    this.authService.validateUserSession();
    return this.songRepository.findMany();
  }

  getSongsByArtistId(artistId: string): Promise<Song[] | null> {
    this.authService.validateUserSession();
    return this.songRepository.findByArtistId(artistId);
  }

  //Artist Part
  createArtist(data: Partial<Artist>): Promise<Artist> {
    this.authService.validateUserSession();
    return this.artistRepository.create(data);
  }

  updateArtist(id: string, data: Partial<Artist>): Promise<Artist> {
    this.authService.validateUserSession();
    return this.artistRepository.update(id, data);
  }

  deleteArtist(id: string): Promise<Artist> {
    this.authService.validateUserSession();
    return this.artistRepository.delete(id);
  }

  deleteManyArtists(id: string): Promise<void> {
    this.authService.validateUserSession();
    return this.artistRepository.deleteMany(id);
  }

  getArtistById(id: string): Promise<Artist | null> {
    this.authService.validateUserSession();
    return this.artistRepository.findById(id);
  }

  findArtistById(id: string): Promise<Artist | null> {
    this.authService.validateUserSession();
    return this.artistRepository.findById(id);
  }

  getAllArtists(): Promise<Artist[]> {
    this.authService.validateUserSession();
    return this.artistRepository.findMany();
  }
}
