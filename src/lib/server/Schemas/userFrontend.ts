import { z } from "zod";

export const UserFrontendSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  photo_url: z.string(),
  roles: z.array(z.string()),
  playlists: z.array(z.any()),
  favorites: z.array(z.any()),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});
