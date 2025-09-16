import { baseType } from "./commonTypes";
import { Prisma } from "@prisma/client";

export type Album = baseType &
  Prisma.AlbumGetPayload<{
    include: {
      songs: true;
      artist: true;
    };
  }>;

export type AlbumFormData = Pick<
  Album,
  "title" | "artist_id" | "releaseDate" | "photo_url"
>;
