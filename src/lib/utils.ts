import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { getBytes } from "firebase/storage";
import { Howl, Howler } from "howler";
import { photoUse, songUse } from "./firebaseActions";
import { Album, Artist, Songs } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
