import { describe, it, expect, beforeEach, vi } from "vitest";
import { container } from "@/lib/server/DI_container/container";
import { PlaylistRepository } from "@/lib/server/layers/repositories/playlistRepository";
import { CookieService } from "@/lib/server/layers/services/cookieService";
import { UserService } from "@/lib/server/layers/services/userService";

// ============================================================================
// 1. CONTAINER & DEPENDENCY INJECTION TESTS
// ============================================================================

describe("Container & Dependency Injection", () => {
  describe("Singleton Pattern Verification'", () => {
    it("should create singleton instances for all repositories", () => {
      const repos = {
        user: [container.userRepository, container.userRepository],
        artist: [container.artistRepository, container.artistRepository],
        album: [container.albumRepository, container.albumRepository],
        song: [container.songRepository, container.songRepository],
        playlist: [container.playlistRepository, container.playlistRepository],
        refreshToken: [
          container.refreshTokenRepository,
          container.refreshTokenRepository,
        ],
      };

      Object.entries(repos).forEach(([name, [first, second]]) => {
        expect(first).toBe(second);
        expect(first).toBeDefined();
        console.log(`✅ ${name}Repository is singleton`);
      });
    });

    it("should create singleton instances for all services", () => {
      const services = {
        cookie: [container.cookieService, container.cookieService],
        token: [container.tokenService, container.tokenService],
        auth: [container.authService, container.authService],
        user: [container.userService, container.userService],
        music: [container.musicService, container.musicService],
        playlist: [container.playlistService, container.playlistService],
      };

      Object.entries(services).forEach(([name, [first, second]]) => {
        expect(first).toBe(second);
        expect(first).toBeDefined();
        console.log(`✅ ${name}Service is singleton`);
      });
    });
  });
  describe("Dependency Injection Verification", () => {
    it("should inject correct dependencies into userService", () => {
      const userService = container.userService;
      const userRepo = Reflect.get(userService, "userRepository");
      const authService = Reflect.get(userService, "authService");

      expect(userRepo).toBeDefined();
      expect(userRepo).toBe(container.userRepository);
      expect(authService).toBeDefined();
      expect(authService).toBe(container.authService);

      console.log("✅ UserService dependencies injected correctly");
    });

    it("should inject correct dependencies into authService", () => {
      const authService = container.authService;

      expect(Reflect.get(authService, "userRepository")).toBe(
        container.userRepository
      );
      expect(Reflect.get(authService, "cookieService")).toBe(
        container.cookieService
      );
      expect(Reflect.get(authService, "refreshRepository")).toBe(
        container.refreshTokenRepository
      );
      expect(Reflect.get(authService, "tokenRepository")).toBe(
        container.tokenService
      );

      console.log("✅ AuthService dependencies injected correctly");
    });

    it("should inject correct dependencies into tokenService", () => {
      const tokenService = container.tokenService;

      expect(Reflect.get(tokenService, "userRepository")).toBe(
        container.userRepository
      );
      expect(Reflect.get(tokenService, "cookieService")).toBe(
        container.cookieService
      );
      expect(Reflect.get(tokenService, "refreshRepository")).toBe(
        container.refreshTokenRepository
      );

      expect(Reflect.get(tokenService, "authService")).toBeUndefined();

      console.log("✅ TokenService dependencies injected correctly");
    });

    it("should inject correct dependencies into musicService", () => {
      const musicService = container.musicService;

      expect(Reflect.get(musicService, "userRepository")).toBe(
        container.userRepository
      );
      expect(Reflect.get(musicService, "authService")).toBe(
        container.authService
      );
      expect(Reflect.get(musicService, "albumRepository")).toBe(
        container.albumRepository
      );
      expect(Reflect.get(musicService, "songRepository")).toBe(
        container.songRepository
      );
      expect(Reflect.get(musicService, "artistRepository")).toBe(
        container.artistRepository
      );

      console.log("✅ MusicService dependencies injected correctly");
    });

    it("should inject correct dependencies into playlistService", () => {
      const playlistService = container.playlistService;

      expect(Reflect.get(playlistService, "playlistRepository")).toBe(
        container.playlistRepository
      );
      expect(Reflect.get(playlistService, "authService")).toBe(
        container.authService
      );

      console.log("✅ PlaylistService dependencies injected correctly");
    });
  });

  // ============================================================================
  // 2. REPOSITORY LAYER TESTS
  // ============================================================================
});
