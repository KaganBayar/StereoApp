import { Prisma } from "@prisma/client";
export type RefreshToken = Prisma.RefreshTokenGetPayload<{}>;

export type RefreshTokenFormData = {
  userId: string;
  token: string;
  expiresAt: Date;
};
