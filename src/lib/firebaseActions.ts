"use client";
import { ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { getBytes } from "firebase/storage";

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
