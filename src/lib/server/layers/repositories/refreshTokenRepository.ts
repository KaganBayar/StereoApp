import { BaseRepository } from "./baseRepository";
import {
  RefreshToken,
  RefreshTokenFormData,
} from "@/lib/shared/Types/refreshTokenTypes";
import prisma from "@/lib/server/db";

export class RefreshTokenRepository extends BaseRepository<RefreshToken> {
  protected model = prisma.refreshToken;
  protected baseOptions = {};
  async deleteAllByUserId(user_id: string): Promise<void> {
    await this.model.deleteMany({ where: { user_id }, ...this.baseOptions });
  }
  async findByUserId(user_id: string): Promise<RefreshToken | null> {
    return await this.model.findFirst({
      where: { user_id },
      ...this.baseOptions,
    });
  }
}
