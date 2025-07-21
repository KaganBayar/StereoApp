// src/app/interfaces/User.ts

import * as jose from "jose";

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  photo: string;
  playlists: Playlists[];
  created_at: Date | null;
  updated_at: Date | null;
} //initialState Kullananları bi ara buna çevir

export interface UserPayload extends jose.JWTPayload {
  userId: string;
  email: string;
  name: string;
  photo: string;
  roles: string[];
  playlists?: Playlists[];
}

export interface Album {
  id: number;
  title: string;
  artistId: number;
  releaseDate: Date;
}

export interface Artist {
  id: number;
  name: string;
  genre: string;
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
