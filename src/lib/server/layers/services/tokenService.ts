import { UserRepository } from "../repositories/userRepository";
import { CookieService } from "./cookieService";
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { CookieServiceInterface } from "./Interfaces/cookieService";
import * as jose from "jose";
import { UserFrontend, UserPayload } from "@/lib/Types/userTypes";
import { time } from "@/lib/Types/commonTypes";
import crypto from "crypto";
import { userTokenSchema } from "../../Schemas/userToken";

export class TokenServices {
  private readonly JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET_KEY
  );
  private userRepository: UserRepository;
  private cookieService: CookieServiceInterface;
  private refreshRepository: RefreshTokenRepository;

  constructor(
    userRepository: UserRepository,
    cookieService: CookieServiceInterface,
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

  public async createRefreshToken(userId: string) {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    const createdToken = await this.refreshRepository.create({
      token: refreshToken,
      userId: userId,
      expiresAt: new Date(Date.now() + time.MONTH), // 30 days
    });
    return createdToken;
  }

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
        userTokenSchema.parse(tokenPayload); // Validate the decoded token
        console.log("VERIFIED");
        return tokenPayload as UserPayload;
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
          throw new Error("Token verification failed: " + e);
        }
      }
    }
  }
  public async refreshAccessToken(token: string): Promise<string> {
    if (!token) {
      throw new Error("No token provided");
    } else {
      try {
        const decodedToken = await this.decodeUserToken(token);

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

        userTokenSchema.parse(decodedToken);

        const newAccessToken = await this.createJWTAccessToken(decodedToken);

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
