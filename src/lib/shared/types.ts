// src/app/interfaces/User.ts

import * as jose from "jose";
import prisma from "../server/db";
import { Prisma } from "@prisma/client";
import { GetPayloadResult } from "@prisma/client/runtime/library";
import { Album } from "lucide-react";

export type User = Prisma.UserGetPayload<{
  include: {
    playlists: {
      include: { playlistSongs: { include: { song: true } } };
    };
  };
}>;

export type Artist = Prisma.ArtistGetPayload<{
  include: { albums: true; songs: true };
}>;

export interface UserPayload
  extends jose.JWTPayload,
    Prisma.UserGetPayload<{
      include: {
        playlists: { include: { playlistSongs: { include: { song: true } } } };
      };
    }> {}

export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles">
>;

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

export type Album = Prisma.AlbumGetPayload<{
  include: {
    songs: true;
    artist: true;
  };
}>;

export type AlbumFormData = Pick<
  Album,
  "title" | "artist_id" | "releaseDate" | "photo_url"
>;

export type ArtistFormData = Pick<
  Artist,
  "name" | "genre" | "bio" | "photo_url"
>;

export type Playlist = Prisma.PlaylistGetPayload<{
  include: {
    playlistSongs: {
      include: {
        song: {
          include: {
            artist: true;
            album: true;
          };
        };
      };
    };
  };
}>;

export type PlaylistSong = Prisma.PlaylistSongGetPayload<{
  include: {
    song: {
      include: {
        artist: true;
        album: true;
      };
    };
  };
}>;
