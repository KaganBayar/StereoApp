import zod from "zod";
import { UserPayload } from "@/lib/Types/userTypes";

export const userTokenSchema = zod.object({
  id: zod.string().cuid(),
  email: zod.string().email(),
  name: zod.string().min(2).max(100),
  roles: zod.array(zod.string()),
  photo_url: zod.string().optional(), // temporary optional
  playlists: zod.array(zod.any()),
  favorites: zod.array(zod.any()),
  updated_at: zod.coerce.date(),
  created_at: zod.coerce.date(),
  iat: zod.coerce.number().transform((val) => new Date(val * 1000)),
  iss: zod.string().cuid(),
  exp: zod.coerce.number().transform((val) => new Date(val * 1000)),
});
