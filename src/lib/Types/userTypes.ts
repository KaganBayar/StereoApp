import { baseType } from "./commonTypes";
import { Prisma } from "@prisma/client";
import { Playlist } from "../Types/playlistTypes";
import jose from "jose";

export type UserBase = Prisma.UserGetPayload<{
  include: { playlists: true; favorites: true };
}>;

export type User = Prisma.UserGetPayload<{
  include: {
    playlists: { include: { playlistSongs: { include: { song: true } } } };
    favorites: { include: { song: true } };
  };
}>;

export type UserFrontend = Omit<User, "password">;

export type UserPayload = jose.JWTPayload & UserFrontend;
export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles">
>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
