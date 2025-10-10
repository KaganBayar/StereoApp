import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  beforeAll,
  afterAll,
} from "vitest";
import { container } from "@/lib/server/DI_container/container";
import { PlaylistRepository } from "@/lib/server/layers/repositories/playlistRepository";
import { CookieService } from "@/lib/server/layers/services/cookieService";
import { UserService } from "@/lib/server/layers/services/userService";
import prisma from "@/lib/server/db";
import { User } from "@/lib/Types/userTypes";

// ============================================================================
// 1. CONTAINER & DEPENDENCY INJECTION TESTS
// ============================================================================

const createTestUser = (override = {}) => ({
  email: `test-${Date.now()}@example.com`,
  name: "Test User",
  password: "hashedPassword123",
  roles: ["member"],
  photo_url: "",
  ...override,
});

const createTestArtist = (override = {}) => ({
  name: `Test Artist ${Date.now()}`,
  genre: "Rock",
  bio: "Test bio",
  photo_url: "",
  ...override,
});

const createTestAlbum = (artistId: string, override = {}) => ({
  title: `Test Album ${Date.now()}`,
  artist_id: artistId,
  releaseDate: new Date(),
  photo_url: "",
  ...override,
});

const createTestSong = (artistId: string, albumId: string, override = {}) => ({
  name: `Test Song ${Date.now()}`,
  artist_id: artistId,
  album_id: albumId,
  song_url: "",
  length: 180,
  genre: "Rock",
  releaseDate: new Date(),
  photo_url: "",
  ...override,
});

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
});

// ============================================================================
// 2. REPOSITORY LAYER TESTS
// ============================================================================

describe("Repository Layer", () => {
  let testUserId: string;
  let testArtistId: string;
  let testAlbumId: string;
  let testSongId: string;
  //create test instanceses
  beforeAll(async () => {
    const user = await prisma.user.create({
      data: createTestUser(),
    });
    testUserId = user.id;

    const artist = await prisma.artist.create({
      data: createTestArtist(),
    });
    testArtistId = artist.id;

    const album = await prisma.album.create({
      data: createTestAlbum(testArtistId),
    });
    testAlbumId = album.id;

    const song = await prisma.song.create({
      data: createTestSong(testArtistId, testAlbumId),
    });
    testSongId = song.id;
  });
  afterAll(async () => {
    await prisma.song.deleteMany({ where: { id: testSongId } });
    await prisma.album.deleteMany({ where: { id: testAlbumId } });
    await prisma.artist.deleteMany({ where: { id: testArtistId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
  });
  describe("BaseRepository tests", () => {
    const repositories = {
      userRepository: container.userRepository,
      artistRepository: container.artistRepository,
      albumRepository: container.albumRepository,
      songRepository: container.songRepository,
      playlistRepository: container.playlistRepository,
    };
    it("should implement all CRUD Operations", async () => {
      const requiredMethods = [
        "findById",
        "findMany",
        "create",
        "update",
        "delete",
        "deleteMany",
      ];
      Object.values(repositories).forEach((repo, index) => {
        requiredMethods.forEach((method) => {
          expect((repo as any)[method]).toBeDefined();
          expect(typeof (repo as any)[method]).toBe("function");
        });
        console.log(`✅ Repository ${index + 1} has all CRUD methods`);
      });
    });
    describe("CRUD Operations", () => {
      const userProperties = [
        "email",
        "name",
        "roles",
        "photo_url",
        "password",
      ];
      const databaseProperties = ["id", "createdAt", "updatedAt"];
      it("should find an entity by ID", async () => {
        const user = await container.userRepository.findById(testUserId);
        expect(user).toBeDefined();
        expect(user?.id).toBe(testUserId);
      });
      it("should find multiple entities", async () => {
        const users = await container.userRepository.findMany();

        const getAllUsers = await prisma.user.findMany({
          include: {
            playlists: {
              include: { playlistSongs: { include: { song: true } } },
            },
            favorites: { include: { song: true } },
          },
        });
        // check if values are same
        expect(users).toEqual(getAllUsers);
        expect(users).toHaveLength(getAllUsers.length);
      });
      it("should create a new entity", async () => {
        const newUser = createTestUser();
        const createdUser: User = await container.userRepository.create(
          newUser
        );

        const newUserInDatabase = await prisma.user.findUnique({
          where: { id: createdUser.id },
        });

        try {
          userProperties.forEach((prop) => {
            //check return
            expect((createdUser as any)[prop]).toEqual((newUser as any)[prop]);
            //check database
            expect((newUserInDatabase as any)[prop]).toEqual(
              (newUser as any)[prop]
            );
          });
        } finally {
          await prisma.user.delete({ where: { id: createdUser.id } });
        }
      });
      it("should update an existing entity", async () => {
        const user = await container.userRepository.findById(testUserId);
        expect(user).toBeDefined();

        const updatedUser = {
          email: `updatedEmail@hotmail.com`,
          name: "Updated User",
          password: "updatedHasedPassword123",
          roles: ["member", "updated"],
          photo_url: "updatedUrl",
        };
        const result = await container.userRepository.update(
          user!.id,
          updatedUser
        );
        expect(result).toBeDefined();

        const updatedUserInDatabase = await prisma.user.findUnique({
          where: { id: user!.id },
        });

        userProperties.forEach((prop) => {
          //check return
          expect((result as any)[prop]).toEqual((updatedUser as any)[prop]);
          //check database
          expect((updatedUserInDatabase as any)[prop]).toEqual(
            (updatedUser as any)[prop]
          );
        });
      });
      it("should delete an entity by ID", async () => {
        const newUser = createTestUser();
        const createdUser: User = await container.userRepository.create(
          newUser
        );
        const deletedUser = await container.userRepository.delete(
          createdUser.id
        );
        expect(deletedUser).toBeDefined();
        expect(deletedUser).toEqual(createdUser);
        const userInDatabase = await prisma.user.findUnique({
          where: { id: createdUser.id },
        });
        expect(userInDatabase).toBeNull();
      });
      it("should delete multiple entities by IDs", async () => {});
    });
  });

  describe("Repository Specific Methods", () => {
    describe("UserRepository", () => {
      it("should find user by email", async () => {});
      it("should check if user is admin", async () => {});
    });
    /* describe("AlbumRepository", () => {
  
    }) */
    /* describe("ArtistRepository", () => {
   
  }) */
    describe("SongRepository", () => {
      it("should find songs by artist ID", async () => {});
    });
    describe("PlaylistRepository", () => {
      it("should find playlists by user ID", async () => {});
      it("should find all playlists", async () => {});
      it("should create a new playlist", async () => {});
      it("should update an existing playlist", async () => {});
      it("should delete a playlist by ID", async () => {});
      it("should delete multiple playlists by IDs", async () => {});
    });
  });
});

// ============================================================================
// 3. SERVICE LAYER TESTS
// ============================================================================

/*describe("Service Layer", () => {

});
*/
