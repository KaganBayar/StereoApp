import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ref } from "firebase/storage";
import { storage } from "../../config/firebase";
import { getBytes } from "firebase/storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
