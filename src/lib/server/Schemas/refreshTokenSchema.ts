import { z } from "zod";

export const refreshTokenJWTSchema = z.object({
  id: z.string().cuid(),
  user_id: z.string().cuid(),
  updated_at: z.coerce.date(),
  created_at: z.coerce.date(),
  expires_at: z.coerce.date(),
  refreshCount: z.number().min(0),
  iat: z.coerce.number().transform((val) => new Date(val * 1000)),
  iss: z.string().cuid(),
  exp: z.coerce.number().transform((val) => new Date(val * 1000)),
});

export const refreshTokenDBSchema = z.object({
  id: z.string().cuid(),
  user_id: z.string().cuid(),
  refreshCount: z.number().min(0).default(0),
  expires_at: z.coerce.date(), // Bu da karşılaştırmada EXCLUDE edilecek
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const refreshTokenComparableFieldsSchema = z.object({
  id: z.string().cuid(),
  user_id: z.string().cuid(),
  refreshCount: z.number().min(0),
});

// Full schema with all fields
export const refreshTokenSchema = refreshTokenJWTSchema.merge(
  refreshTokenDBSchema.partial()
);

export type RefreshTokenJWTPayload = z.infer<typeof refreshTokenJWTSchema>;
export type RefreshTokenDB = z.infer<typeof refreshTokenDBSchema>;
export type RefreshTokenComparable = z.infer<
  typeof refreshTokenComparableFieldsSchema
>;
