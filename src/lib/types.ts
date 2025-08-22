// src/app/interfaces/User.ts

import * as jose from "jose";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { GetPayloadResult } from "@prisma/client/runtime/library";
import { Album } from "lucide-react";

export type User = Prisma.UsersGetPayload<{
  include: {
    playlists: {
      include: { playlistSongs: { include: { song: true } } };
    };
  };
}>;

export type Artist = Prisma.ArtistsGetPayload<{
  include: { albums: true; songs: true };
}>; // Databasede author ayrıca photo_url kullanmıyorum photo_name kullanıyorum

export interface UserPayload
  extends jose.JWTPayload,
    Prisma.UsersGetPayload<{
      include: {
        playlists: { include: { playlistSongs: { include: { song: true } } } };
      };
    }> {}

export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles">
>;

export type Albums = Prisma.AlbumsGetPayload<{
  include: { songs: true; artist: true };
}>;
export type Songs = Prisma.SongGetPayload<{
  include: { albums: true; artist: true };
}>;

export type SongCreateFormData = {
  name: string;
  artist_id: string;
  song_url: string;
  albumsId: string;
  photo: string;
  length: number;
};

export type SongUpdateFormData = Partial<
  Pick<
    Songs,
    "name" | "album_id" | "artist_id" | "photo_url" | "song_url" | "length"
  >
>;

export type Album = Prisma.AlbumsGetPayload<{
  include: {
    songs: true;
  };
}>;

export type AlbumUpdateFormData = Pick<
  Album,
  "title" | "artist_id" | "releaseDate" | "photo_url"
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
    playlistSongs: {
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
