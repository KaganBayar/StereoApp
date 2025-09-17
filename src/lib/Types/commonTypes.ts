import { Album, AlbumFormData } from "./albumTypes";
import { Artist, ArtistFormData } from "./artistTypes";
import { Song, SongFormData } from "./songTypes";
import { User, UserAdminEditForm } from "./userTypes";
import { Playlist } from "./playlistTypes";
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

export type TypeList = Song | Album | Artist | Playlist | User;
export type formDataList =
  | SongFormData
  | AlbumFormData
  | ArtistFormData
  | UserAdminEditForm;

export type modelList =
  | typeof prisma.song
  | typeof prisma.album
  | typeof prisma.artist
  | typeof prisma.user;
