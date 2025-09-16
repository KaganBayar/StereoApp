import { baseType } from "./commonTypes";
import { Prisma } from "@prisma/client";
import { Playlist } from "../Types/playlistTypes";
import jose from "jose";

export type User = baseType &
  Prisma.UserGetPayload<{
    include: {
      playlists: { include: { playlistSongs: { include: { song: true } } } };
    };
  }>;

export type UserFrontend = baseType &
  Omit<User, "password"> & {
    playlists: Playlist[];
  };
//[UPDATE NEEDED] maybe you can adjust its type when you decided to change actions tab
export type UserPayload = baseType &
  jose.JWTPayload &
  Prisma.UserGetPayload<{
    include: {
      playlists: { include: { playlistSongs: { include: { song: true } } } };
    };
  }>;

export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles">
>;
