import { BaseRepository } from "./baseRepository";
import {
  RefreshToken,
  RefreshTokenFormData,
} from "@/lib/Types/refreshTokenTypes";
import prisma from "@/lib/server/db";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  protected model = prisma.refreshToken;
  protected baseOptions = {};
}
