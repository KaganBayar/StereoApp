import { UserRepository } from "../layers/repositories/userRepository";
import { AuthService } from "../layers/services/authService";
import { TokenServices } from "../layers/services/tokenService";
import { CookieService } from "../layers/services/cookieService";
import { RefreshTokenRepository } from "../layers/repositories/refreshTokenRepository";
import { UserService } from "../layers/services/userService";
import { AlbumRepository } from "../layers/repositories/albumRepository";
import { SongRepository } from "../layers/repositories/songRepository";
import { MusicService } from "../layers/services/musicService";
import { PlaylistRepository } from "../layers/repositories/playlistRepository";
import { ArtistRepository } from "../layers/repositories/artistRepository";
import { PlaylistService } from "../layers/services/playlistService";

export class Container {
  private services = new Map();
  get userRepository(): UserRepository {
    if (!this.services.has("userRepository")) {
      this.services.set("userRepository", new UserRepository());
    }
    return this.services.get("userRepository");
  }

  get artistRepository(): ArtistRepository {
    if (!this.services.has("artistRepository")) {
      this.services.set("artistRepository", new ArtistRepository());
    }
    return this.services.get("artistRepository");
  }

  get playlistRepository(): PlaylistRepository {
    if (!this.services.has("playlistRepository")) {
      this.services.set("playlistRepository", new PlaylistRepository());
    }
    return this.services.get("playlistRepository");
  }

  get albumRepository(): AlbumRepository {
    if (!this.services.has("albumRepository")) {
      this.services.set("albumRepository", new AlbumRepository());
    }
    return this.services.get("albumRepository");
  }

  get songRepository(): SongRepository {
    if (!this.services.has("songRepository")) {
      this.services.set("songRepository", new SongRepository());
    }
    return this.services.get("songRepository");
  }

  get refreshTokenRepository(): RefreshTokenRepository {
    if (!this.services.has("refreshTokenRepository")) {
      this.services.set("refreshTokenRepository", new RefreshTokenRepository());
    }
    return this.services.get("refreshTokenRepository");
  }

  get cookieService(): CookieService {
    if (!this.services.has("cookieService")) {
      this.services.set("cookieService", new CookieService());
    }
    return this.services.get("cookieService");
  }

  get userService(): UserService {
    if (!this.services.has("userService")) {
      this.services.set(
        "userService",
        new UserService(this.userRepository, this.authService)
      );
    }
    return this.services.get("userService");
  }

  get tokenService(): TokenServices {
    if (!this.services.has("tokenService")) {
      this.services.set(
        "tokenService",
        new TokenServices(
          this.userRepository,
          this.cookieService,
          this.refreshTokenRepository
        )
      );
    }
    return this.services.get("tokenService");
  }

  get authService(): AuthService {
    if (!this.services.has("authService")) {
      this.services.set(
        "authService",
        new AuthService(
          this.userRepository,
          this.cookieService,
          this.refreshTokenRepository,
          this.tokenService
        )
      );
    }
    return this.services.get("authService");
  }

  get musicService(): MusicService {
    if (!this.services.has("musicService")) {
      this.services.set(
        "musicService",
        new MusicService(
          this.userRepository,
          this.authService,
          this.albumRepository,
          this.songRepository,
          this.artistRepository
        )
      );
    }
    return this.services.get("musicService");
  }

  get playlistService(): PlaylistService {
    if (!this.services.has("playlistService")) {
      this.services.set(
        "playlistService",
        new PlaylistService(this.playlistRepository, this.authService)
      );
    }
    return this.services.get("playlistService");
  }
}

export const container = new Container();
