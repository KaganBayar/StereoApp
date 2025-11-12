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

const createTestPlaylist = (userId: string, override = {}) => ({
  name: `Test Playlist ${Date.now()}`,
  description: "Test description",
  user_id: userId,
  photo_url: "",
  ...override,
});

const createPlaylistSong = (
  playlistId: string,
  songId: string,
  override = {}
) => ({
  playlist_id: playlistId,
  song_id: songId,
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
  let testPlaylistId: string;
  let testPlaylistSongId: string;
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
    const playlist = await prisma.playlist.create({
      data: createTestPlaylist(testUserId),
    });
    testPlaylistId = playlist.id;
    const playlistSong = await prisma.playlistSong.create({
      data: createPlaylistSong(playlist.id, song.id),
    });
    testPlaylistSongId = playlistSong.id;
    console.log("✅ Test data created");
  });

  afterAll(async () => {
    await prisma.playlistSong.deleteMany({ where: { id: testPlaylistSongId } });
    await prisma.playlist.deleteMany({ where: { id: testPlaylistId } });
    await prisma.song.deleteMany({ where: { id: testSongId } });
    await prisma.album.deleteMany({ where: { id: testAlbumId } });
    await prisma.artist.deleteMany({ where: { id: testArtistId } });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    console.log("✅ Test data cleaned up");
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
        console.log("✅ Found user by ID:", user);
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
        console.log("✅ Found multiple users:", users.length);
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
          console.log("✅ Created User Verified:", createdUser);
        } finally {
          await prisma.user.delete({ where: { id: createdUser.id } });
          console.log("✅ Created User Cleaned Up:", createdUser);
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
        console.log("✅ Updated User Verified:", result);
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
        console.log("✅ Deleted User Verified:", deletedUser);
      });
      it("should delete multiple entities by IDs", async () => {
        const user1 = createTestUser();
        const user2 = createTestUser({
          email: `another-${Date.now()}@example.com`,
        });
        const createdUser1: User = await container.userRepository.create(user1);
        const createdUser2: User = await container.userRepository.create(user2);
        const idsToDelete = [createdUser1.id, createdUser2.id];
        await container.userRepository.deleteMany(idsToDelete);
        const user1InDatabase = await prisma.user.findUnique({
          where: { id: createdUser1.id },
        });
        const user2InDatabase = await prisma.user.findUnique({
          where: { id: createdUser2.id },
        });
        expect(user1InDatabase).toBeNull();
        expect(user2InDatabase).toBeNull();
        console.log("✅ Deleted Multiple Users Verified:", {
          createdUser1,
          createdUser2,
        });
      });
    });
  });

  describe("Repository Specific Methods", () => {
    describe("UserRepository CRUD Operations", () => {
      it("should find user by email", async () => {
        const testUser = await prisma.user.findUnique({
          where: { id: testUserId },
        });
        const foundUser = await container.userRepository.findUserByEmail(
          testUser!.email
        );
        expect(foundUser).toBeDefined();
        expect(foundUser?.id).toBe(testUserId);
        console.log("✅ Found user by email:", foundUser);
      });
      it("should check if user is admin", async () => {
        const adminUser = createTestUser({ roles: ["admin"] });
        const nonAdminUser = createTestUser({ email: `nonUnique@example.com` });
        const createdAdmin: User = await container.userRepository.create(
          adminUser
        );
        const createdNonAdmin: User = await container.userRepository.create(
          nonAdminUser
        );
        try {
          const isAdmin = await container.userRepository.checkIfUserIsAdmin(
            createdAdmin.id
          );
          const isNonAdmin = await container.userRepository.checkIfUserIsAdmin(
            createdNonAdmin.id
          );
          expect(isAdmin).toBe(true);
          expect(isNonAdmin).toBe(false);
          console.log("✅ Admin Check Verified", { isAdmin, isNonAdmin });
        } finally {
          await prisma.user.delete({ where: { id: createdAdmin.id } });
          await prisma.user.delete({ where: { id: createdNonAdmin.id } });
          console.log("✅ Admin and Non-Admin Users Cleaned Up", {
            createdAdmin,
            createdNonAdmin,
          });
        }
      });
    });
    /* describe("AlbumRepository", () => {
  
    }) */
    /* describe("ArtistRepository", () => {
   
  }) */
    describe("SongRepository CRUD Operations", () => {
      it("should find songs by artist ID", async () => {
        const artist = await prisma.artist.findUnique({
          where: { id: testArtistId },
        });
        const songsByArtist = await container.songRepository.findByArtistId(
          artist!.id
        );
        const songsInDatabase = await prisma.song.findMany({
          where: { artist_id: artist!.id },
          include: { album: true, artist: true },
        });
        expect(songsByArtist).toBeDefined();
        expect(songsByArtist).toEqual(songsInDatabase);
        expect(songsByArtist?.length).toBe(songsInDatabase.length);
        console.log("✅ Found songs by artist ID:", {
          artist,
          count: songsByArtist!.length,
        });
      });
    });
    describe("PlaylistRepository CRUD Operations", () => {
      it("should find playlists by user ID", async () => {
        const playlists = await prisma.playlist.findMany({
          where: { user_id: testUserId },
          include: { playlistSongs: { include: { song: true } } },
        });
        const foundPlaylists =
          await container.playlistRepository.findUserPlaylists(testUserId);
        expect(foundPlaylists).toBeDefined();
        expect(foundPlaylists).toEqual(playlists);
        console.log("✅ Found playlists by user ID:", {
          userId: testUserId,
          count: foundPlaylists.length,
        });
      });
      it("should add a song to a playlist", async () => {
        const testPlaylist = await prisma.playlist.findUnique({
          where: { id: testPlaylistId },
        });
        const newSong = createTestSong(testArtistId, testAlbumId);
        const createdSong = await prisma.song.create({ data: newSong });
        try {
          await container.playlistRepository.addSongToPlaylist(
            testPlaylist!.id,
            createdSong.id
          );

          const propertiesToCheck = [
            "artist_id",
            "name",
            "song_url",
            "length",
            "releaseDate",
            "genre",
            "photo_url",
          ];
          const playlistWithSongs = await prisma.playlist.findUnique({
            where: { id: testPlaylist!.id },
            include: { playlistSongs: { include: { song: true } } },
          });
          expect(playlistWithSongs).toBeDefined();
          propertiesToCheck.forEach((prop) => {
            expect(
              (playlistWithSongs!.playlistSongs[1].song as any)[prop]
            ).toEqual((createdSong as any)[prop]);
          });
          console.log("✅ Added song to playlist Verified:", {
            playlistId: testPlaylist!.id,
            songId: createdSong.id,
          });
        } finally {
          // need to cleanup playlistSong somewhere
          await prisma.playlistSong.deleteMany({
            where: { song_id: createdSong!.id },
          });
          await prisma.song.deleteMany({ where: { id: createdSong!.id } });
          console.log("✅ Added song cleaned up:", createdSong);
        }
      });
      it("should remove a song from a playlist", async () => {
        const testPlaylist = await prisma.playlist.findUnique({
          where: { id: testPlaylistId },
        });
        const testSong = await prisma.song.findUnique({
          where: { id: testSongId },
        });
        await container.playlistRepository.removeSongFromPlaylist(
          testPlaylist!.id,
          testSong!.id
        );
        const playlistAfterRemoval = await prisma.playlist.findUnique({
          where: { id: testPlaylistId },
          include: { playlistSongs: { include: { song: true } } },
        });
        expect(playlistAfterRemoval).toBeDefined();
        expect(playlistAfterRemoval!.playlistSongs).toHaveLength(0);
        console.log("✅ Removed song from playlist Verified:", {
          playlistId: testPlaylist!.id,
          songId: testSong!.id,
        });
      });
    });
  });
});

// ============================================================================
// 3. SERVICE LAYER TESTS
// ============================================================================

describe("Service Layer", () => {
  describe("Service Methods exisitince", () => {
    it("should have all methods defined", () => {
      const auth = container.authService;

      expect(typeof auth.register).toBe("function");
      expect(typeof auth.login).toBe("function");
      expect(typeof auth.logout).toBe("function");

      console.log("✅ AuthService has all required methods");
    });
    it("should have all required methods in TokenService", () => {
      const token = container.tokenService;

      expect(typeof token.signToken).toBe("function");
      expect(typeof token.createJWTAccessToken).toBe("function");
      expect(typeof token.createJWTRefreshToken).toBe("function");
      expect(typeof token.verifyAuthToken).toBe("function");
      expect(typeof token.verifyRefreshToken).toBe("function");
      expect(typeof token.refreshAccessToken).toBe("function");
      expect(typeof token.decodeUserToken).toBe("function");
      expect(typeof token.deleteAllUsersRefreshTokens).toBe("function");

      console.log("✅ TokenService has all required methods");
    });
    it("should have all required methods in MusicService", () => {
      const music = container.musicService;

      // Artist methods
      expect(typeof music.createArtist).toBe("function");
      expect(typeof music.updateArtist).toBe("function");
      expect(typeof music.deleteArtist).toBe("function");
      expect(typeof music.findArtistById).toBe("function");
      expect(typeof music.getAllArtists).toBe("function");

      // Album methods
      expect(typeof music.createAlbum).toBe("function");
      expect(typeof music.updateAlbum).toBe("function");
      expect(typeof music.deleteAlbum).toBe("function");
      expect(typeof music.findAlbumById).toBe("function");
      expect(typeof music.getAllAlbums).toBe("function");

      // Song methods
      expect(typeof music.createSong).toBe("function");
      expect(typeof music.updateSong).toBe("function");
      expect(typeof music.deleteSong).toBe("function");
      expect(typeof music.findSongById).toBe("function");
      expect(typeof music.getAllSongs).toBe("function");
      expect(typeof music.findSongsByArtistId).toBe("function");

      console.log("✅ MusicService has all required methods");
    });
    it("should have all required methods in PlaylistService", () => {
      const playlist = container.playlistService;

      expect(typeof playlist.createPlaylist).toBe("function");
      expect(typeof playlist.updatePlaylist).toBe("function");
      expect(typeof playlist.deletePlaylist).toBe("function");
      expect(typeof playlist.getPlaylistById).toBe("function");
      expect(typeof playlist.getUserPlaylists).toBe("function");
      expect(typeof playlist.addSongToPlaylist).toBe("function");
      expect(typeof playlist.removeSongFromPlaylist).toBe("function");

      console.log("✅ PlaylistService has all required methods");
    });
    it("should have all required methods in UserService", () => {
      const user = container.userService;

      expect(typeof user.createUser).toBe("function");
      expect(typeof user.updateUser).toBe("function");
      expect(typeof user.deleteUser).toBe("function");
      expect(typeof user.getUserById).toBe("function");
      expect(typeof user.getAllUsers).toBe("function");
      expect(typeof user.findUserByEmail).toBe("funqction");
      expect(typeof user.isUserAdmin).toBe("function");

      console.log("✅ UserService has all required methods");
    });
  });

  it("should properly chain repository calls in service", async () => {
    const music = container.musicService;

    // Create artist
    const artist = await music.createArtist(createTestArtist());
    expect(artist.id).toBeDefined();

    // Find by ID
    const found = await music.findArtistById(artist.id);
    expect(found?.id).toBe(artist.id);

    // Update
    const updated = await music.updateArtist(artist.id, { bio: "Updated" });
    expect(updated.bio).toBe("Updated");

    // Delete
    await music.deleteArtist(artist.id);
    const deleted = await music.findArtistById(artist.id);
    expect(deleted).toBeNull();

    console.log("✅ MusicService chains repository calls correctly");
  });
});

// ============================================================================
// 4. ACTİON LAYER TESTS
// ============================================================================

describe("Action Layer", () => {
  describe("Action Methods Existence", () => {
    it("should have authActions with proper methods", async () => {
      const { authActions } = await import(
        "@/lib/server/layers/actions/authActions"
      );

      expect(typeof authActions.register).toBe("function");
      expect(typeof authActions.login).toBe("function");
      expect(typeof authActions.logout).toBe("function");

      console.log("✅ AuthActions has required methods");
    });

    it("should have musicActions with proper methods", async () => {
      const { musicActions } = await import(
        "@/lib/server/layers/actions/musicActions"
      );

      expect(typeof musicActions.createArtist).toBe("function");
      expect(typeof musicActions.createAlbum).toBe("function");
      expect(typeof musicActions.createSong).toBe("function");
      expect(typeof musicActions.getAllArtists).toBe("function");
      expect(typeof musicActions.getAllAlbums).toBe("function");
      expect(typeof musicActions.getAllSongs).toBe("function");

      console.log("✅ MusicActions has required methods");
    });

    it("should have playlistActions with proper methods", async () => {
      const { playlistActions } = await import(
        "@/lib/server/layers/actions/playlistActions"
      );

      expect(typeof playlistActions.createPlaylist).toBe("function");
      expect(typeof playlistActions.updatePlaylist).toBe("function");
      expect(typeof playlistActions.deletePlaylist).toBe("function");
      expect(typeof playlistActions.getPlaylistById).toBe("function");
      expect(typeof playlistActions.addSongToPlaylist).toBe("function");
      expect(typeof playlistActions.removeSongFromPlaylist).toBe("function");

      console.log("✅ PlaylistActions has required methods");
    });
  });

  describe("Action-Service Integration", () => {
    it("should use musicService in musicActions", async () => {
      const { musicActions } = await import(
        "@/lib/server/layers/actions/musicActions"
      );

      // MusicActions should delegate to musicService
      expect((musicActions as any).musicService).toBeDefined();

      console.log("✅ MusicActions uses MusicService");
    });

    it("should use authService in authActions", async () => {
      const { authActions } = await import(
        "@/lib/server/layers/actions/authActions"
      );

      expect((authActions as any).authService).toBeDefined();

      console.log("✅ AuthActions uses AuthService");
    });

    it("should use playlistService in playlistActions", async () => {
      const { playlistActions } = await import(
        "@/lib/server/layers/actions/playlistActions"
      );

      expect((playlistActions as any).playlistService).toBeDefined();

      console.log("✅ PlaylistActions uses PlaylistService");
    });
  });
});
