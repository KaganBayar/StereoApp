import { Prisma } from "@prisma/client";

export type Artist = Prisma.ArtistGetPayload<{
  include: { albums: true; songs: true };
}>;

export type ArtistFormData = Pick<
  Artist,
  "name" | "genre" | "bio" | "photo_url"
>;
