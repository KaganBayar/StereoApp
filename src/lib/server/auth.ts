import * as jose from "jose";
import { Playlist } from "@/lib/shared/Types/playlistTypes";
import { UserFrontend, UserPayload } from "@/lib/shared/Types/userTypes";
import { userTokenSchema } from "./Schemas/userToken";
import { AuthService } from "./layers/services/authService";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "./db";
import { RefreshTokenRepository } from "./layers/repositories/refreshTokenRepository";
import { time } from "../shared/Types/commonTypes";
import { container } from "./DI_container/container";
import { UserFrontendSchema } from "./Schemas/userFrontend";
import { User } from "../shared/Types/userTypes";
import {
  RefreshTokenJWTPayload,
  RefreshTokenDB,
} from "./Schemas/refreshTokenSchema";

export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export function disstillUserPayloadToFrontend(
  UserPayload: UserPayload
): UserFrontend {
  const aa = UserFrontendSchema.transform(() => {
    const { iss, iat, exp, ...UserFrontend } = UserPayload;
    return UserFrontend;
  })
    .pipe(UserFrontendSchema)
    .parse(UserPayload);

  return aa as UserFrontend;
}

export function distillUserToFrontend(User: User): UserFrontend {
  const { password, ...userFrontend } = User;
  return userFrontend as UserFrontend;
}
//legacy
export async function signToken(obj: UserFrontend) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);

  const jwt = await new jose.SignJWT(obj)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(obj.id)
    .setExpirationTime("20h") //temporary
    .sign(secret);
  return jwt;
}

export async function compareRefreshTokenJWTPayloadWithDB(
  jwtRefreshToken: RefreshTokenJWTPayload,
  dbRefreshToken: RefreshTokenDB
): Promise<boolean> {
  if (
    jwtRefreshToken.refreshCount !== dbRefreshToken.refreshCount &&
    jwtRefreshToken.user_id !== dbRefreshToken.user_id &&
    jwtRefreshToken.id !== dbRefreshToken.id
  ) {
    return false;
  }
  return true;
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
