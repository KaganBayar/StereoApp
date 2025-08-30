"use client";
import { ref } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { getBytes } from "firebase/storage";
import { Album, Artist, Song } from "../shared/types";
import { uploadString, getMetadata } from "firebase/storage";

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

export async function photoGetFile(photo_url: string): Promise<File> {
  try {
    const photoRef = ref(storage, photo_url);

    // Get metadata to detect content type
    const metadata = await getMetadata(photoRef);
    const contentType = metadata.contentType || "application/octet-stream";

    const photo = await getBytes(photoRef);
    const blob = new Blob([photo], { type: contentType });

    // derive extension from contentType if possible
    const extension = contentType.split("/")[1] || "bin";
    return new File([blob], `photo.${extension}`, { type: contentType });
  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
}
async function loadMediaItems<T extends { id: string }, R>(
  items: T[],
  urlExtractor: (item: T) => string | undefined,
  processor: (url: string) => Promise<R>,
  errorMessage: (id: string) => string
): Promise<Record<string, R>> {
  const results: Record<string, R> = {};

  for (const item of items) {
    const url = urlExtractor(item);
    if (url) {
      try {
        const processedItem = await processor(url);
        results[item.id] = processedItem;
      } catch (error) {
        console.error(errorMessage(item.id), error);
        // Intentionally not adding to results on failure
      }
    }
  }

  return results;
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

export class Loader {
  static async loadArtistImages(artistData: Artist[]) {
    return loadMediaItems(
      artistData,
      (artist) => artist.photo_url,
      photoUse,
      (id) => `Failed to load image for artist ${id}:`
    );
  }

  static async loadAlbumImages(albumsData: Album[]) {
    return loadMediaItems(
      albumsData,
      (album) => album.photo_url,
      photoUse,
      (id) => `Failed to load cover image for album ${id}:`
    );
  }

  static async loadSongs(songsData: Song[]) {
    return loadMediaItems(
      songsData,
      (song) => song.song_url,
      songUse,
      (id) => `Failed to load song file for song ${id}:`
    );
  }

  static async loadSongImages(songsData: Song[]) {
    return loadMediaItems(
      songsData,
      (song) => song.photo_url,
      photoUse,
      (id) => `Failed to load photo for song ${id}:`
    );
  }
}

export const uploadDataUrlPhoto = async (dataUrl: string, path: string) => {
  try {
    const imageRef = ref(storage, path);
    const base64 = dataUrl.split(",")[1];
    await uploadString(imageRef, base64, "base64");
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};
