import { UserRepository } from "../repositories/userRepository";
import { CookieService } from "./cookieService";
import { UserAdminEditForm, UserPayload } from "@/lib/Types/userTypes";
import { CookieServiceInterface } from "./Interfaces/cookieService";
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
  private cookieService: CookieServiceInterface;
  private refreshRepository: RefreshTokenRepository;

  // you can change constructor parameters if you want to allow inject alternative repositories
  constructor(
    userRepository: UserRepository,
    cookieService: CookieServiceInterface,
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
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // If login is successful, generate and return tokens
    const accessToken = await this.tokenRepository.createJWTAccessToken(user);
    await this.refreshRepository.deleteMany(user.id);
    const refreshToken = await this.tokenRepository.createRefreshToken(user.id);

    this.cookieService.setAcessCookie(accessToken);

    return { accessToken, refreshToken };
  }

  public async logout(userId: string): Promise<void> {
    await this.refreshRepository.deleteMany(userId);

    await this.cookieService.deleteCookie("accessToken");

    console.log("logged out");
  }

  public async validateUserSession(): Promise<UserPayload> {
    const accessToken = await this.cookieService.getCookie("accessToken");
    if (!accessToken) {
      throw new Error("UNAUTHORIZED: No access token found");
    }
    try {
      // Verify the JWT token
      //access_token bittiğinde refreshlemiyor
      const verifiedToken: UserPayload =
        await this.tokenRepository.verifyAuthToken(accessToken);

      // Check if user still exists and is active in database
      const currentUser: User | null = await this.userRepository.findById(
        verifiedToken.id
      );

      if (!currentUser) {
        throw new Error("UNAUTHORIZED: User no longer exists");
      }

      // Check if user data has been modified after token was issued
      const tokenIssuedAt = new Date((verifiedToken.iat || 0) * 1000);
      const userLastUpdated = currentUser.updated_at || currentUser.created_at;

      if (userLastUpdated && userLastUpdated > tokenIssuedAt) {
        await prisma.refreshToken.deleteMany({
          where: {
            user_id: currentUser.id,
          },
        });
        throw new Error(
          "UNAUTHORIZED: User data has been modified. Please re-authenticate."
        );
      }

      // Return fresh user data from database instead of token data
      const result: User = { ...currentUser };
      return result;
    } catch (error) {
      cookieStore.delete("accessToken");
      throw error;
    }
  }
  public async requireValidUser(): Promise<UserPayload> {
    try {
      return await this.validateUserSession();
    } catch (error) {
      throw new Error("UNAUTHORIZED: Invalid user session");
    }
  }

  public async requireAdminUser(): Promise<UserPayload> {
    const currentUser = await this.requireValidUser();
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
        this.cookieService.setAcessCookie(newAccessToken);
        //send refresh page order to client
        return newAccessToken;
      } catch (error) {
        throw new Error("Failed to refresh access token: " + error);
      }
    }
  }
}
