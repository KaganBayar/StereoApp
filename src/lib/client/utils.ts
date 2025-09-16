import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ref } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { getBytes } from "firebase/storage";
import { Howl, Howler } from "howler";
import { photoUse, songUse } from "./firebaseActions";
import { Album } from "../Types/albumTypes";
import { Artist } from "../Types/artistTypes";
import { Song } from "../Types/songTypes";
import { User } from "../Types/userTypes";

import { object } from "zod";
import { UserFrontend } from "../Types/userTypes";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkUser(user: UserFrontend | null): boolean {
  if (!user) {
    return false;
  }
  if (user.id === "") {
    return false;
  }
  return true;
}
