import { UserRepository } from "../repositories/userRepository";
import { CookieService } from "./cookieService";
import { UserAdminEditForm, UserPayload } from "@/lib/Types/userTypes";
import * as jose from "jose";
import { User } from "@/lib/Types/userTypes";
import { formRegisterSchema } from "../../Schemas/register";
import { formLoginSchema } from "../../Schemas/login";
import { comparePassword, hashPassword } from "../../auth";
import prisma from "../../db";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { TokenServices } from "./tokenService";
import { requireAdminUser } from "../../serverValidation";

export class AuthService {
  private tokenRepository: TokenServices;
  private userRepository: UserRepository;
  private cookieService: CookieService;
  private refreshRepository: RefreshTokenRepository;

  // you can change constructor parameters if you want to allow inject alternative repositories
  constructor(
    userRepository: UserRepository,
    cookieService: CookieService,
    refreshRepository: RefreshTokenRepository,
    tokenRepository: TokenServices
  ) {
    this.userRepository = userRepository;
    this.cookieService = cookieService;
    this.refreshRepository = refreshRepository;
    this.tokenRepository = tokenRepository;
  }

  public async register(
    name: string,
    email: string,
    password: string
  ): Promise<void> {
    const hashedPassword = await hashPassword(password);

    await this.userRepository.create(
      {
        email: email,
        password: hashedPassword,
        name: name,
      } as UserAdminEditForm /*temp*/
    );

    console.log("registered");
  }

  public async login(email: string, password: string) {
    // Find user by email
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // If login is successful, generate and return tokens
    const accessToken = await this.tokenRepository.createJWTAccessToken(user);
    await this.refreshRepository.deleteAllByUserId(user.id); // Invalidate existing refresh tokens
    const refreshToken = await this.tokenRepository.createJWTRefreshToken(
      user.id
    );
    this.cookieService.setAccessCookie(accessToken);

    return { accessToken, refreshToken };
  }

  public async logout(userId: string): Promise<void> {
    await this.refreshRepository.deleteAllByUserId(userId);

    await this.cookieService.deleteCookie("accessToken");

    console.log("logged out");
  }

  private async validateUserSession(
    UserPayload: UserPayload
  ): Promise<UserPayload> {
    try {
      const currentUser: User | null = await this.userRepository.findById(
        UserPayload.id
      );
      //check if user still exists and is active in database
      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }
      //token check
      const tokenIssuedAt = new Date((UserPayload.iat || 0) * 1000);
      const userLastUpdated = currentUser.updated_at || currentUser.created_at;
      if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
        await this.refreshRepository.deleteAllByUserId(currentUser.id);
        throw new Error(
          "UNAUTHORIZED: User data has been modified. Please re-authenticate."
        );
      }
      return UserPayload;
    } catch (error) {
      cookieStore.delete("accessToken");
      throw error;
    }
  }
  public async requireValidUser(
    UserPayload: UserPayload
  ): Promise<UserPayload> {
    this.validateUserSession(UserPayload);
    try {
      return await this.validateUserSession(UserPayload);
    } catch (error) {
      throw new Error("UNAUTHORIZED: Invalid user session");
    }
  }

  public async requireAdminUser(
    UserPayload: UserPayload
  ): Promise<UserPayload> {
    const currentUser = await this.requireValidUser(UserPayload);
    if (!currentUser.roles.includes("admin")) {
      throw new Error("FORBIDDEN: Admin access required");
    }
    return currentUser;
  }

  public async refreshAccessTokenAction(token: string) {
    if (!token) {
      throw new Error("No token provided");
    } else {
      try {
        const decodedToken = await this.tokenRepository.decodeUserToken(token);

        const refreshToken = await this.refreshRepository.findById(
          decodedToken.id
        );

        if (!refreshToken || refreshToken.expires_at < new Date()) {
          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }
          throw new Error("Refresh token expired");
        }
        //sign new token
        const newAccessToken = await this.tokenRepository.createJWTAccessToken({
          ...decodedToken,
        });

        console.log("COOKIE", newAccessToken);
        this.cookieService.setAccessCookie(newAccessToken);
        //send refresh page order to client
        return newAccessToken;
      } catch (error) {
        throw new Error("Failed to refresh access token: " + error);
      }
    }
  }
}
