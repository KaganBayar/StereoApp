// src/app/interfaces/User.ts

import * as jose from "jose";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { GetPayloadResult } from "@prisma/client/runtime/library";

export type User = Prisma.UsersGetPayload<{
  include: {
    playlists: {
      include: { PlaylistSong: { include: { song: true } } };
    };
  };
}>;

export type Artist = Prisma.AuthorGetPayload<{
  include: { albums: true; songs: true };
}>; // Databasede author ayrıca photo_url kullanmıyorum photo_name kullanıyorum

export interface ArtistFormData {
  name: string;
  genre: string;
  bio?: string;
  photo_url?: string;
}

export interface UserPayload
  extends jose.JWTPayload,
    Prisma.UsersGetPayload<{
      include: {
        playlists: { include: { PlaylistSong: { include: { song: true } } } };
      };
    }> {}

export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo" | "roles">
>;

export type Albums = Prisma.AlbumsGetPayload<{
  include: { song: true };
}>;
export type Songs = Prisma.SongGetPayload<{}>;

export type SongCreateFormData = {
  name: string;
  author_id: string;
  song_url: string;
  albumsId: string;
  photo: string;
  length: number;
};

export type SongUpdateFormData = Partial<
  Pick<
    Songs,
    "name" | "albumsId" | "author_id" | "photo" | "song_url" | "length"
  >
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
  cover_url: string;
};
export type ArtistUpdateFormData = Partial<
  Pick<Artist, "name" | "genre" | "bio" | "photo_url">
>;

export type ArtistCreateFormData = {
  name: string;
  genre: string;
  bio: string;
  photo_url: string;
};

export type Playlists = Prisma.PlaylistGetPayload<{
  include: {
    PlaylistSong: {
      include: {
        song: true;
      };
    };
  };
}>;

export type PlaylistSong = Prisma.PlaylistSongGetPayload<{
  include: {
    song: true;
    playlist: true;
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
