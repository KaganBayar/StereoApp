"use client";
import { ref } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { getBytes } from "firebase/storage";
import { Album, Artist, Songs } from "../shared/types";
export async function photoUse(photo_url: string): Promise<string> {
  try {
    const photoRef = ref(storage, photo_url);
    const photo = await getBytes(photoRef);
    //turn photo to data:URL Base64
    const base64 = btoa(
      new Uint8Array(photo).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ""
      )
    );

    return `data:image/jpeg;base64,${base64}`;
  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
}

export async function songUse(song_url: string): Promise<File> {
  try {
    const songRef = ref(storage, song_url);
    const song = await getBytes(songRef);
    const blob = new Blob([song], { type: "audio/mpeg" });
    return new File([blob], "song.mp3", { type: "audio/mpeg" });
  } catch (error) {
    console.error("Error fetching song:", error);
    throw error;
  }
}

export const loadAuthorImages = async (authorsData: Artist[]) => {
  const newAuthorImages: { [key: string]: string } = {};

  for (const author of authorsData) {
    if (author.photo_url) {
      try {
        const imageUrl = await photoUse(author.photo_url);
        newAuthorImages[author.id] = imageUrl;
      } catch (error) {
        console.error(`Failed to load image for author ${author.id}:`, error);
        // Don't add to newAuthorImages if failed, will use placeholder
      }
    }
  }

  return newAuthorImages;
};

export const loadAlbumImages = async (albumsData: Album[]) => {
  const newAlbumImages: { [key: string]: string } = {};

  for (const album of albumsData) {
    if (album.cover_url) {
      try {
        // Use photoUse function to get image data URL from Firebase
        const imageUrl = await photoUse(album.cover_url);
        newAlbumImages[album.id] = imageUrl;
      } catch (error) {
        console.error(
          `Failed to load cover image for album ${album.id}:`,
          error
        );
        // Don't add to newAlbumImages if failed, will use placeholder
      }
    }
  }
  return newAlbumImages;
};

export const loadSongs = async (songsData: Songs[]) => {
  const newSongs: { [key: string]: File } = {};

  for (const song of songsData) {
    if (song.song_url) {
      try {
        const songFile = await songUse(song.song_url);
        newSongs[song.id] = songFile;
      } catch (error) {
        console.error(`Failed to load song file for song ${song.id}:`, error);
      }
    }
  }

  return newSongs;
};

export const loadSongImages = async (songsData: Songs[]) => {
  const newSongImages: { [key: string]: string } = {};

  for (const song of songsData) {
    if (song.photo) {
      try {
        const imageUrl = await photoUse(song.photo);
        newSongImages[song.id] = imageUrl;
      } catch (error) {
        console.error(`Failed to load photo for song ${song.id}:`, error);
      }
    }
  }

  return newSongImages;
};
