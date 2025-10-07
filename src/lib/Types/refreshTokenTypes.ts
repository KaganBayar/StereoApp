import z from "zod";
import { refreshTokenSchema } from "../server/Schemas/refreshTokenSchema";
import { Prisma } from "@prisma/client";
export type RefreshToken = Prisma.RefreshTokenGetPayload<{}>;

export type RefreshTokenFormData = {
  userId: string;
  token: string;
  expiresAt: Date;
};

export type RefreshTokenPayload = RefreshToken &
  z.infer<typeof refreshTokenSchema>;
