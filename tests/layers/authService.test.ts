/*import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthService } from "../../src/lib/server/layers/services/authService";
import { UserRepository } from "../../src/lib/server/layers/repositories/userRepository";
import { CookieService } from "../../src/lib/server/layers/services/cookieService";
import { RefreshTokenRepository } from "../../src/lib/server/layers/repositories/refreshTokenRepository";
import { TokenServices } from "../../src/lib/server/layers/services/tokenService";
import { hashPassword, comparePassword } from "../../src/lib/server/auth";

describe("AuthService - logout", () => {
  let authService: AuthService;
  let mockUserRepository: UserRepository;
  let mockCookieService: CookieService;
  let mockRefreshRepository: RefreshTokenRepository;
  let mockTokenRepository: TokenServices;

  beforeEach(() => {
    mockUserRepository = {
      findUserByEmail: vi.fn(),
      create: vi.fn(),
    } as any;

    mockCookieService = {
      setAccessCookie: vi.fn(),
      setRefreshCookie: vi.fn(),
      deleteCookie: vi.fn(),
    } as any;

    mockRefreshRepository = {
      deleteAllByUserId: vi.fn(),
    } as any;

    mockTokenRepository = {
      createJWTAccessToken: vi.fn(),
      createJWTRefreshToken: vi.fn(),
    } as any;

    authService = new AuthService(
      mockUserRepository,
      mockCookieService,
      mockRefreshRepository,
      mockTokenRepository
    );

    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  it("should delete all refresh tokens for the user", async () => {
    const userId = "user-123";

    await authService.logout(userId);

    expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledWith(
      userId
    );
    expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledTimes(1);
  });

  it("should delete the access token cookie", async () => {
    const userId = "user-123";

    await authService.logout(userId);

    expect(mockCookieService.deleteCookie).toHaveBeenCalledWith("accessToken");
    expect(mockCookieService.deleteCookie).toHaveBeenCalledTimes(1);
  });

  it('should log "logged out" message', async () => {
    const userId = "user-123";
    const consoleSpy = vi.spyOn(console, "log");

    await authService.logout(userId);

    expect(consoleSpy).toHaveBeenCalledWith("logged out");
  });

  it("should complete logout process successfully", async () => {
    const userId = "user-123";

    await expect(authService.logout(userId)).resolves.toBeUndefined();
    expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledWith(
      userId
    );
    expect(mockCookieService.deleteCookie).toHaveBeenCalledWith("accessToken");
  });

  vi.mock("../../auth", () => ({
    hashPassword: vi.fn(),
    comparePassword: vi.fn(),
  }));

  describe("AuthService", () => {
    let authService: AuthService;
    let mockUserRepository: UserRepository;
    let mockCookieService: CookieService;
    let mockRefreshRepository: RefreshTokenRepository;
    let mockTokenRepository: TokenServices;

    beforeEach(() => {
      mockUserRepository = {
        findUserByEmail: vi.fn(),
        create: vi.fn(),
      } as any;

      mockCookieService = {
        setAccessCookie: vi.fn(),
        setRefreshCookie: vi.fn(),
        deleteCookie: vi.fn(),
      } as any;

      mockRefreshRepository = {
        deleteAllByUserId: vi.fn(),
      } as any;

      mockTokenRepository = {
        createJWTAccessToken: vi.fn(),
        createJWTRefreshToken: vi.fn(),
      } as any;

      authService = new AuthService(
        mockUserRepository,
        mockCookieService,
        mockRefreshRepository,
        mockTokenRepository
      );

      vi.spyOn(console, "log").mockImplementation(() => {});
    });

    describe("register", () => {
      it("should hash password and create user", async () => {
        const hashedPassword = "hashed_password";
        vi.mocked(hashPassword).mockResolvedValue(hashedPassword);

        await authService.register(
          "John Doe",
          "john@example.com",
          "password123"
        );

        expect(hashPassword).toHaveBeenCalledWith("password123");
        expect(mockUserRepository.create).toHaveBeenCalledWith({
          email: "john@example.com",
          password: hashedPassword,
          name: "John Doe",
        });
      });

      it('should log "registered" message', async () => {
        vi.mocked(hashPassword).mockResolvedValue("hashed_password");
        const consoleSpy = vi.spyOn(console, "log");

        await authService.register(
          "John Doe",
          "john@example.com",
          "password123"
        );

        expect(consoleSpy).toHaveBeenCalledWith("registered");
      });
    });

    describe("login", () => {
      const mockUser = {
        id: "user-123",
        email: "john@example.com",
        password: "hashed_password",
        name: "John Doe",
      };

      it("should login successfully with valid credentials", async () => {
        const accessToken = "access_token";
        const refreshToken = { token: "refresh_token" };

        vi.mocked(mockUserRepository.findUserByEmail).mockResolvedValue(
          mockUser
        );
        vi.mocked(comparePassword).mockResolvedValue(true);
        vi.mocked(mockTokenRepository.createJWTAccessToken).mockResolvedValue(
          accessToken
        );
        vi.mocked(mockTokenRepository.createJWTRefreshToken).mockResolvedValue(
          refreshToken
        );

        const result = await authService.login(
          "john@example.com",
          "password123"
        );

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
          "john@example.com"
        );
        expect(comparePassword).toHaveBeenCalledWith(
          "password123",
          "hashed_password"
        );
        expect(mockTokenRepository.createJWTAccessToken).toHaveBeenCalledWith(
          mockUser
        );
        expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledWith(
          "user-123"
        );
        expect(mockTokenRepository.createJWTRefreshToken).toHaveBeenCalledWith(
          "user-123"
        );
        expect(mockCookieService.setAccessCookie).toHaveBeenCalledWith(
          accessToken
        );
        expect(mockCookieService.setRefreshCookie).toHaveBeenCalledWith(
          "refresh_token"
        );
        expect(result).toEqual({ accessToken, refreshToken });
      });

      it("should throw error when user not found", async () => {
        vi.mocked(mockUserRepository.findUserByEmail).mockResolvedValue(null);

        await expect(
          authService.login("nonexistent@example.com", "password123")
        ).rejects.toThrow("User not found");

        expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
          "nonexistent@example.com"
        );
      });

      it("should throw error when password is invalid", async () => {
        vi.mocked(mockUserRepository.findUserByEmail).mockResolvedValue(
          mockUser
        );
        vi.mocked(comparePassword).mockResolvedValue(false);

        await expect(
          authService.login("john@example.com", "wrong_password")
        ).rejects.toThrow("Invalid password");

        expect(comparePassword).toHaveBeenCalledWith(
          "wrong_password",
          "hashed_password"
        );
      });
    });

    describe("logout", () => {
      it("should delete all refresh tokens for the user", async () => {
        const userId = "user-123";

        await authService.logout(userId);

        expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledWith(
          userId
        );
        expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledTimes(
          1
        );
      });

      it("should delete the access token cookie", async () => {
        const userId = "user-123";

        await authService.logout(userId);

        expect(mockCookieService.deleteCookie).toHaveBeenCalledWith(
          "accessToken"
        );
        expect(mockCookieService.deleteCookie).toHaveBeenCalledTimes(1);
      });

      it('should log "logged out" message', async () => {
        const userId = "user-123";
        const consoleSpy = vi.spyOn(console, "log");

        await authService.logout(userId);

        expect(consoleSpy).toHaveBeenCalledWith("logged out");
      });

      it("should complete logout process successfully", async () => {
        const userId = "user-123";

        await expect(authService.logout(userId)).resolves.toBeUndefined();
        expect(mockRefreshRepository.deleteAllByUserId).toHaveBeenCalledWith(
          userId
        );
        expect(mockCookieService.deleteCookie).toHaveBeenCalledWith(
          "accessToken"
        );
      });
    });
  });
});
*/
