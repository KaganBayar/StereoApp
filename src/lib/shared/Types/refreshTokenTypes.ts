import z from "zod";
import { refreshTokenSchema } from "../../server/Schemas/refreshTokenSchema";
import { Prisma } from "@prisma/client";
export type RefreshToken = Prisma.RefreshTokenGetPayload<{}>;

export type RefreshTokenFormData = {
  user_id: string;
  expires_at: Date;
};
