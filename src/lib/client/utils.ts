import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ref } from "firebase/storage";
import { storage } from "../../../config/firebase";
import { getBytes } from "firebase/storage";
import { Howl, Howler } from "howler";
import { photoUse, songUse } from "./firebaseActions";
import { Album, Artist, Song, User } from "../shared/types";
import { object } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkUser(user: User) {
  if (!user) {
    return false;
  }
  if (user.email === "") {
    return false;
  }
  if (user.name === "") {
    return false;
  }
  /*if (user.photo_url === "") {
    return false;
  }*/
  if (user.id === "") {
    return false;
  }
  if (Object.is(user.roles, [])) {
    return false;
  }
  return true;
}
