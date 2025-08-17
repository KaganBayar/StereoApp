import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { getBytes } from "firebase/storage";
import { Howl, Howler } from "howler";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Howl({
      src: [URL.createObjectURL(file)],
      format: ["mp3"],
      onload: () => {
        resolve(Math.floor(audio.duration()));
      },
      onloaderror: (error) => {
        reject(error);
      },
    });
  });
}
