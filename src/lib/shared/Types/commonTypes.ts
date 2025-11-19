import { Album, AlbumFormData } from "./albumTypes";
import { Artist, ArtistFormData } from "./artistTypes";
import { Song, SongFormData } from "./songTypes";
import { User, UserAdminEditForm } from "./userTypes";
import { Playlist, PlaylistFormData } from "./playlistTypes";
import { RefreshToken, RefreshTokenFormData } from "./refreshTokenTypes";

import prisma from "@/lib/server/db";

export type baseType = {
  id: string;
  created_at: Date;
  updated_at: Date;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TypeList = Song | Album | Artist | Playlist | User | RefreshToken;

export type formDataList =
  | SongFormData
  | AlbumFormData
  | ArtistFormData
  | UserAdminEditForm
  | PlaylistFormData
  | RefreshTokenFormData;

export type modelList =
  | typeof prisma.song
  | typeof prisma.album
  | typeof prisma.artist
  | typeof prisma.user;

export enum time {
  MILISECOND = 1,
  SECOND = 1000,
  MINUTE = 60000,
  HOUR = 3600000,
  DAY = 86400000,
  WEEK = 604800000,
  MONTH = 2592000000,
  YEAR = 31536000000,
}
