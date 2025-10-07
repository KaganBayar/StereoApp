import { z } from "zod";

export const refreshTokenSchema = z.object({
  id: z.string().cuid(),
  token: z.string(),
  userId: z.string().cuid(),
  expires_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  created_at: z.coerce.date(),
  refreshCount: z.number().min(0),
  iat: z.coerce.number().transform((val) => new Date(val * 1000)),
  iss: z.string().cuid(),
  exp: z.coerce.number().transform((val) => new Date(val * 1000)),
});
