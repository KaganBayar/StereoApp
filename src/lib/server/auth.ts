import * as jose from "jose";
import { Playlist } from "@/lib/Types/playlistTypes";
import { UserFrontend, UserPayload } from "@/lib/Types/userTypes";
import { CookieService } from "./layers/services/cookieService";
import { userTokenSchema } from "./Schemas/userToken";
import { AuthService } from "./layers/services/authService";
import crypto from "crypto";
import bcrypt from "bcrypt";
import prisma from "./db";
import { RefreshTokenRepository } from "./layers/repositories/refreshTokenRepository";
import { time } from "../Types/commonTypes";

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function signToken(obj: UserPayload) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const jwt = await new jose.SignJWT(obj)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(obj.id)
    .setExpirationTime("20m")
    .sign(secret);
  return jwt;
}
export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
