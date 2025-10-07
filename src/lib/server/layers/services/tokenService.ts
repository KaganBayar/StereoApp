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
import { refreshTokenSchema } from "../../Schemas/refreshTokenSchema";
import { RefreshTokenPayload } from "@/lib/Types/refreshTokenTypes";
import { distillUserToFrontend } from "../../auth";

export class TokenServices {
  private readonly JWT_ACCESS_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET_KEY
  );
  private readonly JWT_REFRESH_SECRET = new TextEncoder().encode(
    process.env.JWT_REFRESH_KEY
  );
  private userRepository: UserRepository;
  private cookieService: CookieService;
  private refreshRepository: RefreshTokenRepository;

  constructor(
    userRepository: UserRepository,
    cookieService: CookieService,
    refreshRepository: RefreshTokenRepository
  ) {
    this.userRepository = userRepository;
    this.cookieService = cookieService;
    this.refreshRepository = refreshRepository;
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
      .sign(this.JWT_ACCESS_SECRET);
    return jwt;
  }

  public async createJWTAccessToken(obj: UserFrontend): Promise<string> {
    const jwt = await new jose.SignJWT(obj)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(obj.id)
      .setExpirationTime("20m")
      .sign(this.JWT_ACCESS_SECRET);
    return jwt;
  }

  public async createJWTRefreshToken(userId: string) {
    const refreshToken = await new jose.SignJWT({ user_id: userId })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer(userId)
      .setExpirationTime("30d")
      .sign(this.JWT_REFRESH_SECRET);
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
    const userToken = userTokenSchema.parse(decoded); // Validate the decoded token
    return userToken as UserPayload;
  }
  //access Token verification
  public async verifyAuthToken(token: string): Promise<UserPayload> {
    if (!token) {
      throw new Error("Token is required for verification");
    } else {
      try {
        // Verify the token
        const verifiedToken = await jose.jwtVerify(
          token,
          this.JWT_ACCESS_SECRET,
          {
            algorithms: ["HS256"],
          }
        );
        // Extract and validate the payload
        const tokenPayload = verifiedToken.payload;
        const UserPayload = userTokenSchema.parse(tokenPayload) as UserPayload; // Validate the decoded token

        console.log("VERIFIED");
        return UserPayload;
      } catch (e) {
        await this.cookieService.deleteCookie("accessToken");
        throw new Error("Access Token verification failed: " + e);
      }
    }
  }

  //refresh Token verification

  public async verifyRefreshToken(token: string): Promise<RefreshTokenPayload> {
    try {
      const verifiedToken = await jose.jwtVerify(
        token,
        this.JWT_REFRESH_SECRET,
        {
          algorithms: ["HS256"],
        }
      );
      const tokenPayload = verifiedToken.payload;
      const refreshToken = refreshTokenSchema.parse(tokenPayload);
      //database check
      const storedToken = await this.refreshRepository.findByUserId(
        refreshToken.id
      );
      if (token !== storedToken?.token) {
        throw new Error("Refresh token does not match stored token");
      }
      return refreshToken as RefreshTokenPayload;
    } catch (e) {
      await this.cookieService.deleteRefreshCookie();
      throw new Error("Refresh Token verification failed: " + e);
    }
  }

  public async refreshAccessToken(): Promise<string> {
    try {
      const refreshToken = await this.cookieService.getRefreshCookie();
      if (!refreshToken) {
        throw new Error("No refresh token provided");
      }
      const verifiedRefreshToken = await this.verifyRefreshToken(refreshToken);
      if (
        !verifiedRefreshToken ||
        verifiedRefreshToken.expires_at < new Date()
      ) {
        if (!verifiedRefreshToken) {
          throw new Error("Refresh token not found");
        }
        throw new Error("Refresh token expired");
      }
      //get user info
      const user = await this.userRepository.findById(
        verifiedRefreshToken.user_id
      );
      if (!user) {
        throw new Error("User not found for the given refresh token");
      }
      //delete all cookies and tokens
      this.cookieService.deleteAccessCookie();
      this.cookieService.deleteRefreshCookie();
      this.refreshRepository.deleteAllByUserId(user.id);
      //get user frontend data
      const userFrontend = distillUserToFrontend(user);
      //sign new Access token
      const newAccessToken = await this.createJWTAccessToken(userFrontend);
      //sign new Refresh token
      const newRefreshToken = await this.createJWTRefreshToken(user.id);

      //cookie set
      console.log("COOKIE", newAccessToken);

      await this.cookieService.setAccessCookie(newAccessToken);
      await this.cookieService.setRefreshCookie(newRefreshToken.token);
      return newAccessToken;
    } catch (error) {
      throw new Error("Failed to refresh access token: " + error);
    }
  }
}
