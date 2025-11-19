import { Prisma } from "@prisma/client";

export type Song = Prisma.SongGetPayload<{
  include: { album: true; artist: true };
}>;

export type SongFormData = Pick<
  Song,
  | "name"
  | "album_id"
  | "artist_id"
  | "photo_url"
  | "song_url"
  | "length"
  | "genre"
  | "releaseDate"
>;
