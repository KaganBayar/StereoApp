// src/app/interfaces/User.ts
export interface User {
  id: number;
  name: string;
  email: string;
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
