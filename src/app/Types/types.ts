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

export interface Playlist {
  id: number;
  title: string;
  userId: User["id"];
  Song: Song[];
  PlaylistPhoto: string;
  PlaylistDescription: string;
}
