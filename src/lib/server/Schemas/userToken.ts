import zod from "zod";
import { UserPayload } from "@/lib/Types/userTypes";

export const userTokenSchema = zod.object({
  id: zod.string().uuid(),
  email: zod.string().email(),
  name: zod.string().min(2).max(100),
  roles: zod.array(zod.string()),
  photo_url: zod.string().url(),
  playlists: zod.array(zod.any()),
  favorites: zod.array(zod.any()),
  updated_at: zod.coerce.date(),
  created_at: zod.coerce.date(),
  iat: zod.union([zod.number(), zod.string(), zod.date()]),
  iss: zod.string(),
  exp: zod.union([zod.number(), zod.string(), zod.date()]),
});
