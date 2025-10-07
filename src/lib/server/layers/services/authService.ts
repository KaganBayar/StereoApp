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
    this.cookieService.setRefreshCookie(refreshToken.token);

    return { accessToken, refreshToken };
  }

  public async logout(userId: string): Promise<void> {
    await this.refreshRepository.deleteAllByUserId(userId);

    await this.cookieService.deleteCookie("accessToken");

    console.log("logged out");
  }
}
