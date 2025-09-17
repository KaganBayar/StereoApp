import { baseType } from "./commonTypes";
import { Prisma } from "@prisma/client";
import { Playlist } from "../Types/playlistTypes";
import jose from "jose";

export type UserBase = Prisma.UserGetPayload<{ include: { playlists: true } }>;

export type User = Prisma.UserGetPayload<{
  include: {
    playlists: { include: { playlistSongs: { include: { song: true } } } };
  };
}>;

export type UserFrontend = Omit<User, "password"> & {
  playlists: Playlist[];
};

export type UserPayload = jose.JWTPayload &
  Prisma.UserGetPayload<{
    include: {
      playlists: { include: { playlistSongs: { include: { song: true } } } };
    };
  }>;

export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles">
>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
