import { baseType } from "./commonTypes";
import { Prisma } from "@prisma/client";
import { Playlist } from "./playlistTypes";
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

// access_tokeni nasıl signladığına bağlı tipi değişir
export type UserPayload = UserFrontend & { iat: Date; iss: string; exp: Date };
//i should also pick password here. but not now
export type UserAdminEditForm = Partial<
  Pick<User, "name" | "email" | "photo_url" | "roles"> & { password?: string }
>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
