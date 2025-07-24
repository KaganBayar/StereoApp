// src/app/interfaces/User.ts

import * as jose from "jose";
import prisma from "./db";
import { Prisma } from "@prisma/client";
import { GetPayloadResult } from "@prisma/client/runtime/library";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  photo: string;
  playlists: Playlists[];
  created_at: Date | null;
  updated_at: Date | null;
}

export interface UserAdminEditForm {
  name: string;
  email: string;
  roles: string[];
}

export type Artist = Prisma.AuthorGetPayload<{
  include: { albums: true; songs: true };
}>;

export type Albums = Prisma.AlbumsGetPayload<{
  include: { song: true };
}>;
export interface UserPayload extends jose.JWTPayload {
  userId: string;
  email: string;
  name: string;
  photo: string;
  roles: string[];
  playlists?: Playlists[];
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Song {
  id: number;
  title: string;
  albumId: number;
  artistId: number;
  duration: number; // duration in seconds
}
export interface Playlists {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  created_at: Date;
  photo: string;
}

export interface refreshPageOrder {
  success: true;
  action: "refresh";
}

export interface demandLoginOrder {
  success: false;
  action: "login";
}
