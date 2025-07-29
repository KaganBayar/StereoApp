// src/app/interfaces/User.ts

import * as jose from "jose";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { GetPayloadResult } from "@prisma/client/runtime/library";

export type User = Prisma.UsersGetPayload<{
  include: { playlists: true };
}>;

export type Artist = Prisma.AuthorGetPayload<{
  include: { albums: true; songs: true };
}>;

export interface ArtistFormData {
  name: string;
  genre: string;
  bio?: string;
  photo_url?: string;
}

export interface UserPayload
  extends jose.JWTPayload,
    Prisma.UsersGetPayload<{
      include: { playlists: true };
    }> {}

export type Albums = Prisma.AlbumsGetPayload<{
  include: { song: true };
}>;
export type Songs = Prisma.SongGetPayload<{}>;

export type SongCreateFormData = {
  name: string;
  url: string;
  author_id: string;
  length: number;
  playlist_id: string;
  albumsId?: string; // bu optional olmayacak frontend implemantasyonu olduğunda soru işaretini kaldır
  photo?: string; // bu optional olmayacak frontend implemantasyonu olduğunda soru işaretini kaldır
};

export type SongUpdateFormData = Partial<
  Pick<Songs, "name" | "url" | "length" | "photo">
>;
export type Album = Prisma.AlbumsGetPayload<{
  include: {
    song: true;
  };
}>;

export type AlbumUpdateFormData = Partial<
  Pick<Album, "title" | "artistId" | "releaseDate" | "cover_url">
>;

export type AlbumCreateFormData = {
  title: string;
  artistId: string;
  releaseDate: Date;
  cover_url?: string; // bu optional olmayacak frontend implemantasyonu olduğunda soru işaretini kaldır
};
export type ArtistUpdateFormData = Partial<
  Pick<Artist, "name" | "genre" | "bio" | "photo_url">
>;

export type ArtistCreateFormData = {
  name: string;
  genre: string;
  bio?: string; // bu optional olmayacak frontend implemantasyonu olduğunda soru işaretini kaldır
  photo_url?: string; // bu optional olmayacak frontend implemantasyonu olduğunda soru işaretini kaldır
};

export type Playlists = Prisma.PlaylistGetPayload<{
  include: {
    Song: true;
  };
}>;

export interface refreshPageOrder {
  success: true;
  action: "refresh";
}

export interface demandLoginOrder {
  success: false;
  action: "login";
}
