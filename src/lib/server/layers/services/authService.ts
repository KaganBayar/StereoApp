import { UserRepository } from "../repositories/userRepository";
import { UserAdminEditForm } from "@/lib/shared/Types/userTypes";
import {
  comparePassword,
  distillUserToFrontend,
  hashPassword,
} from "../../auth";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { TokenServices } from "./tokenService";
export class AuthService {
  private tokenRepository: TokenServices;
  private userRepository: UserRepository;
  private refreshRepository: RefreshTokenRepository;

  // you can change constructor parameters if you want to allow inject alternative repositories
  constructor(
    userRepository: UserRepository,
    refreshRepository: RefreshTokenRepository,
    tokenRepository: TokenServices
  ) {
    this.userRepository = userRepository;
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

    //send only useful user data
    const userFrontend = distillUserToFrontend(user);

    // If login is successful, generate and return tokens
    const accessToken = await this.tokenRepository.createJWTAccessToken(
      userFrontend
    );

    await this.refreshRepository.deleteAllByUserId(user.id); // Invalidate existing refresh tokens
    const refreshToken = await this.tokenRepository.createJWTRefreshToken(
      user.id
    );

    return {
      user: userFrontend,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  public async logout(userId: string): Promise<void> {
    await this.refreshRepository.deleteAllByUserId(userId);
  }
}
