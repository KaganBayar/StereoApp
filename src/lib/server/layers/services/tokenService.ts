import { UserRepository } from "../repositories/userRepository";
import { CookieService } from "./cookieService";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";

import * as jose from "jose";
import { User, UserFrontend, UserPayload } from "@/lib/Types/userTypes";
import { time } from "@/lib/Types/commonTypes";
import crypto from "crypto";
import { userTokenSchema } from "../../Schemas/userToken";
import { RefreshToken } from "@/lib/Types/refreshTokenTypes";
import { AuthService } from "./authService";

export class TokenServices {
  private readonly JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET_KEY
  );
  private userRepository: UserRepository;
  private cookieService: CookieService;
  private refreshRepository: RefreshTokenRepository;
  private authService: AuthService;

  constructor(
    userRepository: UserRepository,
    cookieService: CookieService,
    refreshRepository: RefreshTokenRepository,
    authService: AuthService
  ) {
    this.userRepository = userRepository;
    this.cookieService = cookieService;
    this.refreshRepository = refreshRepository;
    this.authService = authService;
  }
  public async signToken(
    obj: { id: string },
    exp: string /*[UPDATE NEEDED] string type is wrong it should constraint more */
  ): Promise<string> {
    const jwt = await new jose.SignJWT(obj)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(obj.id)
      .setExpirationTime(exp)
      .sign(this.JWT_SECRET);
    return jwt;
  }

  public async createJWTAccessToken(obj: UserFrontend): Promise<string> {
    const jwt = await new jose.SignJWT(obj)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(obj.id)
      .setExpirationTime("20m")
      .sign(this.JWT_SECRET);
    return jwt;
  }

  public async createJWTRefreshToken(userId: string) {
    const refreshToken = await new jose.SignJWT({ user_id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(userId)
      .setExpirationTime("30d")
      .sign(this.JWT_SECRET);
    const createdToken = await this.refreshRepository.create({
      token: refreshToken,
      user_id: userId,
      expires_at: new Date(Date.now() + time.MONTH), // 30 days
    });
    return createdToken;
  }

  public deleteAllUsersRefreshTokens = async (userId: string) => {
    await this.refreshRepository.deleteAllByUserId(userId);
  };

  public async decodeUserToken(token: string): Promise<UserPayload> {
    const decoded = jose.decodeJwt(token);
    userTokenSchema.parse(decoded); // Validate the decoded token
    return decoded as UserPayload;
  }

  public async verifyAuthToken(token: string): Promise<UserPayload> {
    if (!token) {
      throw new Error("Token is required for verification");
    } else {
      try {
        const verifiedToken = await jose.jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_SECRET_KEY),
          {
            algorithms: ["HS256"],
          }
        );
        const tokenPayload = verifiedToken.payload;
        const UserPayload = userTokenSchema.parse(tokenPayload) as UserPayload; // Validate the decoded token
        const refreshToken = await this.refreshRepository.findByUserId(
          UserPayload.id
        );
        if (!refreshToken) {
          throw new Error("Refresh token not found for user");
        }

        console.log("VERIFIED");
        return UserPayload;
      } catch (e) {
        if (e instanceof jose.errors.JWTExpired) {
          try {
            //bu refreshi burada mı yapsam emin değilim
            const newAccessToken = await this.refreshAccessToken(token);
            const tokenPayload = await this.decodeUserToken(newAccessToken);
            userTokenSchema.parse(tokenPayload);
            return tokenPayload;
          } catch (error) {
            throw new Error("Failed to refresh access token: " + error);
          }
        } else {
          this.cookieService.deleteCookie("accessToken");
          throw new Error("Access Token verification failed: " + e);
        }
      }
    }
  }
  //dont use in client
  public async findRefreshTokenByUserId(
    UserPayload: UserPayload,
    user_id: string
  ): Promise<RefreshToken | null> {
    await this.authService.requireAdminUser(UserPayload);
    return this.refreshRepository.findByUserId(user_id);
  }

  public async refreshAccessToken(token: string): Promise<string> {
    if (!token) {
      throw new Error("No token provided");
    } else {
      try {
        const decodedToken = await this.decodeUserToken(token);

        const refreshToken = await this.refreshRepository.findByUserId(
          decodedToken.id
        );

        if (!refreshToken || refreshToken.expires_at < new Date()) {
          if (!refreshToken) {
            throw new Error("Refresh token not found");
          }
          throw new Error("Refresh token expired");
          //sign new token
        }

        userTokenSchema.parse(decodedToken);

        const newAccessToken = await this.createJWTAccessToken(decodedToken);

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
